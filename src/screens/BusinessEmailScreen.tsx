// src/screens/BusinessEmailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BusinessEmailScreen'>;

const TEXT = '#201E20';
const BORDER = '#DEDEDF';

export default function BusinessEmailScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');

  const goBack = () => navigation.goBack();
  const onNext = () => {
    // handle email + navigate forward
    navigation.goBack();
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
          <Text style={styles.headerTitle}>Business</Text>
        </View>

        {/* WHITE SHEET */}
        <View style={styles.sheet}>
          <Text style={styles.question}>What’s your business email?</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter business email"
            placeholderTextColor="#B3B4B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Pressable style={styles.cta} onPress={onNext}>
            <Text style={styles.ctaText}>Next</Text>
            <View style={styles.ctaIcon}>
              <Ionicons name="arrow-forward" size={20} color={TEXT} />
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
    // backgroundColor: '#FFFFFF',
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

  question: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
    marginBottom: 22,
  },

  input: {
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: TEXT,
    marginBottom: 32,
  },

  cta: {
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
    fontFamily: FONTS.semibold,
  },
  ctaIcon: {
    position: 'absolute',
    right: 8,
    width: 44,
    height: 44,
    borderRadius: 24,
    backgroundColor: '#F2F2F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
