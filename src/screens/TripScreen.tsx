// src/screens/TripScreen.tsx
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
const BG = '#EFEFEF';
const BORDER = '#ECEDEE';
const TEXT = '#201E20';
const MUTED = '#9AA0A6';

const DEFAULT_PAX: PassengerCounts = {
  adults: 1,
  children: 0,
  infants: 0,
  seats: { infantRear: 0, toddlerRear: 0, toddlerFront: 0 },
};

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
        which === 'start' ? setStart(d) : setDest(d);
      },
    });
  };

  const openAddPassenger = () => {
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

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
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
        <View style={styles.block}>
          {/* Start */}
          <Pressable style={styles.row} onPress={() => openPlaces('start')}>
            <View style={styles.rowIconWrap}>
              {/* <Ionicons name="radio-button-on-outline" size={16} color={TEXT} /> */}
              <Image source={require('../../assets/icons/start-icon.png')} alt='start' style={{width:24, height:24}} />
              <Text style={styles.rowLabel}>Start</Text>
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowValue} numberOfLines={2}>
                {start?.description ?? 'Choose start point'}
              </Text>
            </View>
          </Pressable>

          {/* Destination */}
          <Pressable
            style={[styles.row, { marginTop: 12 }]}
            onPress={() => openPlaces('dest')}
          >
            <View style={styles.rowIconWrap}>
              <Image source={require('../../assets/icons/dest-icon.png')} alt='dest' style={{width:22, height:26}} />
              <Text style={styles.rowLabeltwo}>Destination</Text>
              {/* <MaterialIcons name="flag" size={16} color={TEXT} /> */}
            </View>
            <View style={styles.rowTextWrap}>
              <Text
                style={[styles.rowValue, !dest && { color: MUTED }]}
                numberOfLines={1}
              >
                {dest?.description ?? 'Where are you going?'}
              </Text>
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
              // style={styles.helperPlus}
            >
              <Image source={require('../../assets/icons/plus-bg-icon.png')} alt='plus' style={{height:31,width:32}} />
              {/* <AntDesign name="plus" size={22} color={TEXT} /> */}
            </Pressable>
          </View>
        </View>

        {/* Set on pin */}
        {/* <Pressable style={styles.pinRow} onPress={() => setSetOnPin(!setOnPin)}>
          <Image
            source={assets.images.locationPin}
            style={{ width: 20, height: 20, resizeMode: 'contain' }}
          />
          <Text style={styles.pinText}>Set location on pin</Text>
          <View style={{ flex: 1 }} />
          <Switch value={setOnPin} onValueChange={setSetOnPin} />
        </Pressable> */}

        {/* Passenger summary chip (tap to edit) */}
        {/* {(totalPassengers > 0 || totalSeats > 0) && (
          <Pressable style={styles.summaryChip} onPress={openAddPassenger}>
            <Ionicons name="people-outline" size={16} color={TEXT} />
            <Text style={styles.summaryText} numberOfLines={1}>
              {chipText}
            </Text>
            <Text style={styles.summaryEdit}>Edit</Text>
          </Pressable>
        )} */}

        {/* tiny meta / readouts */}
        {/* <Text
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
        )} */}

        {/* Spacer pushes bullets near bottom, keeping room for CTA */}
        {/* <View style={{ flex: 1 }} /> */}

        {/* Info bullets */}
        <View style={{ gap: 18, height:355, flexDirection:'column', justifyContent:'flex-end',alignItems:'flex-end' }}>
          <View style={styles.bullet}>
            <Image
              source={assets.images.traffic}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.bTitle}>
                Traffic or Rush Hour? Flat Rate!
              </Text>
              <Text style={styles.bBody}>
                No worries! Enjoy a flat rate with no surge pricing, no per-KM
                or per-MIN charges, and no hidden fees.
              </Text>
            </View>
          </View>

          <View style={styles.bullet}>
            <Image
              source={assets.images.securityIcon}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.bTitle}>Guaranteed</Text>
              <Text style={styles.bBody}>
                20+ Years of Reliable Pickups. hop’n guarantees on-time service
                with no cancellations.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottom}>
        <Pressable style={styles.cta} onPress={openAddPassenger}>
          <Text style={styles.ctaText}>+ Add Passenger</Text>
          <View style={styles.ctaArrow}>
            <Image source={require('../../assets/icons/right-line-arrow-icon.png')} alt='right-arrow' style={{width:22,height:12}} />
            {/* <AntDesign name="arrowright" size={24} color={TEXT} /> */}
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#201E20',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.10,
  shadowRadius: 12,
  elevation: 4,
  },
  hTitle: { fontFamily: FONTS.regular, fontSize: 18},
  doneBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  doneText: { color: TEXT, fontFamily: FONTS.regular, fontSize: 18 },

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
    // flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical:12,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  rowIconWrap: {
    width: 150,
    height: 25,
    borderRadius: 16,
    // backgroundColor: MINT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // marginRight: 16,
    gap: 10,
  },
  rowTextWrap: { flex: 1 },
  rowLabel: { fontSize: 18, color: '#524E4E', fontFamily: FONTS.semibold, marginLeft: 4 },
  rowLabeltwo: { fontSize: 18, color: '#377EDB', fontFamily: FONTS.semibold, marginLeft: 4 },
  rowValue: { fontSize: 18, color: '#201E20', fontFamily: FONTS.semibold, marginTop: 4 ,marginLeft: 37 },
  plusBadge: {
    width: 28,
    height: 28,
    borderRadius: 16,
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
  helperText: { color: "#201E20", paddingVertical: 3, fontFamily: FONTS.regular,fontSize: 16 },
  helperPlus: {
    width: 32,
    height: 31,
    borderRadius: 14,
    backgroundColor: "#B1FBE3",
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

  summaryChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: 12,
  },
  summaryText: { color: TEXT, fontFamily: FONTS.bold, maxWidth: '70%' },
  summaryEdit: { color: '#4F8EF7', fontFamily: FONTS.bold, marginLeft: 6 },

  inlineMeta: { color: '#50545A', marginTop: 10, fontFamily: FONTS.regular },

  bullet: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bTitle: { color: TEXT, fontFamily: FONTS.semibold, fontSize: 16 },
  bBody: { color: '#8D8E8F', marginTop: 4, lineHeight: 18, fontFamily: FONTS.regular,fontSize: 14 },

  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 36,
    paddingHorizontal: 16,
  },
  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: TEXT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#FCFCFC', fontFamily: FONTS.semibold, fontSize: 17 },
  ctaArrow: {
    width: 44,
    height: 44,
    borderRadius: 32,
    backgroundColor: "#B1FBE3",
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
  },
});
