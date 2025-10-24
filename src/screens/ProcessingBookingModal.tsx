// src/screens/ProcessingBookingModal.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import type { RootStackParamList } from '../navigation/types';
import assets from '../../assets';

type Props = NativeStackScreenProps<RootStackParamList, 'Processing'>;

const MINT = '#B9FBE7';
const GOOGLE_MAPS_APIKEY = 'AIzaSyBp7k8-SYDkEkhcGbXQ9f_fAXPXmwmlvUQ';

const avatarImages = [
  assets.images.avatar1,
  assets.images.avatar2,
  assets.images.avatar3,
  assets.images.avatar4,
  assets.images.avatar1,
  assets.images.avatar2,
  assets.images.avatar3,
  assets.images.avatar4,
];

export default function ProcessingBookingModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const durationMs = route.params?.durationMs ?? 2000;
  const onDone = route.params?.onDone;

  const start =
    route.params?.start ??
    ({ latitude: 43.6532, longitude: -79.3832 } as LatLng);
  const dest =
    route.params?.dest ??
    ({ latitude: 43.6426, longitude: -79.3871 } as LatLng);

  // Map
  const mapRef = useRef<MapView | null>(null);

  // Fit once route is ready
  const onDirectionsReady = (result: {
    distance: number;
    duration: number;
    coordinates: LatLng[];
  }) => {
    if (!mapRef.current) return;
    mapRef.current.fitToCoordinates(result.coordinates, {
      edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
      animated: true,
    });
  };

  // ring rotation
  const spin = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);
  const spinDeg = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // progress
  const progress = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: durationMs,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished) return;
      if (typeof onDone === 'function') {
        onDone();
      } else {
        navigation.navigate('BookingReceived', { start, dest });
      }
    });
  }, [progress, durationMs, onDone, navigation]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // avatar ring dots
  const dots = useMemo(() => {
    return Array.from({ length: avatarImages.length }).map((_, i) => {
      const angle = (i / avatarImages.length) * 2 * Math.PI;
      const r = 54;
      return {
        left: 54 + r * Math.cos(angle) - 16,
        top: 54 + r * Math.sin(angle) - 16,
        key: i.toString(),
      };
    });
  }, []);

  return (
    <View style={styles.screen}>
      {/* MAP: 50% */}
      <View style={[styles.mapHalf, { paddingTop: insets.top + 8 }]}>
        <MapView
          ref={ref => (mapRef.current = ref)}
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: start.latitude,
            longitude: start.longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}
        >
          {/* Google Directions overlay (high-detail road-following path) */}
          <MapViewDirections
            origin={start}
            destination={dest}
            apikey={GOOGLE_MAPS_APIKEY}
            mode="DRIVING"
            strokeWidth={7}
            strokeColor="#F5B400" // route color (warm yellow like mock)
            lineCap="round"
            lineJoin="round"
            optimizeWaypoints
            onReady={onDirectionsReady}
            // Optional: show a shadow under the route for contrast
            strokeColors={['#F5B400']}
          />

          {/* Start pin + car on start */}
          <Marker coordinate={start} anchor={{ x: 0.5, y: 1 }}>
            <View style={styles.pinWrap}>
              <View style={styles.pinDot} />
            </View>
          </Marker>
          <Marker coordinate={start} anchor={{ x: 0.5, y: 0.5 }}>
            <Image
              source={assets.images.escaladeIcon}
              style={{ width: 28, height: 28 }}
            />
          </Marker>

          {/* End pin */}
          <Marker coordinate={dest} anchor={{ x: 0.5, y: 1 }}>
            <View
              style={[
                styles.pinWrap,
                { backgroundColor: '#111', borderColor: '#111' },
              ]}
            >
              <View style={[styles.pinDot, { backgroundColor: '#fff' }]} />
            </View>
          </Marker>
        </MapView>

        {/* Back button — marginTop: 50 requested */}
        <View
          style={[styles.headerRow, { paddingHorizontal: 20, marginTop: 50 }]}
        >
          <Pressable
            style={styles.backCircle}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={18} color="#111" />
          </Pressable>
          <View style={{ width: 36, height: 36 }} />
        </View>
      </View>

      {/* SHEET: 50% */}
      <SafeAreaView style={styles.sheetHalf}>
        <View style={styles.sheet}>
          <View style={styles.ringWrap}>
            <Animated.View
              style={[styles.ring, { transform: [{ rotate: spinDeg }] }]}
            >
              {dots.map((d, i) => (
                <View
                  key={d.key}
                  style={[styles.dot, { left: d.left, top: d.top }]}
                >
                  <Image
                    source={avatarImages[i % avatarImages.length]}
                    style={styles.avatarImg}
                  />
                </View>
              ))}
            </Animated.View>
          </View>

          <Text style={styles.title}>We are processing your booking...</Text>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth }]}
            />
          </View>

          <View style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={styles.subhead}>
              Over 8 million km of airport transfers by pro{'\n'}partners in 20
              years
            </Text>
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <AntDesign key={i} name="star" size={16} color="#FFC107" />
              ))}
            </View>
            <View style={styles.identityRow}>
              <Ionicons name="shield-checkmark" size={16} color="#111" />
              <Text style={styles.identityTxt}>Identity verified</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },

  // Top 50%
  mapHalf: { flex: 0.5, backgroundColor: '#E8ECEF' },
  headerRow: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },

  // Pins
  pinWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#111',
  },
  pinDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#111' },

  // Bottom 50%
  sheetHalf: {
    flex: 0.5,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    alignItems: 'center',
    zIndex: 2,
    // marginHorizontal: 10,
    // marginTop: 40,
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
    overflow: 'hidden',
    // marginTop: -24,
    // marginTop: 60,
  },

  // Ring
  ringWrap: { alignItems: 'center', marginTop: 8 },
  ring: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#F1F2F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#72e0bf',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    marginTop: 14,
    textAlign: 'center',
    color: '#111',
    fontSize: 14,
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EEE',
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: { height: '100%', backgroundColor: MINT },

  subhead: {
    color: '#111',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '700',
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
    justifyContent: 'center',
  },
  identityRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  identityTxt: { color: '#111', fontWeight: '600' },
  avatarImg: { width: 24, height: 24, borderRadius: 12, resizeMode: 'cover' },
});
