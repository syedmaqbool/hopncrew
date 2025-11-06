// src/screens/OversizedLuggageModal.tsx
<<<<<<< HEAD
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
=======
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import { FONTS } from '../../src/theme/fonts';
import type {
  OversizedItemCounts,
  OversizedKind,
  RootStackParamList,
} from '../navigation/types';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

type Props = NativeStackScreenProps<RootStackParamList, 'OversizedLuggage'>;

const MINT = '#B9FBE7';
<<<<<<< HEAD

const CATALOG: { id: OversizedKind; title: string; icon: string }[] = [
  { id: 'bicycles',  title: 'Bicycles',           icon: 'bike' },
  { id: 'golf',      title: 'Golf Bags',          icon: 'golf' },
  { id: 'snowboard', title: 'Snowboard Bags',     icon: 'snowboard' },
  { id: 'ski',       title: 'Ski Bags',           icon: 'ski' },
  { id: 'surfboard', title: 'Surfboards',         icon: 'surfing' },
  { id: 'sports',    title: 'Sports equipment',   icon: 'basketball' },
  { id: 'hockey',    title: 'Hockey bags',        icon: 'hockey-sticks' },
  { id: 'music',     title: 'Musical instruments',icon: 'guitar-acoustic' },
=======
const CATALOG: { id: OversizedKind; title: string; icon: any }[] = [
  { id: 'bicycles', title: 'Bicycles', icon: assets.images.cycleIcon },
  { id: 'golf', title: 'Golf Bags', icon: assets.images.golfIcon },
  { id: 'snowboard', title: 'Snowboard Bags', icon: assets.images.snowIcon },
  { id: 'ski', title: 'Ski Bags', icon: assets.images.skiIcon },
  { id: 'surfboard', title: 'Surfboards', icon: assets.images.surfIcon },
  { id: 'sports', title: 'Sports equipment', icon: assets.images.sportsIcon },
  { id: 'hockey', title: 'Hockey bags', icon: assets.images.hockyIcon },
  { id: 'music', title: 'Musical instruments', icon: assets.images.musicIcon },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
];

export default function OversizedLuggageModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
<<<<<<< HEAD
  const [counts, setCounts] = useState<OversizedItemCounts>({ ...(route.params?.initial ?? {}) });
=======
  const [counts, setCounts] = useState<OversizedItemCounts>({
    ...(route.params?.initial ?? {}),
  });
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  const inc = (k: OversizedKind) =>
    setCounts(c => ({ ...c, [k]: (c[k] ?? 0) + 1 }));
  const dec = (k: OversizedKind) =>
    setCounts(c => ({ ...c, [k]: Math.max(0, (c[k] ?? 0) - 1) }));

  const exit = (emit = true) => {
    if (emit) route.params?.onDone?.(counts);
<<<<<<< HEAD
    navigation.goBack();
=======
    navigation.goBack(); // returns to AddLuggage
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  };

  return (
    <View style={styles.fill}>
<<<<<<< HEAD
      {/* tap outside to dismiss */}
=======
      {/* DIM BACKDROP */}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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
<<<<<<< HEAD
                <View style={styles.camMint}><Ionicons name="camera-outline" size={18} color="#111" /></View>
=======
                <View style={styles.camMint}>
                  <Ionicons name="camera-outline" size={18} color="#111" />
                </View>
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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
<<<<<<< HEAD
              keyExtractor={(it) => it.id}
=======
              keyExtractor={it => it.id}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
              numColumns={2}
              columnWrapperStyle={{ gap: 10 }}
              contentContainerStyle={{ paddingVertical: 8 }}
              renderItem={({ item }) => {
                const val = counts[item.id] ?? 0;
                return (
                  <View style={styles.card}>
                    <View style={styles.cardTop}>
<<<<<<< HEAD
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
=======
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Image
                        source={item.icon}
                        style={{ width: 24, height: 24, resizeMode: 'contain' }}
                      />
                    </View>
                    <View style={styles.stepper}>
                      <Pressable
                        style={styles.stepBtn}
                        onPress={() => dec(item.id)}
                      >
                        <AntDesign name="minus" size={14} color="#111" />
                      </Pressable>
                      <Text style={styles.stepVal}>{val}</Text>
                      <Pressable
                        style={[styles.stepBtn, styles.stepBtnDark]}
                        onPress={() => inc(item.id)}
                      >
                        <AntDesign name="plus" size={14} color="#fff" />
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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
<<<<<<< HEAD
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
=======
  // DIMMED
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
<<<<<<< HEAD
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
=======
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  camMint: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: { color: '#111', fontFamily: FONTS.bold },

  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: { color: '#111', maxWidth: 90, fontFamily: FONTS.regular },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'space-between',
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnDark: { backgroundColor: '#111' },
  stepVal: { width: 24, textAlign: 'center', color: '#111', fontFamily: FONTS.bold },

  cta: {
    marginTop: 6,
    height: 48,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#fff', fontFamily: FONTS.bold },
  ctaIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});
