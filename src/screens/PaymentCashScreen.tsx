// src/screens/PaymentCashScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import assets from '../../assets';

const TEXT = '#201E20';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentCash'>;

export default function PaymentCashScreen({ navigation }: Props) {
  const goBack = () => navigation.goBack();

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
          <Text style={styles.headerTitle}>Cash</Text>
        </View>

        {/* WHITE SHEET */}
        <View style={styles.sheet}>
          {/* Outer grey card */}
          <View style={styles.outerCard}>
            <Text style={styles.cardTitle}>Pay for rides with cash</Text>

            {/* Inner white pill */}
            <View style={styles.innerCard}>
              <Text style={styles.tipText}>
                Your driver’s phone will show you the amount to pay at the end of the ride.
              </Text>
            </View>
          </View>
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
    paddingBottom: 10,
    justifyContent: 'flex-start',
    gap:12,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 32,
    // backgroundColor: '#FFFFFF',
    borderColor:'#CCCCCC',
    borderWidth:1,
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

  outerCard: {
    backgroundColor: '#F4F4F6',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  cardTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
    marginBottom: 14,
  },

  innerCard: {
    backgroundColor: '#FCFCFC',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  tipText: {
    fontSize: 16,
    color: '#201E20',
    lineHeight:24,
    fontFamily: FONTS.regular,
  },
});
