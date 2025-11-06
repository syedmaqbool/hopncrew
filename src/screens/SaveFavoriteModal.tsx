// src/screens/SaveFavoriteModal.tsx
<<<<<<< HEAD
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets  } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Favourite } from '../navigation/types';
=======
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { RootStackParamList } from '../navigation/types';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

type Props = NativeStackScreenProps<RootStackParamList, 'SaveFavorite'>;

const MINT = '#B9FBE7';
<<<<<<< HEAD

export default function SaveFavoriteModal({ navigation, route }: Props) {
    const insets = useSafeAreaInsets();            // ← for proper offset on notch devices
  const [address, setAddress] = useState(route.params?.address ?? '');
  const [star, setStar] = useState(true);

  const onSave = () => {
   navigation.replace('SaveFavoriteDetails', {
  initialAddress: address.trim(),
  isStarred: star,
  onConfirm: (payload) => {
    // bubble to original caller if they provided onSave
    route.params?.onSave?.(payload);
  },
});
  };

  return (
    <View style={styles.fill}>
      {/* tap outside to dismiss */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

        <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // ← important for Android
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
          <View style={styles.sheet}>
            {/* header */}
            <View style={styles.header}>
              <View style={styles.menuBtn}>
                <Ionicons name="menu" size={18} color="#111" />
              </View>
              <Text style={styles.title}>Save as Favourite</Text>
              <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
=======
const GOOGLE_PLACES_API_KEY = 'AIzaSyBp7k8-SYDkEkhcGbXQ9f_fAXPXmwmlvUQ';

type PlacePrediction = {
  description: string;
  place_id: string;
  structured_formatting?: { main_text?: string; secondary_text?: string };
};

export default function SaveFavoriteModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  const [address, setAddress] = useState(route.params?.address ?? '');
  const [star, setStar] = useState(true);
  const [results, setResults] = useState<PlacePrediction[]>([]);

  // ---------- Sheet animation ----------
  const slide = useRef(new Animated.Value(1)).current;
  const keyboardTranslate = useRef(new Animated.Value(0)).current; // native-driven translateY

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

  const close = () => {
    keyboardTranslate.stopAnimation();
    Animated.timing(slide, {
      toValue: 1,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => finished && navigation.goBack());
  };

  // ---------- Keyboard listeners (no gaps after close) ----------
  useEffect(() => {
    const showEvt =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const s = Keyboard.addListener(showEvt, e => {
      const h = e?.endCoordinates?.height ?? 0;
      Animated.timing(keyboardTranslate, {
        toValue: -h, // move sheet UP by keyboard height
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true, // ✅ native
      }).start();
    });

    const h = Keyboard.addListener(hideEvt, () => {
      Animated.timing(keyboardTranslate, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true, // ✅ native
      }).start();
    });

    return () => {
      s.remove();
      h.remove();
    };
  }, [keyboardTranslate]);

  // ---------- Google Places ----------
  const sessionToken = useRef(Math.random().toString(36).slice(2)).current;
  const debounce = useRef<any>(null);

  const queryPlaces = (q: string) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      return;
    }
    fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        q,
      )}&key=${GOOGLE_PLACES_API_KEY}&sessiontoken=${sessionToken}&types=geocode`,
    )
      .then(r => r.json())
      .then(json => setResults(json?.predictions ?? []))
      .catch(() => setResults([]));
  };

  const onChangeText = (t: string) => {
    setAddress(t);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => queryPlaces(t), 250);
  };

  const pick = (p: PlacePrediction) => {
    setAddress(p.description);
    setResults([]);
  };

  const hasResults = results.length > 0;

  // ---------- Render ----------
  return (
    <View style={styles.fill}>
      <Pressable style={styles.backdrop} onPress={close} />

      <Animated.View
        style={[
          styles.sheetShadow,
          { transform: [{ translateY: slideY }] }, // ✅ native slide from bottom
        ]}
      >
        <Animated.View
          style={{ transform: [{ translateY: keyboardTranslate }] }}
        >
          <SafeAreaView
            edges={['bottom']}
            style={[styles.sheet, { paddingBottom: insets.bottom }]}
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Save as Favourite</Text>
              <Pressable style={styles.closeBtn} onPress={close}>
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
                <Ionicons name="close" size={18} color="#111" />
              </Pressable>
            </View>

<<<<<<< HEAD
            {/* input */}
=======
            {/* Input */}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Hamill Avenue San Diego, CA 929"
                placeholderTextColor="#9AA0A6"
                value={address}
<<<<<<< HEAD
                onChangeText={setAddress}
              />
              <Pressable onPress={() => setStar(s => !s)} style={styles.heartBtn} hitSlop={10}>
                <AntDesign name={star ? 'heart' : 'hearto'} size={18} color={star ? '#111' : '#9AA0A6'} />
              </Pressable>
            </View>

            {/* save */}
            <Pressable
              style={[styles.saveBtn, !address.trim() && { opacity: 0.5 }]}
              onPress={onSave}
=======
                onChangeText={onChangeText}
                autoCapitalize="none"
              />
              <Pressable
                style={styles.heartBtn}
                onPress={() => setStar(s => !s)}
              >
                <AntDesign
                  name={star ? 'heart' : 'hearto'}
                  size={20}
                  color="#111"
                />
              </Pressable>
            </View>

            {/* Results dropdown */}
            {hasResults && (
              <View style={styles.resultsWrap}>
                <FlatList
                  data={results}
                  keyboardShouldPersistTaps="handled"
                  keyExtractor={it => it.place_id}
                  renderItem={({ item }) => {
                    const main =
                      item.structured_formatting?.main_text ?? item.description;
                    const sub = item.structured_formatting?.secondary_text;
                    return (
                      <Pressable
                        style={styles.resultRow}
                        onPress={() => pick(item)}
                      >
                        <Ionicons
                          name="location-outline"
                          size={16}
                          color="#111"
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.resultMain}>{main}</Text>
                          {!!sub && <Text style={styles.resultSub}>{sub}</Text>}
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color="#9AA0A6"
                        />
                      </Pressable>
                    );
                  }}
                />
              </View>
            )}

            <View style={{ flex: 1 }} />

            {/* Save button */}
            <Pressable
              style={[styles.saveBtn, !address.trim() && { opacity: 0.5 }]}
              onPress={() =>
                navigation.replace('SaveFavoriteDetails', {
                  initialAddress: address,
                  isStarred: star,
                })
              }
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
              disabled={!address.trim()}
            >
              <Text style={styles.saveText}>Save</Text>
              <View style={styles.saveArrow}>
<<<<<<< HEAD
                <AntDesign name="arrowright" size={18} color="#111" />
              </View>
            </Pressable>

            <Pressable style={styles.cancel} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
=======
                <AntDesign name="arrowright" size={20} color="#111" />
              </View>
            </Pressable>

            <Pressable style={styles.cancel} onPress={close}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
    </View>
  );
}

<<<<<<< HEAD
const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' }, // keep map visible

  sheetWrap: {
    flex: 1,
    justifyContent: 'flex-end',          // bottom sheet
    backgroundColor: 'transparent',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 22,
    // subtle shadow/elevation
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 14,
  },
  menuBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EFEFEF',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#F2F2F2',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontWeight: '700', color: '#111', fontSize: 16 },

  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 24,
    paddingLeft: 14, paddingRight: 8, height: 44, backgroundColor: '#fff',
  },
  input: { flex: 1, color: '#111', paddingVertical: 0 },
  heartBtn: {
    width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff',
  },

  saveBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  saveText: { color: '#fff', fontWeight: '700' },
  saveArrow: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: MINT,
    alignItems: 'center', justifyContent: 'center',
  },

  cancel: { marginTop: 12, alignItems: 'center' },
  cancelText: { color: '#111', fontWeight: '600' },
=======
// ---------- styles ----------
const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },

  sheetShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerTitle: { color: '#111', fontSize: 22, fontFamily: FONTS.bold },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingLeft: 16,
    paddingRight: 6,
  },
  input: { flex: 1, color: '#111', fontSize: 16 },
  heartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resultsWrap: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEE',
    overflow: 'hidden',
    maxHeight: 250,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  resultMain: { color: '#111', fontFamily: FONTS.bold },
  resultSub: { color: '#6F6F6F', fontSize: 12, fontFamily: FONTS.regular },

  saveBtn: {
    marginTop: 28,
    height: 64,
    borderRadius: 40,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: { color: '#fff', fontSize: 18, fontFamily: FONTS.bold },
  saveArrow: {
    position: 'absolute',
    right: 6,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#111',
  },
  cancel: { alignItems: 'center', paddingVertical: 18 },
  cancelText: { color: '#111', fontSize: 18, fontFamily: FONTS.bold },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});
