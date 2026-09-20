import type { Metadata } from "next";
import { PageShell, PageHeading, PreviewNote } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Questions worth asking | MOTORA",
  description: "The ones that decide whether a rental goes wrong, answered before you book.",
};

export default function Page() {
  return (
    <PageShell
      index="03"
      kicker="Renters"
      heading="Questions worth asking"
      lede="The ones that decide whether a rental goes wrong, answered before you book."
    >
      <PageHeading>Do I get the exact vehicle on the card?</PageHeading>
      <p>Yes. You book a specific vehicle, not a class someone reassigns at the counter. On Heavy & Farm no machine is substituted on the day without your say-so.</p>
      <PageHeading>What licence do I need?</PageHeading>
      <p>Tiered by category: none for a low-speed EV, a two-wheeler licence for bikes and scooters, LMV for cars, and a commercial licence to self-drive anything heavy. Verified once, reused for every later booking.</p>
      <PageHeading>How do deposits and fees work?</PageHeading>
      <p>Every conditional fee is itemised on the booking summary before you commit. Nothing new appears at checkout.</p>
      <PageHeading>What stops a damage dispute?</PageHeading>
      <p>A timestamped photo record at pickup and return, mandatory at both ends. It is the evidence that settles the question.</p>
      <PreviewNote>Preview build. Wording on this page is provisional and will be rewritten during the content pass.</PreviewNote>
    </PageShell>
  );
}
