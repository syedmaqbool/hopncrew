// src/screens/AddCardModal.tsx
import type { NativeStackScreenProps } from '@react-native-native-stack';
import React, { useMemo, useState } from 'react';
import {
  ActionSheetIOS,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import { FONTS } from '../../src/theme/fonts';
import type { RootStackParamList, SavedCard } from '../navigation/types';

const MINT = '#B9FBE7';
const TEXT = '#201E20';
const BORDER = '#8D8E8F';

type Props = NativeStackScreenProps<RootStackParamList, 'AddCard'>;

const detectBrand = (num: string): SavedCard['brand'] => {
  const n = num.replace(/\s+/g, '');
  if (/^4\d{12,18}$/.test(n)) return 'visa';
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))\d{12,15}$/.test(n))
    return 'mastercard';
  if (/^3[47]\d{13}$/.test(n)) return 'amex';
  if (/^6(011|5)/.test(n)) return 'discover';
  return 'generic';
};

const luhn = (num: string) => {
  const s = num.replace(/\s+/g, '');
  let sum = 0;
  let dbl = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = parseInt(s[i], 10);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
};

export default function AddCardModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const [holder, setHolder] = useState('');
  const [number, setNumber] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [cvv, setCvv] = useState('');

  const clean = number.replace(/\s+/g, '');
  const brand = detectBrand(number);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const next: string[] = [];
    for (let i = 0; i < 15; i++) {
      next.push(String(current + i));
    }
    return next;
  }, []);

  const months = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) =>
        String(i + 1).padStart(2, '0'),
      ),
    [],
  );

  const valid = useMemo(() => {
    if (holder.trim().length < 2) return false;
    if (clean.length < 12) return false;
    if (!luhn(number)) return false;
    const mm = parseInt(month, 10);
    if (!mm || mm < 1 || mm > 12) return false;
    if (!year) return false;
    if (brand === 'amex') {
      if (cvv.length !== 4) return false;
    } else if (cvv.length !== 3) return false;
    return true;
  }, [holder, clean.length, number, month, year, cvv, brand]);

  const formatNumber = (raw: string) =>
    raw.replace(/\D+/g, '').replace(/(.{4})/g, '$1 ').trim();

  const openMonthSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', ...months],
          cancelButtonIndex: 0,
        },
        index => {
          if (index > 0) setMonth(months[index - 1]);
        },
      );
    } else {
      // simple fallback for Android: cycle months
      // you can replace with a proper modal if you want
      const currentIndex = months.indexOf(month);
      const next = months[(currentIndex + 1) % months.length];
      setMonth(next);
    }
  };

  const openYearSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', ...years],
          cancelButtonIndex: 0,
        },
        index => {
          if (index > 0) setYear(years[index - 1]);
        },
      );
    } else {
      const currentIndex = years.indexOf(year);
      const next = years[(currentIndex + 1) % years.length];
      setYear(next);
    }
  };

  const submit = async () => {
    if (!valid) return;
    const card: SavedCard = {
      id: 'card_' + Date.now(),
      brand,
      last4: clean.slice(-4),
      exp: `${month}/${year.slice(-2)}`,
    };
    route.params?.onAdded?.(card);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View
        style={{ flex: 1 }}
        // behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={{
            flex: 1,
            paddingTop: 24,
            paddingBottom: 30,
            paddingHorizontal: 24,
          }}
        >
          <Pressable
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
          >
            <Ionicons name="close" size={22} color={TEXT} />
          </Pressable>

          <Text style={styles.h1}>Add Card</Text>
          <Text style={styles.sub}>Enter your card details</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter card holder’s name"
            placeholderTextColor="#B2B2B7"
            autoCapitalize="words"
            value={holder}
            onChangeText={setHolder}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter card number"
            placeholderTextColor="#B2B2B7"
            keyboardType="numeric"
            value={number}
            onChangeText={t => setNumber(formatNumber(t))}
            maxLength={brand === 'amex' ? 17 : 19}
          />

          {/* labels for expire / cvv */}
          <View style={styles.expHeaderRow}>
            <Text style={styles.expireLabel}>Expire</Text>
            <Text style={styles.cvvLabel}>CVV</Text>
          </View>

          {/* MM / YYYY / CVV row */}
          <View style={styles.expRow}>
            <Pressable
              style={[styles.fakePicker, { flex: 1 }]}
              onPress={openMonthSheet}
            >
              <Text
                style={[
                  styles.pickerText,
                  !month && { color: '#B2B2B7' },
                ]}
              >
                {month || 'MM'}
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color="#B2B2B7"
                style={styles.pickerIcon}
              />
            </Pressable>

            <Pressable
              style={[styles.fakePicker, { flex: 1 }]}
              onPress={openYearSheet}
            >
              <Text
                style={[
                  styles.pickerText,
                  !year && { color: '#B2B2B7' },
                ]}
              >
                {year || 'YYYY'}
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color="#B2B2B7"
                style={styles.pickerIcon}
              />
            </Pressable>

            <TextInput
              style={styles.cvv}
              placeholder="CVV"
              placeholderTextColor="#B2B2B7"
              keyboardType="numeric"
              value={cvv}
              onChangeText={t =>
                setCvv(
                  t.replace(/\D+/g, '').slice(0, brand === 'amex' ? 4 : 3),
                )
              }
              secureTextEntry
            />
          </View>

          <View style={styles.squarePill}>
            <Image
              source={assets.images.squareIcon}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
            <Text style={styles.squareText}>
              Square hold funds and charge after drop-off
            </Text>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={TEXT}
            />
          </View>

          {/* brands in one centered line */}
          <View style={styles.brandsRow}>
            {[
              assets.images.payment1,
              assets.images.payment2,
              assets.images.payment3,
              assets.images.payment4,
              assets.images.payment5,
              assets.images.payment6,
              assets.images.payment7,
            ].map((icon, idx) => (
              <View key={idx} style={styles.brandPill}>
                <Image
                  source={icon}
                  style={{ width: 40, height: 24, resizeMode: 'contain' }}
                />
              </View>
            ))}
          </View>
        </View>

        <Pressable
          style={[styles.cta, !valid && { opacity: 0.4 }]}
          onPress={submit}
          disabled={!valid}
        >
          <Text style={styles.ctaText}>+ Add Card</Text>
          <View style={styles.ctaIcon}>
            <Ionicons name="arrow-forward" size={18} color={TEXT} />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    width: 48,
    height: 48,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 4 },
    }),
  },
  h1: { color: TEXT, fontSize: 24, fontFamily: FONTS.semibold, marginTop:16 },
  sub: {
    color: TEXT,
    fontSize: 18,
    fontFamily: FONTS.semibold,
    marginTop: 8,
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
    paddingHorizontal: 18,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  /* expire / cvv layout */
  expHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 4,
  },
  expireLabel: {
    color: '#201E20',
    fontFamily: FONTS.semibold,
    fontSize:16,
  },
  cvvLabel: {
     color: '#201E20',
    fontFamily: FONTS.semibold,
    fontSize:16,
    right:54,
  },

  expRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  fakePicker: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerText: {
    flex: 1,
    color: TEXT,
    fontFamily: FONTS.regular,
  },
  pickerIcon: {
    marginLeft: 4,
  },
  cvv: {
    width: 90,
    height: 50,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
  },

  squarePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: MINT,
    borderRadius: 18,
    padding: 9,
    marginVertical: 85,
  },
  squareText: { flex: 1, color: TEXT, fontFamily: FONTS.regular, fontSize:13 },

  brandsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 18,
    marginTop: 4,
  },
  brandPill: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  cta: {
    marginHorizontal: 24,
    marginVertical: 34,
    height: 56,
    borderRadius: 32,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontFamily: FONTS.bold, fontSize: 16 },
  ctaIcon: {
    position: 'absolute',
    right: 8,
    width: 44,
    height: 44,
    borderRadius: 32,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
