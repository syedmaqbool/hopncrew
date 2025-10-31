// src/screens/AssignedVehicle.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { RootStackParamList } from '../navigation/types';
import assets from '../../assets';

type Props = NativeStackScreenProps<RootStackParamList, 'AssignedVehicle'>;

const GOOGLE_MAPS_APIKEY = 'AIzaSyBp7k8-SYDkEkhcGbXQ9f_fAXPXmwmlvUQ';

type LegLabel = {
  coord: LatLng;
  title: string; // e.g. "52 Burlington Road"
  subtitle?: string; // e.g. "Drop-off Toronto Pearson Airport"
  step?: number; // 1 / 2
  etaText?: string; // e.g. "8 Min"
  distText?: string; // e.g. "4 km"
};

export default function AssignedVehicle({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView | null>(null);

  const start: LatLng =
    (route.params?.start as any) ??
    ({ latitude: 43.6532, longitude: -79.3832 } as LatLng);
  const dest: LatLng =
    (route.params?.dest as any) ??
    ({ latitude: 43.6426, longitude: -79.3871 } as LatLng);
  const startName = (route.params?.start as any)?.description ?? 'Pickup';
  const destName = (route.params?.dest as any)?.description ?? 'Drop-off';

  // optional waypoints + labels can be passed from previous screen
  const waypoints: LatLng[] = (route.params?.waypoints as any) ?? [];

  // labels to render like the mock (pass in via params if you have real values)
  const labels: LegLabel[] = (route.params?.labels as any) ?? [
    {
      coord: start,
      title: startName,
      step: 1,
      etaText: '8 Min',
      distText: '4 km',
    },
    ...(waypoints[0]
      ? ([
          {
            coord: waypoints[0],
            title: '52 Burlington Road',
            step: 2,
            etaText: '8 Min',
            distText: '4 km',
          },
        ] as LegLabel[])
      : []),
    {
      coord: dest,
      title: destName,
      subtitle: 'Drop-off',
      // step omitted for drop-off badge; we show time badge instead (see mock)
    },
  ];

  const driver = route.params?.driver ?? {
    name: 'Jonas',
    rating: 4.9,
    years: 5,
    km: '2 Million km',
    verified: true,
  };
  const vehicle = route.params?.vehicle ?? {
    label: 'Caddilac Escalade ESV',
    plate: 'ERS 8579',
  };
  const eta = route.params?.etaMinutes ?? 18;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Map header */}
      <View style={[styles.mapWrap, { paddingTop: insets.top + 8 }]}>
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
          <MapViewDirections
            origin={start}
            destination={dest}
            waypoints={waypoints}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={7}
            strokeColor="#F5B400"
            lineCap="round"
            lineJoin="round"
            optimizeWaypoints={false}
            onReady={r => {
              mapRef.current?.fitToCoordinates(r.coordinates, {
                edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
                animated: true,
              });
            }}
          />

          {/* Start pin with halo */}
          <Marker coordinate={start} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.startHalo}>
              <View style={styles.startDot} />
            </View>
          </Marker>

          {/* Waypoints (small black pins) */}
          {waypoints.map((p, i) => (
            <Marker key={`wp-${i}`} coordinate={p} anchor={{ x: 0.5, y: 1 }}>
              <View style={styles.wpPin} />
            </Marker>
          ))}

          {/* Destination (small black pin) */}
          <Marker coordinate={dest} anchor={{ x: 0.5, y: 1 }}>
            <View style={styles.wpPin} />
          </Marker>

          {/* Car at origin */}
          <Marker coordinate={start} anchor={{ x: 0.5, y: 0.5 }}>
            <Image
              source={
                (route.params?.vehicle as any)?.image ||
                assets.images.escaladeIcon
              }
              style={{ width: 32, height: 32 }}
            />
          </Marker>

          {/* Label pills as custom markers */}
          {labels.map((L, idx) => (
            <Marker
              key={`lbl-${idx}`}
              coordinate={L.coord}
              anchor={{ x: 0.0, y: 1.1 }}
            >
              <View style={styles.labelPill}>
                {/* left black chip with time + distance (if provided) */}
                {(L.etaText || L.distText) && (
                  <View style={styles.labelLeft}>
                    {L.etaText ? (
                      <Text style={styles.labelLeftTop}>{L.etaText}</Text>
                    ) : null}
                    {L.distText ? (
                      <Text style={styles.labelLeftBot}>{L.distText}</Text>
                    ) : null}
                  </View>
                )}

                {/* main title */}
                <View style={{ paddingHorizontal: 10, paddingRight: 8 }}>
                  {/* optional small “8:00 AM Drop-off” style */}
                  {L.subtitle ? (
                    <Text style={styles.dropTiny}>{L.subtitle}</Text>
                  ) : null}
                  <Text style={styles.labelTitle}>{L.title}</Text>
                </View>

                {/* step number or chevron */}
                {L.step ? (
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepTxt}>{L.step}</Text>
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={14} color="#111" />
                )}
              </View>
            </Marker>
          ))}
        </MapView>

        {/* header overlays */}
        <View style={[styles.headerRow, { paddingHorizontal: 16 }]}>
          {/* menu circle (mock shows hamburger) */}
          <Pressable
            style={styles.roundBtn}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="menu" size={18} color="#111" />
          </Pressable>

          {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}> */}
          {/* Driver Live pill */}
          {/* <Pressable style={styles.livePill} onPress={() => {}}>
              <Text style={styles.liveTxt}>Driver Live</Text>
              <Ionicons name="chevron-forward" size={14} color="#111" />
            </Pressable>

            {/* SOS */}
          {/* <Pressable style={styles.sos} onPress={() => {}}>
              <Text style={styles.sosTxt}>SOS</Text>
            </Pressable>
          </View> */}
        </View>
      </View>

      {/* Sheet content */}
      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        <View style={styles.sheetShadow}>
          <View style={styles.sheet}>
            <View style={styles.etaRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.hi}>Hi David,</Text>
                <Text style={styles.pick}>Picking you in</Text>
              </View>
              <View style={styles.etaPill}>
                <Text style={styles.etaNum}>{eta}</Text>
                <Text style={styles.etaUnit}>Min</Text>
              </View>
            </View>

            {/* Policies row */}
            <Pressable
              style={styles.policies}
              onPress={() => navigation.navigate('Policies')}
            >
              <View style={styles.policiesChip}>
                <Text style={styles.policiesChipTxt}>Policies</Text>
              </View>
              <Text style={styles.policiesSub} numberOfLines={1}>
                Late Arrival - Waiting Time - No Show...
              </Text>
              <Ionicons name="chevron-down" size={16} color="#111" />
            </Pressable>

            {/* Driver card */}
            <View style={styles.driverCard}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  flex: 1,
                }}
              >
                <View>
                  <Image
                    source={assets.images.avatarMan}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      resizeMode: 'contain',
                    }}
                  />
                  <View style={styles.proBadge}>
                    <Text style={styles.proTxt}>PRO</Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{driver.name}</Text>
                  <Text style={styles.driverSub}>
                    {driver.years ?? 5} years-{driver.km ?? '2 Million km'}
                    {'\n'}Airport transfers Experience
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Ionicons name="shield-checkmark" size={16} color="#111" />
                    <Text style={styles.verified}>Identity verified</Text>
                  </View>
                </View>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Image
                  source={
                    (route.params?.vehicle as any)?.image ||
                    assets.images.escaladeIcon
                  }
                  style={{ width: 120, height: 84, resizeMode: 'contain' }}
                />
                <View style={styles.plate}>
                  <Text style={styles.plateNum}>{vehicle.plate}</Text>
                  <Text style={styles.plateSub}>{vehicle.label}</Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionRow}>
            <Pressable
              style={styles.hollowBtn}
              onPress={() =>
                navigation.navigate('ContactSupport', {
                  name: driver.name,
                  plate: vehicle.plate,
                  vehicleLabel: vehicle.label,
                  avatar: assets.images.avatarMan,
                })
              }
            >
              <Ionicons name="call-outline" size={18} color="#111" />
              <Text style={styles.hollowTxt}>Contact</Text>
            </Pressable>
            <Pressable
              style={styles.hollowBtn}
                onPress={() => navigation.navigate('CancelRide')}
              >
                <Ionicons name="close-outline" size={18} color="#111" />
                <Text style={styles.hollowTxt}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.hollowBtn}
                onPress={() => navigation.navigate('Policies')}
              >
                <Ionicons name="help-circle-outline" size={18} color="#111" />
                <Text style={styles.hollowTxt}>Support</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: { flex: 0.6, backgroundColor: '#E8ECEF' },
  headerRow: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
    marginTop: 44,
  },
  sos: {
    backgroundColor: '#FF4D4F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sosTxt: { color: '#fff', fontWeight: '800' },
  livePill: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveTxt: { color: '#111', fontWeight: '700' },

  // pins
  startHalo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,181,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111',
  },
  wpPin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#111',
  },

  // label pills
  labelPill: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEE',
    overflow: 'hidden',
    alignItems: 'center',
    elevation: 2,
  },
  labelLeft: {
    backgroundColor: '#111',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  labelLeftTop: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
    lineHeight: 14,
  },
  labelLeftBot: { color: '#fff', opacity: 0.9, fontSize: 12, lineHeight: 14, fontFamily: 'BiennaleRegular' },
  labelTitle: { color: '#111', fontFamily: 'BiennaleBold' },
  dropTiny: { color: '#9AA0A6', fontSize: 12, fontFamily: 'BiennaleRegular' },
  stepCircle: {
    marginRight: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F5F5F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTxt: { color: '#111', fontSize: 12, fontFamily: 'BiennaleBold' },

  // sheet
  sheetWrap: { flex: 0.45, backgroundColor: 'transparent' },
  sheetShadow: {
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: 'transparent',
    // shadowColor: '#000',
    // shadowOpacity: 0.08,
    // shadowRadius: 14,
    // shadowOffset: { width: 0, height: -2 },
    // elevation: 6,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    padding: 16,
  },

  etaRow: { flexDirection: 'row', alignItems: 'center' },
  hi: { color: '#111', fontSize: 22, fontFamily: 'BiennaleBold' },
  pick: { color: '#111', marginTop: 2, fontFamily: 'BiennaleBold' },
  etaPill: {
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaNum: { color: '#EFFF5A', fontSize: 36, lineHeight: 40, fontFamily: 'BiennaleBold' },
  etaUnit: { color: '#fff', marginTop: -6, fontFamily: 'BiennaleRegular' },

  policies: {
    marginTop: 14,
    backgroundColor: '#F4F5F6',
    borderRadius: 18,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  policiesChip: {
    backgroundColor: '#111',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  policiesChipTxt: { color: '#fff', fontFamily: 'BiennaleBold' },
  policiesSub: { color: '#6F6F6F', flex: 1, fontFamily: 'BiennaleRegular' },

  driverCard: {
    marginTop: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  driverName: { color: '#111', fontFamily: 'BiennaleBold' },
  driverSub: { color: '#6F6F6F', marginTop: 2, fontFamily: 'BiennaleRegular' },
  verified: { color: '#111', fontFamily: 'BiennaleBold' },
  proBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    backgroundColor: '#FFE15A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#111',
  },
  proTxt: { color: '#111', fontSize: 10, fontFamily: 'BiennaleBold' },

  plate: {
    marginTop: 6,
    backgroundColor: '#F4F5F6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  plateNum: { color: '#111', fontFamily: 'BiennaleBold' },
  plateSub: { color: '#6F6F6F', fontSize: 12 },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  hollowBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#fff',
  },
  hollowTxt: { color: '#111', fontFamily: 'BiennaleBold' },
});
