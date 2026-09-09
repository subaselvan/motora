import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
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
          <Link
            href="/search"
            className="text-sm text-pearl-dim transition-colors hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange rounded-sm"
          >
            Find a vehicle
          </Link>
          <Link
            href="/host-landing"
            className="text-sm text-pearl-dim transition-colors hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange rounded-sm"
          >
            Become a host
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/host-landing">List your vehicle</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
