// src/screens/FavouriteAddressesModal.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, FlatList, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Swipeable } from 'react-native-gesture-handler';
<<<<<<< HEAD
=======
import { FONTS } from '../../src/theme/fonts';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FavouriteAddresses'>;

export type FavAddr = {
  id: string;
  label?: 'Home' | 'Work' | 'Other';
  title: string;
  subtitle: string;
};

const MINT = '#B9FBE7';

export default function FavouriteAddressesModal({ navigation }: Props) {
  // mock data – replace with your store/API
  const [home, setHome] = useState<FavAddr | null>({
    id: 'home',
    label: 'Home',
    title: 'Home',
    subtitle: '1507 Hewes Avenue Baltimore, MD 21202',
  });
  const [work, setWork] = useState<FavAddr | null>({
    id: 'work',
    label: 'Work',
    title: 'Work',
    subtitle: '45 Saint Clair Street New Albany, MS 38652',
  });
  const [others, setOthers] = useState<FavAddr[]>([
    { id: 'o1', label: 'Other', title: 'Bank Privat', subtitle: 'Mykhailivska St, 4B, Kiev, UA' },
    { id: 'o2', label: 'Other', title: 'Bank-Free UA', subtitle: 'Tsvetaeva St, 95, Kiev, UA' },
    { id: 'o3', label: 'Other', title: 'Walnut & Garfield', subtitle: 'Sofiivska St, 32, Kiev, UA' },
  ]);

  const headerRows = useMemo(() => [home, work].filter(Boolean) as FavAddr[], [home, work]);

  const removeOther = (id: string) =>
    setOthers(prev => prev.filter(o => o.id !== id));

  const onAdd = () => {
    // You can open your Google Places modal or SaveFavoriteDetailsModal here
    navigation.navigate('SaveFavoriteDetails', {
      onConfirm: (payload) => {
        setOthers(prev => [
          ...prev,
          {
            id: String(Date.now()),
            label: 'Other',
            title: payload.title || 'Other',
            subtitle: payload.address,
          },
        ]);
      },
    } as any);
  };

  return (
    <View style={styles.wrap}>
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        {/* Top bar */}
        <View style={styles.header}>
          <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={18} color="#111" />
          </Pressable>
          <Text style={styles.title}>Favourite Address</Text>
          <View style={{ width: 32 }} />
        </View>

        <FlatList
          ListHeaderComponent={
            <>
              {/* Home / Work card */}
              <View style={styles.hwCard}>
                {headerRows.map((it, idx) => (
                  <Pressable
                    key={it.id}
                    style={[styles.hwRow, idx === 0 && { borderTopLeftRadius: 14, borderTopRightRadius: 14 }]}
                    onPress={() => {}}
                  >
                    <View style={styles.pinIcon}>
                      <Ionicons name="home-outline" size={16} color="#111" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{it.title}</Text>
                      <Text style={styles.rowSub} numberOfLines={1}>{it.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
                  </Pressable>
                ))}
              </View>

              {/* Section label */}
              <Text style={styles.section}>Other</Text>
            </>
          }
          data={others}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 22 }}
          renderItem={({ item }) => (
            <Swipeable
              overshootRight={false}
              renderRightActions={() => (
                <Pressable style={styles.deletePane} onPress={() => removeOther(item.id)}>
                  <Ionicons name="trash" size={20} color="#fff" />
                </Pressable>
              )}
            >
              <Pressable style={styles.otherRow} onPress={() => {}}>
                <View style={styles.pinIcon}>
                  <MaterialCommunityIcons name="map-marker-outline" size={16} color="#111" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowSub} numberOfLines={1}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
              </Pressable>
            </Swipeable>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />

        {/* CTA */}
        <Pressable style={styles.cta} onPress={onAdd}>
          <Text style={styles.ctaText}>Add Other Address</Text>
          <View style={styles.ctaIcon}>
            <Ionicons name="add" size={18} color="#111" />
          </View>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },

  sheet: {
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6,
  },
  roundBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F2F3F4', alignItems: 'center', justifyContent: 'center',
  },
<<<<<<< HEAD
  title: { fontSize: 16, fontWeight: '800', color: '#111' },
=======
  title: { fontSize: 16, color: '#111', fontFamily: FONTS.bold },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  hwCard: {
    marginTop: 8, marginHorizontal: 14,
    borderRadius: 16, borderWidth: 1, borderColor: '#EEEEEE', overflow: 'hidden',
    backgroundColor: '#fff',
  },
  hwRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 12, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#EFEFEF',
  },

<<<<<<< HEAD
  section: { marginTop: 16, marginHorizontal: 14, color: '#8C8C8C', fontWeight: '700' },
=======
  section: { marginTop: 16, marginHorizontal: 14, color: '#8C8C8C', fontFamily: FONTS.bold },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  otherRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 12, paddingVertical: 14,
    borderRadius: 16, borderWidth: 1, borderColor: '#EEEEEE', backgroundColor: '#fff',
  },
  deletePane: {
    width: 64, marginLeft: 8, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#E53935',
  },

  pinIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#F6F7F8', alignItems: 'center', justifyContent: 'center',
  },
<<<<<<< HEAD
  rowTitle: { color: '#111', fontWeight: '700' },
=======
  rowTitle: { color: '#111', fontFamily: FONTS.bold },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  rowSub: { color: '#8C8C8C' },

  cta: {
    marginHorizontal: 14, marginBottom: 16, marginTop: 6,
    height: 50, borderRadius: 26, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
<<<<<<< HEAD
  ctaText: { color: '#fff', fontWeight: '700' },
=======
  ctaText: { color: '#fff', fontFamily: FONTS.bold },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  ctaIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: MINT, alignItems: 'center', justifyContent: 'center',
  },
});
