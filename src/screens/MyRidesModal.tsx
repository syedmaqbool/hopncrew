import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, FlatList, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import assets from '../../assets';
import { FONTS } from '../../src/theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'MyRides'>;

type Ride = {
  id: string;
  when: string;                  // "Today, 5:19 PM"
  fare: number;                  // 30.26
  from: string;                  // "Toronto Pearson Airport - T1"
  to: string;                    // "Hamill Avenue San Diego, CA 929"
  mapThumb?: any;                // require('...') if you have a local image
};

const MINT = '#B9FBE7';

const MOCK: Record<'Upcoming'|'Completed'|'Canceled', Ride[]> = {
  Upcoming: [
    { id: 'u1', when: 'Today, 5:19 PM', fare: 30.26, from: 'Toronto Pearson Airport - T1', to: 'Hamill Avenue San Diego, CA 929' },
    { id: 'u2', when: 'May 14, 6:00 PM', fare: 46.24, from: 'Toronto Pearson Airport - T1', to: 'Hamill Avenue San Diego, CA 929' },
    { id: 'u3', when: 'May 13, 8:24 AM', fare: 16.21, from: 'Toronto Pearson Airport - T1', to: 'Hamill Avenue San Diego, CA 929' },
  ],
  Completed: [
    { id: 'c1', when: 'Apr 21, 9:05 AM', fare: 27.10, from: 'Toronto Pearson Airport - T3', to: 'Bloor St W, Toronto, ON' },
    { id: 'c2', when: 'Apr 18, 4:10 PM', fare: 58.75, from: 'Union Station', to: 'YYZ Terminal 1' },
  ],
  Canceled: [
    { id: 'x1', when: 'Mar 3, 10:00 AM', fare: 0, from: 'Downtown', to: 'YYZ' },
  ],
};

export default function MyRidesModal({ navigation }: Props) {
  const [tab, setTab] = useState<'Upcoming'|'Completed'|'Canceled'>('Upcoming');

  const data = useMemo(() => MOCK[tab], [tab]);

  return (
    <View style={styles.fill}>
      {/* Tap outside to dismiss */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      <SafeAreaView style={styles.sheetWrap} edges={['bottom']}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={18} color="#111" />
            </Pressable>
            <Text style={styles.headerTitle}>My Rides</Text>
            <View style={{ width: 34 }} />
          </View>

          {/* Segmented control */}
          <View style={styles.segmentWrap}>
            {(['Upcoming','Completed','Canceled'] as const).map(s => {
              const active = tab === s;
              return (
                <Pressable key={s} onPress={() => setTab(s)} style={[styles.segment, active && styles.segmentActive]}>
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{s}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Ride list */}
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            renderItem={({ item }) => <RideCard ride={item} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function RideCard({ ride }: { ride: Ride }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.when}>{ride.when}</Text>
        <Text style={styles.fare}>Fare: <Text style={styles.fareStrong}>${ride.fare.toFixed(2)}</Text></Text>
      </View>

      {/* Map thumbnail (placeholder box; drop your image if you have one) */}
      <View style={styles.mapThumb}>
        <Image source={assets.images.rideMap} style={{width:'100%',height:'100%', borderRadius: 8}} resizeMode="cover" />
      </View>

      {/* From / To */}
      <View style={styles.row}>
        <Ionicons name="location-outline" size={16} color="#6C7075" />
        <Text style={styles.place}>{ride.from}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Ionicons name="pin-outline" size={16} color="#6C7075" />
        <Text style={styles.place}>{ride.to}</Text>
      </View>
    </View>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },

  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4,
  },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#EEE', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, color: '#111', fontFamily: FONTS.bold },

  segmentWrap: {
    marginHorizontal: 16, marginTop: 10, marginBottom: 6, borderColor: '#EFEFEF', borderWidth: 1,
    borderRadius: 20, backgroundColor: '#Fff', padding: 4,
    flexDirection: 'row', gap: 6,
  },
  segment: {
    flex: 1, height: 36, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  segmentActive: { backgroundColor: '#111' },
  segmentText: { color: '#111', fontFamily: FONTS.bold },
  segmentTextActive: { color: '#fff' },

  card: {
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    borderWidth: 1, borderColor: '#EFEFEF',
    paddingHorizontal: 0,
    marginBottom: 12,
    position: 'relative',
    // shadow for iOS
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    // elevation for Android
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 15, paddingVertical: 10,
     position: 'absolute', top: 5, left: 4, right: 0, backgroundColor: '#fff', zIndex: 10, width: '97%',
      marginLeft: 'auto', marginRight : 'auto', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1, },
  when: { color: '#111', fontFamily: FONTS.regular },
  fare: { color: '#6C7075', fontFamily: FONTS.semibold },
  fareStrong: { color: '#111', fontFamily: FONTS.bold },

  mapThumb: {
    height: 180, borderRadius: 20, backgroundColor: '#EDEFF1', marginBottom: 10,
  },
  mapBar:{
    borderRadius: 20,
  },


  row: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10,   },
  place: { color: '#111', flex: 1 },
  divider: { height: 1, backgroundColor: '#EFEFEF' },
});
