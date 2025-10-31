// src/screens/GuaranteedPickupModel.tsx (updated per refund-policy mock)
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'GuaranteedPickup'>;

const MINT = '#B9FBE7';

export default function GuaranteedPickupModel({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* dim to dismiss */}
      <Pressable
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'rgba(0,0,0,0.2)' },
        ]}
        onPress={() => navigation.goBack()}
      />

      <SafeAreaView edges={['bottom']} style={styles.wrap}>
        <View style={[styles.sheet, { paddingTop: 6 }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTxt}>Close</Text>
            <Pressable
              style={styles.closeBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={18} color="#111" />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator
          >
            <Text style={styles.h1}>Hop'n Refund Policy</Text>

            <Text style={styles.body}>
              Hop'n aims to provide a seamless experience for all passengers.
              Our refund policy outlines how and when refunds are processed.
            </Text>

            {/* When Refunds Apply */}
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>When Refunds Apply</Text>
            </View>

            <View style={styles.greyCard}>
              <Text style={styles.greyTitle}>Ride Cancellations by Hop'n:</Text>
              <Text style={styles.bullet}>
                • Full refund if your ride is canceled by Hop'n due to
                unforeseen circumstances
              </Text>
            </View>

            <View style={styles.greyCard}>
              <Text style={styles.greyTitle}>Cancellations Before Pickup:</Text>
              <Text style={styles.bullet}>
                • Full refund if canceled within the grace period specified in
                the booking terms.
              </Text>
              <Text style={styles.bullet}>
                • Partial or no refund for late cancellations or passenger
                no-shows, depending on the policy.
              </Text>
            </View>

            {/* Refund Process */}
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>Refund Process</Text>
            </View>
            <View style={styles.greyCard}>
              <Text style={styles.bullet}>
                • Refunds will be processed back to your original payment
                method.
              </Text>
              <Text style={styles.bullet}>
                • The time for refunds to appear in your account may vary based
                on your bank (typically 3–7 business days).
              </Text>
            </View>

            <Text style={[styles.body, { marginTop: 14 }]}>
              By using Hop'n, you agree to this refund policy.
            </Text>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    maxHeight: '95%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingHorizontal: 16,
  },
  headerTxt: { color: '#9AA0A6', fontFamily: 'BiennaleBold' },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: { color: '#111', fontSize: 22, marginTop: 10, fontFamily: 'BiennaleBold' },
  body: { color: '#23272F', marginTop: 12, lineHeight: 20, fontFamily: 'BiennaleRegular' },
  callout: {
    backgroundColor: MINT,
    borderRadius: 16,
    padding: 12,
    marginTop: 14,
  },
  calloutTitle: { color: '#0B3D3B', fontFamily: 'BiennaleBold' },
  bullet: { color: '#111', marginTop: 6, lineHeight: 20, fontFamily: 'BiennaleRegular' },
  greyCard: {
    backgroundColor: '#F1F2F4',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  greyTitle: { color: '#111', marginBottom: 6, fontFamily: 'BiennaleBold' },
});
