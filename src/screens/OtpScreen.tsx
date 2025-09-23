import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { saveRefreshToken } from '../utils/biometricAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

const MINT = '#B9FBE7';

export default function OtpScreen({ route, navigation }: Props) {
  const { dial, phone } = route.params;

  const [cells, setCells] = useState<string[]>(['', '', '', '']); // 4-digit demo
  const [sec, setSec] = useState(56);
  const inputs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  useEffect(() => {
    const t = setInterval(() => setSec(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const code = useMemo(() => cells.join(''), [cells]);
  const isReady = code.length === cells.length && code.split('').every(Boolean);

  const setDigit = (i: number, text: string) => {
    // allow paste of multiple digits
    const nums = text.replace(/\D/g, '').slice(0, cells.length - i).split('');
    const next = [...cells];
    if (nums.length > 1) {
      nums.forEach((d, k) => (next[i + k] = d));
      setCells(next);
      const jumpTo = Math.min(i + nums.length, cells.length - 1);
      inputs[jumpTo].current?.focus();
      return;
    }
    next[i] = nums[0] ?? '';
    setCells(next);
    if (nums[0] && i < cells.length - 1) inputs[i + 1].current?.focus();
  };

  const onKeyPress = (i: number, key: string) => {
    if (key === 'Backspace' && !cells[i] && i > 0) inputs[i - 1].current?.focus();
  };

  const onContinue = async  () => {
    // TODO: verify OTP here
    console.log('Verify OTP:', code, 'for', dial, phone);
    // navigation.replace('Home'); // or wherever next
    // 1) verify OTP -> get real refresh token from API
  const refreshToken = 'demo-refresh-token-abc123'; // replace with real

  // 2) persist it (so biometrics can unlock it next time)
  const ok = await saveRefreshToken(refreshToken);
  if (!ok) {
    // optional: show a toast here
  }

  // 3) proceed to app
  navigation.replace('App');
  };

  const resend = () => {
    // TODO: call resend API
    console.log('Resend OTP to', dial, phone);
    setSec(56);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: MINT }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 54 }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111" />
        </Pressable>
      </View>

      {/* Decorative top */}
      <View style={styles.hero} />

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.sub}>
          We have sent an OTP on given number{'\n'}
          <Text style={{ fontWeight: '700', color: '#111' }}>{dial} {phone}</Text>
        </Text>

        <Text style={styles.label}>Enter OTP Code</Text>

        {/* OTP cells */}
        <View style={styles.cells}>
          {cells.map((v, i) => (
            <TextInput
              key={i}
              ref={inputs[i]}
              value={v}
              onChangeText={(t) => setDigit(i, t)}
              onKeyPress={({ nativeEvent }) => onKeyPress(i, nativeEvent.key)}
              style={styles.cell}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              autoFocus={i === 0}
              returnKeyType="done"
              importantForAutofill="yes"
              autoComplete="sms-otp"
              textContentType="oneTimeCode"
            />
          ))}
        </View>

        {/* Continue */}
        <Pressable
          style={[styles.cta, !isReady && { opacity: 0.5 }]}
          onPress={onContinue}
          disabled={!isReady}
        >
          <Text style={styles.ctaText}>Continue</Text>
          <View style={styles.ctaArrow}>
            <AntDesign name="arrowright" size={18} color="#111" />
          </View>
        </Pressable>

        {/* Resend row */}
        <View style={styles.resendRow}>
          <Pressable
            onPress={sec === 0 ? resend : undefined}
            style={[styles.resendBtn, sec !== 0 && styles.resendDisabled]}
          >
            <Text style={[styles.resendText, sec !== 0 && { color: '#aaa' }]}>
              Resend code
            </Text>
          </Pressable>
          <Text style={styles.timer}>{sec}</Text>
        </View>

        <Text style={styles.footerText}>
          Didn’t receive the OTP? <Text style={styles.resendLink} onPress={sec === 0 ? resend : undefined}>Resend</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 96, marginHorizontal: 16, marginTop: 8,
    borderRadius: 20, backgroundColor: '#CFFCED',
  },
  card: {
    flex: 1, backgroundColor: '#fff', marginTop: 16,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#111' },
  sub: { color: '#444', marginTop: 6, lineHeight: 20 },
  label: { marginTop: 18, marginBottom: 8, fontWeight: '600', color: '#111',marginLeft:30 },

  cells: { flexDirection: 'row', gap: 18, marginBottom: 12, marginLeft:30 },
  cell: {
    width: 56, height: 56, borderRadius: 12,
    borderWidth: 1, borderColor: '#E6E6E6', backgroundColor: '#fff',
    fontSize: 22, color: '#111',
  },

  cta: {
    height: 48, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginTop: 8,
  },
  ctaText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  ctaArrow: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#B9FBE7',
    alignItems: 'center', justifyContent: 'center',
  },

  resendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14, gap: 12 },
  resendBtn: {
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 18,
    backgroundColor: '#F4F4F4',
  },
  resendDisabled: { opacity: 0.6 },
  resendText: { color: '#111', fontWeight: '600' },
  timer: { marginLeft: 'auto', color: '#666' },

  footerText: { textAlign: 'center', color: '#666', marginTop: 18 },
  resendLink: { textDecorationLine: 'underline', color: '#111' },
});
