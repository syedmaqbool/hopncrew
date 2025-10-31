// src/screens/ScanBagSizeScreen.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

// ✅ image picker camera
import {
  launchCamera,
  type CameraOptions,
  type Asset,
} from 'react-native-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanBagSize'>;

const TEXT = '#111';
const MINT = '#B9FBE7';
const BORDER = '#ECEDEE';

export default function ScanBagSizeScreen({ navigation, route }: Props) {
  const [size, setSize] = useState<'Large' | 'Small'>(
    route.params?.initialSize ?? 'Large',
  );

  const slide = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [slide]);
  const slideY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 18],
  });

  // ---- open camera
  const ensureCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const openCamera = async () => {
    const ok = await ensureCameraPermission();
    if (!ok) {
      Alert.alert('Camera permission', 'Please allow camera access to scan.');
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      cameraType: 'back',
      quality: 0.9,
      includeBase64: false,
      saveToPhotos: false,
      presentationStyle: 'fullScreen',
    };

    const res = await launchCamera(options);

    if (res.didCancel) return;
    if (res.errorCode) {
      Alert.alert('Camera error', res.errorMessage || res.errorCode);
      return;
    }

    const asset: Asset | undefined = res.assets?.[0];
    if (asset) {
      // send photo back (optional handler from parent)
      route.params?.onScanPhoto?.(asset); // { uri, width, height, fileName, type, ... }
      // also keep your "size" callback behavior
      route.params?.onDone?.(size);
      navigation.goBack();
    }
  };

  const onScan = () => {
    // open camera now
    openCamera().catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.hBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color={TEXT} />
        </Pressable>
        <Text style={styles.hTitle}>Size Your Bag</Text>
      </View>

      <Animated.View
        style={[styles.body, { transform: [{ translateY: slideY }] }]}
      >
        {/* Toggle */}
        <View style={styles.toggleRow}>
          <Pressable
            onPress={() => setSize('Large')}
            style={[styles.toggleBtn, size === 'Large' && styles.toggleActive]}
          >
            <Text
              style={[
                styles.toggleTxt,
                size === 'Large' && styles.toggleTxtActive,
              ]}
            >
              Large
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSize('Small')}
            style={[
              styles.toggleBtn,
              size === 'Small' && styles.toggleActive,
              { marginLeft: 10 },
            ]}
          >
            <Text
              style={[
                styles.toggleTxt,
                size === 'Small' && styles.toggleTxtActive,
              ]}
            >
              Small
            </Text>
          </Pressable>
        </View>

        {/* Policy link */}
        <Pressable
          style={styles.policyRow}
          onPress={() => navigation.navigate('Policies')}
        >
          <Text style={styles.policyTxt}>Check our cabin bag policy</Text>
          <Ionicons name="chevron-forward" size={16} color={TEXT} />
        </Pressable>

        {/* Camera preview placeholder with scan frame */}
        <View style={styles.cameraBox}>
          <Image
            source={require('../../assets/icons/bg-bag-image.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          {/* Corners */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          <Pressable style={styles.scanBtn} onPress={onScan}>
            <Image
              source={require('../../assets/icons/filled-cam-icon.png')}
              resizeMode="contain"
            />
            <Text style={styles.scanTxt}>Scan Bag size</Text>
          </Pressable>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 56,
    paddingHorizontal: 16,
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  hBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hTitle: { color: TEXT, fontSize: 16, fontFamily: 'BiennaleBold' },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },

  toggleRow: { flexDirection: 'row', marginTop: 10 },
  toggleBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: { backgroundColor: '#111' },
  toggleTxt: { color: '#111', fontFamily: 'BiennaleBold' },
  toggleTxtActive: { color: '#fff' },

  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  policyTxt: { color: TEXT, fontFamily: 'BiennaleBold' },

  cameraBox: {
    flex: 1,
    backgroundColor: '#DDD',
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  corner: { position: 'absolute', width: 64, height: 64, borderColor: '#fff' },
  cornerTL: {
    top: 156,
    left: 36,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 35,
  },
  cornerTR: {
    top: 156,
    right: 36,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 35,
  },
  cornerBL: {
    bottom: 100,
    left: 36,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 35,
  },
  cornerBR: {
    bottom: 100,
    right: 36,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 35,
  },

  scanBtn: {
    position: 'absolute',
    bottom: 46,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 8,
  },
  scanTxt: { color: '#A9FFE3', textAlign: 'center', fontFamily: 'BiennaleBold' },
});
