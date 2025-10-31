// src/screens/BookingReceivedTerms.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingReceivedTerms'>;

const MINT = '#B9FBE7';

export default function BookingReceivedTerms({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  const onOkay = () => {
    if (typeof route.params?.onOkay === 'function') {
      route.params?.onOkay?.();
    }
    navigation.goBack();
  };

  const onCancelRide = () => {
    // Replace this sheet with CancelRide sheet
    navigation.replace('CancelRide');
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* dim background, tap to dismiss */}
      <Pressable
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'rgba(0,0,0,0.35)' },
        ]}
        onPress={() => navigation.goBack()}
      />

      {/* bottom sheet */}
      <SafeAreaView edges={['bottom']} style={styles.wrap}>
        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(16, insets.bottom + 8) },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTxt}>Close</Text>
            <Pressable
              style={styles.closeBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={18} color="#111" />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.h1}>Terms & Conditions</Text>
            <Text style={styles.h2}>
              Booking Received — Finding Your Driver
            </Text>
            <Text style={styles.body}>
              We’ve received your booking and are working to match you with the
              right vehicle and a professional driver. You’ll receive a
              confirmation once your ride is locked in.
            </Text>

            {/* Important box */}
            <View style={styles.importantBox}>
              <View style={styles.impHeader}>
                <Ionicons name="warning-outline" size={16} color="#111" />
                <Text style={styles.impTitle}>Important:</Text>
              </View>
              <Text style={styles.impBody}>
                Your booking is not yet confirmed. Until a driver accepts and
                your ride is confirmed, hop’n cannot guarantee pickup or be held
                responsible for any missed flights, delays, or losses related to
                timing. We appreciate your patience — we’re doing our best to
                serve you as quickly as possible.
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable style={styles.okayBtn} onPress={onOkay}>
                <Text style={styles.okayTxt}>Okay</Text>
              </Pressable>
              <Pressable style={styles.cancelBtn} onPress={onCancelRide}>
                <Text style={styles.cancelTxt}>Cancel Ride</Text>
              </Pressable>
            </View>

            {/* Disclaimer card */}
            <View style={styles.disclaimerCard}>
              <Text style={styles.disclaimerTitle}>
                Pending Bookings Disclaimer:
              </Text>
              <View style={{ marginTop: 8, gap: 8 }}>
                <View style={styles.liRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.liText}>
                    A booking submitted through the hop’n platform is considered
                    pending until it is accepted by a driver and marked as
                    confirmed. During this pending period, hop’n does not
                    guarantee pickup or service delivery.
                  </Text>
                </View>
                <View style={styles.liRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.liText}>
                    hop’n shall not be liable for any losses, including but not
                    limited to missed flights, appointments, or business
                    impacts, resulting from unconfirmed or delayed bookings. We
                    recommend all users book in advance to allow sufficient time
                    for matching and confirmation.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerTxt: { color: '#9AA0A6', fontFamily: 'BiennaleBold' },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: { color: '#111', fontSize: 18, fontFamily: 'BiennaleBold' },
  h2: { color: '#111', marginTop: 6, fontFamily: 'BiennaleBold' },
  body: { color: '#3C3C43', marginTop: 8, lineHeight: 20, fontFamily: 'BiennaleRegular' },

  importantBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F1F2F4',
  },
  impHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  impTitle: { color: '#111', fontFamily: 'BiennaleBold' },
  impBody: { color: '#111', marginTop: 6, lineHeight: 18, fontFamily: 'BiennaleRegular' },

  disclaimerCard: {
    marginTop: 14,
    backgroundColor: MINT,
    borderRadius: 14,
    padding: 12,
  },
  disclaimerTitle: { color: '#0B3D3B', fontFamily: 'BiennaleBold' },
  liRow: { flexDirection: 'row', gap: 8 },
  bullet: { color: '#0B3D3B', fontSize: 18, lineHeight: 20 },
  liText: { flex: 1, color: '#0B3D3B', lineHeight: 18, fontFamily: 'BiennaleRegular' },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 26,
    paddingBottom: 12,
  },
  okayBtn: {
    flex: 1,
    height: 46,
    borderRadius: 24,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  okayTxt: { color: '#fff', fontFamily: 'BiennaleBold' },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 24,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelTxt: { color: '#111', fontFamily: 'BiennaleBold' },
});
