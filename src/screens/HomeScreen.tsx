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

  const openPlaces = () => {
    navigation.navigate('AirportDetails', {
      title: 'Services near Gate B12',
      items: [
        { id: '1', title: 'Coffee Way', subtitle: 'Terminal 1, Gate B10' },
        { id: '2', title: 'ATM – Bank Privat 01', subtitle: 'Near Security A' },
        { id: '3', title: 'ATM – Bank Privat 02', subtitle: 'Near Security B' },
        { id: '4', title: 'ATM – Bank Privat 03', subtitle: 'Near Security C' },
        { id: '5', title: 'ATM – Bank Privat 04', subtitle: 'Near Security D' },
        { id: '6', title: 'ATM – Bank Privat 05', subtitle: 'Near Security E' },
        { id: '7', title: 'ATM – Bank Privat 06', subtitle: 'Near Security F' },
        { id: '8', title: 'ATM – Bank Privat 07', subtitle: 'Near Security G' },
        { id: '9', title: 'ATM – Bank Privat 08', subtitle: 'Near Security H' },
        {
          id: '10',
          title: 'ATM – Bank Privat 09',
          subtitle: 'Near Security I',
        },
        {
          id: '11',
          title: 'ATM – Bank Privat 10',
          subtitle: 'Near Security J',
        },
        {
          id: '12',
          title: 'ATM – Bank Privat 11',
          subtitle: 'Near Security K',
        },
        {
          id: '13',
          title: 'ATM – Bank Privat 12',
          subtitle: 'Near Security L',
        },
        {
          id: '14',
          title: 'ATM – Bank Privat 13',
          subtitle: 'Near Security M',
        },
        {
          id: '15',
          title: 'ATM – Bank Privat 14',
          subtitle: 'Near Security N',
        },
      ],
      onPick: (poi: any) => {
        console.log('Selected POI:', poi);
      },
    });
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
          <Ionicons name="search" size={18} color="#9AA0A6" />
          <Pressable style={{ flex: 1 }} onPress={openPlaces}>
            <Text style={{ color: '#000000', fontFamily: FONTS.medium }}>
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
            <Ionicons name="heart-outline" size={18} color="#9AA0A6" />
          </Pressable>
        </View>

        {/* Cards row (sample data) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 12 }}
        >
          {MOCK_POSTS.map(p => (
            <View key={p.id} style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <View>
                  <Image
                    source={assets.images.avatarMan}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
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
                  gap: 8,
                }}
              >
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < p.stars ? 'star' : 'star-outline'}
                      size={14}
                      color="#FFC107"
                    />
                  ))}
                </View>

                <Text style={styles.cardSub}>15 November</Text>
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
            <Ionicons name="home-outline" size={18} color="#111" />
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
            <Ionicons name="briefcase-outline" size={18} color="#111" />
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
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },

  greeting: {
    fontSize: 18,
    color: '#111',
    marginTop: 12,
    marginBottom: 20,
    fontFamily: FONTS.semibold,
  },
  googleText: {
    color: '#1976D2',
    fontFamily: FONTS.regular,
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
    elevation: 2,
    width: '94%',
    alignSelf: 'center',
  },

  card: {
    marginTop: 20,
    width: 230,
    padding: 12,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 0,
    borderColor: '#EFEFEF',
    elevation: 1,
    marginBottom: 16,
  },
  cardTitle: { color: '#111', fontFamily: FONTS.medium },
  cardSub: { color: '#888', fontSize: 12, fontFamily: FONTS.regular },
  cardBody: { marginTop: 10, color: '#444', fontFamily: FONTS.regular },
  starsRow: { flexDirection: 'row', gap: 4, marginTop: 20 },

  quickList: { marginTop: 0, gap: 10 },
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
  quickText: { color: '#111', fontFamily: FONTS.medium },

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
