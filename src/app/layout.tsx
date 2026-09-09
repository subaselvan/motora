import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk.ttf",
  variable: "--font-heading",
  weight: "500 700",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter.ttf",
  variable: "--font-body",
  weight: "400 500",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MOTORA — Rent Any Vehicle, Anywhere",
  description:
    "Rent bikes, scooters, cars, EVs, trucks and heavy machinery by the hour or day. Real-time GPS tracking, verified owners, flexible delivery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-pearl font-body">
        {children}
      </body>
    </html>
  );
}
