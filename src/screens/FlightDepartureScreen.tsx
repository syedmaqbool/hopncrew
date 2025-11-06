// src/screens/FlightDepartureScreen.tsx
import React from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import assets from '../../assets';
import { FONTS } from '../../src/theme/fonts';
import type { Destination, RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FlightDeparture'>;

const MINT = '#B9FBE7';
const TEXT = '#111';
const BG = '#F6F7F8';
const BORDER = '#ECEDEE';

export default function FlightDepartureScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const airportCode = route.params?.airportCode ?? 'YYZ';

  const openOriginPicker = () => {
    navigation.navigate('SelectDeparture', {
      when: route.params?.when,
      onPick: (d: Destination) => {
        route.params?.onPick?.(d);
      },
      onPickAirline: code => {
        // Optional: capture airline code here later if needed
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Map-like header background (same as ScheduleRide) */}
      <ImageBackground
        source={assets.images.Sbg}
        style={[styles.headerImg, { paddingTop: insets.top + 8 }]}
        imageStyle={styles.headerImgRadius}
        resizeMode="cover"
      >
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backCircle}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={18} color={TEXT} />
          </Pressable>
          <Text style={styles.headerTitle}>Schedule a Ride</Text>
          <View style={{ width: 36, height: 36 }} />
        </View>
      </ImageBackground>

      {/* Content sheet */}
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        <Text style={styles.bigTitle}>{`Your flight to ${airportCode}`}</Text>

        {/* Departure airport card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Departure airport</Text>
          <Pressable style={styles.pill} onPress={openOriginPicker}>
            <Ionicons name="airplane-outline" size={18} color={TEXT} />
            <Text style={styles.pillText}>Where are you flying from?</Text>
            <View style={styles.pillRight}>
              <Ionicons name="chevron-down" size={16} color={TEXT} />
            </View>
          </Pressable>
        </View>

        {/* Info bullets */}
        <View style={{ gap: 16, marginTop: 22 }}>
          <Row
            icon={<Ionicons name="location-outline" size={18} color={TEXT} />}
            title="Estimated drop-off time"
            body="Arrive at destination at approx. 3:45AM"
          />
          <View style={styles.sep} />
          <Row
            icon={<Ionicons name="time-outline" size={18} color={TEXT} />}
            title="Complimentary wait time"
            body="Chauffeur will wait 15 minutes free of charge"
          />
          <View style={styles.sep} />
          <Row
            icon={<Ionicons name="card-outline" size={18} color={TEXT} />}
            title="Flexible cancellation"
            body="Free of charge cancellation up to 1 hour before pickup"
          />
        </View>

        <Pressable style={styles.linkRow} onPress={() => navigation.navigate('AirportPickupPerks')}>
          <Text style={styles.linkText}>More airport pickup Perks</Text>
          <AntDesign name="arrowright" size={16} color={TEXT} />
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

function Row({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.rowInfo}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImg: {
    height: 360,
    justifyContent: 'flex-start',
    paddingHorizontal: 26,
  },
  headerImgRadius: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backCircle: {
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
  headerTitle: { color: TEXT, fontSize: 18, fontFamily: FONTS.regular },

  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  bigTitle: {
    fontSize: 22,
    color: TEXT,
    marginTop: 8,
    fontFamily: FONTS.bold,
  },

  card: {
    backgroundColor: BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginTop: 26,
  },
  cardTitle: { color: TEXT, marginBottom: 10, fontFamily: FONTS.bold },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pillText: { color: TEXT, flex: 1, fontFamily: FONTS.bold },
  pillRight: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rowInfo: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  rowTitle: { color: TEXT, fontFamily: FONTS.bold },
  rowBody: { color: '#666', marginTop: 2, fontFamily: FONTS.regular },
  sep: { height: 1, backgroundColor: '#EFEFEF' },

  linkRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 26,
  },
  linkText: { color: TEXT, textDecorationLine: 'underline', fontFamily: FONTS.regular },
});
