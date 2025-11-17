import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';
import assets from '../../assets';
import type { RootStackParamList } from '../navigation/types';
import { FONTS } from '../../src/theme/fonts';
import FaceNotFoundModal from './FaceNotFoundModal';
import FaceScannedModal from './FaceScannedModal';

type Props = NativeStackScreenProps<RootStackParamList, 'FaceScanning'>;

export default function FaceScanning({ navigation }: Props) {
  const [progress, setProgress] = useState(65);
  const [statusText, setStatusText] = useState('Verifying your face...');
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const rnBiometrics = useMemo(
    () => new ReactNativeBiometrics({ allowDeviceCredentials: true }),
    [],
  );

  const readStoredToken = async (): Promise<string | null> => {
    const r = await Keychain.getGenericPassword({
      service: 'com.hopnground.refresh-token',
    });
    return r === false ? null : r.password;
  };

  const runScan = async () => {
    setStatusText('Verifying your face...');
    setShowSuccess(false);
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      if (!available) {
        Alert.alert(
          'Biometrics not available',
          'Enroll Face/Touch ID or screen lock in device settings.',
        );
        navigation.goBack();
        return;
      }

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Scan to complete Face ID setup',
      });
      if (!success) {
        setStatusText('Scan cancelled');
        setShowModal(true);
        return;
      }

      const token = await readStoredToken();
      console.log('token', token);

      if (!token) {
        Alert.alert(
          'No saved session',
          'Sign in once with OTP to enable biometric login.',
        );
        navigation.goBack();
        return;
      }

      setStatusText('Face verified');
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 700));
      setShowSuccess(true);
      return;
    } catch (e: any) {
      Alert.alert('Biometric error', String(e?.message ?? e));
      setShowModal(true);
    }
  };

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress(prev => (prev >= 95 ? 95 : prev + 2));
    }, 250);
    runScan();
    return () => clearInterval(progressTimer);
  }, [navigation, rnBiometrics]);

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground
        source={assets.images.Sbg}
        style={styles.hero}
        imageStyle={styles.heroImage}
        resizeMode="cover"
      >
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={20} color="#111" />
        </Pressable>
        <View style={{ height: 230 }}>
          <Text style={styles.title}>Face Scanning</Text>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.scanCard}>
          <View style={styles.faceFrame}>
            <Image
              source={require('../../assets/icons/face-scan.png')}
              style={styles.faceImage}
            />
          </View>
        </View>
        <View style={styles.progressCard}>
          <Image
            source={require('../../assets/icons/face-scan-icon.png')}
            style={styles.avatarThumb}
          />
          <View style={styles.progressTextWrap}>
            <Text style={styles.progressTitle}>{statusText}</Text>
          </View>
          <View style={styles.progressBadge}>
            <Text style={styles.progressValue}>{Math.round(progress)}%</Text>
          </View>
        </View>
      </View>
      <FaceNotFoundModal
        visible={showModal}
        onTryAgain={() => {
          setShowModal(false);
          runScan();
        }}
        onLinkPress={() => {
          setShowModal(false);
          runScan();
        }}
        onCancel={() => {
          setShowModal(false);
          navigation.goBack();
        }}
      />
      <FaceScannedModal
        visible={showSuccess}
        onAllow={() => {
          setShowSuccess(false);
          navigation.replace('App');
        }}
        onDeny={() => {
          setShowSuccess(false);
          navigation.goBack();
        }}
      />
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
    height: 360,
    paddingTop: 74,
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
    marginHorizontal: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -120,
  },
  scanCard: {
    borderRadius: 34,
    backgroundColor: '#fff',
    // padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 24,
    elevation: 10,
  },
  faceFrame: {
    // width: '100%',
    borderRadius: 24,
    // backgroundColor: '#F1F1F5',
    // padding: 8,
    alignItems: 'center',
  },
  faceImage: {
    width: '50%',
    aspectRatio: 0.68,
    height: 630,
    borderRadius: 35,
  },
  progressCard: {
    marginTop: 24,
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 5,
  },
  avatarThumb: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  progressTextWrap: {
    flex: 1,
    marginHorizontal: 14,
  },
  progressTitle: {
    fontSize: 14,
    color: '#696969',
    fontFamily: FONTS.medium,
  },
  progressBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressValue: {
    color: '#fff',
    fontFamily: FONTS.semibold,
    fontSize: 16,
  },
});
