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

type Props = NativeStackScreenProps<RootStackParamList, 'FlightDetails'>;

const TEXT = '#111';
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
          <Ionicons name="close" size={22} color={TEXT} />
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
            style={{ width: 48, height: 48, resizeMode: 'contain' }}
          />
          <View>
            <Text style={styles.title}>{`Your flight to ${airportCode}`}</Text>
            <Text style={styles.sub}>Add your flight details below</Text>
          </View>
        </View>

        {/* Cards */}
        <View style={{ gap: 12, marginTop: 16 }}>
          <Pressable style={styles.row} onPress={startSchedule}>
            <View style={styles.rowLeftIcon}>
              <Ionicons name="calendar-outline" size={18} color={TEXT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Data and time</Text>
              <Text style={styles.rowHint}>{whenLabel}</Text>
            </View>
            <View style={styles.rowRightBadge}>
              <Ionicons name="chevron-down" size={18} color={TEXT} />
            </View>
          </Pressable>

          <Pressable style={styles.row} onPress={pickFrom}>
            <View style={styles.rowLeftIcon}>
              <Ionicons name="airplane-outline" size={18} color={TEXT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Where are you flying from?</Text>
              <Text style={[styles.rowHint, !from && { color: '#9AA0A6' }]}>
                {from?.description ?? 'Select origin airport/city'}
              </Text>
            </View>
            <View style={styles.rowRightBadge}>
              <AntDesign name="arrowright" size={16} color={TEXT} />
            </View>
          </Pressable>
        </View>

        {/* Info bullets */}
        <View style={{ gap: 12, marginTop: 18 }}>
          <View style={styles.infoRow}>
            <Ionicons name="infinite" size={18} color={TEXT} />
            <Text style={styles.infoText}>
              Lost baggage? Customs or immigration delays? No worries—your
              driver will wait as long as needed
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="sync-outline" size={18} color={TEXT} />
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
    height: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  hBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: '800', color: TEXT, marginTop: 8 },
  sub: { color: '#666', marginTop: 4 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  rowLeftIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowTitle: { color: TEXT, fontWeight: '800' },
  rowHint: { color: '#666', marginTop: 2 },
  rowRightBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  infoRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  infoText: { color: '#555', lineHeight: 20, flex: 1 },

  faqRow: {
    height: 70,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqTitle: { color: TEXT, fontWeight: '700', flex: 1, marginRight: 12 },
  faqBody: { color: '#666', marginTop: 8, lineHeight: 18 },

  linkRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  linkText: {
    color: TEXT,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },

  cta: {
    marginTop: 20,
    height: 52,
    borderRadius: 28,
    backgroundColor: TEXT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  ctaText: { color: '#fff', fontWeight: '800' },
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
