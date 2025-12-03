// src/screens/AddPaymentMethodModal.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPaymentMethod'>;

export default function AddPaymentMethodModal({ navigation }: Props) {
  const close = () => navigation.goBack();

  return (
    <View style={styles.wrap}>
      {/* dim background; tap to dismiss */}
      <Pressable style={styles.backdrop} onPress={close} />

      {/* bottom sheet */}
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Payment Method</Text>
          <Pressable onPress={close} hitSlop={10}>
            <Ionicons name="close" size={28} color="#8D8E8F" />
          </Pressable>
        </View>

        {/* options */}
        <View style={styles.list}>
          <RowButton
            icon={
              // <MaterialCommunityIcons
              //   name="credit-card-outline"
              //   size={22}
              //   color="#FFFFFF"
              // />
              <Image source={require('../../assets/icons/card-white-icon.png')} alt='card' style={{width:33,height:22}} />
            }
            label="Credit Card"
            onPress={() => {
              close();
              navigation.navigate('PaymentAddCreditCard');
            }}
          />
          <RowButton
            icon={
              <Image source={require('../../assets/icons/g-white-icon.png')} alt='card' style={{width:22,height:23}} />
            }
            label="Google Pay"
            onPress={() => {
              close();
              navigation.navigate('PaymentAddGooglePay', {
                email: 'paula.lewis69@gmail.com',
              });
            }}
          />
          <RowButton
            icon={
              <Image source={require('../../assets/icons/a-white-icon.png')} alt='card' style={{width:23,height:28}} />
            }
            label="Apple Pay"
            onPress={() => {
              close();
              navigation.navigate('PaymentAddApplePay', {
                email: 'paula.lewis69@gmail.com',
              });
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function RowButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        {icon}
        <Text style={styles.rowText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 26,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 30
  },
  title: {
    fontSize: 20,
    color: '#201E20',
    fontFamily: FONTS.regular,
  },

  list: {
    gap: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111013',
    borderRadius: 18,
    height:79,
    paddingHorizontal: 20,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: FONTS.regular,
    lineHeight:26
  },
});
