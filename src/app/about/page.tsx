import type { Metadata } from "next";
import { PageShell, PageHeading, PreviewNote } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "What MOTORA is | MOTORA",
  description: "One account that rents anything with wheels, from a scooter for the morning to a backhoe for the season.",
};

export default function Page() {
  return (
    <PageShell
      index="01"
      kicker="Company"
      heading="What MOTORA is"
      lede="One account that rents anything with wheels, from a scooter for the morning to a backhoe for the season."
    >
      <PageHeading>The problem</PageHeading>
      <p>A commuter and a contractor are treated as different customers by different companies. Both want the same four things: the exact vehicle they booked, every fee stated upfront, evidence of condition at both ends, and a person to reach when something goes wrong mid-rental.</p>
      <PageHeading>The model</PageHeading>
      <p>MOTORA is the operator of record on Ride & Drive, so the vehicle is ours to answer for. On Heavy & Farm you choose self-drive or operator-included at checkout, with both rates priced before you commit.</p>
      <PageHeading>The record</PageHeading>
      <p>One trust score, earned across every category. A scooter rental in Coimbatore is what qualifies you for a backhoe in Chennai two seasons later.</p>
      <PreviewNote>Preview build. Wording on this page is provisional and will be rewritten during the content pass.</PreviewNote>
    </PageShell>
  );
}
