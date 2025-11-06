// src/axios-tron.ts
import Reactotron from 'reactotron-react-native';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from './api'; // <-- your axios instance

// REQUEST
api.interceptors.request.use((cfg: AxiosRequestConfig) => {
  Reactotron.display?.({
    name: 'REQ',
    important: true,
    preview: `${(cfg.method || 'GET').toUpperCase()} ${cfg.url}`,
    value: {
      url: cfg.url,
      method: cfg.method,
      headers: cfg.headers,
      data: cfg.data,
    },
  });
  return cfg;
});

// RESPONSE
api.interceptors.response.use(
  (res: AxiosResponse) => {
    Reactotron.display?.({
      name: `RES ${res.status}`,
      preview: res.config?.url || '',
      value: {
        url: res.config?.url,
        status: res.status,
        duration: (res as any).duration, // may be undefined; fine
        data: res.data,
        headers: res.headers,
      },
    });
    return res;
  },
  err => {
    const cfg = err?.config || {};
    Reactotron.display?.({
      name: 'ERR',
      important: true,
      preview: cfg?.url || 'Axios Error',
      value: {
        url: cfg?.url,
        method: cfg?.method,
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      },
    });
    return Promise.reject(err);
  },
);
