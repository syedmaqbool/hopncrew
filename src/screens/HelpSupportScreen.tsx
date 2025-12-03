// src/screens/HelpSupportScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { FONTS } from '../../src/theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpSupportScreen'>;

const TEXT = '#111111';
const BORDER = '#E2E3E6';

export default function HelpSupportScreen({ navigation }: Props) {
  const goBack = () => navigation.goBack();

  const rows: string[] = [
    'Issue with refunds',
    'Issue with driver behaviour',
    'I lost an item in the car',
    'Issue with receipt and billing',
    'Issues regarding cancellation',
    'Something else?',
    'Edit my registered mobile number?',
    'Unblock my account?',
  ];

  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [rideDate, setRideDate] = useState('');
  const [message, setMessage] = useState('');

  const openSheet = (label: string) => {
    setSelectedIssue(label);
    setRideDate('');
    setMessage('');
    setSheetVisible(true);
  };

  const closeSheet = () => {
    setSheetVisible(false);
  };

  const onSubmit = () => {
    // TODO: send issue to backend
    // console.log({ selectedIssue, rideDate, message });
    setSheetVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable style={styles.backBtn} onPress={goBack}>
          <Ionicons name="arrow-back" size={22} color={TEXT} />
        </Pressable>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Select the category that best explains{'\n'}your issue
        </Text>

        {/* Card with options */}
        <View style={styles.card}>
          {rows.map((label, index) => (
            <Pressable
              key={label}
              style={[
                styles.row,
                index < rows.length - 1 && styles.rowDivider,
              ]}
              onPress={() => openSheet(label)}
            >
              <Text style={styles.rowLabel}>{label}</Text>
              <AntDesign name="right" size={18} color="#282828" />
            </Pressable>
          ))}
        </View>

        {/* Spacer */}
        <View style={{ height: 32 }} />

        {/* Contact Us button */}
        <Pressable style={styles.contactBtn} onPress={() => navigation.navigate('ContactUsScreen')}>
          <Text style={styles.contactText}>Contact Us</Text>
          <View style={styles.contactIconWrap}>
            <Ionicons name="headset-outline" size={18} color={TEXT} />
          </View>
        </Pressable>
      </ScrollView>

      {/* Bottom Sheet */}
      {sheetVisible && (
        <View style={styles.sheetOverlay}>
          <Pressable style={styles.backdrop} onPress={closeSheet} />

          <View style={styles.sheetContainer}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                Help us understand your issue better
              </Text>
              <Pressable onPress={closeSheet} hitSlop={8}>
                <Ionicons name="close" size={28} color={"#8D8E8F"} />
              </Pressable>
            </View>

            {/* Selected issue */}
            <View style={{ marginTop: 8, marginBottom: 4 }}>
              <Text style={styles.issueLabel}>{selectedIssue}</Text>
            </View>

            {/* Ride Date input */}
            <TextInput
              style={styles.input}
              placeholder="Ride Date"
              placeholderTextColor="#B2B4B9"
              value={rideDate}
              onChangeText={setRideDate}
            />

            {/* Description box */}
            <TextInput
              style={styles.textArea}
              placeholder="Please mention your issue in detail, so that our team can get back to you"
              placeholderTextColor="#B2B4B9"
              multiline
              value={message}
              onChangeText={setMessage}
            />

            {/* Submit button */}
            <Pressable style={styles.submitBtn} onPress={onSubmit}>
              <Text style={styles.submitText}>Submit</Text>
              <View style={styles.submitIconWrap}>
                <Ionicons name="checkmark" size={18} color={TEXT} />
              </View>
            </Pressable>

            {/* Cancel text */}
            <Pressable onPress={closeSheet} style={{ marginTop: 12 }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}
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
    paddingTop: 10,
    paddingBottom: 32,
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#A0A3AA',
    lineHeight: 27,
    fontFamily: FONTS.semibold,
    marginBottom: 24,
  },

  card: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  rowLabel: {
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.semibold,
    flex: 1,
  },

  contactBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  contactText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.semibold,
  },
  contactIconWrap: {
    position: 'absolute',
    right: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Bottom sheet styles */
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 28,
    paddingBottom: 44,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 20,
    color: TEXT,
    fontFamily: FONTS.regular,
    flex: 1,
    marginRight: 12,
  },
  issueLabel: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
  },

  input: {
    marginTop: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    height: 44,
    ffontFamily: FONTS.regular,
    fontSize:16,
    color: TEXT,
  },
  textArea: {
    marginTop: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 90,
    textAlignVertical: 'top',
    fontFamily: FONTS.regular,
    fontSize:16,
    color: TEXT,
  },

  submitBtn: {
    marginTop: 18,
    height: 56,
    borderRadius: 26,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#F2F2F7',
    fontSize: 18,
    fontFamily: FONTS.semibold,
  },
  submitIconWrap: {
    position: 'absolute',
    right: 8,
    width: 44,
    height: 44,
    borderRadius: 24,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 4,
    color: TEXT,
    fontFamily: FONTS.regular,
  },
});
