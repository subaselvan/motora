import type { Metadata } from "next";
import { PageShell, PageHeading, PreviewNote } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Reach a person | MOTORA",
  description: "During an active rental, escalation to a human is guaranteed — not a chatbot loop.",
};

export default function Page() {
  return (
    <PageShell
      index="02"
      kicker="Company"
      heading="Reach a person"
      lede="During an active rental, escalation to a human is guaranteed — not a chatbot loop."
    >
      <PageHeading>While a rental is running</PageHeading>
      <p>Live human escalation is part of the booking spine, not a support tier you upgrade into. A flagged mechanical fault waives its own fees automatically.</p>
      <PageHeading>Everything else</PageHeading>
      <p>General enquiries, host onboarding and partnership questions each route to a named owner rather than a shared inbox.</p>
      <PreviewNote>Preview build. Wording on this page is provisional and will be rewritten during the content pass.</PreviewNote>
    </PageShell>
  );
}
