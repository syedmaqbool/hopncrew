// src/screens/AccountSettingsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Image } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountSettings'>;

const TEXT = '#201E20';
const BORDER = '#E4E4E6';

export default function AccountSettingsScreen({ navigation }: Props) {
  const onDelete = () => {
    // hook up real delete flow here
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* MAP BACKGROUND */}
      <Image
        source={require('../../assets/backgrounds/signin.png')}
        style={styles.mapBg}
        resizeMode="cover"
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={TEXT} />
          </Pressable>
          <Text style={styles.headerTitle}>Account Settings</Text>
        </View>

        {/* WHITE SHEET */}
        <View style={styles.sheet}>
          {/* CARD */}
          <View style={styles.card}>
            <Row
              title="Emergency Contacts"
              subtitle="Save contact will be called"
              onPress={() => navigation.navigate('EmergancyContacts')}
            />
            <Divider />
            <Row
              title="Favourite Address"
              subtitle="Your favourite address list"
              onPress={() => {
                navigation.navigate('FavouriteAddress');
              }}
            />
            <Divider />
            <Row
              title="Favourite Drivers"
              subtitle="Your favourite drivers list"
              onPress={() => {
                navigation.navigate('FavouriteDrivers');
              }}
            />
          </View>

          {/* DELETE LINK */}
          <Pressable onPress={onDelete} style={styles.deleteWrap}>
            <Text style={styles.deleteText}>Delete your Account</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Row({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#B1B1B4" />
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
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

  card: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  rowTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
  },
  rowSub: {
    marginTop: 6,
    fontSize: 16,
    color: '#A1A3AA',
    fontFamily: FONTS.regular,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
  },

  deleteWrap: {
    marginTop: 40,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 18,
    color: '#E53935',
    fontFamily: FONTS.semibold,
  },
});
