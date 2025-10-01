import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import {
  hasStoredToken,
  isBiometricsAvailable,
  getBiometryType,      // <- now exported
  loginWithBiometrics,
} from '../utils/biometricAuth';
import { Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';
import { login } from '../services/login';
import { useAuth } from '../context/AuthContext';


type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

type Country = { code: string; dial: string; label: string; flag: string };

const COUNTRIES: Country[] = [
  { code: 'US', dial: '+1',  label: 'United States', flag: '🇺🇸' },
  { code: 'PK', dial: '+92', label: 'Pakistan',       flag: '🇵🇰' },
  { code: 'GB', dial: '+44', label: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AE', dial: '+971',label: 'UAE',            flag: '🇦🇪' },
];

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [country, setCountry] = useState<Country>(COUNTRIES[0]); // default US
  const [phone, setPhone] = useState('');
   const [email, setEmail] = useState('');
   const [password,  setPassword]  = useState('');

  const [canBiometricLogin, setCanBiometricLogin] = useState(false);
  const [bioLabel, setBioLabel] = useState('Biometric');
  const [loading, setLoading]   = useState(false);

  const canSubmit = /\S+@\S+\.\S+/.test(email) && password.length >= 8;

// useEffect(() => {
//   (async () => {
//     const [hasToken, available] = await Promise.all([
//       hasStoredToken(),
//       isBiometricsAvailable(),
//     ]);

//     // Optional: log to verify gating
//     console.log('hasToken', hasToken, 'bioAvailable', available);

//     // Label from Keychain biometry type
//     const type = await getBiometryType();
//     setBioLabel(type === 'FaceID' ? 'Face ID' : type === 'TouchID' ? 'Touch ID' : 'Biometric');

//     setCanBiometricLogin(hasToken && available);
//   })();
// }, []);

const rnBiometrics = React.useMemo(
  () => new ReactNativeBiometrics({ allowDeviceCredentials: true }), // fallback to device PIN if no biometrics enrolled
  []
);

const readStoredToken = async (): Promise<string | null> => {
  const r = await Keychain.getGenericPassword({ service: 'com.hopnground.refresh-token' });
  return r === false ? null : r.password;
};


  const isValid = useMemo(() => phone.trim().length >= 7, [phone]);

  // const onSubmit = async () => {
  //   // TODO: call your OTP API here

  //   try {
  //     const res = await login(email, password);

  //      await saveToken(res.data.token);
  //     navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  //     // console.log(result);
  //     // navigation.navigate('Main');
  //   } catch (e: any) {
  //     Alert.alert('Sign in failed', String(e.message || e));
  //   }
  //   console.log('sign in with', country.dial, phone);
  //   // navigation.navigate('Otp', { dial: country.dial, phone });
  // };
  const onEmailLogin = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      // Persist {token,user} via AuthContext (which also sets axios Authorization)
      await signIn({
        token: res.data.token,
        user : res.data.user,
      });
      // Go to your main app
      navigation.reset({ index: 0, routes: [{ name: 'App' }] }); // or 'App' (drawer) if you prefer
    } catch (e: any) {
      Alert.alert('Login failed', String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  const onFaceIdPress = async () => {
   try {
    console.log('FaceID pressed');

    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    console.log('isSensorAvailable ->', available, biometryType);
    if (!available) {
      Alert.alert('Biometrics not available', 'Enroll Face/Touch ID or screen lock in device settings.');
      return;
    }

    // Show prompt (Android needs this; iOS can also use it for a consistent UX)
    const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Login with biometrics' });
    console.log('simplePrompt success ->', success);
    if (!success) return; // user cancelled

    // After success, read token from Keychain
    const token = await readStoredToken();
    console.log('readStoredToken ->', token);
    if (!token) {
      Alert.alert('No saved session', 'Sign in once with OTP to enable biometric login.');
      return;
    }

    // TODO: optionally exchange refresh token for access token here
    navigation.replace('App');
  } catch (e: any) {
    console.log('biometric error', e);
    Alert.alert('Biometric error', String(e?.message ?? e));
  }
};

  const onLinkedInPress = async () => {
      navigation.navigate('EnRoute', {
      etaMinutes: 18,
      riderName: 'David',
      onCancel: () => console.log('cancel ride'),
      onContact: () => console.log('contact driver'),
      onSupport: () => console.log('support'),
      onPolicies: () => navigation.navigate('Policies'),
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => console.log('Back')}>
          <Ionicons name="chevron-back" size={26} color="#111" />
        </Pressable>
      </View>

      {/* Decorative map-ish top block (subtle) */}
      <View style={styles.hero} />

      {/* Title */}
      <View style={styles.titleWrap}>
        <Text style={styles.title}>Sign in to Your hop’n{'\n'}Account!</Text>
      </View>

      {/* Phone input card */}
      <View style={styles.card}>
        <Text style={styles.label}>Enter your phone number</Text>

        <View style={styles.inputRow}>
          {/* Country selector */}
          <Pressable style={styles.ccButton} onPress={() => setPickerOpen(true)}>
            <Text style={styles.ccText}>{country.flag}  {country.dial}</Text>
            <Ionicons name="chevron-down" size={16} color="#777" />
          </Pressable>

          {/* Number */}
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor="#9AA0A6"
          />
          
        </View>

         <View style={styles.inputRow}> 

          <TextInput
                    style={styles.input}
                    placeholder="Your Email ID"
                    placeholderTextColor="#9AA0A6"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
          

         </View>
       <View style={styles.inputRow}> 
          <TextInput style={styles.input} placeholder="Password (min 8)" value={password} onChangeText={setPassword} secureTextEntry />
      </View>
        {/* Sign in */}
        <Pressable
          style={[styles.signInBtn, (!canSubmit || loading)   && { opacity: 0.5 }]}
          onPress={onEmailLogin}
          disabled={!canSubmit }
        >
          <Text style={styles.signInText}>Sign in</Text>
          <View style={styles.signInArrow}>
            <AntDesign name="arrowright" size={18} color="#111" />
          </View>

          
        </Pressable>

        <Text onPress={() => navigation.navigate('Signup')} style={{textAlign:'center', marginTop:10, textDecorationLine:'underline', color:'#111'}}>
  Create an account
</Text>

        {/* Divider */}
        <View style={styles.divider} />
        <Text style={styles.or}>Or continue with</Text>

        {/* Social logins (hooks to add later) */}
        <View style={styles.socialRow}>
          <Pressable onPress={() => onLinkedInPress()} style={styles.social}><FontAwesome name="linkedin" size={18} color="#0A66C2" /></Pressable>
          <Pressable style={styles.social}><FontAwesome name="facebook" size={18} color="#1877F2" /></Pressable>
          <Pressable style={styles.social}><AntDesign name="google" size={18} color="#DB4437" /></Pressable>
          <Pressable style={styles.social}><AntDesign name="apple1" size={18} color="#000" /></Pressable>
        </View>

        {/* Face ID */}
        <Pressable style={styles.faceId} onPress={onFaceIdPress} hitSlop={10}>
          <MaterialCommunityIcons name="face-recognition" size={28} color="#111" />
          <Text style={styles.faceIdText}>Login with Face ID</Text>
        </Pressable>
       
        {/* <Pressable
  style={[styles.faceIdButton, !canBiometricLogin && { opacity: 0.5 }]}
  onPress={onFaceIdPress}
  hitSlop={10}
>
  <MaterialCommunityIcons name="face-recognition" size={24} color="#111" />
  <Text style={styles.faceIdText}>Login with Face</Text>
</Pressable> */}
    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Login</Text>}

      </View>

      {/* Country picker modal */}
      <Modal transparent visible={pickerOpen} animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.modalBg} onPress={() => setPickerOpen(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select country</Text>
            <Picker
              selectedValue={country.code}
              onValueChange={(val) => {
                const next = COUNTRIES.find(c => c.code === val)!;
                setCountry(next);
              }}
            >
              {COUNTRIES.map(c => (
                <Picker.Item key={c.code} label={`${c.flag} ${c.label} (${c.dial})`} value={c.code} />
              ))}
            </Picker>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const MINT = '#B9FBE7'; // match your splash
const CARD_BG = '#FFFFFF';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: MINT },
  header: { paddingHorizontal: 16, paddingTop: 54 },
  hero: {
    height: 96,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    backgroundColor: '#CFFCED', // faint “map” block
  },
  titleWrap: { paddingHorizontal: 16, marginTop: 12 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700', color: '#111' },
  btnTxt: { color: '#fff', fontWeight: '700' },
  card: {
    flex: 1,
    backgroundColor: CARD_BG,
    marginTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },

  label: { color: '#111', fontSize: 14, marginBottom: 8, fontWeight: '600' },

  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ccButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  ccText: { fontSize: 14, color: '#111' },

  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    color: '#111',
  },

  signInBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  signInText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  signInArrow: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: MINT, alignItems: 'center', justifyContent: 'center',
  },

  divider: { height: 1, backgroundColor: '#EFEFEF', marginVertical: 16 },
  or: { textAlign: 'center', color: '#666', marginBottom: 12 },

  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
  social: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#EEE',
    alignItems: 'center', justifyContent: 'center',
    elevation: 1,
  },

  faceId: { alignItems: 'center', marginTop: 18 },
  faceIdText: { marginTop: 8, color: '#111', fontWeight: '500' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff', paddingHorizontal: 12, paddingTop: 12, paddingBottom: 24,
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#111' },
  faceIdButton: {
  marginTop: 18,
  height: 48,
  borderRadius: 28,
  borderWidth: 1,
  borderColor: '#E6E6E6',
  backgroundColor: '#fff',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  paddingHorizontal: 16, 
  elevation: 1,      // Android z
},
faceIdDisabled: { opacity: 0.5 },
});
