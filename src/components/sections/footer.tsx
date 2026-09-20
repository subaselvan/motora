import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, VEHICLES } from "@/lib/vehicles";

/** City x category pairs that actually carry inventory, derived from the
 *  data rather than a fixed grid, so no crawler link lands on an empty
 *  results page. */
const LONG_TAIL = Array.from(new Set(VEHICLES.map((v) => v.city)))
  .sort()
  .map((city) => ({
    city,
    categories: CATEGORIES.filter((c) =>
      VEHICLES.some((v) => v.city === city && v.category === c.id)
    ),
  }));

/** Singular nouns for search-style link text ("Bike rental in Chennai",
 *  not "Bikes rental"). Category labels elsewhere stay plural. */
const RENTAL_NOUN: Record<string, string> = {
  bikes: "Bike",
  scooters: "Scooter",
  cars: "Car",
  evs: "EV",
  trucks: "Truck",
  jcbs: "JCB",
  tractors: "Tractor",
};

const footerLinks = {
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Renters: [
    { label: "Ride & Drive", href: "/search?track=ride-drive" },
    { label: "Heavy & Farm", href: "/search?track=heavy-farm" },
    { label: "FAQ", href: "/faq" },
    { label: "Help", href: "/help" },
  ],
  Owners: [
    { label: "Become a host", href: "/host-landing" },
  ],
  Legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto border-t border-charcoal-1">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        {/* The full badge, at a size where its wordmark is legible. */}
        <Image
          src="/logo.png"
          alt="MOTORA"
          width={56}
          height={56}
          className="h-14 w-14"
        />

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-heading text-sm font-medium text-pearl">{heading}</h3>
              <ul className="mt-3 space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="rounded-[var(--radius-sm)] text-sm text-pearl-dim transition-colors hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-charcoal-1 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-pearl-muted">
            © {new Date().getFullYear()} MOTORA. All rights reserved.
          </p>
          <p className="text-xs text-pearl-muted">
            Preview build. No real bookings or payments are processed.
          </p>
        </div>

        {/* Long-tail links for crawlers (Turo footer pattern). Deliberately
            plain and walled off below the brand footer: dense, small, muted,
            no decoration. Each pair is a future geo landing page. */}
        <nav
          aria-label="Rentals by city"
          className="mt-8 border-t border-charcoal-1 pt-6"
        >
          <div className="grid gap-x-8 gap-y-6 text-xs sm:grid-cols-2 lg:grid-cols-5">
            {LONG_TAIL.map(({ city, categories }) => (
              <div key={city}>
                <p className="font-medium text-pearl-dim">{city}</p>
                <ul className="mt-1.5 space-y-1">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/search?category=${c.id}&city=${city.toLowerCase()}`}
                        className="rounded-[var(--radius-sm)] text-pearl-muted transition-colors hover:text-pearl-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                      >
                        {RENTAL_NOUN[c.id]} rental in {city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </footer>
  );
}
