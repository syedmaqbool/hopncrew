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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const TEXT = '#201E20';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'PaymentAddCreditCard'
>;

export default function PaymentAddCreditCard({ navigation }: Props) {
  const [saveCard, setSaveCard] = useState(true);

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
          <Text style={styles.headerTitle}>Add Credit Card</Text>
        </View>

        {/* WHITE SHEET */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.sheet}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Scan card pill */}
              <View style={styles.scanRow}>
                <Pressable style={styles.scanBtn}>
                  <View style={styles.scanIconWrap}>
                    <Image source={require('../../assets/icons/scan-icon.png')} alt='scan-icon' style={{height:18,width:18}} />
                  </View>
                  <Text style={styles.scanText}>Scan Card</Text>
                </Pressable>
              </View>

              {/* Inputs */}
              <TextInput
                style={styles.input}
                placeholder="Enter card holder’s name"
                placeholderTextColor="#8D8E8F"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter card number"
                placeholderTextColor="#8D8E8F"
                keyboardType="number-pad"
              />

              <View style={styles.rowInputs}>
                <TextInput
                  style={[styles.input, styles.inputHalf]}
                  placeholder="Expire - MM/YYYY"
                  placeholderTextColor="#8D8E8F"
                  keyboardType="number-pad"
                />
                <TextInput
                  style={[styles.input, styles.inputHalf]}
                  placeholder="CVV"
                  placeholderTextColor="#8D8E8F"
                  secureTextEntry
                  keyboardType="number-pad"
                />
              </View>

              {/* Save card information */}
              <Pressable
                style={styles.saveRow}
                onPress={() => setSaveCard(v => !v)}
              >
                <View style={styles.checkbox}>
                  {saveCard ? (
                    <Ionicons name="checkmark" size={18} color={TEXT} />
                  ) : null}
                </View>
                <Text style={styles.saveText}>Save card information</Text>
              </Pressable>

              {/* Add Card button */}
              <Pressable style={styles.addBtn}>
                <Text style={styles.addBtnText}>Add Card</Text>
                <View style={styles.addBtnIcon}>
                  <Ionicons name="add" size={24} color={TEXT} />
                </View>
              </Pressable>
            </ScrollView>
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
    paddingTop: 24,
  },

  scanRow: {
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F6',
    borderRadius: 40,
    height:44,
    width:155,
    padding:5
    // paddingVertical: 10,
    // paddingHorizontal: 18,
  },
  scanIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  scanText: {
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  input: {
    height: 50,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#DFDFE2',
    backgroundColor: '#FCFCFC',
    paddingHorizontal: 18,
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
    marginBottom: 14,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  inputHalf: {
    flex: 1,
    marginBottom: 0,
  },

  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
    marginVertical: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  saveText: {
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  addBtn: {
    height: 56,
    borderRadius: 32,
    backgroundColor: '#111013',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  addBtnText: {
    color: '#F2F2F7',
    fontSize: 18,
    lineHeight:22,
    fontFamily: FONTS.regular,
  },
  addBtnIcon: {
    position: 'absolute',
    right: 7,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
