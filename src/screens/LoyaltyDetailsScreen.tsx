// src/screens/LoyaltyDetailsScreen.tsx
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
import { FONTS } from '../../src/theme/fonts';
import assets from '../../assets';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'LoyaltyDetailsScreen'>;

const TEXT = '#201E20';

export default function LoyaltyDetailsScreen({ navigation }: Props) {
  const goBack = () => navigation.goBack();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
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
            <Ionicons name="arrow-back" size={24} color={TEXT} />
          </Pressable>
          <Text style={styles.headerTitle}>Loyalty Program</Text>
        </View>

        {/* White sheet */}
        <View style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Top illustration card */}
            <View style={styles.outerCard}>
              <View style={styles.illustrationWrap}>
                {/* Replace with your own image */}
                
                <Image
                  source={require('../../assets/backgrounds/loyalty-image.png')}
                  style={styles.illustration}
                  resizeMode="contain"
                />
                 <Image
                  source={require('../../assets/backgrounds/passengers.png')}
                  style={{position:'absolute',height:120,width:140, top:60,left:10}}
                  resizeMode="contain"
                />
                 <Image
                  source={require('../../assets/backgrounds/taxi.png')}
                  style={{position:'absolute',height:100,width:150, top:100,right:10}}
                  resizeMode="contain"
                />
              <Text style={styles.cardBodyText}>
                Lorem Ipsum is simply dummy text of the printing and typesetting.
              </Text>
              </View>
            </View>

            {/* Sections */}
            <View style={{ marginTop: 30 }}>
              <Text style={styles.sectionTitle}>1. Lorem Ipsum</Text>
              <Text style={styles.sectionBody}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </Text>
            </View>

            <View style={{ marginTop: 26 }}>
              <Text style={styles.sectionTitle}>2. Lorem Ipsum</Text>
              <Text style={styles.sectionBody}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

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
    gap: 12,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 32,
    borderColor: '#D5D5D7',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#FFFFFF',
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
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  outerCard: {
    backgroundColor: '#F4F4F6',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  illustrationWrap: {
    position:'relative',
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    height:293,
    paddingVertical:22
  },
  illustration: {
    width: '100%',
    height: 190,
  },
  cardBodyText: {
    textAlign: 'center',
    // marginVertical: 18,
    fontSize: 16,
    color: TEXT,
    lineHeight: 24,
    fontFamily: FONTS.semibold,
    paddingHorizontal:12,
  },

  sectionTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.regular,
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 15,
    color: '#8D8E8F',
    lineHeight: 24,
    fontFamily: FONTS.regular,
  },
});
