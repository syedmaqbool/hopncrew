// src/screens/TripScreen.tsx
<<<<<<< HEAD
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Destination, LuggageItem } from '../navigation/types';
import type { PassengerCounts } from '../navigation/types'; // <- from earlier
import { summarizeLuggage } from '../utils/luggage';
type Props = NativeStackScreenProps<RootStackParamList, 'Trip'>;


const MINT = '#B9FBE7';
=======
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { Image, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import assets from '../../assets';
import type {
  Destination,
  LuggageItem,
  PassengerCounts,
  RootStackParamList,
} from '../navigation/types';
import { summarizeLuggage } from '../utils/luggage';
import { FONTS } from '../../src/theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'Trip'>;

const MINT = '#B9FBE7';
const BG = '#F6F7F8';
const BORDER = '#ECEDEE';
const TEXT = '#111';
const MUTED = '#9AA0A6';

>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
const DEFAULT_PAX: PassengerCounts = {
  adults: 1,
  children: 0,
  infants: 0,
  seats: { infantRear: 0, toddlerRear: 0, toddlerFront: 0 },
};

<<<<<<< HEAD

export default function TripScreen({ navigation, route }: Props) {
  const [start, setStart] = useState<Destination | null>(
    route.params?.start ??
      {
        description: "Toronto Pearson International Airport (YYZ)",
        latitude: 43.6777,
        longitude: -79.6248,
      }
  );
  const [passengers, setPassengers] = useState<PassengerCounts>(DEFAULT_PAX);
  const [dest, setDest] = useState<Destination | null>(route.params?.dest ?? null);
  const [setOnPin, setSetOnPin] = useState(false);
  const [luggage, setLuggage] = useState<LuggageItem[]>([]);


   const { totalPassengers, totalSeats, chipText } = useMemo(() => {
    const totalP =
      passengers.adults + passengers.children + passengers.infants;
    const totalS = Object.values(passengers.seats || {}).reduce(
      (a, b) => a + (b || 0),
      0
    );
    const p = `${totalP} passenger${totalP !== 1 ? 's' : ''}`;
    const s =
      totalS > 0 ? ` · ${totalS} seat${totalS !== 1 ? 's' : ''}` : '';
    return { totalPassengers: totalP, totalSeats: totalS, chipText: p + s };
  }, [passengers]);



  const openPlaces = (which: 'start' | 'dest') => {
    navigation.navigate('PlaceSearch', {
      onPick: (d) => {
=======
export default function TripScreen({ navigation, route }: Props) {
  // Ensure Android back navigates to Home instead of exiting
  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (navigation.canGoBack()) {
          // navigation.goBack();
          navigation.replace('App');
        } else {
          navigation.replace('App');
        }
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );
  // ---------- Trip state that persists across modals ----------
  const [start, setStart] = useState<Destination | null>(
    route.params?.start ?? null,
  );
  const [dest, setDest] = useState<Destination | null>(
    route.params?.dest ?? null,
  );
  const [setOnPin, setSetOnPin] = useState(false);
  const [when, setWhen] = useState<Date | null>(route.params?.when ?? null);

  const [passengers, setPassengers] = useState<PassengerCounts>(DEFAULT_PAX);
  const [luggage, setLuggage] = useState<LuggageItem[]>([]);

  // ---------- derived text for the “chip” ----------
  const { totalPassengers, totalSeats, chipText } = useMemo(() => {
    const totalP = passengers.adults + passengers.children + passengers.infants;
    const totalS = Object.values(passengers.seats || {}).reduce(
      (a, b) => a + (b || 0),
      0,
    );
    const p = `${totalP} passenger${totalP !== 1 ? 's' : ''}`;
    const s = totalS > 0 ? ` · ${totalS} seat${totalS !== 1 ? 's' : ''}` : '';
    return { totalPassengers: totalP, totalSeats: totalS, chipText: p + s };
  }, [passengers]);

  // ---------- navigation helpers ----------
  const openPlaces = (which: 'start' | 'dest') => {
    navigation.navigate('PlaceSearch', {
      onPick: d => {
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
        which === 'start' ? setStart(d) : setDest(d);
      },
    });
  };

  const openAddPassenger = () => {
<<<<<<< HEAD
    // navigation.navigate('AddPassenger', {
    //   initial: passengers,
    //   onDone: (data) => setPassengers(data), // <-- update Trip state
    // });
    navigation.navigate('AddPassenger', {
    initial: passengers,
    luggage,                        // give current luggage to the modal
    onDone: setPassengers,          // refresh passenger details on close
    onEditLuggage: setLuggage,      // when “Add Luggage” finishes
  });
  };

    const summary = useMemo(() => {
    const total =
      passengers.adults + passengers.children + passengers.infants;
    const seats =
      Object.values(passengers.seats).reduce((a, b) => a + (b || 0), 0);
    return { total, seats, text: `${total} passenger${total !== 1 ? 's' : ''}${seats ? ` · ${seats} seat${seats !== 1 ? 's' : ''}` : ''}` };
  }, [passengers]);


=======
    // Open the passenger modal. It will:
    //  - save counts on close via `onDone`
    //  - when user chooses “+ Add Luggage”, it REPLACES itself with AddLuggage
    //    and that will callback `onDone` to update luggage here.
    navigation.navigate('AddPassenger', {
      initial: passengers,
      luggage, // pass current luggage so the modal can show/edit
      start: start ?? undefined,
      dest: dest ?? undefined,
      when: when ?? undefined,
      onDone: (pax: PassengerCounts) => setPassengers(pax),
      onEditLuggage: (items: LuggageItem[]) => setLuggage(items),
    });
  };
  const whenText = useMemo(() => {
    if (!when) return null;
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(when);
    } catch (e) {
      return String(when);
    }
  }, [when]);
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
<<<<<<< HEAD
        <Pressable style={styles.hBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={18} color="#111" />
        </Pressable>
        <Text style={styles.hTitle}>Trip</Text>
        <Pressable style={styles.doneBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Card with start/dest rows */}
=======
        <View style={styles.headerLeft}>
          <Pressable
            style={styles.hBtn}
            onPress={() => navigation.replace('App')}
          >
            <Ionicons name="close" size={18} color={TEXT} />
          </Pressable>
          <Text style={styles.hTitle}>Trip</Text>
        </View>
        {/* <Pressable style={styles.doneBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable> */}
      </View>

      {/* -------- NON-SCROLLING CONTENT -------- */}
      <View style={styles.content}>
        {/* Start/Destination Card */}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
        <View style={styles.block}>
          {/* Start */}
          <Pressable style={styles.row} onPress={() => openPlaces('start')}>
            <View style={styles.rowIconWrap}>
<<<<<<< HEAD
              <Ionicons name="location-outline" size={16} color="#111" />
=======
              <Ionicons name="radio-button-on-outline" size={16} color={TEXT} />
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowLabel}>Start</Text>
              <Text style={styles.rowValue} numberOfLines={2}>
                {start?.description ?? 'Choose start point'}
              </Text>
            </View>
          </Pressable>

          {/* Destination */}
<<<<<<< HEAD
          <Pressable style={[styles.row, { marginTop: 10 }]} onPress={() => openPlaces('dest')}>
            <View style={[styles.rowIconWrap, { backgroundColor: '#EAEAEA' }]}>
              <MaterialIcons name="flag" size={16} color="#111" />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowLabel}>Destination</Text>
              <Text style={[styles.rowValue, !dest && { color: '#9AA0A6' }]} numberOfLines={1}>
=======
          <Pressable
            style={[styles.row, { marginTop: 12 }]}
            onPress={() => openPlaces('dest')}
          >
            <View style={[styles.rowIconWrap, { backgroundColor: '#EAEAEA' }]}>
              <MaterialIcons name="flag" size={16} color={TEXT} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowLabel}>Destination</Text>
              <Text
                style={[styles.rowValue, !dest && { color: MUTED }]}
                numberOfLines={1}
              >
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
                {dest?.description ?? 'Where are you going?'}
              </Text>
            </View>
            <View style={styles.plusBadge}>
<<<<<<< HEAD
              <AntDesign name="plus" size={14} color="#111" />
            </View>
          </Pressable>

          {/* small helper text */}
          <View style={styles.helper}>
            <Text style={styles.helperText}>Want to pick someone else?</Text>
            <Pressable onPress={() => {navigation.navigate('ScheduleRide', {
                    initial: new Date(),
                    onPick: (when) => { /* store in Trip state / query fare */ },
                    });}}>
              <AntDesign name="pluscircleo" size={16} color="#111" />
=======
              <AntDesign name="plus" size={14} color={TEXT} />
            </View>
          </Pressable>

          {/* Helper */}
          <View style={styles.helper}>
            <Text style={styles.helperText}>Want to pick someone else?</Text>
            <Pressable
              onPress={() => {
                navigation.navigate('ScheduleRide', {
                  initial: new Date(),
                  start: start ?? undefined,
                  dest: dest ?? undefined,
                  onPick: () => {},
                });
              }}
              style={styles.helperPlus}
            >
              <AntDesign name="plus" size={14} color={TEXT} />
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
            </Pressable>
          </View>
        </View>

        {/* Set on pin */}
        <Pressable style={styles.pinRow} onPress={() => setSetOnPin(!setOnPin)}>
<<<<<<< HEAD
          <Ionicons name="pin-outline" size={18} color="#111" />
=======
          <Image
            source={assets.images.locationPin}
            style={{ width: 20, height: 20, resizeMode: 'contain' }}
          />
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
          <Text style={styles.pinText}>Set location on pin</Text>
          <View style={{ flex: 1 }} />
          <Switch value={setOnPin} onValueChange={setSetOnPin} />
        </Pressable>

<<<<<<< HEAD


        {/* Passenger summary chip */}
            {(totalPassengers > 0 || totalSeats > 0) && (
                <Pressable style={styles.summaryChip} onPress={openAddPassenger}>
                <Ionicons name="people-outline" size={16} color="#111" />
                <Text style={styles.summaryText}>{chipText}</Text>
                <Text style={styles.summaryEdit}>Edit</Text>
                </Pressable>
            )}

            <Text>{`Adults ${passengers.adults} · Children ${passengers.children} · Infants ${passengers.infants}`}</Text>

            <Text style={styles.summaryText}>
            {summarizeLuggage(luggage)}   {/* e.g., “L 1 · Carry-on 2 · Golf 1” */}
            </Text>


        {/* Info bullets */}
        <View style={{ marginTop: 155, gap: 14 }}>
          <View style={styles.bullet}>
            <Ionicons name="time-outline" size={18} color="#111" />
            <View style={{ flex: 1 }}>
              <Text style={styles.bTitle}>Traffic or Rush Hour? Flat Rate!</Text>
              <Text style={styles.bBody}>
                No worries! Enjoy a flat rate with no surge pricing, no per-KM or per-MIN changes, and no hidden fees.
=======
        {/* Passenger summary chip (tap to edit) */}
        {(totalPassengers > 0 || totalSeats > 0) && (
          <Pressable style={styles.summaryChip} onPress={openAddPassenger}>
            <Ionicons name="people-outline" size={16} color={TEXT} />
            <Text style={styles.summaryText} numberOfLines={1}>
              {chipText}
            </Text>
            <Text style={styles.summaryEdit}>Edit</Text>
          </Pressable>
        )}

        {/* tiny meta / readouts */}
        <Text
          style={styles.inlineMeta}
          numberOfLines={1}
        >{`Adults ${passengers.adults} · Children ${passengers.children} · Infants ${passengers.infants}`}</Text>
        <Text style={[styles.inlineMeta, { marginTop: 4 }]} numberOfLines={1}>
          {summarizeLuggage(luggage)}
        </Text>
        {!!whenText && (
          <Text style={[styles.inlineMeta, { marginTop: 4 }]} numberOfLines={1}>
            {'Selected Date and Time: ' + whenText}
          </Text>
        )}

        {/* Spacer pushes bullets near bottom, keeping room for CTA */}
        <View style={{ flex: 1 }} />

        {/* Info bullets */}
        <View style={{ gap: 16 }}>
          <View style={styles.bullet}>
            <Image
              source={assets.images.traffic}
              style={{ width: 20, height: 20, resizeMode: 'contain' }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.bTitle}>
                Traffic or Rush Hour? Flat Rate!
              </Text>
              <Text style={styles.bBody}>
                No worries! Enjoy a flat rate with no surge pricing, no per-KM
                or per-MIN charges, and no hidden fees.
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
              </Text>
            </View>
          </View>

          <View style={styles.bullet}>
<<<<<<< HEAD
            <Ionicons name="shield-checkmark-outline" size={18} color="#111" />
            <View style={{ flex: 1 }}>
              <Text style={styles.bTitle}>Guaranteed</Text>
              <Text style={styles.bBody}>
                20+ Years of Reliable Pickups. hop’n guarantees on-time service with no cancellations.
=======
            <Image
              source={assets.images.securityIcon}
              style={{ width: 20, height: 20, resizeMode: 'contain' }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.bTitle}>Guaranteed</Text>
              <Text style={styles.bBody}>
                20+ Years of Reliable Pickups. hop’n guarantees on-time service
                with no cancellations.
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
              </Text>
            </View>
          </View>
        </View>
<<<<<<< HEAD
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottom}>
        <Pressable style={styles.cta} onPress={() => {openAddPassenger ()}}>
          <Text style={styles.ctaText}>+ Add Passenger</Text>
          <View style={styles.ctaArrow}>
            <AntDesign name="arrowright" size={18} color="#111" />
=======
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottom}>
        <Pressable style={styles.cta} onPress={openAddPassenger}>
          <Text style={styles.ctaText}>Add Passenger</Text>
          <View style={styles.ctaArrow}>
            <AntDesign name="arrowright" size={18} color={TEXT} />
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
<<<<<<< HEAD
    height: 56, paddingHorizontal: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  hBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'center',
  },
  hTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  doneBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  doneText: { color: '#111', fontWeight: '700' },

  block: {
    backgroundColor: '#F6F7F8',
    borderRadius: 16,
    padding: 12,
  },

  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: '#EFEFEF',
  },
  rowIconWrap: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: MINT, alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  rowTextWrap: { flex: 1 },
  rowLabel: { fontSize: 12, color: '#888' },
  rowValue: { fontSize: 14, color: '#111', fontWeight: '600' },
  plusBadge: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: MINT, alignItems: 'center', justifyContent: 'center',
    marginLeft: 8,
  },
  helper: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6, marginTop: 8,
  },
  helperText: { color: '#666' },

  pinRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 16, gap: 10, paddingHorizontal: 6,
  },
  pinText: { color: '#111', fontWeight: '600' },

  bullet: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bTitle: { color: '#111', fontWeight: '700' },
  bBody: { color: '#666', marginTop: 2 },

  bottom: {
    position: 'absolute', left: 0, right: 0, bottom: 35,
    padding: 16, paddingBottom: 24, backgroundColor: 'transparent',
  },
  cta: {
    height: 48, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaArrow: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: MINT,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 6,
  },
=======
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hTitle: { fontSize: 16, color: TEXT, fontFamily: FONTS.bold },
  doneBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  doneText: { color: TEXT, fontFamily: FONTS.bold },

  // non-scroll container
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 140, // keep clear of CTA
  },

  block: {
    backgroundColor: BG,
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
  },

  row: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  rowIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowTextWrap: { flex: 1 },
  rowLabel: { fontSize: 12, color: '#6F7378', fontFamily: FONTS.semibold },
  rowValue: { fontSize: 14.5, color: TEXT, fontFamily: FONTS.bold, marginTop: 2 },
  plusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  helper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 6,
    marginTop: 16,
  },
  helperText: { color: TEXT, paddingVertical: 3, fontFamily: FONTS.medium },
  helperPlus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 6,
    marginTop: 16,
  },
  pinText: { color: TEXT, fontFamily: FONTS.bold },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  summaryChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
<<<<<<< HEAD
    backgroundColor: '#F6F7F8',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginTop: 12,
    marginHorizontal: 16,
  },
  summaryText: { color: '#111', fontWeight: '600' },
  summaryEdit: { color: '#4F8EF7', fontWeight: '700', marginLeft: 6 },
=======
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: 12,
  },
  summaryText: { color: TEXT, fontFamily: FONTS.bold, maxWidth: '70%' },
  summaryEdit: { color: '#4F8EF7', fontFamily: FONTS.bold, marginLeft: 6 },

  inlineMeta: { color: '#50545A', marginTop: 10, fontFamily: FONTS.regular },

  bullet: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bTitle: { color: TEXT, fontFamily: FONTS.bold },
  bBody: { color: '#666', marginTop: 2, lineHeight: 18, fontFamily: FONTS.regular },

  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    paddingHorizontal: 16,
  },
  cta: {
    height: 52,
    borderRadius: 28,
    backgroundColor: TEXT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#fff', fontFamily: FONTS.bold },
  ctaArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});
