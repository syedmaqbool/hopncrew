// src/screens/ContactUsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { FONTS } from '../../src/theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'ContactUsScreen'>;

const TEXT = '#111111';
const BORDER = '#E2E3E6';
const MAX_LEN = 500;

export default function ContactUsScreen({ navigation }: Props) {
  const [message, setMessage] = useState('');

  const goBack = () => navigation.goBack();

  const onSubmit = () => {
    // TODO: handle submit
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable style={styles.backBtn} onPress={goBack}>
          <Ionicons name="arrow-back" size={22} color={TEXT} />
        </Pressable>
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + subtitle */}
        <View style={styles.centerBlock}>
          <Text style={styles.needHelpTitle}>Need Help?</Text>
          <Text style={styles.needHelpSub}>
            Our customer care team will be in touch{'\n'}with you within 12 hours.
          </Text>
        </View>

        {/* Message box with counter */}
        <View style={styles.textBoxWrap}>
          <TextInput
            style={styles.textBox}
            placeholder="Type your issue here"
            placeholderTextColor="#B3B5BA"
            multiline
            value={message}
            onChangeText={setMessage}
            maxLength={MAX_LEN}
          />
          <Text style={styles.counterLabel}>{MAX_LEN}</Text>
        </View>

        {/* Submit button */}
        <Pressable style={styles.submitBtn} onPress={onSubmit}>
          <Text style={styles.submitText}>Submit</Text>
          <View style={styles.submitIconWrap}>
            <Ionicons name="checkmark" size={20} color={TEXT} />
          </View>
        </Pressable>

        {/* Instant Contact */}
        <View style={styles.instantBlock}>
          <Text style={styles.instantTitle}>Instant Contact</Text>

          <View style={styles.contactRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="call-outline" size={20} color={TEXT} />
            </View>
            <Text style={styles.contactLabel}>0123456789</Text>
          </View>

          <View style={styles.contactRow}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={TEXT}
              />
            </View>
            <Text style={styles.contactLabel}>info.hopn@hopn.com</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 18,
    gap: 12,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  centerBlock: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 26,
  },
  needHelpTitle: {
    fontSize: 20,
    color: TEXT,
    fontFamily: FONTS.semibold,
    marginBottom: 4,
  },
  needHelpSub: {
    fontSize: 15,
    color: '#A0A3AA',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: FONTS.regular,
  },

  textBoxWrap: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    minHeight: 150,
    marginBottom: 24,
  },
  textBox: {
    flex: 1,
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
    textAlignVertical: 'top',
  },
  counterLabel: {
    fontSize: 14,
    color: '#80838A',
    fontFamily: FONTS.regular,
    alignSelf: 'flex-end',
  },

  submitBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.semibold,
  },
  submitIconWrap: {
    position: 'absolute',
    right: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  instantBlock: {
    alignItems: 'center',
  },
  instantTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
    marginBottom: 18,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F3F3F5',
    borderRadius: 26,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactLabel: {
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
  },
});
