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

const MINT = '#B1FBE3';
const TEXT = '#201E20';
const BORDER = '#CFCDCD';

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
        <Pressable style={styles.backHit} onPress={() => navigation.goBack()}>
           <Image
                                    source={require('../../assets/icons/left-line-arrow-icon.png')}
                                    alt="left-arrow"
                                    style={{ height: 88, width: 98 }}
                                  />
        </Pressable>
        <Text style={styles.hTitle}>Select Flight</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* === Airline selector card (top) === */}
        <View style={styles.comboCard}>
          {/* Left rail */}
          <View style={styles.rail}>
            {/* <Ionicons name="airplane-outline" size={18} color={TEXT} /> */}
            <Image source={require('../../assets/icons/flight-plane.png')} alt='flight-date-time' style={{width:24,height:24}} />
            <View style={styles.railLine} />
            {/* <Ionicons name="airplane-outline" size={18} color={TEXT} /> */}
            <Image source={require('../../assets/icons/flight-plane.png')} alt='flight-date-time' style={{width:24,height:24}} />
          </View>

          {/* Right content */}
          <View style={{ flex: 1 }}>
            <View style={styles.comboRowTop}>
              <Text style={styles.comboTitle}>
                Select the airline you’r flying with
              </Text>
            </View>

            <View style={styles.comboDivider} />

            <Pressable
              style={styles.comboRowBottom}
              onPress={() => setOpen(prev => !prev)}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.dropdownText,
                  !airline && { color: '#9AA0A6' },
                ]}
              >
                {airline
                  ? `${
                      AIRLINES.find(a => a.code === airline)?.name ?? airline
                    } (${airline})`
                  : 'Select an airline'}
              </Text>
              <Ionicons
                name={open ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#201E20"
              />
            </Pressable>
          </View>
        </View>

        {/* Dropdown list under card */}
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
                  <Ionicons name="airplane-outline" size={14} color={TEXT} />
                </View>
                <Text
                  style={styles.menuText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {a.name} ({a.code})
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* === Flight cards container (two flights inside, like design) === */}
        <View style={styles.flightContainer}>
          {[1, 2].map((i, idx, arr) => {
            const isSelected = i === 2; // second one mint icon like screenshot
            return (
              <View key={i}>
                <View style={styles.flightCardInner}>
                  <Text style={styles.flightAir}>
                    <Text style={styles.flightAirLight}>
                      {AIRLINES.find(a => a.code === airline)?.name ??
                        'Air Canada'}{' '}
                      -{' '}
                    </Text>
                    <Text style={styles.flightAirStrong}>AC6669</Text>
                  </Text>

                  <View style={styles.flightRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.city}>
                        {airport.description.split(',')[0]} (AUH)
                      </Text>
                      {/* <Text style={styles.meta}>Airport</Text> */}
                      <Text style={styles.time}>8:10 AM</Text>
                      <Text style={styles.date}>Fri, Mar 9</Text>
                    </View>

                    <View
                      style={[
                        styles.midIcon,
                        { backgroundColor: isSelected ? MINT : '#F3F4F6' },
                      ]}
                    >
                      <Image source={require('../../assets/icons/flight-bg-icon.png')} alt='flight-bg-icon' style={{height:28,width:28}} />
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Text style={styles.city}>Toronto (YYZ)</Text>
                      {/* <Text style={styles.meta}>Airport</Text> */}
                      <Text style={styles.time}>7:22 PM</Text>
                      <Text style={styles.date}>Fri, Mar 9</Text>
                    </View>
                  </View>
                </View>

                {idx !== arr.length - 1 && <View style={styles.flightDivider} />}
              </View>
            );
          })}
        </View>

        {/* Manual entry */}
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
          <Ionicons name="chevron-forward" size={18} color={"#8D8E8F"} />
        </Pressable>

        {/* Mint info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Image
              source={require('../../assets/icons/delay-timer.png')}
              alt="delay"
              style={{
                width: 32,
                height: 32,
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

        {/* Change link */}
        <Text style={styles.changeRow}>
          Not your flight?{' '}
          <Text
            style={styles.changeLink}
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
          <Text style={[styles.changeRow, { marginTop: 6 }]}>
            Flight: {flightNo}
          </Text>
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

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    gap:12
  },
  backHit: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  hTitle: {
    marginLeft: 4,
    color: TEXT,
    fontSize: 18,
    fontFamily: FONTS.regular,
    lineHeight:32
  },

  /* Airline combo card */
  comboCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginTop: 4,
    marginBottom: 2,
  },
  rail: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 12,
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
    justifyContent: 'center',
  },
  comboRowBottom: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  comboTitle: {
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
  },
  comboDivider: {
    height: .5,
    backgroundColor: BORDER,
    marginVertical: 6,
    marginRight: 4,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  /* Airline dropdown list */
  menu: {
    marginTop: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  airlineIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  menuText: {
    flex: 1,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  /* Flight cards container */
  flightContainer: {
    marginTop: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  flightCardInner: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  flightDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginHorizontal: 18,
  },
  flightAir: {
    marginBottom: 8,
  },
  flightAirLight: {
    color: '#585858',
    fontFamily: FONTS.regular,
    fontSize:14
  },
  flightAirStrong: {
    color: '#585858',
    fontSize:16,
    fontFamily: FONTS.semibold,
  },
  flightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  city: {
    color: TEXT,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  meta: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  time: {
    marginTop: 4,
    fontSize: 24,
    color: TEXT,
    fontFamily: FONTS.semibold,
  },
  date: {
    marginTop: 2,
    color: TEXT,
    fontSize: 15,
    fontFamily: FONTS.regular,
  },
  midIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 18,
    paddingTop:6
  },

  /* Manual entry row */
  manualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  manualText: {
    color: TEXT,
    fontSize: 18,
    fontFamily: FONTS.semibold,
  },

  /* Info card */
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent:'flex-start',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: '#B1FBE3',
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoTitle: {
    color: TEXT,
    fontFamily: FONTS.semibold,
    marginBottom: 2,
    fontSize:16,
  },
  infoBody: {
    color: "#524E4E",
    fontSize: 14,
    fontFamily: FONTS.regular,
  },

  /* Change link */
  changeRow: {
    marginTop: 18,
    textAlign: 'center',
    color: TEXT,
    fontFamily: FONTS.regular,
  },
  changeLink: {
    textDecorationLine: 'underline',
    fontSize:16,
    color:TEXT,
    fontFamily: FONTS.regular,
  },

  /* Bottom CTA */
  bottom: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cta: {
    height: 56,
    borderRadius: 999,
    backgroundColor: TEXT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#fff',
    fontFamily: FONTS.semibold,
    fontSize: 17,
  },
  ctaIcon: {
    position: 'absolute',
    right: 8,
    width: 44,
    height: 44,
    borderRadius: 32,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
