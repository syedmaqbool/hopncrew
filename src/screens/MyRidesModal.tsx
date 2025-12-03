// src/screens/MyRidesScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import assets from '../../assets';
import { FONTS } from '../../src/theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'MyRides'>;

type Ride = {
  id: string;
  when: string;
  fare: number;
  from: string;
  to: string;
  mapThumb?: any;
};

const MOCK: Record<'Upcoming' | 'Completed' | 'Canceled', Ride[]> = {
  Upcoming: [
    {
      id: 'u1',
      when: 'Today, 5:19 PM',
      fare: 30.26,
      from: 'Toronto Pearson Airport - T 1',
      to: 'Hamill Avenue San Diego, CA 929',
    },
    {
      id: 'u2',
      when: 'May 14, 6:00 PM',
      fare: 46.24,
      from: 'Toronto Pearson Airport - T 1',
      to: 'Hamill Avenue San Diego, CA 929',
    },
    {
      id: 'u3',
      when: 'May 13, 8:24 AM',
      fare: 16.21,
      from: 'Toronto Pearson Airport - T 1',
      to: 'Hamill Avenue San Diego, CA 929',
    },
  ],
  Completed: [
    {
      id: 'c1',
      when: 'Apr 21, 9:05 AM',
      fare: 27.1,
      from: 'Toronto Pearson Airport - T 3',
      to: 'Bloor St W, Toronto, ON',
    },
    {
      id: 'c2',
      when: 'Apr 18, 4:10 PM',
      fare: 58.75,
      from: 'Union Station',
      to: 'YYZ Terminal 1',
    },
  ],
  Canceled: [
    {
      id: 'x1',
      when: 'Mar 3, 10:00 AM',
      fare: 0,
      from: 'Downtown',
      to: 'YYZ',
    },
  ],
};

export default function MyRidesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'Upcoming' | 'Completed' | 'Canceled'>(
    'Upcoming',
  );

  const data = useMemo(() => MOCK[tab], [tab]);
  const openMenu = () => navigation.goBack();

  return (
    <View style={{ flex: 1 }}>
      {/* MAP BACKGROUND */}
      <Image
        source={require('../../assets/backgrounds/signin.png')}
        style={styles.mapBg}
        resizeMode="cover"
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.headerRow}>
         <Pressable style={styles.menuBtn} onPress={openMenu}>
            <Image
            source={assets.images.hamIcon}
            style={{ width: 48, height: 48, borderRadius: 20 }}
          />
          </Pressable>

          <Text style={styles.headerTitle}>My Rides</Text>

          <View style={{ width: 40 }} />
        </View>

        {/* WHITE PANEL */}
        <View style={styles.whitePanel}>
          {/* SEGMENTED CONTROL */}
          <View style={styles.segmentWrap}>
            {(['Upcoming', 'Completed', 'Canceled'] as const).map(s => {
              const active = tab === s;
              return (
                <Pressable
                  key={s}
                  onPress={() => setTab(s)}
                  style={[styles.segment, active && styles.segmentActive]}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      active && styles.segmentTextActive,
                    ]}
                  >
                    {s}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* LIST */}
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
            renderItem={({ item }) => (
    <RideCard
      ride={item}
      onPress={() =>
        navigation.navigate('RideDetails', {
          ride: {
            id: item.id,
            status: tab,                // 'Upcoming' | 'Completed' | 'Canceled'
            whenLabel: item.when,
            from: item.from,
            to: item.to,
            distanceKm: 12.5,          // put real value if you have
            timeLabel: '30 - 40 min',  // put real value if you have
            fare: item.fare,
            driver: {
              name: 'Jonas',
              rating: 4.2,
              carPlate: 'ERS 8579',
              carModel: 'Toyota Camry',
            },
          },
          onCancel: (id: string) => {
            console.log('cancel ride', id);
          },
        })
      }
    />
  )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ---------------- Ride Card ---------------- */

function RideCard({ ride,onPress }: { ride: Ride,onPress: () => void; }) {
  return (
    <Pressable onPress={onPress}>
    <View style={styles.card}>
      {/* Map area */}
      <View style={styles.mapWrapper}>
        <Image
          source={assets.images.rideMap}
          style={styles.mapImage}
          resizeMode="cover"
        />

        {/* top white bar (when + fare) */}
        <View style={styles.cardHeader}>
          <Text style={styles.when}>{ride.when}</Text>
          <Text style={styles.fare}>
            Fare : <Text style={styles.fareStrong}>${ride.fare.toFixed(2)}</Text>
          </Text>
        </View>
      </View>

      {/* bottom info */}
      <View style={styles.cardBottom}>
        <View style={styles.iconColumn}>
          {/* <View style={styles.dotOuter}>
            <View style={styles.dotInner} />
          </View> */}
          <Image source={require('../../assets/icons/marker-dot-icon.png')} alt='marker-dot-icon' style={{width:16,height:16}} />
          <View style={styles.dashedLine} />
          {/* <Ionicons name="location" size={18} color="#201E20" /> */}
          <Image source={require('../../assets/icons/drop-off-dot.png')} alt='drop-off-dot' style={{width:16,height:19}} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.placeTop}>{ride.from}</Text>
          <Text style={styles.placeBottom}>{ride.to}</Text>
        </View>
      </View>
    </View>
    </Pressable>
  );
}

/* ---------------- styles ---------------- */

const styles = StyleSheet.create({
  mapBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '48%',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    justifyContent: 'flex-start',
    gap:16
  },
  menuBtn: {
    width: 48,
    height: 48,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 18,
    lineHeight:32,
    fontFamily: FONTS.regular,
    color: '#201E20',
  },

  whitePanel: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  segmentWrap: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 32,
    borderWidth: .5,
    borderColor: '#8D8E8F',
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
  },
  segment: {
    flex: 1,
    height: 54,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#111111',
    fontSize: 15,
  },
  segmentText: {
    fontFamily: FONTS.semibold,
    color: '#201E20',
    fontSize: 15,
  },
  segmentTextActive: {
    color: '#FCFCFC',
    fontFamily: FONTS.semibold,
    fontSize: 15,
  },

  card: {
    borderRadius: 26,
    backgroundColor: '#F5F5F7',
    marginBottom: 16,
    overflow: 'hidden',
  },
  mapWrapper: {
    height: 170,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  cardHeader: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
    height:50,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  when: {
    fontFamily: FONTS.regular,
    color: '#201E20',
    fontSize: 16,
  },
  fare: {
    fontFamily: FONTS.regular,
    color: '#8D8E8F',
    fontSize: 16,
  },
  fareStrong: {
    fontFamily: FONTS.semibold,
    color: '#201E20',
    fontSize: 18
  },

  cardBottom: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#EFEFEF',
  },
  iconColumn: {
    width: 26,
    alignItems: 'center',
    marginRight: 10,
  },
  dotOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#201E20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#201E20',
  },
  dashedLine: {
    width: 1,
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#C4C4C4',
    marginVertical: 8,
  },
  placeTop: {
    fontFamily: FONTS.regular,
    color: '#201E20',
    fontSize: 16,
    marginBottom: 8,
  },
  placeBottom: {
    fontFamily: FONTS.regular,
    color: '#201E20',
    fontSize: 16,
  },
});
