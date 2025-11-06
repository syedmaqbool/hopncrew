import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
<<<<<<< HEAD
  View, Text, TextInput, Pressable, StyleSheet, SafeAreaView,ActivityIndicator, Alert
=======
  View,
  Text,
  TextInput,
  Pressable,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { verifyOtp } from '../services/api';
import { saveToken } from '../services/auth';
import { saveRefreshToken } from '../utils/biometricAuth';
import { useAuth } from '../context/AuthContext';
<<<<<<< HEAD
import { register  } from '../services/auth';
=======
import { register } from '../services/auth';
import assets from '../../assets';
import { FONTS } from '../../src/theme/fonts';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
type Props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

const MINT = '#B9FBE7';

<<<<<<< HEAD

export default function OtpScreen({ route, navigation }: Props) {
  // const { dial, phone } = route.params;
  const { signIn } = useAuth();
  const { email, user } = route.params; 
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const [cells, setCells] = useState<string[]>(['', '', '', '','','']); // 4-digit demo
  const [sec, setSec] = useState(56);
  const inputs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null),useRef<TextInput>(null),useRef<TextInput>(null)];
=======
export default function OtpScreen({ route, navigation }: Props) {
  // const { dial, phone } = route.params;
  const { signIn } = useAuth();
  const { email, user } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const [cells, setCells] = useState<string[]>(['', '', '', '', '', '']); // 4-digit demo
  const [sec, setSec] = useState(56);
  const inputs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  useEffect(() => {
    const t = setInterval(() => setSec(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const code = useMemo(() => cells.join(''), [cells]);
  const isReady = code.length === cells.length && code.split('').every(Boolean);

  const setDigit = (i: number, text: string) => {
    // allow paste of multiple digits
<<<<<<< HEAD
    const nums = text.replace(/\D/g, '').slice(0, cells.length - i).split('');
=======
    const nums = text
      .replace(/\D/g, '')
      .slice(0, cells.length - i)
      .split('');
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
    const next = [...cells];
    if (nums.length > 1) {
      nums.forEach((d, k) => (next[i + k] = d));
      setCells(next);
      setOtp(next.join(''));
      const jumpTo = Math.min(i + nums.length, cells.length - 1);
      inputs[jumpTo].current?.focus();
      return;
    }
    next[i] = nums[0] ?? '';
    setCells(next);
    if (nums[0] && i < cells.length - 1) inputs[i + 1].current?.focus();
  };

  const onKeyPress = (i: number, key: string) => {
<<<<<<< HEAD
    if (key === 'Backspace' && !cells[i] && i > 0) inputs[i - 1].current?.focus();
=======
    if (key === 'Backspace' && !cells[i] && i > 0)
      inputs[i - 1].current?.focus();
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  };

  // const onContinue = async  () => {
  //   // TODO: verify OTP here
  //   console.log('Verify OTP:', code, 'for', dial, phone);
  //   // navigation.replace('Home'); // or wherever next
  //   // 1) verify OTP -> get real refresh token from API
  // const refreshToken = 'demo-refresh-token-abc123'; // replace with real

  // // 2) persist it (so biometrics can unlock it next time)
  // const ok = await saveRefreshToken(refreshToken);
  // if (!ok) {
  //   // optional: show a toast here
  // }

  // // 3) proceed to app
  // navigation.replace('App');
  // };

  const onVerify = async () => {
<<<<<<< HEAD
   const currentOtp = cells.join('').trim();
   if (currentOtp.trim().length < 6) {
             return;
            } // or 6—match your backend
=======
    const currentOtp = cells.join('').trim();
    if (currentOtp.trim().length < 6) {
      return;
    } // or 6—match your backend
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
    setLoading(true);
    try {
      const res = await verifyOtp(email, currentOtp.trim());
      // success
      await saveToken(res.data.token);
      Alert.alert('Verified', 'OTP verified successfully');
      await signIn({
        token: res.data.token,
<<<<<<< HEAD
        user : res.data.user,
=======
        user: res.data.user,
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
      });
      navigation.reset({ index: 0, routes: [{ name: 'App' }] });
    } catch (e: any) {
      // API returns 4xx with your error shape
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        'Invalid or expired OTP. Please try again.';
      Alert.alert('Verification failed', msg);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD

=======
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  const resend = async () => {
    // TODO: call resend API
    console.log('Resend OTP to', email);
    setSec(56);
    setLoading(true);
<<<<<<< HEAD
     try {
          const res = await register({
             email:user.email,
            password:user.password,
            password_confirmation: user.password_confirm,
            first_name: user.firstName,
            last_name: user.lastName,
          });

        }
        catch (e: any) {
              Alert.alert('Registration failed', String(e.message || e));
            } finally {
              setLoading(false);
            }
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
=======
    try {
      const res = await register({
        email: user.email,
        password: user.password,
        password_confirmation: user.password_confirm,
        first_name: user.firstName,
        last_name: user.lastName,
      });
    } catch (e: any) {
      Alert.alert('Registration failed', String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
     <ImageBackground
      source={assets.images.Sbg}
      style={styles.bg} // full-screen
      resizeMode="cover" // or "contain"/"stretch" as you like
    >
    <SafeAreaView style={{ flex: 1}}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 54 }}>
        <Pressable onPress={() => navigation.replace('Login')}>
          <Ionicons name="chevron-back" size={26} color="#111" />
        </Pressable>
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.sub}>
          We have sent an OTP on given email{'\n'}
          <Text style={{ fontWeight: '700', color: '#111' }}>{email}</Text>
        </Text>
<<<<<<< HEAD
=======
      </View>

      {/* Decorative top */}
      {/* <View style={styles.hero} /> */}

      {/* Card */}
      <View style={styles.card}>
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

        <Text style={styles.label}>Enter OTP Code</Text>

        {/* OTP cells */}
        <View style={styles.cells}>
          {cells.map((v, i) => (
            <TextInput
              key={i}
              ref={inputs[i]}
              value={v}
<<<<<<< HEAD
              onChangeText={(t) => setDigit(i, t)}
=======
              onChangeText={t => setDigit(i, t)}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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
          onPress={onVerify}
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
<<<<<<< HEAD
          Didn’t receive the OTP? <Text style={styles.resendLink} onPress={sec === 0 ? resend : undefined}>Resend</Text>
        </Text>
      </View>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700' }}>Verify</Text>}
      
    </SafeAreaView>
=======
          Didn’t receive the OTP?{' '}
          <Text
            style={styles.resendLink}
            onPress={sec === 0 ? resend : undefined}
          >
            Resend
          </Text>
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={{ color: '#fff', fontWeight: '700' }}>Verify</Text>
      )}
    </SafeAreaView>
    </ImageBackground>
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
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
=======
  bg: { flex: 1 },
  hero: {
    height: 66,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    backgroundColor: '#CFFCED',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  title: { fontSize: 22, color: '#111', fontFamily: FONTS.bold, marginTop:22 },
  sub: { color: '#444', marginTop: 6, lineHeight: 20, fontFamily: FONTS.regular},
  label: {
    marginTop: 18,
    marginBottom: 18,
    color: '#111',
    // marginLeft: 30,
    fontFamily: FONTS.semibold,
  },

  cells: { flexDirection: 'row', gap: 18, marginBottom: 12, marginLeft: 3 },
  cell: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#fff',
    fontSize: 22,
    color: '#111',
  },

  cta: {
    height: 48,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal:12,
    gap: 10,
    marginTop: 8,
  },
  ctaText: { color: '#fff', fontFamily: FONTS.semibold, fontSize: 16,marginLeft:130 },
  ctaArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#B9FBE7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 12,
  },
  resendBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#F4F4F4',
  },
  resendDisabled: { opacity: 0.6 },
  resendText: { color: '#111', fontFamily: FONTS.semibold },
  timer: { marginLeft: 'auto', color: '#666' },

  footerText: { textAlign: 'center', color: '#666', marginTop: 18,fontFamily: FONTS.regular },
  resendLink: { textDecorationLine: 'underline', color: '#111',fontFamily: FONTS.semibold },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});
