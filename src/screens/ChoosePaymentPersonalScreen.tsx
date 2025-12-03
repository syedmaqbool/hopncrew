// src/screens/ChoosePaymentPersonal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '../../src/theme/fonts';
import assets from '../../assets';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChoosePaymentPersonal'>;

const TEXT = '#201E20';
const BORDER = '#E3E3E5';
const BG_SOFT = '#F4F4F6';

type MethodKey = 'cash' | 'visa' | 'master' | 'gpay' | 'apple';

export default function ChoosePaymentPersonalScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<MethodKey>('cash');

  const goBack = () => navigation.goBack();

  const openAddPayment = () => navigation.navigate('AddPaymentMethod');

  const onDone = () => {
    // TODO: persist selected method
    navigation.goBack();
  };

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
          <Text style={styles.headerTitle}>Choose Payment Method</Text>
        </View>

        {/* White sheet */}
        <View style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            <Text style={styles.question}>
              How would you like to pay when you ride for business?
            </Text>

          {/* Add Payment Method CTA */}
          <View style={{flexDirection:'row', justifyContent:'flex-end',alignItems:'center'}}>
          <Pressable style={styles.addMethodBtn} onPress={openAddPayment}>
            <View style={styles.addMethodIconCircle}>
              <Ionicons name="add" size={28} color={TEXT} />
            </View>
            <Text style={styles.addMethodText}>Add Payment Method</Text>
          </Pressable>
          </View>

          {/* Methods card */}
            <View style={styles.methodsCard}>
            {/* Cash */}
            <MethodRow
              selected={selected === 'cash'}
              onPress={() => setSelected('cash')}
            >
              <View style={styles.iconWrapCash}>
                <Image
                  source={require('../../assets/icons/cash-icon.png')}
                  style={{ width: 40, height: 35, resizeMode: 'contain' }}
                />
              </View>
              <Text style={styles.methodTitle}>Cash</Text>
            </MethodRow>

            {/* VISA */}
            <MethodRow
              selected={selected === 'visa'}
              onPress={() => setSelected('visa')}
            >
              <View style={styles.iconWrapCash}>
                <Image
                  source={require('../../assets/icons/visa-black-icon.png')}
                  style={{ width: 52, height: 15, resizeMode: 'contain' }}
                />
              </View>
              <Text style={styles.methodMasked}>****  ****  ****  5967</Text>
            </MethodRow>

            {/* MasterCard */}
            <MethodRow
              selected={selected === 'master'}
              onPress={() => setSelected('master')}
            >
             <View style={styles.iconWrapCash}>
                <Image
                  source={require('../../assets/icons/master-black-icon.png')}
                  style={{ width: 45, height: 29, resizeMode: 'contain' }}
                />
              </View>
              <Text style={styles.methodMasked}>****  ****  ****  2841</Text>
            </MethodRow>

            {/* Google Pay */}
            <MethodRow
              selected={selected === 'gpay'}
              onPress={() => setSelected('gpay')}
            >
             <View style={styles.iconWrapCash}>
                <Image
                  source={require('../../assets/icons/gpay-icon.png')}
                  style={{ width: 45, height: 29, resizeMode: 'contain' }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodTitle}>Google Pay</Text>
                <Text style={styles.methodSub}>paula.lewis69@gmail.com</Text>
              </View>
            </MethodRow>

            {/* Apple Pay */}
            <MethodRow
              selected={selected === 'apple'}
              onPress={() => setSelected('apple')}
            >
              <View style={styles.iconWrapCash}>
                <Image
                  source={require('../../assets/icons/apay-icon.png')}
                  style={{ width: 45, height: 29, resizeMode: 'contain' }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodTitle}>Apple Pay</Text>
                <Text style={styles.methodSub}>paula.lewis69@gmail.com</Text>
              </View>
            </MethodRow>
          </View>

          {/* Helper text */}
            <Text style={styles.helperText}>
              You can always switch to a different{'\n'}payment method
            </Text>

          {/* Done CTA */}
            <Pressable style={styles.doneBtn} onPress={onDone}>
              <Text style={styles.doneText}>Done</Text>
              <View style={styles.doneIcon}>
                <Ionicons name="checkmark" size={20} color={TEXT} />
              </View>
            </Pressable>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ---------- small components ---------- */

function MethodRow({
  children,
  selected,
  onPress,
}: {
  children: React.ReactNode;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.methodRow} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
        {children}
      </View>
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </Pressable>
  );
}

/* ---------- styles ---------- */

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
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  question: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
    lineHeight: 26,
    marginBottom: 18,
  },

  addMethodBtn: {
    height: 53,
    borderRadius: 40,
    backgroundColor: '#111111',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:4,
    // paddingLeft: 18,
    paddingRight: 22,
    marginBottom: 18,
    width:257
  },
  addMethodIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F4F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  addMethodText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.regular,
  },

  methodsCard: {
    backgroundColor: "#EFEFEF",
    borderRadius: 26,
    paddingHorizontal: 14,
    paddingVertical: 16,
    marginBottom: 22,
  },

  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height:73,
    paddingHorizontal: 16,
    // paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    shadowOpacity:.05,
  },

  iconWrapCash: {
    width: 40,
    height: 40,
    borderRadius: 14,
    // backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  methodTitle: {
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.semibold,
  },
  methodSub: {
    fontSize: 13,
    color: '#A0A1A6',
    marginTop: 2,
    fontFamily: FONTS.regular,
  },

  methodMasked: {
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.semibold,
  },

  visaText: {
    fontSize: 20,
    color: TEXT,
    fontFamily: FONTS.bold,
    marginRight: 12,
  },

  masterIconWrap: {
    width: 40,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  masterCircleLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#111111',
    marginRight: -8,
    opacity: 0.85,
  },
  masterCircleRight: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6B6B6F',
    opacity: 0.9,
  },

  brandCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor:'',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#D1D1D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#111111',
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#111111',
  },

  helperText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#A0A1A6',
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: FONTS.regular,
  },

  doneBtn: {
    height: 56,
    borderRadius: 32,
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  doneIcon: {
    position: 'absolute',
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export {};
