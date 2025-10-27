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
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AirportPickupPerks'>;

const TEXT = '#111';
const MUTED = '#6B7280';
const MINT = '#B9FBE7';
const CARD = '#ECFDF5';
const BORDER = '#E5E7EB';

export default function AirportPickupPerksScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.closeHeader}>
        <Pressable style={styles.closeRow} onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>Close</Text>
          <Ionicons name="close" size={18} color={TEXT} />
        </Pressable>
      </View>
      <View style={styles.header}>
        <View style={styles.brandBadge}>
          <Image
            source={require('../../assets/icons/hopn-bg-logo.png')}
            alt="hopn"
            style={{
              width: 160,
              height: 60,
              resizeMode: 'contain',
            }}
          />
          {/* <Text style={styles.brandText}>hop’n.</Text> */}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Exclusive Airport Pickup Perks</Text>

        {/* Highlighted bullets */}
        <View style={styles.greenCard}>
          <Row
            icon={
              <Image
                source={require('../../assets/icons/flight-time-icon.png')}
                alt=""
                style={{ width: 18, height: 18, resizeMode: 'contain' }}
              />
              // <Ionicons name="alert-circle-outline" size={18} color={TEXT} />
            }
            title="Flight Delayed? No Problem:"
            body="Hop’n tracks your flight and adjusts your pickup time automatically. Whether it’s a flight delay or baggage hold-up, we’ve got you covered."
          />
          <View style={styles.cardSep} />
          <Row
            icon={
              <Image
                source={require('../../assets/icons/loop-icon.png')}
                alt=""
                style={{ width: 18, height: 18, resizeMode: 'contain' }}
              />
              // <Ionicons name="infinite" size={18} color={TEXT} />
            }
            title="Enjoy Unlimited Wait Time:"
            body="Lost baggage? Customs or immigration delays? No worries—your driver will wait as long as needed"
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
          text="Cancellation & Changes 1 hour before pickup"
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
          <Text style={styles.noteTitle}>
            hop’n Exclusive Airport Pickup Perks
          </Text>
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

        {/* Guide collapsible header (static preview) */}
        <View style={styles.guideRow}>
          <View style={styles.playBadge}>
            <Image
              source={require('../../assets/icons/play-icon.png')}
              alt=""
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.guideTitle}>
              How do I find my driver at the airport?
            </Text>
            <Text style={styles.guideSub}>
              Here’s a guide on where to proceed
            </Text>
          </View>
          <Pressable style={styles.dropBadge} onPress={() => navigation.navigate('AirportGuide')}>
            <Image
              source={require('../../assets/icons/arrow-down-icon.png')}
              alt=""
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          </Pressable>
        </View>
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
      <Image
        source={icon}
        alt=""
        style={{ width: 48, height: 48, resizeMode: 'contain' }}
      />
      {/* <Ionicons name={icon as any} size={18} color={TEXT} /> */}
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
    paddingTop: 8,
  },
  closeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  brandBadge: {
    // backgroundColor: '#0EA5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  brandText: { color: '#fff', fontWeight: '800' },
  closeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  closeText: { color: MUTED, fontWeight: '700' },

  scroll: { paddingHorizontal: 16 },
  title: {
    color: TEXT,
    fontWeight: '700',
    fontSize: 48,
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
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { color: TEXT, fontWeight: '800' },
  rowBody: { color: '#334155', marginTop: 4 },

  flatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 0,
    borderBottomColor: BORDER,
  },
  flatText: { color: TEXT, fontWeight: '700', flex: 1 },

  noteCard: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  noteTitle: { color: TEXT, fontWeight: '800', marginBottom: 6 },
  noteBody: { color: '#4B5563', marginBottom: 6 },

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
  guideTitle: { color: TEXT, fontWeight: '800' },
  guideSub: { color: TEXT, opacity: 0.7 },
  dropBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    // backgroundColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
