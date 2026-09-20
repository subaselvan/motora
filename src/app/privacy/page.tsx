import type { Metadata } from "next";
import { PageShell, PageHeading, PreviewNote } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Privacy | MOTORA",
  description: "What we collect, why, and how long it stays.",
};

export default function Page() {
  return (
    <PageShell
      index="06"
      kicker="Legal"
      heading="Privacy"
      lede="What we collect, why, and how long it stays."
    >
      <PageHeading>What is collected</PageHeading>
      <p>Account details, licence and KYC verification data, booking history, and the timestamped condition photos attached to each rental.</p>
      <PageHeading>Why</PageHeading>
      <p>Licence data exists to gate categories safely. Condition photos exist to settle disputes with evidence rather than assertion. Booking history is what the trust record is computed from.</p>
      <PreviewNote>Preview build. This is a structural placeholder, not reviewed legal text, and must be replaced by real drafting before any live use.</PreviewNote>
    </PageShell>
  );
}
