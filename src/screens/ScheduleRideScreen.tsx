import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ScheduleRide'>;

const ITEM_H = 40;
const VISIBLE_ROWS = 5; // aesthetic padding for the wheel
const MINT = '#B9FBE7';

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

export default function ScheduleRideScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  const now = route.params?.initial ?? new Date();

  // --- data sources
  const dates = useMemo(() => {
    const arr: { label: string; value: Date }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const isToday = i === 0;
      const lab = new Intl.DateTimeFormat('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
      }).format(d);
      arr.push({ label: isToday ? 'Today' : lab, value: d });
    }
    return arr;
  }, [now]);

  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => `${i + 1}`), []);
  const minutes = useMemo(() => Array.from({ length: 12 }, (_, i) => pad(i * 5)), []); // step 5
  const ampm = ['AM', 'PM'];

  // --- initial indices
  const initHour12 = ((now.getHours() + 11) % 12) + 1; // 1..12
  const initMinIdx = Math.round(now.getMinutes() / 5) % 12;

  const [idxDate, setIdxDate] = useState(0);
  const [idxHour, setIdxHour] = useState(initHour12 - 1);
  const [idxMin, setIdxMin] = useState(initMinIdx);
  const [idxAP, setIdxAP] = useState(now.getHours() >= 12 ? 1 : 0);
  const [holdFunds, setHoldFunds] = useState(true);

  // --- build the final Date
  const selectedDate = useMemo(() => {
    const d = new Date(dates[idxDate].value);
    let h = idxHour + 1; // 1..12
    const m = (idxMin * 5) % 60;
    if (idxAP === 0) {
      if (h === 12) h = 0;          // 12AM -> 00
    } else {
      if (h !== 12) h = h + 12;     // PM except 12PM
    }
    d.setHours(h, m, 0, 0);
    return d;
  }, [dates, idxDate, idxHour, idxMin, idxAP]);

  // drop-off estimate (placeholder: +2h 30m)
  const dropOff = useMemo(() => {
    const t = new Date(selectedDate);
    t.setHours(t.getHours() + 2);
    t.setMinutes(t.getMinutes() + 30);
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(t);
  }, [selectedDate]);

  const confirm = () => {
    // route.params?.onPick?.(selectedDate);
    // navigation.goBack();
    navigation.navigate('FareOptions', {
      etaMinutes: 18,
      quotes: [
        { id: 'esc', tier: 'Escalade', price: 51, oldPrice: 85, seatText: 'Or Similar' },
        { id: 'prm', tier: 'Premium', price: 32, oldPrice: 55, seatText: 'Sedan X2' },
        { id: 'eco', tier: 'Economy', price: 43, oldPrice: 67, seatText: 'SUV X2' },
      ],
      payMethod: 'Card',
      onConfirm: (q, opts) => {
        console.log('Chosen quote:', q, opts);
        // continue to booking request…
      },
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
      {/* top bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.badge} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={16} color="#111" />
          <Text style={styles.badgeTxt}>Schedule a Ride</Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ color: '#111', fontWeight: '700' }}>Done</Text>
        </Pressable>
      </View>

      {/* big title */}
      <Text style={styles.bigTitle}>
        {new Intl.DateTimeFormat('en-US', {
          weekday: 'short', month: 'short', day: 'numeric',
        }).format(selectedDate)}
        {` · `}
        {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(selectedDate)}
      </Text>

      {/* wheel area */}
      <View style={styles.wheelsWrap}>
        <Wheel
          data={dates.map(d => d.label)}
          index={idxDate}
          onIndexChange={setIdxDate}
          width="44%"
        />
        <Wheel data={hours} index={idxHour} onIndexChange={setIdxHour} width="12%" />
        <Wheel data={minutes} index={idxMin} onIndexChange={setIdxMin} width="16%" />
        <Wheel data={ampm} index={idxAP} onIndexChange={setIdxAP} width="16%" />
      </View>

      {/* info rows */}
      <View style={styles.infoRow}>
        {/* <Ionicons name="location-outline" size={18} color="#111" /> */}
        <Image
          source={assets.images.dropoffIcon}// <-- **Direct require with correct path**
          style={{ width: '20', height: '20', resizeMode: 'contain', maxWidth: '100%' }}
        />


        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.infoTitle}>Estimated drop-off time</Text>
          <Text style={styles.infoSub}>Arrive at destination at approx. {dropOff}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        {/* <Ionicons name="reload-outline" size={18} color="#111" /> */}
        <Image
          source={assets.images.plansIcon}// <-- **Direct require with correct path**
          style={{ width: '20', height: '20', resizeMode: 'contain', maxWidth: '100%' }}
        />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.infoTitle}>Change of plans? No worries!</Text>
          <Text style={styles.infoSub}>Cancel or modify free of charge up to 1 hour before pickup</Text>
        </View>
      </View>

      {/* toggle pill */}
      <View style={styles.toggleCard}>
        {/* <Ionicons name="checkbox-outline" size={18} color="#111" /> */}
        <Image
          source={assets.images.squareIcon}// <-- **Direct require with correct path**
          style={{ width: '20', height: '20', resizeMode: 'contain', maxWidth: '100%' }}
        />
        <Text style={styles.toggleTxt}>Square hold funds and charge after drop-off</Text>
        <Ionicons name="information-circle-outline" size={16} color="#9AA0A6" />

      </View>

      {/* bottom CTA */}
      <Pressable style={styles.cta} onPress={confirm}>
        <Text style={styles.ctaText}>Check Fare</Text>
        <View style={styles.ctaIcon}>
          <AntDesign name="arrowright" size={18} color="#111" />
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

/* ---------- Wheel column ---------- */

function Wheel({
  data, index, onIndexChange, width,
}: {
  data: string[];
  index: number;
  onIndexChange: (i: number) => void;
  width: number | `${number}%` | string;
}) {
  const listRef = useRef<FlatList<string>>(null);

  // center padding
  const pad = (ITEM_H * (VISIBLE_ROWS - 1)) / 2;

  const onMomentumEnd = (e: any) => {
    const y = e.nativeEvent.contentOffset.y as number;
    const idx = Math.round(y / ITEM_H);
    if (idx !== index) onIndexChange(Math.max(0, Math.min(data.length - 1, idx)));
  };

  return (
    <View style={[styles.wheelCol, { width }]}>
      {/* highlight bar */}
      <View pointerEvents="none" style={styles.highlight} />
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(s, i) => `${s}-${i}`}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumEnd}
        contentContainerStyle={{ paddingVertical: pad }}
        getItemLayout={(_, i) => ({ length: ITEM_H, offset: ITEM_H * i, index: i })}
        initialScrollIndex={index}
        renderItem={({ item, index: i }) => (
          <View style={styles.item}>
            <Text style={[styles.itemTxt, i === index && styles.itemActive]}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 0, marginBottom: 0, marginTop : 7,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5,
    backgroundColor: '#F6F7F8', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: '#EEE',
  },
  badgeTxt: { color: '#111', fontWeight: '700', fontSize: 12 },

  bigTitle: { fontSize: 18, fontWeight: '700', color: '#111', paddingHorizontal: 16, marginVertical: 20, textAlign: 'center', },

  wheelsWrap: {
    flexDirection: 'row', alignItems: 'stretch', gap: 8, paddingHorizontal: 16, marginBottom: 104,
  },
  wheelCol: { height: ITEM_H * VISIBLE_ROWS, overflow: 'hidden', borderRadius: 8, borderWidth: 1, borderColor: '#EFEFEF' },
  highlight: {
    position: 'absolute', top: (ITEM_H * (VISIBLE_ROWS - 1)) / 2, height: ITEM_H,
    left: 0, right: 0, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EAEAEA',
    backgroundColor: ' #00000015',
  },
  item: { height: ITEM_H, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  itemTxt: { color: '#777' },
  itemActive: { color: '#111', fontWeight: '700' },

  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingHorizontal: 16, marginBottom: 10 },
  infoTitle: { color: '#111', fontWeight: '700' },
  infoSub: { color: '#666', marginTop: 2 },

  toggleCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 6, padding: 12,
    borderRadius: 20, borderWidth: 1, borderColor: '#EFEFEF', backgroundColor: MINT,
  },
  toggleTxt: { color: '#111', fontSize: 12, fontWeight: '400', flexShrink: 1, },

  cta: {
    marginTop: 16, marginHorizontal: 16, height: 48, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '400' },
  ctaIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: MINT, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 10, },
});
