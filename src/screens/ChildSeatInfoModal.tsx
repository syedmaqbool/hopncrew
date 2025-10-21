// src/screens/ChildSeatInfoModal.tsx
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChildSeatInfo'>;

const MINT = '#B9FBE7';

const SEAT_GUIDES = [
  {
    id: 'infantRear',
    title: 'Infant Rear Face',
    icon: require('../../assets/icons/child_one.png'),
    body:
      'Use a rear-facing seat for infants and small toddlers. It offers the best support for the head, neck and spine in a collision.',
  },
  {
    id: 'toddlerFront',
    title: 'Toddler Front Face',
    icon: require('../../assets/icons/child_seven.png'),
    body:
      'Forward-facing seats are for children who have outgrown rear-facing seats. Use a tether and harness properly for best protection.',
  },
  {
    id: 'toddlerRear',
    title: 'Toddler Rear Face',
    icon: require('../../assets/icons/child_eight.png'),
    body:
      'Keep your child rear-facing as long as they fit the height and weight limits of the seat. This position reduces crash forces.',
  },
  {
    id: 'booster',
    title: 'Booster',
    icon: require('../../assets/icons/child_six.png'),
    body:
      'Booster seats position the seatbelt properly across the shoulder and lap. Use until your child fits the vehicle seatbelt alone.',
  },
];

export default function ChildSeatInfoModal({ navigation }: Props) {
  return (
    <View style={styles.fill}>
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Child Seat Guide</Text>
            <Pressable style={styles.close} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={18} color="#111" />
            </Pressable>
          </View>

          <View style={styles.freePill}>
            <Text style={styles.freeText}>Free</Text>
          </View>

          <FlatList
            data={SEAT_GUIDES}
            keyExtractor={it => it.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4, paddingTop: 8 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={{ alignItems: 'center', marginBottom: 8 }}>
                  <Image
                    source={item.icon}
                    style={{ width: 84, height: 84, resizeMode: 'contain' }}
                  />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody}>{item.body}</Text>
              </View>
            )}
          />

          <Pressable style={styles.cta} onPress={() => navigation.goBack()}>
            <Text style={styles.ctaText}>Close</Text>
            <View style={styles.ctaIcon}>
              <Ionicons name="close" size={18} color="#111" />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: { color: '#111', fontWeight: '700', fontSize: 16 },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 6,
  },
  freeText: { color: '#16a34a', fontWeight: '700', fontSize: 12 },
  card: {
    width: 208,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 12,
    marginRight: 10,
  },
  cardTitle: { color: '#111', fontWeight: '700', marginBottom: 6 },
  cardBody: { color: '#666', fontSize: 12, lineHeight: 18 },
  cta: {
    marginTop: 16,
    height: 48,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
});

