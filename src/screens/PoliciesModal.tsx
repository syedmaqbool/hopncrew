<<<<<<< HEAD
=======
// src/screens/PoliciesModal.tsx
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
=======
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '../../src/theme/fonts';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Policies'>;

const MINT = '#B9FBE7';
<<<<<<< HEAD

const POLICY_ROWS: { id: string; title: string; icon: string }[] = [
  { id: 'passenger_wait', title: 'Passenger late arrival, no show – waiting', icon: 'account-clock-outline' },
  { id: 'driver_late',    title: 'Driver late arrival or no show',            icon: 'steering' },
  { id: 'cancel_change',  title: 'Cancellation & Change',                      icon: 'clock-outline' },
  { id: 'refund',         title: 'Refund',                                     icon: 'credit-card-refund-outline' },
  { id: 'guaranteed',     title: 'Guaranteed pickup',                           icon: 'shield-check-outline' },
  { id: 'tolls',          title: 'Toll Charges',                                icon: 'cash-multiple' },
=======
const SHEET_RATIO = 0.7; // 70% height

const POLICY_ROWS: { id: string; title: string; icon: string }[] = [
  {
    id: 'passenger_wait',
    title: 'Passenger late arrival, no show – waiting',
    icon: 'account-clock-outline',
  },
  { id: 'driver_late', title: 'Driver late arrival or no show', icon: 'steering' },
  { id: 'cancel_change', title: 'Cancellation and Change', icon: 'clock-outline' },
  { id: 'refund', title: 'Refund', icon: 'credit-card-refund-outline' },
  { id: 'guaranteed', title: 'Guaranteed pickup', icon: 'shield-check-outline' },
  { id: 'tolls', title: 'Toll Charges', icon: 'cash-multiple' },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
];

export default function PoliciesModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
<<<<<<< HEAD

  const close = () => {
    route.params?.onClose?.();
    navigation.goBack();
=======
  const { width, height } = useWindowDimensions();

  const close = () => {
    try {
      route.params?.onClose?.();
    } catch (e) {}
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.getParent?.()?.goBack?.();
    }
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  };

  const onRow = (id: string) => {
    route.params?.onSelect?.(id);
<<<<<<< HEAD
    // optionally push a details screen later
  };

  return (
    <View style={{ flex: 1,padding:20 }}>
      {/* Keep map visible; tap dim to close */}
      <Pressable style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.08)' }]} onPress={close} />

      <SafeAreaView edges={['bottom']} style={styles.wrap}>
        <View style={[styles.panel, { paddingTop: insets.top + 8 }]}>
          {/* top right Close */}
          <Pressable style={styles.closeBtn} onPress={close} hitSlop={10}>
            <Text style={styles.closeTxt}>Close</Text>
          </Pressable>

          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* mint pill */}
=======
    if (id === 'passenger_wait') return navigation.navigate('PassengerWait');
    if (id === 'driver_late') return navigation.navigate('DriverLate');
    if (id === 'cancel_change') return navigation.navigate('CancelChange');
    if (id === 'refund') return navigation.navigate('GuaranteedPickup');
    if (id === 'guaranteed') return navigation.navigate('Refund');
    if (id === 'tolls') return navigation.navigate('Tolls');
  };

  // dynamic width & height responsive
  const panelWidth = Math.min(width * 0.9, 520);
  const panelHeight = Math.round(height * SHEET_RATIO);

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Dim background */}
      <Pressable
        style={[StyleSheet.absoluteFillObject, styles.backdrop]}
        onPress={close}
      />

      <SafeAreaView style={styles.centerWrap} edges={[]}>
        <View style={[styles.panel, { width: panelWidth, height: panelHeight }]}>
          {/* Close button */}
          <Pressable
            style={[styles.closeBtn, { top: insets.top + 10 }]}
            onPress={close}
            hitSlop={10}
          >
            <Ionicons name="close" size={18} color="#111" />
          </Pressable>

          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(16, insets.bottom) },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Pill */}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
            <View style={styles.pill}>
              <Text style={styles.pillTxt}>Policies</Text>
            </View>

<<<<<<< HEAD
            {/* heading */}
            <Text style={styles.h1}>For A Smooth{'\n'}Journey</Text>

            {/* list */}
            <View style={{ marginTop: 6, gap: 10 }}>
              {POLICY_ROWS.map(row => (
                <Pressable key={row.id} style={styles.row} onPress={() => onRow(row.id)}>
                  <View style={styles.rowIcon}>
                    <MaterialCommunityIcons name={row.icon as any} size={20} color="#111" />
                  </View>
                  <View style={styles.rowPill}>
                    <Text style={styles.rowTitle} numberOfLines={2}>{row.title}</Text>
=======
            {/* Heading */}
            <Text style={styles.h1}>For A Smooth{'\n'}Journey</Text>

            {/* Policy rows */}
            <View style={{ marginTop: 6, gap: 10 }}>
              {POLICY_ROWS.map(row => (
                <Pressable
                  key={row.id}
                  style={styles.row}
                  onPress={() => onRow(row.id)}
                >
                  <View style={styles.rowIcon}>
                    <MaterialCommunityIcons
                      name={row.icon as any}
                      size={20}
                      color="#111"
                    />
                  </View>
                  <View style={styles.rowPill}>
                    <Text style={styles.rowTitle} numberOfLines={2}>
                      {row.title}
                    </Text>
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
                    <Ionicons name="chevron-forward" size={18} color="#111" />
                  </View>
                </Pressable>
              ))}
            </View>

<<<<<<< HEAD
            {/* Disclaimer card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Liability Disclaimer</Text>
              <Text style={styles.cardBody}>
                Hop’n is not responsible for any losses, damages, or inconveniences caused by a missed pickup, including but not limited to:
                {'\n'}• Missed flights, trains, or bus connections
                {'\n'}• Hotel cancellations or additional lodging expenses
                {'\n'}• Business meeting delays or missed appointments
                {'\n'}• Any direct or indirect financial or personal losses due to ride unavailability
                {'\n\n'}By using Hop’n service, passengers acknowledge and accept that Hop’n is not liable for any claims, losses, or damages resulting from uncontrollable pickup failures.
=======
            {/* Disclaimer */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Liability Disclaimer</Text>
              <Text style={styles.cardBody}>
                Hop’n is not responsible for any losses, damages, or
                inconveniences caused by a missed pickup, including but not
                limited to:
                {'\n'}• Missed flights, trains, or bus connections
                {'\n'}• Hotel cancellations or additional lodging expenses
                {'\n'}• Business meeting delays or missed appointments
                {'\n'}• Any direct or indirect financial or personal losses due
                to ride unavailability
                {'\n\n'}By using Hop’n service, passengers acknowledge and
                accept that Hop’n is not liable for any claims, losses, or
                damages resulting from uncontrollable pickup failures.
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  wrap: { flex: 1, justifyContent: 'flex-end' },
  panel: {
    flex: 1,
    backgroundColor: '#fff',
    // borderTopLeftRadius: 24,
    // borderTopRightRadius: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },

  closeBtn: { position: 'absolute', right: 14, top: 10, zIndex: 2 },
  closeTxt: { color: '#9AA0A6', fontWeight: '700' },
=======
  backdrop: { backgroundColor: 'rgba(0,0,0,0.25)' },

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
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  closeBtn: {
    position: 'absolute',
    right: 14,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 36,
  },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  pill: {
    alignSelf: 'flex-start',
    backgroundColor: MINT,
<<<<<<< HEAD
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, marginBottom: 10,
  },
  pillTxt: { color: '#111', fontWeight: '800' },

  h1: { color: '#111', fontWeight: '800', fontSize: 26, lineHeight: 30, marginBottom: 6 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F6F7F8', borderWidth: 1, borderColor: '#EEE',
    alignItems: 'center', justifyContent: 'center',
  },
  rowPill: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F6F7F8', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12,
  },
  rowTitle: { color: '#111', fontWeight: '700', flex: 1, marginRight: 8 },
=======
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 10,
  },
  pillTxt: { color: '#111', fontFamily: FONTS.bold },

  h1: {
    color: '#111',
    fontSize: 26,
    lineHeight: 30,
    marginBottom: 6,
    fontFamily: FONTS.bold,
  },

  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F6F7F8',
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F6F7F8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  rowTitle: { color: '#111', flex: 1, marginRight: 8, fontFamily: FONTS.bold },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  card: {
    marginTop: 14,
    backgroundColor: MINT,
    borderRadius: 12,
    padding: 12,
  },
<<<<<<< HEAD
  cardTitle: { color: '#111', fontWeight: '800', marginBottom: 6 },
  cardBody: { color: '#233', lineHeight: 18 },
=======
  cardTitle: { color: '#111', marginBottom: 6, fontFamily: FONTS.bold },
  cardBody: { color: '#233', lineHeight: 18, fontFamily: FONTS.regular },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});
