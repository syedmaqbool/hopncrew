// src/screens/ProcessingBookingModal.tsx
<<<<<<< HEAD
import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
=======
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import MapboxGL from '@rnmapbox/maps';
import type { RootStackParamList } from '../navigation/types';
import assets from '../../assets';
import { FONTS } from '../../src/theme/fonts';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

type Props = NativeStackScreenProps<RootStackParamList, 'Processing'>;

const MINT = '#B9FBE7';
<<<<<<< HEAD

export default function ProcessingBookingModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const durationMs = route.params?.durationMs ?? 10000;
  const onDone = route.params?.onDone;

  // ring rotation
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
=======
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';
const MAPBOX_TOKEN =
  'pk.eyJ1IjoicmFmYXlhc2FkMDEiLCJhIjoiY21oazdxanQwMDR5cTJrc2NiZGZiZ3phMyJ9.beHDnNh5y6l-9ThZ1TR64A';
MapboxGL.setAccessToken(MAPBOX_TOKEN);

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
    ({ latitude: 43.6532, longitude: -79.3832 } as {
      latitude: number;
      longitude: number;
    });
  const dest =
    route.params?.dest ??
    ({ latitude: 43.6426, longitude: -79.3871 } as {
      latitude: number;
      longitude: number;
    });

  // Mapbox camera
  const cameraRef = useRef<MapboxGL.Camera>(null);

  // Helpers for Mapbox coords
  const toLngLat = (p?: { latitude: number; longitude: number }) =>
    p ? ([p.longitude, p.latitude] as [number, number]) : undefined;
  const startLL = useMemo(() => toLngLat(start), [start]);
  const endLL = useMemo(() => toLngLat(dest), [dest]);

  // Mapbox Directions route state
  const [routeShape, setRouteShape] = useState<any | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const carCoord = useMemo<[number, number] | undefined>(
    () => (routeCoords.length > 0 ? routeCoords[0] : startLL),
    [routeCoords, startLL],
  );

  const bounds = useMemo(() => {
    const coords =
      routeCoords.length > 1
        ? routeCoords
        : ([startLL, endLL].filter(Boolean) as [number, number][]);
    if (!coords || coords.length < 1) return undefined;
    let minLon = Infinity,
      maxLon = -Infinity,
      minLat = Infinity,
      maxLat = -Infinity;
    coords.forEach(([lon, lat]) => {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });
    if (
      !isFinite(minLon) ||
      !isFinite(maxLon) ||
      !isFinite(minLat) ||
      !isFinite(maxLat)
    ) {
      return undefined;
    }
    return {
      ne: [maxLon, maxLat] as [number, number],
      sw: [minLon, minLat] as [number, number],
      paddingTop: insets.top + 8 + 56,
      paddingBottom: 32,
      paddingLeft: 16,
      paddingRight: 16,
    };
  }, [routeCoords, startLL, endLL, insets.top]);

  // Fetch Mapbox Directions
  useEffect(() => {
    const fetchRoute = async () => {
      if (!startLL || !endLL || !MAPBOX_TOKEN) return;
      try {
        const url =
          `https://api.mapbox.com/directions/v5/mapbox/driving/` +
          `${startLL[0]},${startLL[1]};${endLL[0]},${endLL[1]}` +
          `?geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(url);
        const json = await res.json();
        const route = json?.routes?.[0];
        const coords: [number, number][] = route?.geometry?.coordinates ?? [];
        if (coords.length > 0) {
          const featureCollection = {
            type: 'FeatureCollection' as const,
            features: [
              {
                type: 'Feature' as const,
                geometry: { type: 'LineString' as const, coordinates: coords },
                properties: {},
              },
            ],
          };
          setRouteShape(featureCollection);
          setRouteCoords(coords);
        } else {
          setRouteShape(null);
          setRouteCoords([]);
        }
      } catch (e) {
        console.warn('Mapbox directions failed:', e);
        setRouteShape(null);
        setRouteCoords([]);
      }
    };
    fetchRoute();
  }, [startLL?.[0], startLL?.[1], endLL?.[0], endLL?.[1]]);

  // ring rotation
  const spin = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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
<<<<<<< HEAD

=======
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  const spinDeg = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

<<<<<<< HEAD
  // progress bar
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
=======
  // progress
  const progress = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
    Animated.timing(progress, {
      toValue: 1,
      duration: durationMs,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(({ finished }) => {
<<<<<<< HEAD
      if (finished) onDone?.();
    });
  }, [progress, durationMs, onDone]);
=======
      if (!finished) return;
      if (typeof onDone === 'function') {
        onDone();
      } else {
        navigation.navigate('BookingReceived', { start, dest });
      }
    });
  }, [progress, durationMs, onDone, navigation]);
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

<<<<<<< HEAD
  // 8 avatars around a circle
  const dots = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 2 * Math.PI;
        const r = 54;
        return {
          left: 54 + r * Math.cos(angle) - 12,
          top: 54 + r * Math.sin(angle) - 12,
          key: i.toString(),
        };
      }),
    [],
  );

  return (
    <View style={styles.fill}>
      {/* tap outside to close (optional) */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      {/* Top overlay back button */}
      <View style={[styles.overlayTop, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color="#111" />
        </Pressable>
      </View>

      {/* Bottom sheet */}
      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        <View style={styles.sheet}>
          {/* circle animation */}
=======
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
        <MapboxGL.MapView
          style={StyleSheet.absoluteFill}
          styleURL={MAP_STYLE}
          // compassEnabled
          rotateEnabled
          scrollEnabled
          zoomEnabled
          scaleBarEnabled={false}
          logoEnabled={false}
        >
          {bounds ? (
            <MapboxGL.Camera ref={cameraRef} bounds={bounds} />
          ) : (
            <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={startLL ?? endLL ?? [-79.3832, 43.6532]}
            />
          )}

          {/* Route line */}
          {routeShape && (
            <MapboxGL.ShapeSource id="route" shape={routeShape}>
              <MapboxGL.LineLayer
                id="route-line"
                style={{
                  lineColor: '#F5B400',
                  lineWidth: 7,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            </MapboxGL.ShapeSource>
          )}

          {/* Start pin */}
          {startLL && (
            <MapboxGL.MarkerView
              coordinate={startLL}
              anchor={{ x: 0.5, y: 1 }}
              allowOverlap
            >
              <Image
                source={assets.images.locationPin}
                style={{ width: 18, height: 18, resizeMode: 'contain' }}
              />
            </MapboxGL.MarkerView>
          )}
          {/* Car at start */}
          {startLL && (
            <MapboxGL.MarkerView
              coordinate={startLL}
              anchor={{ x: 0.5, y: 0.5 }}
              allowOverlap
            >
              <Image
                source={require('../../assets/icons/car-icon.png')}
                style={{ width: 28, height: 28, resizeMode: 'contain' }}
              />
            </MapboxGL.MarkerView>
          )}

          {/* End pin */}
          {endLL && (
            <MapboxGL.MarkerView
              coordinate={endLL}
              anchor={{ x: 0.5, y: 1 }}
              allowOverlap
            >
              <Image
                source={assets.images.locationPin}
                style={{ width: 18, height: 18, resizeMode: 'contain' }}
              />
            </MapboxGL.MarkerView>
          )}
        </MapboxGL.MapView>

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
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
          <View style={styles.ringWrap}>
            <Animated.View
              style={[styles.ring, { transform: [{ rotate: spinDeg }] }]}
            >
<<<<<<< HEAD
              {dots.map(d => (
=======
              {dots.map((d, i) => (
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
                <View
                  key={d.key}
                  style={[styles.dot, { left: d.left, top: d.top }]}
                >
<<<<<<< HEAD
                  <MaterialCommunityIcons
                    name="account"
                    size={16}
                    color="#fff"
=======
                  <Image
                    source={avatarImages[i % avatarImages.length]}
                    style={styles.avatarImg}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
                  />
                </View>
              ))}
            </Animated.View>
          </View>

<<<<<<< HEAD
          <Text style={styles.title}>We are processing your booking…</Text>

          {/* progress bar */}
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>

          {/* trust row */}
=======
          <Text style={styles.title}>We are processing your booking...</Text>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth }]}
            />
          </View>

>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
          <View style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={styles.subhead}>
              Over 8 million km of airport transfers by pro{'\n'}partners in 20
              years
            </Text>
<<<<<<< HEAD

=======
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <AntDesign key={i} name="star" size={16} color="#FFC107" />
              ))}
            </View>
<<<<<<< HEAD

=======
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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
<<<<<<< HEAD
  fill: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent', // keep map visible
  },
  overlayTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
    paddingHorizontal: 12,
  },
  roundBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#EEE',
  },

  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
=======
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
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
<<<<<<< HEAD
  },

  ringWrap: { alignItems: 'center', marginTop: 8 },
  ring: {
    width: 108, height: 108, borderRadius: 54,
    backgroundColor: '#F1F2F4',
    alignItems: 'center', justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#72e0bf',
    alignItems: 'center', justifyContent: 'center',
=======
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
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  },

  title: {
    marginTop: 14,
    textAlign: 'center',
    color: '#111',
    fontSize: 14,
<<<<<<< HEAD
    fontWeight: '600',
  },

=======
    fontFamily: FONTS.semibold,
  },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EEE',
    overflow: 'hidden',
    marginTop: 12,
  },
<<<<<<< HEAD
  progressFill: {
    height: '100%',
    backgroundColor: MINT,
  },
=======
  progressFill: { height: '100%', backgroundColor: MINT },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  subhead: {
    color: '#111',
    textAlign: 'center',
    marginTop: 8,
<<<<<<< HEAD
    fontWeight: '700',
=======
    fontFamily: FONTS.bold,
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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
<<<<<<< HEAD
  identityTxt: { color: '#111', fontWeight: '600' },
=======
  identityTxt: { color: '#111', fontFamily: FONTS.semibold },
  avatarImg: { width: 24, height: 24, borderRadius: 12, resizeMode: 'cover' },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});
