import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLocation } from '../hooks/useLocation';



const MINT = '#B9FBE7';

export default function MapTrackingScreen() {
    
  const { granted,location, getCurrent, startWatching, stopWatching, watching } = useLocation();
  const mapRef = useRef<MapView | null>(null);
  const [path, setPath] = useState<{ latitude: number; longitude: number }[]>([]);

  // Follow user as updates arrive
  // useEffect(() => {
  //   if (!location) return;
  //   const { lat, lon } = location;
  //   mapRef.current?.animateCamera({ center: { latitude: lat, longitude: lon }, zoom: 17 }, { duration: 600 });
  //   setPath((prev) => [...prev, { latitude: lat, longitude: lon }]);
  // }, [location]);


  const region: Region | undefined = useMemo(() => {
    if (!location) return;
    const { lat, lon } = location;
    return { latitude: lat, longitude: lon, latitudeDelta: 0.01, longitudeDelta: 0.01 };
  }, [location]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: MINT }}>
      <View style={{ flex: 1, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', backgroundColor: '#fff' }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          provider={Platform.OS === 'ios' ? PROVIDER_GOOGLE : undefined} // Google on iOS only if you installed the SDK
          showsUserLocation={granted}
          showsMyLocationButton={false}
          initialRegion={region}
        >
          {/* Draw traveled path */}
          {path.length > 1 && (
            <Polyline coordinates={path} strokeWidth={4} strokeColor="#0A84FF" />
          )}
          {/* Optional explicit marker at current point */}
          {/* {location && <Marker coordinate={{ latitude: location.lat, longitude: location.lon }} />} */}
        </MapView>

        <View style={styles.controls}>
          <Pressable style={[styles.btn, styles.primary]} onPress={() => getCurrent()}>
            <Text style={styles.btnText}>Locate me</Text>
          </Pressable>

          {!watching ? (
            <Pressable style={[styles.btn, styles.primary]} onPress={() => startWatching()}>
              <Text style={styles.btnText}>Start tracking</Text>
            </Pressable>
          ) : (
            <Pressable style={[styles.btn, styles.secondary]} onPress={stopWatching}>
              <Text style={[styles.btnText, { color: '#111' }]}>Stop tracking</Text>
            </Pressable>
          )}

          <Pressable
            style={[styles.fab]}
            onPress={() => {
              if (!location) return;
              mapRef.current?.animateCamera({ center: { latitude: location.lat, longitude: location.lon }, zoom: 17 }, { duration: 400 });
            }}
          >
            <Ionicons name="locate" size={20} color="#111" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  controls: { position: 'absolute', bottom: 16, left: 16, right: 16, gap: 10 },
  btn: {
    height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
  },
  primary: { backgroundColor: '#111' },
  secondary: { backgroundColor: '#F3F3F3' },
  btnText: { color: '#fff', fontWeight: '600' },
  fab: {
    position: 'absolute', right: 10, bottom: 10,
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E6E6E6',
    alignItems: 'center', justifyContent: 'center', elevation: 2,
  },
});
