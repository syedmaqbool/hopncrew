// src/screens/EnRoutePickupModal.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Image, SafeAreaView, Animated, Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EnRoute'>;

const MINT = '#B9FBE7';

export default function EnRoutePickupModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const {
    etaMinutes = 18,
    riderName = 'David',
    driver = {
      name: 'Jonas',
      rating: 4.9,
      years: 5,
      km: '2 Million km',
      verified: true,
      avatar: undefined as string | undefined,
    },
    vehicle = {
      label: 'Cadillac Escalade ESV',
      plate: 'ERS 8579',
      image: undefined as string | undefined,
    },
    onContact,
    onCancel,
    onSupport,
    onPolicies,
  } = route.params ?? {};

  const appear = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(appear, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  }, [appear]);

  const cardStyle = {
    opacity: appear,
    transform: [
      { scale: appear.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
    ],
  };

  // Subtle pulse on the ETA tile
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });

  return (
    <View style={styles.fill}>
      {/* keep map visible; tap outside to collapse if you want */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      {/* top overlay actions (hamburger / SOS could live on the map; here we only provide back) */}
      <View style={[styles.overlayTop, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color="#111" />
        </Pressable>
      </View>

      {/* Bottom sheet */}
      <SafeAreaView edges={['bottom']} style={styles.centerWrap}>
        <Animated.View style={[styles.popupCard, cardStyle]}>
          {/* greeting + ETA */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.hi}>Hi {riderName},</Text>
              <Text style={styles.sub}>Picking you in</Text>
            </View>

            <Animated.View style={[styles.eta, { transform: [{ scale }] }]}>
              <Text style={styles.etaNum}>{etaMinutes}</Text>
              <Text style={styles.etaMin}>Min</Text>
            </Animated.View>
          </View>

          {/* policies chip row */}
          <View style={styles.chipsRow}>
            <Pressable onPress={() => onPolicies?.()}>
              <View style={styles.chipDark}>
                <Text style={styles.chipDarkTxt}>Policies</Text>
              </View>
            </Pressable>

            <View style={styles.chip}>
              <Text style={styles.chipTxt}>Late Arrival·Waiting Time·No Show…</Text>
              <Ionicons name="chevron-down" size={14} color="#6C7075" />
            </View>
          </View>

          {/* driver + vehicle side-by-side */}
          <View style={styles.cardRow}>
            {/* driver card */}
            <View style={styles.driverCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.avatar}>
                  {driver.avatar ? (
                    <Image source={{ uri: driver.avatar }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <MaterialCommunityIcons name="account" size={28} color="#fff" />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{driver.name}</Text>
                  <Text style={styles.driverMeta}>
                    {driver.years} years · {driver.km}{'\n'}Airport transfers Experience
                  </Text>
                </View>
              </View>

              <View style={styles.verifiedRow}>
                {driver.verified && <Ionicons name="shield-checkmark" size={14} color="#111" />}
                <Text style={styles.verifiedTxt}>Identity verified</Text>
                {/* <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                  {[...Array(5)].map((_, i) => (
                    <AntDesign
                      key={i}
                      name="star"
                      size={12}
                      color={i < Math.round(driver.rating) ? '#FFC107' : '#E5E5E5'}
                    />
                  ))}
                </View> */}
              </View>
            </View>

            {/* vehicle card */}
            <View style={styles.vehicleCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                <View style={styles.platePill}>
                  <Text style={styles.plateTxt}>{vehicle.plate}</Text>
                </View>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {vehicle.image ? (
                  <Image source={{ uri: vehicle.image }} style={{ width: 120, height: 54 }} resizeMode="contain" />
                ) : (
                  <MaterialCommunityIcons name="car-estate" size={72} color="#111" />
                )}
              </View>
              <Text style={styles.vehicleLabel}>{vehicle.label}</Text>
            </View>
          </View>

          {/* actions */}
          <View style={styles.actionsRow}>
            <ActionBtn label="Contact" icon="chatbubble-ellipses-outline" onPress={() => onContact?.()} />
            <ActionBtn label="Cancel" icon="close" onPress={() => onCancel?.()} />
            <ActionBtn label="Support" icon="help-circle-outline" onPress={() => onSupport?.()} />
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

function ActionBtn({ label, icon, onPress }: { label: string; icon: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <Ionicons name={icon as any} size={18} color="#111" />
      <Text style={styles.actionTxt}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
 backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

    centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16, // side margins
  },


  overlayTop: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingHorizontal: 12,
  },
  roundBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EEE',
  },

  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 18,
  },


    popupCard: {
    width: '100%',
    height: '50%',                 // ← half the screen
    maxHeight: 520,                // cap for very tall screens
    minHeight: 380,                // floor for short screens
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    // optional subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  // keep using your existing inner styles:
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  hi: { color: '#111', fontSize: 22, fontWeight: '800' },
  sub: { color: '#6C7075', marginTop: 2, fontWeight: '600' },
  eta: {
    width: 74, height: 74, borderRadius: 12,
    backgroundColor: '#111', alignItems: 'center', justifyContent: 'center',
  },
  etaNum: { color: '#fff', fontSize: 28, fontWeight: '800' },
  etaMin: { color: '#fff' },
  chipsRow: { flexDirection: 'row', gap: 10, marginTop: 12, alignItems: 'center' },
  chipDark: { backgroundColor: '#111', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  chipDarkTxt: { color: '#fff', fontWeight: '700' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#F6F7F8', borderWidth: 1, borderColor: '#EEE' },
  chipTxt: { color: '#6C7075', fontWeight: '700' },
  cardRow: { flexDirection: 'row', gap: 12, marginTop: 14, flex: 1 }, // let rows take available height
  driverCard: { flex: 1, borderRadius: 16, backgroundColor: '#fff', borderWidth: 0, borderColor: '#EFEFEF', padding: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#B9FBE7', alignItems: 'center', justifyContent: 'center' },
  driverName: { color: '#111', fontWeight: '800' },
  driverMeta: { color: '#6C7075', fontSize: 12, marginTop: 2 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  verifiedTxt: { color: '#111', fontWeight: '600', marginLeft: 6 },
  vehicleCard: { width: 150, borderRadius: 16, backgroundColor: '#F6F7F8', borderWidth: 1, borderColor: '#EFEFEF', padding: 10 },
  platePill: { backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#EEE' },
  plateTxt: { color: '#111', fontWeight: '700', fontSize: 12 },
  vehicleLabel: { color: '#6C7075', fontSize: 11, textAlign: 'right', marginTop: 6 },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  action: { flex: 1, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 1, borderColor: '#EEE', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  actionTxt: { color: '#111', fontWeight: '700' },
});
