// src/screens/AirportDetailsScreen.tsx
import React, { useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, AirportPOI } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AirportDetails'>;

const fallbackData: AirportPOI[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  title: 'Bank Privat',
  subtitle: 'Mykhailivska St. 48, Kiev, UA',
}));

export default function AirportDetailsScreen({ navigation, route }: Props) {
  const listRef = useRef<FlatList<AirportPOI>>(null);
  const [viewportH, setViewportH] = useState(0);
  const [contentH, setContentH] = useState(1); // avoid divide-by-zero
  const [scrollY, setScrollY] = useState(0);

  const items = useMemo<AirportPOI[]>(
    () => route.params?.items ?? fallbackData,
    [route.params?.items],
  );
  const screenTitle = route.params?.title ?? 'Airport details';

  const renderItem = ({ item }: { item: AirportPOI }) => (
    <Pressable
      style={styles.row}
      onPress={() => {
        if (route.params?.onPick) {
          route.params.onPick(item);
          return;
        }
        navigation.navigate('Trip');
      }}
    >
      <View style={styles.pin}>
        <Image
          source={require('../../assets/icons/loc-icon.png')}
          alt="location-icon"
          style={{ width: 15, height: 21 }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
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
        {/* <Text style={styles.hTitle}>{screenTitle}</Text> */}
      </View>

      {/* Rounded scrollable card */}
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
          contentContainerStyle={{ paddingVertical: 12, paddingRight: 12 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={(_, h) => setContentH(h)}
          onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={22}
        />

        {/* Custom scrollbar */}
        <ScrollBar viewportH={viewportH} contentH={contentH} scrollY={scrollY} />
      </View>
    </SafeAreaView>
  );
}

function ScrollBar({
  viewportH,
  contentH,
  scrollY,
}: {
  viewportH: number;
  contentH: number;
  scrollY: number;
}) {
  // only show when content is noticeably taller than viewport
  const hasScrollableContent = contentH > viewportH + 24; // small threshold

  if (!viewportH || !hasScrollableContent) return null;

  const PADDING = 10;
  const trackH = Math.max(0, viewportH - PADDING * 2);
  if (trackH <= 0) return null;

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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hTitle: { fontSize: 16, color: '#111', fontFamily: FONTS.bold },

  card: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#CFCDCD',
    paddingHorizontal: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingRight: 6,
  },
  pin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#201E20', fontFamily: FONTS.regular, fontSize: 16 },
  subtitle: {
    color: '#8D8E8F',
    marginTop: 2,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },

  // divider: start under text column
  // 28 (pin) + 10 (gap) ≈ 38
  sep: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 38,
    marginBottom: 8,
  },

  // custom scrollbar
  scrollTrack: {
    position: 'absolute',
    right: 6,
    width: 2,
    borderRadius: 3,
    backgroundColor: '#F2F2F2',
  },
  scrollThumb: {
    position: 'absolute',
    width: 6,
    left: -6,
    right: 0,
    borderRadius: 3,
    backgroundColor: '#8D8E8F',
  },
});
