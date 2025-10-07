// src/screens/SaveFavoriteModal.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform,
  Pressable, StyleSheet,
  Text, TextInput,
  View, Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../navigation/types';
import assets from '../../assets';

type Props = NativeStackScreenProps<RootStackParamList, 'SaveFavorite'>;

const MINT = '#B9FBE7';

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
                {/* <Ionicons name="menu" size={18} color="#111" /> */}
                <Image
            source={assets.images.hamIcon}// <-- **Direct require with correct path**
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
              </View>
              <Text style={styles.title}>Favourite</Text>
              <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={18} color="#111" />
              </Pressable>
            </View>

            {/* input */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Hamill Avenue San Diego, CA 929"
                placeholderTextColor="#9AA0A6"
                value={address}
                onChangeText={setAddress}
              />
              <Pressable onPress={() => setStar(s => !s)} style={styles.heartBtn} hitSlop={10}>
                <AntDesign name={star ? 'heart' : 'hearto'} size={18} color={star ? '#111' : '#9AA0A6'} />
              </Pressable>
            </View>

            <View style={{ position: 'absolute', bottom: 20, left: 16, right: 16, flexDirection: 'column',}}>
              {/* save */}
              <Pressable
                style={[styles.saveBtn, !address.trim() && { opacity: 0.5 }]}
                onPress={onSave}
                disabled={!address.trim()}
              >
                <Text style={styles.saveText}>Save</Text>
                <View style={styles.saveArrow}>
                  <AntDesign name="arrowright" size={18} color="#111" />
                </View>
              </Pressable>

              <Pressable style={styles.cancel} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

            </View>

          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, },
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
    height: 460,
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
    alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 10,
  },

  cancel: { marginTop: 12, alignItems: 'center' },
  cancelText: { color: '#111', fontWeight: '600' },
});
