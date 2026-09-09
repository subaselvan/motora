import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Categories } from "@/components/sections/categories";
import { HowItWorks } from "@/components/sections/how-it-works";
import { TrustBar } from "@/components/sections/trust-bar";
import { FeaturedVehicles } from "@/components/sections/featured-vehicles";
import { HostCta } from "@/components/sections/host-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <HowItWorks />
        <TrustBar />
        <FeaturedVehicles />
        <HostCta />
      </main>
      <Footer />
    </>
  );
}
