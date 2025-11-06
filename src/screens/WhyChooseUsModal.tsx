<<<<<<< HEAD
=======
// src/screens/WhyChooseUsModal.tsx
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
<<<<<<< HEAD
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
=======
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

type Props = NativeStackScreenProps<RootStackParamList, 'WhyChooseUs'>;

const MINT = '#B9FBE7';
<<<<<<< HEAD
=======
const SHEET_RATIO = 0.7; // 70% height
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

const FEATURES: { icon: string; title: string; sub: string }[] = [
  { icon: 'shield-check-outline', title: 'Guaranteed', sub: '20+ years of reliable pickup' },
  { icon: 'lock-outline', title: 'Flat Fixed Rate', sub: 'No surge or per km/minute charges' },
<<<<<<< HEAD
  { icon: 'clock-outline', title: 'Cancellation & Changes', sub: 'Up to 1 hour before pickup' },
=======
  { icon: 'clock-outline', title: 'Cancellation and Changes', sub: 'Up to 1 hour before pickup' },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  { icon: 'checkbox-multiple-marked-outline', title: 'Square hold funds', sub: 'Charge after drop-off' },
  { icon: 'baby-carriage', title: 'FREE child car seats', sub: '' },
  { icon: 'hand-truck', title: 'Luggage assistance', sub: '' },
];

export default function WhyChooseUsModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
<<<<<<< HEAD
=======
  const { width, height } = useWindowDimensions();
  const panelWidth = Math.min(width * 0.9, 520);
  const panelHeight = Math.round(height * SHEET_RATIO);
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  const close = () => {
    route.params?.onClose?.();
    navigation.goBack();
  };

  return (
<<<<<<< HEAD
    <View style={styles.fill}>
      {/* tap outside to dismiss */}
      <Pressable style={styles.backdrop} onPress={close} />

      <SafeAreaView edges={['bottom']} style={styles.panelWrap}>
        <View style={[styles.panel, { paddingTop: insets.top + 8 }]}>
          {/* Top right Close */}
          <Pressable style={styles.closeBtn} onPress={close} hitSlop={10}>
            <Text style={styles.closeTxt}>Close</Text>
          </Pressable>

          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
=======
    <View style={StyleSheet.absoluteFill}>
      {/* Tap outside to dismiss */}
      <Pressable style={styles.backdrop} onPress={close} />

      <SafeAreaView style={styles.centerWrap}>
        <View
          style={[
            styles.panel,
            { width: panelWidth, height: panelHeight, paddingTop: 22 },
          ]}
        >
          {/* Top right Close */}
          <Pressable
                      style={[styles.closeBtn]}
                      onPress={close}
                      hitSlop={10}
                    >
                      <Ionicons name="close" size={18} color="#111" />
            <Text style={styles.closeTxt}>Close</Text>
                    </Pressable>

          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(20, insets.bottom) },
            ]}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
            showsVerticalScrollIndicator={false}
          >
            {/* Brand pill */}
            <View style={styles.brandPill}>
              <Text style={styles.brandText}>hop’n™</Text>
            </View>

<<<<<<< HEAD
            {/* Big heading */}
=======
            {/* Heading */}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
            <Text style={styles.h1}>
              More Than A{'\n'}Ride. Why{'\n'}Choose us?
            </Text>

            {/* Feature list */}
            <View style={{ marginTop: 6 }}>
              {FEATURES.map((f, idx) => (
                <View key={idx} style={styles.row}>
                  <View style={styles.rowIcon}>
                    <MaterialCommunityIcons name={f.icon as any} size={22} color="#111" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle}>{f.title}</Text>
                    {!!f.sub && <Text style={styles.rowSub}>{f.sub}</Text>}
                  </View>
                </View>
              ))}
            </View>

            {/* Info cards */}
<<<<<<< HEAD
            <View style={{ gap: 10, marginTop: 10, backgroundColor: MINT }}>
              <InfoCard
                title="Flight Delayed? No Problem:"
                body="Hop’n tracks your flight and adjusts your pickup time automatically. Whether it’s a flight delay or baggage hold-up, we’ve got you covered. Simply choose “By flight arrival” and let your captain ensure a smooth pickup experience"
              />
              <InfoCard
                title="Enjoy Unlimited Wait Time:"
                body="Lost baggage? Customs or immigration delays? No worries—your driver will wait as long as needed"
=======
            <View style={{ gap: 10, marginTop: 10 }}>
              <InfoCard
                title="Flight Delayed? No Problem:"
                body="Hop’n tracks your flight and adjusts your pickup time automatically. Whether it’s a flight delay or baggage hold-up, we’ve got you covered. Simply choose “By flight arrival” and let your captain ensure a smooth pickup experience."
              />
              <InfoCard
                title="Enjoy Unlimited Wait Time:"
                body="Lost baggage? Customs or immigration delays? No worries—your driver will wait as long as needed."
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <View style={cardStyles.wrap}>
<<<<<<< HEAD
      {/* <View style={cardStyles.badge}>
        <Ionicons name="information-circle-outline" size={16} color="#111" />
      </View> */}
=======
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
      <Text style={cardStyles.title}>{title}</Text>
      <Text style={cardStyles.body}>{body}</Text>
    </View>
  );
}

<<<<<<< HEAD
const styles = StyleSheet.create({
  fill: { flex: 1,padding:20 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },

  panelWrap: { flex: 1 },
  panel: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },

  closeBtn: { position: 'absolute', right: 14, top: 40, zIndex: 2 },
  closeTxt: { color: '#9AA0A6', fontWeight: '700' },
=======
/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  panel: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  closeBtn: {
    position: 'absolute',
    flexDirection:"row-reverse",
    right: 14,
    alignItems:'center',
    top: 16,
    gap:8,
    zIndex: 2,
  },
  closeTxt: { color: '#9AA0A6', fontFamily: FONTS.bold },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 36,
  },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  brandPill: {
    alignSelf: 'flex-start',
    backgroundColor: MINT,
<<<<<<< HEAD
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
  },
  brandText: { fontWeight: '800', color: '#111' },

  h1: { fontSize: 28, fontWeight: '800', color: '#111', lineHeight: 32, marginBottom: 12 },
=======
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  brandText: {
    fontSize: 20,
    color: '#111',
    textAlign: 'center',
    fontFamily: FONTS.bold,
  },

  h1: {
    fontSize: 34,
    color: '#111',
    lineHeight: 42,
    marginBottom: 12,
    fontFamily: FONTS.bold,
  },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  rowIcon: {
<<<<<<< HEAD
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F6F7F8', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#EEE',
  },
  rowTitle: { color: '#111', fontWeight: '700' },
  rowSub: { color: '#666', marginTop: 2 },

=======
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F6F7F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  rowTitle: { color: '#111', fontFamily: FONTS.bold },
  rowSub: { color: '#666', marginTop: 2, fontFamily: FONTS.regular },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});

const cardStyles = StyleSheet.create({
  wrap: {
    backgroundColor: MINT,
    borderRadius: 12,
    padding: 12,
  },
<<<<<<< HEAD
  badge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1, borderColor: '#DDF6EE',
  },
  title: { color: '#111', fontWeight: '800', marginBottom: 4 },
  body: { color: '#233', lineHeight: 18 },
=======
  title: { color: '#111', marginBottom: 4, fontFamily: FONTS.bold },
  body: { color: '#233', lineHeight: 18, fontFamily: FONTS.regular },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});
