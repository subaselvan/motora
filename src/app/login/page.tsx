import Link from "next/link";
import type { Metadata } from "next";
import { Phone, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Sign in | MOTORA",
  description:
    "One account across every category. Verify once, reuse it for every later booking.",
};

/**
 * Sign-in surface. Deliberately inert: this is a demo build, so the form
 * renders and validates shape but authenticates nothing. Auth (Google
 * OAuth + phone OTP per the locked stack) lands with the backend work.
 *
 * No password field on purpose. Collecting a credential on a page that
 * cannot honour it is the one thing this screen must not do.
 */
export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col px-4 md:px-6" style={{ paddingBlock: "var(--section-y)" }}>
        <h1
          className="font-heading font-bold leading-[1.06] tracking-[-0.03em] text-pearl"
          style={{ fontSize: "var(--text-h2)" }}
        >
          One account, every category
        </h1>
        <p className="mt-4 leading-relaxed text-pearl-dim">
          Verify once. The same licence check and the same trust record carry
          from a scooter to a backhoe.
        </p>

        <form
          className="mt-10 rounded-[var(--radius-lg)] border border-charcoal-2 bg-obsidian-light p-5 shadow-[var(--elev)]"
          aria-describedby="login-demo-note"
        >
          <label
            htmlFor="phone"
            className="font-body text-xs font-medium uppercase tracking-[0.14em] text-pearl-muted"
          >
            Mobile number
          </label>
          <div className="relative mt-2">
            <Phone
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-pearl-muted"
            />
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit number"
              className="h-12 pl-9 text-base"
            />
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            className="mt-4 h-12 w-full"
            disabled
          >
            Send OTP
          </Button>

          <p
            id="login-demo-note"
            className="mt-4 flex gap-2 text-xs leading-relaxed text-pearl-muted"
          >
            <ShieldCheck
              size={14}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-lime"
            />
            Preview build — no OTP is sent and no account is created. Sign-in
            arrives with the backend work.
          </p>
        </form>

        <p className="mt-8 text-sm text-pearl-dim">
          Listing a vehicle instead?{" "}
          <Link
            href="/host-landing"
            className="rounded-[var(--radius-sm)] text-orange underline transition-colors hover:text-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
          >
            See what it earns
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
