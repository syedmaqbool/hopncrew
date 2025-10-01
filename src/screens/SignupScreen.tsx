import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, Pressable, Modal, StyleSheet, SafeAreaView, Image, Linking, Alert,KeyboardAvoidingView,Platform, ScrollView, ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { signup,register  } from '../services/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

type Country = { code: string; dial: string; label: string; flag: string };
const COUNTRIES: Country[] = [
  { code: 'US', dial: '+1',   label: 'United States',    flag: '🇺🇸' },
  { code: 'PK', dial: '+92',  label: 'Pakistan',         flag: '🇵🇰' },
  { code: 'GB', dial: '+44',  label: 'United Kingdom',   flag: '🇬🇧' },
  { code: 'AE', dial: '+971', label: 'UAE',              flag: '🇦🇪' },
];

const MINT = '#B9FBE7';
const CARD_BG = '#FFFFFF';
const AVATAR_SIZE = 72;
const AVATAR_RADIUS = AVATAR_SIZE / 2;
const PENCIL_RIGHT = -AVATAR_SIZE / 6; // same offset you wanted

export default function SignupScreen({ navigation }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [country, setCountry]   = useState<Country>(COUNTRIES[0]);
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [sameWhatsapp, setSameWhatsapp] = useState(true);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => {
    const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return name.trim().length >= 2 && phone.trim().length >= 7 && emailOk;
  }, [name, phone, email]);

   const canSubmit =
    firstName.trim() && lastName.trim() &&
    /\S+@\S+\.\S+/.test(email) &&
    password.length >= 8 &&
    confirm === password;

  const pickImage = async () => {
    try {
      // Dynamic import so the app runs even if lib isn't installed yet.
      const {launchImageLibrary} = await import('react-native-image-picker');
      const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 });
      const uri = res.assets?.[0]?.uri;
      if (uri) setAvatarUri(uri);
    } catch {
      Alert.alert(
        'Add photo',
        'To choose a profile picture, install image picker:\n\nnpm i react-native-image-picker'
      );
    }
  };

//  const onSubmit = async () => {
//     // if (!isValid) return;
//     // console.log('signup', { name, email, dial: country.dial, phone, sameWhatsapp, avatarUri });
//     // // TODO: call your signup API; then maybe go to OTP:
//     // // navigation.navigate('Otp', { dial: country.dial, phone });
//     // navigation.navigate('Location');
//      if (!isValid) return;
//     setLoading(true);
//     try {
//       console.log( 'login', { name, email, dial: country.dial, phone, sameWhatsapp, avatarUri });
//       const user = await signup({ name: name.trim(), email: email.trim(), number: phone.trim() });
//       console.log('user', user);
//       // TODO: stash user in your app state if you have an AuthContext
//       navigation.replace('App'); // or wherever you want to land post-signup
//     } catch (e: any) {
//       const msg =
//         e?.response?.data?.message ||
//         e?.message ||
//         'Unable to sign up right now. Please try again.';
//       Alert.alert('Signup failed', msg);
//     } finally {
//       setLoading(false);
//     }
//   };


const onSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      const res = await register({
        email,
        password,
        password_confirmation: confirm,
        first_name: firstName,
        last_name: lastName,
      });

      // Success → navigate to OTP flow, pass email/userId
      const user = res.data.user;
      const serverMsg = res.data.message ?? 'Please verify the OTP sent to your email.';

      Alert.alert('Registration Successful', serverMsg, [
        {
          text: 'Verify OTP',
          onPress: () =>
            navigation.replace('Otp', {
              email: user.email,            // adjust to your OtpScreen params
              userId: user.id,
            }),
        },
      ]);
    } catch (e: any) {
      Alert.alert('Registration failed', String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111" />
        </Pressable>
      </View>

   

   <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

      {/* Decorative top */}
      <View style={styles.hero} />

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.createTitle}>Create Your hop’n Account!</Text>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
            ) : (
              <MaterialCommunityIcons name="account" size={42} color="#7A7A7A" />
            )}
          </View>
          <Pressable style={styles.pencil} onPress={pickImage} hitSlop={8}>
            <MaterialCommunityIcons name="pencil" size={16} color="#111" />
          </Pressable>
        </View>
        <Text style={styles.avatarLabel}>Your Profile Picture</Text>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#9AA0A6"
          value={name}
          onChangeText={setName}
        />

        <TextInput style={styles.input} placeholder="First name" value={firstName} onChangeText={setFirstName} autoCapitalize="words" />
        <TextInput style={styles.input} placeholder="Last name"  value={lastName}  onChangeText={setLastName}  autoCapitalize="words" />


        <TextInput
          style={styles.input}
          placeholder="Your Email ID"
          placeholderTextColor="#9AA0A6"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Phone row */}
        <View style={styles.inputRow}>
          <Pressable style={styles.ccButton} onPress={() => setPickerOpen(true)}>
            <Text style={styles.ccText}>{country.flag}  {country.dial}</Text>
            <Ionicons name="chevron-down" size={16} color="#777" />
          </Pressable>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Mobile Number"
            placeholderTextColor="#9AA0A6"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TextInput style={styles.input} placeholder="Password (min 8)" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry />


        {/* WhatsApp checkbox */}
        <Pressable style={styles.checkboxRow} onPress={() => setSameWhatsapp(v => !v)}>
          <View style={[styles.checkboxBox, sameWhatsapp && styles.checkboxChecked]}>
            {sameWhatsapp && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Text style={styles.checkboxText}>Same no on WhatsApp?</Text>
        </Pressable>

        {/* Terms */}
        <Text style={styles.termsText}>
          By sign up you accept the{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://example.com/terms')}>Term of service</Text>
          {' '}and{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://example.com/privacy')}>Privacy Policy</Text>
        </Text>

        {/* Sign up button */}
        <Pressable
          style={[styles.signUpBtn, !canSubmit && { opacity: 0.5 }]}
          onPress={onSubmit}
          disabled={!canSubmit || loading}
        >
          <Text style={styles.signUpText}>Sign up</Text>
          <View style={styles.signUpArrow}>
            <AntDesign name="arrowright" size={18} color="#111" />
          </View>
        </Pressable>

        {/* Divider + socials */}
        <View style={styles.divider} />
        <Text style={styles.or}>Or continue with</Text>
        <View style={styles.socialRow}>
          <Pressable style={styles.social}><FontAwesome name="linkedin" size={18} color="#0A66C2" /></Pressable>
          <Pressable style={styles.social}><FontAwesome name="facebook" size={18} color="#1877F2" /></Pressable>
          <Pressable style={styles.social}><AntDesign name="google" size={18} color="#DB4437" /></Pressable>
          <Pressable style={styles.social}><AntDesign name="apple1" size={18} color="#000" /></Pressable>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
        </View>
      )}
          </ScrollView>
      </KeyboardAvoidingView>

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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: MINT },
  container: { padding: 16, paddingTop: 24 },
  header: { paddingHorizontal: 16, paddingTop: 54 },
  hero: {
    height: 96, marginHorizontal: 16, marginTop: 8,
    borderRadius: 20, backgroundColor: '#CFFCED',
  },
  card: {
    flex: 1, backgroundColor: CARD_BG, marginTop: 16,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16,
  },
  createTitle: { fontSize: 20, fontWeight: '700', color: '#111', marginBottom: 12 },

  avatarWrap: { alignItems: 'center', marginTop: 4, marginBottom: 10 },
  avatarCircle: {
    width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_RADIUS, backgroundColor: '#E8FFF6',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarImg: { width: AVATAR_SIZE, height: AVATAR_SIZE , borderRadius: AVATAR_RADIUS },
  pencil: {
    position: 'absolute', right: 136, bottom: 2,
    width: 24, height: 24, borderRadius: 12, backgroundColor: MINT,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E6E6E6',
  },
  avatarLabel: { textAlign: 'center', color: '#666', marginBottom: 12 },

  input: {
    height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#E6E6E6',
    paddingHorizontal: 14, backgroundColor: '#fff', color: '#111', marginTop: 10,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },

  ccButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: '#E6E6E6', backgroundColor: '#fff',
    borderRadius: 24, paddingVertical: 10, paddingHorizontal: 12,
  },
  ccText: { fontSize: 14, color: '#111' },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
      },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  checkboxBox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#E0E0E0',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  checkboxChecked: { backgroundColor: '#111', borderColor: '#111' },
  checkboxText: { color: '#111' },

  termsText: { color: '#666', marginTop: 10, lineHeight: 18 },
  link: { color: '#111', textDecorationLine: 'underline' },

  signUpBtn: {
    marginTop: 14, height: 48, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  signUpText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  signUpArrow: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: MINT,
    alignItems: 'center', justifyContent: 'center',
  },

  divider: { height: 1, backgroundColor: '#EFEFEF', marginVertical: 16 },
  or: { textAlign: 'center', color: '#666', marginBottom: 12 },

  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
  social: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#EEE', alignItems: 'center', justifyContent: 'center', elevation: 1,
  },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff', paddingHorizontal: 12, paddingTop: 12, paddingBottom: 24,
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#111' },
});
