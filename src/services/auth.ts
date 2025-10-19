// src/services/auth.ts
import { api, setAuthToken } from './api';
import qs from 'qs';
import * as Keychain from 'react-native-keychain';

const KEY = 'auth_token';

export type RegisterPayload = {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  phone?: string;
};

export type ApiOk<T> = {
  status: 'Success';
  key: string | null;
  message: string | null;
  data: T;
};

export type ApiErr = {
  status: 'Error';
  key: string;
  message: string;
  data?: Record<string, string[]>;
};

export type RegisterOK = ApiOk<{
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
  message: string; // “Registration successful…”
}>;

export type SignupPayload = { name: string; email: string; number: string };
export type User = { id: string; name: string; email: string; number: string };

export async function signup(data: SignupPayload): Promise<User> {
  const res = await api.post('/signup', data);
  // Expected: { user: {...}, token: '...' }
  console.log('data:', res.data);
  const { user, token } = res.data;
  await setAuthToken(token);
  return user as User;
}

export async function login(email: string, password: string): Promise<User> {
  const res = await api.post('/login', { email, password });
  // Expected: { user: {...}, token: '...' }
  const { user, token } = res.data;
  await setAuthToken(token);
  return user as User;
}

export async function register(payload: RegisterPayload): Promise<RegisterOK> {
  const body = qs.stringify(payload);

  const res = await api.post<RegisterOK>('/register', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // Optional: treat 4xx as resolved so we can parse server field errors
    validateStatus: () => true,
  });

  // Narrow by runtime shape
  if ((res.data as any)?.status === 'Success') {
    return res.data as RegisterOK;
  }

  const err = res.data as unknown as ApiErr;
  // Create a readable message
  const fieldMsg = err?.data
    ? Object.entries(err.data)
        .map(([k, v]) => `${k}: ${v.join(', ')}`)
        .join('\n')
    : err?.message || 'Registration failed';
  throw new Error(fieldMsg);
}

export async function saveToken(token: string) {
  await Keychain.setGenericPassword(KEY, token, { service: KEY });
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export async function loadToken(): Promise<string | null> {
  const creds = await Keychain.getGenericPassword({ service: 'auth_token' });
  if (!creds) return null;
  return creds.password;
}

// const r = await Keychain.getGenericPassword({ service: SERVICE });
// return r === false ? null : r.password;
export async function clearToken() {
  await Keychain.resetGenericPassword({ service: KEY });
  delete api.defaults.headers.common.Authorization;
}
