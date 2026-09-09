import Link from "next/link";
import { Bike, Car, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Placeholder inventory — real vehicle data/photos are an open item (see CLAUDE.md).
// Structure is final; values below are illustrative, not live listings.
const featuredVehicles = [
  {
    id: "rb-classic-350",
    name: "Royal Enfield Classic 350",
    category: "Bikes",
    pricePerDay: 899,
    location: "Chennai",
    icon: Bike,
  },
  {
    id: "tata-nexon-ev",
    name: "Tata Nexon EV",
    category: "EVs",
    pricePerDay: 2499,
    location: "Chennai",
    icon: Zap,
  },
  {
    id: "maruti-swift",
    name: "Maruti Suzuki Swift",
    category: "Cars",
    pricePerDay: 1799,
    location: "Chennai",
    icon: Car,
  },
  {
    id: "activa-6g",
    name: "Honda Activa 6G",
    category: "Scooters",
    pricePerDay: 399,
    location: "Chennai",
    icon: Bike,
  },
];

export function FeaturedVehicles() {
  return (
    <section aria-labelledby="featured-heading" className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex items-end justify-between">
        <h2 id="featured-heading" className="font-heading text-2xl font-bold text-pearl">
          Featured vehicles
        </h2>
        <Link
          href="/search"
          className="text-sm font-medium text-orange hover:text-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange rounded-sm"
        >
          View all
        </Link>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featuredVehicles.map(({ id, name, category, pricePerDay, location, icon: Icon }) => (
          <Card key={id}>
            <div
              className="flex h-36 items-center justify-center rounded-t-[var(--radius-md)] bg-gradient-to-br from-obsidian-lighter to-obsidian"
              aria-hidden="true"
            >
              <Icon className="h-12 w-12 text-pearl-muted" />
            </div>
            <CardHeader>
              <span className="text-xs font-medium uppercase tracking-wide text-lime">
                {category}
              </span>
              <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-pearl-dim">{location}</p>
              <p className="mt-2 font-heading text-lg font-semibold text-pearl">
                ₹{pricePerDay.toLocaleString("en-IN")}
                <span className="text-sm font-normal text-pearl-muted"> /day</span>
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="primary" size="sm" className="w-full" asChild>
                <Link href={`/vehicle/${id}`}>Book now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
