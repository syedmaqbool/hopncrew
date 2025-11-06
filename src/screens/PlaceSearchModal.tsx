<<<<<<< HEAD
import React, { useRef } from 'react';
import { SafeAreaView, View, Pressable, StyleSheet, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceSearch'>;
const GOOGLE_PLACES_API_KEY = 'AIzaSyBp7k8-SYDkEkhcGbXQ9f_fAXPXmwmlvUQ'; // TODO: move to env later

export default function PlaceSearchModal({ navigation, route }: Props) {
    const ref = useRef<GooglePlacesAutocompleteRef>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#111" />
=======
// src/screens/PlaceSearchModal.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import {
  GooglePlacesAutocomplete,
  type GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FONTS } from '../../src/theme/fonts';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceSearch'>;

/** TODO: move to env/secure storage */
const GOOGLE_PLACES_API_KEY = 'AIzaSyBp7k8-SYDkEkhcGbXQ9f_fAXPXmwmlvUQ';

type Dest = {
  latitude: number;
  longitude: number;
  description: string;
  placeId: string;
};

type Recent = Dest & { savedAt: number };

const MAX_RECENTS = 8;
const STORAGE_KEY_DEFAULT = '@place_search_recents';

const SUGGESTION_CHIPS = [
  { key: 'airport', label: 'Airports', type: 'airport' },
  { key: 'hotel', label: 'Hotels', type: 'lodging' },
  { key: 'restaurant', label: 'Restaurants', type: 'restaurant' },
  { key: 'mall', label: 'Malls', type: 'shopping_mall' },
  { key: 'hospital', label: 'Hospitals', type: 'hospital' },
];

export default function PlaceSearchModal({ navigation, route }: Props) {
  const ref = useRef<GooglePlacesAutocompleteRef>(null);
  const [recents, setRecents] = useState<Recent[]>([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>('');
  const [searchType, setSearchType] = useState<string | undefined>(undefined);

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

  useEffect(() => {
    setSessionToken(Math.random().toString(36).slice(2));
  }, []);

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
        // dedupe without .filter to avoid any undefined traps
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
      // swallow
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

  console.log('recents', recents);

  const listHeader = useMemo(() => {
    return (
      <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
        {/* Quick suggestions for Nearby (does not restrict global autocomplete) */}
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

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="chevron-down" size={22} color="#111" />
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
        </Pressable>
        <Text style={styles.title}>Where are you going?</Text>
        <View style={{ width: 36 }} />
      </View>

<<<<<<< HEAD
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Search places"
        fetchDetails
        textInputProps={{
        // onFocus: () => {},
        }}
        autoFillOnNotFound={false}
         currentLocation={false}
         currentLocationLabel="Current location"
        disableScroll={false}
        enableHighAccuracyLocation={true}
        filterReverseGeocodingByTypes={[]}
        GooglePlacesDetailsQuery={{}}
        GooglePlacesSearchQuery={{
            rankby: 'distance',
            type: 'restaurant',
        }}

         isRowScrollable={true}
        keyboardShouldPersistTaps="always"
        listUnderlayColor="#c8c7cc"
        listViewDisplayed="auto"
        keepResultsAfterBlur={false}
        numberOfLines={1}
        onFail={() => {
            console.warn('Autocomplete failed');
        }}
        onNotFound={() => {
            console.log('No results found');
        }}
        onTimeout={() =>
            console.warn('Google Places Autocomplete: Request timeout')
        }
        predefinedPlacesAlwaysVisible={false}
        suppressDefaultStyles={false}
        textInputHide={false}

        timeout={20000}

        enablePoweredByContainer={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={250}
        minLength={2}
        predefinedPlaces={[]}
        onPress={(data, details) => {
            console.log(data, details,"test data");
        if (!details) return;
          const { lat, lng } = details.geometry.location;
          const dest = {
=======
      {/* Search */}
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Search a country, region, city or landmark"
        fetchDetails
        /** keep these as arrays (lib sometimes calls .filter on them) */
        predefinedPlaces={[]}
        filterReverseGeocodingByTypes={[]}
        /** must be an object */
        textInputProps={inputProps}
        /** RN networking bridge wants a number here */
        timeout={20000}
        onFail={e => console.warn('Autocomplete error:', e?.message || e)}
        onNotFound={() => {}}
        enablePoweredByContainer={false}
        debounce={300}
        minLength={2}
        keyboardShouldPersistTaps="handled"
        keepResultsAfterBlur={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        /** GLOBAL search (no country components). `(regions)` returns countries, admin areas, localities, neighborhoods.
         *  Remove `types` if you want ALL types (addresses, establishments, etc.) */
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
          sessiontoken: sessionToken,
          // types: '(regions)',
        }}
        /** Only affects the "Nearby" endpoint used by chips; does not limit global autocomplete */
        GooglePlacesSearchQuery={{
          rankby: origin ? 'distance' : 'prominence',
          ...(origin
            ? { location: `${origin.latitude},${origin.longitude}` }
            : {}),
          ...(origin ? { radius: 15000 } : {}),
          ...(searchType ? { type: searchType } : {}),
        }}
        onPress={(data, details) => {
          if (!details) return;
          const { lat, lng } = details.geometry.location;
          handlePick({
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
            latitude: lat,
            longitude: lng,
            description: data.description,
            placeId: data.place_id,
<<<<<<< HEAD
          };
          // OPTION A: merge params into existing Home route
          // navigation.navigate({ name: 'Home', params: { dest }, merge: true });
          // navigation.goBack();

          // OPTION B (recommended): callback passed from Home
          route.params?.onPick?.(dest);
          navigation.goBack();



        }}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
          // Optional: bias to current country/region
          // components: 'country:us',
        }}
        
        styles={{
=======
          });
        }}
        /** Use styles to customize rows instead of custom renderRow (avoids onPress wiring issues) */
        listEmptyComponent={
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <Text style={styles.emptyText}>Start typing to search places…</Text>
          </View>
        }
        ListHeaderComponent={listHeader}
        renderLeftButton={() => (
          <View style={styles.inputLeft}>
            <Ionicons name="search" size={18} color="#6B7280" />
          </View>
        )}
        renderRightButton={() => (
          <Pressable
            style={styles.inputRight}
            onPress={() => {
              ref.current?.setAddressText('');
              setSearchType(undefined);
            }}
          >
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </Pressable>
        )}
        styles={{
          container: styles.gContainer,
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
          textInputContainer: styles.inputContainer,
          textInput: styles.input,
          listView: styles.listView,
          row: styles.row,
          separator: styles.separator,
<<<<<<< HEAD
          description: styles.rowText,
=======
          description: styles.rowTitle, // main text
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
<<<<<<< HEAD
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, justifyContent: 'space-between',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#F2F2F2',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: '700', color: '#111' },

  inputContainer: { paddingHorizontal: 12 },
  input: {
    height: 46, backgroundColor: '#F7F7F7', borderRadius: 24,
    paddingHorizontal: 16, color: '#111',
  },
  listView: { marginTop: 8 },
  row: { paddingVertical: 12, paddingHorizontal: 16 },
  separator: { height: 1, backgroundColor: '#EFEFEF' },
  rowText: { color: '#111' },
=======
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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
  title: { fontSize: 16, color: '#111', fontFamily: FONTS.bold },

  /** Google input + list */
  gContainer: { flex: 1 },
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

  listView: { marginTop: 10 },
  row: { paddingVertical: 10, paddingHorizontal: 12 },
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
  rowSub: { color: '#6B7280', fontSize: 12, marginTop: 2, fontFamily: FONTS.regular },

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
    paddingHorizontal: 8,
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
  sectionTitle: { fontSize: 13, color: '#111', fontFamily: FONTS.bold },
  clearAll: { fontSize: 12, color: '#EF4444', fontFamily: FONTS.semibold },
  recentRow: {
    paddingVertical: 10,
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
  recentSub: { fontSize: 11, color: '#9CA3AF', marginTop: 1, fontFamily: FONTS.regular },

  /** Chips */
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
  },
  chipText: { color: '#111', fontSize: 12, fontFamily: FONTS.semibold },
  chipActive: { backgroundColor: '#111' },
  chipTextActive: { color: '#fff' },

  emptyText: { color: '#6B7280', fontSize: 13, fontFamily: FONTS.regular },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});
