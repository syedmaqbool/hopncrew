// src/screens/HelpCenterScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpCenterScreen'>;

const TEXT = '#282828';
const MUTED = '#8D8E8F';
const BORDER = '#E2E2E6';
const TILE_BG = '#F7F7F9';

export default function HelpCenterScreen({ navigation }: Props) {
  const openMenu = () => navigation.goBack(); // or open drawer

  const onTopicPress = (id: string) => {
    console.log('Topic pressed', id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable style={styles.menuBtn} onPress={openMenu}>
          <Ionicons name="ellipsis-horizontal" size={22} color={TEXT} />
        </Pressable>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.mainTitle}>Raise a helpdesk ticket</Text>
          <Text style={styles.subTitle}>
            Our customer care team will get back{'\n'}to you in 24-48 hours
          </Text>
        </View>

        {/* Quick issue tiles */}
        <View style={styles.tileRow}>
          <HelpTile
            onPress={()=>navigation.navigate('HelpSupportScreen')}
            icon={
              <Image source={require('../../assets/icons/hangbag-icon.png')} alt='hangnag' style={{height:45,width:40}} />
            }
            label="Lost an item"
          />
          <HelpTile
           onPress={()=>navigation.navigate('HelpSupportScreen')}
            icon={
              <Image source={require('../../assets/icons/cash-dollar-icon.png')} alt='hangnag' style={{height:41,width:48}} />
              
            }
            label="Issue with refund"
          />
          <HelpTile
            onPress={()=>navigation.navigate('HelpSupportScreen')}
            icon={
            <Image source={require('../../assets/icons/officer-icon.png')} alt='hangnag' style={{height:49,width:37}} />
            }
            label="Driver related"
          />
        </View>

        {/* Learn More */}
        <Text style={styles.sectionHeading}>Learn More</Text>
        <HelpRow
          label="Ride Cancellation Policy"
          onPress={() => onTopicPress('ride-cancel')}
        />
        <HelpRow
          label="How does Sharing Work"
          onPress={() => onTopicPress('sharing-work')}
        />
        <HelpRow
          label="Passenger Waiting Policy"
          onPress={() => onTopicPress('waiting-policy')}
        />

        {/* Other Topics */}
        <Text style={[styles.sectionHeading, { marginTop: 26 }]}>
          Other Topics
        </Text>
        <HelpRow
          label="Cab No Show Policy"
          onPress={() => onTopicPress('no-show')}
        />
        <HelpRow
          label="Will I get charged if co-passenger declines route request"
          onPress={() => onTopicPress('copassenger-charge')}
        />
        <HelpRow
          label="Bad driver behaviour"
          onPress={() => onTopicPress('bad-driver')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Small components ---------- */

function HelpTile({
  icon,
  label,
  onPress
}: {
  icon: React.ReactNode;
  label: string;
  onPress: null;
}) {
  return (
    <Pressable style={styles.tile} onPress={onPress}>
      <View style={styles.tileTop}>{icon}</View>
      <View style={styles.tileBottom}>
        <Text
          style={styles.tileLabel}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}


function HelpRow({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.rowText}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={MUTED} />
    </Pressable>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 10,
    gap: 12,
  },
  menuBtn: {
    width: 48,
    height: 48,
    borderRadius: 32,
    borderColor: BORDER,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  titleBlock: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.semibold,
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 16,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: FONTS.regular,
  },

  tileRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 30,
},

tile: {
  flex: 1,
  borderRadius: 18,
  overflow: 'hidden',
  marginHorizontal: 8,
  borderWidth: 1,
  borderColor: BORDER,
},

tileTop: {
  paddingVertical: 18,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F3F4F6', // light grey top half
},

tileBottom: {
  paddingVertical: 10,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFFFFF', // white bottom half
},

tileLabel: {
  fontSize: 13,
  color: TEXT,
  textAlign: 'center',
  fontFamily: FONTS.regular,
},

  sectionHeading: {
    fontSize: 18,
    color: MUTED,
    fontFamily: FONTS.semibold,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    color: TEXT,
    fontFamily: FONTS.semibold,
  },
});

