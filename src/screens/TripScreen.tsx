// src/screens/TripScreen.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import {
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import assets from '../../assets';
import type {
  Destination,
  LuggageItem,
  PassengerCounts,
  RootStackParamList,
} from '../navigation/types';
import { summarizeLuggage } from '../utils/luggage';

type Props = NativeStackScreenProps<RootStackParamList, 'Trip'>;

const MINT = '#B9FBE7';
const BG = '#F6F7F8';
const BORDER = '#ECEDEE';
const TEXT = '#111';
const MUTED = '#9AA0A6';

const DEFAULT_PAX: PassengerCounts = {
  adults: 1,
  children: 0,
  infants: 0,
  seats: { infantRear: 0, toddlerRear: 0, toddlerFront: 0 },
};

export default function TripScreen({ navigation, route }: Props) {
  // Ensure Android back navigates to Home instead of exiting
  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (navigation.canGoBack()) {
          // navigation.goBack();
          navigation.replace('App');
        } else {
          navigation.replace('App');
        }
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );
  // ---------- Trip state that persists across modals ----------
  const [start, setStart] = useState<Destination | null>(
    route.params?.start ?? null,
  );
  const [dest, setDest] = useState<Destination | null>(
    route.params?.dest ?? null,
  );
  const [setOnPin, setSetOnPin] = useState(false);
  const [when, setWhen] = useState<Date | null>(route.params?.when ?? null);

  const [passengers, setPassengers] = useState<PassengerCounts>(DEFAULT_PAX);
  const [luggage, setLuggage] = useState<LuggageItem[]>([]);
  const [blocker, setBlocker] = useState<{
    title: string;
    message: string;
  } | null>(null);

  // ---------- derived text for the “chip” ----------
  const { totalPassengers, totalSeats, chipText } = useMemo(() => {
    const totalP = passengers.adults + passengers.children + passengers.infants;
    const totalS = Object.values(passengers.seats || {}).reduce(
      (a, b) => a + (b || 0),
      0,
    );
    const p = `${totalP} passenger${totalP !== 1 ? 's' : ''}`;
    const s = totalS > 0 ? ` · ${totalS} seat${totalS !== 1 ? 's' : ''}` : '';
    return { totalPassengers: totalP, totalSeats: totalS, chipText: p + s };
  }, [passengers]);

  // ---------- navigation helpers ----------
  const openPlaces = (which: 'start' | 'dest') => {
    navigation.navigate('PlaceSearch', {
      onPick: d => {
        which === 'start' ? setStart(d) : setDest(d);
      },
    });
  };

  const openAddPassenger = () => {
    // Open the passenger modal. It will:
    //  - save counts on close via `onDone`
    //  - when user chooses “+ Add Luggage”, it REPLACES itself with AddLuggage
    //    and that will callback `onDone` to update luggage here.
    navigation.navigate('AddPassenger', {
      initial: passengers,
      luggage, // pass current luggage so the modal can show/edit
      start: start ?? undefined,
      dest: dest ?? undefined,
      when: when ?? undefined,
      onDone: (pax: PassengerCounts) => setPassengers(pax),
      onEditLuggage: (items: LuggageItem[]) => setLuggage(items),
    });
  };

  const onAddPassengerPress = () => {
    if (!start || !dest) {
      const title =
        !dest && start
          ? 'Select Destination'
          : !start && dest
          ? 'Select Start Location'
          : 'Select Start and Destination';
      const message =
        !dest && start
          ? 'Please select your destination first.'
          : !start && dest
          ? 'Please select your start location first.'
          : 'Please select both start and destination before adding passengers.';
      setBlocker({ title, message });
      return;
    }
    openAddPassenger();
  };
  const whenText = useMemo(() => {
    if (!when) return null;
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(when);
    } catch (e) {
      return String(when);
    }
  }, [when]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            style={styles.hBtn}
            onPress={() => navigation.replace('App')}
          >
            <Ionicons name="close" size={18} color={TEXT} />
          </Pressable>
          <Text style={styles.hTitle}>Trip</Text>
        </View>
        {/* <Pressable style={styles.doneBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable> */}
      </View>

      {/* -------- NON-SCROLLING CONTENT -------- */}
      <View style={styles.content}>
        {/* Start/Destination Card */}
        <View style={styles.block}>
          {/* Start */}
          <Pressable style={styles.row} onPress={() => openPlaces('start')}>
            <View style={styles.rowIconWrap}>
              <Ionicons name="radio-button-on-outline" size={16} color={TEXT} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowLabel}>Start</Text>
              <Text style={styles.rowValue} numberOfLines={2}>
                {start?.description ?? 'Choose start point'}
              </Text>
            </View>
          </Pressable>

          {/* Destination */}
          <Pressable
            style={[styles.row, { marginTop: 12 }]}
            onPress={() => openPlaces('dest')}
          >
            <View style={[styles.rowIconWrap, { backgroundColor: '#EAEAEA' }]}>
              <MaterialIcons name="flag" size={16} color={TEXT} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowLabel}>Destination</Text>
              <Text
                style={[styles.rowValue, !dest && { color: MUTED }]}
                numberOfLines={1}
              >
                {dest?.description ?? 'Where are you going?'}
              </Text>
            </View>
            <View style={styles.plusBadge}>
              <AntDesign name="plus" size={14} color={TEXT} />
            </View>
          </Pressable>

          {/* Helper */}
          <View style={styles.helper}>
            <Text style={styles.helperText}>Want to pick someone else?</Text>
            <Pressable
              onPress={() => {
                navigation.navigate('ScheduleRide', {
                  initial: new Date(),
                  start: start ?? undefined,
                  dest: dest ?? undefined,
                  onPick: () => {},
                });
              }}
              style={styles.helperPlus}
            >
              <AntDesign name="plus" size={14} color={TEXT} />
            </Pressable>
          </View>
        </View>

        {/* Set on pin */}
        <Pressable style={styles.pinRow} onPress={() => setSetOnPin(!setOnPin)}>
          <Image
            source={assets.images.locationPin}
            style={{ width: 20, height: 20, resizeMode: 'contain' }}
          />
          <Text style={styles.pinText}>Set location on pin</Text>
          <View style={{ flex: 1 }} />
          <Switch value={setOnPin} onValueChange={setSetOnPin} />
        </Pressable>

        {/* Passenger summary chip (tap to edit) */}
        {(totalPassengers > 0 || totalSeats > 0) && (
          <Pressable style={styles.summaryChip} onPress={onAddPassengerPress}>
            <Ionicons name="people-outline" size={16} color={TEXT} />
            <Text style={styles.summaryText} numberOfLines={1}>
              {chipText}
            </Text>
            <Text style={styles.summaryEdit}>Edit</Text>
          </Pressable>
        )}

        {/* tiny meta / readouts */}
        <Text
          style={styles.inlineMeta}
          numberOfLines={1}
        >{`Adults ${passengers.adults} · Children ${passengers.children} · Infants ${passengers.infants}`}</Text>
        <Text style={[styles.inlineMeta, { marginTop: 4 }]} numberOfLines={1}>
          {summarizeLuggage(luggage)}
        </Text>
        {!!whenText && (
          <Text style={[styles.inlineMeta, { marginTop: 4 }]} numberOfLines={1}>
            {'Selected Date and Time: ' + whenText}
          </Text>
        )}

        {/* Spacer pushes bullets near bottom, keeping room for CTA */}
        <View style={{ flex: 1 }} />

        {/* Info bullets */}
        <View style={{ gap: 16 }}>
          <View style={styles.bullet}>
            <Image
              source={assets.images.traffic}
              style={{ width: 20, height: 20, resizeMode: 'contain' }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.bTitle}>
                Traffic or Rush Hour? Flat Rate!
              </Text>
              <Text style={styles.bBody}>
                No worries! Enjoy a flat rate with no surge pricing, no per-KM
                or per-MIN charges, and no hidden fees.
              </Text>
            </View>
          </View>

          <View style={styles.bullet}>
            <Image
              source={assets.images.securityIcon}
              style={{ width: 20, height: 20, resizeMode: 'contain' }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.bTitle}>Guaranteed</Text>
              <Text style={styles.bBody}>
                20+ Years of Reliable Pickups. hop’n guarantees on-time service
                with no cancellations.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottom}>
        <Pressable style={styles.cta} onPress={onAddPassengerPress}>
          <Text style={styles.ctaText}>+ Add Passenger</Text>
          <View style={styles.ctaArrow}>
            <AntDesign name="arrowright" size={18} color={TEXT} />
          </View>
        </Pressable>
      </View>

      {/* Requirement popup */}
      <Modal
        visible={!!blocker}
        transparent
        animationType="fade"
        onRequestClose={() => setBlocker(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupCard}>
            <View style={styles.popupHeader}>
              <Text style={styles.popupCloseTxt}>Close</Text>
              <Pressable onPress={() => setBlocker(null)} hitSlop={10}>
                <Ionicons name="close" size={18} color="#9AA0A6" />
              </Pressable>
            </View>
            <Text style={styles.popupTitle}>{blocker?.title}</Text>
            <Text style={styles.popupBody}>{blocker?.message}</Text>
            <Pressable style={styles.popupCta} onPress={() => setBlocker(null)}>
              <Text style={styles.popupCtaTxt}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hTitle: { fontSize: 16, color: TEXT, fontFamily: 'BiennaleBold' },
  doneBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  doneText: { color: TEXT, fontFamily: 'BiennaleBold' },

  // non-scroll container
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 140, // keep clear of CTA
  },

  // Popup
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  popupCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  popupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  popupCloseTxt: { color: '#9AA0A6', fontFamily: 'BiennaleRegular' },
  popupTitle: {
    color: '#111',
    fontSize: 18,
    fontFamily: 'BiennaleBold',
    textAlign: 'center',
    marginTop: 6,
  },
  popupBody: {
    color: '#6F6F6F',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 8,
    fontFamily: 'BiennaleRegular',
  },
  popupCta: {
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: MINT,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  popupCtaTxt: { color: '#111', fontFamily: 'BiennaleBold' },

  block: {
    backgroundColor: BG,
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
  },

  row: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  rowIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowTextWrap: { flex: 1 },
  rowLabel: { fontSize: 12, color: '#6F7378', fontFamily: 'BiennaleSemiBold' },
  rowValue: {
    fontSize: 14.5,
    color: TEXT,
    fontFamily: 'BiennaleBold',
    marginTop: 2,
  },
  plusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  helper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 6,
    marginTop: 16,
  },
  helperText: { color: TEXT, paddingVertical: 3, fontFamily: 'BiennaleMedium' },
  helperPlus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 6,
    marginTop: 16,
  },
  pinText: { color: TEXT, fontFamily: 'BiennaleBold' },

  summaryChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: 12,
  },
  summaryText: { color: TEXT, fontFamily: 'BiennaleBold', maxWidth: '70%' },
  summaryEdit: { color: '#4F8EF7', fontFamily: 'BiennaleBold', marginLeft: 6 },

  inlineMeta: {
    color: '#50545A',
    marginTop: 10,
    fontFamily: 'BiennaleRegular',
  },

  bullet: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bTitle: { color: TEXT, fontFamily: 'BiennaleBold' },
  bBody: {
    color: '#666',
    marginTop: 2,
    lineHeight: 18,
    fontFamily: 'BiennaleRegular',
  },

  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    paddingHorizontal: 16,
  },
  cta: {
    height: 52,
    borderRadius: 28,
    backgroundColor: TEXT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#fff', fontFamily: 'BiennaleBold' },
  ctaArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
});
