import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Linking, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLocation } from '../hooks/useLocation';
<<<<<<< HEAD
=======
import { FONTS } from '../../src/theme/fonts';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

const MINT = '#B9FBE7';

export default function LocationScreen({ navigation }: Props) {
  const { location, getCurrent, startWatching, stopWatching, watching } = useLocation();

  const openInMaps = () => {
    if (!location) return;
    const { lat, lon } = location;
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${lat},${lon}`,
      android: `geo:${lat},${lon}?q=${lat},${lon}`,
    })!;
    Linking.openURL(url);
  };

    const openMaps = () => {
      console.log('openMaps');
    if (!location) return;
    const { lat, lon } = location;
    navigation.navigate('MapTracking');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: MINT }}>
      <View style={styles.card}>
        <Text style={styles.title}>Location</Text>
        <Text style={styles.value}>
          {location
            ? `lat: ${location.lat.toFixed(6)}\nlon: ${location.lon.toFixed(6)}\n±${Math.round(location.accuracy || 0)} m`
            : 'No location yet'}
        </Text>

        <Pressable style={styles.btn} onPress={() => getCurrent()}>
          <Text style={styles.btnText}>Get current location</Text>
        </Pressable>

        {!watching ? (
          <Pressable style={styles.btn} onPress={() => startWatching()}>
            <Text style={styles.btnText}>Start watching</Text>
          </Pressable>
        ) : (
          <Pressable style={[styles.btn, styles.btnSecondary]} onPress={stopWatching}>
            <Text style={[styles.btnText, { color: '#111' }]}>Stop watching</Text>
          </Pressable>
        )}

        <Pressable style={[styles.btn, { backgroundColor: '#fff', borderColor: '#E6E6E6', borderWidth: 1 }]} onPress={openInMaps} disabled={!location}>
          <Text style={[styles.btnText, { color: '#111' }]}>Open in Maps</Text>
        </Pressable>

          <Pressable style={[styles.btn, { backgroundColor: '#fff', borderColor: '#E6E6E6', borderWidth: 1 }]} onPress={openMaps}>
          <Text style={[styles.btnText, { color: '#111' }]}>Open Map Screen</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 16,
  },
<<<<<<< HEAD
  title: { fontSize: 20, fontWeight: '700', color: '#111' },
=======
  title: { fontSize: 20, color: '#111', fontFamily: FONTS.bold },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  value: { marginTop: 10, color: '#444', lineHeight: 20 },
  btn: {
    marginTop: 12, height: 44, borderRadius: 22, backgroundColor: '#111',
    alignItems: 'center', justifyContent: 'center',
  },
  btnSecondary: { backgroundColor: '#F3F3F3' },
<<<<<<< HEAD
  btnText: { color: '#fff', fontWeight: '600' },
=======
  btnText: { color: '#fff', fontFamily: FONTS.semibold },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});
