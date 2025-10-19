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
