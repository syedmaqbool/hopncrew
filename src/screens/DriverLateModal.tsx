// src/screens/DriverLateModal.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DriverLate'>;

const MINT = '#B9FBE7';
const SHEET_RATIO = 0.7; // 70% of the current window height

export default function DriverLateModal({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const sheetHeight = Math.round(height * SHEET_RATIO);

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Backdrop tap-to-dismiss */}
      <Pressable
        style={[StyleSheet.absoluteFillObject, styles.backdrop]}
        onPress={() => navigation.goBack()}
      />

      <SafeAreaView edges={['bottom']} style={styles.wrap}>
        <View style={[styles.sheet, { height: sheetHeight }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTxt}>Close</Text>
            <Pressable
              style={styles.closeBtn}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={18} color="#111" />
            </Pressable>
          </View>

          {/* Scrollable content */}
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(16, insets.bottom) },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
  backdrop: { backgroundColor: 'rgba(0,0,0,0.25)' },

  wrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },

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
    paddingBottom: 4,
  },
  headerTxt: { color: '#9AA0A6', fontFamily: FONTS.bold },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  h1: { color: '#111', fontSize: 22, marginTop: 10, fontFamily: FONTS.bold },
  body: {
    color: '#23272F',
    marginTop: 12,
    lineHeight: 20,
    fontFamily: FONTS.regular,
  },

  callout: {
    backgroundColor: MINT,
    borderRadius: 16,
    padding: 12,
    marginTop: 14,
  },
  calloutTitle: { color: '#0B3D3B', fontFamily: FONTS.bold },
  calloutSub: {
    color: '#0B3D3B',
    opacity: 0.8,
    marginTop: 4,
    fontFamily: FONTS.regular,
  },
});
