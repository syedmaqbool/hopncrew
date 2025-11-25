// src/screens/ScheduleFlightScreen.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
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
import { FONTS } from '../../src/theme/fonts';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ScheduleFlight'>;

const ITEM_H = 35;
const VISIBLE_ROWS = 5;
const MINT = '#B9FBE7';

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export default function ScheduleFlightScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const airportCode = route.params?.airportCode ?? 'YYZ';

  const now = route.params?.initial ?? new Date();

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
    () => Array.from({ length: 12 }, (_, i) => pad2(i * 5)),
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

  const onSelect = () => {
    route.params?.onPick?.(selectedDate);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top header image same as ScheduleRide */}
      <ImageBackground
        source={assets.images.Sbg}
        style={[styles.headerImg, { paddingTop: insets.top + 8 }]}
        imageStyle={styles.headerImgRadius}
        resizeMode="cover"
      >
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backCircle}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../../assets/icons/left-line-arrow-icon.png')}
              alt="left-arrow"
              style={{ height: 88, width: 98 }}
            />
            {/* <Ionicons name="chevron-back" size={18} color="#111" /> */}
          </Pressable>
          <Text style={styles.headerTitle}>Schedule a Ride</Text>
          <View style={{ width: 36, height: 36 }} />
        </View>
      </ImageBackground>

      {/* White content sheet */}
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        <Text
          style={{
            fontSize: 24,
            fontFamily:FONTS.semibold,
            lineHeight:32,
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          Arrival to {airportCode}
        </Text>
        <Text style={styles.bigTitle}>Data and Time</Text>

        {/* Main content - fixed (no page scroll) */}
        <View style={styles.content}>
          {/* Wheels */}
          <View style={styles.wheelsOuter}>
            <View style={styles.wheelsWrap}>
              {/* top/bottom fades */}
              <View pointerEvents="none" style={styles.wheelsFadeTop} />
              <View pointerEvents="none" style={styles.wheelsFadeBottom} />

              {/* center highlight bar */}
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
          </View>

          {/* Info bullets per mock */}
          <View style={styles.bulletsWrap}>
            <Bullet
              icon={
                <Image source={require('../../assets/icons/flight-loc-icon.png')} alt='flight-loc' style={{height:24,width:24}} />
                // <Ionicons name="alert-circle-outline" size={18} color="#111" />
              }
              title="Flight Delayed? No Problem:"
              body="Your captain will tracks your flight and adjust your pickup time automatically."
            />
            <View style={styles.separator} />
            <Bullet
              icon={
                <Image source={require('../../assets/icons/timer-icon.png')} alt='flight-loc' style={{height:24,width:24}} />
              // <Ionicons name="time-outline" size={18} color="#111" />
            }
              title="Enjoy Unlimited Wait Time:"
              body="Lost baggage? Customs or immigration delays? No worries—your driver will wait as long as needed"
            />
            <View style={styles.separator} />
            <Bullet
              icon={
                <Image source={require('../../assets/icons/flight-cancel-icon.png')} alt='flight-loc' style={{height:24,width:24}} />
              // <Ionicons name="card-outline" size={18} color="#111" />
            }
              title="Flexible cancellation"
              body="From the airport: Cancel up to 5 hours before pickup"
            />

            <Pressable
              style={styles.linkRow}
              onPress={() => navigation.navigate('AirportPickupPerks')}
            >
              <Text style={styles.linkText}>More airport pickup Perks</Text>
              <AntDesign name="arrowright" size={16} color="#111" />
            </Pressable>
          </View>
        </View>

        {/* CTA */}
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <Pressable style={styles.cta} onPress={onSelect}>
            <Text style={styles.ctaText}>Select</Text>
            <View style={styles.ctaIcon}>
              <AntDesign name="arrowright" size={18} color="#111" />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* --------- helpers --------- */
function Bullet({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 10,alignItems:'center',justifyContent:'center' }}>
      <View style={styles.bulletIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.bulletTitle}>{title}</Text>
        <Text style={styles.bulletBody}>{body}</Text>
      </View>
    </View>
  );
}

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

/* --------- styles --------- */
const styles = StyleSheet.create({
  headerImg: {
    height: 160,
    justifyContent: 'flex-start',
    paddingHorizontal: 26,
  },
  headerImgRadius: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backCircle: {
    width: 48,
    height: 48,
    borderRadius: 32,
    // backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerTitle: { color: '#111', fontSize: 18, fontFamily: FONTS.regular },

  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  bigTitle: {
    fontSize: 18,
    color: '#201E20',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    paddingHorizontal: 16,
    fontFamily: FONTS.regular,
  },

  // NEW: main content container (no page scroll)
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  wheelsOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
  },
  wheelsWrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  wheelsHighlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (ITEM_H * (VISIBLE_ROWS - 1)) / 1.87,
    height: 28,
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
  },
  wheelsFadeTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: ITEM_H * 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.46,
  },
  wheelsFadeBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: ITEM_H * 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.46,
  },
  wheelCol: {
    height: ITEM_H * VISIBLE_ROWS,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    marginHorizontal: -2,
  },
  item: {
    height: ITEM_H,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    paddingVertical: 4,
  },
  itemTxt: {
    color: '#C5C6CB',
    fontFamily: FONTS.bold,
    fontSize: 20,
    paddingVertical: 0,
  },
  itemActive: {
    color: '#1C1B1F',
    fontFamily: FONTS.bold,
    fontSize: 20,
  },

  // NEW: bullets area (fixed inside screen)
  bulletsWrap: {
    gap: 14,
    paddingHorizontal: 16,
    marginVertical:34,
    // paddingTop: 10,
    // paddingBottom: 4,
  },

  bulletIcon: {
    width: 28,
    height: 28,
    // borderRadius: 14,
    // backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bulletTitle: { color: '#201E20', fontFamily: FONTS.semibold,fontSize:16 },
  bulletBody: { color: '#8D8E8F', marginTop: 2, fontFamily: FONTS.regular,fontSize:14,lineHeight:20 },
  separator: { height: 1, backgroundColor: '#EFEFEF', marginLeft: 42 },

  linkRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 0,
  },
  linkText: {
    color: '#201E20',
    textDecorationLine: 'underline',
    fontFamily: FONTS.regular,
    fontSize:16,
    lineHeight:24
  },

  footer: { paddingHorizontal: 16, paddingTop: 8 },
  cta: {
    marginVertical: -15,
    // marginHorizontal: 16,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontFamily: FONTS.semibold, fontSize: 16 },
  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: 32,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
  },
});
