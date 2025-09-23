// src/screens/TripScreen.tsx
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
const DEFAULT_PAX: PassengerCounts = {
  adults: 1,
  children: 0,
  infants: 0,
  seats: { infantRear: 0, toddlerRear: 0, toddlerFront: 0 },
};


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
        which === 'start' ? setStart(d) : setDest(d);
      },
    });
  };

  const openAddPassenger = () => {
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



  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
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
        <View style={styles.block}>
          {/* Start */}
          <Pressable style={styles.row} onPress={() => openPlaces('start')}>
            <View style={styles.rowIconWrap}>
              <Ionicons name="location-outline" size={16} color="#111" />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowLabel}>Start</Text>
              <Text style={styles.rowValue} numberOfLines={2}>
                {start?.description ?? 'Choose start point'}
              </Text>
            </View>
          </Pressable>

          {/* Destination */}
          <Pressable style={[styles.row, { marginTop: 10 }]} onPress={() => openPlaces('dest')}>
            <View style={[styles.rowIconWrap, { backgroundColor: '#EAEAEA' }]}>
              <MaterialIcons name="flag" size={16} color="#111" />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowLabel}>Destination</Text>
              <Text style={[styles.rowValue, !dest && { color: '#9AA0A6' }]} numberOfLines={1}>
                {dest?.description ?? 'Where are you going?'}
              </Text>
            </View>
            <View style={styles.plusBadge}>
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
            </Pressable>
          </View>
        </View>

        {/* Set on pin */}
        <Pressable style={styles.pinRow} onPress={() => setSetOnPin(!setOnPin)}>
          <Ionicons name="pin-outline" size={18} color="#111" />
          <Text style={styles.pinText}>Set location on pin</Text>
          <View style={{ flex: 1 }} />
          <Switch value={setOnPin} onValueChange={setSetOnPin} />
        </Pressable>



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
              </Text>
            </View>
          </View>

          <View style={styles.bullet}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#111" />
            <View style={{ flex: 1 }}>
              <Text style={styles.bTitle}>Guaranteed</Text>
              <Text style={styles.bBody}>
                20+ Years of Reliable Pickups. hop’n guarantees on-time service with no cancellations.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottom}>
        <Pressable style={styles.cta} onPress={() => {openAddPassenger ()}}>
          <Text style={styles.ctaText}>+ Add Passenger</Text>
          <View style={styles.ctaArrow}>
            <AntDesign name="arrowright" size={18} color="#111" />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
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

  summaryChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F6F7F8',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginTop: 12,
    marginHorizontal: 16,
  },
  summaryText: { color: '#111', fontWeight: '600' },
  summaryEdit: { color: '#4F8EF7', fontWeight: '700', marginLeft: 6 },
});
