// src/screens/ChildSeatInfoModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { getChildSeatTypes, type ChildSeatType } from '../services/app';
import { FONTS } from '../../src/theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'ChildSeatInfo'>;

const MINT = '#B9FBE7';

export default function ChildSeatInfoModal({ navigation }: Props) {
  const [seatTypes, setSeatTypes] = useState<ChildSeatType[]>([]);
  const [loading, setLoading] = useState(false);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<ChildSeatType>>(null);

  // Modal width (center popup)
  const MODAL_HORIZONTAL_MARGIN = 24;
  const MODAL_MAX_WIDTH = 420;
  const modalWidth = Math.min(screenWidth - MODAL_HORIZONTAL_MARGIN * 2, MODAL_MAX_WIDTH);

  // 🔧 Card sizing: 1 full + ~half next card visible *inside the modal*
  const CARD_SPACING = 16;
  const CARD_WIDTH = (modalWidth - CARD_SPACING) / 1.5; // 1.5 cards in viewport
  const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getChildSeatTypes();
        setSeatTypes(list);
      } catch {
        setSeatTypes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.fill}>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      {/* Centered popup */}
      <SafeAreaView style={styles.centerWrap}>
        <View style={[styles.sheet, { width: modalWidth }]}>
          <View style={styles.header}>
            <Text style={styles.close}>Close</Text>
            <Pressable style={styles.close} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={24} color="#201E20" />
            </Pressable>
          </View>

          <Image
            source={require('../../assets/icons/free-icon.png')}
            alt="free-icon"
            style={{ width: 68, height: 38 }}
          />

          <View style={{ marginTop: 8 }}>
            <FlatList
              ref={listRef}
              data={seatTypes}
              keyExtractor={it => String(it.id)}
              horizontal
              snapToInterval={SNAP_INTERVAL}
              snapToAlignment="start"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: 12,
              }}
              onMomentumScrollEnd={e => {
                const offsetX = e.nativeEvent.contentOffset.x;
                const idx = Math.round(offsetX / SNAP_INTERVAL);
                setActiveIndex(Math.max(0, Math.min(idx, seatTypes.length - 1)));
              }}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.card,
                    {
                      width: CARD_WIDTH,
                      marginRight: index === seatTypes.length - 1 ? 0 : CARD_SPACING,
                    },
                  ]}
                >
                  <Text style={styles.cardTitle}>{item.label}</Text>
                  <View style={styles.cardImageWrap}>
                    {item.image_url ? (
                      <Image source={{ uri: item.image_url }} style={styles.cardImage} />
                    ) : (
                      <View style={styles.cardImagePlaceholder}>
                        <Text
                          style={{
                            color: '#111',
                            fontSize: 34,
                            fontWeight: '800',
                          }}
                        >
                          ?
                        </Text>
                      </View>
                    )}
                  </View>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 8 }}
                  >
                    <Text style={styles.cardBody}>{item.description}</Text>
                  </ScrollView>
                </View>
              )}
            />
          </View>

          {/* 🔄 Navigation lines */}
          <View style={styles.sliderDots}>
            {seatTypes.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === activeIndex ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
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
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  // ⬇️ Center the popup instead of bottom sheet
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
    maxHeight: '99%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
    gap: 6,
  },
  title: { color: '#201E20', fontSize: 16, fontFamily: FONTS.bold },
  close: {
    // width: 32,
    // height: 32,
    color: '#201E20',
    fontFamily: FONTS.regular,
    fontSize:16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 24,
    backgroundColor: '#EFEFEF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 20,
    height: 564,
    width: 224,
  },
  cardTitle: {
    color: '#201E20',
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 12,
    fontFamily: FONTS.regular,
  },
  cardImageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardImage: { width: 192, height: 192, resizeMode: 'contain' },
  cardImagePlaceholder: {
    width: 192,
    height: 192,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
  },
  cardBody: {
    color: '#8D8E8F',
    fontSize: 15,
    lineHeight: 20,
    fontFamily: FONTS.semibold,
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
    paddingTop: 8,
  },
  dot: {
    width: 40,
    height: 2,
    borderRadius: 2,
  },
  dotActive: { backgroundColor: '#1F1F23' },
  dotInactive: { backgroundColor: '#D9D9DE' },
  cta: {
    marginTop: 16,
    height: 48,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#fff', fontFamily: FONTS.bold },
  ctaIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
});
