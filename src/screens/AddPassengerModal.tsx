// src/screens/AddPassengerModal.tsx
import type { Dispatch, SetStateAction } from 'react';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BackHandler,
  FlatList,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  InteractionManager,
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
import Icon from 'react-native-vector-icons/Ionicons';
type Props = NativeStackScreenProps<RootStackParamList, 'AddPassenger'>;

const MINT = '#B9FBE7';

const SEATS = [
  {
    id: 'infantRear',
    title: 'Infant Rear Face',
    icon: require('../../assets/icons/child_nine.png'),
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

  const slide = useRef(new Animated.Value(1)).current; // 1 -> off, 0 -> on
  const keyboardTranslate = useRef(new Animated.Value(0)).current; // negative on kb
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [slide]);

  const slideY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 999],
  });

  useEffect(() => {
    const showEvt =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const s = Keyboard.addListener(showEvt, e => {
      const h = e?.endCoordinates?.height ?? 0;
      Animated.timing(keyboardTranslate, {
        toValue: -h,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
    const h = Keyboard.addListener(hideEvt, () => {
      Animated.timing(keyboardTranslate, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
    return () => {
      s.remove();
      h.remove();
    };
  }, [keyboardTranslate]);

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

  const payload: PassengerCounts | any = useMemo(
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

  // Ensure keyboard is fully hidden before proceeding with close animation
  const waitForKeyboardHide = () =>
    new Promise<void>(resolve => {
      const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
      let done = false;
      const sub = Keyboard.addListener(hideEvt, () => {
        if (!done) {
          done = true;
          sub.remove();
          resolve();
        }
      });
      // Fallback in case keyboard is already hidden
      setTimeout(() => {
        if (!done) {
          done = true;
          sub.remove();
          resolve();
        }
      }, 80);
    });

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

      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [
                { translateY: Animated.add(slideY, keyboardTranslate) },
              ],
            },
          ]}
        >
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
                    style={{ width: 40, height: 40, resizeMode: 'contain' }}
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
                    style={{ width: 40, height: 40, resizeMode: 'contain' }}
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
                    style={{ width: 40, height: 40, resizeMode: 'contain' }}
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
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Text style={styles.seatTitle}>
                    Add Child Car Seat &amp; Stroller
                  </Text>
                  <Image
                    source={assets.images.passengerIcon}
                    style={{ width: 30, height: 30, resizeMode: 'contain' }}
                  />
                </View>
                <Pressable onPress={() => navigation.navigate('ChildSeatInfo')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={styles.link}>Found right seat </Text>
                    <Icon name="chevron-forward" size={16} color="#6086C1" />
                  </View>
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
              onPress={async () => {
                if (isNavigatingRef.current) return;
                isNavigatingRef.current = true;
                // Persist passenger counts first
                route.params?.onDone?.(payload);
                // Dismiss keyboard and wait briefly for it to hide (avoids jitter)
                Keyboard.dismiss();
                await waitForKeyboardHide();
                // Ensure keyboard translation is reset before closing animation
                try {
                  // @ts-ignore stopAnimation exists on Animated.Value in runtime
                  keyboardTranslate.stopAnimation?.();
                } catch {}
                keyboardTranslate.setValue(0);
                // Slide this sheet down fully BEFORE mounting the next modal
                await new Promise<void>(resolve => {
                  Animated.timing(slide, {
                    toValue: 1,
                    duration: 220,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                  }).start(() => resolve());
                });
                // After animations/interactions settle, replace with AddLuggage
                InteractionManager.runAfterInteractions(() => {
                    navigation.replace('AddLuggage', {
                      initial: route.params?.luggage ?? [],
                      start: route.params?.start,
                      dest: route.params?.dest,
                      when: route.params?.when,
                      onDone: items => route.params?.onEditLuggage?.(items),
                    });
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
        </Animated.View>
      </SafeAreaView>
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
      <Pressable style={[styles.stepBtn, styles.stepBtnPlus]} onPress={onPlus}>
        <AntDesign name="plus" size={14} color="#fff" />
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 3,
          padding: 0,
        }}
      >
        <Text style={styles.seatTitleSmall} numberOfLines={2}>
          {title}
        </Text>
        <View style={{ marginHorizontal: -6 }}>{icon}</View>
      </View>
      <View style={styles.seatStepper}>
        <Pressable
          style={[styles.seatBtn, styles.seatBtnMinus]}
          onPress={onMinus}
        >
          <AntDesign name="minus" size={12} color="#111" />
        </Pressable>
        <Text style={styles.seatVal}>{value}</Text>
        <Pressable
          style={[styles.seatBtn, styles.seatBtnPlus]}
          onPress={onPlus}
        >
          <AntDesign name="plus" size={12} color="#fff" />
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
  stepBtnPlus: {
    backgroundColor: '#111',
    borderColor: '#111',
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
  seatTitle: { color: '#111', fontWeight: '400' },
  link: { color: '#6086C1', fontWeight: '600' },

  seatCard: {
    width: 160,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CFCDCD',
    padding: 12,
    marginRight: 10,
  },
  seatTitleSmall: {
    color: '#111',
    fontWeight: '400',
    width: 80,
  },
  seatStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  seatBtn: {
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: '#F6F7F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  seatBtnPlus: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  seatBtnMinus: {
    backgroundColor: '#F0F2F3',
    borderColor: '#EEE',
  },
  seatVal: {
    fontSize: 24,
    width: 18,
    textAlign: 'center',
    color: '#111',
    fontWeight: '700',
  },

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
