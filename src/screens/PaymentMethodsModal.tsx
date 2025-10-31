// src/screens/PaymentMethodsModal.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type {
  RootStackParamList,
  SavedCard,
  PayMethodKey,
} from '../navigation/types';
import assets from '../../assets';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentMethods'>;

const MINT = '#B9FBE7';

const brandIcon = (brand: SavedCard['brand']) => {
  switch (brand) {
    case 'visa':
      return <MaterialCommunityIcons name="visa" size={28} color="#1A1F71" />;
    case 'mastercard':
      return (
        <MaterialCommunityIcons
          name="credit-card-outline"
          size={24}
          color="#EB001B"
        />
      );
    case 'amex':
      return (
        <MaterialCommunityIcons
          name="credit-card-outline"
          size={24}
          color="#2E77BC"
        />
      );
    default:
      return (
        <MaterialCommunityIcons
          name="credit-card-outline"
          size={24}
          color="#111"
        />
      );
  }
};

export default function PaymentMethodsModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const initial = route.params?.selected ?? 'card';
  const [method, setMethod] = useState<PayMethodKey>(initial);
  const initialCards = useMemo<SavedCard[]>(
    () =>
      route.params?.cards ?? [
        { id: 'card_1', brand: 'visa', last4: '4242', exp: '12/27' },
        { id: 'card_2', brand: 'mastercard', last4: '1188', exp: '03/28' },
      ],
    [route.params?.cards],
  );
  const [cards, setCards] = useState<SavedCard[]>(initialCards);
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>(
    cards[0]?.id,
  );

  const goProcessing = () => {
    navigation.navigate('Processing', {
      durationMs: 5000,
      start: route.params?.start,
      dest: route.params?.dest,
    });
  };

  const addCard = () => {
    navigation.navigate('AddCard', {
      onAdded: (card: SavedCard) => {
        setCards(prev => {
          const next = [...prev, card];
          // preselect the newly added card
          setSelectedCardId(card.id);
          setMethod('card');
          return next;
        });
      },
    });
  };

  const submit = () => {
    // Persist selection (optional)
    route.params?.onSelect?.({
      method,
      cardId: method === 'card' ? selectedCardId : undefined,
    });

    if (method === 'card') {
      // if user chose card but hasn't selected any, send them to Add Card
      if (!selectedCardId) return addCard();
      // else proceed to processing
      return goProcessing();
    }

    // wallet or cash -> direct processing
    return goProcessing();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* dim the map/content behind */}
      <Pressable
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'rgba(0,0,0,0.1)' },
        ]}
        onPress={() => navigation.goBack()}
      />

      <SafeAreaView edges={['bottom']} style={styles.wrap}>
        <View style={[styles.sheet, { paddingTop: insets.top + 8 }]}>
          {/* header */}
          <View style={styles.header}>
            <Text style={styles.h1}>Payment</Text>
            <Pressable
              style={styles.close}
              onPress={() => navigation.goBack()}
              hitSlop={10}
            >
              <Ionicons name="close" size={18} color="#111" />
            </Pressable>
          </View>
          <Text style={styles.sub}>Payment methods</Text>

          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          >
            {/* Radio rows */}
            <RadioRow
              icon={
                <MaterialCommunityIcons
                  name="credit-card-outline"
                  size={22}
                  color="#111"
                />
              }
              label="Credit or Debit Card"
              checked={method === 'card'}
              onPress={() => setMethod('card')}
            />
            <RadioRow
              icon={<Ionicons name="wallet-outline" size={22} color="#111" />}
              label="Wallet"
              checked={method === 'wallet'}
              onPress={() => setMethod('wallet')}
            />
            <RadioRow
              icon={
                <Image
                  source={assets.images.dollarIcon} // <-- **Direct require with correct path**
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'contain',
                  }}
                />
              }
              label="Cash"
              checked={method === 'cash'}
              onPress={() => setMethod('cash')}
            />

            {/* Cards list (only if card is chosen) */}
            {method === 'card' && (
              <>
                <View style={styles.sectionHead}>
                  <Text style={styles.sectionTitle}>Available Cards</Text>
                  <Pressable style={styles.iconBtn} onPress={addCard}>
                    <MaterialCommunityIcons
                      name="credit-card-plus-outline"
                      size={20}
                      color="#111"
                    />
                  </Pressable>
                </View>

                {cards.map(c => (
                  <Pressable
                    key={c.id}
                    style={styles.cardRow}
                    onPress={() => {
                      setMethod('card');
                      setSelectedCardId(c.id);
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      {brandIcon(c.brand)}
                      <View>
                        <Text style={styles.cardTitle}>•••• {c.last4}</Text>
                        <Text style={styles.cardSub}>Exp {c.exp}</Text>
                      </View>
                    </View>
                    <Ionicons
                      name={
                        selectedCardId === c.id && method === 'card'
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      size={20}
                      color="#111"
                    />
                  </Pressable>
                ))}
              </>
            )}

            {/* Square info pill */}
            <View style={styles.squarePill}>
              <View style={styles.squareLogo}>
                {/* <Text style={{ color: '#111', fontWeight: '800' }}>■</Text> */}
                <Image
                  source={assets.images.sqaureTwoIcon} // <-- **Direct require with correct path**
                  style={{
                    width: 35,
                    height: 35,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.squareTxt}>
                  Square will securely process your payment, and your
                  information will be safely stored on Square’s servers.
                </Text>
              </View>
              <Ionicons name="lock-closed-outline" size={16} color="#111" />
            </View>
          </ScrollView>

          {/* CTA */}
          <Pressable style={styles.cta} onPress={submit}>
            <Text style={styles.ctaText}>Use this method</Text>
            <View style={styles.ctaIcon}>
              <Ionicons name="arrow-forward" size={18} color="#111" />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ---------- small bits ---------- */

function RadioRow({
  icon,
  label,
  checked,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  checked?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.radioRow} onPress={onPress}>
      <View style={styles.radioIcon}>{icon}</View>
      <Text style={styles.radioLabel}>{label}</Text>
      <Ionicons
        name={checked ? 'radio-button-on' : 'radio-button-off'}
        size={20}
        color="#111"
      />
    </Pressable>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '92%',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  h1: { flex: 1, color: '#111', fontSize: 18, fontFamily: 'BiennaleBold' },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sub: {
    color: '#6F6F6F',
    marginTop: 2,
    marginBottom: 6,
    paddingHorizontal: 16,
    fontFamily: 'BiennaleRegular',
  },

  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
  },
  radioIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F6F7F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioLabel: { color: '#111', flex: 1, fontFamily: 'BiennaleBold' },

  sectionHead: {
    marginTop: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: { flex: 1, color: '#111', fontFamily: 'BiennaleBold' },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F6F7F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardRow: {
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardTitle: { color: '#111', fontFamily: 'BiennaleBold' },
  cardSub: { color: '#9AA0A6', fontSize: 12, marginTop: 2, fontFamily: 'BiennaleRegular' },

  squarePill: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: MINT,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  squareLogo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareTxt: { color: '#111', fontFamily: 'BiennaleBold' },

  cta: {
    margin: 16,
    height: 50,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#fff', fontFamily: 'BiennaleBold' },
  ctaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
});
