// src/screens/CreditCardsModal.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreditCards'>;

type Card = {
  id: string;
  brand: 'visa' | 'mastercard';
  last4: string;
  expMonth: number;
  expYear: number;
};

const MINT = '#B9FBE7';

export default function CreditCardsModal({ navigation }: Props) {
  const [cards, setCards] = useState<Card[]>([
    { id: 'c1', brand: 'visa', last4: '5967', expMonth: 7,  expYear: 2026 },
    { id: 'c2', brand: 'mastercard', last4: '2841', expMonth: 5,  expYear: 2027 },
  ]);

  const remove = (id: string) => {
    Alert.alert('Remove card?', 'Are you sure you want to delete this payment method?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setCards(cs => cs.filter(c => c.id !== id)) },
    ]);
  };

  return (
    <View style={styles.fill}>
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        <View style={styles.topBar}>
          <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={18} color="#111" />
          </Pressable>
          <Text style={styles.title}>Credit Cards</Text>
          <View style={{ width: 34 }} />
        </View>

        <View style={styles.sheet}>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
            {cards.map(card => (
              <View key={card.id} style={styles.cardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.brand}>
                    {card.brand === 'visa' ? 'VISA' : 'Mastercard'}
                  </Text>
                  <Text style={styles.mask}>••••  ••••  ••••  {card.last4}</Text>
                  <Text style={styles.expLabel}>Expiry date</Text>
                  <Text style={styles.expVal}>
                    {String(card.expMonth).padStart(2, '0')}/{card.expYear}
                  </Text>
                </View>

                <Pressable style={styles.trashBtn} onPress={() => remove(card.id)}>
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                </Pressable>
              </View>
            ))}

            <Pressable style={styles.addBtn} onPress={() => navigation.navigate('AddCard',{onAdded: (card) => {}})}>
              <Text style={styles.addText}>Add New Card</Text>
              <View style={styles.addIcon}>
                <Ionicons name="add" size={18} color="#111" />
              </View>
            </Pressable>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },

  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  topBar: {
    position: 'absolute', top: 8, left: 12, right: 12, zIndex: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  roundBtn: {
    width: 34, height: 34, borderRadius: 17,marginTop:80,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#EEE',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { color: '#111', fontSize: 16, fontFamily: 'BiennaleBold' },

  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 400,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#EFEFEF',
  },
  brand: { color: '#6E6E6E', marginBottom: 2, fontFamily: 'BiennaleBold' },
  mask: { color: '#111', marginBottom: 12, fontFamily: 'BiennaleBold' },
  expLabel: { color: '#9BA1A6', fontSize: 12 },
  expVal: { color: '#111', marginTop: 2, fontFamily: 'BiennaleBold' },

  trashBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#111', alignItems: 'center', justifyContent: 'center',
  },

  addBtn: {
    marginTop: 6, height: 50, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  addText: { color: '#fff', fontFamily: 'BiennaleBold' },
  addIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: MINT, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 10,
  },
});
