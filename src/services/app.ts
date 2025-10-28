// src/services/app.ts
import { api } from './api';
import type { ApiOk } from './auth';

export type AirportApiItem = {
  id?: string | number;
  name: string;
  code?: string;
  lat?: number;
  lng?: number;
  lon?: number;
  long?: number;
  latitude?: number;
  longitude?: number;
};

export type Airport = {
  name: string;
  latitude: number;
  longitude: number;
  code?: string;
};

// GET /airports -> returns list of airports (name, lat, long)
export async function getAirports(): Promise<Airport[]> {
  const res = await api.get<ApiOk<any> | any>('/airports', {
    validateStatus: () => true, // handle all statuses gracefully
  });

  const body = res.data as any;

  // ✅ Safely navigate nested structure
  const list: unknown =
    body?.data?.airports?.data ??
    body?.data?.airports ??
    body?.data ??
    body?.airports ??
    body;

  const arr = Array.isArray(list) ? list : [];

  // ✅ Map API fields into consistent Airport model
  const mapped = arr
    .map((it: any) => ({
      id: it.id,
      name: it.name,
      code: it.code,
      city: it.city,
      province: it.province,
      country: it.country,
      latitude: parseFloat(it.latitude),
      longitude: parseFloat(it.longitude),
      address: it.address,
      is_active: !!it.is_active,
      image: it.image ?? null,
    }))
    .filter(a => !!a.name && !isNaN(a.latitude) && !isNaN(a.longitude));

  return mapped;
}

// GET /luggage-types -> returns list of luggage types (id, label, category)
export type LuggageType = {
  id: number;
  label: string;
  category: string;
  image_url: string | null;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export async function getLuggageTypes(): Promise<LuggageType[]> {
  const res = await api.get('/luggage-types', {
    validateStatus: () => true,
  });

  const body = res.data as any;

  // ✅ Safely unwrap nested structure
  const list: unknown =
    body?.data?.luggage_types?.data ??
    body?.data?.luggage_types ??
    body?.data ??
    body?.luggage_types ??
    body;

  const arr = Array.isArray(list) ? list : [];

  // ✅ Map and sanitize values
  const mapped = arr
    .map(
      (it: any): LuggageType => ({
        id: Number(it.id),
        label: it.label,
        category: it.category,
        image_url: it.image_url ?? null,
        description: it.description,
        is_active: !!it.is_active,
        created_at: it.created_at,
        updated_at: it.updated_at,
      }),
    )
    .filter(a => a.is_active && !!a.label);

  return mapped;
}

// GET /child-seat-types -> returns list of child seat types (id, label, image_url, description)
export type ChildSeatType = {
  id: number;
  label: string;
  image_url: string | null;
  description: string;
  age_range: string;
  weight_range: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export async function getChildSeatTypes(): Promise<ChildSeatType[]> {
  const res = await api.get('/child-seat-types', {
    validateStatus: () => true,
  });

  const body = res.data as any;

  // ✅ Safely unwrap the nested structure (handles multiple response shapes)
  const list: unknown =
    body?.data?.child_seat_types?.data ??
    body?.data?.child_seat_types ??
    body?.data ??
    body?.child_seat_types ??
    body;

  const arr = Array.isArray(list) ? list : [];

  // ✅ Map and sanitize fields
  const mapped = arr
    .map(
      (it: any): ChildSeatType => ({
        id: Number(it.id),
        label: it.label,
        image_url: it.image_url ?? null,
        description: it.description ?? '',
        age_range: it.age_range ?? '',
        weight_range: it.weight_range ?? '',
        is_active: !!it.is_active,
        created_at: it.created_at,
        updated_at: it.updated_at,
      }),
    )
    .filter(a => a.is_active && !!a.label);

  return mapped;
}

// GET /passenger-types -> returns list of passenger types (id, label, image_url, description)
export type PassengerType = {
  id: number;
  label: string;
  image_url: string | null;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export async function getPassengerTypes(): Promise<PassengerType[]> {
  const res = await api.get('/passenger-types', {
    validateStatus: () => true, // let caller handle non-2xx if needed
  });

  const body = res.data as any;

  // Safely unwrap nested structures: data.passenger_types.data → data.passenger_types → data → passenger_types → body
  const list: unknown =
    body?.data?.passenger_types?.data ??
    body?.data?.passenger_types ??
    body?.data ??
    body?.passenger_types ??
    body;

  const arr = Array.isArray(list) ? list : [];

  const mapped = arr
    .map(
      (it: any): PassengerType => ({
        id: Number(it.id),
        label: it.label,
        image_url: it.image_url ?? null,
        description: it.description ?? '',
        is_active: !!it.is_active,
        created_at: it.created_at,
        updated_at: it.updated_at,
      }),
    )
    .filter(p => p.is_active && !!p.label);

  return mapped;
}

// GET /vehicle-types -> returns list of vehicle types (id, label, image_url, description, seats, luggage, base_price)
export type VehicleType = {
  id: number;
  name: string;
  details: string;
  base_fare: string;
  fare_per_km: string;
  image_url: string | null;
  max_passengers: number;
  max_luggage: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export async function getVehicleTypes(): Promise<VehicleType[]> {
  const res = await api.get('/vehicle-types', {
    validateStatus: () => true,
  });

  const body = res.data as any;
  const list: unknown =
    body?.data?.vehicle_types?.data ??
    body?.data?.vehicle_types ??
    body?.vehicle_types ??
    body?.data ??
    body;

  const arr = Array.isArray(list) ? list : [];

  const mapped = arr
    .map(
      (it: any): VehicleType => ({
        id: Number(it.id),
        name: String(it.name ?? ''),
        details: String(it.details ?? ''),
        base_fare: String(it.base_fare ?? '0'),
        fare_per_km: String(it.fare_per_km ?? '0'),
        image_url: it.image_url ?? null,
        max_passengers: Number(it.max_passengers ?? 0),
        max_luggage: Number(it.max_luggage ?? 0),
        is_active: it.is_active != null ? !!it.is_active : undefined,
        created_at: it.created_at,
        updated_at: it.updated_at,
      }),
    )
    .filter(v => v.is_active !== false);

  return mapped;
}
