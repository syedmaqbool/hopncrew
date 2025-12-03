// src/screens/PoliciesScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { FONTS } from '../../src/theme/fonts';

const TEXT = '#201E20';

type Props = NativeStackScreenProps<RootStackParamList, 'PoliciesScreen'>;

export default function PoliciesScreen({ navigation }: Props) {
  const goBack = () => navigation.goBack();

  return (
    <View style={styles.root}>
      {/* Map / background */}
      <Image
        source={require('../../assets/backgrounds/signin.png')}
        style={styles.mapBg}
        resizeMode="cover"
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={goBack}>
            <Ionicons name="arrow-back" size={22} color={TEXT} />
          </Pressable>
          <Text style={styles.headerTitle}>Policies</Text>
        </View>

        {/* White sheet */}
        <View style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <Text style={styles.leadText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book.
            </Text>

            <Text style={styles.sectionTitle}>1. Privacy</Text>
            <Text style={styles.bodyText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book.
            </Text>

            <Text style={styles.sectionTitle}>2. Policy</Text>
            <Text style={styles.bodyText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book.
            </Text>

            <Text style={styles.sectionTitle}>3. Privacy</Text>
            <Text style={styles.bodyText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book.
            </Text>

            <Text style={styles.sectionTitle}>4. Policy</Text>
            <Text style={styles.bodyText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum.
            </Text>

            {/* bottom spacing before button */}
            <View style={{ height: 28 }} />
          </ScrollView>

          {/* Agree button */}
          <Pressable style={styles.agreeBtn} onPress={goBack}>
            <Text style={styles.agreeText}>I’ve agree with this</Text>
            <View style={styles.agreeIconWrap}>
              <Ionicons name="checkmark" size={20} color={TEXT} />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },

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
    paddingBottom: 10,
    paddingTop: 4,
    gap: 12,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#D7D7D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  sheet: {
    flex: 1,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 18,
  },
  content: {
    paddingBottom: 10,
  },

  leadText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#9A9EA5',
    fontFamily: FONTS.regular,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    color: TEXT,
    fontFamily: FONTS.semibold,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#9A9EA5',
    fontFamily: FONTS.regular,
    marginBottom: 24,
  },

  agreeBtn: {
    marginTop: 4,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
  },
  agreeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.semibold,
  },
  agreeIconWrap: {
    position: 'absolute',
    right: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
