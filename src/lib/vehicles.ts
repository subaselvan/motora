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

/** Every field is optional on purpose: a spec we can't source is omitted, not
 *  guessed. The card renders only the rows a machine actually has. */
export type HeavyFarmSpecs = {
  powerHp?: number;
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
  // A geared or 100cc+ scooter needs a standard two-wheeler licence in India.
  // "none" is reserved for low-speed EVs (under 25kph / 250W), which this
  // demo fleet does not carry yet.
  { id: "scooters", label: "Scooters", track: "ride-drive", licence: "two-wheeler" },
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
    requiredLicence: "two-wheeler",
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

  /* ── Rail fill (2026-09-14) ───────────────────────────────────
     Added so each homepage rail holds enough cards to read as a rail.
     A bounded expansion, not the queued comprehensive dataset. Heavy
     spec figures are approximate class values; any we could not source
     with confidence are omitted rather than guessed. */

  // Two-wheelers, Chennai
  {
    id: "re-hunter-350",
    slug: "royal-enfield-hunter-350",
    track: "ride-drive",
    brand: "Royal Enfield",
    model: "Hunter 350",
    category: "bikes",
    city: "Chennai",
    requiredLicence: "two-wheeler",
    perDay: 849,
    rating: 4.7,
    trips: 162,
    minTrustScore: 10,
    verified: true,
    specs: { engineCc: 349, seats: 2, transmission: "manual" },
  },
  {
    id: "bajaj-pulsar-ns200",
    slug: "bajaj-pulsar-ns200",
    track: "ride-drive",
    brand: "Bajaj",
    model: "Pulsar NS200",
    category: "bikes",
    city: "Chennai",
    requiredLicence: "two-wheeler",
    perDay: 649,
    rating: 4.5,
    trips: 241,
    minTrustScore: 10,
    verified: true,
    specs: { engineCc: 199, seats: 2, transmission: "manual" },
  },
  {
    id: "tvs-jupiter",
    slug: "tvs-jupiter",
    track: "ride-drive",
    brand: "TVS",
    model: "Jupiter",
    category: "scooters",
    city: "Chennai",
    requiredLicence: "two-wheeler",
    perDay: 379,
    rating: 4.6,
    trips: 438,
    minTrustScore: 0,
    verified: true,
    specs: { engineCc: 110, seats: 2, transmission: "automatic" },
  },
  {
    id: "suzuki-access-125",
    slug: "suzuki-access-125",
    track: "ride-drive",
    brand: "Suzuki",
    model: "Access 125",
    category: "scooters",
    city: "Chennai",
    requiredLicence: "two-wheeler",
    perDay: 419,
    rating: 4.8,
    trips: 356,
    minTrustScore: 0,
    verified: true,
    specs: { engineCc: 124, seats: 2, transmission: "automatic" },
  },

  // Cars and EVs, Chennai
  {
    id: "hyundai-creta",
    slug: "hyundai-creta",
    track: "ride-drive",
    brand: "Hyundai",
    model: "Creta",
    category: "cars",
    city: "Chennai",
    requiredLicence: "lmv",
    perDay: 2899,
    rating: 4.8,
    trips: 187,
    minTrustScore: 20,
    verified: true,
    specs: { engineCc: 1497, seats: 5, transmission: "manual" },
  },
  {
    id: "tata-punch-ev",
    slug: "tata-punch-ev",
    track: "ride-drive",
    brand: "Tata",
    model: "Punch EV",
    category: "evs",
    city: "Chennai",
    requiredLicence: "lmv",
    perDay: 1999,
    rating: 4.7,
    trips: 94,
    minTrustScore: 40,
    verified: true,
    specs: { rangeKm: 421, seats: 5, transmission: "automatic" },
  },
  {
    id: "toyota-innova-crysta",
    slug: "toyota-innova-crysta",
    track: "ride-drive",
    brand: "Toyota",
    model: "Innova Crysta",
    category: "cars",
    city: "Chennai",
    requiredLicence: "lmv",
    perDay: 3799,
    rating: 4.9,
    trips: 143,
    minTrustScore: 20,
    verified: true,
    specs: { engineCc: 2393, seats: 7, transmission: "manual" },
  },

  // Backhoes and excavators, Chennai
  {
    id: "jcb-3dx-plus",
    slug: "jcb-3dx-plus",
    track: "heavy-farm",
    brand: "JCB",
    model: "3DX Plus",
    category: "jcbs",
    city: "Chennai",
    requiredLicence: "commercial",
    perDay: 10900,
    perDayWithOperator: 13400,
    rating: 4.6,
    trips: 48,
    minTrustScore: 75,
    rtoRegistered: true,
    specs: { powerHp: 76, bucketCapacityM3: 1.1, operatingWeightKg: 7700 },
  },
  {
    id: "cat-424",
    slug: "cat-424-backhoe",
    track: "heavy-farm",
    brand: "CAT",
    model: "424 Backhoe",
    category: "jcbs",
    city: "Chennai",
    requiredLicence: "commercial",
    perDay: 11800,
    perDayWithOperator: 14600,
    rating: 4.8,
    trips: 31,
    minTrustScore: 75,
    rtoRegistered: true,
    specs: { powerHp: 74, bucketCapacityM3: 1.0, operatingWeightKg: 7700 },
  },
  {
    id: "tata-hitachi-ex200",
    slug: "tata-hitachi-ex200lc",
    track: "heavy-farm",
    brand: "Tata Hitachi",
    model: "EX 200LC",
    category: "jcbs",
    city: "Chennai",
    requiredLicence: "commercial",
    perDay: 17400,
    perDayWithOperator: 20900,
    rating: 4.7,
    trips: 19,
    minTrustScore: 75,
    rtoRegistered: true,
    specs: { reachM: 9.9, bucketCapacityM3: 0.9, operatingWeightKg: 20200 },
  },

  // Tractors, Madurai
  {
    id: "swaraj-744-fe",
    slug: "swaraj-744-fe",
    track: "heavy-farm",
    brand: "Swaraj",
    model: "744 FE",
    category: "tractors",
    city: "Madurai",
    requiredLicence: "commercial",
    perDay: 2600,
    perDayWithOperator: 3400,
    rating: 4.7,
    trips: 176,
    minTrustScore: 45,
    rtoRegistered: true,
    specs: { powerHp: 48 },
  },
  {
    id: "john-deere-5050d",
    slug: "john-deere-5050d",
    track: "heavy-farm",
    brand: "John Deere",
    model: "5050 D",
    category: "tractors",
    city: "Madurai",
    requiredLicence: "commercial",
    perDay: 3100,
    perDayWithOperator: 3950,
    rating: 4.8,
    trips: 122,
    minTrustScore: 45,
    rtoRegistered: true,
    specs: { powerHp: 50 },
  },
  {
    id: "massey-ferguson-1035",
    slug: "massey-ferguson-1035-di",
    track: "heavy-farm",
    brand: "Massey Ferguson",
    model: "1035 DI",
    category: "tractors",
    city: "Madurai",
    requiredLicence: "commercial",
    perDay: 2150,
    perDayWithOperator: 2900,
    rating: 4.5,
    trips: 209,
    minTrustScore: 45,
    rtoRegistered: true,
    specs: { powerHp: 36 },
  },
];

/** Homepage rails. Headlines follow the Turo pattern from
 *  docs/research/DESIGN_INSPIRATION_SCAN.md: qualifier + rental + in/near +
 *  place. Each doubles as the seed of a future geo landing page. */
export const RAILS: {
  id: string;
  track: Track;
  title: string;
  href: string;
  filter: (v: Vehicle) => boolean;
}[] = [
  {
    id: "two-wheelers-chennai",
    track: "ride-drive",
    title: "Self-drive two-wheelers in Chennai",
    href: "/search?track=ride-drive&city=chennai",
    filter: (v) =>
      v.city === "Chennai" && (v.category === "bikes" || v.category === "scooters"),
  },
  {
    id: "cars-evs-chennai",
    track: "ride-drive",
    title: "Weekend car and EV rental in Chennai",
    href: "/search?track=ride-drive&city=chennai",
    filter: (v) =>
      v.city === "Chennai" && (v.category === "cars" || v.category === "evs"),
  },
  {
    id: "backhoes-chennai",
    track: "heavy-farm",
    title: "Backhoe and excavator rental near Chennai",
    href: "/search?category=jcbs&city=chennai",
    filter: (v) => v.city === "Chennai" && v.category === "jcbs",
  },
  {
    id: "tractors-madurai",
    track: "heavy-farm",
    title: "Tractor rental for the season in Madurai",
    href: "/search?category=tractors&city=madurai",
    filter: (v) => v.city === "Madurai" && v.category === "tractors",
  },
];

/** Cities that actually carry inventory. Crawler links are limited to
 *  these so none of them lands on an empty results page. */
export const INVENTORY_CITIES = Array.from(new Set(VEHICLES.map((v) => v.city)));

export const LICENCE_LABEL: Record<LicenceClass, string> = {
  none: "No licence",
  "two-wheeler": "Two-wheeler",
  lmv: "LMV",
  commercial: "Commercial",
};

export const formatINR = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;
