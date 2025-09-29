export type RootStackParamList = {
  Login: undefined;
  App : undefined
  Home: { dest?: Destination } | undefined;   // ← Home can receive { dest }
  Details: { id?: string } | undefined;
  Otp: { dial: string; phone: string };
  Signup: undefined;
  Location: undefined;
  MapTracking: undefined;
   PlaceSearch: { onPick?: (d: Destination) => void } | undefined;
   Trip: { start?: Destination; dest?: Destination } | undefined;
   AirportDetails: {
    airportCode?: string;
    title?: string;
    items?: AirportPOI[];
    onPick?: (poi: AirportPOI) => void;
  } | undefined;
 SaveFavorite: { address?: string; onSave?: (f: FavouritePayload) => void } | undefined;
  SaveFavoriteDetails: {
    initialAddress?: string;
    isStarred?: boolean;
    onConfirm?: (f: FavouritePayload) => void;
  } | undefined;
   AddPassenger: {
    initial?: PassengerCounts;
    // pass current luggage separately (optional)
    luggage?: LuggageItem[];
    onDone?: (p: PassengerCounts) => void;
    onEditLuggage?: (items: LuggageItem[]) => void;
  } | undefined;
   AddLuggage: {
    initial?: LuggageItem[];
    onDone?: (items: LuggageItem[]) => void;
  } | undefined;
  LuggageScanInfo: {
    onStartScan?: () => void;   // optional callback when user taps “Scan now”
  } | undefined;

  OversizedLuggage: {
    initial?: OversizedItemCounts;
    onDone?: (items: OversizedItemCounts) => void;
  } | undefined;

    ScheduleRide: {
    initial?: Date;
    onPick?: (when: Date) => void;
  } | undefined;
  WhyChooseUs: { onClose?: () => void } | undefined;

  FareOptions: {
    etaMinutes?: number;
    quotes: FareQuote[];
    payMethod?: string; // e.g., "Card"
    onConfirm?: (quote: FareQuote, opts: { specialRequest?: string; payMethod: string }) => void;
  } | undefined;

  SpecialRequest: {
    initial?: SpecialRequestPayload;
    onDone?: (p: SpecialRequestPayload) => void;
    onCancel?: () => void;
  } | undefined;

Policies:
    | {
        onClose?: () => void;
        onSelect?: (id: string) => void; // optional callback when a row is tapped
      }
    | undefined;
  ConfirmRequest: {
    quote: FareQuote;
    payMethod?: string;
    special?: SpecialRequestPayload | null;
    onConfirm?: (p: {
      quote: FareQuote;
      payMethod: string;
      special?: SpecialRequestPayload | null;
      coupon?: string | null;
    }) => void;
  } | undefined;

  PaymentBreakdown: {
    title?: string;
    rows: PaymentRow[];
    footnote?: string;
    currency?: string; // e.g. 'USD'
    locale?: string;   // e.g. 'en-US'
  };
  PaymentMethods: {
    selected?: PayMethodKey;
    cards?: SavedCard[];
    onSelect?: (p: { method: PayMethodKey; cardId?: string }) => void;
  };
   AddCard: {
    onAdded?: (card: SavedCard) => void;
  };
  Processing: { durationMs?: number; onDone?: () => void } | undefined;
  EnRoute: {
    etaMinutes?: number;
    riderName?: string;
    driver?: {
      name: string;
      rating: number;
      years: number;
      km: string;
      verified?: boolean;
      avatar?: string;
    };
    vehicle?: {
      label: string;
      plate: string;
      image?: string;
    };
    onContact?: () => void;
    onCancel?: () => void;
    onSupport?: () => void;
    onPolicies?: () => void;
  } | undefined;

  EditProfile:
    | {
        initial?: EditProfilePayload;
        onSave?: (p: EditProfilePayload) => void;
      }
    | undefined;

    MyRides: undefined; 
    RideDetails: {
    ride: RideDetails;
    onCancel?: (id: string) => void;
  };
  Notifications: undefined;
  Wallet: undefined;
  Payment: undefined;
  // AddCard: undefined; // if you already have an Add Card flow
  CreditCards: undefined;
  GooglePay: { email?: string } | undefined;
  AddPaymentMethod: undefined;
  Settings:undefined;
  AccountSettings: undefined;
  FavouriteAddresses: undefined;

};

export type DriverMini = {
  name: string;
  rating: number;     // 4.2
  avatar?: any;       // ImageSourcePropType
  carPlate?: string;  // "ERS 8579"
  carModel?: string;  // "Toyota Camry"
};

export type RideDetails = {
  id: string;
  status: 'Upcoming' | 'Completed' | 'Canceled';
  whenLabel: string;         // "Today, 5:19 PM"
  from: string;              // "Toronto Pearson Airport - T1"
  to: string;                // "Hamill Avenue San Diego, CA 929"
  distanceKm: number;        // 12.5
  timeLabel: string;         // "30 - 40 min"
  fare: number;              // 46.24
  driver: DriverMini;
};

export type EditProfilePayload = {
  name: string;
  email: string;
  dial: string;        // e.g. "+1"
  phone: string;
  whatsappSame: boolean;
  referral: string;
  avatarUrl?: string;
};


export type Destination = {
  latitude: number;
  longitude: number;
  description: string;
  placeId?: string;
};

export type AirportPOI = {
  id: string;
  title: string;
  subtitle: string;  // address / terminal / gate, etc.
  lat?: number;
  lon?: number;
};

export type Favourite = { id: string; address: string; isStarred?: boolean };

export type FavouritePayload = {
  address: string;
  coords?: { latitude: number; longitude: number; placeId?: string };
  label: 'Home' | 'Work' | 'Other';
  customTitle?: string;
  isStarred?: boolean;
};

export type PassengerCounts = {
  adults: number;
  children: number;
  infants: number;
  seats: Record<string, number>; // e.g. { infantRear: 1, toddlerRear: 0, toddlerFront: 2 }
};

export type LuggageSize = 'XL' | 'L' | 'M' | 'S' | 'Carry-on' | 'Oversized';



export type LuggageItem = {
  size: LuggageSize;
  count: number;
  weightKg?: number;
  dimsCm?: { w: number; h: number }; // optional visual dims
  subtype?: OversizedKind;
  title?: string; // nice label for UI
};

export type OversizedKind =
  | 'bicycles'
  | 'golf'
  | 'snowboard'
  | 'ski'
  | 'surfboard'
  | 'sports'
  | 'hockey'
  | 'music';

export type OversizedItemCounts = Partial<Record<OversizedKind, number>>;

export type FareQuote = {
  id: string;
  tier: string;
  seatText?: string;
  price: number;
  oldPrice?: number;
  tax?: number;
  image?: any;
};

export type SpecialRequestPayload = {
  caringPet: boolean;
  quietRide: boolean;
  note: string;
};

export type PaymentRow = {
  label: string;
  value: number | string; // money or plain text like "1 hr"
  money?: boolean;        // format as currency when true (default: true for numbers)
  bold?: boolean;         // emphasize right value
};

export type SavedCard = {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'generic';
  last4: string;
  exp: string; // MM/YY
   holder?: string;
};

export type PayMethodKey = 'card' | 'wallet' | 'cash';









