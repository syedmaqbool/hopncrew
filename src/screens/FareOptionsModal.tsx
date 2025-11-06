<<<<<<< HEAD
// src/screens/FareOptionsModal.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, TextInput, Switch,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, FareQuote, SpecialRequestPayload } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
type Props = NativeStackScreenProps<RootStackParamList, 'FareOptions'>;

const MINT = '#B9FBE7';

export default function FareOptionsModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const eta = route.params?.etaMinutes ?? 18;
  const quotes = route.params?.quotes ?? [];
  const [selectedId, setSelectedId] = useState<string>(quotes[0]?.id);
  const [payMethod, setPayMethod] = useState(route.params?.payMethod ?? 'Card');
  const [hasNote, setHasNote] = useState(false);
  const [special, setSpecial] = useState<SpecialRequestPayload>({
        caringPet: false, quietRide: false, note: '',
        });
  const [note, setNote] = useState('');

  const selected = useMemo(
    () => quotes.find(q => q.id === selectedId) ?? quotes[0],
    [quotes, selectedId]
  );

  const confirm = () => {
            if (!selected) return;
        navigation.navigate('ConfirmRequest', {
            quote: selected,
            payMethod,
            special: hasNote ? special : null,
        });
        };



 

  return (
    <View style={styles.fill}>
      {/* leave the map visible behind */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        {/* Top overlay (back & ETA) */}
        <View style={[styles.overlayTop, { paddingTop: insets.top + 6 }]}>
          <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={18} color="#111" />
          </Pressable>
          {/* <View style={styles.etaPill}>
            <Text style={styles.etaNum}>{eta}</Text>
            <Text style={styles.etaTxt}>Min</Text>
          </View> */}
        </View>

        {/* Bottom sheet */}
        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.blurb}>
              “All ride options are powered by verified, insured professionals trained to limousine standards.”
            </Text>

            {/* Fare cards */}
            <View style={{ gap: 10, marginTop: 10 }}>
              {quotes.map(q => (
                <FareCard
                  key={q.id}
                  quote={q}
                  selected={q.id === selectedId}
                  onPress={() => setSelectedId(q.id)}
                />
              ))}
            </View>

            {/* Policy chips */}
            <ScrollView
            
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, marginTop: 14,marginLeft: 50 }}
            >
              {['Late Arrival- Waiting Time - No Show ->'].map((p) => (
                <Pressable onPress={() => { navigation.navigate('Policies', {
                onSelect: (id) => console.log('open policy details for', id),
                });}}>
                <View key={p} style={styles.chip}   >
                  <Text style={styles.chipTxt}>{p}</Text>
                </View>
                </Pressable>
              ))}
              {/* <Ionicons name="chevron-forward" size={18} color="#111" style={{ alignSelf: 'center' }} /> */}
            </ScrollView>

            {/* Payment row */}
            <Pressable style={styles.rowCard} onPress={() => { /* open payment picker later */ }}>
              <View style={styles.rowIcon}><Ionicons name="person-circle-outline" size={20} color="#111" /></View>
              <Text style={styles.rowMain}>{payMethod}</Text>
              <Ionicons name="chevron-forward" size={18} color="#111" />
            </Pressable>

            {/* Special request */}
            <View style={[styles.rowCard, { alignItems: 'center' }]}>
              <Ionicons name="sparkles-outline" size={18} color="#111" />
              <Text style={[styles.rowMain, { flex: 1, marginLeft: 10 }]}>I have special request</Text>
              <Switch
                    value={hasNote}
                    onValueChange={(v) => {
                        setHasNote(v);
                        if (v) {
                        navigation.navigate('SpecialRequest', {
                            initial: special,
                            onDone: (p) => { setSpecial(p); setHasNote(true); },
                            onCancel: () => setHasNote(false),
                        });
                        } else {
                        setSpecial({ caringPet: false, quietRide: false, note: '' });
                        }
                    }}
                    trackColor={{ true: MINT, false: '#E6E6E6' }}
                    thumbColor={hasNote ? '#111' : '#fff'}
                    />
            </View>

            {/* {hasNote && (
              <TextInput
                style={styles.noteBox}
                placeholder="Type your request for the driver…"
                placeholderTextColor="#9AA0A6"
                multiline
                value={note}
                onChangeText={setNote}
              />
            )} */}
          </ScrollView>

          {/* CTA */}
          <Pressable style={styles.cta} onPress={confirm} disabled={!selected}>
            <Text style={styles.ctaText}>Confirm and Request</Text>
            <View style={styles.ctaIcon}>
              <AntDesign name="arrowright" size={18} color="#111" />
=======
// src/screens/FareOptionsScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  FlatList,
  Alert,
  StyleSheet as RNStyleSheet,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, SpecialRequestPayload } from '../navigation/types';
import assets from '../../assets';

import { FONTS } from '../../src/theme/fonts';
import {
  calculateRideCost,
  vehicleOptionsToQuotes,
  type RideCostResult,
} from '../services/app';

type Props = NativeStackScreenProps<RootStackParamList, 'FareOptions'>;

const MINT = '#B9FBE7';
const TEXT = '#111';
const BORDER = '#EFEFEF';
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';

// 👇 Put your token here or import from env
const MAPBOX_TOKEN =
  'pk.eyJ1IjoicmFmYXlhc2FkMDEiLCJhIjoiY21oazdxanQwMDR5cTJrc2NiZGZiZ3phMyJ9.beHDnNh5y6l-9ThZ1TR64A';

export default function FareOptionsScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<MapboxGL.Camera>(null);

  const [etaMinutes, setEtaMinutes] = useState<number>(route.params?.etaMinutes ?? 0);

  const [quotes, setQuotes] = useState<
    Array<{
      id: string;
      tier: string;
      seatText?: string;
      details?: string;
      price: number;
      image?: string | null;
      fare_per_km?: number;
      max_passengers?: number;
      max_luggage?: number;
      price_breakdown?: any;
      eta?: number;
    }>
  >([]);

  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const start = route.params?.start; // { latitude, longitude }
  const dest = route.params?.dest; // { latitude, longitude }

  // === Map helpers
  const toLngLat = (p?: { latitude: number; longitude: number }) =>
    p ? ([p.longitude, p.latitude] as [number, number]) : undefined;

  const startLL = useMemo(() => toLngLat(start), [start]);
  const endLL = useMemo(() => toLngLat(dest), [dest]);

  // Route state from Mapbox Directions
  const [routeShape, setRouteShape] = useState<any | null>(null); // GeoJSON FeatureCollection
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]); // [lon,lat] list

  // Car icon position (start of route)
  const carCoord = useMemo<[number, number] | undefined>(
    () => (routeCoords.length > 0 ? routeCoords[0] : startLL),
    [routeCoords, startLL],
  );

  // Compute map bounds from the route (fallback to start/end)
  const bounds = useMemo(() => {
    const coords =
      routeCoords.length > 1
        ? routeCoords
        : ([startLL, endLL].filter(Boolean) as [number, number][]);
    if (!coords || coords.length < 1) return undefined;

    let minLon = Infinity,
      maxLon = -Infinity,
      minLat = Infinity,
      maxLat = -Infinity;
    coords.forEach(([lon, lat]) => {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });

    if (!isFinite(minLon) || !isFinite(maxLon) || !isFinite(minLat) || !isFinite(maxLat)) {
      return undefined;
    }

    return {
      ne: [maxLon, maxLat] as [number, number],
      sw: [minLon, minLat] as [number, number],
      paddingTop: insets.top + 8 + 72,
      paddingBottom: 32,
      paddingLeft: 16,
      paddingRight: 16,
    };
  }, [routeCoords, startLL, endLL, insets.top]);

  // === Fetch Mapbox Directions route
  useEffect(() => {
    const fetchRoute = async () => {
      if (!startLL || !endLL || !MAPBOX_TOKEN) return;

      try {
        const url =
          `https://api.mapbox.com/directions/v5/mapbox/driving/` +
          `${startLL[0]},${startLL[1]};${endLL[0]},${endLL[1]}` +
          `?geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_TOKEN}`;

        const res = await fetch(url);
        const json = await res.json();

        const route = json?.routes?.[0];
        const coords: [number, number][] = route?.geometry?.coordinates ?? [];

        if (coords.length > 0) {
          const featureCollection = {
            type: 'FeatureCollection' as const,
            features: [
              {
                type: 'Feature' as const,
                geometry: {
                  type: 'LineString' as const,
                  coordinates: coords,
                },
                properties: {},
              },
            ],
          };
          setRouteShape(featureCollection);
          setRouteCoords(coords);
        } else {
          setRouteShape(null);
          setRouteCoords([]);
        }
      } catch (err) {
        console.warn('Directions fetch failed:', err);
        setRouteShape(null);
        setRouteCoords([]);
      }
    };

    fetchRoute();
  }, [startLL?.[0], startLL?.[1], endLL?.[0], endLL?.[1]]);

  // === Fare calc
  useEffect(() => {
    if (!start || !dest) return;
    (async () => {
      setLoading(true);
      try {
        const result: RideCostResult = await calculateRideCost({
          origin: { lat: start.latitude, lng: start.longitude },
          destination: { lat: dest.latitude, lng: dest.longitude },
        });

        const minutes = Number(result?.route_info?.duration_minutes ?? 0);
        setEtaMinutes(minutes > 0 ? minutes : 0);

        const mapped = vehicleOptionsToQuotes(result?.vehicle_options ?? []);
        setQuotes(mapped);
        if (mapped.length > 0) setSelectedId(mapped[0].id);
      } catch (e: any) {
        console.error('calculateRideCost failed:', e?.message || e);
        setQuotes([]);
        setEtaMinutes(0);
        Alert.alert('Error', 'Unable to calculate ride cost. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [start?.latitude, start?.longitude, dest?.latitude, dest?.longitude]);

  const [payMethod, setPayMethod] = useState(route.params?.payMethod ?? 'Payment Breakdown');
  const [hasNote, setHasNote] = useState(false);
  const [special, setSpecial] = useState<SpecialRequestPayload>({
    caringPet: false,
    quietRide: false,
    note: '',
  });

  const selected = useMemo(() => quotes.find((q) => q.id === selectedId), [quotes, selectedId]);

  const confirm = () => {
    if (!selectedId || !selected) {
      Alert.alert('Required', 'Please select a vehicle before continuing.');
      return;
    }

    const payload = { payMethod, special: hasNote ? special : null };

    if (typeof route.params?.onConfirm === 'function') {
      route.params.onConfirm(selected, payload);
    }

    navigation.navigate('ConfirmRequest', {
      quote: { ...selected, eta: etaMinutes },
      payMethod,
      special: hasNote ? special : null,
      start: route.params?.start,
      dest: route.params?.dest,
      when: route.params?.when,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F3F4' }}>
      {/* ===== Top map / header (30% height) ===== */}
      <View style={[styles.mapWrap, { paddingTop: insets.top + 8 }]}>
        <MapboxGL.MapView
          style={RNStyleSheet.absoluteFill}
          styleURL={MAP_STYLE}
          rotateEnabled
          scrollEnabled
          zoomEnabled
          scaleBarEnabled={false}
          logoEnabled={false}
        >
          {bounds ? (
            <MapboxGL.Camera ref={cameraRef} bounds={bounds} />
          ) : (
            <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={
                startLL ??
                endLL ?? [
                  67.0011, // Karachi lon (fallback)
                  24.8607, // Karachi lat (fallback)
                ]
              }
            />
          )}

          {/* Real route from Directions */}
          {routeShape && (
            <MapboxGL.ShapeSource id="route" shape={routeShape}>
              <MapboxGL.LineLayer
                id="route-line"
                style={{
                  lineColor: '#ffbf00ff',
                  lineWidth: 4,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            </MapboxGL.ShapeSource>
          )}

          {/* Start pin */}
          {startLL && (
            <MapboxGL.MarkerView coordinate={startLL} anchor={{ x: 0.5, y: 1 }} allowOverlap>
              <Image
                source={assets.images.locationPin}
                style={{ width: 18, height: 18, resizeMode: 'contain' }}
              />
            </MapboxGL.MarkerView>
          )}

          {/* End pin */}
          {endLL && (
            <MapboxGL.MarkerView coordinate={endLL} anchor={{ x: 0.5, y: 1 }} allowOverlap>
              <Image
                source={assets.images.locationPin}
                style={{ width: 18, height: 18, resizeMode: 'contain' }}
              />
            </MapboxGL.MarkerView>
          )}

          {/* Car icon at the start of the route */}
          {carCoord && (
            <MapboxGL.MarkerView coordinate={carCoord} anchor={{ x: 0.5, y: 0.5 }} allowOverlap>
              <Image
                source={require('../../assets/icons/car-icon.png')}
                style={{ width: 28, height: 28, resizeMode: 'contain' }}
              />
            </MapboxGL.MarkerView>
          )}
        </MapboxGL.MapView>

        {/* nav + ETA row overlay */}
        <View style={[styles.headerRow, { paddingHorizontal: 20, top: insets.top + 12 }]}>
          <Pressable style={styles.backCircle} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={18} color={TEXT} />
          </Pressable>

          <View style={styles.etaPill}>
            <Text style={styles.etaNum}>{etaMinutes || 0}</Text>
            <Text style={styles.etaTxt}>Min</Text>
          </View>

          <View style={{ width: 36, height: 36 }} />
        </View>
      </View>

      {/* ===== Bottom sheet ===== */}
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        {/* Static top area */}
        <View style={styles.sheetTopPadding}>
          <Text style={styles.blurb}>
            “All ride options are powered by verified, insured professionals trained to limousine
            standards.”
          </Text>
        </View>

        {/* ONLY this FlatList scrolls */}
        <View style={styles.listContainer}>
          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ color: '#888' }}>Calculating fares…</Text>
            </View>
          ) : quotes.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ color: '#888' }}>No vehicles available</Text>
            </View>
          ) : (
            <FlatList
              data={quotes}
              keyExtractor={(q) => q.id}
              renderItem={({ item, index }) => (
                <FareRow
                  quote={item}
                  selected={item.id === selectedId}
                  onPress={() => setSelectedId(item.id === selectedId ? undefined : item.id)}
                  variant={index % 3}
                />
              )}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              showsVerticalScrollIndicator
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>

        {/* Static controls below list (non-scrollable) */}
        <View style={{ paddingHorizontal: 16 }}>
          {/* Policy row */}
          <Pressable
            style={styles.policyRow}
            onPress={() =>
              navigation.navigate('Policies', {
                onSelect: (id) => console.log('open policy:', id),
              })
            }
          >
            <Text style={styles.policyTxt}>Late Arrival . Waiting Time . No Show</Text>
            <AntDesign name="arrowright" style={{ marginTop: 4 }} size={16} color={TEXT} />
          </Pressable>

          {/* Payment row */}
          <Pressable
            style={styles.rowCard}
            onPress={() => {
              /* future picker */
            }}
          >
            <View style={styles.rowIcon}>
              <Image
                source={require('../../assets/icons/card-icon.png')}
                style={{ width: 30, height: 30, resizeMode: 'contain' }}
              />
            </View>
            <Text style={styles.rowMain}>{payMethod}</Text>

            <View style={styles.mintMini}>
              <AntDesign name="arrowright" size={16} color={TEXT} />
            </View>
          </Pressable>

          {/* Special request toggle */}
          <Pressable
            style={styles.specialToggle}
            onPress={() => {
              if (!hasNote) {
                setHasNote(true);
                navigation.navigate('SpecialRequest', {
                  initial: special,
                  onDone: (p) => {
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
            <View style={styles.specialInner}>
              <Image
                source={require('../../assets/icons/specreq-icon.png')}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
              <Text>I have special request</Text>
              <View style={[styles.squareCheck, hasNote && styles.squareCheckOn]}>
                {hasNote ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
              </View>
            </View>
          </Pressable>
        </View>

        {/* CTA (fixed) */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Pressable style={styles.cta} onPress={confirm} disabled={!selectedId}>
            <Text style={styles.ctaText}>Confirm and Request</Text>
            <View style={styles.ctaIcon}>
              <AntDesign name="arrowright" size={18} color={TEXT} />
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

<<<<<<< HEAD
/* -------- Fare card ---------- */
function FareCard({
  quote, selected, onPress,
}: { quote: FareQuote; selected?: boolean; onPress?: () => void; }) {
//  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    //  const nextScreen =() => {
    //     navigation.navigate('ConfirmRequest')
    //     };
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        selected && { borderColor: '#111', backgroundColor: '#fff' },
      ]}
    >
      {/* left price slab */}
      <View style={styles.priceSlab}>
        <Text style={styles.priceNow}>${quote.price}</Text>
        {!!quote.oldPrice && <Text style={styles.priceOld}>${quote.oldPrice}</Text>}
      </View>

      {/* right car tile */}
      <View style={styles.carTile} >
       
        <Text style={styles.tierTitle}>{quote.tier} {quote.seatText ? <Text style={styles.tierSub}>{quote.seatText}</Text> : null}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
          {quote.image ? (
            // eslint-disable-next-line react-native/no-inline-styles
            <View style={{ width: 88, height: 40, overflow: 'hidden', borderRadius: 8 }}>
              {/* <Image source={quote.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" /> */}
            </View>
          ) : (
            <MaterialCommunityIcons name="car-estate" size={56} color="#111" />
          )}
        </View>
        
=======
/* ====== Fare row ====== */
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
    details?: string;
    price: number;
    image?: string | null;
    fare_per_km?: number;
    max_passengers?: number;
    max_luggage?: number;
  };
  selected?: boolean;
  onPress?: () => void;
  variant?: number;
}) {
  const carSrc = quote.image ? { uri: quote.image } : undefined;

  return (
    <Pressable onPress={onPress} style={[styles.rowWrap, selected && styles.rowWrapActive]}>
      <View style={[styles.leftSlab, selected && styles.leftSlabActive]}>
        <Text style={selected ? styles.priceBigActive : styles.priceBig}>$ {quote.price}</Text>
      </View>

      <View style={[styles.rightBubble, selected && styles.rightBubbleActive]}>
        <Text style={styles.tierTitle}>{quote.tier}</Text>

        {carSrc ? (
          <Image source={carSrc} style={{ width: 140, height: 52 }} resizeMode="contain" />
        ) : (
          <Image
            source={require('../../assets/icons/no-car-icon.jpg')}
            style={{ width: 150, height: 80 }}
            resizeMode="contain"
          />
        )}

        {/* {!!(quote.seatText || quote.details) && (
          <Text style={styles.tierSub}>{quote.seatText || quote.details}</Text>
        )} */}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
      </View>
    </Pressable>
  );
}

<<<<<<< HEAD
/* -------- styles ---------- */

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },

  /* top overlay */
  overlayTop: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between' },
  roundBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EEE' },
  etaPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#111', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  etaNum: { color: '#fff', fontWeight: '800' },
  etaTxt: { color: '#fff' },

  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },

  blurb: {
    color: '#111', backgroundColor: '#F6F7F8', borderRadius: 12, padding: 12, lineHeight: 18,
  },

  card: {
    flexDirection: 'row',
    borderRadius: 16, borderWidth: 1, borderColor: '#EFEFEF', overflow: 'hidden', backgroundColor: '#FAFAFA',
  },
  priceSlab: {
    paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', minWidth: 92,
  },
  priceNow: { color: '#fff', fontSize: 28, fontWeight: '800' },
  priceOld: { color: '#B9BDC2', textDecorationLine: 'line-through', marginTop: 2 },

  carTile: {
    flex: 1, backgroundColor: '#fff', padding: 10, justifyContent: 'center',
  },
  tierTitle: { color: '#111', fontWeight: '800' },
  tierSub: { color: '#6C7075', fontWeight: '600' },

  chip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F6F7F8', borderWidth: 1, borderColor: '#EEE',
  },
  chipTxt: { color: '#111', fontWeight: '700' },

  rowCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12,
    borderRadius: 12, borderWidth: 0, borderColor: '#EFEFEF', padding: 12, backgroundColor: '#fff',
  },
  rowIcon: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#F6F7F8', alignItems: 'center', justifyContent: 'center',
  },
  rowMain: { color: '#111', fontWeight: '700' },

  noteBox: {
    marginTop: 8, borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 12, padding: 10, minHeight: 72, textAlignVertical: 'top', color: '#111',
  },

  cta: {
    margin: 16, height: 50, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: MINT, alignItems: 'center', justifyContent: 'center' },
=======
/* ====== styles ====== */
const styles = StyleSheet.create({
  mapWrap: {
    height: Math.round(Dimensions.get('window').height * 0.3),
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  headerRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 48,
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
    position: 'relative',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#111',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  etaNum: { color: '#FDFF51', fontFamily: FONTS.semibold },
  etaTxt: { color: '#fff', fontFamily: FONTS.regular },

  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
  },
  sheetTopPadding: {
    paddingHorizontal: 16,
  },

  blurb: {
    color: TEXT,
    fontSize: 12,
    backgroundColor: '#F6F7F8',
    borderRadius: 12,
    padding: 8,
    lineHeight: 18,
    fontFamily: FONTS.regular,
  },

  /* List area gets the scroll */
  listContainer: {
    flex: 1,
    marginTop: 12,
  },

  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#EEEEEF',
    overflow: 'visible',
    color: '#000',
  },
  rowWrapActive: {
    borderColor: '#EEEEEF',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  leftSlab: {
    backgroundColor: '#EEEEEF',
    paddingLeft: 18,
    paddingRight: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    minWidth: 200,
    minHeight: 120,
    justifyContent: 'center',
  },
  leftSlabActive: { backgroundColor: '#000' },

  priceBig: {
    color: '#000',
    fontSize: 34,
    lineHeight: 40,
    fontFamily: FONTS.bold,
  },
  priceBigActive: {
    color: '#fff',
    fontSize: 34,
    lineHeight: 40,
    fontFamily: FONTS.bold,
  },

  rightBubble: {
    flex: 1,
    marginLeft: -10,
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
    alignItems: 'center',
  },
  rightBubbleActive: {
    elevation: 6,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  tierTitle: {
    color: TEXT,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  tierSub: { color: '#6C7075', fontFamily: FONTS.medium },

  policyRow: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 50,
    borderRadius: 999,
    backgroundColor: '#F6F7F8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  policyTxt: { color: TEXT, fontFamily: FONTS.bold },

  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  rowIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMain: { color: TEXT, flex: 1, fontFamily: FONTS.bold },

  mintMini: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  specialToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 14,
  },
  specialInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
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
  ctaText: { color: '#fff', fontFamily: FONTS.bold },
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
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});
