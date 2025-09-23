// src/hooks/useLocation.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import Geolocation, { GeoPosition, GeoOptions } from 'react-native-geolocation-service';
import {
  check, request, requestMultiple, RESULTS, PERMISSIONS, openSettings,
} from 'react-native-permissions';

type Loc = {
  lat: number;
  lon: number;
  accuracy?: number;
  speed?: number | null;
  heading?: number | null;
  timestamp: number;
};

export function useLocation() {
  const [location, setLocation] = useState<Loc | null>(null);
  const [watching, setWatching] = useState(false);
  const [granted, setGranted] = useState(false);     // ← expose this
  const watchId = useRef<number | null>(null);

  // Call this on mount or when you need to ensure access
  const ensurePermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      // Check FINE first
      let res = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      // If denied, request both (Android 12+ may grant only COARSE)
      if (res === RESULTS.DENIED) {
        const multi = await requestMultiple([
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ]);
        const fine = multi[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
        const coarse = multi[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION];
        res = fine === RESULTS.GRANTED ? RESULTS.GRANTED : coarse;
      }

      if (res === RESULTS.BLOCKED) {
        Alert.alert(
          'Location blocked',
          'Please enable location permission in Settings.',
          [
        { text: 'Open Settings', onPress: () => { void openSettings(); } }, // 
        { text: 'Cancel', style: 'cancel' },
         ]
        );
        setGranted(false);
        return false;
      }

      const ok = res === RESULTS.GRANTED || res === RESULTS.LIMITED;
      setGranted(ok);
      return ok;
    } else {
      let res = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (res === RESULTS.DENIED) res = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (res === RESULTS.BLOCKED) {
        Alert.alert(
          'Location blocked',
          'Enable location in Settings → Privacy → Location Services.',
         [
        { text: 'Open Settings', onPress: () => { void openSettings(); } }, // 
        { text: 'Cancel', style: 'cancel' },
         ]
        );
        setGranted(false);
        return false;
      }

      const ok = res === RESULTS.GRANTED || res === RESULTS.LIMITED;
      setGranted(ok);
      return ok;
    }
  }, []);

  useEffect(() => {
    // Ask once on mount so UI can react to "granted"
    ensurePermission();
  }, [ensurePermission]);

  const toLoc = (pos: GeoPosition): Loc => ({
    lat: pos.coords.latitude,
    lon: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
    speed: pos.coords.speed,
    heading: pos.coords.heading,
    timestamp: pos.timestamp,
  });

  const getCurrent = useCallback(async (opts?: GeoOptions): Promise<Loc | null> => {
    const ok = await ensurePermission();
    if (!ok) return null;

    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (pos) => { const l = toLoc(pos); setLocation(l); resolve(l); },
        (err) => { console.warn('getCurrentPosition error', err); resolve(null); },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000, ...opts }
      );
    });
  }, [ensurePermission]);

  const startWatching = useCallback(async (opts?: GeoOptions) => {
    const ok = await ensurePermission();
    if (!ok || watching) return;

    watchId.current = Geolocation.watchPosition(
      (pos) => setLocation(toLoc(pos)),
      (err) => console.warn('watchPosition error', err),
      { enableHighAccuracy: true, distanceFilter: 5, interval: 5000, fastestInterval: 2000, ...opts }
    );
    setWatching(true);
  }, [ensurePermission, watching]);

  const stopWatching = useCallback(() => {
    if (watchId.current != null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setWatching(false);
  }, []);

  useEffect(() => () => stopWatching(), [stopWatching]);

  // expose "granted" so MapView can use it
  return { granted, location, getCurrent, startWatching, stopWatching, watching, ensurePermission };
}
