// src/screens/ProcessingBookingModal.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Processing'>;

const MINT = '#B9FBE7';

export default function ProcessingBookingModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const durationMs = route.params?.durationMs ?? 10000;
  const onDone = route.params?.onDone;

  // ring rotation
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const spinDeg = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // progress bar
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: durationMs,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) onDone?.();
    });
  }, [progress, durationMs, onDone]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // 8 avatars around a circle
  const dots = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 2 * Math.PI;
        const r = 54;
        return {
          left: 54 + r * Math.cos(angle) - 12,
          top: 54 + r * Math.sin(angle) - 12,
          key: i.toString(),
        };
      }),
    [],
  );

  return (
    <View style={styles.fill}>
      {/* tap outside to close (optional) */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      {/* Top overlay back button */}
      <View style={[styles.overlayTop, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color="#111" />
        </Pressable>
      </View>

      {/* Bottom sheet */}
      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        <View style={styles.sheet}>
          {/* circle animation */}
          <View style={styles.ringWrap}>
            <Animated.View
              style={[styles.ring, { transform: [{ rotate: spinDeg }] }]}
            >
              {dots.map(d => (
                <View
                  key={d.key}
                  style={[styles.dot, { left: d.left, top: d.top }]}
                >
                  <MaterialCommunityIcons
                    name="account"
                    size={16}
                    color="#fff"
                  />
                </View>
              ))}
            </Animated.View>
          </View>

          <Text style={styles.title}>We are processing your booking…</Text>

          {/* progress bar */}
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>

          {/* trust row */}
          <View style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={styles.subhead}>
              Over 8 million km of airport transfers by pro{'\n'}partners in 20
              years
            </Text>

            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <AntDesign key={i} name="star" size={16} color="#FFC107" />
              ))}
            </View>

            <View style={styles.identityRow}>
              <Ionicons name="shield-checkmark" size={16} color="#111" />
              <Text style={styles.identityTxt}>Identity verified</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent', // keep map visible
  },
  overlayTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
    paddingHorizontal: 12,
  },
  roundBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#EEE',
  },

  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
  },

  ringWrap: { alignItems: 'center', marginTop: 8 },
  ring: {
    width: 108, height: 108, borderRadius: 54,
    backgroundColor: '#F1F2F4',
    alignItems: 'center', justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#72e0bf',
    alignItems: 'center', justifyContent: 'center',
  },

  title: {
    marginTop: 14,
    textAlign: 'center',
    color: '#111',
    fontSize: 14,
    fontWeight: '600',
  },

  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EEE',
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: MINT,
  },

  subhead: {
    color: '#111',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '700',
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
    justifyContent: 'center',
  },
  identityRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  identityTxt: { color: '#111', fontWeight: '600' },
});
