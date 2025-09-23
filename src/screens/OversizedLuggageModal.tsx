// src/screens/OversizedLuggageModal.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, FlatList,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, OversizedItemCounts, OversizedKind } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OversizedLuggage'>;

const MINT = '#B9FBE7';

const CATALOG: { id: OversizedKind; title: string; icon: string }[] = [
  { id: 'bicycles',  title: 'Bicycles',           icon: 'bike' },
  { id: 'golf',      title: 'Golf Bags',          icon: 'golf' },
  { id: 'snowboard', title: 'Snowboard Bags',     icon: 'snowboard' },
  { id: 'ski',       title: 'Ski Bags',           icon: 'ski' },
  { id: 'surfboard', title: 'Surfboards',         icon: 'surfing' },
  { id: 'sports',    title: 'Sports equipment',   icon: 'basketball' },
  { id: 'hockey',    title: 'Hockey bags',        icon: 'hockey-sticks' },
  { id: 'music',     title: 'Musical instruments',icon: 'guitar-acoustic' },
];

export default function OversizedLuggageModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const [counts, setCounts] = useState<OversizedItemCounts>({ ...(route.params?.initial ?? {}) });

  const inc = (k: OversizedKind) =>
    setCounts(c => ({ ...c, [k]: (c[k] ?? 0) + 1 }));
  const dec = (k: OversizedKind) =>
    setCounts(c => ({ ...c, [k]: Math.max(0, (c[k] ?? 0) - 1) }));

  const exit = (emit = true) => {
    if (emit) route.params?.onDone?.(counts);
    navigation.goBack();
  };

  return (
    <View style={styles.fill}>
      {/* tap outside to dismiss */}
      <Pressable style={styles.backdrop} onPress={() => exit(true)} />

      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
          <View style={styles.sheet}>
            {/* top bar */}
            <View style={styles.topBar}>
              <View style={styles.scanHeader}>
                <View style={styles.camMint}><Ionicons name="camera-outline" size={18} color="#111" /></View>
                <Text style={styles.scanText}>Scan Bag size</Text>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#9AA0A6"
                  onPress={() => navigation.navigate('LuggageScanInfo')}
                />
              </View>
              <Pressable style={styles.close} onPress={() => exit(true)}>
                <Ionicons name="close" size={18} color="#111" />
              </Pressable>
            </View>

            {/* grid */}
            <FlatList
              data={CATALOG}
              keyExtractor={(it) => it.id}
              numColumns={2}
              columnWrapperStyle={{ gap: 10 }}
              contentContainerStyle={{ paddingVertical: 8 }}
              renderItem={({ item }) => {
                const val = counts[item.id] ?? 0;
                return (
                  <View style={styles.card}>
                    <View style={styles.cardTop}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                      <MaterialCommunityIcons name={item.icon as any} size={20} color="#111" />
                    </View>
                    <View style={styles.stepper}>
                      <Pressable style={styles.stepBtn} onPress={() => dec(item.id)}>
                        <AntDesign name="minus" size={14} color="#111" />
                      </Pressable>
                      <Text style={styles.stepVal}>{val}</Text>
                      <Pressable style={styles.stepBtn} onPress={() => inc(item.id)}>
                        <AntDesign name="plus" size={14} color="#111" />
                      </Pressable>
                    </View>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
            />

            {/* bottom CTA */}
            <Pressable style={styles.cta} onPress={() => exit(true)}>
              <Text style={styles.ctaText}>+ Date &amp; Time</Text>
              <View style={styles.ctaIcon}>
                <Ionicons name="calendar-outline" size={18} color="#111" />
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

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

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'center' },

  scanHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  camMint: { width: 32, height: 32, borderRadius: 16, backgroundColor: MINT, alignItems: 'center', justifyContent: 'center' },
  scanText: { color: '#111', fontWeight: '700' },

  card: {
    flex: 1,
    borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 12,
    padding: 12, marginBottom: 10, backgroundColor: '#fff',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  cardTitle: { color: '#111', fontWeight: '700' },

  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'space-between' },
  stepBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#F6F7F8',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EEE',
  },
  stepVal: { width: 24, textAlign: 'center', color: '#111', fontWeight: '700' },

  cta: {
    marginTop: 6, height: 48, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: MINT, alignItems: 'center', justifyContent: 'center' },
});
