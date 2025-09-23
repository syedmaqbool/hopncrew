// src/screens/LuggageScanInfoModal.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'LuggageScanInfo'>;

const MINT = '#B9FBE7';

export default function LuggageScanInfoModal({ navigation, route }: Props) {
  const start = () => {
    route.params?.onStartScan?.();
    navigation.goBack();
  };

  return (
    <View style={styles.fill}>
      {/* tap outside to dismiss */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        <View style={styles.sheet}>
          {/* header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Luggage</Text>
            <Pressable style={styles.close} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={18} color="#111" />
            </Pressable>
          </View>

          {/* list */}
          <Step
            title="Choose a bag type"
            body="Select from the large (overhead) or small (under seat) cabin bag options."
          />
          <Sep />
          <Step
            title="Find an open space"
            body="Point your phone camera at the ground to detect the floor."
          />
          <Sep />
          <Step
            title="Locate the sizing cage"
            body="Move your phone around to find the cage."
          />
          <Sep />
          <Step
            title="Check your bag size"
            body="Move your phone again to place the cage over your bag to see if it fits the permitted cabin dimensions."
          />

          {/* bottom CTA */}
          <Pressable style={styles.cta} onPress={start}>
            <Text style={styles.ctaText}>Scan now</Text>
            <View style={styles.ctaIcon}>
              <Ionicons name="camera-outline" size={18} color="#111" />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* tiny pieces */
function Step({ title, body }: { title: string; body: string }) {
  return (
    <View style={stepStyles.wrap}>
      <View style={stepStyles.bullet} />
      <View style={{ flex: 1 }}>
        <Text style={stepStyles.title}>{title}</Text>
        <Text style={stepStyles.body}>{body}</Text>
      </View>
    </View>
  );
}
function Sep() { return <View style={{ height: 12 }} />; }

/* styles */
const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },

  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8,
  },
  title: { color: '#111', fontWeight: '700', fontSize: 16 },
  close: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#F2F2F2',
    alignItems: 'center', justifyContent: 'center',
  },

  cta: {
    marginTop: 16, height: 48, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaIcon: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: MINT,
    alignItems: 'center', justifyContent: 'center',
  },
});

const stepStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 10 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#111', marginTop: 8 },
  title: { color: '#111', fontWeight: '700' },
  body: { color: '#666', marginTop: 4, lineHeight: 18 },
});
