import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, {
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useLocation } from '../hooks/useLocation';
import type { RootStackParamList } from '../navigation/types';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import assets from '../../assets';
import type { AppDrawerParamList } from '../navigation/AppDrawer';
import { useAuth } from '../context/AuthContext';
import { getAirports } from '../services/app';

import MapboxGL from '@rnmapbox/maps';
import { FONTS } from '../../src/theme/fonts';

// If you haven't set this globally, you can set it here (pk_ is fine for map rendering):
MapboxGL.setAccessToken(
  'pk.eyJ1IjoicmFmYXlhc2FkMDEiLCJhIjoiY21oazdxanQwMDR5cTJrc2NiZGZiZ3phMyJ9.beHDnNh5y6l-9ThZ1TR64A',
);

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type InitialRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

// Optional: if your route provides a dest
type DestParam = { lat: number; lon: number; title?: string } | undefined;

export default function HomeScreen({ navigation, route }: Props) {
  // 👉 Light theme map
  const MAP_STYLE = MapboxGL.StyleURL.Outdoors;

  const { bootstrapped, auth } = useAuth();
  const dest: DestParam = route.params?.dest as any;
  const { location, getCurrent } = useLocation();
  const drawer = useNavigation<DrawerNavigationProp<AppDrawerParamList>>();

  // Camera ref for controlling the map
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [userCoord, setUserCoord] = useState<[number, number] | null>(null);
  const [hasCentered, setHasCentered] = useState(false);

  const insets = useSafeAreaInsets();
  const TOP_PAD = insets.top + 72;

  // Ask for Android location permission (v11 helper). iOS handled by plist.
  useEffect(() => {
    if (Platform.OS === 'android') {
      MapboxGL.requestAndroidLocationPermissions?.();
    }
  }, []);

  // Center camera once when we get a user location fix
  useEffect(() => {
    if (userCoord && cameraRef.current && !hasCentered) {
      cameraRef.current.setCamera({
        centerCoordinate: userCoord,
        zoomLevel: 16,
        animationDuration: 600,
      });
      setHasCentered(true);
    }
  }, [userCoord, hasCentered]);

  const openMenu = () => navigation.dispatch(DrawerActions.openDrawer());

  const initialRegion: InitialRegion = useMemo(
    () =>
      location
        ? {
            latitude: location.lat,
            longitude: location.lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }
        : {
            // Karachi fallback
            latitude: 24.8607,
            longitude: 67.0011,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          },
    [location],
  );

  const regionToZoom = (latDelta: number) => {
    const z = Math.max(2, Math.min(20, Math.log2(360 / latDelta)));
    return z;
  };

  const recenter = useCallback(() => {
    if (location && cameraRef.current) {
      cameraRef.current.flyTo([location.lon, location.lat], 600);
      cameraRef.current.setCamera({
        centerCoordinate: [location.lon, location.lat],
        zoomLevel: 16,
        animationDuration: 600,
      });
    } else {
      void getCurrent();
    }
  }, [location, getCurrent]);

  const openPlaces = async () => {
    try {
      const airports = await getAirports();
      const items = airports
        .map(airport => {
          const subtitleParts = [
            airport.code,
            airport.city,
            airport.province,
            airport.country,
          ].filter(Boolean);
          return {
            id: String(airport.id ?? airport.code ?? airport.name),
            title: airport.name,
            subtitle: subtitleParts.join(' - '),
            lat: airport.latitude,
            lon: airport.longitude,
          };
        })
        .filter(
          item => Boolean(item.title) && item.lat != null && item.lon != null,
        );

      if (!items.length) {
        Alert.alert(
          'No airports found',
          'We could not load any airports right now.',
        );
        return;
      }

      navigation.navigate('AirportDetails', {
        title: 'Select a destination airport',
        items,
        onPick: poi => {
          navigation.navigate('Trip', {
            dest: {
              latitude: poi.lat ?? 0,
              longitude: poi.lon ?? 0,
              description: poi.title,
            },
          });
        },
      });
    } catch (e: any) {
      Alert.alert('Unable to load airports', String(e?.message ?? e));
    }
  };

  const name = auth?.user
    ? `${auth.user.first_name ?? ''} ${auth.user.last_name ?? ''}`.trim() ||
      auth.user.email
    : 'Guest';

  if (!bootstrapped) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      {/* MAP */}
      <View style={styles.mapWrap}>
        <MapboxGL.MapView
          style={StyleSheet.absoluteFill}
          styleURL={MAP_STYLE}
          // compassEnabled
          rotateEnabled
          scrollEnabled
          zoomEnabled
          scaleBarEnabled={false}
          logoEnabled={false}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            centerCoordinate={[initialRegion.longitude, initialRegion.latitude]}
            zoomLevel={regionToZoom(initialRegion.latitudeDelta)}
            animationMode="flyTo"
            animationDuration={0}
            padding={{
              paddingTop: TOP_PAD,
              paddingBottom: 24,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          />

          {/* User blue dot and capture updates for custom pin */}
          <MapboxGL.UserLocation
            visible={true}
            showsUserHeadingIndicator
            onUpdate={(loc: any) => {
              const lon = loc?.coords?.longitude;
              const lat = loc?.coords?.latitude;
              if (typeof lon === 'number' && typeof lat === 'number') {
                setUserCoord([lon, lat]);
              }
            }}
          />

          {/* User pointer icon (custom pin) */}
          {(userCoord || location) && (
            <MapboxGL.MarkerView
              coordinate={userCoord ?? [location!.lon, location!.lat]}
              anchor={{ x: 0.5, y: 1 }}
              allowOverlap
            >
              <Image
                source={require('../../assets/icons/user-pin.png')}
                style={{ width: 68, height: 68, resizeMode: 'contain' }}
              />
            </MapboxGL.MarkerView>
          )}

          {/* Optional destination marker if provided via route */}
          {dest && (
            <MapboxGL.PointAnnotation
              id="dest"
              coordinate={[dest.lon, dest.lat]}
            >
              <View style={styles.destDot} />
            </MapboxGL.PointAnnotation>
          )}
        </MapboxGL.MapView>

        {/* Top-left menu button */}
        <Pressable style={styles.iconBtnTL} onPress={openMenu}>
          <Image
            source={assets.images.hamIcon}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </Pressable>

        {/* Top-right recenter button */}
        {/* <Pressable style={styles.iconBtnTR} onPress={recenter}>
          <MaterialIcons name="my-location" size={18} color="#111" />
        </Pressable> */}
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Good afternoon, {name} </Text>

        {/* Search pill */}
        <View style={styles.searchRow}>
          <Image source={require('../../assets/icons/search-icon.png')} alt='search-icon' style={{width:24,height:24}} />
          {/* <Ionicons name="search" size={24} color="#201E20" /> */}
          <Pressable style={{ flex: 1 }} onPress={openPlaces}>
            <Text style={{ color: '#201E20000', fontFamily: FONTS.regular, fontSize: 16, marginLeft: 2 }}>
              Where are you going?
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('SaveFavorite', {
                address: '',
                onSave: (fav: any) => {
                  console.log('Saved favourite:', fav);
                },
              });
            }}
          >
            <Image source={require('../../assets/icons/heart-icon.png')} alt='heart' style={{width:24,height:24}} />
            {/* <Ionicons name="heart-outline" size={18} color="#9AA0A6" /> */}
          </Pressable>
        </View>

        {/* Cards row (sample data) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 12 }}
          style={{
  marginTop: 8,
  shadowColor: '#201E20',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 4,
}}
        >
          {MOCK_POSTS.map(p => (
            <View key={p.id} style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <View>
                  <Image
                    source={assets.images.avatarMan}
                    style={{ width: 48, height: 48, borderRadius: 20 }}
                  />
                </View>
                <View>
                  <Text style={styles.cardTitle}>{p.author}</Text>
                  <Text style={styles.cardSub}>
                    Post on <Text style={styles.googleText}>Google</Text>
                  </Text>
                </View>
                <View>
                  <Image
                    source={assets.images.googleIcon}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                </View>
              </View>
              <Text numberOfLines={2} style={styles.cardBody}>
                {p.body}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  paddingHorizontal: 2,
                  marginTop: 10,
                  gap: 8,
                }}
              >
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Image source={require('../../assets/icons/star-icon.png')} alt='star-icon' style={{width:20,height:20}} />
                    // <Ionicons
                    //   key={i}
                    //   name={i < p.stars ? 'star' : 'star-outline'}
                    //   size={14}
                    //   color="#FFC107"
                    // />
                  ))}
                </View>

                <Text style={styles.cardSubTwo}>15 November</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Quick actions */}
        <View style={styles.quickList}>
          <Pressable
            style={styles.quickItem}
            onPress={() => navigation.navigate('RideSelection')}
          >
            {/* <Ionicons name="home-outline" size={18} color="#111" /> */}
            <Image
              source={require('../../assets/icons/home.png')}
              style={{ width: 18, height: 18 }}
            />
            <Text style={styles.quickText}>Home</Text>
          </Pressable>
          <Pressable
            style={styles.quickItem}
            onPress={() =>
              navigation.navigate('WhyChooseUs', {
                onClose: () => console.log('Closed Why Choose Us'),
              })
            }
          >
            {/* <Ionicons name="briefcase-outline" size={18} color="#111" /> */}
            <Image
              source={require('../../assets/icons/work.png')}
              style={{ width: 18, height: 18 }}
            />
            <Text style={styles.quickText}>Work</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  mapWrap: {
    // height: 400,
    flex: 0.5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    // overflow: 'hidden',
    // backgroundColor: '#070202ff',
  },

  iconBtnTL: {
    position: 'absolute',
    top: 45,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  iconBtnTR: {
    position: 'absolute',
    top: 45,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  content: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    marginTop: -26,
    paddingTop: 14,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },

  greeting: {
    fontSize: 20,
    color: '#201E20',
    marginTop: 18,
    marginBottom: 20,
    fontFamily: FONTS.semibold,
  },
  googleText: {
    color: '#1976D2',
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 0,
    borderColor: '#EEE',
    elevation: 4,
    shadowColor: '#201E20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '94%',
    alignSelf: 'center',
  },

  card: {
    marginTop: 20,
    width: 270,
    height: 196,
    padding: 18,
    marginRight: 12,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 0,
    borderColor: '#EFEFEF',
    elevation: 1,
    marginBottom: 16,
  },
  cardTitle: { color: '#201E20', fontFamily: FONTS.regular, fontSize: 16 },
  cardSub: { color: '#201E20', fontSize: 12, fontFamily: FONTS.regular },
  cardSubTwo: { color: '#8D8E8F', fontSize: 13, fontFamily: FONTS.regular },
  cardBody: { marginTop: 16, color: '#444', fontFamily: FONTS.regular, fontSize: 14 },
  starsRow: { flexDirection: 'row', gap: 4, marginTop: 20 },

  quickList: { marginTop: 0, gap: 6 },
  quickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 0,
    borderColor: '#EFEFEF',
  },
  quickText: { color: '#111', fontFamily: FONTS.semibold, marginLeft: 4 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Simple dot for destination
  destDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

const MOCK_POSTS = [
  {
    id: '1',
    author: 'John Cham',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit…',
    stars: 5,
  },
  {
    id: '2',
    author: 'Jane Doe',
    body: 'Great place to visit. Friendly staff and clean area.',
    stars: 4,
  },
  {
    id: '3',
    author: 'Alex Kim',
    body: 'Quick service and nice ambience.',
    stars: 5,
  },
];
