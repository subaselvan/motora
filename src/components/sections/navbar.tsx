"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const primaryLinks = [
  { href: "/search?track=ride-drive", label: "Ride & Drive" },
  { href: "/search?track=heavy-farm", label: "Heavy & Farm" },
  { href: "/host-landing", label: "Become a host" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // The bar condenses and takes a solid ground once the page moves. At rest
  // over the hero it stays tall and near-transparent so the light behind it
  // is unbroken; in motion it becomes a surface, because translucent chrome
  // over scrolling content is where dark sites start to look cheap.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled || undefined}
      className="sticky top-0 z-50 border-b border-charcoal-1/60 bg-obsidian/70 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-[var(--duration-moderate)] ease-[var(--ease-base)] data-[scrolled]:border-charcoal-1 data-[scrolled]:bg-obsidian/95 data-[scrolled]:shadow-[0_1px_0_0_rgba(198,255,61,0.07),0_10px_30px_-18px_rgba(0,0,0,0.9)]"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 transition-[height] duration-[var(--duration-moderate)] ease-[var(--ease-base)] md:px-6 [[data-scrolled]_&]:h-14">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
          aria-label="MOTORA home"
        >
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0"
            priority
          />
          <span className="font-heading text-xl font-bold tracking-[0.02em] text-pearl">
            MOTORA
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link rounded-[var(--radius-sm)] text-sm text-pearl-dim transition-colors duration-[var(--duration-short)] hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
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
