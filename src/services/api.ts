import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';

const BASE_URL = Platform.OS === 'android' ? 'http://192.168.8.165:3000' : 'http://192.168.8.165:3000';

export const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

let inMemToken: string | null = null;

export async function setAuthToken(token: string | null) {
  inMemToken = token;

  // normalize defaults.headers to an AxiosHeaders and mutate it
  const dh = api.defaults.headers as unknown as AxiosHeaders;

  if (token) {
    if (dh instanceof AxiosHeaders) dh.set('Authorization', `Bearer ${token}`);
    else (api.defaults.headers as any).Authorization = `Bearer ${token}`;

    await Keychain.setGenericPassword('auth', token, { service: 'authToken' });
  } else {
    if (dh instanceof AxiosHeaders) dh.delete('Authorization');
    else delete (api.defaults.headers as any).Authorization;

    try { await Keychain.resetGenericPassword({ service: 'authToken' }); } catch {}
  }
}

export async function loadAuthToken() {
  try {
    const creds = await Keychain.getGenericPassword({ service: 'authToken' });
    if (creds) {
      await setAuthToken(creds.password);
      return creds.password;
    }
  } catch {}
  return null;
}

// Ensure request.headers is an AxiosHeaders, then set Authorization
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (inMemToken) {
    const h = config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

    h.set('Authorization', `Bearer ${inMemToken}`);
    config.headers = h; // keep the AxiosHeaders instance (don’t assign `{}`)
  }
  return config;
});
