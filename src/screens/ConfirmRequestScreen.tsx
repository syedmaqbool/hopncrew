// src/screens/ConfirmRequestScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert, Image
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, FareQuote, SpecialRequestPayload, PayMethodKey, SavedCard } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import assets from '../../assets';

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
                  // <MaterialCommunityIcons name="car-estate" size={64} color="#111" />
                      <Image source={assets.images.escaladeIcon} style={{ width: 200, height: 80 }} resizeMode="contain" />
                ) : (
                  // <MaterialCommunityIcons name="car-estate" size={64} color="#111" />
                      <Image source={assets.images.escaladeIcon} style={{ width: 200, height: 80 }} resizeMode="contain" />
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
  );
}

const styles = StyleSheet.create({
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

  carRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, paddingVertical: 0, backgroundColor: '#EFEFEF', borderRadius: 10, },
  carCard: {
    width: 200, height: 92, borderRadius: 0,borderTopRightRadius: 24, borderBottomRightRadius: 24, 
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#EEE',
    alignItems: 'center', justifyContent: 'center', elevation: 2,
  },
  priceCard: {
   flex: 1, maxWidth: 150, borderRadius: 14, backgroundColor: 'transparent',
    padding: 10, alignItems: 'flex-end', borderWidth: 0, borderColor: '#EEE',
  },
  taxTxt: { color: '#777', fontSize: 12, alignSelf: 'flex-end', marginBottom : 5, },
  priceNow: { color: '#111', fontSize: 28, fontWeight: '800', lineHeight: 30 },
  tiny: { color: '#777', marginTop: 5 },

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
  ctaIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: MINT, alignItems: 'center', justifyContent: 'center',  position: 'absolute', right: 10, },
});
