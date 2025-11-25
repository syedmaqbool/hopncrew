// src/screens/SelectDepartureModal.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Platform,
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

const MINT = '#B1FBE3';
const TEXT = '#201E20';
const SUBTEXT = '#8D8E8F';
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

  useEffect(() => {
    (async () => {
      try {
        const a2 = await AsyncStorage.getItem(STORAGE_KEY_AIRLINE);
        if (a2) setAirline(JSON.parse(a2));
      } catch {}
    })();
  }, []);

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
              <Ionicons name="close" size={24} color={TEXT} />
            </Pressable>
          </View>

          {/* ===== Top Combo Card (Airport + Airline) ===== */}
          <View style={styles.comboCard}>
            {/* Left rail with icons + dashed line */}
            <View style={styles.rail}>
              <View style={styles.railIconTop}>
                {/* <Ionicons name="airplane-outline" size={18} color={TEXT} /> */}
                <Image source={require('../../assets/icons/flight-plane.png')} alt='flight-date-time' style={{width:24,height:24}} />
              </View>
              <View style={styles.railLine} />
              <View style={styles.railIconBottom}>
                {/* <Ionicons name="airplane-outline" size={18} color={TEXT} /> */}
                <Image source={require('../../assets/icons/flight-plane.png')} alt='flight-date-time' style={{width:24,height:24}} />
              </View>
            </View>

            {/* Right side: 2 rows */}
            <View style={{ flex: 1 }}>
              {/* Airport row */}
              <Pressable
                style={styles.comboRowTop}
                onPress={() => {
                  Keyboard.dismiss();
                  setAirlineOpen(false);
                  setAirportOpen(v => !v);
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.comboRowText,
                    !selectedAirport && { color: SUBTEXT },
                  ]}
                >
                  {selectedAirport
                    ? `${selectedAirport.description}`
                    : 'Abbotsford Airport (YXX)'}
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

              <View style={styles.comboDivider} />

              {/* Airline row */}
              <Pressable
                style={styles.comboRowBottom}
                onPress={() => {
                  Keyboard.dismiss();
                  setAirportOpen(false);
                  setAirlineOpen(v => !v);
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.comboRowText,
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
            </View>
          </View>

          {/* ===== Airport Results Card (like screenshot) ===== */}
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
                  renderItem={({ item }) => {
                    const isSelected =
                      selectedAirport?.description === item.name;
                    return (
                      <Pressable
                        style={styles.row}
                        onPress={() => pickAirport(item)}
                      >
                        <View
                          style={[
                            styles.iconCircle,
                            {
                              backgroundColor: isSelected ? MINT : '#E5E7EB',
                              paddingTop:6,
                            },
                          ]}
                        >
                          <Image source={require('../../assets/icons/flight-bg-icon.png')} alt='flight-bg-icon' style={{height:24,width:24}} />
                          {/* <Ionicons
                            name="airplane-outline"
                            size={16}
                            color={TEXT}
                          /> */}
                        </View>
                        <View style={styles.rowTextWrap}>
                          <Text
                            style={styles.rowTitle}
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
                              Airport ({item.code})
                            </Text>
                          )}
                        </View>
                      </Pressable>
                    );
                  }}
                />
              ) : (
                <Text style={styles.emptyTxt}>No airports found</Text>
              )}
            </View>
          )}

          {/* ===== Airline Dropdown List (simple card under combo) ===== */}
          {airlineOpen && (
            <View style={[styles.resultsCard, { marginTop: 10 }]}>
              <FlatList
                data={AIRLINES}
                keyExtractor={a => a.code}
                style={{ maxHeight: 220 }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
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
                      <Ionicons
                        name="airplane-outline"
                        size={16}
                        color={TEXT}
                      />
                    </View>
                    <Text
                      style={styles.rowTitle}
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

          {/* Confirm Button */}
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
    borderRadius: 22,
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
    marginBottom: 14,
  },
  title: { fontSize: 18, color: TEXT, fontFamily: FONTS.semibold },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 4 },
    }),
  },

  /* ===== Combo card (top) ===== */
  comboCard: {
    flexDirection: 'row',
    backgroundColor: CARD,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
    }),
  },
  rail: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 12,
  },
  railIconTop: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  railIconBottom: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  railLine: {
    flex: 1,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    marginVertical: 4,
  },
  comboRowTop: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  comboRowBottom: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  comboRowText: {
    flex: 1,
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
  },
  comboDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 6,
  },

  /* ===== Result cards (lists) ===== */
  resultsCard: {
    marginTop: 14,
    backgroundColor: CARD,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 6 },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  rowTextWrap: { flex: 1, minWidth: 0 },
  rowTitle: {
    color: TEXT,
    fontFamily: FONTS.regular,
    fontSize: 16,
  },
  rowSub: {
    color: SUBTEXT,
    fontSize: 12,
    marginTop: 2,
    fontFamily: FONTS.regular,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  separator: {
    height: 1,
    backgroundColor: BORDER,
    marginLeft: 50, // starts where text starts (after icon)
  },

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

  /* ===== CTA ===== */
  cta: {
    marginTop: 18,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontFamily: FONTS.semibold,fontSize:16 },
  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: 32,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
  },
});
