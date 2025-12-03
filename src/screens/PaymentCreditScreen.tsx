// src/screens/PaymentCreditScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { FONTS } from '../../src/theme/fonts';
import assets from '../../assets';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentCredit'>;

const TEXT = '#201E20';

export default function PaymentCreditScreen({ navigation }: Props) {
  const goBack = () => navigation.goBack();

  const cards = [
    {
      id: '1',
      brand: 'VISA',
      last4: '5967',
      exp: '07/2026',
      logo: <Image source={require('../../assets/icons/visa-icon.png')} alt='visa-icon' style={{height:24,width:54}} />,
    },
    {
      id: '2',
      brand: '',
      last4: '2841',
      exp: '05/2027',
      logo: <Image source={require('../../assets/icons/master-icon.png')} alt='visa-icon' style={{height:34,width:55}} />,

    },
  ];

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openDeleteSheet = (id: string) => {
    setSelectedId(id);
    setConfirmVisible(true);
  };

  const closeDeleteSheet = () => {
    setConfirmVisible(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = () => {
    // TODO: call API / update state to actually remove the card
    console.log('Delete card id:', selectedId);
    closeDeleteSheet();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Map-style background */}
      <Image
        source={assets.images.mapBg || require('../../assets/backgrounds/signin.png')}
        style={styles.mapBg}
        resizeMode="cover"
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={TEXT} />
          </Pressable>
          <Text style={styles.headerTitle}>Credit Cards</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* White sheet */}
        <View style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {cards.map(card => (
              <View key={card.id} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View>
                    {card.logo}
                    <Text style={styles.cardNumber}>
                      **** **** **** <Text style={styles.cardNumberStrong}>{card.last4}</Text>
                    </Text>
                  </View>

                  <Pressable style={styles.deleteBtn} onPress={() => openDeleteSheet(card.id)}>
                  <Image source={require('../../assets/icons/del-icon.png')} alt='visa-icon' style={{height:22,width:16}} />
                  </Pressable>
                </View>

                <View style={{ marginTop: 24 }}>
                  <Text style={styles.expLabel}>Expiry date</Text>
                  <Text style={styles.expValue}>{card.exp}</Text>
                </View>
              </View>
            ))}

            {/* Add new card button */}
            <Pressable style={styles.addBtn}>
              <Text style={styles.addBtnText}>Add New Card</Text>
              <View style={styles.addBtnIcon}>
                <Ionicons name="add" size={22} color={TEXT} />
              </View>
            </Pressable>
          </ScrollView>
        </View>
      </SafeAreaView>
      {/* DELETE BOTTOM SHEET */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDeleteSheet}
      >
        <Pressable style={styles.backdrop} onPress={closeDeleteSheet}>
          {/* empty – press outside to close */}
        </Pressable>

        <View style={styles.bottomSheet}>
          {/* close X */}
          <Pressable style={styles.sheetCloseBtn} onPress={closeDeleteSheet}>
            <Ionicons name="close" size={28} color="#8D8E8F" />
          </Pressable>

          <Text style={styles.sheetText}>
            Are you sure you want to delete this payment method?
          </Text>

          <Pressable style={styles.sheetDeleteBtn} onPress={handleConfirmDelete}>
            <Text style={styles.sheetDeleteText}>Delete</Text>
            <View style={styles.sheetDeleteIcon}>
              <Ionicons name="close" size={20} color={TEXT} />
            </View>
          </Pressable>

          <Pressable onPress={closeDeleteSheet}>
            <Text style={styles.sheetCancelText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- styles ---------------- */

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
    justifyContent: 'flex-start',
    gap:12,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 32,
    borderColor:'#CCCCCC',
    borderWidth:1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
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
    paddingTop: 24,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#EFEFEF',
    borderRadius: 28,
    paddingHorizontal: 26,
    paddingVertical: 22,
    marginBottom: 22,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  cardBrand: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
    letterSpacing: 1,
    marginBottom: 24,
  },
  cardNumber: {
    marginTop:10,
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
  },
  cardNumberStrong: {
    fontFamily: FONTS.regular,
    fontSize:18,
    color:'#201E20'
  },

  expLabel: {
    fontSize: 16,
    color: '#8D8E8F',
    fontFamily: FONTS.regular,
    marginBottom: 4,
  },
  expValue: {
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // simple circles for the second card logo
  mmLogoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  mmCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8E8E94',
  },

  addBtn: {
    marginTop: 12,
    height: 56,
    borderRadius: 32,
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#F2F2F7',
    fontFamily: FONTS.regular,
    fontSize: 18,
  },
  addBtnIcon: {
    position: 'absolute',
    right: 6,
    width: 48,
    height: 48,
    borderRadius: 32,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#111111',
  },
  /* bottom sheet */
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 64,
    paddingBottom: 32,
    alignItems: 'center',
  },
  sheetCloseBtn: {
    position: 'absolute',
    right: 22,
    top: 24,
  },
  sheetText: {
    marginTop: 20,
    marginBottom: 26,
    textAlign: 'center',
    lineHeight:26,
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.regular,
  },
  sheetDeleteBtn: {
    width: '100%',
    height: 56,
    borderRadius: 30,
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  sheetDeleteText: {
    color: '#F2F2F7',
    fontFamily: FONTS.semibold,
    fontSize: 16,
  },
  sheetDeleteIcon: {
    position: 'absolute',
    right: 6,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetCancelText: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.regular,
    marginBottom: 18,
  },
});
