import type { Metadata } from "next";
import { PageShell, PageHeading, PreviewNote } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Terms of service | MOTORA",
  description: "The agreement between you and MOTORA.",
};

export default function Page() {
  return (
    <PageShell
      index="05"
      kicker="Legal"
      heading="Terms of service"
      lede="The agreement between you and MOTORA."
    >
      <PageHeading>Scope</PageHeading>
      <p>These terms cover use of the MOTORA platform, the booking of vehicles listed on it, and the obligations of renters and hosts.</p>
      <PageHeading>Your obligations</PageHeading>
      <p>Hold the licence class the category requires, complete the photo record at both ends, return on time, and report faults rather than working around them.</p>
      <PreviewNote>Preview build. This is a structural placeholder, not reviewed legal text, and must be replaced by real drafting before any live use.</PreviewNote>
    </PageShell>
  );
}
