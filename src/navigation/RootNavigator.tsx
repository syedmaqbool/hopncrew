import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import SignupScreen from '../screens/SignupScreen';
import LocationScreen from '../screens/LocationScreen';
import MapTrackingScreen from '../screens/MapTrackingScreen';
import PlaceSearchModal from '../screens/PlaceSearchModal';
import TripScreen from '../screens/TripScreen';
import AirportDetailsScreen from '../screens/AirportDetailsScreen';
import SaveFavoriteModal from '../screens/SaveFavoriteModal';
import SaveFavoriteDetailsModal from '../screens/SaveFavoriteDetailsModal';
import AddPassengerModal from '../screens/AddPassengerModal';
import AddLuggageModal from '../screens/AddLuggageModal';
import LuggageScanInfoModal from '../screens/LuggageScanInfoModal';
import OversizedLuggageModal from '../screens/OversizedLuggageModal';
import ScheduleRideScreen from '../screens/ScheduleRideScreen';
import WhyChooseUsModal from '../screens/WhyChooseUsModal';
import FareOptionsModal from '../screens/FareOptionsModal';
import SpecialRequestModal from '../screens/SpecialRequestModal';
import PoliciesModal from '../screens/PoliciesModal';
import ConfirmRequestScreen from '../screens/ConfirmRequestScreen';
import PaymentBreakdownModal from '../screens/PaymentBreakdownModal';
import PaymentMethodsModal from '../screens/PaymentMethodsModal';
import AddCardModal from '../screens/AddCardModal';
import ProcessingBookingModal from '../screens/ProcessingBookingModal';
import EnRoutePickupModal from '../screens/EnRoutePickupModal'
import EditProfileModal from '../screens/EditProfileModal'
import MyRidesModal from '../screens/MyRidesModal'
import RideDetailsModal from '../screens/RideDetailsModal';
import NotificationsScreen from '../screens/NotificationsScreen';
import WalletScreen from '../screens/WalletScreen';
import PaymentScreen from '../screens/PaymentScreen';
import CreditCardsModal from '../screens/CreditCardsModal';
import GooglePayModal from '../screens/GooglePayModal';
import AddPaymentMethodModal from '../screens/AddPaymentMethodModal';
import SettingsModal from '../screens/SettingsModal';
import AccountSettingsModal from '../screens/AccountSettingsModal';
import FavouriteAddressesModal from '../screens/FavouriteAddressesModal';
import AppDrawer from './AppDrawer';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (

//     </Stack.Navigator>
<Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      {/* Auth */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />

      {/* Main app wrapped by the drawer */}
      <Stack.Screen name="App" component={AppDrawer} />

      {/* (Remove the standalone Home from here) */}
      {/* <Stack.Screen name="Home" component={HomeScreen} />  ← delete */}

      {/* Regular stack screens (if not in drawer) */}
      <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: true, title: 'Details' }}/>
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="MapTracking" component={MapTrackingScreen} />
      <Stack.Screen name="Trip" component={TripScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AirportDetails" component={AirportDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Wallet" component={WalletScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />




      {/* Transparent/bottom-sheet modals */}
      <Stack.Group screenOptions={{ presentation: 'transparentModal', headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
        <Stack.Screen name="SaveFavorite" component={SaveFavoriteModal} />
        <Stack.Screen name="SaveFavoriteDetails" component={SaveFavoriteDetailsModal} />
        <Stack.Screen name="AddPassenger" component={AddPassengerModal} />
        <Stack.Screen name="AddLuggage" component={AddLuggageModal} />
        <Stack.Screen name="LuggageScanInfo" component={LuggageScanInfoModal} />
        <Stack.Screen name="OversizedLuggage" component={OversizedLuggageModal} />
        <Stack.Screen name="WhyChooseUs" component={WhyChooseUsModal} />
        <Stack.Screen name="FareOptions" component={FareOptionsModal} />
        <Stack.Screen name="SpecialRequest" component={SpecialRequestModal} />
        <Stack.Screen name="Policies" component={PoliciesModal} />
        <Stack.Screen name="ConfirmRequest" component={ConfirmRequestScreen} />
        <Stack.Screen name="ScheduleRide" component={ScheduleRideScreen} />
        <Stack.Screen name="PaymentBreakdown" component={PaymentBreakdownModal} />
        {/* If you want the Places modal here, keep naming consistent */}
        <Stack.Screen name="PlaceSearch" component={PlaceSearchModal} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsModal} />
        <Stack.Screen name="AddCard" component={AddCardModal} />
        <Stack.Screen
            name="Processing"
            component={ProcessingBookingModal}
            options={{
              presentation: 'transparentModal',
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' }, // keep map visible
            }}
          />
          <Stack.Screen
          name="EnRoute"
          component={EnRoutePickupModal}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' }, // map stays visible
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileModal}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name="MyRides"
          component={MyRidesModal}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name="RideDetails"
          component={RideDetailsModal}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
        name="CreditCards"
        component={CreditCardsModal}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
          name="GooglePay"
          component={GooglePayModal}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
        name="AddPaymentMethod"
        component={AddPaymentMethodModal}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsModal}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
          name="AccountSettings"
          component={AccountSettingsModal}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />

        <Stack.Screen
        name="FavouriteAddresses"
        component={FavouriteAddressesModal}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />

      </Stack.Group>
    </Stack.Navigator>
  );
}
