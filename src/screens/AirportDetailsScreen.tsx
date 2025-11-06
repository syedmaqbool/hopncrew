// src/screens/AirportDetailsScreen.tsx
<<<<<<< HEAD
import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
=======
import React, { useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, AirportPOI } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AirportDetails'>;

const fallbackData: AirportPOI[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  title: 'Bank Privat',
  subtitle: 'Mykhailivska St. 48, Kiev, UA',
}));

export default function AirportDetailsScreen({ navigation, route }: Props) {
<<<<<<< HEAD
  const items = useMemo<AirportPOI[]>(
    () => route.params?.items ?? fallbackData,
    [route.params?.items]
=======
  const listRef = useRef<FlatList<AirportPOI>>(null);
  const [viewportH, setViewportH] = useState(0);
  const [contentH, setContentH] = useState(1); // avoid divide-by-zero
  const [scrollY, setScrollY] = useState(0);

  const items = useMemo<AirportPOI[]>(
    () => route.params?.items ?? fallbackData,
    [route.params?.items],
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  );
  const screenTitle = route.params?.title ?? 'Airport details';

  const renderItem = ({ item }: { item: AirportPOI }) => (
    <Pressable
      style={styles.row}
      onPress={() => {
        // route.params?.onPick?.(item);
        // navigation.goBack();
        navigation.navigate('Trip');
      }}
    >
      <View style={styles.pin}>
        <Ionicons name="location-outline" size={16} color="#111" />
      </View>
      <View style={{ flex: 1 }}>
<<<<<<< HEAD
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
=======
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.hBtn}>
          <Ionicons name="chevron-back" size={18} color="#111" />
        </Pressable>
        <Text style={styles.hTitle}>{screenTitle}</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Rounded scrollable card */}
<<<<<<< HEAD
      <View style={styles.card}>
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator
=======
      <View
        style={styles.card}
        onLayout={e => setViewportH(e.nativeEvent.layout.height)}
      >
        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={it => it.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={{ paddingVertical: 8, paddingRight: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={(_, h) => setContentH(h)}
          onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={16}
        />

        {/* Custom scrollbar */}
        <ScrollBar
          viewportH={viewportH}
          contentH={contentH}
          scrollY={scrollY}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
        />
      </View>
    </SafeAreaView>
  );
}

<<<<<<< HEAD
=======
function ScrollBar({
  viewportH,
  contentH,
  scrollY,
}: {
  viewportH: number;
  contentH: number;
  scrollY: number;
}) {
  const PADDING = 10;
  const trackH = Math.max(0, viewportH - PADDING * 2);
  const minThumb = 28;
  const thumbH = Math.max(
    minThumb,
    Math.min(trackH, (viewportH / Math.max(contentH, 1)) * trackH),
  );
  const maxScroll = Math.max(contentH - viewportH, 1);
  const maxThumbTravel = Math.max(trackH - thumbH, 0);
  const thumbY = Math.min(
    maxThumbTravel,
    (scrollY / maxScroll) * maxThumbTravel,
  );

  if (trackH <= 0) return null;

  return (
    <View
      pointerEvents="none"
      style={[styles.scrollTrack, { top: PADDING, height: trackH }]}
    >
      <View
        style={[
          styles.scrollThumb,
          { height: thumbH, transform: [{ translateY: thumbY }] },
        ]}
      />
    </View>
  );
}

>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hBtn: {
<<<<<<< HEAD
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'center',
  },
  hTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
=======
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hTitle: { fontSize: 16, color: '#111', fontFamily: FONTS.bold },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  card: {
    flex: 1,
    margin: 16,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    paddingHorizontal: 10,
    // subtle shadow
<<<<<<< HEAD
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
=======
    // shadowColor: '#000',
    // shadowOpacity: 0.06,
    // shadowRadius: 10,
    // shadowOffset: { width: 0, height: 4 },
    // elevation: 2,
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingRight: 6,
  },
  pin: {
<<<<<<< HEAD
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#F6F7F8',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { color: '#111', fontWeight: '700' },
  subtitle: { color: '#8A8A8A', marginTop: 2, fontSize: 12 },
  sep: { height: 1, backgroundColor: '#F0F0F0' },
=======
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F6F7F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#111', fontFamily: FONTS.bold },
  subtitle: { color: '#8A8A8A', marginTop: 2, fontSize: 12, fontFamily: FONTS.regular },
  sep: { height: 1, backgroundColor: '#F0F0F0' },

  // custom scrollbar
  scrollTrack: {
    position: 'absolute',
    right: 6,
    width: 3,
    borderRadius: 3,
    backgroundColor: '#F2F2F2',
  },
  scrollThumb: {
    position: 'absolute',
    width: 6,
    left: -1,
    right: 0,
    borderRadius: 3,
    backgroundColor: '#8D8E8F',
  },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});
