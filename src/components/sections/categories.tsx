import Link from "next/link";
import {
  Bike,
  Zap,
  Car,
  Truck,
  Tractor,
  Construction,
  Gauge,
} from "lucide-react";

const categories = [
  { name: "Bikes", href: "/search?category=bikes", icon: Bike },
  { name: "Scooters", href: "/search?category=scooters", icon: Gauge },
  { name: "Cars", href: "/search?category=cars", icon: Car },
  { name: "EVs", href: "/search?category=evs", icon: Zap },
  { name: "Trucks", href: "/search?category=trucks", icon: Truck },
  { name: "JCBs", href: "/search?category=jcbs", icon: Construction },
  { name: "Tractors", href: "/search?category=tractors", icon: Tractor },
];

export function Categories() {
  return (
    <section aria-labelledby="categories-heading" className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <h2 id="categories-heading" className="font-heading text-2xl font-bold text-pearl">
        What are you renting today?
      </h2>

      <ul className="mt-6 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-7 md:gap-4 md:overflow-visible">
        {categories.map(({ name, href, icon: Icon }) => (
          <li key={name} className="shrink-0">
            <Link
              href={href}
              className="group flex w-24 flex-col items-center gap-2 rounded-lg border border-obsidian-lighter bg-obsidian-light p-4 text-center transition-all hover:-translate-y-0.5 hover:border-orange hover:shadow-[var(--shadow-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian md:w-auto"
            >
              <Icon
                className="h-6 w-6 text-pearl-dim transition-colors group-hover:text-lime"
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-pearl">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
