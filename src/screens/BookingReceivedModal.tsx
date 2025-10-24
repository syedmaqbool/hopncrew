// src/screens/BookingReceivedModal.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingReceived'>;

const MINT = '#B9FBE7';

export default function BookingReceivedModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  const openTerms = () => {
    navigation.navigate('BookingReceivedTerms');
  };

  const agree = () => {
    if (typeof route.params?.onContinue === 'function') {
      route.params?.onContinue();
    }
    // Replace this popup with the Ride Confirmed popup and pass context
    navigation.replace('RideConfirmed', {
      start: route.params?.start,
      dest: route.params?.dest,
    });
  };

  return (
    <View
      style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]}
    >
      <SafeAreaView
        edges={['bottom']}
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: 'center', alignItems: 'center', padding: 16 },
        ]}
      >
        <View style={styles.card}>
          {/* top logo pill */}
          <View style={styles.logoPill}>
            <Text style={styles.logoTxt}>hop’n</Text>
            <Text style={styles.logoTm}>™</Text>
          </View>

          <Text style={styles.h1}>Booking received!</Text>

          <Image
            source={require('../../assets/icons/popup-loader-icon.png')}
            alt="loader"
            style={{ marginTop: 10 }}
          />
          {/* <ActivityIndicator
            size="large"
            color="#888"
            style={{ marginTop: 10 }}
          /> */}

          <Text style={styles.body}>
            We’re now finding the perfect vehicle and a professional driver for
            your trip.
          </Text>

          <Text style={[styles.body, { marginTop: 8 }]}>
            Hang tight — your final confirmation and trip details will be on the
            way shortly!
          </Text>

          <Pressable onPress={openTerms} style={{ marginTop: 14 }}>
            <Text style={styles.link}>
              By proceeding, you confirm that you understand and agree to these
              terms.
            </Text>
          </Pressable>

          <Pressable onPress={agree} style={styles.cta}>
            <View style={styles.ctaIcon}>
              <Ionicons name="checkmark" size={16} color="#1E972D" />
            </View>
            <Text style={styles.ctaTxt}>I Agree & Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    alignItems: 'center',
  },
  logoPill: {
    backgroundColor: MINT,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  logoTxt: { fontWeight: '800', color: '#111', fontSize: 16 },
  logoTm: { color: '#111', fontSize: 10, marginTop: -6 },
  h1: { marginTop: 14, fontSize: 20, fontWeight: '800', color: '#111' },
  body: {
    marginTop: 12,
    textAlign: 'center',
    color: '#3C3C43',
    lineHeight: 20,
  },
  link: {
    color: '#111',
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontWeight: '600',
  },
  cta: {
    marginTop: 16,
    backgroundColor: '#111',
    borderRadius: 28,
    height: 48,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  ctaIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTxt: { color: '#fff', fontWeight: '800' },
});
