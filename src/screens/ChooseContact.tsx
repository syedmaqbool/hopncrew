// src/screens/ChooseContact.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseContact'>;

const TEXT = '#201E20';

const CONTACTS = [
  { id: '1', name: 'Isabel Weinstein', phone: '+1 0123456789' },
  { id: '2', name: 'Victor Derosa', phone: '+1 0123456789' },
  { id: '3', name: 'Mara Markel', phone: '+1 0123456789' },
  { id: '4', name: 'Anthony Curiel', phone: '+1 0123456789' },
  { id: '5', name: 'Shemika Saavedra', phone: '+1 0123456789' },
  { id: '6', name: 'Martha Reynolds', phone: '+1 0123456789' },
  { id: '7', name: 'Robert Bailey', phone: '+1 0123456789' },
  { id: '8', name: 'Carol Keith', phone: '+1 0123456789' },
];

export default function ChooseContact({ navigation }: Props) {
  const goBack = () => navigation.goBack();

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
          <Text style={styles.headerTitle}>Choose a Contact</Text>
        </View>

        {/* SHEET */}
        <View style={styles.sheet}>
          {/* search */}
          <View style={styles.searchWrap}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#B4B6BC"
              style={styles.searchInput}
            />
            <Ionicons name="search-outline" size={20} color="#999" />
          </View>

          <FlatList
            data={CONTACTS}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 18, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <ContactRow {...item} />}
          />
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
      <Pressable style={styles.plusCircle}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
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
    paddingTop: 22,
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F6',
    borderRadius: 28,
    paddingHorizontal: 18,
    height: 56,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: TEXT,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F6',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
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
  plusCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
