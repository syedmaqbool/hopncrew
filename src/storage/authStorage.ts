// src/storage/authStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const KEY_TOKEN = 'auth.token';
const KEY_USER  = 'auth.user';

export type AuthUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type AuthState = {
  token: string;
  user: AuthUser;
};

export async function saveAuth(state: AuthState) {
  await AsyncStorage.multiSet([
    [KEY_TOKEN, state.token],
    [KEY_USER, JSON.stringify(state.user)],
  ]);
  axios.defaults.headers.common.Authorization = `Bearer ${state.token}`;
}

export async function loadAuth(): Promise<AuthState | null> {
  const [[, token], [, userJson]] = await AsyncStorage.multiGet([KEY_TOKEN, KEY_USER]);
  if (!token || !userJson) return null;
  const user: AuthUser = JSON.parse(userJson);
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  return { token, user };
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([KEY_TOKEN, KEY_USER]);
  delete axios.defaults.headers.common.Authorization;
}
