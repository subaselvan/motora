import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { RevealDriver } from "@/components/reveal-driver";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { ScaleLine } from "@/components/sections/scale-line";
import { Tracks } from "@/components/sections/tracks";
import { Marquee } from "@/components/sections/marquee";
import { Comparison } from "@/components/sections/comparison";
import { TrustLedgerSection } from "@/components/sections/trust-ledger-section";
import { BookingSpine } from "@/components/sections/booking-spine";
import { ProductPreview } from "@/components/sections/product-preview";
import { HostCta } from "@/components/sections/host-cta";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <AmbientBackdrop />
      <RevealDriver />
      <Navbar />
      <main>
        <Hero />
        <ScaleLine />
        <Tracks />
        {/* Full-bleed break after the two long card rails: the page needs
            one moment that is not a centred column, and it lands best
            where the reader has just finished scrolling a lot of density. */}
        <Marquee />
        <Comparison />
        <TrustLedgerSection />
        <BookingSpine />
        {/* The product showing itself, straight after the spine explains
            what it does — claim then evidence. */}
        <ProductPreview />
        <HostCta />
        {/* Objections last: by here the reader has the argument and the
            proof, and what is left is the specific thing still stopping
            them. */}
        <Faq />
      </main>
      <Footer />
    </>
  );
}
