// src/services/auth.ts
import { api, setAuthToken } from './api';

export type SignupPayload = { name: string; email: string; number: string };
export type User = { id: string; name: string; email: string; number: string };

export async function signup(data: SignupPayload): Promise<User> {
  const res = await api.post('/signup', data);
  // Expected: { user: {...}, token: '...' }
  console.log('data:',res.data);
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