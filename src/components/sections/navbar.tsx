"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const primaryLinks = [
  { href: "/search?track=ride-drive", label: "Ride & Drive" },
  { href: "/search?track=heavy-farm", label: "Heavy & Farm" },
  { href: "/host-landing", label: "Become a host" },
];

/**
 * Deliberate seal, not a placeholder: the real badge (/public/logo.png) has
 * fine linework and a wordmark that dissolve below ~48px — confirmed by
 * rendering it at 16/32/64px on the site background. Decided 2026-09-13 to
 * keep this simplified mark for small slots (nav, favicon) and use the full
 * badge only where it can be large (footer). See DESIGN.md. Built from UI
 * tokens only, since logo red/yellow never enter the UI palette.
 */
function MotoraSeal() {
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-charcoal-2 bg-obsidian-lighter"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 12.5V3.5L8 9l6-5.5v9"
          stroke="var(--color-lime)"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>
    </span>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal-1 bg-obsidian/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
          aria-label="MOTORA home"
        >
          <MotoraSeal />
          <span className="font-heading text-xl font-bold tracking-[0.02em] text-pearl">
            MOTORA
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[var(--radius-sm)] text-sm text-pearl-dim transition-colors duration-[var(--duration-fast)] hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/host-landing">List your vehicle</Link>
            </Button>
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-pearl transition-colors hover:bg-obsidian-lighter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-charcoal-1 bg-obsidian px-4 py-2 md:hidden"
        >
          <ul className="flex flex-col">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-[var(--radius-sm)] px-2 py-2.5 text-sm text-pearl-dim transition-colors hover:bg-obsidian-lighter hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2 border-t border-charcoal-1 pt-3">
            <Button variant="ghost" size="sm" className="flex-1" asChild>
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
            </Button>
            <Button variant="primary" size="sm" className="flex-1" asChild>
              <Link href="/host-landing" onClick={() => setMenuOpen(false)}>
                List your vehicle
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
