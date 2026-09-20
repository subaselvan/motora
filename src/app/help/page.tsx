import type { Metadata } from "next";
import { PageShell, PageHeading, PreviewNote } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Help | MOTORA",
  description: "Practical answers for a rental that is already under way.",
};

export default function Page() {
  return (
    <PageShell
      index="04"
      kicker="Renters"
      heading="Help"
      lede="Practical answers for a rental that is already under way."
    >
      <PageHeading>Extending a rental</PageHeading>
      <p>Extensions are handled in-app while the rental is live, priced at the same daily rate you booked.</p>
      <PageHeading>Reporting a fault</PageHeading>
      <p>Flag it from the active rental. A confirmed mechanical fault waives fees tied to it, automatically, without argument.</p>
      <PageHeading>The condition record</PageHeading>
      <p>Your pickup and return photo sets stay attached to the booking and are the reference for any condition question.</p>
      <PreviewNote>Preview build. Wording on this page is provisional and will be rewritten during the content pass.</PreviewNote>
    </PageShell>
  );
}
