import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useLocation } from '../hooks/useLocation'; // your hook
import { useNavigation, useRoute, DrawerActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList,Destination } from '../navigation/types';
// import type { RouteProp } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { AppDrawerParamList } from '../navigation/AppDrawer';

// 
// const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
// const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation, route }: Props) {
   const dest = route.params?.dest; 
  const { location, getCurrent, startWatching, stopWatching, watching } = useLocation();
  const mapRef = useRef<MapView>(null);
  const drawer = useNavigation<DrawerNavigationProp<AppDrawerParamList>>();
  
  const openMenu = () => {
  // Works from nested screens too
  navigation.dispatch(DrawerActions.openDrawer());
};
  // Kick off a one-shot location + begin/stop watching while mounted
  // useEffect(() => {
  //   void getCurrent();
  //   startWatching();
  //   return () => stopWatching();
  // }, [getCurrent, startWatching, stopWatching]);

  // // Smoothly move camera whenever we get a fresh fix
  // useEffect(() => {
  //   if (location && mapRef.current) {
    
  //     mapRef.current?.setCamera({
  //       center: {
  //         latitude: location.lat,
  //         longitude: location.lon,
  //       },
  //       zoom: 15,
  //       heading: 0,
  //       pitch: 0,
  //     });
  //   }
  // }, [location]);



  const initialRegion: Region = useMemo(
    () =>
      location
        ? {
            latitude: location.lat,
            longitude: location.lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }
        : {
            // fallback (adjust to your city)
            latitude: 24.8607,
            longitude: 67.0011,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          },
    [location]
  );

  const recenter = () => {
    if (location && mapRef.current) {
      mapRef.current.animateCamera(
        { center: { latitude: location.lat, longitude: location.lon }, zoom: 16 },
        { duration: 500 }
      );
    } else {
      void getCurrent();
    }
  };

  const openPlaces = () => {
  //   console.log('openPlaces');
  // navigation.navigate('PlaceSearch', {
    
  //     onPick: (d: Destination) => {
  //       console.log('Picked', d);
  //       mapRef.current?.animateCamera(
  //         { center: { latitude: d.latitude, longitude: d.longitude }, zoom: 16 },
  //         { duration: 600 }
  //       );
  //     },
  //   });
  navigation.navigate('AirportDetails',{

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
                      { id: '10', title: 'ATM – Bank Privat 09', subtitle: 'Near Security I' },
                        { id: '11', title: 'ATM – Bank Privat 10', subtitle: 'Near Security J' },
                        { id: '12', title: 'ATM – Bank Privat 11', subtitle: 'Near Security K' },
                          { id: '13', title: 'ATM – Bank Privat 12', subtitle: 'Near Security L' },
                          { id: '14', title: 'ATM – Bank Privat 13', subtitle: 'Near Security M' },
                            { id: '15', title: 'ATM – Bank Privat 14', subtitle: 'Near Security N' },
              // ...
            ],
            onPick: (poi) => {
              // e.g., move map camera, fill destination field, etc.
              console.log('Selected POI:', poi);
            },

          })
};

  return (
    <SafeAreaView style={styles.safe}>
      {/* Map header block */}
      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation={!!location}   // only after permission/getCurrent succeeds
          showsMyLocationButton={false}
          toolbarEnabled={false}
        >
          {location && (
            <Marker
              coordinate={{ latitude: location.lat, longitude: location.lon }}
              title="You"
              description="Current location"
            />
          )}
        </MapView>

        {/* top-left menu button */}
        <Pressable style={styles.iconBtnTL} onPress={() => { openMenu(); }}>
          <Ionicons name="menu" size={18} color="#111" />
        </Pressable>

        {/* top-right recenter button */}
        <Pressable style={styles.iconBtnTR} onPress={recenter}>
          <MaterialIcons name="my-location" size={18} color="#111" />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Good afternoon, Saqib</Text>

        {/* Search pill */}
       <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#9AA0A6" />
          <Pressable style={{ flex: 1 }} onPress={() => openPlaces ()}>
            <Text style={{ color: '#9AA0A6' }}>Where are you going?</Text>
          </Pressable>
           <Pressable onPress={() => {
              navigation.navigate('SaveFavorite', {
                address: '', // or prefill with speech-to-text result
                onSave: (fav) => {
                  console.log('Saved favourite:', fav);
                  // TODO: persist with AsyncStorage or your backend
                  // AsyncStorage.setItem(`fav:${fav.id}`, JSON.stringify(fav))
                },
              });
            }}>
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.avatar} />
                <View>
                  <Text style={styles.cardTitle}>{p.author}</Text>
                  <Text style={styles.cardSub}>Post on Google</Text>
                </View>
              </View>
              <Text numberOfLines={2} style={styles.cardBody}>{p.body}</Text>
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
            </View>
          ))}
        </ScrollView>

        {/* Quick actions */}
        <View style={styles.quickList}>
          <Pressable style={styles.quickItem}  onPress={() => navigation.navigate('Trip')}>
            <Ionicons name="home-outline" size={18} color="#111" />
            <Text style={styles.quickText}>Home</Text>
          </Pressable>
          <Pressable style={styles.quickItem}  onPress={() => navigation.navigate('WhyChooseUs', {
                  onClose: () => console.log('Closed Why Choose Us'),
                })}>
            <Ionicons name="briefcase-outline" size={18} color="#111" />
            <Text style={styles.quickText}>Work</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const MINT = '#B9FBE7';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  // Map occupies the top ~40–45% with rounded bottom corners
  mapWrap: {
    height: 260,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: MINT,
  },

  iconBtnTL: {
    position: 'absolute', top: 32, left: 12,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    elevation: 2,
  },
  iconBtnTR: {
    position: 'absolute', top: 12, right: 12,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    elevation: 2,
  },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },

  greeting: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 10 },

  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 24, paddingHorizontal: 14, height: 44,
    borderWidth: 1, borderColor: '#EEE', elevation: 1,
  },
  searchInput: { flex: 1, color: '#111', paddingVertical: 0 },

  card: {
    width: 230,
    padding: 12,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#EFEFEF',
    elevation: 2,
  },
  avatar: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#EAEAEA',
  },
  cardTitle: { fontWeight: '700', color: '#111' },
  cardSub: { color: '#888', fontSize: 12 },
  cardBody: { marginTop: 8, color: '#444' },
  starsRow: { flexDirection: 'row', gap: 4, marginTop: 10 },

  quickList: { marginTop: 8, gap: 10 },
  quickItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, paddingHorizontal: 10,
    borderRadius: 12, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#EFEFEF',
  },
  quickText: { color: '#111', fontWeight: '600' },
});

const MOCK_POSTS = [
  { id: '1', author: 'John Cham', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit…', stars: 5 },
  { id: '2', author: 'Jane Doe', body: 'Great place to visit. Friendly staff and clean area.', stars: 4 },
  { id: '3', author: 'Alex Kim', body: 'Quick service and nice ambience.', stars: 5 },
];
