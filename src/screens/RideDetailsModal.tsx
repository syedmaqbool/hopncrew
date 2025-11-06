import React from 'react';
import {
  View, Text, StyleSheet, Pressable, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const MINT = '#B9FBE7';

type Props = NativeStackScreenProps<RootStackParamList, 'RideDetails'>;

export default function RideDetailsModal({ navigation, route }: Props) {
  const { ride, onCancel } = route.params;

  const handleCancel = () => {
    onCancel?.(ride.id);
    navigation.goBack();
  };

  return (
    <View style={styles.fill}>
      {/* keep map visible behind */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        <View style={styles.sheet}>
          {/* Top row: back/close */}
          {/* <View style={styles.topBar}>
            <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={18} color="#111" />
            </Pressable>
            <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={18} color="#111" />
            </Pressable>
          </View> */}

        

          {/* Driver + status */}
          <View style={styles.driverCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.avatarWrap}>
                {/* <Image source={ride.driver.avatar} style={styles.avatar} /> */}
                {/* <MaterialCommunityIcons name="account-circle" size={48} color="#8C9198" /> */}
                <Image
                            source={{ uri: 'https://i.pravatar.cc/100?img=5' }}
                            style={styles.avatar}
                          />
                <View style={styles.ratingPill}>
                  <Ionicons name="star" size={10} color="#fff" />
                  <Text style={styles.ratingTxt}>{ride.driver.rating.toFixed(1)}</Text>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.driverName}>{ride.driver.name}</Text>
                <Text style={styles.driverSub}>
                  {ride.driver.carPlate} · {ride.driver.carModel}
                </Text>
              </View>
              
            </View>

            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <View style={styles.statusPill}>
                <Text style={styles.statusTxt}>{ride.status}</Text>
              </View>
              <Text style={styles.whenTxt}>{ride.whenLabel}</Text>
            </View>
          </View>

          {/* Route card */}
          <View style={styles.routeCard}>
            <View style={styles.routeRow}>
              <Ionicons name="location-outline" size={16} color="#6C7075" />
              <Text style={styles.routeText}>{ride.from}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.routeRow}>
              <Ionicons name="pin-outline" size={16} color="#6C7075" />
              <Text style={styles.routeText}>{ride.to}</Text>
            </View>
          </View>

          {/* Metrics */}
          <View style={styles.metricsRow}>
            <View>
              <Text style={styles.metricLabel}>Distance</Text>
              <Text style={styles.metricValue}>{ride.distanceKm.toFixed(1)} km</Text>
            </View>
            <View>
              <Text style={styles.metricLabel}>Time</Text>
              <Text style={styles.metricValue}>{ride.timeLabel}</Text>
            </View>
          </View>

          {/* Fare */}
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Total Fare :</Text>
            <Text style={styles.fareValue}>${ride.fare.toFixed(2)}</Text>
          </View>

          {/* CTA */}
          {ride.status === 'Upcoming' ? (
            <Pressable style={styles.cta} onPress={handleCancel}>
              <Text style={styles.ctaText}>Cancel Ride</Text>
              <View style={styles.ctaIcon}>
                <Ionicons name="close" size={18} color="#111" />
              </View>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },

  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  roundBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#EEE',
    alignItems: 'center', justifyContent: 'center',
  },

  mapThumb: {
    height: 140,
    marginHorizontal: 16, borderRadius: 16,
    backgroundColor: '#EEF1F4',
    alignItems: 'center', justifyContent: 'center',
  },

  driverCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginHorizontal: 16, marginTop: 12,
    padding: 12,
    borderRadius: 16, backgroundColor: '#fff',
    borderWidth: 0, borderColor: '#EFEFEF',
  },
  avatarWrap: { position: 'relative',  },
  avatar: { width: 48, height: 48, borderRadius: 24, },
  ratingPill: {
    position: 'absolute', bottom: -6, left: 8,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#111', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10,
  },
  ratingTxt: { color: '#fff', fontSize: 10, fontFamily: FONTS.bold },
  driverName: { color: '#111', fontFamily: FONTS.bold },
  driverSub: { color: '#6C7075', marginTop: 2, fontFamily: FONTS.regular },

  statusPill: {
    alignSelf: 'flex-end',
    borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10,
    backgroundColor: '#F3F4F5', borderWidth: 1, borderColor: '#EDEDED',
  },
  statusTxt: { color: '#111', fontSize: 12, fontFamily: FONTS.bold },
  whenTxt: { color: '#6C7075', fontSize: 12, fontFamily: FONTS.regular },

  routeCard: {
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 16, backgroundColor: '#F6F7F8',
    padding: 12,
  },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  routeText: { color: '#111', flex: 1 },
  divider: { height: 1, backgroundColor: '#EDEDED', marginVertical: 4 },

  metricsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginHorizontal: 16, marginTop: 14,
  },
  metricLabel: { color: '#6C7075', fontSize: 12 },
  metricValue: { color: '#111', marginTop: 4, fontFamily: FONTS.bold },

  fareRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginHorizontal: 16, marginTop: 14, alignItems: 'center',
  },
  fareLabel: { color: '#6C7075', fontFamily: FONTS.bold },
  fareValue: { color: '#111', fontFamily: FONTS.bold },

  cta: {
    margin: 16, height: 50, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: { color: '#fff', fontFamily: FONTS.bold },
  ctaIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: MINT, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 10, },
});
