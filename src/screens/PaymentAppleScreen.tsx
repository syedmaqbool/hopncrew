import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const TEXT = '#201E20';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentApple'>;

export default function PaymentAppleScreen({ navigation, route }: Props) {
  const goBack = () => navigation.goBack();
  const email = route.params?.email ?? 'paula.lewis69@gmail.com';

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* MAP / BACKGROUND */}
      <Image
        source={require('../../assets/backgrounds/signin.png')}
        style={styles.mapBg}
        resizeMode="cover"
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={TEXT} />
          </Pressable>
          <Text style={styles.headerTitle}>Apple Pay</Text>
        </View>

        {/* WHITE SHEET */}
        <View style={styles.sheet}>
          {/* Outer grey card */}
          <View style={styles.outerCard}>
            <Text style={styles.cardTitle}>
              Accepting Apple pay is faster than accepting traditional apple
              device & move consumer away from physical wallet.
            </Text>

            {/* Inner white pill */}
            <View style={styles.innerCard}>
              <View style={styles.rowLeft}>
                <View style={styles.methodIcon}>
                  <Image source={require('../../assets/icons/apay-icon.png')} alt='pay-cash' style={{height:27,width:22}} />
                </View>
                <View>
                  <Text style={styles.methodTitle}>Apple Pay</Text>
                  <Text style={styles.methodSub}>{email}</Text>
                </View>
              </View>

              <Pressable style={styles.deleteBtn}>
                <Image source={require('../../assets/icons/del-icon.png')} alt='visa-icon' style={{height:22,width:16}} />
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '35%',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 10,
    justifyContent: 'flex-start',
    gap: 12,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 32,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  sheet: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  outerCard: {
    backgroundColor: '#F4F4F6',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  cardTitle: {
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
    marginBottom: 18,
    lineHeight: 24,
  },

  innerCard: {
    backgroundColor: '#FCFCFC',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.regular,
  },
  methodSub: {
    fontSize: 14,
    color: '#8D8E8F',
    fontFamily: FONTS.regular,
    marginTop: 2,
  },

  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
