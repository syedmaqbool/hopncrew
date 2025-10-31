import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ScheduleRide'>;

const ITEM_H = 40;
const VISIBLE_ROWS = 5;
const MINT = '#B9FBE7';

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export default function ScheduleRideScreen({ navigation, route }: Props | any) {
  const insets = useSafeAreaInsets();

  const now: any = route.params?.initial ?? new Date();
  const start = route.params?.start ?? null;
  const dest = route.params?.dest ?? null;

  // ----- data sources -----
  const dates = useMemo(() => {
    const arr: { label: string; value: Date }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const isToday = i === 0;
      const lab = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(d);
      arr.push({ label: isToday ? 'Today' : lab, value: d });
    }
    return arr;
  }, [now]);

  const hours = useMemo(
    () => Array.from({ length: 12 }, (_, i) => `${i + 1}`),
    [],
  );
  const minutes = useMemo(
    () => Array.from({ length: 12 }, (_, i) => pad(i * 5)),
    [],
  );
  const ampm = ['AM', 'PM'];

  // ----- initial indices -----
  const initHour12 = ((now.getHours() + 11) % 12) + 1; // 1..12
  const initMinIdx = Math.round(now.getMinutes() / 5) % 12;

  const [idxDate, setIdxDate] = useState(0);
  const [idxHour, setIdxHour] = useState(initHour12 - 1);
  const [idxMin, setIdxMin] = useState(initMinIdx);
  const [idxAP, setIdxAP] = useState(now.getHours() >= 12 ? 1 : 0);

  // ----- selected date -----
  const selectedDate = useMemo(() => {
    const d = new Date(dates[idxDate].value);
    let h = idxHour + 1; // 1..12
    const m = (idxMin * 5) % 60;
    if (idxAP === 0) h = h === 12 ? 0 : h; // 12AM -> 00
    else h = h === 12 ? 12 : h + 12; // PM (except 12PM)
    d.setHours(h, m, 0, 0);
    return d;
  }, [dates, idxDate, idxHour, idxMin, idxAP]);

  // drop-off estimate (placeholder: +2h 30m)
  const dropOff = useMemo(() => {
    const t = new Date(selectedDate);
    t.setHours(t.getHours() + 2);
    t.setMinutes(t.getMinutes() + 30);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(t);
  }, [selectedDate]);

  const confirm = () => {
    navigation.navigate('FareOptions', {
      etaMinutes: 18,
      quotes: [
        {
          id: 'esc',
          tier: 'Escalade',
          price: 51,
          oldPrice: 85,
          seatText: 'Or Similar',
        },
        {
          id: 'prm',
          tier: 'Premium',
          price: 32,
          oldPrice: 55,
          seatText: 'Sedan X2',
        },
        {
          id: 'eco',
          tier: 'Economy',
          price: 43,
          oldPrice: 67,
          seatText: 'SUV X2',
        },
      ],
      payMethod: 'Payment Breakdown',
      onConfirm: (q, opts) => {
        console.log('Chosen quote:', q, opts);
      },
      start,
      dest,
      when: selectedDate, // optional: pass scheduled time along
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F3F4' }}>
      {/* Top map/header w/ rounded bottom */}
      <ImageBackground
        source={assets.images.Sbg /* <- provide your header image */}
        style={[styles.headerImg, { paddingTop: insets.top + 8 }]}
        imageStyle={styles.headerImgRadius}
        resizeMode="cover"
      >
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backCircle}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={18} color="#111" />
          </Pressable>

          <Text style={styles.headerTitle}>Schedule a Ride</Text>

          {/* spacer to balance layout */}
          <View style={{ width: 36, height: 36 }} />
        </View>
      </ImageBackground>

      {/* White sheet content */}
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        {/* big centered title */}
        {false && (
          <Text style={styles.bigTitle}>
            {new Intl.DateTimeFormat('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            }).format(selectedDate)}
            {`  •  `}
            {new Intl.DateTimeFormat('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            }).format(selectedDate)}
          </Text>
        )}

        <Text style={styles.bigTitle}>
          {new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }).format(selectedDate)}
          {` - `}
          {new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }).format(selectedDate)}
        </Text>

        {/* Wheels */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Wheels */}
          <View style={styles.wheelsWrap}>
            <View pointerEvents="none" style={styles.wheelsHighlight} />
            <Wheel
              data={dates.map(d => d.label)}
              index={idxDate}
              onIndexChange={setIdxDate}
              width="44%"
            />
            <Wheel
              data={hours}
              index={idxHour}
              onIndexChange={setIdxHour}
              width="12%"
            />
            <Wheel
              data={minutes}
              index={idxMin}
              onIndexChange={setIdxMin}
              width="16%"
            />
            <Wheel
              data={ampm}
              index={idxAP}
              onIndexChange={setIdxAP}
              width="16%"
            />
          </View>

          {/* Info bullets with extra vertical padding */}
        </ScrollView>

        {/* CTA */}
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <View style={{ gap: 14, paddingHorizontal: 16, paddingVertical: 8 }}>
            <View style={[styles.infoRow, styles.infoPadded]}>
              <Image
                source={assets.images.dropoffIcon}
                style={styles.infoIcon}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoTitle}>Estimated drop-off time</Text>
                <Text style={styles.infoSub}>
                  Arrive at destination at approx. {dropOff.replace(' ', '')}
                </Text>
              </View>
            </View>

            <View style={[styles.infoRow, styles.infoPadded]}>
              <Image source={assets.images.plansIcon} style={styles.infoIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoTitle}>
                  Change of plans? No worries!
                </Text>
                <Text style={styles.infoSub}>
                  Cancel or modify your ride free of charge up to 1 hour before
                  pickup
                </Text>
              </View>
            </View>
          </View>
          {/* Toggle pill */}
          <View style={styles.toggleCard}>
            <View style={styles.toggleIconWrap}>
              <Image
                source={assets.images.squareIcon}
                style={styles.infoIcon}
              />
            </View>
            <Text style={styles.toggleTxt}>
              Square hold funds and charge after drop-off
            </Text>
            <View style={styles.infoCircle}>
              <Ionicons name="information" size={12} color="#111" />
            </View>
          </View>
          <Pressable style={styles.cta} onPress={confirm}>
            <Text style={styles.ctaText}>Check Fare</Text>
            <View style={styles.ctaIcon}>
              <AntDesign name="arrowright" size={18} color="#111" />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ---------- Wheel column ---------- */

function Wheel({
  data,
  index,
  onIndexChange,
  width,
}: {
  data: string[];
  index: number;
  onIndexChange: (i: number) => void;
  width: number | `${number}%` | string;
}) {
  const listRef = useRef<FlatList<string>>(null);
  const pad = (ITEM_H * (VISIBLE_ROWS - 1)) / 2;

  const onMomentumEnd = (e: any) => {
    const y = e.nativeEvent.contentOffset.y as number;
    const idx = Math.round(y / ITEM_H);
    if (idx !== index)
      onIndexChange(Math.max(0, Math.min(data.length - 1, idx)));
  };

  return (
    <View style={[styles.wheelCol, { width }]}>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(s, i) => `${s}-${i}`}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumEnd}
        contentContainerStyle={{ paddingVertical: pad }}
        getItemLayout={(_, i) => ({
          length: ITEM_H,
          offset: ITEM_H * i,
          index: i,
        })}
        initialScrollIndex={index}
        renderItem={({ item, index: i }) => (
          <View style={styles.item}>
            <Text style={[styles.itemTxt, i === index && styles.itemActive]}>
              {item}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  headerImg: {
    height: 160,
    justifyContent: 'flex-start',
    paddingHorizontal: 26,
  },
  headerImgRadius: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerTitle: { color: '#111', fontSize: 18, fontFamily: 'BiennaleRegular' },

  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -16, // slight overlap with curved header
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
  },

  bigTitle: {
    fontSize: 22,
    color: '#111',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
    fontFamily: 'BiennaleBold',
  },

  wheelsWrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 18,
    position: 'relative',
  },
  wheelsHighlight: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: (ITEM_H * (VISIBLE_ROWS - 1)) / 2,
    height: ITEM_H,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E7E7E7',
    backgroundColor: 'rgba(0,0,0,0.03)', // subtle band like the mock
    borderRadius: 8,
  },
  wheelCol: {
    height: ITEM_H * VISIBLE_ROWS,
    overflow: 'hidden',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FAFAFA',
  },
  infoPadded: { paddingVertical: 8 },
  item: {
    height: ITEM_H,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  itemTxt: { color: '#9AA0A6' },
  itemActive: { color: '#111', fontFamily: 'BiennaleBold' },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoIcon: { width: 20, height: 20, resizeMode: 'contain' },
  infoTitle: { color: '#111', fontFamily: 'BiennaleBold' },
  infoSub: { color: '#666', marginTop: 2, fontFamily: 'BiennaleRegular' },
  footer: { paddingHorizontal: 16, paddingTop: 8 },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D6F8EA',
    backgroundColor: '#EAFDF5',
  },
  toggleIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#CFF6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTxt: { color: '#111', fontSize: 12, flexShrink: 1, fontFamily: 'BiennaleMedium' },
  infoCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cta: {
    marginTop: 16,
    marginHorizontal: 16,
    height: 48,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontFamily: 'BiennaleSemiBold', fontSize: 16 },
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
