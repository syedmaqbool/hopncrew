// src/screens/PaymentBusinessScreen.tsx
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentBusinessScreen'>;

const TEXT = '#201E20';
const BORDER = '#E2E2E6';
const BG_SOFT = '#F4F4F6';

export default function PaymentBusinessScreen({ navigation }: Props) {
  const goBack = () => navigation.goBack();

  const onJoinNow = () => {
    // hook up your flow here
    navigation.navigate('BusinessEmailScreen');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* MAP / BACKGROUND */}
      <Image
        source={require('../../assets/backgrounds/signin.png')}
        style={styles.mapBg}
        resizeMode="cover"
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={TEXT} />
          </Pressable>
          <Text style={styles.headerTitle}>Add Business Profile</Text>
        </View>

        {/* WHITE SHEET */}
        <View style={styles.sheet}>
          {/* Top business card */}
          <View style={styles.businessCard}>
            <View style={styles.businessIconWrap}>
              <Image source={require('../../assets/icons/bag-icon.png')} alt='bag-icon' style={{width:22,height:21}} />
            </View>
            <Text style={styles.businessTitle}>Ride for business</Text>
          </View>

          {/* Benefits card */}
          <View style={styles.benefitsCard}>
            <BenefitRow label="Keep work rides separate" />
            <View style={styles.divider} />
            <BenefitRow label="Get travel reports" />
            <View style={styles.divider} />
            <BenefitRow label="Make expensing seamless & easy" />
          </View>

          {/* Join Now CTA */}
          <Pressable style={styles.cta} onPress={onJoinNow}>
            <Text style={styles.ctaText}>Join Now</Text>
            <View style={styles.ctaIcon}>
              <Ionicons name="checkmark" size={20} color={TEXT} />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function BenefitRow({ label }: { label: string }) {
  return (
    <View style={styles.benefitRow}>
      <Ionicons name="checkmark" size={20} color={TEXT} />
      <Text style={styles.benefitText}>{label}</Text>
    </View>
  );
}

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

  businessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BG_SOFT,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 24,
  },
  businessIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  businessTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
  },

  benefitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 32,
    overflow: 'hidden',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  benefitText: {
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
  },

  cta: {
    marginTop: 8,
    height: 56,
    borderRadius: 32,
    backgroundColor: '#201E20',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  ctaIcon: {
    position: 'absolute',
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

