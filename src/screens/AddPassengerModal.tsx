// src/screens/AddPassengerModal.tsx
import type { Dispatch, SetStateAction } from 'react';
import React, { useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BackHandler,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
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
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import assets from '../../assets';
import type { PassengerCounts, RootStackParamList } from '../navigation/types';
type Props = NativeStackScreenProps<RootStackParamList, 'AddPassenger'>;

const MINT = '#B9FBE7';

const SEATS = [
  {
    id: 'infantRear',
    title: 'Infant Rear Face',
    icon: require('../../assets/icons/child_one.png'),
  },
  {
    id: 'toddlerRear',
    title: 'Toddler Rear Face',
    icon: require('../../assets/icons/child_eight.png'),
  },
  {
    id: 'toddlerFront',
    title: 'Toddler Front Face',
    icon: require('../../assets/icons/child_seven.png'),
  },
  {
    id: 'boosterCarSeats',
    title: 'Booster Car Seats',
    icon: require('../../assets/icons/child_six.png'),
  },
  {
    id: 'regularFolded',
    title: 'Regular Folded',
    icon: require('../../assets/icons/child_five.png'),
  },
  {
    id: 'doubleStroller',
    title: 'Double Stroller',
    icon: require('../../assets/icons/child_four.png'),
  },
  {
    id: 'foldedOnShoulder',
    title: 'Folded on Shoulder',
    icon: require('../../assets/icons/child_three.png'),
  },
  {
    id: 'kidsPlaypen',
    title: 'Kids Playpen',
    icon: require('../../assets/icons/child_two.png'),
  },
  {
    id: 'carSeatBag',
    title: 'Car Seat Bag',
    icon: require('../../assets/icons/child_one.png'),
  },
];

export default function AddPassengerModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const seatListRef = useRef<FlatList>(null);

  const [adults, setAdults] = useState(route.params?.initial?.adults ?? 1);
  const [children, setChildren] = useState(
    route.params?.initial?.children ?? 1,
  );
  const [infants, setInfants] = useState(route.params?.initial?.infants ?? 1);
  const [seats, setSeats] = useState<Record<string, number>>(
    route.params?.initial?.seats ?? {
      infantRear: 0,
      toddlerRear: 0,
      toddlerFront: 0,
    },
  );

  const payload: PassengerCounts = useMemo(
    () => ({ adults, children, infants, seats }),
    [adults, children, infants, seats],
  );

  const change = (
    setter: Dispatch<SetStateAction<number>>,
    dir: -1 | 1,
    min = 0,
    max = 8,
  ) => setter(prev => Math.max(min, Math.min(max, prev + dir)));

  const changeSeat = (id: string, dir: -1 | 1) =>
    setSeats(cur => ({ ...cur, [id]: Math.max(0, (cur[id] ?? 0) + dir) }));

  const scrollToSeats = () =>
    seatListRef.current?.scrollToIndex({ index: 0, animated: true });

  const exit = (emit = true) => {
    if (emit) route.params?.onDone?.(payload); // persist counts to Trip
    navigation.goBack();
  };

  // Android hardware back → save + close
  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        exit(true);
        return true;
      });
      return () => sub.remove();
    }, [payload]),
  );

  return (
    <View style={styles.fill}>
      {/* DIM BACKDROP */}
      <Pressable style={styles.backdrop} onPress={() => exit(true)} />

      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
          <View style={styles.sheet}>
            {/* Top bar */}
            <View style={styles.topBar}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Schedule a Ride</Text>
              </View>
              <Pressable style={styles.close} onPress={() => exit(true)}>
                <Ionicons name="close" size={18} color="#111" />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={{ paddingBottom: 18 }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Add Passenger</Text>

              {/* Counters */}
              <View style={styles.block}>
                <Row
                  icon={
                    <Image
                      source={assets.images.adultIcon}
                      style={{ width: 20, height: 20, resizeMode: 'contain' }}
                    />
                  }
                  title="Adults"
                  subtitle="Ages 13 or above"
                  value={adults}
                  onMinus={() => change(setAdults, -1, 1)}
                  onPlus={() => change(setAdults, +1)}
                />
                <Separator />
                <Row
                  icon={
                    <Image
                      source={assets.images.childrenIcon}
                      style={{ width: 20, height: 20, resizeMode: 'contain' }}
                    />
                  }
                  title="Children"
                  subtitle="Ages 2 or 12"
                  value={children}
                  onMinus={() => change(setChildren, -1)}
                  onPlus={() => change(setChildren, +1)}
                />
                <Separator />
                <Row
                  icon={
                    <Image
                      source={assets.images.infantIcon}
                      style={{ width: 20, height: 20, resizeMode: 'contain' }}
                    />
                  }
                  title="Infants"
                  subtitle="Under 2"
                  value={infants}
                  onMinus={() => change(setInfants, -1)}
                  onPlus={() => change(setInfants, +1)}
                />
              </View>

              {/* Child seats */}
              <View style={{ marginTop: 14 }}>
                <View style={styles.freePill}>
                  <Text style={styles.freeText}>Free</Text>
                </View>

                <View style={styles.seatHeader}>
                  <Text style={styles.seatTitle}>
                    Add Child Car Seat &amp; Stroller
                  </Text>
                  <Pressable
                    onPress={() => navigation.navigate('ChildSeatInfo')}
                  >
                    <Text style={styles.link}>Found right seat</Text>
                  </Pressable>
                </View>

                <FlatList
                  ref={seatListRef}
                  data={SEATS}
                  keyExtractor={it => it.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 4,
                    paddingTop: 8,
                  }}
                  renderItem={({ item }) => (
                    <SeatCard
                      title={item.title}
                      value={seats[item.id] ?? 0}
                      onMinus={() => changeSeat(item.id, -1)}
                      onPlus={() => changeSeat(item.id, +1)}
                      icon={
                        <Image
                          source={item.icon}
                          style={{
                            width: 70,
                            height: 70,
                            resizeMode: 'contain',
                          }}
                        />
                      }
                    />
                  )}
                />
              </View>
            </ScrollView>

            {/* Bottom actions */}
            <View style={styles.bottomRow}>
              <Pressable
                style={styles.luggageBtn}
                onPress={() => {
                  // persist passenger counts first
                  route.params?.onDone?.(payload);
                  // replace parent with AddLuggage (not overlay)
                  navigation.replace('AddLuggage', {
                    initial: route.params?.luggage ?? [],
                    start: route.params?.start,
                    dest: route.params?.dest,
                    onDone: items => route.params?.onEditLuggage?.(items),
                  });
                }}
              >
                <Text style={styles.luggageText}>+ Add Luggage</Text>
                <View style={styles.mintCircle}>
                  <AntDesign name="arrowright" size={18} color="#111" />
                </View>
              </Pressable>

              <Pressable onPress={() => exit(true)} hitSlop={10}>
                <Text style={styles.skip}>Skip</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* subcomponents */
function Row({
  icon,
  title,
  subtitle,
  value,
  onMinus,
  onPlus,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
      <Stepper value={value} onMinus={onMinus} onPlus={onPlus} />
    </View>
  );
}
function Stepper({
  value,
  onMinus,
  onPlus,
}: {
  value: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable style={styles.stepBtn} onPress={onMinus}>
        <AntDesign name="minus" size={14} color="#111" />
      </Pressable>
      <Text style={styles.stepVal}>{value}</Text>
      <Pressable style={styles.stepBtn} onPress={onPlus}>
        <AntDesign name="plus" size={14} color="#111" />
      </Pressable>
    </View>
  );
}
function SeatCard({
  title,
  icon,
  value,
  onMinus,
  onPlus,
}: {
  title: string;
  icon: React.ReactNode;
  value: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={styles.seatCard}>
      <View style={{ alignItems: 'center', marginBottom: 8 }}>{icon}</View>
      <Text style={styles.seatTitleSmall} numberOfLines={2}>
        {title}
      </Text>
      <View style={styles.seatStepper}>
        <Pressable style={styles.seatBtn} onPress={onMinus}>
          <AntDesign name="minus" size={12} color="#111" />
        </Pressable>
        <Text style={styles.seatVal}>{value}</Text>
        <Pressable style={styles.seatBtn} onPress={onPlus}>
          <AntDesign name="plus" size={12} color="#111" />
        </Pressable>
      </View>
    </View>
  );
}

/* styles */
const styles = StyleSheet.create({
  fill: { flex: 1 },
  // DIMMED BACKDROP
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  sheetWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F6F7F8',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  badgeText: { color: '#444', fontWeight: '600', fontSize: 12 },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: { fontWeight: '700', color: '#111', fontSize: 16, marginBottom: 10 },

  block: {
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowTitle: { color: '#111', fontWeight: '700' },
  rowSub: { color: '#777', fontSize: 12, marginTop: 2 },
  separator: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 8 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F6F7F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  stepVal: { width: 20, textAlign: 'center', color: '#111', fontWeight: '700' },

  freePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 6,
  },
  freeText: { color: '#16a34a', fontWeight: '700', fontSize: 12 },
  seatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seatTitle: { color: '#111', fontWeight: '700' },
  link: { color: '#4F8EF7', fontWeight: '600' },

  seatCard: {
    width: 160,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 12,
    marginRight: 10,
  },
  seatTitleSmall: { color: '#111', fontWeight: '700' },
  seatStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  seatBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F6F7F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  seatVal: { width: 18, textAlign: 'center', color: '#111', fontWeight: '700' },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  luggageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 48,
    borderRadius: 28,
    backgroundColor: '#111',
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 14,
  },
  luggageText: { color: '#fff', fontWeight: '700' },
  mintCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
  skip: { color: '#111', fontWeight: '700' },
});
function Separator() {
  return <View style={styles.separator} />;
}
