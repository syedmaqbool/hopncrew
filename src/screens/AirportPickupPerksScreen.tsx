// src/screens/AirportPickupPerksScreen.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  useWindowDimensions,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AirportPickupPerks'>;

const TEXT = '#111';
const MUTED = '#6B7280';
const MINT = '#B9FBE7';
const CARD = '#ECFDF5';
const BORDER = '#E5E7EB';

export default function AirportPickupPerksScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;
  const isTablet = width >= 768;

  const titleSize = isTablet ? 42 : isSmall ? 28 : 34;
  const logoWidth = Math.min(180, Math.round(width * 0.5));
  const logoHeight = Math.round(logoWidth * 0.36);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.closeHeader}>
        <Pressable
          style={styles.closeRow}
          onPress={() => navigation.goBack()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Text style={styles.closeText}>Close</Text>
          <Ionicons name="close" size={18} color={TEXT} />
        </Pressable>
      </View>

      <View style={styles.header}>
        <View style={styles.brandBadge}>
          <Image
            source={require('../../assets/icons/hopn-bg-logo.png')}
            style={{ width: logoWidth, height: logoHeight, resizeMode: 'contain' }}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { fontSize: titleSize }]}>
          Exclusive Airport Pickup Perks
        </Text>

        {/* Highlighted bullets */}
        <View style={styles.greenCard}>
          <Row
            icon={
              <Image
                source={require('../../assets/icons/flight-time-icon.png')}
                style={{ width: 18, height: 18, resizeMode: 'contain' }}
              />
            }
            title="Flight Delayed? No Problem:"
            body="Hop’n tracks your flight and adjusts your pickup time automatically. Whether it’s a flight delay or baggage hold-up, we’ve got you covered."
          />
          <View style={styles.cardSep} />
          <Row
            icon={
              <Image
                source={require('../../assets/icons/loop-icon.png')}
                style={{ width: 18, height: 18, resizeMode: 'contain' }}
              />
            }
            title="Enjoy Unlimited Wait Time:"
            body="Lost baggage? Customs or immigration delays? No worries—your driver will wait as long as needed."
          />
        </View>

        {/* List bullets */}
        <FlatRow
          icon={require('../../assets/icons/parks-one.png')}
          text="Guaranteed 20+ years of reliable pickup"
        />
        <FlatRow
          icon={require('../../assets/icons/parks-two.png')}
          text="Flat Fixed Rate. No surge or per km per minute charges"
        />
        <FlatRow
          icon={require('../../assets/icons/parks-three.png')}
          text="Cancellation and Changes 1 hour before pickup"
        />
        <FlatRow
          icon={require('../../assets/icons/parks-four.png')}
          text="We hold funds and charge after drop-off"
        />
        <FlatRow
          icon={require('../../assets/icons/parks-five.png')}
          text="FREE child car seats"
        />
        <FlatRow
          icon={require('../../assets/icons/parks-six.png')}
          text="Luggage assistance"
        />

        {/* Grey note card */}
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>hop’n Exclusive Airport Pickup Perks</Text>
          <Text style={styles.noteBody}>
            • Stay Comfortable: Relax in a heated or air-conditioned terminal
            while your driver picks you up right at the door.
          </Text>
          <Text style={styles.noteBody}>
            • No Waiting in Line: Skip the queues and the airport chaos with our
            seamless service.
          </Text>
          <Text style={styles.noteBody}>
            • Child Car Seats Available: Your family’s safety is always our top
            priority.
          </Text>
        </View>

        {/* Guide link */}
        <Pressable
          style={styles.guideRow}
          onPress={() => navigation.navigate('AirportGuide')}
          hitSlop={8}
        >
          <View style={styles.playBadge}>
            <Image
              source={require('../../assets/icons/play-icon.png')}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.guideTitle}>How do I find my driver at the airport?</Text>
            <Text style={styles.guideSub}>Here’s a guide on where to proceed</Text>
          </View>
          <View style={styles.dropBadge}>
            <Image
              source={require('../../assets/icons/arrow-down-icon.png')}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <View style={{ marginBottom: 8 }}>
      <View style={styles.rowHead}>
        <View style={styles.iconBubble}>{icon}</View>
        <Text style={styles.rowTitle}>{title}</Text>
      </View>
      <Text style={styles.rowBody}>{body}</Text>
    </View>
  );
}

function FlatRow({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.flatRow}>
      <Image source={icon} style={{ width: 44, height: 44, resizeMode: 'contain' }} />
      <Text style={styles.flatText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  closeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: Platform.select({ ios: 6, android: 8 }),
  },
  brandBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  closeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  closeText: { color: MUTED, fontFamily: FONTS.bold },

  scroll: { paddingHorizontal: 16 },
  title: {
    color: TEXT,
    fontFamily: FONTS.bold,
    marginTop: 10,
    marginBottom: 12,
  },

  greenCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: '#B1FBE3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardSep: { height: 1, backgroundColor: '#B1FBE3', marginVertical: 8 },

  rowHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { color: TEXT, fontFamily: FONTS.bold },
  rowBody: { color: '#334155', marginTop: 4, fontFamily: FONTS.regular },

  flatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  flatText: { color: TEXT, flex: 1, fontFamily: FONTS.bold },

  noteCard: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  noteTitle: { color: TEXT, marginBottom: 6, fontFamily: FONTS.bold },
  noteBody: { color: '#4B5563', marginBottom: 6, fontFamily: FONTS.regular },

  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#B1FBE3',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  playBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideTitle: { color: TEXT, fontFamily: FONTS.bold },
  guideSub: { color: TEXT, opacity: 0.7, fontFamily: FONTS.regular },
  dropBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
