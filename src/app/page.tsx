import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { RevealDriver } from "@/components/reveal-driver";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { ScaleLine } from "@/components/sections/scale-line";
import { Tracks } from "@/components/sections/tracks";
import { TrustLedgerSection } from "@/components/sections/trust-ledger-section";
import { BookingSpine } from "@/components/sections/booking-spine";
import { HostCta } from "@/components/sections/host-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <AmbientBackdrop />
      <RevealDriver />
      <Navbar />
      <main>
        <Hero />
        <ScaleLine />
        <Tracks />
        <TrustLedgerSection />
        <BookingSpine />
        <HostCta />
      </main>
      <Footer />
    </>
  );
}
