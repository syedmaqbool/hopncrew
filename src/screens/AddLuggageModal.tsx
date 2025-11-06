<<<<<<< HEAD
import React, { useMemo, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, FlatList, Image,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
=======
// src/screens/AddLuggageModal.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Easing,
  Keyboard,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
<<<<<<< HEAD
import { countsFromLuggage, mergeOversized } from '../utils/luggage';
import type { RootStackParamList, LuggageItem, LuggageSize, OversizedItemCounts } from '../navigation/types';
=======
import { countsFromLuggage, mergeOversized, OVERSIZED_TITLES } from '../utils/luggage';
import type {
  RootStackParamList,
  LuggageItem,
  LuggageSize,
  SelectedLuggagePayload,
} from '../navigation/types';
import { getLuggageTypes, type LuggageType } from '../services/app';
import { FONTS } from '../../src/theme/fonts';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

type Props = NativeStackScreenProps<RootStackParamList, 'AddLuggage'>;

const MINT = '#B9FBE7';
<<<<<<< HEAD
const SIZES: LuggageSize[] = ['XL', 'L', 'M', 'S', 'Carry-on'];

export default function AddLuggageModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  // Use first item if present, else default to "L 1"
  const [selected, setSelected] = useState<LuggageSize>(
    route.params?.initial?.[0]?.size ?? 'L'
  );
  const [count, setCount] = useState<number>(route.params?.initial?.[0]?.count ?? 1);
  const [weightKg, setWeightKg] = useState<number>(route.params?.initial?.[0]?.weightKg ?? 42);

  // ① PRIMARY (unchanged)
const primary: LuggageItem[] = useMemo(
  () => (count > 0 ? [{ size: selected, count, weightKg, dimsCm: { w: 36, h: 55 } }] : []),
  [selected, count, weightKg]
);
  

  // create outgoing payload (single selection model; call multiple times to add variants)
//   const items = useMemo<LuggageItem[]>(
//     () => (count > 0 ? [{ size: selected, count, weightKg, dimsCm: { w: 36, h: 55 } }] : []),
//     [selected, count, weightKg]
//   );

  
        // ② Keep oversized items separate (seed from route.initial if present)
        const [oversized, setOversized] = useState<LuggageItem[]>(
        (route.params?.initial ?? []).filter(i => i.size === 'Oversized')
        );

        const items: LuggageItem[] = useMemo(
        () => [...primary, ...oversized],
        [primary, oversized]
        );


        const exit = (emit = true) => {
        if (emit) route.params?.onDone?.(items);
        navigation.goBack();
        };

        const Stepper = () => (
            <View style={styles.stepperRow}>
            <Pressable style={styles.stepBtn} onPress={() => setCount(n => Math.max(0, n - 1))}>
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

            {/* Preview / size badge / dimensions */}
            <View style={styles.previewWrap}>
              <View style={styles.sizeBadge}><Text style={styles.sizeText}>{selected}</Text></View>
              {/* Replace with your suitcase PNG if you have one */}
              <View style={styles.previewBox}>
                <View style={styles.corner} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
                <MaterialCommunityIcons name="suitcase-rolling" size={72} color="#111" />
              </View>
              <View style={styles.dimLeft}><Text style={styles.dimText}>55 cm</Text></View>
              <View style={styles.dimRight}><Text style={styles.weightBubble}>{`${weightKg} kg`}</Text></View>
              <Text style={styles.dimBottom}>36 cm</Text>
            </View>

            {/* Stepper */}
            <Stepper />

            {/* Scan row */}
            <Pressable style={styles.scanRow} onPress={() => {/* hook camera/ML later */}}>
              <View style={styles.camBtn}>
                <Ionicons name="camera-outline" size={18} color="#111" />
              </View>
              <Text style={styles.scanText}>Scan Bag sizes</Text>
              
              <Ionicons name="information-circle-outline" size={18} color="#9AA0A6" onPress={() =>
                    navigation.navigate('LuggageScanInfo', {
                    onStartScan: () => {
                        // kick off your camera/AR flow here
                        console.log('Start scanning…');
                    },
                    })
                } />
                 
            </Pressable>

            {/* Size chips */}
            <FlatList
              horizontal
              data={SIZES}
              keyExtractor={(s) => s}
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
                      item === 'Carry-on' ? 'bag-personal-outline'
                        : item === 'XL' ? 'bag-suitcase-outline'
                        : item === 'L' ? 'bag-suitcase'
                        : item === 'S' ? 'bag-checked'
                        : 'suitcase-outline'
                    }
                    size={22}
                    color="#111"
                  />
                  <Text style={styles.chipLabel}>{item}</Text>
                </Pressable>
              )}
            />

            {/* Add oversized */}
            
            <Pressable style={styles.oversized} onPress={() => navigation.navigate('OversizedLuggage', {
                initial: countsFromLuggage(oversized),
                onDone: (counts) => setOversized(prev => mergeOversized(prev, counts)),
                })
            
            }>
              <Text style={styles.overText}>+ Add Oversized</Text>
              <AntDesign name="arrowright" size={16} color="#111" />
            </Pressable>

            {/* Bottom CTA */}
            <Pressable style={styles.cta} onPress={() => exit(true)}>
              <Text style={styles.ctaText}>+ Date &amp; Time</Text>
              <View style={styles.ctaIcon}>
                <Ionicons name="calendar-outline" size={18} color="#111" />
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
=======
const SIZES: LuggageSize[] = ['XL', 'L', 'M', 'S', 'Carry-on', 'Backpack'];
const IMAGES: any[] = [
  require('../../assets/icons/2xl.png'),
  require('../../assets/icons/l.png'),
  require('../../assets/icons/m.png'),
  require('../../assets/icons/s.png'),
  require('../../assets/icons/carryon.png'),
  require('../../assets/icons/backpack.png'),
];

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
  const passengers = route.params?.passengers ?? 0;

  // ---- native animations ----
  const slide = useRef(new Animated.Value(1)).current;
  const keyboardTranslate = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [slide]);

  const slideY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 999],
  });

  useEffect(() => {
    const showEvt =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const s = Keyboard.addListener(showEvt, e => {
      const h = e?.endCoordinates?.height ?? 0;
      Animated.timing(keyboardTranslate, {
        toValue: -h,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
    const h = Keyboard.addListener(hideEvt, () => {
      Animated.timing(keyboardTranslate, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
    return () => {
      s.remove();
      h.remove();
    };
  }, [keyboardTranslate]);

  // ===== MULTI-SELECTION STATE (NEW) =====
  // Selected label to edit with the stepper
  const [selected, setSelected] = useState<string>(
    (route.params?.initial?.find?.(i => i.size !== 'Oversized')?.size as string) ?? 'L',
  );

  // Track quantity per label (e.g., { 'Carry-on': 3, 'Backpack': 2 })
  const [countsByLabel, setCountsByLabel] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    (route.params?.initial ?? []).forEach(i => {
      if (i.size && i.size !== 'Oversized') {
        initial[i.size] = (initial[i.size] ?? 0) + (i.count ?? 0);
      }
    });
    // If nothing provided, default selected label to 1
    if (Object.keys(initial).length === 0) {
      initial['L'] = 1;
    }
    return initial;
  });

  const currentCount = countsByLabel[selected] ?? 0;

  // We still keep weight (for preview badge). Could be extended per type later if needed.
  const [weightKg, setWeightKg] = useState<number>(
    route.params?.initial?.[0]?.weightKg ?? 42,
  );

  // Oversized remains as before
  const [oversized, setOversized] = useState<LuggageItem[]>(
    (route.params?.initial ?? []).filter(i => i.size === 'Oversized'),
  );

  // Build a flat LuggageItem[] from countsByLabel + oversized (for onDone compatibility)
  const primaryFromCounts: LuggageItem[] = useMemo(() => {
    const rows: LuggageItem[] = [];
    Object.entries(countsByLabel).forEach(([label, qty]) => {
      if (!qty) return;
      rows.push({
        size: label as LuggageSize,
        count: qty,
        weightKg,
        dimsCm: { w: 36, h: 55 },
      });
    });
    return rows;
  }, [countsByLabel, weightKg]);

  const items: LuggageItem[] = useMemo(
    () => [...primaryFromCounts, ...oversized],
    [primaryFromCounts, oversized],
  );

  // Helpers
  const normalizeLabel = (value?: string) =>
    (value ?? '').toString().trim().toLowerCase();

  // Fetch luggage types
  const [luggageTypes, setLuggageTypes] = useState<LuggageType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingTypes(true);
        const types = await getLuggageTypes();
        setLuggageTypes(types);

        // Ensure the selected label exists among API labels if provided
        if (types.length > 0) {
          const labels = types.map(t => t.label);
          if (!labels.includes(selected)) {
            setSelected(labels[0]);
            // make sure we have an entry for first label
            setCountsByLabel(prev => ({ ...prev, [labels[0]]: prev[labels[0]] ?? 0 }));
          }
        }
      } catch {
        // keep fallback sizes
        if (!selected) setSelected('L');
      } finally {
        setLoadingTypes(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map API label -> id
  const labelToId = useMemo(() => {
    const map = new Map<string, number>();
    luggageTypes?.forEach(type => {
      const key = normalizeLabel(type.label);
      if (key) map.set(key, type.id);
    });
    return map;
  }, [luggageTypes]);

  // Build final API payload: [{luggage_type_id, quantity}, ...]
  const selectedLuggage = useMemo<SelectedLuggagePayload[]>(() => {
    const counts = new Map<number, number>();

    // From standard labels
    Object.entries(countsByLabel).forEach(([label, qty]) => {
      if (!qty) return;
      const id = labelToId.get(normalizeLabel(label));
      if (id != null) counts.set(id, (counts.get(id) ?? 0) + qty);
    });

    // From oversized (try to match best-known titles/subtypes)
    oversized.forEach(item => {
      const quantity = item.count ?? 0;
      if (!quantity) return;

      const candidates: string[] = [];
      if (item.title) candidates.push(normalizeLabel(item.title));
      if (item.subtype) {
        candidates.push(normalizeLabel(item.subtype));
        const friendly = OVERSIZED_TITLES[item.subtype];
        if (friendly) candidates.push(normalizeLabel(friendly));
      }
      candidates.push(normalizeLabel('Oversized'));

      let matchedId: number | undefined;
      for (const c of candidates) {
        const found = labelToId.get(c);
        if (found != null) {
          matchedId = found;
          break;
        }
      }
      if (matchedId != null) {
        counts.set(matchedId, (counts.get(matchedId) ?? 0) + quantity);
      }
    });

    return Array.from(counts.entries()).map(([luggage_type_id, quantity]) => ({
      luggage_type_id,
      quantity,
    }));
  }, [countsByLabel, oversized, labelToId]);

  const apiLabelToImageUrl = (label: string): string | null => {
    const t = luggageTypes.find(x => x.label === label);
    return t?.image_url ?? null;
  };

  const exit = (emit = true) => {
    if (emit) route.params?.onDone?.(items);
    Keyboard.dismiss();
    Animated.timing(slide, {
      toValue: 1,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => finished && navigation.goBack());
  };

  // Stepper now edits the quantity for the currently selected label
  const setCountForSelected = (updater: (n: number) => number) => {
    setCountsByLabel(prev => {
      const next = { ...prev };
      const old = next[selected] ?? 0;
      const val = Math.max(0, updater(old));
      next[selected] = val;
      return next;
    });
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const Stepper = () => (
    <View style={styles.stepperPill}>
      <Pressable
        style={[styles.stepBtn, styles.stepBtnMinus]}
        onPress={() => setCountForSelected(n => n - 1)}
      >
        <AntDesign name="minus" size={16} color="#111" />
      </Pressable>
      <Text style={styles.stepVal}>{currentCount}</Text>
      <Pressable
        style={[styles.stepBtn, styles.stepBtnPlus]}
        onPress={() => setCountForSelected(n => n + 1)}
      >
        <AntDesign name="plus" size={16} color="#fff" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.fill}>
      {/* DIM BACKDROP */}
      <Pressable style={styles.backdrop} onPress={() => exit(true)} />

      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [
                { translateY: Animated.add(slideY, keyboardTranslate) },
              ],
            },
          ]}
        >
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
              <Text style={styles.sizeText}>
                {selected} {currentCount > 0 ? `× ${currentCount}` : ''}
              </Text>
            </View>
            <View style={styles.previewBox}>
              <View style={styles.corner} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              {(() => {
                const url = apiLabelToImageUrl(selected);
                if (url) {
                  return (
                    <Image
                      source={{ uri: url }}
                      style={styles.previewImage}
                      resizeMode="contain"
                    />
                  );
                }
                const localSrc = (imagesBySize as any)[selected];
                if (localSrc) {
                  return (
                    <Image
                      source={localSrc}
                      style={styles.previewImage}
                      resizeMode="contain"
                    />
                  );
                }
                return (
                  <MaterialCommunityIcons
                    name="suitcase-rolling"
                    size={84}
                    color="#111"
                  />
                );
              })()}
              <Text style={styles.leftDim}>55 cm</Text>
              <Text style={styles.weightBubble}>{`${weightKg} kg`}</Text>
            </View>
            <Text style={styles.dimBottom}>36 cm</Text>
          </View>

          {/* Stepper */}
          <Stepper />

          {/* Scan row */}
          <View style={styles.scanSection}>
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
              <Image
                source={require('../../assets/icons/cameraIcon.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </Pressable>

            <View style={styles.scanLabelRow}>
              <Text style={styles.scanText}>Scan Bag size</Text>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#111"
                onPress={() =>
                  navigation.navigate('LuggageScanInfo', {
                    onStartScan: () => {},
                  })
                }
              />
            </View>
          </View>

          {/* Size chips with per-type counters */}
          <FlatList
            horizontal
            data={
              luggageTypes.length > 0 ? luggageTypes.map(t => t.label) : SIZES
            }
            keyExtractor={s => s}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
            renderItem={({ item }) => {
              const boxSize =
                item === 'XL' ? 80 : item === 'L' ? 70 : item === 'M' ? 60 : 50;
              const imgSize = Math.max(28, boxSize - 28);
              const isSelected = selected === item;
              const url = apiLabelToImageUrl(item);
              const localSrc =
                item === 'Backpack'
                  ? require('../../assets/icons/backpack-icon.png')
                  : item === 'Carry-on'
                  ? require('../../assets/icons/carryon-icon.png')
                  : item === 'XL'
                  ? require('../../assets/icons/2xl-icon.png')
                  : item === 'L'
                  ? require('../../assets/icons/l-icon.png')
                  : item === 'M'
                  ? require('../../assets/icons/m-icon.png')
                  : require('../../assets/icons/s-icon.png');

              const qty = countsByLabel[item] ?? 0;

              return (
                <Pressable
                  onPress={() => {
                    setSelected(item);
                    // ensure the label exists in the map
                    setCountsByLabel(prev => ({ ...prev, [item]: prev[item] ?? 0 }));
                  }}
                  style={styles.sizePress}
                >
                  <View
                    style={[
                      styles.sizeBox,
                      { width: boxSize, height: boxSize, borderRadius: 16 },
                      isSelected && styles.sizeBoxSelected,
                    ]}
                  >
                    {url ? (
                      <Image
                        source={{ uri: url }}
                        style={{ width: imgSize, height: imgSize }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        source={localSrc}
                        style={{ width: imgSize, height: imgSize }}
                        resizeMode="contain"
                      />
                    )}

                    {/* Small quantity badge per type */}
                    {qty > 0 && (
                      <View style={styles.qtyBadge}>
                        <Text style={styles.qtyBadgeText}>{qty}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.sizeLabel}>{item}</Text>
                </Pressable>
              );
            }}
          />

          {/* Add oversized */}
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

          {/* Bottom CTA */}
          <Pressable
            style={styles.cta}
            onPress={() => {
              const luggagePayload = selectedLuggage.length > 0 ? selectedLuggage : undefined;

              if (route.params?.when) {
                const quotes = [
                  { id: 'esc', tier: 'Escalade', price: 51, oldPrice: 85, seatText: 'Or Similar' },
                  { id: 'prm', tier: 'Premium', price: 32, oldPrice: 55, seatText: 'Sedan X2' },
                  { id: 'eco', tier: 'Economy', price: 43, oldPrice: 67, seatText: 'SUV X2' },
                ];
                navigation.navigate('FareOptions', {
                  etaMinutes: 18,
                  quotes,
                  start: route.params?.start,
                  dest: route.params?.dest,
                  when: route.params?.when,
                  passengers: passengers > 0 ? passengers : undefined,
                  luggage: luggagePayload,
                });
              } else {
                navigation.navigate('ScheduleRide', {
                  initial: new Date(),
                  start: route.params?.start,
                  dest: route.params?.dest,
                  passengers: passengers > 0 ? passengers : undefined,
                  luggage: luggagePayload,
                });
              }
            }}
          >
            <Text style={styles.ctaText}>
              {route.params?.when ? 'Fare Options' : '+ Date & Time'}
            </Text>
            <View style={styles.ctaIcon}>
              {route.params?.when ? (
                <AntDesign name="arrowright" size={18} color="#111" />
              ) : (
                <Ionicons name="calendar-outline" size={18} color="#111" />
              )}
            </View>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
<<<<<<< HEAD
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
=======
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
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

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { color: '#111', fontWeight: '700', fontSize: 16 },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'center' },

  previewWrap: { alignItems: 'center', marginTop: 6, marginBottom: 6 },
  sizeBadge: {
    position: 'absolute', top: -6, backgroundColor: MINT, borderRadius: 14,
    paddingHorizontal: 10, paddingVertical: 4, zIndex: 1,
  },
  sizeText: { fontWeight: '700', color: '#111' },
  previewBox: {
    width: 160, height: 110, borderRadius: 18, borderWidth: 1, borderColor: '#EAEAEA',
    alignItems: 'center', justifyContent: 'center',
  },
  corner: {
    position: 'absolute', width: 18, height: 18, borderColor: '#CCC',
    borderLeftWidth: 2, borderTopWidth: 2, top: 8, left: 8, borderRadius: 3,
=======
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
  title: { color: '#111', fontSize: 16, fontFamily: FONTS.bold },
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
  sizeText: { color: '#111', fontFamily: FONTS.bold },
  previewBox: {
    width: 160,
    height: 150,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  previewImage: { width: 120, height: 84, margin: 6 },
  corner: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderColor: '#111',
    borderLeftWidth: 3,
    borderTopWidth: 3,
    top: 8,
    left: 8,
    borderTopLeftRadius: 10,
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  },
  cornerTR: { left: undefined, right: 8, transform: [{ rotate: '90deg' }] },
  cornerBL: { top: undefined, bottom: 8, transform: [{ rotate: '-90deg' }] },
  cornerBR: { top: undefined, bottom: 8, left: undefined, right: 8, transform: [{ rotate: '180deg' }] },
<<<<<<< HEAD

  dimLeft: { position: 'absolute', left: 16, top: 30 },
  dimRight: { position: 'absolute', right: 16, top: 24 },
  dimText: { color: '#777', fontSize: 12 },
  weightBubble: {
    backgroundColor: '#111', color: '#fff', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4, overflow: 'hidden',
    fontSize: 12,
  },
  dimBottom: { marginTop: 6, color: '#777', fontSize: 12 },

  stepperRow: {
    alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 8,
  },
  stepBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#F6F7F8',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EEE',
  },
  stepVal: { width: 24, textAlign: 'center', color: '#111', fontWeight: '700', fontSize: 16 },

  scanRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginTop: 10,
  },
  camBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: MINT,
    alignItems: 'center', justifyContent: 'center',
  },
  scanText: { color: '#111', fontWeight: '600' },

  sizeChip: {
    borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 12,
    paddingVertical: 10, paddingHorizontal: 12, marginRight: 10, alignItems: 'center',
  },
  chipLabel: { marginTop: 6, color: '#111', fontWeight: '600' },

  oversized: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
    gap: 8, marginTop: 22, paddingHorizontal: 96,
  },
  overText: { color: '#111', fontWeight: '700' },

  cta: {
    marginTop: 14, height: 48, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaIcon: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: MINT,
    alignItems: 'center', justifyContent: 'center',
=======
  leftDim: {
    position: 'absolute',
    left: -28,
    top: '55%',
    transform: [{ translateY: -8 }],
    color: '#111',
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  weightBubble: {
    position: 'absolute',
    right: -30,
    top: '55%',
    transform: [{ translateY: -12 }],
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: 'hidden',
    fontSize: 12,
    minWidth: 48,
    textAlign: 'center',
    fontFamily: FONTS.regular,
  },
  dimBottom: { marginBottom: 6, color: '#777', fontSize: 12, fontFamily: FONTS.regular },

  stepperPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
    backgroundColor: '#EFEFEF',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#EEE',
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
  stepBtnMinus: { backgroundColor: '#fff' },
  stepBtnPlus: { backgroundColor: '#111', borderColor: '#111' },
  stepVal: {
    width: 30,
    textAlign: 'center',
    color: '#111',
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  scanSection: { alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  camBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  scanText: { color: '#111', fontFamily: FONTS.bold },

  sizePress: { alignItems: 'center', marginRight: 14, justifyContent: 'flex-end' },
  sizeBox: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBoxSelected: { backgroundColor: '#EFEFEF', borderColor: '#EFEFEF' },
  sizeLabel: { marginTop: 6, color: '#111', fontFamily: FONTS.bold },

  // little count badge on each chip
  qtyBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBadgeText: { color: '#fff', fontSize: 12, fontFamily: FONTS.bold },

  oversized: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 22,
    alignSelf: 'center',
  },
  overText: { color: '#111', fontFamily: FONTS.bold },

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
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  },
});
