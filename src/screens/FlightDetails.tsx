// src/screens/FlightDetails.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  InteractionManager,
  BackHandler,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { Destination, RootStackParamList } from '../navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { FONTS } from '../../src/theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'FlightDetails'>;

const TEXT = '#201E20';
const BG = '#F6F7F8';
const BORDER = '#ECEDEE';
const MINT = '#B9FBE7';

export default function FlightDetails({ navigation, route }: Props) {
  const airportCode = route.params?.airportCode ?? 'YYZ';
  const [when, setWhen] = useState<Date>(
    route.params?.initialWhen ?? new Date(),
  );
  const [from, setFrom] = useState<Destination | null>(
    route.params?.from ?? null,
  );
  const [openGuide, setOpenGuide] = useState(false);

  const whenLabel = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(when);
    } catch {
      return when.toLocaleString();
    }
  }, [when]);

  const startSchedule = () =>
    navigation.navigate('ScheduleFlight', {
      airportCode,
      initial: when,
      onPick: (picked: Date) => setWhen(picked),
    });

  const pickFrom = () =>
    navigation.navigate('FlightDeparture', {
      airportCode,
      from: from ?? undefined,
      when,
      onPick: d => setFrom(d),
    });

  const onContinue = () => {
    // You can persist flight info via a store or params later if needed
    InteractionManager.runAfterInteractions(() => {
      navigation.replace('App');
      navigation.navigate('Trip', { flow: 'airport' });
    });
  };

  // Ensure hardware back takes user to Home (Drawer/App)
  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.replace('App');
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.hBtn}
          onPress={() => navigation.replace('App')}
        >
          <Image
                        source={require('../../assets/icons/left-line-arrow-icon.png')}
                        alt="left-arrow"
                        style={{ height: 88, width: 98 }}
                      />
          {/* <Ionicons name="close" size={22} color={TEXT} /> */}
        </Pressable>
      </View>

      <View style={styles.body}>
        {/* Title */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginVertical: 12,
          }}
        >
          <Image
            source={require('../../assets/icons/flight-icon.png')}
            alt="flight"
            style={{ width: 40, height: 40, resizeMode: 'contain' }}
          />
          <View>
            <Text style={styles.title}>{`Your flight to ${airportCode}`}</Text>
            <Text style={styles.sub}>Add your flight details below</Text>
          </View>
        </View>

        {/* Cards */}
        <View style={{ gap: 12, marginVertical: 36 }}>
          <Pressable style={styles.row} onPress={startSchedule}>
            <View style={styles.rowLeftIcon}>
              <Image source={require('../../assets/icons/flight-date-time.png')} alt='flight-date-time' style={{width:32,height:32}} />
              {/* <Ionicons name="calendar-outline" size={18} color={TEXT} /> */}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Data and time</Text>
              <Text style={styles.rowHint}>{whenLabel}</Text>
            </View>
            <View style={styles.rowRightBadge}>
              <Ionicons name="chevron-down" size={22} color={TEXT} />
            </View>
          </Pressable>

          <Pressable style={styles.row} onPress={pickFrom}>
            <View style={styles.rowLeftIcon}>
              <Image source={require('../../assets/icons/flight-plane.png')} alt='flight-date-time' style={{width:32,height:32}} />
              {/* <Ionicons name="airplane-outline" size={18} color={TEXT} /> */}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Where are you flying from?</Text>
              {/* <Text style={[styles.rowHint, !from && { color: '#9AA0A6' }]}>
                {from?.description ?? 'Select origin airport/city'}
              </Text> */}
            </View>
            <View style={styles.rowRightBadge}>
              <AntDesign name="arrowright" size={20} color={TEXT} />
            </View>
          </Pressable>
        </View>

        {/* Info bullets */}
        <View style={{ gap: 12, marginVertical: 18 }}>
          <View style={styles.infoRow}>
              <Image source={require('../../assets/icons/loop-icon.png')} alt='flight-date-time' style={{width:32,height:32}} />
            {/* <Ionicons name="infinite" size={18} color={TEXT} /> */}
            <Text style={styles.infoText}>
              Lost baggage? Customs or immigration delays? No worries—your
              driver will wait as long as needed
            </Text>
          </View>
          <View style={styles.infoRow}>
              <Image source={require('../../assets/icons/flight-timer-icon.png')} alt='flight-date-time' style={{width:32,height:32}} />
            {/* <Ionicons name="sync-outline" size={18} color={TEXT} /> */}
            <Text style={styles.infoText}>
              hop’n tracks your flight and adjusts your pickup time
              automatically. Whether it’s a flight delay or baggage hold-up,
              we’ve got you covered.
            </Text>
          </View>
        </View>

        {/* FAQ / Guide */}
        <View
          style={styles.faqRow}
          // onPress={() => setOpenGuide(!openGuide)}
        >
          <View>
            <Text style={styles.faqTitle}>
              How do I find my driver at the airport?
            </Text>
            <Text style={styles.faqBody}>
              Here's a guide on where to proceed
            </Text>
          </View>
          <View>
            <Image
              source={require('../../assets/icons/arrow-down-icon.png')}
              style={{ width: 34, height: 34, resizeMode: 'contain' }}
              alt="chevron-down"
            />
            {/* <Ionicons name={'chevron-down'} size={18} color={TEXT} /> */}
          </View>
        </View>

        <Pressable style={styles.linkRow} onPress={() => navigation.navigate('AirportPickupPerks')}>
          <Text style={styles.linkText}>More airport pickup Perks</Text>
          <AntDesign name="arrowright" size={16} color={TEXT} />
        </Pressable>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Bottom CTA */}
        <Pressable style={styles.cta} onPress={onContinue}>
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
    height: 58,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  hBtn: {
    width: 48,
    height: 48,
    borderRadius: 32,
    // backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  body: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 24, color: TEXT, marginTop: 8, fontFamily: FONTS.semibold,lineHeight:32 },
  sub: { color: TEXT, marginTop: 2, fontFamily: FONTS.regular,fontSize:18 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    // borderWidth: 1,
    // borderColor: BORDER,
    height:76
  },
  rowLeftIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowTitle: { color: TEXT, fontFamily: FONTS.semibold,fontSize:16,lineHeight:22 },
  rowHint: { color: '#8D8E8F', marginTop: 0, fontFamily: FONTS.regular,fontSize:16,lineHeight:24 },
  rowRightBadge: {
     width: 44,
    height: 44,
    borderRadius: 32,
    backgroundColor: "#B1FBE3",
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  infoRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  infoText: { color: '#201E20', lineHeight: 20, flex: 1, fontFamily: FONTS.regular ,fontSize:16},

  faqRow: {
    height: 62,
    marginTop: 16,
    padding: 10,
    paddingHorizontal:12,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
    // borderWidth: 1,
    borderColor: BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqTitle: { color: TEXT, flex: 1, marginRight: 12, fontFamily: FONTS.semibold,fontSize:16,lineHeight:22 },
  faqBody: { color: '#666', marginTop: 0, lineHeight: 20,fontFamily:FONTS.regular,fontSize:14 },

  linkRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  linkText: {
    color: TEXT,
    textDecorationLine: 'underline',
    fontFamily: FONTS.regular,
    fontSize:16
  },

  cta: {
    marginTop: 20,
    height: 56,
    borderRadius: 32,
    backgroundColor: TEXT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  ctaText: { color: '#FCFCFC', fontFamily: FONTS.semibold,fontSize:17 },
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
