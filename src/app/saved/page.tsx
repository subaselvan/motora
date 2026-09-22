import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { SavedBoard } from "@/components/saved/saved-board";

export const metadata: Metadata = {
  title: "Saved vehicles | MOTORA",
  description:
    "Your shortlist, side by side: price, specs and what each one needs from your licence.",
  // The list lives in this browser, so there is nothing here for a crawler
  // to index and a shared link would show the recipient an empty page.
  robots: { index: false, follow: true },
};

export default function SavedPage() {
  return (
    <>
      <Navbar />
      <main
        className="mx-auto w-full max-w-7xl flex-1 px-4 md:px-6"
        style={{ paddingBlock: "var(--section-y)" }}
      >
        <SavedBoard />
      </main>
      <Footer />
    </>
  );
}
