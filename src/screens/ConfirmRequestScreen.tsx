// src/screens/ConfirmRequestScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Image,
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
import assets from '../../assets';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmRequest'>;
const MINT = '#B9FBE7';

export default function ConfirmRequestScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const rootNav =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const q: FareQuote = route.params?.quote!;
  const [payMethod, setPayMethod] = useState(
    route.params?.payMethod ?? 'Credit or Debit',
  );
  const [coupon, setCoupon] = useState<string>('');
  const [special, setSpecial] = useState<SpecialRequestPayload | null>(
    route.params?.special ?? null,
  );

  const title = useMemo(() => {
    const seatOrDetails = q.seatText || q.details || '';
    return `${q.tier}${seatOrDetails ? ' – ' + seatOrDetails : ''}`;
  }, [q]);

  console.log('q', q);

  const openPolicies = () => navigation.navigate('Policies');

  const openSpecial = () => {
    navigation.navigate('SpecialRequest', {
      initial: special ?? undefined,
      onDone: p => setSpecial(p),
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
          label: 'Distance kilometers',
          value: `${q?.price_breakdown?.distance_km} km`,
          money: false,
        },
        {
          label: 'Fare per kilometers',
          value: `${q?.price_breakdown?.fare_per_km} km`,
          money: false,
        },
        { label: 'Online Discount', value: 0 },
        { label: 'Coupon Code', value: 0 },
        { label: 'Pickup time', value: `${q?.eta} Mints`, money: false },
        { label: 'Tax', value: q.tax ?? 0 },
        { label: 'Stopover', value: 0 },
      ],
      footnote: 'Toll hwy and other costs may apply',
    });
  };

  // ---- choose car image cleanly
  const carSrc = q.image
    ? { uri: q.image }
    : require('../../assets/icons/no-car-icon.jpg');

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Header close */}
      <Pressable
        style={[styles.closeBtn, { top: insets.top + 6 }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={18} color="#111" />
      </Pressable>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + subtitle */}
        <Text style={styles.h1}>{q?.tier}</Text>
        <Text style={styles.light}>{q.seatText}</Text>
        {/* Payment label */}
        <View style={styles.rowHead}>
          <Text style={styles.section}>Payment</Text>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#9AA0A6"
          />
        </View>

        {/* Car tile + price slab */}
        <View style={styles.carRow}>
          <View style={styles.carCard}>
            <Image
              source={carSrc}
              style={{
                width: 200,
                height: 150,
              }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.priceCard}>
            {!!q.tax && <Text style={styles.taxTxt}>Tax: ${q.tax}</Text>}
            <Text style={styles.priceNow}>${q.price}</Text>
            <Text style={styles.tiny}>Tip included</Text>
          </View>
        </View>

        {/* Policies chip */}
        {/* <Pressable style={styles.policyPill} onPress={openPolicies}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.policyStrong}>
          Late Arrival • Waiting Time • No Show
          </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#111" />
          </Pressable> */}
        <Pressable
          style={styles.policyRow}
          onPress={() =>
            navigation.navigate('Policies', {
              onSelect: id => console.log('open policy:', id),
            })
          }
        >
          <Text style={styles.policyTxt}>
            Late Arrival - Waiting Time - No Show
          </Text>
          <AntDesign
            name="arrowright"
            style={{ marginTop: 4 }}
            size={16}
            color={'#111'}
          />
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={styles.policySub}>
            Fare per km {q?.fare_per_km}, Max Luggage {q?.max_luggage}, Max
            Passengers {q?.max_passengers}
          </Text>
        </View>

        {/* Special request */}
        {/* <Pressable style={styles.specialRow} onPress={openSpecial}>
          <Ionicons name="sparkles-outline" size={18} color="#111" />
          <Text style={styles.specialTxt}>I have special request</Text>
          <Ionicons
            name={!!special ? 'checkbox-outline' : 'square-outline'}
            size={18}
            color="#111"
          />
        </Pressable> */}

        <Pressable
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 14,
          }}
          onPress={openSpecial}
        >
          <View
            style={[
              styles.rowMain,
              {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 12,
                marginTop: 10,
              },
            ]}
          >
            <Image
              source={require('../../assets/icons/specreq-icon.png')}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
            {/* <Ionicons name="sparkles-outline" size={18} color={TEXT} /> */}
            <Text>I have special request</Text>
            <View>
              <Ionicons
                name={!!special ? 'checkbox-outline' : 'square-outline'}
                size={18}
                color="#111"
              />
            </View>
          </View>
        </Pressable>

        {/* Payment + Coupon */}
        <View style={styles.bottomRow}>
          <Pressable style={styles.payChip} onPress={openBreakdown}>
            <Ionicons name="card-outline" size={18} color="#111" />
            <Text style={styles.payTxt}>{payMethod}</Text>
            {/* <Ionicons name="chevron-down" size={16} color="#111" /> */}
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

      {/* Sticky CTA */}
      <View
        style={[styles.ctaWrap, { paddingBottom: Math.max(16, insets.bottom) }]}
      >
        <Pressable style={styles.cta} onPress={confirm}>
          <Text style={styles.ctaText}>Confirm and Request</Text>
          <View style={styles.ctaIcon}>
            <AntDesign name="arrowright" size={18} color="#111" />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },

  closeBtn: {
    position: 'absolute',
    left: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  h1: { color: '#111', fontWeight: '800', fontSize: 18, marginTop: 8 },
  light: { color: '#9AA0A6', fontWeight: '700' },
  sub: { color: '#666', marginTop: 6, lineHeight: 20 },

  rowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  section: { color: '#111', fontWeight: '800' },

  carRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F3F5',
    gap: 5,
    marginTop: 15,
    borderRadius: 16,
  },
  carCard: {
    flex: 1,
    minHeight: 92,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 12 },
    elevation: 4,
  },
  priceCard: {
    width: 200,
    borderRadius: 16,
    backgroundColor: '#F2F3F5',
    padding: 12,
    alignItems: 'flex-end',
    paddingTop: 16,
    paddingEnd: 20,
  },
  taxTxt: { color: '#777', fontSize: 12, marginBottom: 6 },
  priceNow: { color: '#111', fontSize: 40, fontWeight: '600', lineHeight: 32 },
  tiny: { color: '#777', marginTop: 6 },

  policyPill: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F6F7F8',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  policyStrong: { color: '#111', fontWeight: '700' },
  policySub: {
    color: '#9AA0A6',
    marginVertical: 12,
  },

  specialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  specialTxt: { color: '#111', fontWeight: '700', flex: 1 },

  bottomRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  payChip: {
    flex: 1,
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
  payTxt: { color: '#111', fontWeight: '800', flex: 1 },

  couponChip: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F6F7F8',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  couponInput: { flex: 1, color: '#111', padding: 0 },

  ctaWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  cta: {
    marginHorizontal: 16,
    marginTop: 8,
    height: 52,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
  /* policy pill */
  policyRow: {
    marginTop: 22,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 50,
    borderRadius: 999,
    backgroundColor: '#F6F7F8',
    // borderWidth: 1,
    // borderColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  policyTxt: { color: '#111', fontWeight: '700' },
  rowMain: { color: '#111', fontWeight: '700', flex: 1 },
});
