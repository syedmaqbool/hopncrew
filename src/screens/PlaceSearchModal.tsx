// src/screens/PlaceSearchModal.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FONTS } from '../../src/theme/fonts';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceSearch'>;

/** TODO: move to env/secure storage */
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicmFmYXlhc2FkMDEiLCJhIjoiY21oazdxanQwMDR5cTJrc2NiZGZiZ3phMyJ9.beHDnNh5y6l-9ThZ1TR64A';

type Dest = {
  latitude: number;
  longitude: number;
  description: string;
  placeId: string;
};

type SearchResult = Dest & {
  subtitle?: string;
};

type Recent = Dest & { savedAt: number };

const MAX_RECENTS = 8;
const STORAGE_KEY_DEFAULT = '@place_search_recents';

const SUGGESTION_CHIPS = [
  // For Mapbox we'll use these as categories
  { key: 'airport', label: 'Airports', type: 'airport' },
  { key: 'hotel', label: 'Hotels', type: 'hotel' },
  { key: 'restaurant', label: 'Restaurants', type: 'restaurant' },
  { key: 'mall', label: 'Malls', type: 'mall' },
  { key: 'hospital', label: 'Hospitals', type: 'hospital' },
];

export default function PlaceSearchModal({ navigation, route }: Props) {
  const [recents, setRecents] = useState<Recent[]>([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [searchType, setSearchType] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Optional: bias nearby search results if provided by caller
  const origin = route.params?.origin;
  const recentsKey = route.params?.recentsKey || STORAGE_KEY_DEFAULT;

  const inputProps: Partial<TextInput['props']> = {
    placeholderTextColor: '#6B7280',
    onFocus: () => setInputFocused(true),
    onBlur: () => setInputFocused(false),
    returnKeyType: 'search',
    autoCorrect: false,
    autoCapitalize: 'none',
  };

  // Load recents
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(recentsKey);
        if (!raw) {
          setRecents([]);
          return;
        }
        const parsed = JSON.parse(raw);
        setRecents(Array.isArray(parsed) ? (parsed as Recent[]) : []);
        if (!Array.isArray(parsed)) {
          await AsyncStorage.removeItem(recentsKey);
        }
      } catch {
        await AsyncStorage.removeItem(recentsKey);
        setRecents([]);
      }
    })();
  }, [recentsKey]);

  const saveRecent = async (d: Dest) => {
    try {
      if (!d || typeof d.placeId !== 'string') return;
      setRecents(prev => {
        const base: Recent[] = Array.isArray(prev) ? prev : [];
        const now = Date.now();
        const next: Recent[] = [{ ...d, savedAt: now }];
        for (let i = 0; i < base.length && next.length < MAX_RECENTS; i++) {
          const r = base[i];
          if (r && r.placeId !== d.placeId) next.push(r);
        }
        AsyncStorage.setItem(recentsKey, JSON.stringify(next)).catch(() => {});
        return next;
      });
    } catch {
      // ignore
    }
  };

  const clearRecents = async () => {
    try {
      await AsyncStorage.removeItem(recentsKey);
    } finally {
      setRecents([]);
    }
  };

  const handlePick = async (d: Dest) => {
    await saveRecent(d);
    route.params?.onPick?.(d);
    navigation.goBack();
  };

  const renderRecent = ({ item }: { item: Recent }) => (
    <Pressable style={styles.recentRow} onPress={() => handlePick(item)}>
      <View style={styles.recentIconWrap}>
        <Ionicons name="time-outline" size={18} color="#111" />
      </View>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.recentTitle}>
          {item.description}
        </Text>
        <Text style={styles.recentSub}>Saved</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#999" />
    </Pressable>
  );

  // Mapbox search effect (debounced)
useEffect(() => {
  if (!query || query.trim().length < 2) {
    setResults([]);
    return;
  }

  let cancelled = false;
  const controller = new AbortController();

  const run = async () => {
    try {
      setLoading(true);

      const encodedQuery = encodeURIComponent(query.trim());
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json`,
      );

      url.searchParams.set('access_token', MAPBOX_ACCESS_TOKEN);
      url.searchParams.set('autocomplete', 'true');
      url.searchParams.set('limit', '10');
      url.searchParams.set('language', 'en');
      // include more fine-grained types to get better results
      url.searchParams.set(
        'types',
        'country,region,place,locality,neighborhood,poi,address',
      );

      if (origin) {
        // Mapbox wants proximity as lon,lat
        url.searchParams.set(
          'proximity',
          `${origin.longitude},${origin.latitude}`,
        );
      }

      if (searchType) {
        // Use categories to push it towards airports/hotels etc
        url.searchParams.set('categories', searchType);
      }

      const finalUrl = url.toString();
      console.log('Mapbox request URL:', finalUrl);

      const res = await fetch(finalUrl, {
        signal: controller.signal,
      });

      console.log('Mapbox status:', res.status);

      if (!res.ok) {
        const errText = await res.text();
        console.warn('Mapbox error body:', errText);
        throw new Error(`HTTP ${res.status}`);
      }

      const json: any = await res.json();
      if (cancelled) return;

      console.log(
        'Mapbox features length:',
        Array.isArray(json.features) ? json.features.length : 'no features',
      );

      const feats: any[] = Array.isArray(json.features)
        ? json.features
        : [];

      const mapped: SearchResult[] = feats.map(f => {
        const [lon, lat] = f.center || [];
        const description: string = f.place_name || f.text || '';
        let subtitle: string | undefined;

        if (Array.isArray(f.context) && f.context.length > 0) {
          subtitle = f.context
            .map((c: any) => c.text)
            .filter(Boolean)
            .join(', ');
        }

        return {
          latitude: lat,
          longitude: lon,
          description,
          placeId: f.id,
          subtitle,
        };
      });

      setResults(mapped);
    } catch (err) {
      if (!cancelled) {
        console.warn('Mapbox search error:', err);
        setResults([]);
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  const timeout = setTimeout(run, 300); // debounce 300ms

  return () => {
    cancelled = true;
    clearTimeout(timeout);
    controller.abort();
  };
}, [query, origin, searchType]);

  const listHeader = useMemo(() => {
    return (
      <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
        {/* Quick suggestions / category chips */}
        <View style={styles.chipsWrap}>
          {SUGGESTION_CHIPS.map(chip => (
            <Pressable
              key={chip.key}
              style={[
                styles.chip,
                searchType === chip.type && styles.chipActive,
              ]}
              onPress={() =>
                setSearchType(prev =>
                  prev === chip.type ? undefined : chip.type,
                )
              }
            >
              <Text
                style={[
                  styles.chipText,
                  searchType === chip.type && styles.chipTextActive,
                ]}
              >
                {chip.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Recents */}
        {Array.isArray(recents) && recents.length > 0 && (
          <View style={styles.recentsCard}>
            <View style={styles.recentsHeader}>
              <Text style={styles.sectionTitle}>Recent places</Text>
              <Pressable onPress={clearRecents} hitSlop={8}>
                <Text style={styles.clearAll}>Clear</Text>
              </Pressable>
            </View>
            <FlatList
              data={recents.slice(0, 3)}
              keyExtractor={it => it.placeId}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={renderRecent}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>
    );
  }, [recents, inputFocused, searchType]);

  const renderResult = ({ item }: { item: SearchResult }) => (
    <Pressable style={styles.row} onPress={() => handlePick(item)}>
      <View style={styles.rowWrap}>
        <View style={styles.rowIconWrap}>
          <Ionicons name="location-outline" size={18} color="#111" />
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.rowTitle}>
            {item.description}
          </Text>
          {!!item.subtitle && (
            <Text numberOfLines={1} style={styles.rowSub}>
              {item.subtitle}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="chevron-down" size={22} color="#111" />
        </Pressable>
        <Text style={styles.title}>Where are you going?</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search a country, region, city or landmark"
          {...inputProps}
        />
        <View style={styles.inputLeft}>
          <Ionicons name="search" size={18} color="#6B7280" />
        </View>
        {query.length > 0 && (
          <Pressable
            style={styles.inputRight}
            onPress={() => {
              setQuery('');
              setSearchType(undefined);
            }}
          >
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </Pressable>
        )}
      </View>

      {/* Results list (Mapbox) */}
      <FlatList
        data={results}
        keyExtractor={it => it.placeId}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          !query || query.trim().length < 2 ? (
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text style={styles.emptyText}>
                Start typing to search places…
              </Text>
            </View>
          ) : !loading && results.length === 0 ? (
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text style={styles.emptyText}>No results found.</Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 16 }}
        style={styles.listView}
        renderItem={renderResult}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff',marginHorizontal:10 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginTop: 50,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, color: '#111', fontFamily: FONTS.regular },

  /** Input */
  inputContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#F7F7F7',
    borderRadius: 14,
    paddingLeft: 40,
    paddingRight: 36,
    color: '#111',
    fontSize: 15,
  },
  inputLeft: {
    position: 'absolute',
    left: 22,
    top: 8 + (48 - 18) / 2,
    zIndex: 1,
  },
  inputRight: {
    position: 'absolute',
    right: 22,
    top: 8 + (48 - 18) / 2,
    zIndex: 1,
  },

  /** Results list */
  listView: { marginTop: 10 },
  row: { paddingVertical: 10, paddingHorizontal: 16 },
  rowWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { color: '#111', fontSize: 14, fontFamily: FONTS.semibold },
  rowSub: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
    fontFamily: FONTS.regular,
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginLeft: 16,
  },

  /** Recents */
  recentsCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
    marginTop: 8,
  },
  recentsHeader: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 16, color: '#201E20', fontFamily: FONTS.semibold },
  clearAll: { fontSize: 16, color: '#EF4444', fontFamily: FONTS.regular },
  recentRow: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recentIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentTitle: { fontSize: 14, color: '#111', fontFamily: FONTS.semibold },
  recentSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
    fontFamily: FONTS.regular,
  },

  /** Chips */
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
  },
  chipText: { color: '#111', fontSize: 16, fontFamily: FONTS.regular },
  chipActive: { backgroundColor: '#111' },
  chipTextActive: { color: '#fff' },

  emptyText: { color: '#6B7280', fontSize: 13, fontFamily: FONTS.regular },
});
