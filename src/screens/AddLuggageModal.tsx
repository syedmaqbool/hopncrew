// src/screens/AddLuggageModal.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { countsFromLuggage, mergeOversized } from '../utils/luggage';
import type {
  RootStackParamList,
  LuggageItem,
  LuggageSize,
} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddLuggage'>;

const MINT = '#B9FBE7';
const SIZES: LuggageSize[] = ['XL', 'L', 'M', 'S', 'Carry-on', 'Backpack'];
const IMAGES: any[] = [
  require('../../assets/icons/2xl.png'),
  require('../../assets/icons/l.png'),
  require('../../assets/icons/m.png'),
  require('../../assets/icons/s.png'),
  require('../../assets/icons/carryon.png'),
  require('../../assets/icons/backpack.png'),
];

// Map specific sizes to their preview images
const imagesBySize: Partial<Record<LuggageSize, any>> = {
  XL: IMAGES[0],
  L: IMAGES[1],
  M: IMAGES[2],
  S: IMAGES[3],
  'Carry-on': IMAGES[4],
  Backpack: IMAGES[5],
};

export default function AddLuggageModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  const [selected, setSelected] = useState<LuggageSize>(
    route.params?.initial?.[0]?.size ?? 'L',
  );
  const [count, setCount] = useState<number>(
    route.params?.initial?.[0]?.count ?? 1,
  );
  const [weightKg, setWeightKg] = useState<number>(
    route.params?.initial?.[0]?.weightKg ?? 42,
  );

  const primary: LuggageItem[] = useMemo(
    () =>
      count > 0
        ? [{ size: selected, count, weightKg, dimsCm: { w: 36, h: 55 } }]
        : [],
    [selected, count, weightKg],
  );

  const [oversized, setOversized] = useState<LuggageItem[]>(
    (route.params?.initial ?? []).filter(i => i.size === 'Oversized'),
  );

  const items: LuggageItem[] = useMemo(
    () => [...primary, ...oversized],
    [primary, oversized],
  );

  const exit = (emit = true) => {
    if (emit) route.params?.onDone?.(items);
    navigation.goBack(); // because AddPassenger used replace(), this returns to Trip
  };

  const Stepper = () => (
    <View style={styles.stepperRow}>
      <Pressable
        style={styles.stepBtn}
        onPress={() => setCount(n => Math.max(0, n - 1))}
      >
        <AntDesign name="minus" size={16} color="#111" />
      </Pressable>
      <Text style={styles.stepVal}>{count}</Text>
      <Pressable style={styles.stepBtn} onPress={() => setCount(n => n + 1)}>
        <AntDesign name="plus" size={16} color="#111" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.fill}>
      {/* DIM BACKDROP */}
      <Pressable style={styles.backdrop} onPress={() => exit(true)} />

      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
          <View style={styles.sheet}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Add Luggage</Text>
              <Pressable style={styles.close} onPress={() => exit(true)}>
                <Ionicons name="close" size={18} color="#111" />
              </Pressable>
            </View>

            {/* Preview / label */}
            <View style={styles.previewWrap}>
              <View style={styles.sizeBadge}>
                <Text style={styles.sizeText}>{selected}</Text>
              </View>
              <View style={styles.previewBox}>
                <View style={styles.corner} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
                {imagesBySize[selected] ? (
                  <Image
                    source={imagesBySize[selected] as any}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="suitcase-rolling"
                    size={84}
                    color="#111"
                  />
                )}
              </View>
              <View style={styles.dimLeft}>
                <Text style={styles.dimText}>55 cm</Text>
              </View>
              <View style={styles.dimRight}>
                <Text style={styles.weightBubble}>{`${weightKg} kg`}</Text>
              </View>
              <Text style={styles.dimBottom}>36 cm</Text>
            </View>

            {/* Stepper */}
            <Stepper />

            {/* Scan row */}
            <View style={styles.scanRow}>
              {/* CAMERA opens OversizedLuggage (child) */}
              <Pressable
                style={styles.camBtn}
                onPress={() =>
                  navigation.navigate('OversizedLuggage', {
                    initial: countsFromLuggage(oversized),
                    onDone: counts =>
                      setOversized(prev => mergeOversized(prev, counts)),
                  })
                }
              >
                <Ionicons name="camera-outline" size={18} color="#111" />
              </Pressable>

              <Text style={styles.scanText}>Scan Bag sizes</Text>

              {/* (i) opens info modal */}
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#9AA0A6"
                onPress={() =>
                  navigation.navigate('LuggageScanInfo', {
                    onStartScan: () => {}, // keep hook available if needed later
                  })
                }
              />
            </View>

            {/* Size chips */}
            <FlatList
              horizontal
              data={SIZES}
              keyExtractor={s => s}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 6 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSelected(item)}
                  style={[
                    styles.sizeChip,
                    selected === item && { borderColor: '#111' },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      item === 'Backpack'
                        ? 'bag-personal-outline'
                        : item === 'Carry-on'
                        ? 'bag-personal-outline'
                        : item === 'XL'
                        ? 'bag-suitcase-outline'
                        : item === 'L'
                        ? 'bag-suitcase'
                        : item === 'S'
                        ? 'bag-checked'
                        : 'suitcase-outline'
                    }
                    size={22}
                    color="#111"
                  />
                  <Text style={styles.chipLabel}>{item}</Text>
                </Pressable>
              )}
            />

            {/* Add oversized (also reachable via camera) */}
            <Pressable
              style={styles.oversized}
              onPress={() =>
                navigation.navigate('OversizedLuggage', {
                  initial: countsFromLuggage(oversized),
                  onDone: counts =>
                    setOversized(prev => mergeOversized(prev, counts)),
                })
              }
            >
              <Image
                source={require('../../assets/icons/addOversized.png')}
                style={{ width: 26, height: 26, marginRight: 4 }}
                resizeMode="contain"
              />
              <Text style={styles.overText}>+ Add Oversized</Text>
              <AntDesign name="arrowright" size={16} color="#111" />
            </Pressable>

            {/* Bottom CTA → keep route.onDone() and close back to Trip */}
            <Pressable
              style={styles.cta}
              onPress={() =>
                navigation.navigate('ScheduleRide', {
                  initial: new Date(),
                  start: route.params?.start, // forward trip endpoints
                  dest: route.params?.dest,
                })
              }
            >
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
  // DIMMED
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: { color: '#111', fontWeight: '700', fontSize: 16 },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewWrap: { alignItems: 'center', marginTop: 6, marginBottom: 6 },
  sizeBadge: {
    position: 'absolute',
    top: -6,
    backgroundColor: MINT,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 1,
  },
  sizeText: { fontWeight: '700', color: '#111' },
  previewBox: {
    width: 160,
    height: 150,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  previewImage: { width: 120, height: 84, margin: 6 },
  corner: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderColor: '#CCC',
    borderLeftWidth: 2,
    borderTopWidth: 2,
    top: 8,
    left: 8,
    borderRadius: 3,
  },
  cornerTR: { left: undefined, right: 8, transform: [{ rotate: '90deg' }] },
  cornerBL: { top: undefined, bottom: 8, transform: [{ rotate: '-90deg' }] },
  cornerBR: {
    top: undefined,
    bottom: 8,
    left: undefined,
    right: 8,
    transform: [{ rotate: '180deg' }],
  },
  dimLeft: { position: 'absolute', left: 16, top: 30 },
  dimRight: { position: 'absolute', right: 16, top: 24 },
  dimText: { color: '#777', fontSize: 12 },
  weightBubble: {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
    fontSize: 12,
  },
  dimBottom: { marginTop: 6, color: '#777', fontSize: 12 },

  stepperRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F6F7F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  stepVal: {
    width: 24,
    textAlign: 'center',
    color: '#111',
    fontWeight: '700',
    fontSize: 16,
  },

  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  camBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: { color: '#111', fontWeight: '600', marginVertical: 30 },

  sizeChip: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  chipLabel: { marginTop: 6, color: '#111', fontWeight: '600' },

  oversized: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 22,
    alignSelf: 'center',
  },
  overText: { color: '#111', fontWeight: '700' },

  cta: {
    marginTop: 14,
    height: 48,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
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
});
