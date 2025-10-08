import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceSearch'>;
const GOOGLE_PLACES_API_KEY = 'AIzaSyBp7k8-SYDkEkhcGbXQ9f_fAXPXmwmlvUQ'; // TODO: move to env later

export default function PlaceSearchModal({ navigation, route }: Props) {
  const ref = useRef<GooglePlacesAutocompleteRef>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#111" />
        </Pressable>
        <Text style={styles.title}>Where are you going?</Text>
        <View style={{ width: 36 }} />
      </View>

      <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Search places"
        fetchDetails
        textInputProps={{
          placeholderTextColor: '#111', // ✅ your placeholder color
        }}
        autoFillOnNotFound={false}
        currentLocation={false}
        currentLocationLabel="Current location"
        disableScroll={false}
        enableHighAccuracyLocation={true}
        filterReverseGeocodingByTypes={[]}
        GooglePlacesDetailsQuery={{}}
        GooglePlacesSearchQuery={{
          rankby: 'distance',
          type: 'restaurant',
        }}

        isRowScrollable={true}
        keyboardShouldPersistTaps="always"
        listUnderlayColor="#c8c7cc"
        listViewDisplayed="auto"
        keepResultsAfterBlur={false}
        numberOfLines={1}
        onFail={() => {
          console.warn('Autocomplete failed');
        }}
        onNotFound={() => {
          console.log('No results found');
        }}
        onTimeout={() =>
          console.warn('Google Places Autocomplete: Request timeout')
        }
        predefinedPlacesAlwaysVisible={false}
        suppressDefaultStyles={false}
        textInputHide={false}

        timeout={20000}

        enablePoweredByContainer={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={250}
        minLength={2}
        predefinedPlaces={[]}
        onPress={(data, details) => {
          console.log(data, details, "test data");
          if (!details) return;
          const { lat, lng } = details.geometry.location;
          const dest = {
            latitude: lat,
            longitude: lng,
            description: data.description,
            placeId: data.place_id,
          };
          // OPTION A: merge params into existing Home route
          // navigation.navigate({ name: 'Home', params: { dest }, merge: true });
          // navigation.goBack();

          // OPTION B (recommended): callback passed from Home
          route.params?.onPick?.(dest);
          navigation.goBack();



        }}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
          // Optional: bias to current country/region
          // components: 'country:us',
        }}

        styles={{
          textInputContainer: styles.inputContainer,
          textInput: styles.input,
          listView: styles.listView,
          row: styles.row,
          separator: styles.separator,
          description: styles.rowText,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, justifyContent: 'space-between',
    marginTop: 30,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#F2F2F2',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: '700', color: '#111', },

  inputContainer: { paddingHorizontal: 12, color: '#111' },
  input: {
    height: 46, backgroundColor: '#F7F7F7', borderRadius: 24,
    paddingHorizontal: 16, color: '#111',
  },
  listView: { marginTop: 8 },
  row: { paddingVertical: 12, paddingHorizontal: 16 },
  separator: { height: 1, backgroundColor: '#EFEFEF' },
  rowText: { color: '#111' },
});
