// src/screens/PaymentPersonalScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const TEXT = '#201E20';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentPersonal'>;

export default function PaymentPersonalScreen({ navigation }: Props) {
  const goBack = () => navigation.goBack();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Map / background */}
      <Image
        source={require('../../assets/backgrounds/signin.png')}
        style={styles.mapBg}
        resizeMode="cover"
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={TEXT} />
          </Pressable>
          <Text style={styles.headerTitle}>Personal</Text>
        </View>

        {/* White sheet */}
        <View style={styles.sheet}>
          {/* Top profile card */}
          <View style={styles.profileCard}>
            <View style={styles.profileLeft}>
              <View style={styles.avatarCircle}>
                {/* <Ionicons name="person-outline" size={30} color={TEXT} /> */}
                <Image source={require('../../assets/icons/pay-person-icon.png')} alt='pay-cash' style={{height:29,width:26}} />
              </View>
              <View>
                <Text style={styles.profileTitle}>Personal</Text>
                <Text style={styles.profileSub}>You can edit name</Text>
              </View>
            </View>

            <Pressable style={styles.iconPill} onPress={()=>navigation.navigate('PaymentPersonalEdit')}>
                <Image source={require('../../assets/icons/edit-pen-icon.png')} alt='edit-pen' style={{height:14,width:14}} />
              {/* <Ionicons name="pencil" size={16} color="#FFFFFF" /> */}
            </Pressable>
          </View>

          {/* Preferences heading */}
          <Text style={styles.sectionTitle}>Preferences</Text>

          {/* Preferences card */}
          <View style={styles.prefCard}>
            {/* Email row */}
            <View style={styles.prefRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.prefMain}>paula.lewis69@gmail.com</Text>
                <Text style={styles.prefSub}>You can edit receipt email</Text>
              </View>
              <Pressable style={styles.iconPillSmall}>
                <Image source={require('../../assets/icons/edit-pen-icon.png')} alt='edit-pen' style={{height:14,width:14}} />
              </Pressable>
            </View>

            <View style={styles.prefDivider} />

            {/* Payment row */}
            <View style={styles.prefRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.prefMain}>Cash</Text>
                <Text style={styles.prefSub}>You can edit default payment</Text>
              </View>
              <Pressable style={styles.iconPillSmall} onPress={()=>navigation.navigate('ChoosePaymentPersonal')}>
                <Image source={require('../../assets/icons/edit-pen-icon.png')} alt='edit-pen' style={{height:14,width:14}} />
              </Pressable>
            </View>
          </View>

          {/* Bottom helper text */}
          <Text style={styles.footerText}>
            When you ride using this profile, these preferences
            will be selected by default.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ---------------- styles ---------------- */

const styles = StyleSheet.create({
  mapBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '35%',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 10,
    justifyContent: 'flex-start',
    gap: 12,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 32,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  sheet: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F4F6',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 62,
    height: 62,
    borderRadius: 28,
    backgroundColor: '#FCFCFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
  },
  profileSub: {
    marginTop: 2,
    fontSize: 16,
    color: '#A0A0A8',
    fontFamily: FONTS.regular,
  },

  iconPill: {
    width: 44,
    height: 44,
    borderRadius: 32,
    backgroundColor: '#111013',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    lineHeight:18,
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
  },

  prefCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3E3E6',
    backgroundColor: '#FCFCFC',
    overflow: 'hidden',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  prefMain: {
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.semibold,
  },
  prefSub: {
    fontSize: 16,
    color: '#8D8E8F',
    marginTop: 2,
    fontFamily: FONTS.regular,
  },
  prefDivider: {
    height: 1,
    backgroundColor: '#E3E3E6',
  },
  iconPillSmall: {
    width: 44,
    height: 44,
    borderRadius: 32,
    backgroundColor: '#111013',
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerText: {
    marginTop: 26,
    textAlign: 'center',
    fontSize: 16,
    color: '#8D8E8F',
    lineHeight: 22,
    fontFamily: FONTS.regular,
  },
});
