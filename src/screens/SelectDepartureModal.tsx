// src/screens/SelectDepartureModal.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Destination, RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectDeparture'>;

const MINT = '#B9FBE7';
const TEXT = '#111';
const SUBTEXT = '#6B7280';
const CARD = '#fff';
const BORDER = '#ECEDEE';

const STORAGE_KEY_AIRPORT = 'selected_airport';
const STORAGE_KEY_AIRLINE = 'selected_airline';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBp7k8-SYDkEkhcGbXQ9f_fAXPXmwmlvUQ'; // move to env

type Prediction = {
  description: string;
  place_id: string;
  types?: string[];
  structured_formatting?: { main_text?: string; secondary_text?: string };
};

type Airline = { code: string; name: string };

const AIRLINES: Airline[] = [
  { code: 'AC', name: 'Air Canada' },
  { code: 'WS', name: 'WestJet' },
  { code: 'AA', name: 'American Airlines' },
  { code: 'DL', name: 'Delta Air Lines' },
  { code: 'UA', name: 'United Airlines' },
  { code: 'EK', name: 'Emirates' },
  { code: 'QR', name: 'Qatar Airways' },
  { code: 'BA', name: 'British Airways' },
  { code: 'LH', name: 'Lufthansa' },
];

export default function SelectDepartureModal({ navigation, route }: Props) {
  const [visible, setVisible] = useState(true);

  // airport search
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<Destination | null>(
    null,
  );

  // airline dropdown
  const [airlineOpen, setAirlineOpen] = useState(false);
  const [airline, setAirline] = useState<Airline | null>(null);

  const sessionToken = useMemo(
    () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
    [],
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // restore saved
  useEffect(() => {
    (async () => {
      try {
        const [a1, a2] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_AIRPORT),
          AsyncStorage.getItem(STORAGE_KEY_AIRLINE),
        ]);
        if (a1) {
          const parsed = JSON.parse(a1);
          setSelectedAirport(parsed);
          // show the nice full description in the field
          setQuery(parsed.description || '');
        }
        if (a2) setAirline(JSON.parse(a2));
      } catch {}
    })();
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => navigation.goBack(), 150);
  };

  // ---- Google helpers
  const isAirportPrediction = (p: Prediction) => {
    const hasType =
      Array.isArray(p.types) && p.types.some(t => /airport/i.test(t));
    const looksLike = /airport/i.test(p.description || '');
    return hasType || looksLike;
  };

  const parseIATA = (text: string) => {
    const m = text.match(/\(([A-Z]{3})\)/);
    return m?.[1] ?? undefined;
  };

  const fetchPredictions = async (text: string) => {
    try {
      setLoading(true);
      const url =
        `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
        `?input=${encodeURIComponent(text)}` +
        `&key=${GOOGLE_PLACES_API_KEY}` +
        `&language=en` +
        `&sessiontoken=${sessionToken}` +
        `&types=establishment`;
      const res = await fetch(url);
      const json = await res.json();
      const raw: Prediction[] = Array.isArray(json?.predictions)
        ? json.predictions
        : [];
      setPredictions(raw.filter(isAirportPrediction));
    } catch {
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaceDetails = async (placeId: string) => {
    try {
      const url =
        `https://maps.googleapis.com/maps/api/place/details/json` +
        `?place_id=${encodeURIComponent(placeId)}` +
        `&fields=geometry,name,types` +
        `&key=${GOOGLE_PLACES_API_KEY}` +
        `&language=en` +
        `&sessiontoken=${sessionToken}`;
      const res = await fetch(url);
      const json = await res.json();
      const resTypes: string[] = json?.result?.types ?? [];
      if (!resTypes.some(t => /airport/i.test(t))) return null;
      const loc = json?.result?.geometry?.location;
      if (!loc) return null;
      return {
        latitude: loc.lat,
        longitude: loc.lng,
        description: json?.result?.name || 'Airport',
        placeId,
      } as Destination;
    } catch {
      return null;
    }
  };

  // ---- input change
  const onChangeText = (t: string) => {
    setQuery(t);
    setSelectedAirport(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!t || t.trim().length < 2) {
      setPredictions([]);
      return;
    }
    debounceRef.current = setTimeout(() => fetchPredictions(t), 300);
  };

  const pickPrediction = async (p: Prediction) => {
    Keyboard.dismiss();
    const details = await fetchPlaceDetails(p.place_id);
    if (details) {
      const chosen = { ...details, description: p.description };
      setSelectedAirport(chosen);
      setQuery(p.description);
      setPredictions([]);
      await AsyncStorage.setItem(STORAGE_KEY_AIRPORT, JSON.stringify(chosen));
    }
  };

  const onConfirm = async () => {
    if (!selectedAirport) return;
    route.params?.onPick?.(selectedAirport);
    if (airline) {
      route.params?.onPickAirline?.(airline.code);
      await AsyncStorage.setItem(STORAGE_KEY_AIRLINE, JSON.stringify(airline));
    }
    navigation.replace('SelectedAirport', {
      airport: selectedAirport,
      airline: airline?.code,
      when: route.params?.when ?? new Date(),
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={close}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Departure</Text>
            <Pressable onPress={close} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color={TEXT} />
            </Pressable>
          </View>

          {/* Airport Input */}
          <View style={styles.fieldCard}>
            <View style={styles.inputRow}>
              <Image
                source={require('../../assets/icons/airplan-icon.png')}
                alt="airplane-outline"
                style={{
                  width: 18,
                  height: 18,
                  marginRight: 10,
                  resizeMode: 'contain',
                }}
              />
              <TextInput
                style={[styles.input, styles.truncate]}
                placeholder="Search airports (e.g., Abbotsford Airport (YXX))"
                placeholderTextColor={SUBTEXT}
                value={query}
                onChangeText={onChangeText}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {loading ? (
                <Ionicons name="sync" size={18} color={SUBTEXT} />
              ) : query.length > 0 ? (
                <Pressable
                  onPress={() => {
                    setQuery('');
                    setPredictions([]);
                    setSelectedAirport(null);
                  }}
                >
                  <Ionicons name="close-circle" size={18} color={SUBTEXT} />
                </Pressable>
              ) : null}
            </View>

            {/* Predicted airports */}
            {predictions.length > 0 && (
              <View style={styles.resultsCard}>
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  data={predictions}
                  keyExtractor={it => it.place_id}
                  style={{ maxHeight: 240 }}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  renderItem={({ item }) => {
                    const main =
                      item.structured_formatting?.main_text ?? item.description;
                    const sub = item.structured_formatting?.secondary_text;
                    const code = parseIATA(item.description);
                    return (
                      <Pressable
                        style={styles.row}
                        onPress={() => pickPrediction(item)}
                      >
                        <View
                          style={[styles.iconCircle, { backgroundColor: MINT }]}
                        >
                          <Ionicons name="airplane" size={16} color={TEXT} />
                        </View>
                        <View style={[styles.rowTextWrap, styles.truncate]}>
                          <Text
                            style={[styles.rowTitle]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {main}
                          </Text>
                          {!!sub && (
                            <Text
                              style={styles.rowSub}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {sub} {code ? `(${code})` : ''}
                            </Text>
                          )}
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={SUBTEXT}
                        />
                      </Pressable>
                    );
                  }}
                />
              </View>
            )}

            {/* Selected airport pill (truncated) */}
            {selectedAirport && predictions.length === 0 && (
              <View style={styles.selectedBox}>
                <Ionicons name="checkmark-circle" size={20} color={MINT} />
                <Text
                  style={[styles.selectedText, styles.truncate]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {selectedAirport.description}
                </Text>
              </View>
            )}
          </View>

          {/* Airline dropdown */}
          <View style={styles.fieldCard}>
            <Pressable
              style={styles.dropdown}
              onPress={() => setAirlineOpen(v => !v)}
            >
              <Image
                source={require('../../assets/icons/airplan-icon.png')}
                alt="airplane-outline"
                style={{
                  width: 18,
                  height: 18,
                  marginRight: 10,
                  resizeMode: 'contain',
                }}
              />
              {/* <Ionicons
                name="airplane"
                size={18}
                color={TEXT}
                style={{ marginRight: 10 }}
              /> */}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.dropdownText,
                  styles.truncate,
                  !airline && { color: SUBTEXT },
                ]}
              >
                {airline
                  ? `${airline.name} (${airline.code})`
                  : 'Select an airline'}
              </Text>
              <Ionicons
                name={airlineOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={SUBTEXT}
              />
            </Pressable>

            {airlineOpen && (
              <View style={styles.resultsCard}>
                <FlatList
                  data={AIRLINES}
                  keyExtractor={a => a.code}
                  style={{ maxHeight: 200 }}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.row}
                      onPress={async () => {
                        setAirline(item);
                        setAirlineOpen(false);
                        await AsyncStorage.setItem(
                          STORAGE_KEY_AIRLINE,
                          JSON.stringify(item),
                        );
                      }}
                    >
                      <View
                        style={[
                          styles.iconCircle,
                          { backgroundColor: '#E5E7EB' },
                        ]}
                      >
                        <Ionicons name="airplane" size={16} color={TEXT} />
                      </View>
                      <Text
                        style={[styles.rowTitle, styles.truncate]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.name} ({item.code})
                      </Text>
                    </Pressable>
                  )}
                />
              </View>
            )}
          </View>

          {/* Confirm */}
          <Pressable
            style={[styles.cta, !selectedAirport && { opacity: 0.6 }]}
            disabled={!selectedAirport}
            onPress={onConfirm}
          >
            <Text style={styles.ctaText}>Confirm</Text>
            <View style={styles.ctaIcon}>
              <AntDesign name="arrowright" size={18} color={TEXT} />
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // layout
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '88%',
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: { fontWeight: '800', fontSize: 16, color: TEXT },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // cards
  fieldCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 10,
    marginTop: 10,
  },

  // airport input
  inputRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { flex: 1, color: TEXT, fontWeight: '700' },

  // results container
  resultsCard: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  rowTextWrap: { flex: 1, minWidth: 0 }, // enables truncation
  rowTitle: { color: TEXT, fontWeight: '800' },
  rowSub: { color: SUBTEXT, fontSize: 12, marginTop: 2 },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  separator: { height: 1, backgroundColor: BORDER, marginLeft: 48 },

  // airline dropdown
  dropdown: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  dropdownText: { flex: 1, color: TEXT, fontWeight: '700' },

  // selected
  selectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  selectedText: { color: TEXT, fontWeight: '700' },

  // CTA
  cta: {
    marginTop: 14,
    height: 50,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },

  // text truncation helper
  truncate: { minWidth: 0 }, // critical to allow numberOfLines to work in flex rows
});
