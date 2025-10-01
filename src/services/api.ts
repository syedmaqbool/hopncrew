import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';

const BASE_URL = Platform.OS === 'android' ? 'https://portal.airporttaxiairportlimo.com/api/v1/' : 'https://portal.airporttaxiairportlimo.com/api/v1/';

export const api = axios.create({ baseURL: BASE_URL, timeout: 15000, headers: { Accept: 'application/vnd.api+json' } });

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


export type OtpVerifySuccess = {
  status: 'Success';
  key: 'otp_verified';
  message: string;
  data: {
    user: {
      id: number; first_name: string; last_name: string; email: string;
      email_verified_at: string | null; created_at: string; updated_at: string;
    };
    token: string; // <<— bearer token
  };
};

export type ApiErrorShape = {
  status: 'Error';
  key: string;
  message: string;
  data: unknown;
};

export async function verifyOtp(email: string, otp: string) {
  // API expects x-www-form-urlencoded
  const body = new URLSearchParams({ email, otp }).toString();
  const { data } = await api.post<OtpVerifySuccess>(
    '/register/verify-otp',
    body,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  );
  return data;
}


