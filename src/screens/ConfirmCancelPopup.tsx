// src/screens/ConfirmCancelPopup.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmCancelPopup'>;

export default function ConfirmCancelPopup({ navigation, route }: Props) {
  const onOk = () => {
    if (typeof route.params?.onOk === 'function') route.params.onOk();
    // Reset navigation back to app entry (clears flow and data on screens)
    navigation.reset({ index: 0, routes: [{ name: 'App' }] });
  };

  return (
    <View style={[StyleSheet.absoluteFill, styles.backdrop]}>
      <SafeAreaView style={styles.center}>
        <View style={styles.card}>
          <Text style={styles.logo}>Hop’n</Text>
          <Text style={styles.msg}>Your ride was cancelled</Text>
          <Pressable style={styles.btn} onPress={onOk}>
            <Text style={styles.btnTxt}>Ok</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.35)' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logo: { fontSize: 20, fontWeight: '800', color: '#111' },
  msg: {
    marginTop: 10,
    color: '#111',
    textAlign: 'center',
  },
  btn: {
    marginTop: 16,
    height: 44,
    paddingHorizontal: 30,
    borderRadius: 22,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: { color: '#fff', fontWeight: '800' },
});

