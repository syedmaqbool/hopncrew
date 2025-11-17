import React from 'react';
import { Image, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import assets from '../../assets';
import type { RootStackParamList } from '../navigation/types';
import { FONTS } from '../../src/theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'SetUpFace'>;

export default function SetUpFace({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground
        source={assets.images.Sbg}
        style={styles.hero}
        imageStyle={styles.heroImage}
        resizeMode="cover"
      >
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={20} color="#111" />
        </Pressable>
        <View style={{ height: 330 }}>
          <Text style={styles.title}>Set up Face ID</Text>
          <Text style={styles.subtitle}>
            Unlock hop’n with your face ID, quick and secured
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            We will require face recognition after 2 minutes of inactivity. You
            can change the frequency in app settings.
          </Text>
          <Image
            source={require('../../assets/icons/face-req.png')}
            style={styles.faceGraphic}
          />
          <Pressable
            style={styles.scanButton}
            onPress={() => navigation.navigate('FaceScanning')}
          >
            <Text style={styles.scanText}>Scan My Face</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F5F0',
  },
  hero: {
    width: '100%',
    height: 460,
    paddingTop: 64,
    justifyContent: 'space-between',
    backgroundColor: '#F8F5F0',
  },
  heroImage: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    opacity: 0.7,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    marginHorizontal: 24,
  },
  title: {
    fontSize: 32,
    color: '#111',
    fontFamily: FONTS.bold,
    marginBottom: 6,
    marginHorizontal: 24,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginHorizontal: 24,
    color: '#3C3C43',
    fontFamily: FONTS.medium,
    marginBottom: 24,
  },
  content: {
    flex: 1,
    marginTop: 0,
  },
  card: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: '#fff',
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 24,
    elevation: 8,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3C3C43',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: FONTS.regular,
  },
  faceGraphic: {
    width: 210,
    height: 210,
    resizeMode: 'contain',
    marginBottom: 36,
  },
  scanButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 6,
  },
  scanText: {
    color: '#fff',
    fontFamily: FONTS.semibold,
    fontSize: 16,
  },
});
