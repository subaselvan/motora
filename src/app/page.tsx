import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { StatsBar } from "@/components/sections/stats-bar";
import { Tracks } from "@/components/sections/tracks";
import { TrustLedgerSection } from "@/components/sections/trust-ledger-section";
import { BookingSpine } from "@/components/sections/booking-spine";
import { HostCta } from "@/components/sections/host-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <Tracks />
        <TrustLedgerSection />
        <BookingSpine />
        <HostCta />
      </main>
      <Footer />
    </>
  );
}
