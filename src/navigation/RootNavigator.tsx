import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import SetUpFace from '../screens/SetUpFace';
import FaceScanning from '../screens/FaceScanning';
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
import ChildSeatInfoModal from '../screens/ChildSeatInfoModal';
import PoliciesModal from '../screens/PoliciesModal';
import PassengerWaitModel from '../screens/PassengerWaitModel';
import DriverLateModal from '../screens/DriverLateModal';
import CancelChangeModel from '../screens/CancelChangeModel';
import RefundModal from '../screens/RefundModal';
import GuaranteedPickupModel from '../screens/GuaranteedPickupModel';
import TollsModel from '../screens/TollsModel';
import ConfirmRequestScreen from '../screens/ConfirmRequestScreen';
import PaymentBreakdownModal from '../screens/PaymentBreakdownModal';
import PaymentMethodsModal from '../screens/PaymentMethodsModal';
import AddCardModal from '../screens/AddCardModal';
import ProcessingBookingModal from '../screens/ProcessingBookingModal';
import BookingReceivedModal from '../screens/BookingReceivedModal';
import BookingReceivedTerms from '../screens/BookingReceivedTerms';
import CancelRideModal from '../screens/CancelRideModal';
import ConfirmCancelPopup from '../screens/ConfirmCancelPopup';
import NoRideAvaiable from '../screens/NoRideAvaiable';
import RideConfirmed from '../screens/RideConfirmed';
import ContactSupport from '../screens/ContactSupport';
import EnRoutePickupModal from '../screens/EnRoutePickupModal';
import EditProfileModal from '../screens/EditProfileModal';
import MyRidesModal from '../screens/MyRidesModal';
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
import RideSelectionScreen from '../screens/RideSelectionScreen';
import FlightDetails from '../screens/FlightDetails';
import ScheduleFlightScreen from '../screens/ScheduleFlightScreen';
import FlightDepartureScreen from '../screens/FlightDepartureScreen';
import AirportPickupPerksScreen from '../screens/AirportPickupPerksScreen';
import AirportGuideModal from '../screens/AirportGuideModal';
import SelectDepartureModal from '../screens/SelectDepartureModal';
import SelectedAirportScreen from '../screens/SelectedAirportScreen';
import FlightManualModal from '../screens/FlightManualModal';
import ScanBagSizeScreen from '../screens/ScanBagSizeScreen';
import CoupenPopupModal from '../screens/CoupenPopupModal';
import PaymentCashScreen from '../screens/PaymentCashScreen';
import PaymentCredit from '../screens/PaymentCreditScreen';
import PaymentGoogle from '../screens/PaymentGoogleScreen';
import PaymentApple from '../screens/PaymentAppleScreen';
import PaymentAddCreditCard from '../screens/PaymentAddCreditCard';
import PaymentAddGooglePay from '../screens/PaymentAddGooglePay';
import PaymentAddApplePay from '../screens/PaymentAddApplePay';
import PaymentPersonal from '../screens/PaymentPersonalScreen';
import PaymentPersonalEdit from '../screens/PaymentPersonalEditScreen';
import ChoosePaymentPersonal from '../screens/ChoosePaymentPersonalScreen';
import PaymentBusinessScreen from '../screens/PaymentBusinessScreen';
import BusinessEmailScreen from '../screens/BusinessEmailScreen';
import LoyaltyProgramScreen from '../screens/LoyaltyProgramScreen';
import LoyaltyDetailsScreen from '../screens/LoyaltyDetailsScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import PoliciesScreen from '../screens/PoliciesScreen';
import TermsScreen from '../screens/TermsScreen';
import EmergancyContacts from '../screens/EmergancyContacts';
import ChooseContact from '../screens/ChooseContact';
import FavouriteAddress from '../screens/FavouriteAddress';
import FavouriteDrivers from '../screens/FavouriteDrivers';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator({
  initialRoute = 'Login' as keyof RootStackParamList,
}) {
  return (
    //     </Stack.Navigator>

    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      {/* Entry */}
      <Stack.Screen name="RideSelection" component={RideSelectionScreen} />
      {/* Auth */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SetUpFace" component={SetUpFace} />
      <Stack.Screen name="FaceScanning" component={FaceScanning} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />

      {/* Main app wrapped by the drawer */}
      <Stack.Screen name="App" component={AppDrawer} />

      {/* (Remove the standalone Home from here) */}
      {/* <Stack.Screen name="Home" component={HomeScreen} />  ← delete */}

      {/* Regular stack screens (if not in drawer) */}
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ headerShown: true, title: 'Details' }}
      />
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen
        name="FlightDetails"
        component={FlightDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FlightDeparture"
        component={FlightDepartureScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="MapTracking" component={MapTrackingScreen} />
      <Stack.Screen
        name="Trip"
        component={TripScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScanBagSize"
        component={ScanBagSizeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectedAirport"
        component={SelectedAirportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScheduleFlight"
        component={ScheduleFlightScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmRequest"
        component={ConfirmRequestScreen}
        options={{ headerShown: false }}
      />
      {/* Processing is a regular full screen (not transparent) */}
      <Stack.Screen
        name="Processing"
        component={ProcessingBookingModal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContactSupport"
        component={ContactSupport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AirportDetails"
        component={AirportDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentCash"
        component={PaymentCashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentCredit"
        component={PaymentCredit}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentGoogle"
        component={PaymentGoogle}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentApple"
        component={PaymentApple}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="PaymentAddCreditCard"
        component={PaymentAddCreditCard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentAddGooglePay"
        component={PaymentAddGooglePay}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentAddApplePay"
        component={PaymentAddApplePay}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentPersonal"
        component={PaymentPersonal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentPersonalEdit"
        component={PaymentPersonalEdit}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChoosePaymentPersonal"
        component={ChoosePaymentPersonal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentBusinessScreen"
        component={PaymentBusinessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BusinessEmailScreen"
        component={BusinessEmailScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="LoyaltyProgramScreen"
        component={LoyaltyProgramScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="LoyaltyDetailsScreen"
        component={LoyaltyDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HelpSupportScreen"
        component={HelpSupportScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="ContactUsScreen"
        component={ContactUsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PoliciesScreen"
        component={PoliciesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermsScreen"
        component={TermsScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="EmergancyContacts"
        component={EmergancyContacts}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="ChooseContact"
        component={ChooseContact}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="FavouriteAddress"
        component={FavouriteAddress}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="FavouriteDrivers"
        component={FavouriteDrivers}
        options={{ headerShown: false }}
      />
      {/* PoliciesScreen ContactUsScreen */}

      {/* BusinessEmailScreen Transparent/bottom-sheet modals */}
      <Stack.Group
        screenOptions={{
          presentation: 'transparentModal',
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="SaveFavorite" component={SaveFavoriteModal} />
        <Stack.Screen
          name="SaveFavoriteDetails"
          component={SaveFavoriteDetailsModal}
        />
        <Stack.Screen name="AddPassenger" component={AddPassengerModal} />
        <Stack.Screen name="AddLuggage" component={AddLuggageModal} />
        <Stack.Screen name="LuggageScanInfo" component={LuggageScanInfoModal} />
        <Stack.Screen name="ChildSeatInfo" component={ChildSeatInfoModal} />
        <Stack.Screen
          name="OversizedLuggage"
          component={OversizedLuggageModal}
        />
        <Stack.Screen name="WhyChooseUs" component={WhyChooseUsModal} />
        <Stack.Screen name="FareOptions" component={FareOptionsModal} />
        <Stack.Screen name="SpecialRequest" component={SpecialRequestModal} />
        <Stack.Screen name="Policies" component={PoliciesModal} />
        <Stack.Screen name="PassengerWait" component={PassengerWaitModel} />
        <Stack.Screen name="DriverLate" component={DriverLateModal} />
        <Stack.Screen name="CancelChange" component={CancelChangeModel} />
        <Stack.Screen name="Refund" component={RefundModal} />
        <Stack.Screen
          name="GuaranteedPickup"
          component={GuaranteedPickupModel}
        />
        <Stack.Screen name="Tolls" component={TollsModel} />
        <Stack.Screen name="ScheduleRide" component={ScheduleRideScreen} />
        <Stack.Screen
          name="PaymentBreakdown"
          component={PaymentBreakdownModal}
        />
        <Stack.Screen
          name="AirportPickupPerks"
          component={AirportPickupPerksScreen}
        />
        <Stack.Screen name="AirportGuide" component={AirportGuideModal} />
        <Stack.Screen name="SelectDeparture" component={SelectDepartureModal} />
        <Stack.Screen name="FlightManual" component={FlightManualModal} />
        {/* If you want the Places modal here, keep naming consistent */}
        <Stack.Screen name="PlaceSearch" component={PlaceSearchModal} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsModal} />
        <Stack.Screen name="AddCard" component={AddCardModal} />
        <Stack.Screen name="BookingReceived" component={BookingReceivedModal} />
        <Stack.Screen name="CoupenPopup" component={CoupenPopupModal} />
        <Stack.Screen
          name="BookingReceivedTerms"
          component={BookingReceivedTerms}
        />
        <Stack.Screen name="CancelRide" component={CancelRideModal} />
        <Stack.Screen
          name="ConfirmCancelPopup"
          component={ConfirmCancelPopup}
        />
        <Stack.Screen name="NoRideAvaiable" component={NoRideAvaiable} />
        <Stack.Screen name="RideConfirmed" component={RideConfirmed} />
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
          name="HelpCenterScreen"
          component={HelpCenterScreen}
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
