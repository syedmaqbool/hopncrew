// src/screens/EmergancyContacts.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image } from 'react-native';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergancyContacts'>;

const TEXT = '#201E20';

export default function EmergancyContacts({ navigation }: Props) {
  const goBack = () => navigation.goBack();

  const goChooseContact = () => {
    navigation.navigate('ChooseContact');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* MAP */}
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
          <Text style={styles.headerTitle}>Emergency Contacts</Text>
        </View>

        {/* SHEET */}
        <View style={styles.sheet}>
          {/* Info card */}
          <View style={styles.outerCard}>
            <View style={styles.innerCard}>
              <View style={styles.sirenCircle}>
                <MaterialCommunityIcons
                  name="alarm-light"
                  size={32}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.infoText}>
                In case you have emergency during your trip, you can call on SOS
                button and saved contact will be called.
              </Text>
            </View>
          </View>

          {/* Saved contacts */}
          <View style={{ marginTop: 26, gap: 16 }}>
            <ContactRow name="Isabel Weinstein" phone="+1 0123456789" />
            <ContactRow name="Victor Derosa" phone="+1 0123456789" />
          </View>

          {/* Button */}
          <Pressable style={styles.btn} onPress={goChooseContact}>
            <Text style={styles.btnLabel}>Choose Other Contact</Text>
            <View style={styles.btnIconWrap}>
              <Ionicons name="person-outline" size={22} color={TEXT} />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function ContactRow({ name, phone }: { name: string; phone: string }) {
  return (
    <View style={styles.contactRow}>
      <View style={styles.avatarRing}>
        <View style={styles.avatarInner}>
          <Ionicons name="person-outline" size={26} color="#555" />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.contactName}>{name}</Text>
        <Text style={styles.contactPhone}>{phone}</Text>
      </View>
      <Pressable style={styles.deleteCircle}>
        <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
      </Pressable>
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
    borderRadius: 30,
    padding: 16,
  },
  innerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  sirenCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: '#9B9EA5',
    fontFamily: FONTS.regular,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F6',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatarRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#E5E5E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
  },
  contactPhone: {
    marginTop: 4,
    fontSize: 16,
    color: '#A1A3AA',
    fontFamily: FONTS.regular,
  },
  deleteCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  btn: {
    marginTop: 40,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: FONTS.semibold,
  },
  btnIconWrap: {
    position: 'absolute',
    right: 8,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
