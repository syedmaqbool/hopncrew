// src/screens/SelectDepartureModal.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Destination, RootStackParamList } from '../navigation/types';
import { getAirports, type Airport } from '../services/app';
import { FONTS } from '../../src/theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectDeparture'>;

const MINT = '#B9FBE7';
const TEXT = '#111';
const SUBTEXT = '#6B7280';
const CARD = '#fff';
const BORDER = '#ECEDEE';

const STORAGE_KEY_AIRPORT = 'selected_airport';
const STORAGE_KEY_AIRLINE = 'selected_airline';

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

  // Airport states
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airportOpen, setAirportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<Destination | null>(
    null,
  );

  // Airline states
  const [airlineOpen, setAirlineOpen] = useState(false);
  const [airline, setAirline] = useState<Airline | null>(null);

  // ✅ Load airlines from storage only (airport won't preload)
  useEffect(() => {
    (async () => {
      try {
        const a2 = await AsyncStorage.getItem(STORAGE_KEY_AIRLINE);
        if (a2) setAirline(JSON.parse(a2));
      } catch {}
    })();
  }, []);

  // ✅ Fetch airports from backend API
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getAirports();
        setAirports(list || []);
      } catch {
        setAirports([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => navigation.goBack(), 150);
  };

  const pickAirport = async (a: Airport) => {
    const chosen: Destination = {
      latitude: a.latitude,
      longitude: a.longitude,
      description: a.name,
    };
    setSelectedAirport(chosen);
    setAirportOpen(false);
    await AsyncStorage.setItem(STORAGE_KEY_AIRPORT, JSON.stringify(chosen));
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

          {/* ------- Airport Dropdown ------- */}
          <View style={styles.fieldCard}>
            <Pressable
              style={styles.dropdown}
              onPress={() => {
                Keyboard.dismiss();
                setAirlineOpen(false);
                setAirportOpen(v => !v);
              }}
            >
              <Image
                source={require('../../assets/icons/airplan-icon.png')}
                style={{
                  width: 18,
                  height: 18,
                  marginRight: 10,
                  resizeMode: 'contain',
                }}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.dropdownText,
                  styles.truncate,
                  !selectedAirport && { color: SUBTEXT },
                ]}
              >
                {selectedAirport
                  ? selectedAirport.description
                  : 'Select an airport'}
              </Text>
              {loading ? (
                <ActivityIndicator size="small" color={SUBTEXT} />
              ) : (
                <Ionicons
                  name={airportOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={SUBTEXT}
                />
              )}
            </Pressable>

            {airportOpen && (
              <View style={styles.resultsCard}>
                {loading ? (
                  <View style={styles.loadingBox}>
                    <ActivityIndicator size="small" color={TEXT} />
                    <Text style={styles.loadingTxt}>Loading airports...</Text>
                  </View>
                ) : airports.length > 0 ? (
                  <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={airports}
                    keyExtractor={it =>
                      `${it.name}-${it.latitude}-${it.longitude}`
                    }
                    style={{ maxHeight: 260 }}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                    renderItem={({ item }) => (
                      <Pressable
                        style={styles.row}
                        onPress={() => pickAirport(item)}
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
                            {item.name}
                          </Text>
                          {!!item.code && (
                            <Text
                              style={styles.rowSub}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item.code}
                            </Text>
                          )}
                        </View>
                      </Pressable>
                    )}
                  />
                ) : (
                  <Text style={styles.emptyTxt}>No airports found</Text>
                )}
              </View>
            )}
          </View>

          {/* ------- Airline Dropdown ------- */}
          <View style={styles.fieldCard}>
            <Pressable
              style={styles.dropdown}
              onPress={() => {
                Keyboard.dismiss();
                setAirportOpen(false);
                setAirlineOpen(v => !v);
              }}
            >
              <Image
                source={require('../../assets/icons/airplan-icon.png')}
                style={{
                  width: 18,
                  height: 18,
                  marginRight: 10,
                  resizeMode: 'contain',
                }}
              />
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
                  style={{ maxHeight: 220 }}
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

          {/* ------- Confirm Button ------- */}
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
  title: { fontSize: 16, color: TEXT, fontFamily: FONTS.bold },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 10,
    marginTop: 10,
  },
  dropdown: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  dropdownText: { flex: 1, color: TEXT, fontFamily: FONTS.bold },
  truncate: { minWidth: 0 },
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
  rowTextWrap: { flex: 1, minWidth: 0 },
  rowTitle: { color: TEXT, fontFamily: FONTS.bold },
  rowSub: { color: SUBTEXT, fontSize: 12, marginTop: 2, fontFamily: FONTS.regular },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  separator: { height: 1, backgroundColor: BORDER, marginLeft: 48 },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  loadingTxt: { color: SUBTEXT, fontFamily: FONTS.regular },
  emptyTxt: {
    textAlign: 'center',
    color: SUBTEXT,
    paddingVertical: 10,
    fontFamily: FONTS.regular,
  },
  cta: {
    marginTop: 14,
    height: 50,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontFamily: FONTS.bold },
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
});
