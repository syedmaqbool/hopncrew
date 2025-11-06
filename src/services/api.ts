import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';

<<<<<<< HEAD
const BASE_URL = Platform.OS === 'android' ? 'https://portal.airporttaxiairportlimo.com/api/v1/' : 'https://portal.airporttaxiairportlimo.com/api/v1/';

export const api = axios.create({ baseURL: BASE_URL, timeout: 15000, headers: { Accept: 'application/vnd.api+json' } });
=======
const BASE_URL =
  Platform.OS === 'android'
    ? 'https://portal.airporttaxiairportlimo.com/api/v1/'
    : 'https://portal.airporttaxiairportlimo.com/api/v1/';

const API_KEY = 'hopn_secret_api_key_2025';
const API_KEY_HEADER = 'x-api-key';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/vnd.api+json',
    [API_KEY_HEADER]: API_KEY,
  },
});
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

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

<<<<<<< HEAD
    try { await Keychain.resetGenericPassword({ service: 'authToken' }); } catch {}
=======
    try {
      await Keychain.resetGenericPassword({ service: 'authToken' });
    } catch {}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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
<<<<<<< HEAD
    const h = config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

    h.set('Authorization', `Bearer ${inMemToken}`);
    config.headers = h; // keep the AxiosHeaders instance (don’t assign `{}`)
=======
    const h =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : new AxiosHeaders(config.headers);

    if (API_KEY) h.set(API_KEY_HEADER, API_KEY);

    if (inMemToken) h.set('Authorization', `Bearer ${inMemToken}`);

    config.headers = h;
    return config;
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  }
  return config;
});

<<<<<<< HEAD

=======
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
export type OtpVerifySuccess = {
  status: 'Success';
  key: 'otp_verified';
  message: string;
  data: {
    user: {
<<<<<<< HEAD
      id: number; first_name: string; last_name: string; email: string;
      email_verified_at: string | null; created_at: string; updated_at: string;
=======
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      email_verified_at: string | null;
      created_at: string;
      updated_at: string;
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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
<<<<<<< HEAD


=======
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
