// src/screens/ContactSupport.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../navigation/types';
import assets from '../../assets';

type Props = NativeStackScreenProps<RootStackParamList, 'ContactSupport'>;

export default function ContactSupport({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [text, setText] = useState('');

  const name = route.params?.name ?? 'Jonas';
  const plate = route.params?.plate ?? 'ERS 8579';
  const vehicleLabel = route.params?.vehicleLabel ?? 'Toyota Camry';
  // const avatar = (route.params?.avatar as any) ?? assets.images.avatar3;
  const avatar = assets.images.avatar4;

  const send = () => {
    setText('');
    // In a real app, append to messages state and send to backend
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Top background with overlays */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground
        source={require('../../assets/backgrounds/signin.png')}
        style={[styles.hero]}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <View style={styles.heroRow}>
          <View>
            <Pressable style={styles.back} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={20} color="#111" />
            </Pressable>
          </View>
          <View
            style={{
              // flex: 0,
              alignItems: 'center',
              gap: 10,
              flexDirection: 'row',
            }}
          >
            <View>
              <Text style={styles.driverName}>{name}</Text>
              <Text style={styles.subtitle}>
                {plate} - {vehicleLabel}
              </Text>
            </View>
            <Image source={avatar} style={styles.avatar} />
          </View>
        </View>
      </ImageBackground>

      {/* Messages in white sheet */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <View style={styles.sheet}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Sample conversation */}
            <View style={[styles.row, styles.right]}>
              <View style={[styles.bubble, styles.mine]}>
                <Text>Hello, are you nearby?</Text>
                <Text style={styles.time}>9:24</Text>
              </View>
              <Image source={assets.images.avatar4} style={styles.msgAvatar} />
            </View>

            <View style={[styles.row, styles.right]}>
              <View style={[styles.bubble, styles.mine]}>
                <Text>
                  Lorem ipsum dolor sit amet consectetur. Quis purus hendrerit
                  viverra imperdiet mi dolor viverra congue.
                </Text>
                <Text style={styles.time}>9:24</Text>
              </View>
              <Image source={assets.images.avatar4} style={styles.msgAvatar} />
            </View>

            <View style={[styles.row, styles.left]}>
              <Image source={assets.images.avatar1} style={styles.msgAvatar} />
              <View style={[styles.bubble, styles.theirs]}>
                <Text>I'll be there in a few mins</Text>
                <Text style={styles.time}>9:24</Text>
              </View>
            </View>

            <View style={[styles.row, styles.right]}>
              <View style={[styles.bubble, styles.mine]}>
                <Text>OK, I'm in front of the bus stop</Text>
                <Text style={styles.time}>9:24</Text>
              </View>
              <Image source={assets.images.avatar4} style={styles.msgAvatar} />
            </View>

            <View style={[styles.row, styles.left]}>
              <Image source={assets.images.avatar1} style={styles.msgAvatar} />
              <View style={[styles.bubble, styles.theirs]}>
                <Text>
                  Sorry, I'm stuck in traffic. Please give me a moment.
                </Text>
                <Text style={styles.time}>9:24</Text>
              </View>
            </View>
          </ScrollView>

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type you message"
              placeholderTextColor="#9AA0A6"
              value={text}
              onChangeText={setText}
            />
            <Pressable style={styles.send} onPress={send}>
              <Ionicons name="send" size={18} color="#111" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  hero: {
    height: 100,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    // paddingBottom: 6,
    gap: 10,
  },
  back: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  driverName: {
    color: '#111',
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'right',
  },
  subtitle: { color: '#6F6F6F', fontSize: 12 },
  avatar: { width: 46, height: 46, borderRadius: 18 },

  // chat
  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 },
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '70%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },
  mine: { backgroundColor: '#DDF0FF', borderTopRightRadius: 4 },
  theirs: { backgroundColor: '#EFEFEF', borderTopLeftRadius: 4 },
  time: { marginTop: 4, color: '#6F6F6F', fontSize: 10, textAlign: 'right' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, marginHorizontal: 8 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F4F5F6',
    paddingHorizontal: 14,
    color: '#111',
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
