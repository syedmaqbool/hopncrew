// src/screens/AirportGuideModal.tsx
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AirportGuide'>;

const TEXT = '#111';
const MINT = '#B9FBE7';

export default function AirportGuideModal({ navigation }: Props) {
  const slide = useRef(new Animated.Value(1)).current; // 1 off, 0 on

  useEffect(() => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [slide]);

  const slideY = slide.interpolate({ inputRange: [0, 1], outputRange: [0, 999] });

  const close = () =>
    Animated.timing(slide, {
      toValue: 1,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => finished && navigation.goBack());

  return (
    <View style={styles.fill}>
      <Pressable style={styles.backdrop} onPress={close} />
      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideY }] }]}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Welcome to Terminal 1!</Text>
            <Pressable style={styles.close} onPress={close}>
              <Text style={styles.closeTxt}>Close</Text>
              <Ionicons name="close" size={18} color={TEXT} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }}>
            <Text style={styles.sub}>Here&apos;s a guide on where to proceed:</Text>
            {TERMINAL_STEPS.map((s, i) => (
              <Text key={i} style={styles.step}>{`${i + 1}. ${s}`}</Text>
            ))}
            <Text style={styles.note}>
              No need to go outside the terminal building; stay inside in the heated/air-conditioned room. Your driver will be ready to pick you up in just a few minutes. Safe travels!
            </Text>

            <Text style={[styles.sheetTitle, { marginTop: 18 }]}>Welcome to Terminal 3!</Text>
            <Text style={styles.sub}>Here&apos;s a guide on where to proceed:</Text>
            {TERMINAL_STEPS.map((s, i) => (
              <Text key={`t3-${i}`} style={styles.step}>{`${i + 1}. ${s}`}</Text>
            ))}
            <Text style={styles.note}>
              No need to go outside the terminal building; stay inside in the heated/air-conditioned room. Your driver will be ready to pick you up in just a few minutes. Safe travels!
            </Text>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const TERMINAL_STEPS = [
  'Clear Customs',
  'Retrieve Your Luggage',
  'Head to the Designated Posts',
  'Locate Gate “A” (or A/7) at the Pre-arranged Limo Booth Inside',
  'Provide your name to the official at the booth or call us at 416-458-2132',
];

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sheetTitle: { color: TEXT, fontSize: 20, fontFamily: FONTS.bold },
  sub: { color: '#666', marginTop: 6, marginBottom: 6, fontFamily: FONTS.regular },
  step: { color: TEXT, marginVertical: 4, lineHeight: 20, fontFamily: FONTS.regular },
  note: { color: '#555', marginTop: 6, lineHeight: 20, fontFamily: FONTS.regular },
  close: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 4 },
  closeTxt: { color: TEXT, fontFamily: FONTS.bold },
});
