// src/screens/PaymentPersonalEditScreen.tsx
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

const TEXT = '#201E20';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentPersonalEdit'>;

export default function PaymentPersonalEditScreen({ navigation }: Props) {
  const [name, setName] = useState('Personal');

  const goBack = () => navigation.goBack();

  const handleSave = () => {
    // TODO: send updated name to API / state
    navigation.goBack();
  };

  const clearName = () => setName('');

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
          <Text style={styles.headerTitle}>Edit Profile Name</Text>
        </View>

        {/* White sheet */}
        <View style={styles.sheet}>
          {/* Label */}
          <Text style={styles.fieldLabel}>Profile Name</Text>

          {/* Input pill */}
          <View style={styles.inputWrap}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Personal"
              placeholderTextColor="#B4B4B9"
              style={styles.input}
            />
            {name.length > 0 && (
              <Pressable style={styles.clearBtn} onPress={clearName}>
                <Ionicons name="close" size={24} color={TEXT} />
              </Pressable>
            )}
          </View>

          {/* Save CTA */}
          <Pressable
            style={[styles.saveBtn, !name.trim() && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={!name.trim()}
          >
            <Text style={styles.saveText}>Save</Text>
            <View style={styles.saveIcon}>
              <Ionicons name="checkmark" size={20} color={TEXT} />
            </View>
          </Pressable>
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

  fieldLabel: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
    marginBottom: 14,
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#DDDDDF',
    paddingHorizontal: 18,
    height: 56,
    marginBottom: 32,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
  },
  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveBtn: {
    marginTop: 8,
    height: 56,
    borderRadius: 32,
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  saveText: {
    color: '#F2F2F7',
    fontSize: 18,
    fontFamily: FONTS.regular,
  },
  saveIcon: {
    position: 'absolute',
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
