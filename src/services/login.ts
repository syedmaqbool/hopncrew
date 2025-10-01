// src/services/login.ts
import { api } from './api'; // your axios instance with baseURL & Accept header

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

export async function login(email: string, password: string): Promise<LoginSuccess> {
  const body = new URLSearchParams({ email, password }).toString();

  const res = await api.post<LoginSuccess | ApiErrorShape>(
    '/login',
    body,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      validateStatus: () => true, // let us parse server errors
    }
  );

  const data = res.data as LoginSuccess | ApiErrorShape;

  if ((data as LoginSuccess).status === 'Success') {
    return data as LoginSuccess;
  }

  // Build a readable error message
  const err = data as ApiErrorShape;
  const fieldMsg = err?.data
    ? Object.entries(err.data)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
        .join('\n')
    : err?.message || 'Login failed';
  throw new Error(fieldMsg);
}
