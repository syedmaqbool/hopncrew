// src/services/auth.ts
import { api, setAuthToken } from './api';
import qs from 'qs';
import * as Keychain from 'react-native-keychain';

<<<<<<< HEAD

const KEY = 'auth_token';


=======
const KEY = 'auth_token';

>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
export type RegisterPayload = {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
<<<<<<< HEAD
};



=======
  phone?: string;
};

>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
export type ApiOk<T> = {
  status: 'Success';
  key: string | null;
  message: string | null;
  data: T;
};

<<<<<<< HEAD

=======
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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

<<<<<<< HEAD
=======
export type LoginSuccess = {
  status: 'Success';
  key?: string | null;
  message?: string | null;
  data: {
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      email_verified_at?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    token: string;
  };
};

export type ApiErrorShape = {
  status: 'Error';
  key: string;
  message: string;
  data?: Record<string, string[] | string>;
};
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

export type SignupPayload = { name: string; email: string; number: string };
export type User = { id: string; name: string; email: string; number: string };

export async function signup(data: SignupPayload): Promise<User> {
  const res = await api.post('/signup', data);
  // Expected: { user: {...}, token: '...' }
<<<<<<< HEAD
  console.log('data:',res.data);
=======
  console.log('data:', res.data);
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  const { user, token } = res.data;
  await setAuthToken(token);
  return user as User;
}

<<<<<<< HEAD

export async function login(email: string, password: string): Promise<User> {
  const res = await api.post('/login', { email, password });
  // Expected: { user: {...}, token: '...' }
  const { user, token } = res.data;
  await setAuthToken(token);
  return user as User;
}


=======
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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

<<<<<<< HEAD

=======
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
export async function saveToken(token: string) {
  await Keychain.setGenericPassword(KEY, token, { service: KEY });
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

<<<<<<< HEAD

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
=======
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

export async function login(
  email: string,
  password: string,
): Promise<LoginSuccess> {
  const body = new URLSearchParams({ email, password }).toString();

  const res = await api.post<LoginSuccess | ApiErrorShape>('/login', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    validateStatus: () => true, // don't let axios throw; we inspect body
  });

  const data = res.data as LoginSuccess | ApiErrorShape;

  if ((data as LoginSuccess).status === 'Success') {
    return data as LoginSuccess;
  }

  // Preserve API key/message when throwing!
  const err = data as ApiErrorShape;
  const fieldMsg = err?.data
    ? Object.entries(err.data as any)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
        .join('\n')
    : err?.message || 'Login failed';

  const e: any = new Error(fieldMsg);
  e.key = err?.key; // <— keep the key (e.g., "email_not_verified")
  e.data = err?.data; // optional: keep the server data too
  e.status = res.status; // optional: HTTP status (403)
  throw e;
}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
