"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const primaryLinks = [
  { href: "/search", label: "Find a vehicle" },
  { href: "/host-landing", label: "Become a host" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-obsidian-lighter bg-obsidian/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
          aria-label="MOTORA home"
        >
          {/* Temporary mark — locked badge logo's small-format seal is still unresolved (see CLAUDE.md).
              Placeholder keeps red/yellow off the UI per the logo-colors-are-off-limits rule. */}
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-orange font-heading text-sm font-bold text-obsidian"
            aria-hidden="true"
          >
            M
          </span>
          <span className="font-heading text-xl font-bold tracking-wide text-pearl hidden sm:inline">
            MOTORA
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-pearl-dim transition-colors hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange rounded-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/host-landing">List your vehicle</Link>
          </Button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-sm text-pearl hover:bg-obsidian-lighter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange md:hidden"
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
          className="border-t border-obsidian-lighter bg-obsidian px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-sm px-2 py-2 text-sm text-pearl-dim transition-colors hover:bg-obsidian-lighter hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
