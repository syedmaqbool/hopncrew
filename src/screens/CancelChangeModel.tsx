// src/screens/CancelChangeModel.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CancelChange'>;

const MINT = '#B9FBE7';

export default function CancelChangeModel({ navigation }: Props) {
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
          {/* Close */}
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
            <Text style={styles.h1}>Cancellation & Change Policy</Text>

            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>
                Cancellation before 1 hour of scheduled pickup
              </Text>
              <Text style={styles.calloutSub}>
                100% Refund into payment method use.
              </Text>
            </View>

            <Text style={styles.body}>
              No worries, refunds will be processed within 24 hours.
            </Text>

            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>Change pickup time</Text>
              <Text style={styles.calloutSub}>With no extra charge</Text>
            </View>

            <Text style={styles.body}>
              You can always modify your pickup. Change the time at least 3
              hours before pickup time.
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
  calloutSub: { color: '#0B3D3B', opacity: 0.8, marginTop: 4, fontFamily: 'BiennaleRegular' },
});
