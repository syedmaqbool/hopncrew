import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

// reuse DeleteSheet from FavouriteAddress if you want
import { DeleteSheet } from './FavouriteAddress'; // or copy the component in same file if you prefer

type Props = NativeStackScreenProps<RootStackParamList, 'FavouriteDrivers'>;

const TEXT = '#111111';

const drivers = [
  {
    id: '1',
    name: 'Isabel Weinstein',
    rating: '4.2',
    avatar: require('../../assets/icons/home.png'), // replace with your asset
  },
  {
    id: '2',
    name: 'Victor Derosa',
    rating: '4.1',
    avatar: require('../../assets/icons/home.png'),
  },
  {
    id: '3',
    name: 'Mara Markel',
    rating: '4.0',
    avatar: require('../../assets/icons/home.png'),
  },
];

export default function FavouriteDrivers({ navigation }: Props) {
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const openDelete = (name: string) => {
    setSelectedName(name);
    setDeleteVisible(true);
  };

  const closeDelete = () => {
    setDeleteVisible(false);
    setSelectedName(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* header */}
      <View style={styles.headerRow}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={TEXT} />
        </Pressable>
        <Text style={styles.headerTitle}>Favourite Drivers</Text>
      </View>

      {/* white content card */}
      <View style={styles.content}>
        {drivers.map((d, idx) => (
          <View key={d.id} style={{ marginBottom: idx < drivers.length - 1 ? 16 : 0 }}>
            <View style={styles.driverRow}>
              <View style={styles.avatarWrapOuter}>
                <View style={styles.avatarWrapInner}>
                  <Image source={d.avatar} style={styles.avatar} />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{d.name}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={18} color="#FFC107" />
                  <Text style={styles.ratingText}>{d.rating}</Text>
                </View>
              </View>

              <Pressable
                style={styles.deleteCircle}
                onPress={() => openDelete(d.name)}
              >
                <MaterialIcons name="delete" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <DeleteSheet
        visible={deleteVisible}
        label={selectedName ?? ''}
        onClose={closeDelete}
        onConfirm={() => {
          // remove driver in state / API
          closeDelete();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3EEE5',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    gap: 12,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F3F2',
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  avatarWrapOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarWrapInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },

  name: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.bold,
  },
  ratingRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
    color: '#777777',
    fontFamily: FONTS.semibold,
  },

  deleteCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
