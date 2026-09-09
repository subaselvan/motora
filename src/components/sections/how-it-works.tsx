import { Search, CalendarCheck, KeyRound } from "lucide-react";

const steps = [
  {
    title: "Search",
    description:
      "Find vehicles by model, brand, CC or location, with real-time availability.",
    icon: Search,
  },
  {
    title: "Book",
    description:
      "Choose self-pickup or delivery, pay the advance, and confirm instantly.",
    icon: CalendarCheck,
  },
  {
    title: "Ride",
    description:
      "Track your vehicle live, extend anytime, and return where it suits you.",
    icon: KeyRound,
  },
];

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="border-t border-obsidian-lighter bg-obsidian-light"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <h2 id="how-it-works-heading" className="font-heading text-2xl font-bold text-pearl">
          How it works
        </h2>

        <ol className="mt-8 grid gap-8 sm:grid-cols-3">
          {steps.map(({ title, description, icon: Icon }, i) => (
            <li key={title} className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-orange/10 text-orange"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-heading text-sm font-semibold text-pearl-muted">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="font-heading text-lg font-medium text-pearl">{title}</h3>
              <p className="text-sm leading-6 text-pearl-dim">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
