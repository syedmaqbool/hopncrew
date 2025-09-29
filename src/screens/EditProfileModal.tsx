// src/screens/EditProfileModal.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Switch,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

type Country = { code: string; dial: string; label: string; flag: string };

const COUNTRIES: Country[] = [
  { code: 'US', dial: '+1',   label: 'United States', flag: '🇺🇸' },
  { code: 'GB', dial: '+44',  label: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AE', dial: '+971', label: 'UAE', flag: '🇦🇪' },
  { code: 'PK', dial: '+92',  label: 'Pakistan', flag: '🇵🇰' },
];

const MINT = '#B9FBE7';

export default function EditProfileModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  const initial = route.params?.initial ?? {
    name: '',
    email: '',
    dial: '+1',
    phone: '',
    whatsappSame: false,
    referral: '',
    avatarUrl: undefined as string | undefined,
  };

  const initialCountry =
    COUNTRIES.find(c => c.dial === initial.dial) ?? COUNTRIES[0];

  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [country, setCountry] = useState<Country>(initialCountry);
  const [phone, setPhone] = useState(initial.phone);
  const [whatsappSame, setWhatsappSame] = useState(initial.whatsappSame);
  const [referral, setReferral] = useState(initial.referral);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(initial.avatarUrl);
  const [pickerOpen, setPickerOpen] = useState(false);

  const canSave = useMemo(
    () => name.trim().length > 0 && /\S+@\S+\.\S+/.test(email) && phone.trim().length >= 7,
    [name, email, phone]
  );

  const onClose = () => navigation.goBack();

  const onSave = () => {
    if (!canSave) return;
    route.params?.onSave?.({
      name: name.trim(),
      email: email.trim(),
      dial: country.dial,
      phone: phone.trim(),
      whatsappSame,
      referral: referral.trim(),
      avatarUrl,
    });
    navigation.goBack();
  };

  const pickAvatar = async () => {
    // Hook up your picker here (e.g., react-native-image-picker)
    // setAvatarUrl('file://...');
  };

  return (
    <View style={styles.fill}>
      {/* Tap outside to dismiss */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      <SafeAreaView style={styles.sheetWrap} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 24 : 0}
          style={{ flex: 1 }}
        >
          <View style={styles.sheet}>
            {/* Header row */}
            <View style={styles.headerRow}>
              <Pressable style={styles.hamBtn} onPress={onClose}>
                <Ionicons name="close" size={18} color="#111" />
              </Pressable>
              <Text style={styles.headerTitle}>Edit Profile</Text>
              <View style={{ width: 34 }} />
            </View>

            {/* Decorative map slice is implied behind; we keep the top white block rounded */}
            <ScrollView
              contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.helper}>
                You can edit the details &{'\n'}update your profile
              </Text>

              {/* Avatar */}
              <View style={styles.avatarWrap}>
                <View style={styles.avatarCircle}>
                  {avatarUrl ? (
                    <Image
                      source={{ uri: avatarUrl }}
                      style={styles.avatarImg}
                    />
                  ) : (
                    <Ionicons name="person" size={36} color="#6C7075" />
                  )}
                </View>
                <Pressable style={styles.pencil} onPress={pickAvatar}>
                  <Ionicons name="pencil" size={14} color="#111" />
                </Pressable>
              </View>
              <Text style={styles.avatarLabel}>Your Profile Picture</Text>

              {/* Inputs */}
              <TextInput
                style={styles.input}
                placeholder="Paula Lewis"
                placeholderTextColor="#9AA0A6"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={styles.input}
                placeholder="paula@example.com"
                placeholderTextColor="#9AA0A6"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <View style={styles.phoneRow}>
                <Pressable style={styles.ccBtn} onPress={() => setPickerOpen(true)}>
                  <Text style={styles.ccTxt}>{country.flag}  {country.dial}</Text>
                  <Ionicons name="chevron-down" size={14} color="#777" />
                </Pressable>
                <TextInput
                  style={[styles.input, { flex: 1, marginTop: 0 }]}
                  placeholder="0123456789"
                  placeholderTextColor="#9AA0A6"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              {/* WhatsApp same number */}
              <View style={styles.switchRow}>
                <View style={styles.checkboxLike}>
                  <Switch
                    value={whatsappSame}
                    onValueChange={setWhatsappSame}
                    trackColor={{ true: MINT, false: '#EEE' }}
                    thumbColor={whatsappSame ? '#111' : '#fff'}
                  />
                </View>
                <Text style={styles.switchLabel}>Same no on What'sApp?</Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Referral Code"
                placeholderTextColor="#9AA0A6"
                autoCapitalize="characters"
                value={referral}
                onChangeText={setReferral}
              />

            </ScrollView>

            {/* Update CTA */}
            <Pressable
              style={[styles.cta, !canSave && { opacity: 0.5 }]}
              onPress={onSave}
              disabled={!canSave}
            >
              <Text style={styles.ctaTxt}>Update</Text>
              <View style={styles.ctaIcon}>
                <AntDesign name="arrowright" size={18} color="#111" />
              </View>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Country picker modal */}
      <Modal
        transparent
        visible={pickerOpen}
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
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
    </View>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  fill: { flex: 1, marginTop: 170 },
  // keep background visible (map/screen)
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '1000%',
    overflow: 'hidden',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    justifyContent: 'space-between',
  },
  hamBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#EEE',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },

  helper: {
    textAlign: 'center',
    color: '#6C7075',
    marginTop: 6,
    marginBottom: 10,
  },

  avatarWrap: { alignItems: 'center', marginTop: 6 },
  avatarCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#EDEFF1',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  pencil: {
    marginTop: -14,
    backgroundColor: MINT,
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#D6F6EB',
  },
  avatarLabel: {
    textAlign: 'center',
    color: '#111',
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
  },

  input: {
    height: 46,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    color: '#111',
    marginTop: 10,
  },

  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  ccBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: '#E6E6E6',
    backgroundColor: '#fff', borderRadius: 24,
    paddingVertical: 10, paddingHorizontal: 12,
  },
  ccTxt: { fontSize: 14, color: '#111' },

  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  checkboxLike: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F6F7F8',
    borderWidth: 1, borderColor: '#EEE',
  },
  switchLabel: { color: '#111', fontWeight: '600' },

  cta: {
    margin: 16,
    height: 50,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaTxt: { color: '#fff', fontWeight: '700' },
  ctaIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: MINT, alignItems: 'center', justifyContent: 'center',
  },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 8 },
});
