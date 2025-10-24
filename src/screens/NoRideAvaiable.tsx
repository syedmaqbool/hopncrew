// src/screens/NoRideAvaiable.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'NoRideAvaiable'>;

const MINT = '#B9FBE7';

export default function NoRideAvaiable({ navigation, route }: Props) {
  const onSupport = () => {
    if (typeof route.params?.onContact === 'function') route.params.onContact();
  };
  const onOk = () => {
    if (typeof route.params?.onOk === 'function') route.params.onOk();
    navigation.goBack();
  };
  const onRetry = () => {
    if (typeof route.params?.onRetry === 'function') route.params.onRetry();
    navigation.goBack();
  };

  return (
    <View
      style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]}
    >
      <SafeAreaView style={styles.center}>
        <View style={styles.card}>
          {/* Icon pill */}
          <View style={styles.logoPill}>
            <Image
              source={require('../../assets/icons/noride-icon.png')}
              alt="no-ride"
              style={{ width: 24, height: 24, marginBottom: 10 }}
            />

            {/* <Ionicons name="airplane" size={14} color="#0B3D3B" />
            <Ionicons name="chatbubble-ellipses" size={14} color="#0B3D3B" />
            <Ionicons name="car-sport" size={14} color="#0B3D3B" />
            <Text style={styles.tm}>™</Text> */}
          </View>

          <Text style={styles.titleTop}>We're Sorry</Text>
          <Text style={styles.titleMain}>No Ride Available</Text>

          <Text style={styles.body}>
            We’ve tried to match your ride, but your requirements may not align
            with currently available drivers.
          </Text>
          <Text style={styles.body}>
            We truly apologize for the inconvenience. Sometimes demand is high,
            or drivers are limited in your area.
          </Text>
          <Text style={styles.body}>
            To help us serve you better, please consider booking ahead of your
            pickup time. You can try again shortly or contact our support team
            for assistance.
          </Text>
          <Text style={styles.body}>
            Thank you for your understanding — we hope to serve you soon.
          </Text>

          <Pressable style={styles.supportBtn} onPress={onSupport}>
            <Text style={styles.supportTxt}>Contact Support</Text>
          </Pressable>

          <Pressable style={styles.okBtn} onPress={onOk}>
            <Text style={styles.okTxt}>Ok</Text>
          </Pressable>

          <Pressable style={{ marginTop: 18 }} onPress={onRetry}>
            <Text style={styles.retryTxt}>Retry →</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 18,
    alignItems: 'center',
  },
  logoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: MINT,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tm: { marginLeft: 2, fontSize: 10, color: '#0B3D3B', marginTop: -6 },
  titleTop: { marginTop: 10, fontWeight: '800', color: '#FF3B30' },
  titleMain: {
    marginTop: 2,
    fontWeight: '800',
    color: '#FF3B30',
    fontSize: 18,
  },
  body: {
    marginTop: 10,
    color: '#3C3C43',
    textAlign: 'center',
    lineHeight: 20,
  },
  supportBtn: {
    marginTop: 14,
    backgroundColor: '#F4F5F6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  supportTxt: {
    color: '#111',
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  okBtn: {
    marginTop: 12,
    height: 44,
    borderRadius: 26,
    paddingHorizontal: 54,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  okTxt: { color: '#fff', fontWeight: '800' },
  retryTxt: { color: '#111', fontWeight: '800' },
});
