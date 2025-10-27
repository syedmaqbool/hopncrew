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
    Keyboard.dismiss();
    Animated.timing(slide, {
      toValue: 1,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => finished && navigation.goBack());
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const Stepper = () => (
    <View style={styles.stepperPill}>
      <Pressable
        style={[styles.stepBtn, styles.stepBtnMinus]}
        onPress={() => setCount(n => Math.max(0, n - 1))}
      >
        <AntDesign name="minus" size={16} color="#111" />
      </Pressable>
      <Text style={styles.stepVal}>{count}</Text>
      <Pressable
        style={[styles.stepBtn, styles.stepBtnPlus]}
        onPress={() => setCount(n => n + 1)}
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
              {/* Side dimensions centered between corner cuts */}
              <Text style={styles.leftDim}>55 cm</Text>
              <Text style={styles.weightBubble}>{`${weightKg} kg`}</Text>
            </View>
            <Text style={styles.dimBottom}>36 cm</Text>
          </View>

          {/* Stepper */}
          <Stepper />

          {/* Scan row */}
          <View style={styles.scanSection}>
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
              <Image
                source={require('../../assets/icons/cameraIcon.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
              {/* <Ionicons name="camera-outline" size={18} color="#111" /> */}
            </Pressable>

            <View style={styles.scanLabelRow}>
              <Text style={styles.scanText}>Scan Bag size</Text>
              {/* (i) opens info modal */}
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

          {/* Size chips */}
          <FlatList
            horizontal
            data={SIZES}
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
              const src =
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
              return (
                <Pressable
                  onPress={() => setSelected(item)}
                  style={styles.sizePress}
                >
                  <View
                    style={[
                      styles.sizeBox,
                      { width: boxSize, height: boxSize, borderRadius: 16 },
                      isSelected && styles.sizeBoxSelected,
                    ]}
                  >
                    <Image
                      source={src}
                      style={{ width: imgSize, height: imgSize }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.sizeLabel}>{item}</Text>
                </Pressable>
              );
            }}
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
            onPress={() => {
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
                });
              } else {
                navigation.navigate('ScheduleRide', {
                  initial: new Date(),
                  start: route.params?.start, // forward trip endpoints
                  dest: route.params?.dest,
                });
              }
            }}
          >
            <Text style={styles.ctaText}>{route.params?.when ? 'Fare Options' : '+ Date & Time'}</Text>
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
    // borderWidth: 1,
    // borderColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  previewImage: { width: 120, height: 84, margin: 6 },
  iconImage2xl: { width: 40, height: 40, margin: 6 },
  iconImagel: { width: 40, height: 30, margin: 6 },
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
    // borderTopRightRadius: 5,
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
  leftDim: {
    position: 'absolute',
    left: -28,
    top: '55%',
    transform: [{ translateY: -8 }],
    color: '#111',
    fontSize: 12,
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
  },
  dimBottom: { marginBottom: 6, color: '#777', fontSize: 12 },

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
    fontWeight: '700',
    fontSize: 18,
  },
  scanSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  camBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  scanText: { color: '#111', fontWeight: '700' },

  sizePress: {
    alignItems: 'center',
    marginRight: 14,
    justifyContent: 'flex-end',
  },
  sizeBox: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBoxSelected: { backgroundColor: '#EFEFEF', borderColor: '#EFEFEF' },
  sizeLabel: { marginTop: 6, color: '#111', fontWeight: '700' },

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
