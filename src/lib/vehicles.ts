// Demo inventory. Authored at production fidelity, but not real listings —
// see PRODUCT.md "Evidence on Hand". The comprehensive India-wide dataset is
// queued work and deliberately not started here.

export type Track = "ride-drive" | "heavy-farm";

export type Category =
  | "bikes"
  | "scooters"
  | "cars"
  | "evs"
  | "trucks"
  | "jcbs"
  | "tractors";

/** Tiered gating, Yulu pattern. Operator-included bookings bypass this. */
export type LicenceClass = "none" | "two-wheeler" | "lmv" | "commercial";

export type RideDriveSpecs = {
  engineCc?: number;
  rangeKm?: number;
  seats: number;
  transmission: "manual" | "automatic";
};

export type HeavyFarmSpecs = {
  powerHp: number;
  /** Backhoes and excavators. */
  reachM?: number;
  bucketCapacityM3?: number;
  /** Goods vehicles. */
  payloadTonnes?: number;
  operatingWeightKg?: number;
};

type BaseVehicle = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  category: Category;
  city: string;
  requiredLicence: LicenceClass;
  perDay: number;
  rating: number;
  trips: number;
  /** Minimum trust score to unlock. Mechanism is real; values are not final. */
  minTrustScore: number;
};

export type RideDriveVehicle = BaseVehicle & {
  track: "ride-drive";
  specs: RideDriveSpecs;
  verified: boolean;
};

export type HeavyFarmVehicle = BaseVehicle & {
  track: "heavy-farm";
  specs: HeavyFarmSpecs;
  /** Both modes are priced because the operator choice is a booking-time toggle. */
  perDayWithOperator: number;
  rtoRegistered: boolean;
};

export type Vehicle = RideDriveVehicle | HeavyFarmVehicle;

export const CATEGORIES: {
  id: Category;
  label: string;
  track: Track;
  licence: LicenceClass;
}[] = [
  { id: "bikes", label: "Bikes", track: "ride-drive", licence: "two-wheeler" },
  { id: "scooters", label: "Scooters", track: "ride-drive", licence: "none" },
  { id: "cars", label: "Cars", track: "ride-drive", licence: "lmv" },
  { id: "evs", label: "EVs", track: "ride-drive", licence: "lmv" },
  { id: "trucks", label: "Trucks", track: "heavy-farm", licence: "commercial" },
  { id: "jcbs", label: "JCBs", track: "heavy-farm", licence: "commercial" },
  { id: "tractors", label: "Tractors", track: "heavy-farm", licence: "commercial" },
];

/**
 * The ladder a renter climbs. Thresholds are illustrative — the mechanism is
 * the decided part, the numbers are an open item (see CLAUDE.md).
 */
export const TRUST_TIERS: {
  score: number;
  label: string;
  category: Category;
}[] = [
  { score: 0, label: "Scooters", category: "scooters" },
  { score: 10, label: "Bikes to 350cc", category: "bikes" },
  { score: 20, label: "Hatchbacks & sedans", category: "cars" },
  { score: 40, label: "Electric vehicles", category: "evs" },
  { score: 45, label: "Tractors", category: "tractors" },
  { score: 60, label: "Goods vehicles", category: "trucks" },
  { score: 75, label: "Backhoes & excavators", category: "jcbs" },
];

/** The demo account's standing. Deliberately mid-ladder: the frontier is the point. */
export const DEMO_TRUST_SCORE = 62;

export const VEHICLES: Vehicle[] = [
  {
    id: "re-classic-350",
    slug: "royal-enfield-classic-350",
    track: "ride-drive",
    brand: "Royal Enfield",
    model: "Classic 350",
    category: "bikes",
    city: "Chennai",
    requiredLicence: "two-wheeler",
    perDay: 899,
    rating: 4.8,
    trips: 214,
    minTrustScore: 0,
    verified: true,
    specs: { engineCc: 349, seats: 2, transmission: "manual" },
  },
  {
    id: "honda-activa-6g",
    slug: "honda-activa-6g",
    track: "ride-drive",
    brand: "Honda",
    model: "Activa 6G",
    category: "scooters",
    city: "Coimbatore",
    requiredLicence: "none",
    perDay: 399,
    rating: 4.6,
    trips: 507,
    minTrustScore: 0,
    verified: true,
    specs: { engineCc: 109, seats: 2, transmission: "automatic" },
  },
  {
    id: "maruti-swift",
    slug: "maruti-suzuki-swift",
    track: "ride-drive",
    brand: "Maruti Suzuki",
    model: "Swift",
    category: "cars",
    city: "Chennai",
    requiredLicence: "lmv",
    perDay: 1799,
    rating: 4.7,
    trips: 331,
    minTrustScore: 20,
    verified: true,
    specs: { engineCc: 1197, seats: 5, transmission: "manual" },
  },
  {
    id: "tata-nexon-ev",
    slug: "tata-nexon-ev",
    track: "ride-drive",
    brand: "Tata",
    model: "Nexon EV",
    category: "evs",
    city: "Bengaluru",
    requiredLicence: "lmv",
    perDay: 2499,
    rating: 4.9,
    trips: 128,
    minTrustScore: 40,
    verified: true,
    specs: { rangeKm: 465, seats: 5, transmission: "automatic" },
  },
  {
    id: "mahindra-thar",
    slug: "mahindra-thar",
    track: "ride-drive",
    brand: "Mahindra",
    model: "Thar",
    category: "cars",
    city: "Madurai",
    requiredLicence: "lmv",
    perDay: 3499,
    rating: 4.8,
    trips: 96,
    minTrustScore: 60,
    verified: true,
    specs: { engineCc: 2184, seats: 4, transmission: "manual" },
  },
  {
    id: "jcb-3dx-super",
    slug: "jcb-3dx-super",
    track: "heavy-farm",
    brand: "JCB",
    model: "3DX Super",
    category: "jcbs",
    city: "Chennai",
    requiredLicence: "commercial",
    perDay: 11500,
    perDayWithOperator: 14200,
    rating: 4.7,
    trips: 63,
    minTrustScore: 75,
    rtoRegistered: true,
    specs: {
      powerHp: 92,
      reachM: 5.5,
      bucketCapacityM3: 1.1,
      operatingWeightKg: 7800,
    },
  },
  {
    id: "mahindra-575-di",
    slug: "mahindra-575-di",
    track: "heavy-farm",
    brand: "Mahindra",
    model: "575 DI",
    category: "tractors",
    city: "Madurai",
    requiredLicence: "commercial",
    perDay: 2800,
    perDayWithOperator: 3600,
    rating: 4.6,
    trips: 141,
    minTrustScore: 45,
    rtoRegistered: true,
    specs: { powerHp: 47, payloadTonnes: 1.7 },
  },
  {
    id: "tata-ace-gold",
    slug: "tata-ace-gold",
    track: "heavy-farm",
    brand: "Tata",
    model: "Ace Gold",
    category: "trucks",
    city: "Hyderabad",
    requiredLicence: "commercial",
    perDay: 1600,
    perDayWithOperator: 2350,
    rating: 4.5,
    trips: 288,
    minTrustScore: 30,
    rtoRegistered: true,
    specs: { powerHp: 30, payloadTonnes: 0.75 },
  },
  {
    id: "hyundai-r215l",
    slug: "hyundai-r215l",
    track: "heavy-farm",
    brand: "Hyundai",
    model: "R215L Excavator",
    category: "jcbs",
    city: "Bengaluru",
    requiredLicence: "commercial",
    perDay: 18900,
    perDayWithOperator: 22400,
    rating: 4.9,
    trips: 27,
    minTrustScore: 90,
    rtoRegistered: true,
    specs: {
      powerHp: 148,
      reachM: 9.9,
      bucketCapacityM3: 1.0,
      operatingWeightKg: 21400,
    },
  },
];

export const formatINR = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;
