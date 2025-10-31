// src/screens/TollsModel.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Tolls'>;

const MINT = '#B9FBE7';

export default function TollsModel({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* dim background */}
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
            <Text style={styles.h1}>Hop’n Toll Charges Policy</Text>

            <Text style={styles.body}>
              Hop’n ensures transparent pricing for all rides. If a toll road is
              used during your trip, toll charges will be applied as follows:
            </Text>

            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>When Toll Charges Apply:</Text>
            </View>
            <Text style={styles.bullet}>
              • Passenger‑Requested Toll Route – If a passenger chooses a toll
              road, the toll fee will be added to the final fare.
            </Text>
            <Text style={styles.bullet}>
              • Driver‑Suggested Toll Route – If a driver recommends a toll
              road, the passenger must approve before toll charges apply.
            </Text>

            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>
                How Toll Charges Are Processed:
              </Text>
            </View>
            <Text style={styles.bullet}>
              • Toll fees are added to the final trip cost and charged to the
              passenger’s payment method.
            </Text>
            <Text style={styles.bullet}>
              • The total fare, including tolls, will be processed after the
              ride is completed.
            </Text>

            <View style={styles.note}>
              <Text style={styles.noteTxt}>
                By using Hop’n, you agree to this refund policy.
              </Text>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    maxHeight: '92%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
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
  bullet: { color: '#111', marginTop: 8, lineHeight: 20, fontFamily: 'BiennaleRegular' },
  note: {
    backgroundColor: '#F1F2F4',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  noteTxt: { color: '#111', fontFamily: 'BiennaleBold' },
});
