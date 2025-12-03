import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FavouriteAddress'>;

const TEXT = '#111111';
const CARD_BG = '#FFFFFF';
const ROW_BG = '#F5F4F2';
const BORDER = '#ECE9E6';

export default function FavouriteAddress({ navigation }: Props) {
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const openDeleteSheet = (label: string) => {
    setSelectedLabel(label);
    setDeleteVisible(true);
  };

  const closeDeleteSheet = () => {
    setDeleteVisible(false);
    setSelectedLabel(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* header */}
      <View style={styles.headerRow}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={TEXT} />
        </Pressable>
        <Text style={styles.headerTitle}>Favourite Address</Text>
      </View>

      {/* content */}
      <View style={styles.content}>
        {/* main home/work card */}
        <View style={styles.card}>
          <FavRow
            icon={<Ionicons name="home-outline" size={24} color={TEXT} />}
            title="Home"
            subtitle="1507 Hewes Avenue Baltimore, MD 21202"
            showDivider
          />
          <FavRow
            icon={<Ionicons name="briefcase-outline" size={24} color={TEXT} />}
            title="Work"
            subtitle="45 Saint Clair Street New Albany, MS 38652"
          />
        </View>

        <Text style={styles.otherLabel}>Other</Text>

        {/* other addresses card */}
        <View style={styles.card}>
          {/* first other */}
          <FavRow
            icon={<Ionicons name="location-outline" size={24} color={TEXT} />}
            title="Bank Privat"
            subtitle="Mykhailivska St, 48, Kiev,UA"
            showDivider
          />

          {/* middle row with red delete block like mock */}
          <View style={styles.swipeRowWrapper}>
            <View style={styles.swipeRowTextWrap}>
              <Text style={styles.rowTitle}>Bank-Free UA</Text>
              <Text style={styles.rowSub}>Svetaeva St, 95, Kiev,UA</Text>
            </View>
            <Pressable
              style={styles.deleteBlock}
              onPress={() => openDeleteSheet('Bank-Free UA')}
            >
              <MaterialIcons name="delete" size={26} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* last other */}
          <FavRow
            icon={<Ionicons name="location-outline" size={24} color={TEXT} />}
            title="Walnut & Garfield"
            subtitle="Sofiivska St, 32, Kiev,UA"
          />
        </View>

        {/* Add other address button */}
        <Pressable style={styles.addBtn}>
          <Text style={styles.addText}>Add Other Address</Text>
          <View style={styles.addIconWrap}>
            <Ionicons name="add" size={22} color={TEXT} />
          </View>
        </Pressable>
      </View>

      {/* delete confirmation bottom sheet */}
      <DeleteSheet
        visible={deleteVisible}
        label={selectedLabel ?? ''}
        onClose={closeDeleteSheet}
        onConfirm={() => {
          // delete logic here (API / state update)
          closeDeleteSheet();
        }}
      />
    </SafeAreaView>
  );
}

type FavRowProps = {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  showDivider?: boolean;
};

function FavRow({ icon, title, subtitle, showDivider }: FavRowProps) {
  return (
    <>
      <View style={styles.row}>
        {icon && <View style={styles.rowIcon}>{icon}</View>}
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSub}>{subtitle}</Text>
        </View>
      </View>
      {showDivider && <View style={styles.rowDivider} />}
    </>
  );
}

/* ------- shared delete bottom sheet ------- */

export function DeleteSheet({
  visible,
  label,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  label: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.sheetWrap}>
        <Pressable style={styles.sheetBackdrop} onPress={onClose} />
        <View style={styles.sheetBox}>
          <Pressable style={styles.sheetClose} onPress={onClose}>
            <Ionicons name="close" size={18} color={TEXT} />
          </Pressable>
          <Text style={styles.sheetTitle}>
            Are you sure you want to delete this
          </Text>
          <Text style={styles.sheetTitle}>favourite?</Text>
          {!!label && (
            <Text style={styles.sheetSubtitle}>{label}</Text>
          )}

          <Pressable style={styles.sheetDeleteBtn} onPress={onConfirm}>
            <Text style={styles.sheetDeleteText}>Delete</Text>
            <View style={styles.sheetDeleteIcon}>
              <Ionicons name="close" size={20} color={TEXT} />
            </View>
          </Pressable>

          <Pressable onPress={onClose} style={{ marginTop: 26 }}>
            <Text style={styles.sheetCancel}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/* -------- styles -------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3EEE5', // map tint behind white card
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
    paddingTop: 26,
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 26,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 14,
  },
  rowTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.bold,
  },
  rowSub: {
    marginTop: 4,
    fontSize: 14,
    color: '#94959A',
    fontFamily: FONTS.regular,
  },
  rowDivider: {
    height: 1,
    backgroundColor: BORDER,
  },

  otherLabel: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: TEXT,
    marginBottom: 16,
  },

  swipeRowWrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    marginVertical: 2,
  },
  swipeRowTextWrap: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 12,
  },
  deleteBlock: {
    width: 84,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
  },

  addBtn: {
    marginTop: 40,
    marginBottom: 20,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: FONTS.semibold,
  },
  addIconWrap: {
    position: 'absolute',
    right: 10,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // bottom sheet styles
  sheetWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 32,
  },
  sheetClose: {
    position: 'absolute',
    right: 18,
    top: 18,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F3F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    textAlign: 'center',
    fontSize: 20,
    color: TEXT,
    fontFamily: FONTS.bold,
  },
  sheetSubtitle: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 16,
    color: '#777777',
    fontFamily: FONTS.regular,
  },
  sheetDeleteBtn: {
    marginTop: 32,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetDeleteText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: FONTS.semibold,
  },
  sheetDeleteIcon: {
    position: 'absolute',
    right: 8,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCancel: {
    textAlign: 'center',
    fontSize: 18,
    color: '#111111',
    fontFamily: FONTS.semibold,
  },
});
