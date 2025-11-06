export type RootStackParamList = {
<<<<<<< HEAD
  Login: undefined;
  App : undefined
  Home: { dest?: Destination } | undefined;   // ← Home can receive { dest }
  Details: { id?: string } | undefined;
  // Otp: { dial: string; phone: string };
   Otp: { email: string, user: User } | undefined;
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
=======
  RideSelection: undefined;
  Login: undefined;
  App: undefined;
  Home: { dest?: Destination } | undefined; // ← Home can receive { dest }
  Details: { id?: string } | undefined;
  // Otp: { dial: string; phone: string };
  Otp: { email: string; user: User } | undefined;
  Signup: undefined;
  Location: undefined;
  MapTracking: undefined;
  PlaceSearch: { onPick?: (d: Destination) => void } | undefined;
  Trip:
    | {
        start?: Destination;
        dest?: Destination;
        flow?: 'regular' | 'airport';
        when?: Date;
      }
    | undefined;
  FlightDetails:
    | {
        airportCode?: string;
        initialWhen?: Date;
        from?: Destination;
        start?: Destination;
        dest?: Destination;
      }
    | undefined;
  FlightDeparture:
    | {
        airportCode?: string;
        from?: Destination;
        when?: Date;
        onPick?: (d: Destination) => void;
      }
    | undefined;
  SelectDeparture:
    | {
        onPick?: (d: Destination) => void;
        onPickAirline?: (code: string) => void;
        when?: Date;
      }
    | undefined;
  SelectedAirport:
    | {
        airport: Destination;
        airline?: string;
        when?: Date;
        onDone?: (p: { airport: Destination; airline?: string }) => void;
      }
    | undefined;
  AirportDetails:
    | {
        airportCode?: string;
        title?: string;
        items?: AirportPOI[];
        onPick?: (poi: AirportPOI) => void;
      }
    | undefined;
  SaveFavorite:
    | { address?: string; onSave?: (f: FavouritePayload) => void }
    | undefined;
  SaveFavoriteDetails:
    | {
        initialAddress?: string;
        isStarred?: boolean;
        onConfirm?: (f: FavouritePayload) => void;
      }
    | undefined;
  AddPassenger:
    | {
        initial?: PassengerCounts;
        // pass current luggage separately (optional)
        luggage?: LuggageItem[];
        start?: Destination;
        dest?: Destination;
        when?: Date;
        onDone?: (p: PassengerCounts) => void;
        onEditLuggage?: (items: LuggageItem[]) => void;
      }
    | undefined;
  AddLuggage:
    | {
        initial?: LuggageItem[];
        start?: Destination;
        dest?: Destination;
        when?: Date;
        passengers?: number;
        onDone?: (items: LuggageItem[]) => void;
      }
    | undefined;
  LuggageScanInfo:
    | {
        onStartScan?: () => void; // optional callback when user taps “Scan now”
      }
    | undefined;

  ChildSeatInfo: undefined;

  OversizedLuggage:
    | {
        initial?: OversizedItemCounts;
        onDone?: (items: OversizedItemCounts) => void;
      }
    | undefined;

  // ScheduleRide:
  //   | {
  //       initial?: Date;
  //       onPick?: (when: Date) => void;
  //     }
  //   | undefined;
  WhyChooseUs: { onClose?: () => void } | undefined;

  FareOptions:
    | {
        etaMinutes?: number;
        quotes: FareQuote[];
        payMethod?: string; // e.g., "Card"
        start?: Destination;
        dest?: Destination;
        when?: Date;
        passengers?: number;
        luggage?: SelectedLuggagePayload[];
        onConfirm?: (
          quote: FareQuote,
          opts: { specialRequest?: string; payMethod: string },
        ) => void;
      }
    | undefined;

  SpecialRequest:
    | {
        initial?: SpecialRequestPayload;
        onDone?: (p: SpecialRequestPayload) => void;
        onCancel?: () => void;
      }
    | undefined;

  Policies:
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
    | {
        onClose?: () => void;
        onSelect?: (id: string) => void; // optional callback when a row is tapped
      }
    | undefined;
<<<<<<< HEAD
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
=======
  PassengerWait: undefined;
  DriverLate: undefined;
  CancelChange: undefined;
  Refund: undefined;
  GuaranteedPickup: undefined;
  Tolls: undefined;

  ConfirmRequest:
    | {
        quote: FareQuote;
        payMethod: string;
        special?: SpecialRequestPayload | null;
        start?: Destination;
        dest?: Destination;
        when?: Date;
        onConfirm?: (p: {
          quote: FareQuote;
          payMethod: string;
          special?: SpecialRequestPayload | null;
          coupon?: string | null;
        }) => void;
      }
    | undefined;
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  PaymentBreakdown: {
    title?: string;
    rows: PaymentRow[];
    footnote?: string;
    currency?: string; // e.g. 'USD'
<<<<<<< HEAD
    locale?: string;   // e.g. 'en-US'
=======
    locale?: string; // e.g. 'en-US'
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  };
  PaymentMethods: {
    selected?: PayMethodKey;
    cards?: SavedCard[];
<<<<<<< HEAD
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
=======
    start?: Destination;
    dest?: Destination;
    onSelect?: (p: { method: PayMethodKey; cardId?: string }) => void;
  };
  AddCard: {
    onAdded?: (card: SavedCard) => void;
  };
  Processing:
    | {
        durationMs?: number;
        onDone?: () => void;
        start?: Destination;
        dest?: Destination;
      }
    | undefined;
  BookingReceived:
    | {
        onContinue?: () => void; // called when user taps I Agree & Continue
        start?: Destination;
        dest?: Destination;
      }
    | undefined;
  BookingReceivedTerms:
    | {
        onOkay?: () => void;
        onCancel?: () => void;
      }
    | undefined;
  CancelRide:
    | {
        onSubmit?: (reason: string) => void;
        onKeep?: () => void;
      }
    | undefined;
  ConfirmCancelPopup:
    | {
        onOk?: () => void;
      }
    | undefined;
  NoRideAvaiable:
    | {
        onContact?: () => void;
        onOk?: () => void;
        onRetry?: () => void;
      }
    | undefined;
  RideConfirmed:
    | {
        onOk?: () => void;
        start?: Destination;
        dest?: Destination;
      }
    | undefined;
  AssignedVehicle:
    | {
        start?: Destination;
        dest?: Destination;
        etaMinutes?: number;
        riderName?: string;
        driver?: {
          name: string;
          rating?: number;
          years?: number;
          km?: string;
          verified?: boolean;
          avatar?: string;
        };
        vehicle?: {
          label: string;
          plate: string;
          image?: string;
        };
      }
    | undefined;
  ContactSupport:
    | {
        name?: string;
        plate?: string;
        vehicleLabel?: string;
        avatar?: any;
      }
    | undefined;
  EnRoute:
    | {
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
      }
    | undefined;
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  EditProfile:
    | {
        initial?: EditProfilePayload;
        onSave?: (p: EditProfilePayload) => void;
      }
    | undefined;

<<<<<<< HEAD
    MyRides: undefined; 
    RideDetails: {
=======
  MyRides: undefined;
  RideDetails: {
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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
<<<<<<< HEAD
  Settings:undefined;
  AccountSettings: undefined;
  FavouriteAddresses: undefined;

=======
  Settings: undefined;
  AccountSettings: undefined;
  FavouriteAddresses: undefined;
  ScheduleRide: {
    initial?: Date;
    start?: Destination;
    dest?: Destination;
    passengers?: number;
    luggage?: SelectedLuggagePayload[];
    onPick?: (when: Date, holdFunds: boolean) => void;
  };
  ScheduleFlight:
    | {
        initial?: Date;
        airportCode?: string;
        onPick?: (when: Date) => void;
      }
    | undefined;
  AirportPickupPerks: undefined;
  AirportGuide: undefined;
  FlightManual:
    | {
        initial?: string;
        onAdd?: (flightNo: string) => void;
      }
    | undefined;
  ScanBagSize:
    | {
        initialSize?: 'Large' | 'Small';
        onDone?: (size: 'Large' | 'Small') => void;
      }
    | undefined;
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
};

export type DriverMini = {
  name: string;
<<<<<<< HEAD
  rating: number;     // 4.2
  avatar?: any;       // ImageSourcePropType
  carPlate?: string;  // "ERS 8579"
  carModel?: string;  // "Toyota Camry"
=======
  rating: number; // 4.2
  avatar?: any; // ImageSourcePropType
  carPlate?: string; // "ERS 8579"
  carModel?: string; // "Toyota Camry"
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
};

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  created_at: string;
  updated_at: string;
<<<<<<< HEAD
}
=======
};
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

export type RideDetails = {
  id: string;
  status: 'Upcoming' | 'Completed' | 'Canceled';
<<<<<<< HEAD
  whenLabel: string;         // "Today, 5:19 PM"
  from: string;              // "Toronto Pearson Airport - T1"
  to: string;                // "Hamill Avenue San Diego, CA 929"
  distanceKm: number;        // 12.5
  timeLabel: string;         // "30 - 40 min"
  fare: number;              // 46.24
=======
  whenLabel: string; // "Today, 5:19 PM"
  from: string; // "Toronto Pearson Airport - T1"
  to: string; // "Hamill Avenue San Diego, CA 929"
  distanceKm: number; // 12.5
  timeLabel: string; // "30 - 40 min"
  fare: number; // 46.24
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  driver: DriverMini;
};

export type EditProfilePayload = {
  name: string;
  email: string;
<<<<<<< HEAD
  dial: string;        // e.g. "+1"
=======
  dial: string; // e.g. "+1"
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  phone: string;
  whatsappSame: boolean;
  referral: string;
  avatarUrl?: string;
};

<<<<<<< HEAD

=======
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
export type Destination = {
  latitude: number;
  longitude: number;
  description: string;
  placeId?: string;
};

export type AirportPOI = {
  id: string;
  title: string;
<<<<<<< HEAD
  subtitle: string;  // address / terminal / gate, etc.
=======
  subtitle: string; // address / terminal / gate, etc.
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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

<<<<<<< HEAD
export type LuggageSize = 'XL' | 'L' | 'M' | 'S' | 'Carry-on' | 'Oversized';


=======
export type LuggageSize =
  | 'XL'
  | 'L'
  | 'M'
  | 'S'
  | 'Carry-on'
  | 'Oversized'
  | 'Backpack';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

export type LuggageItem = {
  size: LuggageSize;
  count: number;
  weightKg?: number;
  dimsCm?: { w: number; h: number }; // optional visual dims
  subtype?: OversizedKind;
  title?: string; // nice label for UI
};

<<<<<<< HEAD
=======
export type SelectedLuggagePayload = {
  luggage_type_id: number;
  quantity: number;
};

>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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
<<<<<<< HEAD
=======
  eta?: any;
  price_breakdown?: any;
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
};

export type SpecialRequestPayload = {
  caringPet: boolean;
  quietRide: boolean;
  note: string;
};

export type PaymentRow = {
  label: string;
  value: number | string; // money or plain text like "1 hr"
<<<<<<< HEAD
  money?: boolean;        // format as currency when true (default: true for numbers)
  bold?: boolean;         // emphasize right value
=======
  money?: boolean; // format as currency when true (default: true for numbers)
  bold?: boolean; // emphasize right value
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
};

export type SavedCard = {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'generic';
  last4: string;
  exp: string; // MM/YY
<<<<<<< HEAD
   holder?: string;
};

export type PayMethodKey = 'card' | 'wallet' | 'cash';









=======
  holder?: string;
};

export type PayMethodKey = 'card' | 'wallet' | 'cash';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
