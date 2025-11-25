import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { FONTS } from '../../src/theme/fonts';

export type CouponModalParams = {
  initialCode?: string;
  onApply?: (code: string) => void;
};

type Props = NativeStackScreenProps<RootStackParamList, 'CoupenPopup'>;

export default function CoupenPopupModal({ navigation, route }: Props) {
  const [code, setCode] = useState(route.params?.initialCode ?? '');

  const close = () => navigation.goBack();
  const apply = () => {
    route.params?.onApply?.(code.trim());
    close();
  };

  return (
    <View style={styles.fill}>
      <Pressable style={styles.backdrop} onPress={close} />
      <SafeAreaView style={styles.centerWrap} edges={['bottom']}>
        <View style={styles.modalBox}>
          <Pressable style={styles.closeBtn} onPress={close}>
            <Ionicons name="close" size={20} color="#1C1B1F" />
          </Pressable>
          <Text style={styles.title}>Apply Coupon</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter coupon code"
            placeholderTextColor="#B0B0B5"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            returnKeyType="done"
          />
          <Pressable style={styles.applyBtn} onPress={apply}>
            <Text style={styles.applyTxt}>Apply</Text>
          </Pressable>
        </View>
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
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    width: '90%',
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F3F5',
  },
  title: {
    color: '#1C1B1F',
    fontSize: 20,
    fontFamily: FONTS.semibold,
    marginBottom: 18,
  },
  input: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: FONTS.semibold,
    fontSize: 16,
    color: '#1C1B1F',
    letterSpacing: 1,
    textAlign: 'center',
  },
  applyBtn: {
    marginTop: 20,
    backgroundColor: '#111',
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  applyTxt: { color: '#fff', fontFamily: FONTS.semibold, fontSize: 16 },
});
