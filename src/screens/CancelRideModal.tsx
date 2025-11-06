// src/screens/CancelRideModal.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CancelRide'>;

const MINT = '#B9FBE7';

const REASONS = [
  'Driver is late to pick-up',
  "I don’t need to book anymore",
  'My driver and I couldn’t connect',
  'My pick-up location was incorrect',
  'My driver asked me to cancel',
] as const;

export default function CancelRideModal({ navigation, route }: Props) {
  const [selected, setSelected] = useState<number | null>(0);
  const [other, setOther] = useState('');

  const reasonText = useMemo(() => {
    if (selected != null) return REASONS[selected] as string;
    return other.trim();
  }, [selected, other]);

  const submitCancel = () => {
    const text = reasonText;
    if (typeof route.params?.onSubmit === 'function') {
      route.params.onSubmit(text);
    }
    // Replace this sheet with a small confirmation popup
    navigation.replace('ConfirmCancelPopup');
  };

  const keepBooking = () => {
    if (typeof route.params?.onKeep === 'function') {
      route.params.onKeep();
    }
    navigation.goBack();
  };

  const openPolicy = () => navigation.navigate('Policies');

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* dim overlay */}
      <Pressable
        style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.35)' }]}
        onPress={() => navigation.goBack()}
      />

      {/* bottom sheet */}
      <SafeAreaView edges={['bottom']} style={styles.wrap}>
        <View style={styles.sheet}>
          {/* header */}
          <View style={styles.headerRow}>
            <Text style={styles.h1}>Cancel this Ride?</Text>
            <Pressable style={styles.close} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={18} color="#111" />
            </Pressable>
          </View>

          <Pressable style={styles.policyRow} onPress={openPolicy}>
            <Text style={styles.policyLink}>Cancellation policy</Text>
            <Ionicons name="chevron-forward" size={16} color="#111" />
          </Pressable>

          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 14 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.box}>
              {REASONS.map((label, idx) => (
                <Pressable
                  key={idx}
                  style={styles.reasonRow}
                  onPress={() => setSelected(idx)}
                >
                  <View style={[styles.checkbox, selected === idx && styles.checkboxOn]}>
                    {selected === idx && <View style={styles.checkboxDot} />}
                  </View>
                  <Text style={styles.reasonTxt}>{label}</Text>
                </Pressable>
              ))}
            </View>

            {/* other reason */}
            <View style={[styles.box, { marginTop: 16 }] }>
              <Text style={styles.otherLabel}>Enter any other cancel reason</Text>
              <TextInput
                value={other}
                onChangeText={txt => { setOther(txt); if (txt.length) setSelected(null); }}
                placeholder="Type here"
                placeholderTextColor="#9AA0A6"
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            </View>
          </ScrollView>

          {/* actions */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.cancelBtn, { opacity: reasonText ? 1 : 0.5 }]}
              onPress={submitCancel}
              disabled={!reasonText}
            >
              <Text style={styles.cancelTxt}>Cancel Ride</Text>
            </Pressable>

            <Pressable style={styles.keepBtn} onPress={keepBooking}>
              <Text style={styles.keepTxt}>Keep the Booking</Text>
              <View style={styles.keepIcon}>
                <Ionicons name="arrow-forward" size={16} color="#111" />
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  h1: { color: '#111', fontSize: 20, fontFamily: FONTS.bold },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  policyRow: {
    marginTop: 6,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  policyLink: { color: '#3C71F5', fontFamily: FONTS.bold },

  box: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CFCFCF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxOn: { borderColor: '#111' },
  checkboxDot: { width: 12, height: 12, backgroundColor: '#111' },
  reasonTxt: { color: '#111', flex: 1, fontFamily: FONTS.bold },

  otherLabel: { color: '#111', marginHorizontal: 12, marginTop: 8, fontFamily: FONTS.bold },
  input: {
    minHeight: 72,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 10,
    color: '#111',
    textAlignVertical: 'top',
  },

  actions: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  cancelBtn: {
    height: 48,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
  },
  cancelTxt: { color: '#FF5C2A', fontFamily: FONTS.bold },
  keepBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    flexDirection: 'row',
    gap: 10,
    marginBottom:16
  },
  keepTxt: { color: '#fff', flex: 1, textAlign: 'center', fontFamily: FONTS.bold },
  keepIcon: {
    position: 'absolute',
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
