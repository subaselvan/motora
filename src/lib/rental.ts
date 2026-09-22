import type { Category, Vehicle } from "@/lib/vehicles";

/**
 * The rental mechanic: a trip window, whether a vehicle is free in it, and
 * what it costs for exactly that window.
 *
 * Rental search is availability in a time window, not shopping. Royal
 * Brothers and Zoomcar both open on "where and when" and price the result
 * as a trip, which is the decision recorded for MOTORA on 2026-09-22. This
 * file is that mechanic with no UI in it, for the same reason search.ts has
 * none: when bookings live in Postgres, `isAvailable` becomes a query
 * against the bookings table and nothing that calls it changes.
 */

/* ── Time ──────────────────────────────────────────────────────── */

/**
 * Wall-clock time in India, as "YYYY-MM-DDTHH:mm" — the exact shape a
 * date input and a time select produce.
 *
 * Deliberately never passed through `new Date(string)`. The server runs in
 * UTC (Render, Oregon) and the renter is in IST; parsing a local string
 * through either machine's timezone shifts every pickup by five and a half
 * hours. Arithmetic here treats the wall-clock value as if it were UTC,
 * which is exact as long as both ends are in the same zone — and a rental
 * in India always is.
 */
export type WallTime = string;

export type TripWindow = { from: WallTime; to: WallTime };

const WALL_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

/** Minutes since the epoch, reading the wall time as UTC. */
export function wallMinutes(value: WallTime): number | null {
  const m = WALL_RE.exec(value);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m.map(Number);
  const ms = Date.UTC(y, mo - 1, d, h, mi);
  // Date.UTC silently rolls 2026-02-31 into March. Reject rather than
  // book someone a day they never picked.
  const check = new Date(ms);
  if (check.getUTCDate() !== d || check.getUTCMonth() !== mo - 1) return null;
  return ms / 60000;
}

function fromMinutes(minutes: number): WallTime {
  return new Date(minutes * 60000).toISOString().slice(0, 16);
}

const IST_OFFSET_MINUTES = 330;

/** Now, in India, as a wall time. */
export function nowIST(): WallTime {
  return fromMinutes(Math.floor(Date.now() / 60000) + IST_OFFSET_MINUTES);
}

export function addMinutes(value: WallTime, minutes: number): WallTime {
  const base = wallMinutes(value);
  return base === null ? value : fromMinutes(base + minutes);
}

/* ── Hub hours ─────────────────────────────────────────────────── */

/**
 * Pick-up and drop-off happen at staffed handovers, so both ends of a trip
 * land on a half-hour slot inside hub hours. Royal Brothers runs 08:30 to
 * 22:00 on the same half-hour grid. Heavy equipment is delivered to site,
 * so the window is the delivery slot; the same grid serves it.
 */
export const HUB_OPEN = "08:00";
export const HUB_CLOSE = "21:30";
const SLOT_MINUTES = 30;

export const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  const [oh, om] = HUB_OPEN.split(":").map(Number);
  const [ch, cm] = HUB_CLOSE.split(":").map(Number);
  for (let t = oh * 60 + om; t <= ch * 60 + cm; t += SLOT_MINUTES) {
    slots.push(
      `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`,
    );
  }
  return slots;
})();

const SLOT_SET = new Set(TIME_SLOTS);

/** "10:00" -> "10:00 AM". The select shows this; the URL keeps 24h. */
export function formatSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** The first bookable slot: the next half hour after now plus a lead time
 *  long enough to prepare a vehicle, rolled to the next morning after the
 *  hub closes. */
export const LEAD_MINUTES = 60;

export function earliestPickup(now: WallTime = nowIST()): WallTime {
  const base = wallMinutes(now) ?? 0;
  let t = Math.ceil((base + LEAD_MINUTES) / SLOT_MINUTES) * SLOT_MINUTES;
  for (let guard = 0; guard < 96; guard++) {
    const slot = fromMinutes(t).slice(11, 16);
    if (SLOT_SET.has(slot)) return fromMinutes(t);
    t += SLOT_MINUTES;
  }
  return fromMinutes(t);
}

/* ── Window validation ─────────────────────────────────────────── */

export const MAX_TRIP_DAYS = 90;

export type WindowProblem =
  | "past"
  | "order"
  | "too-long"
  | "outside-hours";

export const WINDOW_PROBLEM_TEXT: Record<WindowProblem, string> = {
  past: "Pick-up has to be at least an hour from now.",
  order: "Drop-off has to be after pick-up.",
  "too-long": `Trips run up to ${MAX_TRIP_DAYS} days. For longer, talk to us about a lease.`,
  "outside-hours": `Hand-overs happen between ${formatSlot(HUB_OPEN)} and ${formatSlot(HUB_CLOSE)}.`,
};

export type ParsedWindow =
  | { state: "none" }
  | { state: "invalid"; problem: WindowProblem; from: WallTime; to: WallTime }
  | { state: "valid"; window: TripWindow; hours: number };

/**
 * A half-entered or unparseable window is "none", not an error: browsing
 * without dates is a supported path, and a hand-edited URL should degrade
 * to it quietly. Only a complete window that breaks a rule is "invalid" —
 * that is the case where the renter meant something and needs telling why
 * it cannot happen.
 */
export function parseWindow(
  from: string,
  to: string,
  now: WallTime = nowIST(),
): ParsedWindow {
  const a = wallMinutes(from);
  const b = wallMinutes(to);
  if (a === null || b === null) return { state: "none" };

  const invalid = (problem: WindowProblem): ParsedWindow => ({
    state: "invalid",
    problem,
    from,
    to,
  });

  if (!SLOT_SET.has(from.slice(11)) || !SLOT_SET.has(to.slice(11)))
    return invalid("outside-hours");
  if (a < (wallMinutes(earliestPickup(now)) ?? 0)) return invalid("past");
  if (b <= a) return invalid("order");
  if (b - a > MAX_TRIP_DAYS * 24 * 60) return invalid("too-long");

  return { state: "valid", window: { from, to }, hours: (b - a) / 60 };
}

/* ── Availability ──────────────────────────────────────────────── */

/** FNV-1a. Deterministic, so the same vehicle is busy on the same days for
 *  every visitor and on every request — a demo calendar that reshuffles on
 *  reload would read as broken. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function dayNumber(date: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (!m) return 0;
  return Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000;
}

/**
 * DEMO calendar. Each vehicle is booked for a share of the time that rises
 * with how popular it is (12% for a new listing, up to 32% for the
 * busiest). Replaced wholesale by a query against real bookings; the
 * signature stays.
 *
 * Bookings come in blocks of 3-5 days, not as independent days. The first
 * version booked each day on its own coin flip, which scatters single
 * booked days everywhere and makes long trips nearly impossible: a 9-day
 * search found one vehicle out of 22, because (1 - p)^10 collapses. Real
 * calendars fill in runs, which leaves runs free. Block length and phase
 * vary per vehicle so the whole fleet does not turn over on the same day.
 */
export function isBookedOn(vehicle: Vehicle, day: number): boolean {
  const busyShare = 0.12 + (Math.min(vehicle.trips, 400) / 400) * 0.2;
  const blockDays = 3 + (hash(vehicle.slug) % 3);
  const phase = hash(`${vehicle.slug}:phase`) % blockDays;
  const block = Math.floor((day + phase) / blockDays);
  return hash(`${vehicle.slug}:block:${block}`) % 1000 < busyShare * 1000;
}

/** Free for every calendar day the window touches. Day granularity is
 *  coarser than a real calendar, which would block by the hour; it errs
 *  towards "unavailable", the safe direction for a promise. */
export function isAvailable(vehicle: Vehicle, window: TripWindow): boolean {
  const first = dayNumber(window.from);
  const last = dayNumber(window.to);
  for (let day = first; day <= last; day++) {
    if (isBookedOn(vehicle, day)) return false;
  }
  return true;
}

/* ── Pricing ───────────────────────────────────────────────────── */

/**
 * PROVISIONAL. Every number in here is a stand-in until the pricing policy
 * is decided (see CLAUDE.md, open items). They live in one object so that
 * decision is a one-file change, and the UI labels every total built from
 * them as indicative.
 *
 * The four durations are the ones decided on 2026-09-22: hourly for Ride &
 * Drive, daily for everything, a weekly rate from seven days, and 8-hour
 * shifts for Heavy & Farm — which is how contractors actually hire a JCB.
 */
export const PRICING = {
  provisional: true,
  hourlyCategories: new Set<Category>(["bikes", "scooters", "cars", "evs"]),
  /** Hourly rate as a fraction of the day rate. 1/8 means a full day is
   *  cheaper than eight hours, so long hourly trips never beat the day. */
  hourlyShareOfDay: 1 / 8,
  hourlyMinimum: 4,
  weeklyFromDays: 7,
  weeklyDiscount: 0.2,
  shiftHours: 8,
  shiftShareOfDay: 0.65,
} as const;

export type BillingUnit = "hour" | "shift" | "day" | "week";

export type Quote = {
  unit: BillingUnit;
  /** Billed units: hours, shifts, or days (weekly bills per day). */
  units: number;
  /** Rate per billed unit, after any weekly discount. */
  rate: number;
  total: number;
  /** "for 6 hrs", "for 3 days · weekly rate" — reads after the total. */
  label: string;
  /** The minimum or rounding the renter is paying for, stated rather than
   *  hidden — "Fees shown upfront" applies to billing rules too. */
  note?: string;
};

const round = (n: number, step: number) => Math.round(n / step) * step;

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

export function hourlyRate(vehicle: Vehicle): number {
  return round(vehicle.perDay * PRICING.hourlyShareOfDay, 5);
}

export function shiftRate(vehicle: Vehicle): number {
  return round(vehicle.perDay * PRICING.shiftShareOfDay, 10);
}

/**
 * The cheapest billing that covers the window. Picking the cheaper of
 * hourly and daily for the renter, rather than whichever earns more, is
 * the whole "no surprises at checkout" position applied to arithmetic.
 */
export function quoteTrip(vehicle: Vehicle, hours: number): Quote {
  const days = Math.max(1, Math.ceil(hours / 24 - 1e-9));

  let best: Quote;
  if (days >= PRICING.weeklyFromDays) {
    const rate = round(vehicle.perDay * (1 - PRICING.weeklyDiscount), 5);
    best = {
      unit: "week",
      units: days,
      rate,
      total: rate * days,
      label: `for ${plural(days, "day")} · weekly rate`,
    };
  } else {
    best = {
      unit: "day",
      units: days,
      rate: vehicle.perDay,
      total: vehicle.perDay * days,
      label: `for ${plural(days, "day")}`,
      note:
        hours % 24 !== 0 && days > 1
          ? `Billed as ${plural(days, "full day")} for ${formatDuration(hours)}.`
          : undefined,
    };
  }

  if (hours < 24 && PRICING.hourlyCategories.has(vehicle.category)) {
    const billed = Math.max(PRICING.hourlyMinimum, Math.ceil(hours));
    const rate = hourlyRate(vehicle);
    const total = rate * billed;
    if (total < best.total) {
      best = {
        unit: "hour",
        units: billed,
        rate,
        total,
        label: `for ${plural(billed, "hr")}`,
        note:
          billed > hours
            ? `Hourly trips bill a ${PRICING.hourlyMinimum}-hour minimum.`
            : undefined,
      };
    }
  }

  if (vehicle.track === "heavy-farm" && hours <= PRICING.shiftHours) {
    const rate = shiftRate(vehicle);
    if (rate < best.total) {
      best = {
        unit: "shift",
        units: 1,
        rate,
        total: rate,
        label: `for 1 shift (${PRICING.shiftHours} hrs)`,
      };
    }
  }

  return best;
}

/** 52 -> "2 days 4 hrs". */
export function formatDuration(hours: number): string {
  const whole = Math.round(hours * 2) / 2;
  const d = Math.floor(whole / 24);
  const h = whole - d * 24;
  const parts = [];
  if (d) parts.push(plural(d, "day"));
  if (h) parts.push(plural(h, "hr"));
  return parts.join(" ") || "0 hrs";
}

/** "2026-09-24T10:00" -> "Thu 24 Sep, 10:00 AM". Built by hand for the same
 *  reason as everything else here: Intl with a timeZone would reinterpret
 *  the wall time. */
export function formatWall(value: WallTime): string {
  const minutes = wallMinutes(value);
  if (minutes === null) return value;
  const d = new Date(minutes * 60000);
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
  const month = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ][d.getUTCMonth()];
  return `${day} ${d.getUTCDate()} ${month}, ${formatSlot(value.slice(11))}`;
}
