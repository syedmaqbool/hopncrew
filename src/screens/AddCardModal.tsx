// src/screens/AddCardModal.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, ScrollView,
  KeyboardAvoidingView, Platform, Keyboard           // 👈 add Keyboard
} from 'react-native';;
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, SavedCard } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddCard'>;

const MINT = '#B9FBE7';

const detectBrand = (num: string): SavedCard['brand'] => {
  const n = num.replace(/\s+/g, '');
  if (/^4\d{12,18}$/.test(n)) return 'visa';
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))\d{12,15}$/.test(n)) return 'mastercard';
  if (/^3[47]\d{13}$/.test(n)) return 'amex';
  if (/^6(011|5)/.test(n)) return 'discover';
  return 'generic';
};

const luhn = (num: string) => {
  const s = num.replace(/\s+/g, '');
  let sum = 0, dbl = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = parseInt(s[i], 10);
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d; dbl = !dbl;
  }
  return sum % 10 === 0;
};

export default function AddCardModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
const [kbHeight, setKbHeight] = useState(0);
  const [holder, setHolder] = useState('');
  const [number, setNumber] = useState('');       // formatted with spaces
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [cvv, setCvv] = useState('');

  const clean = number.replace(/\s+/g, '');
  const brand = detectBrand(number);

  const years = useMemo(() => {
    const y: string[] = [];
    const start = new Date().getFullYear() % 100;   // YY
    for (let i = 0; i <= 12; i++) y.push(String(start + i).padStart(2, '0'));
    return y;
  }, []);

  useEffect(() => {
  const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
  const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
  const s = Keyboard.addListener(showEvt, e => setKbHeight(e.endCoordinates.height));
  const h = Keyboard.addListener(hideEvt, () => setKbHeight(0));
  return () => { s.remove(); h.remove(); };
}, []);

  const valid = useMemo(() => {
    if (holder.trim().length < 2) return false;
    if (clean.length < 12) return false;
    if (!luhn(number)) return false;
    if (!month || !year) return false;
    const mm = parseInt(month, 10);
    if (mm < 1 || mm > 12) return false;
    if (brand === 'amex') {
      if (cvv.length !== 4) return false;
    } else {
      if (cvv.length !== 3) return false;
    }
    return true;
  }, [holder, number, month, year, cvv, brand, clean.length]);

  const formatNumber = (raw: string) => {
    // keep digits only, insert spaces: 4-4-4-4...
    const digits = raw.replace(/\D+/g, '');
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const submit = () => {
    // if (!valid) return;
    // const card: SavedCard = {
    //   id: 'card_' + Date.now(),
    //   brand,
    //   last4: clean.slice(-4),
    //   exp: `${month}/${year}`,
    //   holder: holder.trim(),
    // };
    // route.params?.onAdded?.(card);
    // navigation.goBack();
    navigation.navigate('Processing', {
  durationMs: 12000,
  onDone: () => {
    // e.g. go to a confirmation screen, or just close:
    navigation.goBack();
  },
});
  };

  return (
    <View style={{ flex: 1 }}>
      {/* dim background */}
      <Pressable style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.12)' }]} onPress={() => navigation.goBack()} />
      <SafeAreaView edges={['bottom']} style={styles.wrap}>
       <KeyboardAvoidingView
            behavior={Platform.select({ ios: 'padding', android: 'height' })}
            keyboardVerticalOffset={insets.top + 16}   // 👈 important
            style={{ flex: 1, justifyContent: 'flex-end' }}
            >
          <View style={[styles.sheet, { paddingTop: insets.top + 8 }]}>
            {/* header */}
            <View style={styles.header}>
              <Pressable style={styles.close} onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={18} color="#111" />
              </Pressable>
              <Text style={styles.title}>Add Card</Text>
            </View>

            <ScrollView
                ref={scrollRef}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sub}>Enter your card details</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter card holder’s name"
                placeholderTextColor="#9AA0A6"
                value={holder}
                 onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                onChangeText={setHolder}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter card number"
                placeholderTextColor="#9AA0A6"
                keyboardType="numeric"
                value={number}
                onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}  // 👈 nudge up
                onChangeText={(t) => setNumber(formatNumber(t))}
                maxLength={brand === 'amex' ? 17 : 19} // with spaces
              />

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                <View style={[styles.selectBox, { flex: 1 }]}>
                  <Text style={styles.selectLabel}>Expire</Text>
                  <Picker
                    selectedValue={month}
                    onValueChange={(v) => setMonth(v)}
                    style={styles.picker}
                  >
                    <Picker.Item label="MM" value="" />
                    {Array.from({ length: 12 }).map((_, i) => {
                      const m = String(i + 1).padStart(2, '0');
                      return <Picker.Item key={m} label={m} value={m} />;
                    })}
                  </Picker>
                </View>

                <View style={[styles.selectBox, { flex: 1 }]}>
                  <Text style={styles.selectLabel}>{' '}</Text>
                  <Picker
                    selectedValue={year}
                    onValueChange={(v) => setYear(v)}
                    style={styles.picker}
                  >
                    <Picker.Item label="YY" value="" />
                    {years.map((y) => (
                      <Picker.Item key={y} label={y} value={y} />
                    ))}
                  </Picker>
                </View>

                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="CVV"
                  placeholderTextColor="#9AA0A6"
                  keyboardType="numeric"
                  value={cvv}
                  onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                  onChangeText={(t) => setCvv(t.replace(/\D+/g, '').slice(0, brand === 'amex' ? 4 : 3))}
                  secureTextEntry
                />
              </View>

              {/* Square info pill */}
              <View style={styles.squarePill}>
                <View style={styles.squareLogo}>
                  <Text style={{ color: '#111', fontWeight: '800' }}>■</Text>
                </View>
                <Text style={{ flex: 1, color: '#111' }}>
                  Square hold funds and charge after drop-off
                </Text>
                <Ionicons name="information-circle-outline" size={18} color="#111" />
              </View>

              {/* Supported brands row (visual only) */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.brandsRow}
              >
                <BrandPill label="Visa" />
                <BrandPill label="Mastercard" />
                <BrandPill label="Amex" />
                <BrandPill label="Discover" />
                <BrandPill label="Apple Pay" />
                <BrandPill label="G Pay" />
              </ScrollView>
            </ScrollView>

            {/* CTA */}
            <Pressable style={[styles.cta, !valid && { opacity: 0.5 }]} onPress={submit} disabled={!valid}>
              <Text style={styles.ctaText}>+ Add Card</Text>
              <View style={styles.ctaIcon}>
                <Ionicons name="arrow-forward" size={18} color="#111" />
              </View>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function BrandPill({ label }: { label: string }) {
  return (
    <View style={styles.brandPill}>
      <Text style={{ color: '#111', fontWeight: '700', fontSize: 12 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '96%',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 6, paddingBottom: 6,
  },
  close: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  title: { color: '#111', fontWeight: '800', fontSize: 18 },
  sub: { color: '#6F6F6F', marginBottom: 8 },

  input: {
    height: 46,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    color: '#111',
    marginTop: 10,
  },

  selectBox: {
    borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 14, overflow: 'hidden',
    backgroundColor: '#fff', marginTop: 10,
  },
  selectLabel: { position: 'absolute', top: -18, left: 4, color: '#6F6F6F', fontSize: 12 },
  picker: { height: 46, color: '#111' },

  squarePill: {
    marginTop: 16, backgroundColor: MINT, borderRadius: 14, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  squareLogo: {
    width: 26, height: 26, borderRadius: 6, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },

  brandsRow: { gap: 8, paddingHorizontal: 16, paddingBottom: 10, marginTop: 16 },
  brandPill: {
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F6F7F8', borderWidth: 1, borderColor: '#EEE',
  },

  cta: {
    margin: 16, height: 50, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '800' },
  ctaIcon: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: MINT,
    alignItems: 'center', justifyContent: 'center',
  },
});
