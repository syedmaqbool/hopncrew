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
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { countsFromLuggage, mergeOversized, OVERSIZED_TITLES } from '../utils/luggage';
import type {
  RootStackParamList,
  LuggageItem,
  LuggageSize,
  SelectedLuggagePayload,
} from '../navigation/types';
import { getLuggageTypes, type LuggageType } from '../services/app';
import { FONTS } from '../../src/theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'AddLuggage'>;

const MINT = '#B9FBE7';
const SIZES: LuggageSize[] = ['XL', 'L', 'M', 'S', 'Carry-on', 'Backpack'];
const FALLBACK_SIZE_ORDER: LuggageSize[] = ['Backpack', 'Carry-on', 'S', 'M', 'L', 'XL'];
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

type LuggageDimensions = NonNullable<LuggageType['dimensions']>;

const formatSizeLabel = (label: string) => {
  const words = label
    .split(/\s+/)
    .map(w => w.trim())
    .filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0]?.toUpperCase() ?? '';
  const first = words[0][0] ?? '';
  const last = words[words.length - 1][0] ?? '';
  return `${first}${last}`.toUpperCase();
};

const formatMeasurement = (value?: number | null, unit = 'cm') => {
  if (value == null || !isFinite(Number(value))) return `-- ${unit}`;
  const num = Math.round(Number(value) * 10) / 10;
  const display = Number.isInteger(num) ? `${num}` : num.toFixed(1);
  return `${display} ${unit}`;
};

const toKg = (value?: number | null) => {
  if (value == null) return undefined;
  const raw = Number(value);
  if (!isFinite(raw)) return undefined;
  const converted = raw > 400 ? raw / 1000 : raw;
  return Math.round(converted * 10) / 10;
};

const getLengthValue = (dims?: LuggageDimensions | null) =>
  dims?.length ?? dims?.legnth ?? dims?.width;

const scaleBoxMeasurement = (
  value?: number | null,
  axis: 'width' | 'height' = 'height',
) => {
  if (!value || !isFinite(value)) {
    return axis === 'height' ? 72 : 64;
  }
  const minInput = 32;
  const maxInput = 120;
  const minPx = axis === 'height' ? 64 : 58;
  const maxPx = axis === 'height' ? 96 : 84;
  const clamped = Math.min(Math.max(value, minInput), maxInput);
  const ratio = (clamped - minInput) / (maxInput - minInput);
  return minPx + ratio * (maxPx - minPx);
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

  const labelToType = useMemo(() => {
    const map = new Map<string, LuggageType>();
    luggageTypes?.forEach(type => {
      map.set(type.label, type);
    });
    return map;
  }, [luggageTypes]);

  const sortedLuggageTypes = useMemo(() => {
    if (!luggageTypes || luggageTypes.length === 0) return [];
    const metric = (type: LuggageType) => {
      const dims = type.dimensions ?? null;
      const height = dims?.height ?? getLengthValue(dims) ?? 0;
      const width = dims?.width ?? getLengthValue(dims) ?? 0;
      if (!height && !width) return Number.MAX_SAFE_INTEGER;
      return height * width;
    };
    return [...luggageTypes].sort((a, b) => {
      const diff = metric(a) - metric(b);
      if (diff !== 0) return diff;
      return a.label.localeCompare(b.label);
    });
  }, [luggageTypes]);

  // Build a flat LuggageItem[] from countsByLabel + oversized (for onDone compatibility)
  const primaryFromCounts: LuggageItem[] = useMemo(() => {
    const rows: LuggageItem[] = [];
    Object.entries(countsByLabel).forEach(([label, qty]) => {
      if (!qty) return;
      const dims = labelToType.get(label)?.dimensions ?? null;
      const width = dims?.width ?? getLengthValue(dims) ?? 36;
      const height = dims?.height ?? getLengthValue(dims) ?? 55;
      const derivedWeight = toKg(dims?.weight) ?? weightKg;
      rows.push({
        size: label as LuggageSize,
        count: qty,
        weightKg: derivedWeight,
        dimsCm: { w: width, h: height },
      });
    });
    return rows;
  }, [countsByLabel, labelToType, weightKg]);

  const items: LuggageItem[] = useMemo(
    () => [...primaryFromCounts, ...oversized],
    [primaryFromCounts, oversized],
  );

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
    const type = labelToType.get(label);
    return type?.image_url ?? null;
  };

  const selectedType = labelToType.get(selected);
  const selectedDimensions = selectedType?.dimensions ?? null;
  const fallbackLength = getLengthValue(selectedDimensions);
  const previewHeightCm = selectedDimensions?.height ?? fallbackLength ?? 55;
  const previewLengthCm = fallbackLength ?? 36;
  const previewWeightKg = toKg(selectedDimensions?.weight) ?? weightKg;
  const previewHeightLabel = formatMeasurement(previewHeightCm);
  const previewLengthLabel = formatMeasurement(previewLengthCm);
  const previewWeightLabel = formatMeasurement(previewWeightKg, 'kg');

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
         <Image source={require('../../assets/icons/minus-bg-white.png')} alt='minus' style={{width:38,height:38}} />
      </Pressable>
      <Text style={styles.stepVal}>{currentCount}</Text>
      <Pressable
        style={[styles.stepBtn, styles.stepBtnPlus]}
        onPress={() => setCountForSelected(n => n + 1)}
      >
        <Image source={require('../../assets/icons/plus-bg-black-icon.png')} alt='plus' style={{width:38,height:38}} />
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
              <Ionicons name="close" size={23} color="#8D8E8F" />
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
              <Text style={styles.leftDim}>{previewHeightLabel}</Text>
              <View style={styles.weightBubble}>
                <Text style={styles.weightText}>{previewWeightLabel}</Text>
              </View>
            </View>
            <Text style={styles.dimBottom}>{previewLengthLabel}</Text>
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
                source={require('../../assets/icons/camera-bg-icon.png')}
                style={{ width: 56, height: 56 }}
                resizeMode="contain"
              />
            </Pressable>

            <View style={styles.scanLabelRow}>
              <Text style={styles.scanText}>Scan Bag size</Text>
              {/* <Ionicons
                name="information-circle-outline"
                size={16}
                color="#111"
                onPress={() =>
                  navigation.navigate('LuggageScanInfo', {
                    onStartScan: () => {},
                  })
                }
              /> */}
              <Pressable onPress={() =>
                  navigation.navigate('LuggageScanInfo', {
                    onStartScan: () => {},
                  })
                }>
              <Image source={require('../../assets/icons/info-icon.png')} alt='info' style={{width:19.5,height:19.5}} />
              </Pressable>
            </View>
          </View>

          {/* Size chips with per-type counters */}
          <FlatList
            horizontal
            data={
              sortedLuggageTypes.length > 0 ? sortedLuggageTypes : FALLBACK_SIZE_ORDER
            }
            keyExtractor={value =>
              typeof value === 'string' ? value : `${value.id}-${value.label}`
            }
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
            renderItem={({ item }) => {
              const label = typeof item === 'string' ? item : item.label;
              const dims =
                typeof item === 'string' ? undefined : item.dimensions ?? null;
              const iconUrl =
                typeof item === 'string' ? null : item.icon_url ?? null;
              const isSelected = selected === label;
              const boxHeight = scaleBoxMeasurement(
                dims?.height ?? getLengthValue(dims),
                'height',
              );
              const boxWidth = scaleBoxMeasurement(
                dims?.width ?? getLengthValue(dims),
                'width',
              );
              const imgSize = Math.max(26, Math.min(boxHeight, boxWidth) - 28);

              const localSrc =
                label === 'Backpack'
                  ? require('../../assets/icons/backpack-icon.png')
                  : label === 'Carry-on'
                  ? require('../../assets/icons/carryon-icon.png')
                  : label === 'XL'
                  ? require('../../assets/icons/2xl-icon.png')
                  : label === 'L'
                  ? require('../../assets/icons/l-icon.png')
                  : label === 'M'
                  ? require('../../assets/icons/m-icon.png')
                  : require('../../assets/icons/s-icon.png');

              const qty = countsByLabel[label] ?? 0;

              return (
                <Pressable
                  onPress={() => {
                    setSelected(label);
                    // ensure the label exists in the map
                    setCountsByLabel(prev => ({
                      ...prev,
                      [label]: prev[label] ?? 0,
                    }));
                  }}
                  style={styles.sizePress}
                >
                  <View
                    style={[
                      styles.sizeBox,
                      {
                        width: boxWidth,
                        height: boxHeight,
                        borderRadius: 16,
                      },
                      isSelected && styles.sizeBoxSelected,
                    ]}
                  >
                    {iconUrl ? (
                      <Image
                        source={{ uri: iconUrl }}
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
                  <Text style={styles.sizeLabel}>{formatSizeLabel(label)}</Text>
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
              style={{ width: 44, height: 44, marginRight: 4 }}
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
            {route.params?.when ? (
            <Text style={styles.ctaText}>
              Fare Options
            </Text>
            ): (
              <Text style={styles.ctaText}>
                `+Date&Time <AntDesign style={{marginTop:4}} name="arrowright" size={20} color="#fff" />
              </Text>
            )}
            <View style={styles.ctaIcon}>
              {route.params?.when ? (
                <AntDesign name="arrowright" size={18} color="#111" />
              ) : (
                // <Ionicons name="calendar-outline" size={18} color="#111" />
                <Image source={require('../../assets/icons/date-time-icon.png')} alt='calendar' style={{width:44,height:44}} />
              )}
            </View>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },

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
  title: { color: '#201E20', fontSize: 20, fontFamily: FONTS.semibold },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewWrap: { alignItems: 'center', marginTop: 70, marginBottom: 6 },
  sizeBadge: {
    position: 'absolute',
    top: -50,
    backgroundColor: "#B1FBE3",
    borderRadius: 50,
    // width: 44,
    // height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingRight: 14,
    paddingVertical: 6,
    zIndex: 1,
  },
  sizeText: { color: '#111', fontFamily: FONTS.regular, fontSize: 24 },
  previewBox: {
    width: 200,
    height: 170,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  previewImage: { minWidth: 130, minHeight: 154, margin: 6 },
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
  },
  cornerTR: { left: undefined, right: 8, transform: [{ rotate: '90deg' }] },
  cornerBL: { top: undefined, bottom: 8, transform: [{ rotate: '-90deg' }] },
  cornerBR: { top: undefined, bottom: 8, left: undefined, right: 8, transform: [{ rotate: '180deg' }] },
  leftDim: {
    position: 'absolute',
    left: -16,
    top: '60%',
    transform: [{ translateY: -8 }],
    color: '#111',
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  weightBubble: {
    position: 'absolute',
    right: -30,
    top: '49%',
    transform: [{ translateY: -12 }],
    backgroundColor: '#201E20',
    minWidth: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  weightText: {
    color: '#FCFCFC',
    fontFamily: FONTS.regular,
    fontSize: 15,
  },
  dimBottom: { marginBottom: 6, color: '#777', fontSize: 12, fontFamily: FONTS.regular },

  stepperPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    // marginVertical: 10,
    backgroundColor: '#EFEFEF',
    borderRadius: 30,
    height: 50,
    paddingHorizontal: 6,
    minWidth: 200,
    borderWidth: 1,
    borderColor: '#CFCDCD',
  },
  stepBtn: {
    width: 42,
    height: 42,
    borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  stepBtnMinus: { backgroundColor: '#fff' },
  stepBtnPlus: { backgroundColor: '#111', borderWidth: 0 },
  stepVal: {
    flex: 1,
    textAlign: 'center',
    color: '#201E20',
    fontFamily: FONTS.regular,
    fontSize: 32,
  },
  scanSection: { alignItems: 'center', justifyContent: 'center', marginVertical: 24 },
  camBtn: {
    // width: 36,
    // height: 36,
    // borderRadius: 18,
    // backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  scanText: { color: '#111', fontFamily: FONTS.semibold, fontSize: 16,marginRight:4 },

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
  overText: { color: '#111', fontFamily: FONTS.semibold, fontSize: 17 },

  cta: {
    marginVertical: 14,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#FCFCFC', fontFamily: FONTS.semibold, fontSize: 17 },
  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    // backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
});
