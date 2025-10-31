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

// POST /calculate-ride-cost -> returns list of vehicle types and times and duration KM

export type RidePoint = { lat: number; lng: number };

export type RideCalculatePayload = {
  origin: RidePoint;
  destination: RidePoint;
  stop_overs?: RidePoint[]; // optional, keep for future
};

export type RouteInfo = {
  origin: RidePoint;
  destination: RidePoint;
  stop_overs: RidePoint[];
  distance_km: number;
  duration_minutes: number;
  polyline?: string | null;
};

export type VehicleCapacity = {
  max_passengers: number;
  max_luggage: number;
};

export type PriceBreakdown = {
  base_fare: number;
  distance_km: number;
  fare_per_km: number;
  distance_fare: number;
};

export type VehicleOption = {
  vehicle_type_id: number;
  vehicle_name: string;
  vehicle_details?: string | null;
  total_price: number;
  price_breakdown: PriceBreakdown;
  vehicle_capacity: VehicleCapacity;
  estimated_duration_minutes: number;
  image_url?: string | null; // in case backend adds it later
};

export type RideCostResult = {
  route_info: RouteInfo;
  vehicle_options: VehicleOption[];
};

// ---------- API call ----------
export async function calculateRideCost(
  payload: RideCalculatePayload,
): Promise<RideCostResult> {
  const res = await api.post('/rides/calculate-ride-cost', payload, {
    validateStatus: () => true,
  });

  const body = res.data as any;

  // Defensive extraction in case backend wraps differently
  const data = body?.data ?? body?.result ?? body; // fallbacks

  const r = data?.route_info ?? {};

  const route_info: RouteInfo = {
    origin: {
      lat: Number(r?.origin?.lat ?? 0),
      lng: Number(r?.origin?.lng ?? 0),
    },
    destination: {
      lat: Number(r?.destination?.lat ?? 0),
      lng: Number(r?.destination?.lng ?? 0),
    },
    stop_overs: Array.isArray(r?.stop_overs) ? r.stop_overs : [],
    distance_km: Number(r?.distance_km ?? 0),
    duration_minutes: Number(r?.duration_minutes ?? 0),
    polyline: r?.polyline ?? null,
  };

  const optionsRaw: any[] = Array.isArray(data?.vehicle_options)
    ? data.vehicle_options
    : [];

  const vehicle_options: VehicleOption[] = optionsRaw.map(it => ({
    vehicle_type_id: Number(it?.vehicle_type_id),
    vehicle_name: String(it?.vehicle_name ?? ''),
    vehicle_details: it?.vehicle_details ?? null,
    total_price: Number(it?.total_price ?? 0),
    price_breakdown: {
      base_fare: Number(it?.price_breakdown?.base_fare ?? 0),
      distance_km: Number(it?.price_breakdown?.distance_km ?? 0),
      fare_per_km: Number(it?.price_breakdown?.fare_per_km ?? 0),
      distance_fare: Number(it?.price_breakdown?.distance_fare ?? 0),
    },
    vehicle_capacity: {
      max_passengers: Number(it?.vehicle_capacity?.max_passengers ?? 0),
      max_luggage: Number(it?.vehicle_capacity?.max_luggage ?? 0),
    },
    estimated_duration_minutes: Number(
      it?.estimated_duration_minutes ?? route_info.duration_minutes ?? 0,
    ),
    image_url: it?.image_url ?? null,
  }));

  return { route_info, vehicle_options };
}

// ---------- Optional: map to your FareQuote shape (for UI reuse) ----------
export type FareQuote = {
  id: string;
  tier: string; // vehicle_name
  seatText?: string; // vehicle_details
  price: number; // total_price
  image?: string | null;
  fare_per_km?: number;
  max_passengers?: number;
  max_luggage?: number;
  details?: string; // keep raw details too
};

export function vehicleOptionsToQuotes(options: VehicleOption[]): FareQuote[] {
  return options.map(v => ({
    id: String(v.vehicle_type_id),
    tier: v.vehicle_name,
    seatText: v.vehicle_details ?? undefined,
    details: v.vehicle_details ?? undefined,
    price: Number(v.total_price || 0),
    image: v.image_url ?? null,
    fare_per_km: v.price_breakdown?.fare_per_km,
    max_passengers: v.vehicle_capacity?.max_passengers,
    max_luggage: v.vehicle_capacity?.max_luggage,
    price_breakdown: v.price_breakdown,
  }));
}
