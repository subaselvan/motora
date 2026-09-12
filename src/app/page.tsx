import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Tracks } from "@/components/sections/tracks";
import { BookingSpine } from "@/components/sections/booking-spine";
import { HostCta } from "@/components/sections/host-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Tracks />
        <BookingSpine />
        <HostCta />
      </main>
      <Footer />
    </>
  );
}
