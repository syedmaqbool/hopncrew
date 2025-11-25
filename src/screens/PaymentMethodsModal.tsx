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

const MINT = '#B1FBE3';
const TEXT = '#201E20';
const MUTED = '#6F6F6F';
const BORDER = '#EEE';
const BG_SOFT = '#F6F7F8';

const brandIcon = (brand: SavedCard['brand']) => {
  switch (brand) {
    case 'visa':
      return <MaterialCommunityIcons name="visa" size={28} color="#1A1F71" />;
    case 'mastercard':
      return (
        <MaterialCommunityIcons name="mastercard" size={28} color="#EB001B" />
      );
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
  const { width } = useWindowDimensions();
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

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 24}
        style={styles.screen}
      >
        <View style={styles.main}>
          {/* Top close button */}
          <View style={styles.topBar}>
            <Pressable
              style={styles.closeCircle}
              onPress={() => navigation.goBack()}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={24} color={TEXT} />
            </Pressable>
          </View>

          {/* Title + subtitle */}
          <View style={styles.headerBlock}>
            <Text style={styles.h1}>Payment</Text>
            <Text style={styles.sub}>Payment methods</Text>
          </View>

          {/* Content area (no global scrolling) */}
          <View style={styles.content}>
            {/* Method radios – always visible, non-scroll */}
            <View>
              <RadioRow
                icon={
                  <Image
                    source={require('../../assets/icons/creditcard-icon.png')}
                    style={{ height: 48, width: 48 }}
                  />
                }
                label="Credit or Debit Card"
                checked={method === 'card'}
                onPress={() => setMethod('card')}
              />
              <RadioRow
                icon={
                  <Image
                    source={require('../../assets/icons/wallet-icon.png')}
                    style={{ height: 48, width: 48 }}
                  />
                }
                label="Wallet"
                checked={method === 'wallet'}
                onPress={() => setMethod('wallet')}
              />
              <RadioRow
                icon={
                  <Image
                    source={require('../../assets/icons/cash-icon.png')}
                    style={{ height: 48, width: 48 }}
                  />
                }
                label="Cash"
                checked={method === 'cash'}
                onPress={() => setMethod('cash')}
              />
            </View>

            {/* Available cards block – ONLY this part scrolls */}
            {method === 'card' && (
              <View style={styles.cardsBlock}>
                <View style={styles.sectionHead}>
                  <Text style={styles.sectionTitle}>Available Cards</Text>
                  <Pressable
                    style={styles.iconBtn}
                    onPress={addCard}
                    hitSlop={8}
                  >
                    <Image
                      source={require('../../assets/icons/add-creditcard-icon.png')}
                      style={{ height: 48, width: 48 }}
                    />
                  </Pressable>
                </View>

                <ScrollView
                  style={styles.cardsScroll}
                  contentContainerStyle={{ paddingBottom: 4 }}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
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
                        color={
                          selectedCardId === c.id && method === 'card'
                            ? TEXT
                            : '#D1D5DB'
                        }
                      />
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Square info pill – stays static above CTA */}
            <View
              style={[
                styles.squarePill,
                isSmall && { paddingVertical: 10 },
              ]}
            >
              <View style={styles.squareLogo}>
                <Image
                  source={assets.images.sqaureTwoIcon}
                  style={{ width: 40, height: 40, resizeMode: 'contain' }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.squareTxt}>
                  Square will securely process your payment, and your
                  information will be safely stored on Square&apos;s servers.
                </Text>
              </View>
              <Image
                source={require('../../assets/icons/lock-icon.png')}
                style={{ height: 20, width: 20 }}
              />
            </View>
          </View>
        </View>

        {/* Bottom CTA – fixed, doesn’t jump too high/low */}
        <View
          style={[
            styles.ctaWrap,
            { paddingBottom: 8 },
          ]}
        >
          <Pressable
            style={styles.cta}
            onPress={submit}
            accessibilityRole="button"
          >
            <Text style={styles.ctaText}>Use this method</Text>
            <View className="ctaIcon" style={styles.ctaIcon}>
              <Ionicons name="arrow-forward" size={18} color={TEXT} />
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
      <View style={[styles.checkCircle, checked && styles.checkCircleOn]}>
        {checked && <Ionicons name="checkmark" size={20} color="#fff" />}
      </View>
    </Pressable>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  main: {
    flex: 1,
  },

  topBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 2,
  },
  closeCircle: {
    width: 48,
    height: 48,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 4 },
    }),
  },

  headerBlock: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  h1: {
    color: TEXT,
    fontSize: 24,
    fontFamily: FONTS.semibold,
    marginBottom: 4,
  },
  sub: {
    color: TEXT,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 14,
  },
  radioIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BG_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioLabel: {
    color: TEXT,
    flex: 1,
    fontFamily: FONTS.semibold,
    fontSize: 18,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#D2D5DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleOn: {
    backgroundColor: '#201E20',
    borderColor: '#201E20',
  },

  cardsBlock: {
    flex: 1,
    marginTop: 24,
  },
  sectionHead: {
    marginBottom: 10,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    flex: 1,
    color: TEXT,
    fontFamily: FONTS.semibold,
    fontSize: 18,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsScroll: {
    flex: 1,
  },
  cardRow: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardTitle: { color: TEXT, fontFamily: FONTS.semibold, fontSize: 16 },
  cardSub: {
    color: '#8D8E8F',
    fontSize: 14,
    marginTop: 2,
    fontFamily: FONTS.regular,
  },

  squarePill: {
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: '#DAF8EE',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 10,
  },
  squareLogo: {
    width: 40,
    height: 40,
    paddingTop: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareTxt: {
    color: TEXT,
    fontFamily: FONTS.semibold,
    fontSize: 16,
  },

  ctaWrap: {
    paddingHorizontal: 16,
    borderTopWidth: Platform.select({
      ios: StyleSheet.hairlineWidth,
      android: StyleSheet.hairlineWidth,
    }),
    borderTopColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
  },
  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: TEXT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#FCFCFC', fontFamily: FONTS.bold, fontSize: 15 },
  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: 32,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
  },
});
