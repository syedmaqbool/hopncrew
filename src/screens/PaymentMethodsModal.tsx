// src/screens/PaymentMethodsModal.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Platform,
  useWindowDimensions,
  KeyboardAvoidingView,
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
import { FONTS } from '../../src/theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentMethods'>;

const MINT = '#B9FBE7';
const TEXT = '#111';
const MUTED = '#6F6F6F';
const BORDER = '#EEE';
const BG_SOFT = '#F6F7F8';

const brandIcon = (brand: SavedCard['brand']) => {
  switch (brand) {
    case 'visa':
      return <MaterialCommunityIcons name="visa" size={28} color="#1A1F71" />;
    case 'mastercard':
      // Use the dedicated icon if available; fallback to generic
      return <MaterialCommunityIcons name="mastercard" size={28} color="#EB001B" />;
    case 'amex':
    case 'american_express':
      return (
        <MaterialCommunityIcons
          name="credit-card"
          size={24}
          color="#2E77BC"
        />
      );
    default:
      return (
        <MaterialCommunityIcons
          name="credit-card-outline"
          size={24}
          color={TEXT}
        />
      );
  }
};

export default function PaymentMethodsModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isSmall = width < 360;

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
    navigation.replace('Processing', {
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
          setSelectedCardId(card.id);
          setMethod('card');
          return next;
        });
      },
    });
  };

  const submit = () => {
    route.params?.onSelect?.({
      method,
      cardId: method === 'card' ? selectedCardId : undefined,
    });

    if (method === 'card') {
      if (!selectedCardId) return addCard();
      return goProcessing();
    }
    return goProcessing();
  };

  // Target ~70% modal height (Android a tad taller for visual balance)
  const SHEET_HEIGHT = Math.round(
    height * (Platform.OS === 'ios' ? 0.7 : 0.74),
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Dim background – tap to close */}
      <Pressable
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'rgba(0,0,0,0.12)' },
        ]}
        onPress={() => navigation.goBack()}
      />

      <SafeAreaView edges={['bottom']} style={styles.wrap}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.sheet, { height: SHEET_HEIGHT }]}
        >
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top > 0 ? 8 : 10 }]}>
            <Text style={styles.h1}>Payment</Text>
            <Pressable
              style={styles.close}
              onPress={() => navigation.goBack()}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={18} color={TEXT} />
            </Pressable>
          </View>
          <Text style={styles.sub}>Payment methods</Text>

          {/* Scrollable content */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 16,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Radio rows */}
            <RadioRow
              icon={
                <MaterialCommunityIcons
                  name="credit-card-outline"
                  size={22}
                  color={TEXT}
                />
              }
              label="Credit or Debit Card"
              checked={method === 'card'}
              onPress={() => setMethod('card')}
            />
            <RadioRow
              icon={<Ionicons name="wallet-outline" size={22} color={TEXT} />}
              label="Wallet"
              checked={method === 'wallet'}
              onPress={() => setMethod('wallet')}
            />
            <RadioRow
              icon={
                <Image
                  source={assets.images.dollarIcon}
                  style={{ width: 24, height: 24, resizeMode: 'contain' }}
                />
              }
              label="Cash"
              checked={method === 'cash'}
              onPress={() => setMethod('cash')}
            />

            {/* Cards list (only shown for card method) */}
            {method === 'card' && (
              <>
                <View style={styles.sectionHead}>
                  <Text style={styles.sectionTitle}>Available Cards</Text>
                  <Pressable style={styles.iconBtn} onPress={addCard} hitSlop={8}>
                    <MaterialCommunityIcons
                      name="credit-card-plus-outline"
                      size={20}
                      color={TEXT}
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
                    accessibilityRole="button"
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
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
                      color={TEXT}
                    />
                  </Pressable>
                ))}
              </>
            )}

            {/* Square info pill */}
            <View style={styles.squarePill}>
              <View style={styles.squareLogo}>
                <Image
                  source={assets.images.sqaureTwoIcon}
                  style={{ width: 32, height: 32, resizeMode: 'contain' }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.squareTxt}>
                  Square will securely process your payment, and your
                  information will be safely stored on Square’s servers.
                </Text>
              </View>
              <Ionicons name="lock-closed-outline" size={16} color={TEXT} />
            </View>
          </ScrollView>

          {/* Sticky CTA */}
          <View
            style={[
              styles.ctaWrap,
              { paddingBottom: Math.max(12, insets.bottom) },
            ]}
          >
            <Pressable style={styles.cta} onPress={submit} accessibilityRole="button">
              <Text style={styles.ctaText}>Use this method</Text>
              <View style={styles.ctaIcon}>
                <Ionicons name="arrow-forward" size={18} color={TEXT} />
              </View>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
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
    <Pressable style={styles.radioRow} onPress={onPress} hitSlop={6}>
      <View style={styles.radioIcon}>{icon}</View>
      <Text style={styles.radioLabel} numberOfLines={2}>
        {label}
      </Text>
      <Ionicons
        name={checked ? 'radio-button-on' : 'radio-button-off'}
        size={20}
        color={TEXT}
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
    overflow: 'hidden',
    // subtle shadow/elevation for floating look
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: -4 },
      },
      android: { elevation: 10 },
    }),
  },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  h1: { flex: 1, color: TEXT, fontSize: 18, fontFamily: FONTS.bold },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BG_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sub: {
    color: MUTED,
    marginTop: 2,
    marginBottom: 6,
    paddingHorizontal: 16,
    fontFamily: FONTS.regular,
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
    backgroundColor: BG_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioLabel: { color: TEXT, flex: 1, fontFamily: FONTS.bold },

  sectionHead: {
    marginTop: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: { flex: 1, color: TEXT, fontFamily: FONTS.bold },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: BG_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardRow: {
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardTitle: { color: TEXT, fontFamily: FONTS.bold },
  cardSub: { color: '#9AA0A6', fontSize: 12, marginTop: 2, fontFamily: FONTS.regular },

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
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareTxt: { color: TEXT, fontFamily: FONTS.bold },

  ctaWrap: {
    paddingHorizontal: 16,
    paddingTop: 6,
    backgroundColor: '#fff',
    borderTopWidth: Platform.select({ ios: StyleSheet.hairlineWidth, android: 0 }),
    borderTopColor: '#EAEAEA',
  },
  cta: {
    height: 50,
    borderRadius: 28,
    backgroundColor: TEXT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#fff', fontFamily: FONTS.bold },
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
