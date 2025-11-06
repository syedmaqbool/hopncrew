// src/screens/ConfirmRequestScreen.tsx
import React, { useMemo, useState } from 'react';
import {
<<<<<<< HEAD
  View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, FareQuote, SpecialRequestPayload, PayMethodKey, SavedCard } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmRequest'>;
const MINT = '#B9FBE7';

export default function ConfirmRequestScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const q: FareQuote = route.params?.quote!;
  const [payMethod, setPayMethod] = useState(route.params?.payMethod ?? 'Credit or Debit');
  const [coupon, setCoupon] = useState<string>('');
  const [special, setSpecial] = useState<SpecialRequestPayload | null>(route.params?.special ?? null);

  const title = useMemo(() => {
    const right = q.seatText ? ` ${q.seatText}` : '';
    return `${q.tier}${right}`;
  }, [q]);

  const openPolicies = () => navigation.navigate('Policies');

  const openSpecial = () => {
    navigation.navigate('SpecialRequest', {
      initial: special ?? undefined,
      onDone: (p) => setSpecial(p),
=======
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  Platform,
  useWindowDimensions,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import type {
  RootStackParamList,
  FareQuote,
  SpecialRequestPayload,
} from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../../src/theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmRequest'>;

const MINT = '#B9FBE7';
const BG_SOFT = '#F6F7F8';
const TEXT = '#111';
const MUTED = '#9AA0A6';
const CARD = '#FFFFFF';
const BORDER = '#EEE';
const CTA_HEIGHT = 60;

export default function ConfirmRequestScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const rootNav =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();

  const q: FareQuote = route.params?.quote!;
  const [payMethod] = useState(route.params?.payMethod ?? 'Credit or Debit');
  const [coupon, setCoupon] = useState<string>('');
  const [special, setSpecial] = useState<SpecialRequestPayload | null>(
    route.params?.special ?? null,
  );

  const isCompact = width < 360; // very small phones
  const carRowStacks = isCompact; // stack car & price slab on tiny screens

  const title = useMemo(() => {
    const seatOrDetails = q.seatText || q.details || '';
    return `${q.tier}${seatOrDetails ? ' – ' + seatOrDetails : ''}`;
  }, [q]);

  const openSpecial = () => {
    navigation.navigate('SpecialRequest', {
      initial: special ?? undefined,
      onDone: p => setSpecial(p),
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
      onCancel: () => setSpecial(null),
    });
  };

  const confirm = () => {
    route.params?.onConfirm?.({
      quote: q,
      payMethod,
      special: special ?? undefined,
      coupon: coupon?.trim() || null,
    });
<<<<<<< HEAD
    console.log('confirm', { quote: q, payMethod, special, coupon });
    // navigation.goBack();
   rootNav.navigate('PaymentMethods', { selected: 'card' });
  };

  const openBreakdown = () => {
  navigation.navigate('PaymentBreakdown', {
    rows: [
      { label: 'Base Price', value: 100 },
      { label: 'Online Discount (20%)', value: -15 },         // negative shows as -$15
      { label: 'Coupon Code', value: -10 },
      { label: 'Airport pickup fee', value: '1 hr', money: false },
      { label: 'Tax', value: q.tax ?? 0 },
      { label: 'Stopover', value: 85 },
    ],
    footnote: 'Toll hwy and other costs may apply',
  });
};

  return (
    <View style={{ flex: 1 }}>
      {/* Keep the map visible; tap dim to close */}
      <Pressable style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.05)' }]} onPress={() => navigation.goBack()} />

      <SafeAreaView edges={['bottom']} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[styles.sheet, { paddingTop: insets.top + 6 }]}>
          {/* Top close */}
          <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={18} color="#111" />
          </Pressable>

          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
            {/* Title + subtitle */}
            <Text style={styles.h1}>
              {title} <Text style={styles.light}>Or Similar</Text>
            </Text>
            <Text style={styles.sub}>
              Sedan limos are a great choice for transportation to and from the airport to any part of the GTA.
            </Text>

            {/* Payment label */}
            <View style={styles.rowHead}>
              <Text style={styles.section}>Payment</Text>
              <Ionicons name="information-circle-outline" size={16} color="#9AA0A6" />
            </View>

            {/* Car tile + price slab */}
            <View style={styles.carRow}>
              <View style={styles.carCard}>
                {q.image ? (
                  // <Image source={q.image} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                  <MaterialCommunityIcons name="car-estate" size={64} color="#111" />
                ) : (
                  <MaterialCommunityIcons name="car-estate" size={64} color="#111" />
                )}
              </View>
              <View style={styles.priceCard}>
                {!!q.seatText && <Text style={styles.taxTxt}>Tax: ${q.seatText}</Text>}
                <Text style={styles.priceNow}>${q.price}</Text>
                <Text style={styles.tiny}>Tip included</Text>
              </View>
            </View>

            {/* Policies chip */}
            <Pressable style={styles.policyPill} onPress={openPolicies}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.policyStrong}>Late Arrival • Waiting Time • No Show</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#111" />
            </Pressable>
            <Text style={styles.policySub}>Flat Rate – No Surge, No Per-KM, No Per-MIN Charges</Text>

            {/* Special request toggle */}
            <Pressable style={styles.specialRow} onPress={openSpecial}>
              <Ionicons name="sparkles-outline" size={18} color="#111" />
              <Text style={styles.specialTxt}>I have special request</Text>
              <Ionicons name={special ? 'checkbox-outline' : 'square-outline'} size={18} color="#111" />
            </Pressable>

            {/* Payment + Coupon row */}
            <View style={styles.bottomRow}>
              <Pressable style={styles.payChip} onPress={() => openBreakdown()}>
                <Ionicons name="card-outline" size={18} color="#111" />
                <Text style={styles.payTxt}>{payMethod}</Text>
                <Ionicons name="chevron-down" size={16} color="#111" />
              </Pressable>

              <View style={styles.couponChip}>
                <Ionicons name="pricetag-outline" size={18} color="#111" />
                <TextInput
                  style={styles.couponInput}
                  placeholder="Apply Coupon"
                  placeholderTextColor="#9AA0A6"
                  value={coupon}
                  onChangeText={setCoupon}
                />
              </View>
            </View>
          </ScrollView>

          {/* CTA */}
          <Pressable style={styles.cta} onPress={confirm}>
            <Text style={styles.ctaText}>Confirm and Request</Text>
            <View style={styles.ctaIcon}>
              <AntDesign name="arrowright" size={18} color="#111" />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
=======
    rootNav.navigate('PaymentMethods', {
      selected: 'card',
      start: route.params?.start,
      dest: route.params?.dest,
    });
  };

  const openBreakdown = () => {
    navigation.navigate('PaymentBreakdown', {
      rows: [
        { label: 'Base Price', value: q?.price_breakdown?.base_fare },
        { label: 'Distance Fare', value: q?.price_breakdown?.distance_fare },
        {
          label: 'Distance (km)',
          value: `${q?.price_breakdown?.distance_km} km`,
          money: false,
        },
        {
          label: 'Fare per km',
          value: `${q?.price_breakdown?.fare_per_km}`,
          money: false,
        },
        { label: 'Online Discount', value: 0 },
        { label: 'Coupon Code', value: 0 },
        { label: 'Pickup time', value: `${q?.eta} mins`, money: false },
        { label: 'Tax', value: q.tax ?? 0 },
        { label: 'Stopover', value: 0 },
      ],
      footnote: 'Toll, highway and other costs may apply',
    });
  };

  const carSrc = q.image
    ? { uri: q.image }
    : require('../../assets/icons/no-car-icon.jpg');

  // Responsive widths
  const carCardWidth = Math.min(320, width * 0.62);
  const priceSlabWidth = carRowStacks ? '100%' : Math.min(240, width * 0.46);
  const priceFont = width < 360 ? 32 : width < 420 ? 38 : 44;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Header close */}
      <Pressable
        style={[styles.closeBtn]}
        hitSlop={10}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        <Ionicons name="close" size={18} color={TEXT} />
      </Pressable>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingTop: 50,
            // ensure nothing is hidden behind CTA
            paddingBottom: CTA_HEIGHT + 24 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title + subtitle */}
          <Text style={[styles.h1, { fontSize: width < 360 ? 18 : 20 }]}>
            {q?.tier}
          </Text>
          {!!q?.details && <Text style={styles.light}>{q.details}</Text>}

          {/* Payment label */}
          <View style={styles.rowHead}>
            <Text style={styles.section}>Payment</Text>
            <Ionicons name="information-circle-outline" size={16} color={MUTED} />
          </View>

          {/* Car tile + price slab (reference look) */}
          <View
            style={[
              styles.carRowWrap,
              carRowStacks ? { flexDirection: 'column' } : { flexDirection: 'row' },
            ]}
          >
            {/* Car card with soft shadow */}
            <View style={styles.cardShadow}>
              <View style={[styles.carCardBox, { width: carCardWidth }]}>
                <Image source={carSrc} style={styles.carImage} resizeMode="contain" />
              </View>
            </View>

            {/* Price slab with slight overlap on wider screens */}
            <View
              style={[
                styles.priceSlabShadow,
                carRowStacks
                  ? { marginLeft: 0, marginTop: 12, width: '50%' }
                  : { marginLeft: -60, width: priceSlabWidth as number },
              ]}
            >
              <View style={styles.priceSlab}>
                {!!q.tax && <Text style={styles.taxTxt}>Tax: ${q.tax}</Text>}
                <Text
                  style={[styles.priceNow, { fontSize: priceFont, lineHeight: priceFont + 2 }]}
                  numberOfLines={1}
                >
                  ${q.price}
                </Text>
                <Text style={styles.tipTxt}>Tip included</Text>
              </View>
            </View>
          </View>

          {/* Policy pill */}
          <Pressable
            style={[styles.policyRow, { alignSelf: 'center', width: '88%', maxWidth: 520 }]}
            onPress={() =>
              navigation.navigate('Policies', {
                onSelect: id => console.log('open policy:', id),
              })
            }
            accessibilityRole="button"
          >
            <Text style={styles.policyTxt}>Late Arrival • Waiting Time • No Show</Text>
            <AntDesign name="arrowright" style={{ marginTop: 2 }} size={16} color={TEXT} />
          </Pressable>

          {/* Policy sub info */}
          <View style={styles.centerRow}>
            <Text style={styles.policySub}>
              Fare/km {q?.fare_per_km ?? '-'} • Max Luggage {q?.max_luggage ?? '-'} • Max Passengers{' '}
              {q?.max_passengers ?? '-'}
            </Text>
          </View>

          {/* Special request toggle */}
          <Pressable style={styles.specialWrap} onPress={openSpecial} accessibilityRole="button">
            <View style={styles.specialInner}>
              <Image
                source={require('../../assets/icons/specreq-icon.png')}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
              <Text style={styles.specialTxt}>I have special request</Text>
              <Ionicons
                name={!!special ? 'checkbox-outline' : 'square-outline'}
                size={18}
                color={TEXT}
              />
            </View>
          </Pressable>

          {/* Payment + Coupon */}
          <View
            style={[
              styles.bottomRow,
              width < 360 ? { flexDirection: 'column' } : { flexDirection: 'row' },
            ]}
          >
            <Pressable
              style={[styles.payChip, width < 360 ? { width: '100%' } : { flex: 1 }]}
              onPress={openBreakdown}
              accessibilityRole="button"
            >
              <Ionicons name="card-outline" size={18} color={TEXT} />
              <Text style={styles.payTxt}>{payMethod}</Text>
            </Pressable>

            <View
              style={[styles.couponChip, width < 360 ? { width: '100%' } : { flex: 1.1 }]}
            >
              <Ionicons name="pricetag-outline" size={18} color={TEXT} />
              <TextInput
                style={styles.couponInput}
                placeholder="Apply Coupon"
                placeholderTextColor={MUTED}
                value={coupon}
                onChangeText={setCoupon}
                autoCapitalize="characters"
                returnKeyType="done"
              />
            </View>
          </View>
        </ScrollView>

        {/* Sticky CTA */}
        <View
          style={[
            styles.ctaWrap,
            {
              paddingBottom: Math.max(12, insets.bottom),
              height: CTA_HEIGHT + Math.max(12, insets.bottom) + 8,
            },
          ]}
        >
          <Pressable style={styles.cta} onPress={confirm} accessibilityRole="button">
            <Text style={styles.ctaText}>Confirm and Request</Text>
            <View style={styles.ctaIcon}>
              <AntDesign name="arrowright" size={18} color={TEXT} />
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '94%',
  },
  closeBtn: {
    position: 'absolute', left: 14, top: 10,
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#F2F2F2',
    alignItems: 'center', justifyContent: 'center', zIndex: 2,
  },

  h1: { color: '#111', fontWeight: '800', fontSize: 18 },
  light: { color: '#9AA0A6', fontWeight: '700' },
  sub: { color: '#666', marginTop: 6 },

  rowHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  section: { color: '#111', fontWeight: '800' },

  carRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  carCard: {
    flex: 1, height: 92, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#EEE',
    alignItems: 'center', justifyContent: 'center', elevation: 1,
  },
  priceCard: {
    width: 120, borderRadius: 14, backgroundColor: '#F6F7F8',
    padding: 10, alignItems: 'flex-end', borderWidth: 1, borderColor: '#EEE',
  },
  taxTxt: { color: '#777', fontSize: 12, alignSelf: 'flex-start' },
  priceNow: { color: '#111', fontSize: 28, fontWeight: '800', lineHeight: 30 },
  tiny: { color: '#777', marginTop: 2 },

  policyPill: {
    marginTop: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F6F7F8', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12,
    borderWidth: 1, borderColor: '#EEE',
  },
  policyStrong: { color: '#111', fontWeight: '700' },
  policySub: { color: '#9AA0A6', marginTop: 6, marginLeft: 2 },

  specialRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14,
  },
  specialTxt: { color: '#111', fontWeight: '700', flex: 1 },

  bottomRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  payChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: MINT, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12,
    borderWidth: 1, borderColor: '#D6F5EA',
  },
  payTxt: { color: '#111', fontWeight: '800', flex: 1 },

  couponChip: {
    flex: 1.1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F6F7F8', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12,
    borderWidth: 1, borderColor: '#EEE',
  },
  couponInput: { flex: 1, color: '#111', padding: 0 },

  cta: {
    margin: 16, height: 50, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: MINT, alignItems: 'center', justifyContent: 'center' },
=======
  screen: { flex: 1, backgroundColor: '#fff' },

  closeBtn: {
    position: 'absolute',
    left: 14,
    width: 36,
    height: 36,
    top:8,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0.18,
    shadowRadius: Platform.OS === 'ios' ? 8 : 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  h1: { color: TEXT, fontSize: 20, marginTop: 8, fontFamily: FONTS.bold },
  light: { color: MUTED, marginTop: 2, fontFamily: FONTS.regular },

  rowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  section: { color: TEXT, fontFamily: FONTS.bold },

  /* ---------- Car row + price slab ---------- */
  carRowWrap: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  cardShadow: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    backgroundColor: 'transparent',
    zIndex:4,
  },
  carCardBox: {
    height: 160,
    backgroundColor: CARD,
    borderRadius: 24,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carImage: {
    width: '100%',
    height: '85%',
  },

  priceSlabShadow: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    backgroundColor: 'transparent',
  },
  priceSlab: {
    height: 160,
    backgroundColor: '#EFEFEF',
    shadowColor: '#000',
    elevation: 6,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  taxTxt: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 6,
    fontFamily: FONTS.regular,
  },
  priceNow: {
    color: TEXT,
    fontFamily: FONTS.bold,
  },
  tipTxt: {
    color: '#6B7280',
    marginTop: 6,
    fontSize: 15,
    fontFamily: FONTS.regular,
  },

  /* ---------- Policy ---------- */
  policyRow: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: BG_SOFT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  policyTxt: { color: TEXT, fontFamily: FONTS.bold },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  policySub: {
    color: MUTED,
    marginVertical: 10,
    textAlign: 'center',
    fontFamily: FONTS.regular,
  },

  /* ---------- Special request ---------- */
  specialWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  specialInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  specialTxt: { color: TEXT, fontFamily: FONTS.bold },

  /* ---------- Payment & coupon ---------- */
  bottomRow: { gap: 10, marginTop: 14 },
  payChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: MINT,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D6F5EA',
  },
  payTxt: { color: TEXT, flex: 1, fontFamily: FONTS.bold },
  couponChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BG_SOFT,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  couponInput: { flex: 1, color: TEXT, padding: 0, fontFamily: FONTS.regular },

  /* ---------- CTA ---------- */
  ctaWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingTop: 6,
    borderTopWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    borderTopColor: '#EAEAEA',
  },
  cta: {
    marginHorizontal: 16,
    height: CTA_HEIGHT,
    borderRadius: CTA_HEIGHT / 2,
    backgroundColor: TEXT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#fff', fontFamily: FONTS.bold },
  ctaIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});
