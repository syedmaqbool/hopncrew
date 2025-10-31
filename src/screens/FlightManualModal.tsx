// src/screens/FlightManualModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FlightManual'>;

const TEXT = '#111';
const MINT = '#B9FBE7';
const BORDER = '#ECEDEE';
const SUB = '#6B7280';

export default function FlightManualModal({ navigation, route }: Props) {
  // sheet slide-in animation (bottom -> up)
  const slide = useRef(new Animated.Value(1)).current; // 1 off, 0 on
  // keyboard lift animation (0 -> keyboardHeight)
  const kbLift = useRef(new Animated.Value(0)).current;

  const [value, setValue] = useState(route.params?.initial ?? '');

  // open sheet
  useEffect(() => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [slide]);

  // keyboard listeners (animate translateY by keyboard height)
  useEffect(() => {
    const showEvt =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      const h = e?.endCoordinates?.height ?? 0;
      const d = e?.duration ?? 250;
      Animated.timing(kbLift, {
        toValue: h,
        duration: d,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    };

    const onHide = (e: any) => {
      const d = e?.duration ?? 200;
      Animated.timing(kbLift, {
        toValue: 0,
        duration: d,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    };

    const subShow = Keyboard.addListener(showEvt, onShow);
    const subHide = Keyboard.addListener(hideEvt, onHide);
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [kbLift]);

  // final Y = slideY - kbLift
  const slideY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 999],
  });
  const translateY = Animated.add(slideY, Animated.multiply(kbLift, -1));

  const close = () =>
    Animated.timing(slide, {
      toValue: 1,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => finished && navigation.goBack());

  const onAdd = () => {
    const clean = value.trim();
    if (!clean) return;
    route.params?.onAdd?.(clean.toUpperCase());
    close();
  };

  return (
    <View style={styles.fill}>
      <Pressable style={styles.backdrop} onPress={close} />
      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Enter Flight Number</Text>
            <Pressable onPress={close} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color={TEXT} />
            </Pressable>
          </View>

          {/* Input pill */}
          <View style={styles.inputPill}>
            <Ionicons name="airplane-outline" size={18} color={SUB} />
            <TextInput
              style={styles.input}
              placeholder="E.g. AC4567"
              placeholderTextColor={SUB}
              autoCapitalize="characters"
              autoCorrect={false}
              value={value}
              onChangeText={setValue}
              returnKeyType="done"
            />
            <Pressable style={styles.addBtn} onPress={onAdd}>
              <Text style={styles.addTxt}>Add</Text>
            </Pressable>
          </View>

          {/* Hint card */}
          <View style={styles.hintCard}>
            <View style={styles.hintIcon}>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color={TEXT}
              />
            </View>
            <Text style={styles.hintTxt}>
              You can usually find this on a confirmation email from the company
              you booked with
            </Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
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
    paddingTop: 14,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: { color: TEXT, fontSize: 18, fontFamily: 'BiennaleBold' },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 28,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    height: 52,
  },
  input: { flex: 1, color: TEXT },
  addBtn: {
    backgroundColor: MINT,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CFF6E6',
  },
  addTxt: { color: TEXT, fontFamily: 'BiennaleBold' },

  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EAFDF5',
    borderColor: '#CFF6E6',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
  },
  hintIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintTxt: { color: TEXT, flex: 1, fontFamily: 'BiennaleRegular' },
});
