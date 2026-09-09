import { Satellite, ShieldCheck, Headset, BadgeCheck } from "lucide-react";

const signals = [
  { label: "Live GPS on every vehicle", icon: Satellite },
  { label: "Insurance included", icon: ShieldCheck },
  { label: "24/7 support", icon: Headset },
  { label: "Verified owners only", icon: BadgeCheck },
];

export function TrustBar() {
  return (
    <section aria-label="Why renters trust MOTORA" className="border-t border-obsidian-lighter">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 md:px-6">
        {signals.map(({ label, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0 text-lime" aria-hidden="true" />
            <span className="text-sm text-pearl-dim">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
