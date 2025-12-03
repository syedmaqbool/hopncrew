// src/screens/EditProfileScreen.tsx
import React, { useState, useMemo } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import { FONTS } from '../../src/theme/fonts';
import assets from '../../assets';

const COUNTRIES = [
  { code: 'US', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', dial: '+44', flag: '🇬🇧' },
  { code: 'AE', dial: '+971', flag: '🇦🇪' },
  { code: 'PK', dial: '+92', flag: '🇵🇰' },
];

const MINT = '#FFE55E';

export default function EditProfileScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [sameWhatsapp, setSameWhatsapp] = useState(true);

  const initial = route.params?.initial ?? {
    name: '',
    email: '',
    dial: '+1',
    phone: '',
    whatsappSame: false,
    referral: '',
    avatarUrl: undefined,
  };

  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [country, setCountry] = useState(
    COUNTRIES.find(c => c.dial === initial.dial) ?? COUNTRIES[0]
  );
  const [phone, setPhone] = useState(initial.phone);
  const [whatsappSame, setWhatsappSame] = useState(initial.whatsappSame);
  const [referral, setReferral] = useState(initial.referral);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [pickerOpen, setPickerOpen] = useState(false);

  const canSave = useMemo(
    () => name.trim().length > 0 && /\S+@\S+\.\S+/.test(email) && phone.trim().length >= 7,
    [name, email, phone]
  );

  const onSave = () => {
    if (!canSave) return;
    route.params?.onSave?.({
      name,
      email,
      phone,
      dial: country.dial,
      whatsappSame,
      referral,
      avatarUrl,
    });
    navigation.goBack();
  };

  const openMenu = () => navigation.goBack();

  return (
    <View style={{ flex: 1 }}>
      {/* BACKGROUND MAP IMAGE */}
      <Image
        source={require('../../assets/backgrounds/signin.png')}
        style={styles.mapBg}
        resizeMode="cover"
      />

      {/* SAFE AREA */}
      <SafeAreaView style={{ flex: 1 }}>

        {/* HEADER */}
        <View style={[styles.headerRow, { marginTop: 4 }]}>
          <Pressable style={styles.menuBtn} onPress={openMenu}>
            <Image
            source={assets.images.hamIcon}
            style={{ width: 48, height: 48, borderRadius: 20 }}
          />
          </Pressable>

          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        {/* WHITE PANEL */}
        <View style={styles.whitePanel}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
          >
            <Text style={styles.helperText}>
              You can edit the details &{'\n'}update your profile
            </Text>

            {/* AVATAR */}
            <View style={styles.avatarWrap}>
              <View style={styles.avatarCircle}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Image
                    source={require('../../assets/icons/defaultgirl.png')}
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
              </View>

              <Pressable style={styles.editBadge}>
                <Ionicons name="pencil" size={14} color="#111" />
              </Pressable>
            </View>

            <Text style={styles.avatarLabel}>Your Profile Picture</Text>

            {/* INPUTS */}
            <TextInput
              style={styles.input}
              placeholder="Paula Lewis"
              placeholderTextColor="#AAA"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="paula.lewis67@gmail.com"
              placeholderTextColor="#AAA"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            {/* PHONE */}
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
            

            {/* WHATSAPP SAME NUMBER */}
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

            <TextInput
              style={styles.input}
              placeholder="HOP29F"
              placeholderTextColor="#AAA"
              value={referral}
              onChangeText={setReferral}
              autoCapitalize="characters"
            />

            {/* UPDATE BUTTON */}
            <Pressable
              style={[styles.updateBtn, !canSave && { opacity: 0.4 }]}
              disabled={!canSave}
              onPress={onSave}
            >
              <Text style={styles.updateTxt}>Update</Text>
            </Pressable>

          </ScrollView>
        </View>
      </SafeAreaView>

      {/* COUNTRY PICKER */}
      {pickerOpen && (
        <View style={styles.pickerOverlay}>
          <Pressable style={{ flex: 1 }} onPress={() => setPickerOpen(false)} />
          <View style={styles.pickerCard}>
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
                  label={`${c.flag} ${c.dial}`}
                  value={c.code}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}
    </View>
  );
}

/* ------------------- STYLES ------------------- */

const styles = StyleSheet.create({
  mapBg: {
    width: '100%',
    height: '95%',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  headerRow: {
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 20,
    // justifyContent: 'space-between',
  },
  menuBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    marginTop:24,
    fontSize: 24,
    fontFamily: FONTS.semibold,
    color: '#201E20',
  },

  whitePanel: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 26,
    paddingTop: 20,
  },

  helperText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#201E20',
    fontFamily:FONTS.regular,
    marginBottom: 20,
  },

  avatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    overflow: 'hidden',
  },
  editBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE55E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: '36%',
    bottom: -4,
    borderWidth: 2, borderColor: '#FFF',
  },
  avatarLabel: {
    textAlign: 'center',
    fontFamily: FONTS.semibold,
    color: '#111',
    fontSize: 20,
    marginBottom: 20,
  },

  input: {
    height: 50,
    borderRadius: 26,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 18,
    fontFamily: FONTS.regular,
    color: '#201E20',
    fontSize:16,
    marginTop: 18,
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  countryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 26,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 6,
  },
  countryTxt: {
    fontSize: 14,
    color: '#111',
    fontFamily: FONTS.medium,
  },

  whRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 10,
  },
  whLabel: {
    fontSize: 15,
    color: '#111',
    fontFamily: FONTS.medium,
  },

  updateBtn: {
    marginTop: 30,
    height: 56,
    borderRadius: 40,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateTxt: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: FONTS.semibold,
  },

  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  pickerCard: {
    backgroundColor: '#FFF',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    // paddingVertical: 6,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    height:50
  },

  ccButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 0,
  },
  ccText: { fontSize: 16, color: '#201E20', fontFamily: FONTS.regular },
  phoneInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 16,
    paddingVertical: 0,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal:8,
    gap: 12,
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
  checkboxChecked: { backgroundColor: '#201E20', borderColor: '#111' },
  checkboxText: { color: '#111', fontFamily: FONTS.regular,fontSize:16 },
});
