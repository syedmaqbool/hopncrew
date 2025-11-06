// src/screens/RideSelectionScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FONTS } from '../../src/theme/fonts';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RideSelection'>;

const TEXT = '#0F172A'; // slate-900
const MUTED = '#6B7280'; // gray-500
const MINT = '#B9FBE7';

export default function RideSelectionScreen({ navigation }: Props) {
  // Entrance / exit animation
  const slide = useRef(new Animated.Value(1)).current; // 1 off, 0 on
  const fade = useRef(new Animated.Value(0)).current; // backdrop/ornaments
  const isNavigating = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: 0,
        duration: 340,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [slide, fade]);

  const slideY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 28], // tiny lift from bottom
  });

  // Reusable press scale
  const mkScale = () => {
    const v = new Animated.Value(1);
    const onPressIn = () =>
      Animated.spring(v, {
        toValue: 0.98,
        useNativeDriver: true,
        speed: 18,
        bounciness: 6,
      }).start();
    const onPressOut = () =>
      Animated.spring(v, {
        toValue: 1,
        useNativeDriver: true,
        speed: 18,
        bounciness: 6,
      }).start();
    return { v, onPressIn, onPressOut };
  };

  const reg = mkScale();
  const air = mkScale();

  // One smooth exit animation, then a single replace (no extra navigate)
  const animateOutThenNavigateTo = (
    routeName: keyof RootStackParamList,
    params?: any,
  ) => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 1,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) {
        isNavigating.current = false;
        return;
      }
      navigation.navigate(routeName as never, params as never);
    });
  };

  // ✅ Smooth: directly replace into App with nested screen/params
  const goRegular = () =>
    animateOutThenNavigateTo('Trip', { flow: 'regular' as const });

  // ✅ Smooth to FlightDetails (or change to nested if needed)
  const goAirport = () =>
    animateOutThenNavigateTo('FlightDetails', { airportCode: 'YYZ' });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Animated background orbs */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.orb,
          styles.orbLeft,
          {
            opacity: fade,
            transform: [
              {
                scale: fade.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.orb,
          styles.orbRight,
          {
            opacity: fade,
            transform: [
              {
                scale: fade.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: slideY }], opacity: fade },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logoCircle}>
              <Ionicons name="car-sport-outline" size={22} color="#0B1220" />
            </View>
            <Text style={styles.brand}>hopn</Text>
          </View>
          <Text style={styles.title}>Choose your ride flow</Text>
          <Text style={styles.subtitle}>
            Tell us where you’re headed to begin.
          </Text>
        </View>

        {/* Cards */}
        <View style={styles.cards}>
          {/* Airport → Home */}
          <Animated.View style={{ transform: [{ scale: reg.v }] }}>
            <Pressable
              onPressIn={reg.onPressIn}
              onPressOut={reg.onPressOut}
              onPress={goAirport}
              style={[styles.card, styles.cardMint]}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardIconLeft}>
                  <Ionicons name="airplane-outline" size={18} color="#0B1220" />
                </View>
                <Text style={styles.heading}>Airport ➜ Home</Text>
                <View style={styles.badge}>
                  <Ionicons name="sparkles-outline" size={14} color="#0B1220" />
                  <Text style={styles.badgeText}>Recommended</Text>
                </View>
              </View>

              <Text style={styles.subcopy}>
                Landed? Get a ride straight to your place in minutes.
              </Text>

              <View style={styles.cardFooter}>
                <View style={styles.pill}>
                  <Ionicons name="time-outline" size={14} color="#0B1220" />
                  <Text style={styles.pillText}>Fast pickup</Text>
                </View>
                <View style={styles.pill}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={14}
                    color="#0B1220"
                  />
                  <Text style={styles.pillText}>Fixed fare</Text>
                </View>

                <View style={styles.arrowBadge}>
                  <AntDesign name="arrowright" size={16} color="#0B1220" />
                </View>
              </View>
            </Pressable>
          </Animated.View>

          {/* Home → Airport */}
          <Animated.View style={{ transform: [{ scale: air.v }] }}>
            <Pressable
              onPressIn={air.onPressIn}
              onPressOut={air.onPressOut}
              onPress={goRegular}
              style={[styles.card, styles.cardIndigo]}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardIconLeft}>
                  <Ionicons name="home-outline" size={18} color="#0B1220" />
                </View>
                <Text style={styles.heading}>Home ➜ Airport</Text>
                <View style={[styles.badge, { backgroundColor: '#E0E7FF' }]}>
                  <Ionicons name="calendar-outline" size={14} color="#0B1220" />
                  <Text style={styles.badgeText}>Schedule</Text>
                </View>
              </View>

              <Text style={styles.subcopy}>
                Catching a flight? Book a timely ride with reminders.
              </Text>

              <View style={styles.cardFooter}>
                <View style={styles.pill}>
                  <Ionicons
                    name="notifications-outline"
                    size={14}
                    color="#0B1220"
                  />
                  <Text style={styles.pillText}>Reminders</Text>
                </View>
                <View style={styles.pill}>
                  <Ionicons
                    name="briefcase-outline"
                    size={14}
                    color="#0B1220"
                  />
                  <Text style={styles.pillText}>Bags ready</Text>
                </View>

                <View style={styles.arrowBadge}>
                  <AntDesign name="arrowright" size={16} color="#0B1220" />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="swap-horizontal-outline" size={14} color={MUTED} />
          <Text style={styles.footerText}>You can switch flows anytime.</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

  // soft animated background blobs
  orb: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: MINT,
    opacity: 0.35,
    // filter is ignored on native; safe to keep/remove
  },
  orbLeft: { top: -40, left: -60 },
  orbRight: { bottom: -50, right: -70, backgroundColor: '#E0E7FF' },

  container: { flex: 1, paddingHorizontal: 18, paddingTop: 8 },

  header: { alignItems: 'center', marginTop: 60, marginBottom: 12 },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  brand: { fontSize: 18, color: TEXT, letterSpacing: 0.5, fontFamily: FONTS.bold },
  title: { fontSize: 20, color: TEXT, marginTop: 6, fontFamily: FONTS.bold },
  subtitle: { marginTop: 4, color: MUTED, textAlign: 'center', fontFamily: FONTS.regular },

  cards: { marginTop: 18, gap: 14 },

  card: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cardMint: {
    backgroundColor: '#F0FAF6',
    borderColor: '#E1F5EC',
  },
  cardIndigo: {
    backgroundColor: '#F5F6FF',
    borderColor: '#E6E9FF',
  },

  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardIconLeft: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  heading: { flex: 1, fontSize: 16, color: TEXT, fontFamily: FONTS.bold },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#C7FCEC',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  badgeText: { color: '#0B1220', fontSize: 12, fontFamily: FONTS.bold },

  subcopy: { color: '#334155', marginBottom: 10, fontFamily: FONTS.regular },

  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginRight: 8,
  },
  pillText: { color: '#0B1220', fontSize: 12, fontFamily: FONTS.bold },

  arrowBadge: {
    marginLeft: 'auto',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },

  footer: {
    marginTop: 'auto',
    marginBottom: 18,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  footerText: { color: MUTED, fontFamily: FONTS.regular },
});
