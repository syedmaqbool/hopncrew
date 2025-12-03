// src/screens/PaymentAddGooglePay.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const TEXT = '#201E20';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentAddApplePay'>;

export default function PaymentAddApplePay({ navigation }: Props) {
  const [upiId, setUpiId] = useState('');

  const goBack = () => navigation.goBack();

  const onSave = () => {
    if (!upiId.trim()) return;
    // TODO: call API / update state
    navigation.goBack();
  };

  const canSave = upiId.trim().length > 0;

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
            <Text style={styles.headerTitle}>Enter your Apple Pay ID</Text>
          </View>
  
          {/* WHITE SHEET */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.sheet}>
              {/* Label */}
              <Text style={styles.label}>Enter your Apple Pay UPI ID</Text>
  
              {/* Input */}
              <TextInput
                style={styles.input}
                placeholder="abc@example"
                placeholderTextColor="#B5B5BD"
                value={upiId}
                onChangeText={setUpiId}
                keyboardType="email-address"
                autoCapitalize="none"
              />
  
              {/* Save button */}
              <Pressable
                style={[styles.saveBtn, !canSave && { opacity: 0.5 }]}
                onPress={onSave}
                disabled={!canSave}
              >
                <Text style={styles.saveText}>Save</Text>
                <View style={styles.saveIcon}>
                  <Ionicons name="checkmark" size={22} color={TEXT} />
                </View>
              </Pressable>
  
              {/* Helper text */}
              <Text style={styles.helperText}>
                Don’t have the app? Download Apple Pay{'\n'}
                from the Apple Play Store.
              </Text>
            </View>
          </KeyboardAvoidingView>
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
      paddingTop: 26,
    },
  
    label: {
      fontSize: 18,
      color: TEXT,
      fontFamily: FONTS.semibold,
      marginBottom: 16,
    },
  
    input: {
      height: 52,
      borderRadius: 26,
      borderWidth: 1,
      borderColor: '#DFDFE2',
      backgroundColor: '#FCFCFC',
      paddingHorizontal: 18,
      fontSize: 16,
      color: "#8D8E8F",
      fontFamily: FONTS.regular,
      marginBottom: 26,
    },
  
    saveBtn: {
      height: 56,
      borderRadius: 30,
      backgroundColor: '#111013',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 22,
    },
    saveText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontFamily: FONTS.regular,
    },
    saveIcon: {
      position: 'absolute',
      right: 8,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    helperText: {
      marginTop: 8,
      textAlign: 'center',
      fontSize: 16,
      color: '#8D8E8F',
      lineHeight: 22,
      fontFamily: FONTS.regular,
    },
  });