// src/screens/SelectedAirportScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Destination, RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectedAirport'>;

const MINT = '#B9FBE7';
const TEXT = '#111';
const BG = '#F6F7F8';
const BORDER = '#ECEDEE';

const AIRLINES = [
  { code: 'AC', name: 'Air Canada' },
  { code: 'WS', name: 'WestJet' },
  { code: 'AA', name: 'American Airlines' },
  { code: 'DL', name: 'Delta' },
  { code: 'UA', name: 'United' },
  { code: 'EK', name: 'Emirates' },
  { code: 'QR', name: 'Qatar Airways' },
];

export default function SelectedAirportScreen({ navigation, route }: Props) {
  const [airport, setAirport] = useState<Destination>(route.params!.airport);
  const [airline, setAirline] = useState<string | undefined>(
    route.params?.airline,
  );
  const [flightNo, setFlightNo] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [when, setWhen] = useState<Date>(route.params?.when ?? new Date());

  const whenLabel = useMemo(() => {
    const d = when;
    try {
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return d.toLocaleString();
    }
  }, [when]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.hBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color={TEXT} />
        </Pressable>
        <Text style={styles.hTitle}>Select Flight</Text>
        {/* <View style={{ width: 36 }} /> */}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Airline picker card */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* <Ionicons name="airplane-outline" size={18} color={TEXT} />
             */}
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
            <Text style={styles.cardTitle}>
              Select the airline you’r flying with
            </Text>
          </View>
          <View style={styles.divider} />
          <Pressable style={styles.dropdown} onPress={() => setOpen(!open)}>
            {/* <Ionicons name="airplane" size={16} color={TEXT} />
             */}
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
            <Text
              style={[styles.dropdownText, !airline && { color: '#9AA0A6' }]}
            >
              {airline
                ? `${
                    AIRLINES.find(a => a.code === airline)?.name ?? airline
                  } (${airline})`
                : 'Select an airline'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={TEXT} />
          </Pressable>
          {open && (
            <View style={styles.menu}>
              {AIRLINES.map(a => (
                <Pressable
                  key={a.code}
                  style={styles.menuRow}
                  onPress={() => {
                    setAirline(a.code);
                    setOpen(false);
                  }}
                >
                  <View style={styles.airlineIcon}>
                    <Ionicons name="airplane" size={14} color={TEXT} />
                  </View>
                  <Text style={styles.menuText}>
                    {a.name} ({a.code})
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Example flight cards (static demo) */}
        {[1, 2].map(i => (
          <View key={i} style={styles.flightCard}>
            <Text style={styles.flightAir}>
              {AIRLINES.find(a => a.code === airline)?.name ?? 'Air Canada'} -
              AC6669
            </Text>
            <View style={styles.flightRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.city}>
                  {airport.description.split(',')[0]}
                </Text>
                <Text style={styles.meta}>Airport</Text>
                <Text style={styles.time}>8:10 AM</Text>
                <Text style={styles.date}>Fri, Mar 9</Text>
              </View>
              <View style={styles.midIcon}>
                <Ionicons name="airplane" size={16} color={TEXT} />
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.city}>Toronto (YYZ)</Text>
                <Text style={styles.meta}>Airport</Text>
                <Text style={styles.time}>7:22 PM</Text>
                <Text style={styles.date}>Fri, Mar 9</Text>
              </View>
            </View>
          </View>
        ))}

        <Pressable
          style={styles.manualRow}
          onPress={() =>
            navigation.navigate('FlightManual', {
              initial: flightNo,
              onAdd: num => setFlightNo(num),
            })
          }
        >
          <Text style={styles.manualText}>
            Or, enter flight number manually
          </Text>
          <Ionicons name="chevron-forward" size={16} color={TEXT} />
        </Pressable>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            {/* <Ionicons name="time-outline" size={16} color={TEXT} /> */}
            <Image
              source={require('../../assets/icons/delay-timer.png')}
              alt="airplane-outline"
              style={{
                width: 24,
                height: 24,
                marginRight: 10,
                resizeMode: 'contain',
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Flight delayed?</Text>
            <Text style={styles.infoBody}>
              No problem. Your captain will track your flight and adjust your
              pickup time automatically.
            </Text>
          </View>
        </View>

        <Text style={styles.changeRow}>
          Not your flight?{' '}
          <Text
            style={{ textDecorationLine: 'underline' }}
            onPress={() =>
              navigation.navigate('SelectDeparture', {
                onPick: a => setAirport(a),
                onPickAirline: c => setAirline(c),
                when,
              })
            }
          >
            Change it here
          </Text>
        </Text>
        {!!flightNo && (
          <Text style={[styles.changeRow, { marginTop: 6 }]}>Flight: {flightNo}</Text>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottom}>
        <Pressable
          style={styles.cta}
          onPress={() =>
            navigation.navigate('Trip', {
              start: airport,
              dest: undefined,
              flow: 'airport',
              when,
            })
          }
        >
          <Text style={styles.ctaText}>{`Pick up at ${whenLabel}`}</Text>
          <View style={styles.ctaIcon}>
            <AntDesign name="arrowright" size={18} color={TEXT} />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 56,
    gap: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  hBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hTitle: { color: TEXT, fontSize: 16, fontFamily: FONTS.bold },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    marginBottom: 16,
  },
  cardTitle: { color: TEXT, fontFamily: FONTS.bold },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 8 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderColor: BORDER,
    paddingRight: 12,
    paddingVertical: 12,
  },
  dropdownText: { color: TEXT, flex: 1, fontFamily: FONTS.bold },
  menu: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  airlineIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  menuText: { color: TEXT, fontFamily: FONTS.regular },

  flightCard: {
    backgroundColor: BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    marginBottom: 12,
  },
  flightAir: { color: TEXT, opacity: 0.8, fontFamily: FONTS.bold },
  flightRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  city: { color: TEXT, fontFamily: FONTS.bold },
  meta: { color: '#777', fontFamily: FONTS.regular },
  time: { color: TEXT, fontSize: 22, marginTop: 4, fontFamily: FONTS.bold },
  date: { color: '#777', fontFamily: FONTS.regular },
  midIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },

  manualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
  },
  manualText: { color: TEXT, fontFamily: FONTS.bold },
  infoCard: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: '#CCFBE6',
    borderRadius: 16,
    padding: 12,
    marginTop: 14,
  },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: { color: TEXT, fontFamily: FONTS.bold },
  infoBody: { color: TEXT, fontFamily: FONTS.regular },
  changeRow: { color: TEXT, textAlign: 'center', marginTop: 16, fontFamily: FONTS.regular },

  bottom: { padding: 16 },
  cta: {
    height: 52,
    borderRadius: 28,
    backgroundColor: TEXT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontFamily: FONTS.bold },
  ctaIcon: {
    position: 'absolute',
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
