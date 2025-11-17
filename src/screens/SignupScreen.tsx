/* eslint-disable react-native/no-inline-styles */
import { Picker } from '@react-native-picker/picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import assets from '../../assets';
import type { RootStackParamList } from '../navigation/types';
import { register } from '../services/auth';
import { FONTS } from '../../src/theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

type Country = { code: string; dial: string; label: string; flag: string };
const COUNTRIES: Country[] = [
  { code: 'US', dial: '+1', label: 'United States', flag: '🇺🇸' },
  { code: 'PK', dial: '+92', label: 'Pakistan', flag: '🇵🇰' },
  { code: 'GB', dial: '+44', label: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AE', dial: '+971', label: 'UAE', flag: '🇦🇪' },
];

const MINT = '#B9FBE7';
const CARD_BG = '#FFFFFF';
const AVATAR_SIZE = 72;
const AVATAR_RADIUS = AVATAR_SIZE / 2;

export default function SignupScreen({ navigation }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sameWhatsapp, setSameWhatsapp] = useState(true);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const emailOk = useMemo(() => /^\S+@\S+\.\S+$/.test(email), [email]);
  const canSubmit =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    emailOk &&
    password.length >= 8 &&
    confirm === password;

  const pickImage = async () => {
    try {
      const { launchImageLibrary } = await import('react-native-image-picker');
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      });
      const uri = res.assets?.[0]?.uri;
      if (uri) setAvatarUri(uri);
    } catch {
      Alert.alert(
        'Add photo',
        'To choose a profile picture, install image picker:\n\nnpm i react-native-image-picker',
      );
    }
  };

  const onSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      const res = await register({
        email: email.trim(),
        password,
        password_confirmation: confirm,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
      });

      const user = (res as any).data?.user ?? null;
      const serverMsg =
        (res as any).message ?? 'Please verify the OTP sent to your email.';

      Alert.alert('Registration Successful', serverMsg, [
        {
          text: 'Verify OTP',
          onPress: () =>
            navigation.replace('Otp', {
              email: user?.email ?? email.trim(),
              user: user ?? {
                first_name: firstName,
                last_name: lastName,
                email: email.trim(),
              },
            }),
        },
      ]);
    } catch (e: any) {
      Alert.alert('Registration failed', String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={assets.images.Sbg}
      style={styles.bg}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={assets.images.backArrow}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          </Pressable>
        </View>

        {/* Title */}
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Create Your hop’n{'\n'}Account</Text>
        </View>
        {/* Keyboard-safe area */}
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.container,
            { flexGrow: 1, paddingBottom: 2 },
          ]}
          enableOnAndroid
          enableAutomaticScroll
          keyboardShouldPersistTaps="handled"
          keyboardOpeningTime={0}
          extraScrollHeight={50} // push focused input above keyboard
          extraHeight={Platform.select({ android: 100, ios: 0 })} // helps some OEMs
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero} />

          {/* Card */}
          <View style={styles.card}>
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <View style={styles.avatarCircle}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
                ) : (
                  <MaterialCommunityIcons
                    name="account"
                    size={42}
                    color="#7A7A7A"
                  />
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
              placeholder="First name"
              placeholderTextColor="#9AA0A6"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder="Last name"
              placeholderTextColor="#9AA0A6"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder="Your Email ID"
              placeholderTextColor="#9AA0A6"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
            />

            {/* Phone row */}
            <View style={styles.phoneInputRow}>
              <Pressable
                style={styles.ccButton}
                onPress={() => setPickerOpen(true)}
              >
                <Text style={styles.ccText}>
                  {country.flag} {country.dial}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#777" />
              </Pressable>
              <TextInput
                style={styles.phoneInput}
                placeholder="Mobile Number"
                placeholderTextColor="#9AA0A6"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                returnKeyType="next"
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Password (min 8)"
              placeholderTextColor="#9AA0A6"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#9AA0A6"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              returnKeyType="done"
            />

            {/* WhatsApp checkbox */}
            <Pressable
              style={styles.checkboxRow}
              onPress={() => setSameWhatsapp(v => !v)}
            >
              <View
                style={[
                  styles.checkboxBox,
                  sameWhatsapp && styles.checkboxChecked,
                ]}
              >
                {sameWhatsapp && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxText}>Same number on WhatsApp?</Text>
            </Pressable>

            {/* Terms */}
            <Text style={styles.termsText}>
              By signing up you accept the{' '}
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://example.com/terms')}
              >
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://example.com/privacy')}
              >
                Privacy Policy
              </Text>
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
              <Pressable style={styles.social}>
                <FontAwesome name="linkedin" size={18} color="#0A66C2" />
              </Pressable>
              <Pressable style={styles.social}>
                <FontAwesome name="facebook" size={18} color="#1877F2" />
              </Pressable>
              <Pressable style={styles.social}>
                <AntDesign name="google" size={18} color="#DB4437" />
              </Pressable>
              <Pressable style={styles.social}>
                <AntDesign name="apple1" size={18} color="#000" />
              </Pressable>
            </View>
          </View>

          {/* Extra bottom space so last input isn’t covered */}
          <View style={{ height: 24 }} />

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" />
            </View>
          )}
        </KeyboardAwareScrollView>

        {/* Country picker modal */}
        <Modal
          transparent
          visible={pickerOpen}
          animationType="fade"
          onRequestClose={() => setPickerOpen(false)}
        >
          <Pressable
            style={styles.modalBg}
            onPress={() => setPickerOpen(false)}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Select country</Text>
              <Picker
                selectedValue={country.code}
                onValueChange={val => {
                  const next = COUNTRIES.find(c => c.code === val)!;
                  setCountry(next);
                }}
              >
                {COUNTRIES.map(c => (
                  <Picker.Item
                    key={c.code}
                    label={`${c.flag} ${c.label} (${c.dial})`}
                    value={c.code}
                  />
                ))}
              </Picker>
            </View>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  container: { paddingBottom: 20 },
  header: { paddingHorizontal: 16, paddingTop: 74 },

  hero: { flex: 1 },

  card: {
    // flex: 1,
    backgroundColor: CARD_BG,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },

  titleWrap: { paddingHorizontal: 16, marginTop: 20 },
  title: {
    fontSize: 24,
    lineHeight: 30,
    color: '#111',
    fontFamily: FONTS.bold,
  },

  avatarWrap: { alignItems: 'center', marginTop: 4, marginBottom: 10 },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_RADIUS,
    backgroundColor: '#E8FFF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_RADIUS,
  },
  pencil: {
    position: 'absolute',
    right: '36%',
    bottom: 2, // relative so it doesn’t break on small screens
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  avatarLabel: {
    textAlign: 'center',
    color: '#000',
    fontSize: 20,
    marginBottom: 12,
    fontFamily: FONTS.bold,
  },

  input: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    color: '#111',
    marginTop: 10,
    fontFamily: FONTS.regular,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    // paddingVertical: 6,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
  },

  ccButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 0,
  },
  ccText: { fontSize: 14, color: '#111', fontFamily: FONTS.semibold },
  phoneInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 16,
    paddingVertical: 0,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: { backgroundColor: '#111', borderColor: '#111' },
  checkboxText: { color: '#111', fontFamily: FONTS.regular },

  termsText: {
    color: '#666',
    marginTop: 10,
    lineHeight: 18,
    fontFamily: FONTS.regular,
  },
  link: {
    color: '#111',
    textDecorationLine: 'underline',
    fontFamily: FONTS.regular,
  },

  signUpBtn: {
    marginTop: 14,
    height: 48,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: { color: '#fff', fontFamily: FONTS.semibold, fontSize: 16 },
  signUpArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },

  divider: { height: 1, backgroundColor: '#EFEFEF', marginVertical: 16 },
  or: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 12,
    fontFamily: FONTS.regular,
  },

  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
  social: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#111',
    fontFamily: FONTS.semibold,
  },
});
