// src/screens/FlightDepartureScreen.tsx
import React from 'react';
import {
  Image,
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

const MINT = '#B1FBE3';
const TEXT = '#201E20';
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

  function Bullet({
    icon,
    title,
    body,
  }: {
    icon: React.ReactNode;
    title: string;
    body: string;
  }) {
    return (
      <View style={{ flexDirection: 'row', gap: 10,alignItems:'center',justifyContent:'center' }}>
        <View style={styles.bulletIcon}>{icon}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bulletTitle}>{title}</Text>
          <Text style={styles.bulletBody}>{body}</Text>
        </View>
      </View>
    );
  }

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
            <Image
                          source={require('../../assets/icons/left-line-arrow-icon.png')}
                          alt="left-arrow"
                          style={{ height: 88, width: 98 }}
                        />
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
            {/* <Ionicons name="airplane-outline" size={18} color={TEXT} /> */}
                          <Image source={require('../../assets/icons/flight-plane.png')} alt='flight-date-time' style={{width:24,height:24}} />
            <Text style={styles.pillText}>Where are you flying from?</Text>
            <View style={styles.pillRight}>
              <Ionicons name="chevron-down" size={16} color={TEXT} />
            </View>
          </Pressable>
        </View>

        {/* Info bullets */}
        {/* <View style={{ gap: 16, marginTop: 22 }}>
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
        </Pressable> */}
        <View style={styles.bulletsWrap}>
                    <Bullet
                      icon={
                        <Image source={require('../../assets/icons/flight-loc-undot-icon.png')} alt='flight-loc' style={{height:24,width:24}} />
                        // <Ionicons name="alert-circle-outline" size={18} color="#111" />
                      }
                      title="Estimated drop-off time"
                      body="Arrive at destination at approx. 3:45AM."
                    />
                    <View style={styles.separator} />
                    <Bullet
                      icon={
                        <Image source={require('../../assets/icons/timer-icon.png')} alt='flight-loc' style={{height:24,width:24}} />
                      // <Ionicons name="time-outline" size={18} color="#111" />
                    }
                      title="Complimentary wait time"
                      body="Chauffeur will wait 15 minutes free of charge"
                    />
                    <View style={styles.separator} />
                    <Bullet
                      icon={
                        <Image source={require('../../assets/icons/flight-cancel-icon.png')} alt='flight-loc' style={{height:24,width:24}} />
                      // <Ionicons name="card-outline" size={18} color="#111" />
                    }
                      title="Flexible cancellation"
                      body="Free of charge cancellation up to 1 hour before pickup"
                    />
        
                    <Pressable
                      style={styles.linkRow}
                      onPress={() => navigation.navigate('AirportPickupPerks')}
                    >
                      <Text style={styles.linkText}>More airport pickup Perks</Text>
                      <AntDesign name="arrowright" size={16} color="#111" />
                    </Pressable>
                  </View>
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
    height: 280,
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
    fontSize: 24,
    color: TEXT,
    marginVertical: 14,
    fontFamily: FONTS.semibold,
    lineHeight:32
  },

  card: {
    backgroundColor: BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginTop: 26,
  },
  cardTitle: { color: TEXT, marginBottom: 10, fontFamily: FONTS.semibold,fontSize:18 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#CFCDCD",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pillText: { color: TEXT, flex: 1, fontFamily: FONTS.semibold,fontSize:16 },
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
  linkText: { color: TEXT, textDecorationLine: 'underline', fontFamily: FONTS.regular,fontSize:16 },
  bulletsWrap: {
    gap: 14,
    paddingHorizontal: 8,
    marginVertical:44,
    // paddingTop: 10,
    // paddingBottom: 4,
  },
  separator: { height: 1, backgroundColor: '#EFEFEF', marginLeft: 42 },
  bulletIcon: {
    width: 28,
    height: 28,
    // borderRadius: 14,
    // backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bulletTitle: { color: '#201E20', fontFamily: FONTS.semibold,fontSize:16 },
  bulletBody: { color: '#8D8E8F', marginTop: 2, fontFamily: FONTS.regular,fontSize:14,lineHeight:20 },
});
