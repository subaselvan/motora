"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useIsSaved } from "@/components/saved/use-saved";
import { toggleSaved } from "@/lib/store/saved-store";

/**
 * Shortlist toggle.
 *
 * A bookmark rather than a heart: a heart reads as "I like this", which is
 * a rating, and this list is a comparison set. Renters put three backhoes
 * side by side without loving any of them.
 *
 * The button is a real <button aria-pressed>, not a checkbox styled as an
 * icon, because it acts immediately rather than staging a change for a
 * submit. The label is the vehicle's name so a screen reader hears "Save
 * the Royal Enfield Classic 350" rather than twenty identical "Save"s.
 */
export function SaveButton({
  slug,
  name,
  size = "sm",
}: {
  slug: string;
  name: string;
  size?: "sm" | "lg";
}) {
  const saved = useIsSaved(slug);
  // Pulses once per activation. Keyed off a counter rather than a boolean
  // so saving, unsaving and saving again each retrigger the animation —
  // a boolean would sit at `true` and the second press would look dead.
  const [pulse, setPulse] = useState(0);

  const box = size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const icon = size === "lg" ? 17 : 15;

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
      onClick={() => {
        toggleSaved(slug);
        setPulse((n) => n + 1);
      }}
      className={[
        box,
        "inline-flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] border",
        "transition-[color,border-color,background-color] duration-[var(--duration-short)] ease-[var(--ease-base)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime",
        saved
          ? "border-lime/50 bg-lime/10 text-lime"
          : "border-charcoal-2 text-pearl-muted hover:border-charcoal-3 hover:text-pearl",
      ].join(" ")}
    >
      <Bookmark
        key={pulse}
        size={icon}
        aria-hidden="true"
        // Filled when saved: the state has to survive being seen at a
        // glance across a grid of twenty cards, and outline-vs-outline in
        // two greys does not.
        className={saved ? "save-pulse fill-current" : ""}
      />
    </button>
  );
}
