// src/screens/FareOptionsScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type {
  RootStackParamList,
  FareQuote,
  SpecialRequestPayload,
} from '../navigation/types';
import assets from '../../assets';
import { getVehicleTypes, type VehicleType } from '../services/app';

type Props = NativeStackScreenProps<RootStackParamList, 'FareOptions'>;

const MINT = '#B9FBE7';
const TEXT = '#111';
const BORDER = '#EFEFEF';

export default function FareOptionsScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  const eta = route.params?.etaMinutes ?? 18;
  const routeQuotes = route.params?.quotes ?? [];
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<any>(vehicleTypes[0]?.id);

  useEffect(() => {
    console.log('routeQuotes', routeQuotes);
    (async () => {
      setLoading(true);
      try {
        const list = await getVehicleTypes();
        console.log('?>>>>>>>>>>>>>>', list);

        setVehicleTypes(list);
      } catch (err) {
        console.error('Failed to fetch vehicle types:', err);
        setVehicleTypes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const dynamicQuotes = useMemo(() => {
    return vehicleTypes.map(v => ({
      id: String(v.id),
      tier: v.name,
      seatText: v.details,
      details: v.details,
      price: Number(v.base_fare),
      image: v.image_url,
      fare_per_km: v.fare_per_km,
      max_passengers: v.max_passengers,
      max_luggage: v.max_luggage,
    }));
  }, [vehicleTypes]);

  const quotes = dynamicQuotes;

  useEffect(() => {
    if (!selectedId && quotes.length > 0) setSelectedId(quotes[0].id);
  }, [quotes, selectedId]);
  const [payMethod, setPayMethod] = useState(route.params?.payMethod ?? 'Card');
  const [hasNote, setHasNote] = useState(false);
  const [special, setSpecial] = useState<SpecialRequestPayload>({
    caringPet: false,
    quietRide: false,
    note: '',
  });

  const selected = useMemo(
    () => quotes.find(q => q.id === selectedId) ?? quotes[0],
    [quotes, selectedId],
  );

  // Map points from Trip start/destination (fallbacks if missing)
  const start = route.params?.start;
  const dest = route.params?.dest;
  const mapRef = useRef<MapView | null>(null);
  const coords = useMemo(() => {
    const a = start ?? { latitude: 43.6532, longitude: -79.3832 };
    const b = dest ?? { latitude: 43.6426, longitude: -79.3871 };
    return [a, b];
  }, [start, dest]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(coords as any, {
        edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
        animated: false,
      });
    }
  }, [coords]);

  const confirm = () => {
    if (!selectedId) {
      alert('Please select a vehicle before continuing.');
      return;
    }

    // const selected = quotes.find(q => q.id === selectedId);
    // if (!selected) {
    //   alert('Please select a valid vehicle.');
    //   return;
    // }

    const payload = { payMethod, special: hasNote ? special : null };

    if (typeof route.params?.onConfirm === 'function') {
      route.params.onConfirm(selected, payload);
    }

    console.log('??????????????', selected);

    navigation.navigate('ConfirmRequest', {
      quote: selected,
      payMethod,
      special: hasNote ? special : null,
      start: route.params?.start,
      dest: route.params?.dest,
      when: route.params?.when,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F3F4' }}>
      {/* ===== Top map / header (40% height) ===== */}
      <View style={[styles.mapWrap, { paddingTop: insets.top + 8 }]}>
        <MapView
          ref={ref => (mapRef.current = ref)}
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: coords[0].latitude,
            longitude: coords[0].longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}
        >
          <Polyline
            coordinates={coords as any}
            strokeWidth={4}
            strokeColor="#50E3C2"
          />
          {/* Start pin */}
          <Marker coordinate={coords[0] as any} anchor={{ x: 0.5, y: 1 }}>
            <Image
              source={assets.images.locationPin}
              style={{ width: 18, height: 18 }}
            />
          </Marker>
          {/* End pin */}
          <Marker coordinate={coords[1] as any} anchor={{ x: 0.5, y: 1 }}>
            <Image
              source={assets.images.locationPin}
              style={{ width: 18, height: 18 }}
            />
          </Marker>
          {/* Car marker at midpoint */}
          <Marker
            coordinate={
              {
                latitude: (coords[0].latitude + coords[1].latitude) / 2,
                longitude: (coords[0].longitude + coords[1].longitude) / 2,
              } as any
            }
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Image
              source={assets.images.escaladeIcon}
              style={{ width: 28, height: 28 }}
            />
          </Marker>
        </MapView>

        {/* nav + ETA row overlay */}
        <View style={[styles.headerRow, { paddingHorizontal: 20 }]}>
          <Pressable
            style={styles.backCircle}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={18} color={TEXT} />
          </Pressable>

          <View style={styles.etaPill}>
            <Text style={styles.etaNum}>{eta}</Text>
            <Text style={styles.etaTxt}>Min</Text>
          </View>

          {/* spacer */}
          <View style={{ width: 36, height: 36 }} />
        </View>
      </View>

      {/* ===== White sheet ===== */}
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.blurb}>
            “All ride options are powered by verified, insured professionals
            trained to limousine standards.”
          </Text>

          {/* Fare cards (scrollable with limited height) */}
          <View style={{ marginTop: 12 }}>
            {loading ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ color: '#888' }}>Loading vehicle types...</Text>
              </View>
            ) : dynamicQuotes.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ color: '#888' }}>No vehicles available</Text>
              </View>
            ) : (
              <FlatList
                data={dynamicQuotes}
                keyExtractor={q => q.id}
                renderItem={({ item, index }) => (
                  <FareRow
                    quote={item}
                    selected={item.id === selectedId}
                    onPress={() =>
                      setSelectedId(
                        item.id === selectedId ? undefined : item.id,
                      )
                    }
                    variant={index % 3}
                  />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                style={{ maxHeight: 360 }}
                showsVerticalScrollIndicator
                nestedScrollEnabled
              />
            )}
          </View>
          {/* Policy row (slim pill) */}
          <Pressable
            style={styles.policyRow}
            onPress={() =>
              navigation.navigate('Policies', {
                onSelect: id => console.log('open policy:', id),
              })
            }
          >
            <Text style={styles.policyTxt}>
              Late Arrival - Waiting Time - No Show
            </Text>
            <AntDesign
              name="arrowright"
              style={{ marginTop: 4 }}
              size={16}
              color={TEXT}
            />
          </Pressable>

          {/* Payment row + mint micro button */}
          <Pressable
            style={styles.rowCard}
            onPress={() => {
              // payment picker later
            }}
          >
            <View style={styles.rowIcon}>
              <Image
                source={require('../../assets/icons/card-icon.png')}
                style={{ width: 30, height: 30, resizeMode: 'contain' }}
              />
              {/* <Ionicons name="person-circle-outline" size={20} color={TEXT} /> */}
            </View>
            <Text style={styles.rowMain}>{payMethod}</Text>

            <View style={styles.mintMini}>
              <AntDesign name="arrowright" size={16} color={TEXT} />
            </View>
          </Pressable>

          {/* Special request as checkbox-like toggle */}
          <Pressable
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 14,
            }}
            onPress={() => {
              if (!hasNote) {
                setHasNote(true);
                navigation.navigate('SpecialRequest', {
                  initial: special,
                  onDone: p => {
                    setSpecial(p);
                    setHasNote(true);
                  },
                  onCancel: () => setHasNote(false),
                });
              } else {
                setHasNote(false);
                setSpecial({ caringPet: false, quietRide: false, note: '' });
              }
            }}
          >
            <View
              style={[
                styles.rowMain,
                {
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: 10,
                },
              ]}
            >
              <Image
                source={require('../../assets/icons/specreq-icon.png')}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
              {/* <Ionicons name="sparkles-outline" size={18} color={TEXT} /> */}
              <Text>I have special request</Text>
              <View
                style={[styles.squareCheck, hasNote && styles.squareCheckOn]}
              >
                {hasNote ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : null}
              </View>
            </View>
          </Pressable>
        </ScrollView>

        {/* CTA */}
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <Pressable style={styles.cta} onPress={confirm} disabled={!selected}>
            <Text style={styles.ctaText}>Confirm and Request</Text>
            <View style={styles.ctaIcon}>
              <AntDesign name="arrowright" size={18} color={TEXT} />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ====== Fare row (matches mock) ====== */
function FareRow({
  quote,
  selected,
  onPress,
  variant = 0,
}: {
  quote: {
    id: string;
    tier: string;
    seatText?: string;
    price: number;
    image?: string | null;
    fare_per_km?: string;
    max_passengers?: number;
    max_luggage?: number;
  };
  selected?: boolean;
  onPress?: () => void;
  variant?: number;
}) {
  // Only use API image if exists
  const carSrc = quote.image ? { uri: quote.image } : undefined;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.rowWrap, selected && styles.rowWrapActive]}
    >
      {/* Left dark slab */}
      <View style={[styles.leftSlab, selected && styles.leftSlabActive]}>
        <Text style={styles.priceBig}>${quote.price}</Text>
      </View>

      {/* Right white bubble */}
      <View style={[styles.rightBubble, selected && styles.rightBubbleActive]}>
        <Text style={styles.tierTitle}>{quote.tier}</Text>
        {/* Show image only if API provides one */}
        {carSrc ? (
          <Image
            source={carSrc}
            style={{ width: 140, height: 52 }}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require('../../assets/icons/no-car-icon.jpg')}
            style={{ width: 150, height: 80 }}
            resizeMode="contain"
          />
        )}

        <Text>
          {quote.seatText ? (
            <Text style={styles.tierSub}>{quote.seatText}</Text>
          ) : null}
        </Text>

        {/* Expand details when selected */}
        {selected && (
          <View style={{ marginTop: 6, alignItems: 'flex-end' }}>
            <Text style={{ color: '#6C7075', fontSize: 11 }}>
              Fare per km: ${quote.fare_per_km}
            </Text>
            <Text style={{ color: '#6C7075', fontSize: 11 }}>
              Max Passengers: {quote.max_passengers}
            </Text>
            <Text style={{ color: '#6C7075', fontSize: 11 }}>
              Max Luggage: {quote.max_luggage}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

/* ====== styles ====== */
const styles = StyleSheet.create({
  /* header map */
  mapWrap: {
    height: Math.round(Dimensions.get('window').height * 0.3),
    // borderBottomLeftRadius: 24,
    // borderBottomRightRadius: 24,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  etaNum: { color: '#fff', fontWeight: '800' },
  etaTxt: { color: '#fff' },

  markerLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  pin: { position: 'absolute', width: 18, height: 18 },
  car: { position: 'absolute', width: 28, height: 28 },

  /* sheet */
  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
  },

  blurb: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '400',
    backgroundColor: '#F6F7F8',
    borderRadius: 12,
    padding: 8,
    lineHeight: 18,
  },

  /* fare rows */
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#F6F7F8',
    overflow: 'visible',
  },
  rowWrapActive: {
    borderColor: '#111',
    backgroundColor: '#111',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  leftSlab: {
    backgroundColor: '#1A1A1A',
    paddingLeft: 18,
    paddingRight: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    minWidth: 112,
    minHeight: 150,
    justifyContent: 'center',
  },
  leftSlabActive: { backgroundColor: '#111' },

  priceBig: { color: '#fff', fontSize: 34, fontWeight: '800', lineHeight: 40 },
  priceStrike: {
    color: '#D7D7D7',
    textDecorationLine: 'line-through',
    marginTop: 2,
    fontSize: 14,
  },

  rightBubble: {
    flex: 1,
    marginLeft: -10, // overlap into the slab to mimic the mock’s shape
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    alignItems: 'flex-end',
  },
  rightBubbleActive: {
    elevation: 6,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  tierTitle: {
    color: TEXT,
    fontWeight: '800',
    textAlign: 'right',
    fontSize: 20,
  },
  tierSub: { color: '#6C7075', fontWeight: '500' },

  /* policy pill */
  policyRow: {
    marginTop: 22,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 50,
    borderRadius: 999,
    backgroundColor: '#F6F7F8',
    // borderWidth: 1,
    // borderColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  policyTxt: { color: TEXT, fontWeight: '700' },

  /* rows */
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: '#F0F0F0',
  },
  rowIcon: {
    width: 28,
    height: 28,
    // borderRadius: 14,
    // backgroundColor: '#F6F7F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMain: { color: TEXT, fontWeight: '700', flex: 1 },

  mintMini: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  squareCheck: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#9AA0A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareCheckOn: {
    backgroundColor: '#111',
    borderColor: '#111',
  },

  footer: { paddingHorizontal: 16, paddingTop: 8 },

  cta: {
    height: 50,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaIcon: {
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
