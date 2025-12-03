// src/screens/LoyaltyProgramScreen.tsx
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
import assets from '../../assets';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'LoyaltyProgramScreen'>;

const TEXT = '#201E20';

export default function LoyaltyProgramScreen({ navigation }: Props) {
  const goBack = () => navigation.goBack();
  const openDetails = () => navigation.navigate('LoyaltyDetailsScreen');

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
          <Pressable style={styles.menuBtn} onPress={goBack}>
            <Text style={{ fontSize: 20, color: TEXT }}>•••</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Loyalty Program</Text>
        </View>

        {/* White sheet */}
        <View style={styles.sheet}>
          {/* Loyalty wheel */}
          <View style={styles.wheelWrapper}>
            {/* If you have a single PNG of the wheel, drop it here */}
            {/* <Image source={assets.images.loyaltyWheel} style={styles.wheelImage} /> */}
            <View style={styles.outerRing}>
              <View style={styles.innerRing}>
                <Ionicons
                  name="car-sport"
                  size={52}
                  color="#16A34A"
                  style={{ marginBottom: 6 }}
                />
                <Text style={styles.percentText}>-40%</Text>
              </View>
            </View>
          </View>

          {/* CTA button */}
          <Pressable style={styles.cta} onPress={openDetails}>
            <Text style={styles.ctaText}>How the Loyalty Program works</Text>
            <View style={styles.ctaIcon}>
              <Ionicons name="chevron-forward" size={20} color={TEXT} />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
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
    paddingBottom: 12,
    gap: 12,
  },
  menuBtn: {
    width: 48,
    height: 48,
    borderRadius: 32,
    borderColor: '#D5D5D7',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#FFFFFF',
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

  wheelWrapper: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  outerRing: {
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#F4F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  percentText: {
    fontSize: 36,
    color: '#111111',
    fontFamily: FONTS.bold,
  },

  cta: {
    marginTop: 8,
    borderRadius: 22,
    backgroundColor: '#111111',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft:24,
    paddingHorizontal: 0,
  },
  ctaText: {
    color: '#F2F2F7',
    fontSize: 18,
    fontFamily: FONTS.regular,
  },
  ctaIcon: {
    position: 'absolute',
    right: 6,
    width: 44,
    height: 44,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
