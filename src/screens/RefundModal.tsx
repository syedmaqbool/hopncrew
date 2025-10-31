// src/screens/RefundModal.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Refund'>;

const MINT = '#B9FBE7';

export default function RefundModal({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Tap outside to close */}
      <Pressable
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'rgba(0,0,0,0.2)' },
        ]}
        onPress={() => navigation.goBack()}
      />

      <SafeAreaView edges={['bottom']} style={styles.wrap}>
        <View style={[styles.sheet, { paddingTop: 6 }]}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTxt}>Close</Text>
            <Pressable
              style={styles.closeBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={18} color="#111" />
            </Pressable>
          </View>

          {/* content is tall, ensure scrollable */}
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.h1}>Hop’n Guaranteed Pickup Policy</Text>

            <Text style={styles.body}>
              At Hop’n, we are committed to providing reliable, on-time pickups
              with no cancellations from our end. However, certain
              uncontrollable factors may occasionally affect service
              availability.
            </Text>

            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>
                Exceptions to Guaranteed Pickup
              </Text>
              <Text style={styles.calloutSub}>
                Hop’n is not responsible for any losses, damages, or
                inconveniences caused by a missed pickup, including but not
                limited to:
              </Text>
            </View>

            {/* Numbered list */}
            {EXCEPTIONS.map((t, i) => (
              <Text key={i} style={styles.item}>{`${i + 1}. ${t}`}</Text>
            ))}

            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>
                Compensation Policy for Uncontrollable Cancellations
              </Text>
              <Text style={styles.body}>
                In the rare case that Hop’n must cancel your ride due to an
                uncontrollable event, we will:
              </Text>
              {COMPENSATION.map((t, i) => (
                <Text key={`c-${i}`} style={styles.bullet}>{`• ${t}`}</Text>
              ))}
            </View>

            <View style={styles.note}>
              <Text style={styles.noteTxt}>
                By using Hop’n services, passengers acknowledge and accept that
                Hop’n is not liable for any claims, losses, or damages resulting
                from uncontrollable pickup failures.
              </Text>
            </View>

            <View style={[styles.callout, { marginTop: 14 }]}>
              <Text style={styles.calloutTitle}>Our Commitment to You</Text>
            </View>
            <Text style={styles.body}>
              At Hop’n, we value your trust and strive to minimize disruptions.
              We will always communicate transparently and ensure that any
              cancellations due to unforeseen circumstances are handled fairly.
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const EXCEPTIONS = [
  'Severe Weather Conditions – Extreme weather (e.g., snowstorms, hurricanes, flooding, heavy fog) that makes travel unsafe.',
  'Road Closures & Traffic Disruptions – Unexpected roadblocks, accidents, construction, protests, or government-imposed travel restrictions.',
  'Natural Disasters & Emergencies – Earthquakes, wildfires, floods, or other disasters affecting travel routes.',
  'Airport & Security Restrictions – Access limitations imposed by airports, security lockdowns, or unexpected policy changes.',
  'Mechanical Issues & Vehicle Breakdowns – If a vehicle breaks down unexpectedly, we will attempt to provide a replacement ride; delays may occur.',
  'Driver Health & Safety Concerns – Sudden illness, injury, or a medical emergency; alternative arrangements may be provided.',
  'Customer No-Shows & Last-Minute Cancellations – Standard cancellation policies apply.',
  'Public Health Emergencies – Epidemics, pandemics, or official public health orders that restrict transportation services.',
  'Legal or Law Enforcement Orders – Directives that prevent ride completion or require rerouting or cancellation.',
  'Unforeseen Operational Disruptions – System failures, cyberattacks, power outages, or other force majeure events.',
];

const COMPENSATION = [
  'Missed flights, train, or bus connections',
  'Hotel cancellations or additional lodging expenses',
  'Business meeting delays or missed appointments',
  'Any direct or indirect financial or personal losses due to ride unavailability',
];

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
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 6,
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
  calloutSub: { color: '#0B3D3B', opacity: 0.85, marginTop: 6, fontFamily: 'BiennaleRegular' },
  item: { color: '#111', marginTop: 8, lineHeight: 20, fontFamily: 'BiennaleRegular' },
  bullet: { color: '#111', marginTop: 6, lineHeight: 20, fontFamily: 'BiennaleRegular' },
  note: {
    backgroundColor: '#F1F2F4',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  noteTxt: { color: '#111', fontFamily: 'BiennaleBold' },
});
