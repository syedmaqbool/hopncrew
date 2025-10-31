// src/screens/AddPassengerModal.tsx
import type { Dispatch, SetStateAction } from 'react';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BackHandler,
  FlatList,
  Image,
  ActivityIndicator,
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
import assets from '../../assets';
import {
  getChildSeatTypes,
  type ChildSeatType,
  getPassengerTypes,
  type PassengerType,
} from '../services/app';
import type { PassengerCounts, RootStackParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPassenger'>;

const MINT = '#B9FBE7';

export default function AddPassengerModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const seatListRef = useRef<FlatList>(null);

  const [isLoading, setIsLoading] = useState(true);

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

  // ---------------- Passenger types (must be declared BEFORE use) ----------------
  const [passengerTypes, setPassengerTypes] = useState<PassengerType[]>([]);
  const [loadingPassengerTypes, setLoadingPassengerTypes] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoadingPassengerTypes(true);
        const list = await getPassengerTypes();
        setPassengerTypes(Array.isArray(list) && list.length > 0 ? list : []);
      } catch {
        setPassengerTypes([]);
        setLoadingPassengerTypes(false);
      } finally {
        setLoadingPassengerTypes(false);
      }
    })();
  }, []);

  // ---------------- Counts & seats ----------------
  const [paxCounts, setPaxCounts] = useState<Record<string, number>>({});
  const [seats, setSeats] = useState<Record<string, number>>(
    route.params?.initial?.seats ?? {
      infantRear: 0,
      toddlerRear: 0,
      toddlerFront: 0,
    },
  );

  // Fetch child seat types from API
  const [seatTypes, setSeatTypes] = useState<ChildSeatType[]>([]);
  const [loadingSeatTypes, setLoadingSeatTypes] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoadingSeatTypes(true);
        const list = await getChildSeatTypes();
        setSeatTypes(list);
      } catch {
        setSeatTypes([]);
      } finally {
        setLoadingSeatTypes(false);
      }
    })();
  }, []);

  // Safe helper: choose a passenger type by keyword
  const chooseType = (keywords: string[], fallbackIndex: number) => {
    const list = passengerTypes ?? [];
    const lowered = keywords.map(k => k.toLowerCase());
    const found = list.find(t =>
      lowered.some(k => (t.label || '').toLowerCase().includes(k)),
    );
    return found ?? list[fallbackIndex] ?? null;
  };

  const typeAdults = useMemo(() => chooseType(['adult'], 0), [passengerTypes]);
  const typeChildren = useMemo(
    () => chooseType(['child', 'children', 'kid'], 1),
    [passengerTypes],
  );
  const typeInfants = useMemo(
    () => chooseType(['infant', 'baby'], 2),
    [passengerTypes],
  );

  const adults = useMemo(
    () => (typeAdults ? paxCounts[String(typeAdults.id)] ?? 0 : 0),
    [typeAdults, paxCounts],
  );
  const children = useMemo(
    () => (typeChildren ? paxCounts[String(typeChildren.id)] ?? 0 : 0),
    [typeChildren, paxCounts],
  );
  const infants = useMemo(
    () => (typeInfants ? paxCounts[String(typeInfants.id)] ?? 0 : 0),
    [typeInfants, paxCounts],
  );

  const payload: PassengerCounts | any = useMemo(
    () => ({ adults, children, infants, seats, passengerTypes: paxCounts }),
    [adults, children, infants, seats, paxCounts],
  );

  // Seed initial dynamic counts from route.params.initial once types are loaded
  useEffect(() => {
    if (!passengerTypes || passengerTypes.length === 0) return;
    setPaxCounts(prev => {
      if (Object.keys(prev).length > 0) return prev;
      const init = route.params?.initial;
      const map: Record<string, number> = {};
      const lower = (s?: string) => (s || '').toLowerCase();
      const findType = (keys: string[]) =>
        passengerTypes.find(t => keys.some(k => lower(t.label).includes(k)));
      const tA = findType(['adult']);
      const tC = findType(['child', 'children', 'kid']);
      const tI = findType(['infant', 'baby']);
      passengerTypes.forEach(t => (map[String(t.id)] = 0));
      if (tA) map[String(tA.id)] = init?.adults ?? 1;
      if (tC) map[String(tC.id)] = init?.children ?? 0;
      if (tI) map[String(tI.id)] = init?.infants ?? 0;
      return map;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passengerTypes]);

  const changeSeat = (id: string, dir: -1 | 1) =>
    setSeats(cur => ({ ...cur, [id]: Math.max(0, (cur[id] ?? 0) + dir) }));

  const scrollToSeats = () =>
    seatListRef.current?.scrollToIndex({ index: 0, animated: true });

  const exit = (emit = true) => {
    if (emit) route.params?.onDone?.(payload);
    navigation.goBack();
  };

  const waitForKeyboardHide = () =>
    new Promise<void>(resolve => {
      const hideEvt =
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
      let done = false;
      const sub = Keyboard.addListener(hideEvt, () => {
        if (!done) {
          done = true;
          sub.remove();
          resolve();
        }
      });
      setTimeout(() => {
        if (!done) {
          done = true;
          sub.remove();
          resolve();
        }
      }, 80);
    });

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
              {loadingPassengerTypes ? (
                <View
                  style={{
                    height: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <ActivityIndicator size="large" color={'#000'} />
                </View>
              ) : (
                passengerTypes.map((pt, idx) => {
                  const idStr = String(pt.id);
                  const value = paxCounts[idStr] ?? 0;
                  const fallbackIcon = (() => {
                    const l = (pt.label || '').toLowerCase();
                    if (l.includes('adult')) return assets.images.adultIcon;
                    if (l.includes('infant') || l.includes('baby'))
                      return assets.images.infantIcon;
                    if (l.includes('child') || l.includes('kid'))
                      return assets.images.childrenIcon;
                    return assets.images.passengerIcon;
                  })();
                  return (
                    <View key={idStr}>
                      <Row
                        icon={
                          pt.image_url ? (
                            <Image
                              source={{ uri: pt.image_url }}
                              style={{
                                width: 40,
                                height: 40,
                                resizeMode: 'contain',
                              }}
                            />
                          ) : (
                            <Image
                              source={fallbackIcon}
                              style={{
                                width: 40,
                                height: 40,
                                resizeMode: 'contain',
                              }}
                            />
                          )
                        }
                        title={pt.label}
                        subtitle={pt.description ?? ''}
                        value={value}
                        onMinus={() =>
                          setPaxCounts(cur => ({
                            ...cur,
                            [idStr]: Math.max(0, (cur[idStr] ?? 0) - 1),
                          }))
                        }
                        onPlus={() =>
                          setPaxCounts(cur => ({
                            ...cur,
                            [idStr]: Math.min(8, (cur[idStr] ?? 0) + 1),
                          }))
                        }
                      />
                      {idx < passengerTypes.length - 1 && <Separator />}
                    </View>
                  );
                })
              )}
            </View>

            {/* Child seats */}
            <View style={{ marginTop: 14 }}>
              <View style={styles.freePill}>
                <Text style={styles.freeText}>Free</Text>
              </View>

              <View style={styles.seatHeader}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
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
                data={seatTypes}
                keyExtractor={it => String(it.id)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 4,
                  paddingTop: 8,
                }}
                renderItem={({ item }) => {
                  const idStr = String(item.id);
                  const url = item.image_url;
                  return (
                    <SeatCard
                      title={item.label}
                      value={seats[idStr] ?? 0}
                      onMinus={() => changeSeat(idStr, -1)}
                      onPlus={() => changeSeat(idStr, +1)}
                      icon={
                        url ? (
                          <Image
                            source={{ uri: url }}
                            style={{
                              width: 70,
                              height: 70,
                              resizeMode: 'contain',
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              width: 70,
                              height: 70,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 12,
                              backgroundColor: '#F4F4F5',
                            }}
                          >
                            <Text
                              style={{
                                color: '#111',
                                fontSize: 28,
                                fontWeight: '800',
                              }}
                            >
                              ?
                            </Text>
                          </View>
                        )
                      }
                    />
                  );
                }}
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
                route.params?.onDone?.(payload);
                Keyboard.dismiss();
                await waitForKeyboardHide();
                try {
                  // @ts-ignore
                  keyboardTranslate.stopAnimation?.();
                } catch {}
                keyboardTranslate.setValue(0);
                await new Promise<void>(resolve => {
                  Animated.timing(slide, {
                    toValue: 1,
                    duration: 220,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                  }).start(() => resolve());
                });
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
          justifyContent: 'space-between',
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
  badgeText: { color: '#444', fontSize: 12, fontFamily: 'BiennaleSemiBold' },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: { color: '#111', fontSize: 16, marginBottom: 10, fontFamily: 'BiennaleBold' },

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
  rowTitle: { color: '#111', fontFamily: 'BiennaleBold' },
  rowSub: { color: '#777', fontSize: 12, marginTop: 2, width: '90%', fontFamily: 'BiennaleRegular' },
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
  stepBtnPlus: { backgroundColor: '#111', borderColor: '#111' },
  stepVal: { width: 20, textAlign: 'center', color: '#111', fontFamily: 'BiennaleBold' },

  freePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 6,
  },
  freeText: { color: '#16a34a', fontSize: 12, fontFamily: 'BiennaleBold' },
  seatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seatTitle: { color: '#111', fontFamily: 'BiennaleRegular' },
  link: { color: '#6086C1', fontFamily: 'BiennaleSemiBold' },

  seatCard: {
    width: 180,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CFCDCD',
    padding: 12,
    marginRight: 10,
  },
  seatTitleSmall: { color: '#111', width: 80, fontFamily: 'BiennaleRegular' },
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
  seatBtnPlus: { backgroundColor: '#111', borderColor: '#111' },
  seatBtnMinus: { backgroundColor: '#F0F2F3', borderColor: '#EEE' },
  seatVal: {
    fontSize: 24,
    width: 18,
    textAlign: 'center',
    color: '#111',
    fontFamily: 'BiennaleBold',
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
  luggageText: { color: '#fff', fontFamily: 'BiennaleBold' },
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
  skip: { color: '#111', fontFamily: 'BiennaleBold' },
});
function Separator() {
  return <View style={styles.separator} />;
}
