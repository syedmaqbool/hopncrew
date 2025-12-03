// src/screens/RideDetailsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import assets from '../../assets';

type Props = NativeStackScreenProps<RootStackParamList, 'RideDetails'>;

export default function RideDetailsScreen({ navigation, route }: Props) {
  const { ride, onCancel } = route.params;
  const insets = useSafeAreaInsets();

  const handleCancel = () => {
    onCancel?.(ride.id);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* MAP BACKGROUND */}
      <Image
        source={assets.images.rideMap}
        style={styles.mapBg}
        resizeMode="cover"
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* TOP NAV (BACK) */}
        <View style={styles.topNav}>
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
        </View>

        {/* OPTIONAL PICKUP / DROPOFF TAGS ON MAP */}
        <View style={styles.pickupTag}>
          <View style={styles.tagTimeBlock}>
            <Text style={styles.tagTime}>8:00</Text>
            <Text style={styles.tagTimeAm}>AM</Text>
          </View>
          <View style={styles.tagContent}>
            <Text style={styles.tagLabel}>Drop-up</Text>
            <Text style={styles.tagPlace}>Toronto Pearson Airport</Text>
          </View>
        </View>

        <View style={styles.dropoffTag}>
          <View style={styles.tagTimeBlock}>
            <Text style={styles.tagTime}>8:00</Text>
            <Text style={styles.tagTimeAm}>AM</Text>
          </View>
          <View style={styles.tagContent}>
            <Text style={styles.tagLabel}>Drop-off</Text>
            <Text style={styles.tagPlace}>Toronto Pearson Airport</Text>
          </View>
        </View>

        {/* WHITE PANEL */}
        <View style={styles.contentPanel}>
          {/* DRIVER ROW */}
          <View style={styles.driverRow}>
            <View style={styles.driverLeft}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatarWrapBody}>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/100?img=5' }}
                  style={styles.avatar}
                />
                <View style={styles.ratingPill}>
                  <Ionicons name="star" size={14} color="#FFD54F" />
                  <Text style={styles.ratingTxt}>
                    {ride.driver.rating.toFixed(1)}
                  </Text>
                </View>
                </View>
              </View>

              <View style={{marginTop:30}}>
                <Text style={styles.driverName}>{ride.driver.name}</Text>
                <Text style={styles.driverSub}>
                  {ride.driver.carPlate}{' '}
                  <Text style={styles.driverSubFaded}>
                    - {ride.driver.carModel}
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.driverRight}>
              <View style={styles.statusPill}>
                <Text style={styles.statusTxt}>{ride.status}</Text>
              </View>
              <Text style={styles.whenTxt}>{ride.whenLabel}</Text>
            </View>
          </View>

          {/* ROUTE CARD */}
          <View style={styles.routeCard}>
            <View style={styles.iconColumn}>
                        <Image source={require('../../assets/icons/marker-dot-icon.png')} alt='marker-dot-icon' style={{width:16,height:16,marginTop:2}} />
              <View style={styles.dashedLine} />
                        <Image source={require('../../assets/icons/drop-off-dot.png')} alt='drop-off-dot' style={{width:16,height:19}} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.routeTop}>{ride.from}</Text>
              <Text style={styles.routeBottom}>{ride.to}</Text>
            </View>
          </View>

          {/* METRICS */}
          <View style={styles.metricsRow}>
            <View>
              <Text style={styles.metricLabel}>Distance</Text>
              <Text style={styles.metricValue}>
                {ride.distanceKm.toFixed(1)} km
              </Text>
            </View>
            <View>
              <Text style={styles.metricLabel}>Time</Text>
              <Text style={styles.metricValue}>{ride.timeLabel}</Text>
            </View>
          </View>

          {/* FARE */}
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Total Fare :</Text>
            <Text style={styles.fareValue}>${ride.fare.toFixed(2)}</Text>
          </View>

          {/* CTA */}
          {ride.status === 'Upcoming' && (
            <Pressable style={styles.cta} onPress={handleCancel}>
              <Text style={styles.ctaText}>Cancel Ride</Text>
              <View style={styles.ctaIcon}>
                <Ionicons name="close" size={20} color="#201E20" />
              </View>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  mapBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '46%',
  },

  topNav: {
    paddingHorizontal: 24,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop:12
  },
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

  // pickup / dropoff tags on map
  pickupTag: {
    position: 'absolute',
    top: 220,
    left: 10,
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
  },
  dropoffTag: {
    position: 'absolute',
    top: 170,
    right: 30,
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tagTimeBlock: {
    backgroundColor: '#201E20',
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagTime: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: FONTS.semibold,
  },
  tagTimeAm: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: FONTS.regular,
  },
  tagContent: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagLabel: {
    fontSize: 11,
    color: '#999',
    fontFamily: FONTS.regular,
  },
  tagPlace: {
    fontSize: 12,
    color: '#201E20',
    fontFamily: FONTS.semibold,
  },

  contentPanel: {
    flex: 1,
    marginTop: 210,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  driverRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarWrapBody:{
    position:'absolute',
    top:-110
  },
  avatar: {
    // position:'absolute',
    // top:0,
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor:'#201E20',
    borderWidth:6
  },
  ratingPill: {
    position: 'absolute',
    bottom: -8,
    left: 10,
    flexDirection: 'row',
    backgroundColor: '#201E20',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
    gap: 4,
  },
  ratingTxt: {
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  driverName: {
    fontSize: 20,
    color: '#201E20',
    fontFamily: FONTS.semibold,
  },
  driverSub: {
    marginTop: 4,
    fontSize: 16,
    color: '#201E20',
    fontFamily: FONTS.regular,
  },
  driverSubFaded: {
    color: '#A0A0A0',
    fontFamily: FONTS.regular,
  },

  driverRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusPill: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#201E20',
    width:108,
    height:34,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:"center"
    // paddingHorizontal: 14,
    // paddingVertical: 4,
  },
  statusTxt: {
    fontSize: 16,
    color: '#201E20',
    fontFamily: FONTS.regular,
  },
  whenTxt: {
    fontSize: 16,
    color: '#8D8E8F',
    fontFamily: FONTS.regular,
  },

  routeCard: {
    marginTop: 26,
    borderRadius: 26,
    backgroundColor: '#EFEFEF',
    paddingVertical: 24,
    paddingRight: 18,
    paddingLeft: 16,
    flexDirection: 'row',
  },
  iconColumn: {
    width: 26,
    alignItems: 'center',
    marginRight: 12,
  },
  dotOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#201E20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#201E20',
  },
  dashedLine: {
    flex: 1,
    width: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#C4C4C4',
    marginVertical: 8,
  },
  routeTop: {
    fontSize: 16,
    color: '#201E20',
    fontFamily: FONTS.regular,
    marginBottom: 10,
    // paddingTop:-12,
  },
  routeBottom: {
    fontSize: 16,
    color: '#201E20',
    fontFamily: FONTS.regular,
  },

  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 26,
  },
  metricLabel: {
    fontSize: 16,
    color: '#8D8E8F',
    fontFamily: FONTS.regular,
  },
  metricValue: {
    marginTop: 4,
    fontSize: 16,
    color: '#201E20',
    fontFamily: FONTS.regular,
  },

  fareRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
  },
  fareLabel: {
    fontSize: 18,
    color: '#8D8E8F',
    fontFamily: FONTS.semibold,
  },
  fareValue: {
    fontSize: 24,
    color: '#201E20',
    fontFamily: FONTS.semibold,
  },

  cta: {
    marginTop: 30,
    marginBottom: 16,
    height: 56,
    borderRadius: 32,
    backgroundColor: '#201E20',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  ctaText: {
    color: '#FCFCFC',
    fontSize: 17,
    fontFamily: FONTS.semibold,
  },
  ctaIcon: {
    position: 'absolute',
    right: 8,
    width: 44,
    height: 44,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 2,
    borderColor: '#201E20',
  },
});
