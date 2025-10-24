// src/screens/RideConfirmed.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RideConfirmed'>;

const MINT = '#B9FBE7';

export default function RideConfirmed({ navigation, route }: Props) {
  const onOk = () => {
    if (typeof route.params?.onOk === 'function') route.params.onOk();
    navigation.replace('AssignedVehicle', {
      start: route.params?.start,
      dest: route.params?.dest,
    });
  };

  return (
    <View
      style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]}
    >
      <SafeAreaView style={styles.center}>
        <View style={styles.card}>
          <View style={styles.logoPill}>
            <Image
              source={require('../../assets/icons/noride-icon.png')}
              alt="ride-confirmed"
              style={{ width: 24, height: 24, marginBottom: 10 }}
            />
          </View>

          <Text style={styles.h1}>Ride Confirmed!</Text>
          <Text style={styles.body}>
            We’ve matched you with a professional driver and the right vehicle
            for your trip.
          </Text>
          <Text style={styles.body}>
            You’ll see their details shortly, and you’ll be able to track your
            ride and contact the driver if needed.
          </Text>

          <View style={styles.infoPill}>
            <Text style={styles.infoTxt}>Thanks for choosing hop’n!</Text>
          </View>

          <Pressable style={styles.okBtn} onPress={onOk}>
            <Text style={styles.okTxt}>Ok</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  logoPill: {
    backgroundColor: MINT,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tm: { marginLeft: 2, fontSize: 10, color: '#0B3D3B', marginTop: -6 },
  h1: { marginTop: 12, fontSize: 20, fontWeight: '800', color: '#111' },
  body: {
    marginTop: 10,
    color: '#3C3C43',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoPill: {
    backgroundColor: '#F4F5F6',
    marginTop: 12,
    height: 48,
    borderRadius: 26,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  infoTxt: { color: '#111', fontWeight: '800' },
  okBtn: {
    marginTop: 12,
    height: 48,
    borderRadius: 26,
    paddingHorizontal: 24,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  okTxt: { color: '#fff', fontWeight: '800', textAlign: 'center' },
});
