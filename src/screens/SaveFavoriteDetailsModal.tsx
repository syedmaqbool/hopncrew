import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import type { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { FavouritePayload, RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SaveFavoriteDetails'>;

const MINT = '#B9FBE7';
const API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';

export default function SaveFavoriteDetailsModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const ref = useRef<GooglePlacesAutocompleteRef>(null);

  const [address, setAddress] = useState(route.params?.initialAddress ?? '');
  const [coords, setCoords] = useState<
    { latitude: number; longitude: number; placeId?: string } | undefined
  >();
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Other');
  const [customTitle, setCustomTitle] = useState('');

  const isValid =
    !!address.trim() &&
    (label === 'Other' ? customTitle.trim().length > 0 : true);

  // ---- Native animations: sheet slide + keyboard lift ----
  const slide = useRef(new Animated.Value(1)).current; // 1 -> offscreen, 0 -> onscreen
  const keyboardTranslate = useRef(new Animated.Value(0)).current; // negative when keyboard shows

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

  const onClose = () => {
    keyboardTranslate.stopAnimation();
    Animated.timing(slide, {
      toValue: 1,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => finished && navigation.goBack());
  };

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

  const onConfirm = () => {
    if (!isValid) return;
    const payload: FavouritePayload = {
      address: address.trim(),
      coords,
      label,
      customTitle: label === 'Other' ? customTitle.trim() : undefined,
      isStarred: route.params?.isStarred ?? true,
    };
    route.params?.onConfirm?.(payload);
    onClose();
  };

  return (
    <View style={styles.fill}>
      {/* dim/backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* bottom sheet: native slide + keyboard translate */}
      <Animated.View
        style={[
          styles.sheetWrap,
          {
            transform: [
              { translateY: Animated.add(slideY, keyboardTranslate) },
            ],
          },
        ]}
      >
        <SafeAreaView
          edges={['bottom']}
          style={[styles.sheet, { paddingBottom: insets.bottom || 16 }]}
        >
          {/* header */}
          <View style={styles.header}>
            <View style={styles.menuBtn}>
              <Ionicons name="menu" size={18} color="#111" />
            </View>
            <Text style={styles.title}>Save as Favourite</Text>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={18} color="#111" />
            </Pressable>
          </View>

          {/* address (Google Places Autocomplete) */}
          <View style={styles.inputRow}>
            <View style={{ flex: 1 }}>
              {/* Re-enable this block when wiring Places */}
              {/*
              <GooglePlacesAutocomplete
                ref={ref}
                placeholder="Search address"
                fetchDetails
                enablePoweredByContainer={false}
                debounce={250}
                minLength={2}
                query={{ key: API_KEY, language: 'en' }}
                textInputProps={{
                  value: address,
                  onChangeText: (t) => {
                    setAddress(t);
                    setCoords(undefined);
                  },
                  placeholderTextColor: '#9AA0A6',
                }}
                onPress={(data, details) => {
                  const line = data.description || data.structured_formatting?.main_text || '';
                  setAddress(line);
                  if (details?.geometry?.location) {
                    const { lat, lng } = details.geometry.location;
                    setCoords({ latitude: lat, longitude: lng, placeId: data.place_id });
                  }
                }}
                styles={{
                  textInputContainer: { paddingHorizontal: 0 },
                  textInput: { height: 42, paddingHorizontal: 0, color: '#111' },
                  listView: { marginTop: 6, maxHeight: 220 },
                  row: { paddingVertical: 10, paddingHorizontal: 0 },
                  description: { color: '#111' },
                  separator: { height: 1, backgroundColor: '#EFEFEF' },
                }}
              />
              */}
              {/* Fallback simple input while Places is commented */}
              <TextInput
                style={{ height: 42, color: '#111', paddingHorizontal: 0 }}
                placeholder="Search address"
                placeholderTextColor="#9AA0A6"
                value={address}
                onChangeText={t => {
                  setAddress(t);
                  setCoords(undefined);
                }}
              />
            </View>

            <View style={styles.heartBtn}>
              <AntDesign name="heart" size={18} color="#111" />
            </View>
          </View>

          {/* label chips */}
          <View style={styles.chipsRow}>
            <Chip
              active={label === 'Home'}
              icon={
                <Ionicons
                  name="home-outline"
                  size={18}
                  color={label === 'Home' ? '#111' : '#666'}
                />
              }
              text="Home"
              onPress={() => setLabel('Home')}
            />
            <Chip
              active={label === 'Other'}
              icon={
                <MaterialIcons
                  name="location-pin"
                  size={18}
                  color={label === 'Other' ? '#111' : '#666'}
                />
              }
              text="Other"
              onPress={() => setLabel('Other')}
            />
            <Chip
              active={label === 'Work'}
              icon={
                <Ionicons
                  name="briefcase-outline"
                  size={18}
                  color={label === 'Work' ? '#111' : '#666'}
                />
              }
              text="Work"
              onPress={() => setLabel('Work')}
            />
          </View>

          {/* extra title for Other */}
          {label === 'Other' && (
            <TextInput
              style={styles.otherInput}
              placeholder="Add Other Location Title"
              placeholderTextColor="#9AA0A6"
              value={customTitle}
              onChangeText={setCustomTitle}
            />
          )}

          {/* Save / Cancel */}
          <Pressable
            style={[styles.saveBtn, !isValid && { opacity: 0.5 }]}
            disabled={!isValid}
            onPress={onConfirm}
          >
            <Text style={styles.saveText}>Save</Text>
            <View style={styles.saveArrow}>
              <AntDesign name="arrowright" size={18} color="#111" />
            </View>
          </Pressable>

          <Pressable
            style={{ alignItems: 'center', marginTop: 10 }}
            onPress={onClose}
          >
            <Text style={{ color: '#111', fontWeight: '600' }}>Cancel</Text>
          </Pressable>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

/** Small chip component */
function Chip({
  active,
  icon,
  text,
  onPress,
}: {
  active: boolean;
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active ? { borderColor: '#111', backgroundColor: '#fff' } : null,
      ]}
    >
      <View style={{ marginBottom: 6 }}>{icon}</View>
      <Text
        style={[
          styles.chipText,
          active && { color: '#111', fontWeight: '700' },
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },

  // absolutely fill the screen and stick children to bottom
  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

  // the bottom sheet (safe-area applied inside this card)
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
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
    marginBottom: 12,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontWeight: '700', color: '#111', fontSize: 16 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#fff',
  },
  heartBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  chip: {
    width: '31%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingVertical: 10,
    alignItems: 'center',
  },
  chipText: { color: '#666' },

  otherInput: {
    marginTop: 12,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 14,
    color: '#111',
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
    marginBottom: 12, // spacing above bottom safe-area
  },
  saveText: { color: '#fff', fontWeight: '700' },
  saveArrow: {
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
