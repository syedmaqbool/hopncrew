// src/screens/DriverLateModal.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DriverLate'>;

const MINT = '#B9FBE7';

export default function DriverLateModal({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={StyleSheet.absoluteFill}>
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

          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.h1}>Driver Late Arrival & No Show</Text>

            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>Late arrival & waiting</Text>
              <Text style={styles.calloutSub}>
                3 minutes seated time after $3 per minute.
              </Text>
            </View>

            <Text style={styles.body}>
              We kindly ask that you be seated within three minutes of your
              scheduled pickup time in hop’n. A delay beyond this time frame
              will result in a charge of $3 per minute to your credit card. This
              ensures efficient service for all other passengers waiting for
              pick-ups, as we strive to maintain punctuality for everyone.
            </Text>

            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>No Show</Text>
              <Text style={styles.calloutSub}>
                After 6 hours of scheduled pickup cancellation consider no show.
              </Text>
              <Text style={[styles.calloutSub, { marginTop: 6 }]}>
                100% Amount will be transfer into your hop’n digital wallet for
                future use.
              </Text>
            </View>

            <Text style={styles.body}>
              To cancel the trip, it's considered a no-show. Additionally,
              failing to cancel a trip at least 6 hours before the scheduled
              time is also classified as a no-show.
            </Text>

            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>
                1–5 minutes waiting otherwise no show.
              </Text>
              <Text style={styles.calloutSub}>No refund will be issue</Text>
            </View>

            <Text style={styles.body}>
              A no-show happens when a driver arrives at the designated pickup
              point and time (within 1–5 minutes of the scheduled pickup time)
              and waits for at least five minutes, providing multiple
              notifications through the app, SMS, and calling (including driver
              location and direct contact). If the rider cannot be located and
              hasn't called. If the vehicle arrives late and you opt not to take
              the trip, it won't be counted as a no-show if you decide not to
              use the ride and do not call to cancel. The driver will still
              arrive, assuming you still intend to proceed unless informed
              otherwise. Though not categorized as a no-show, you can assist in
              conserving resources by messaging the driver to cancel your trip
              if the vehicle is delayed and you opt out of the ride.
            </Text>

            <Text style={[styles.body, { fontWeight: '800' }]}>
              Also, hop’n is not responsible for any damage that may be caused
              by no pick up, flight claims, or anything else. hop’n is not
              responsible.
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  headerTxt: { color: '#9AA0A6', fontWeight: '700' },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  h1: { color: '#111', fontWeight: '800', fontSize: 22, marginTop: 10 },
  body: { color: '#23272F', marginTop: 12, lineHeight: 20 },

  callout: {
    backgroundColor: MINT,
    borderRadius: 16,
    padding: 12,
    marginTop: 14,
  },
  calloutTitle: { color: '#0B3D3B', fontWeight: '800' },
  calloutSub: { color: '#0B3D3B', opacity: 0.8, marginTop: 4 },
});
