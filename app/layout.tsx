import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = "https://bigstreetmedia.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Big Street Media & Advertisers | 360° Advertising Agency India",
    template: "%s | Big Street Media & Advertisers",
  },
  description:
    "India's trusted 360° advertising agency since 2004. OOH, Transit, BTL, Events, Retail Branding, Digital — PAN India coverage across 400+ cities.",
  keywords: [
    "advertising agency India",
    "OOH advertising India",
    "360 degree advertising agency",
    "transit advertising India",
    "BTL activation agency India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Big Street Media & Advertisers",
    title: "Big Street Media & Advertisers",
    description:
      "Creating Visibility. Building Brands. 1000+ campaigns executed across India.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Big Street Media & Advertisers",
    description:
      "Creating Visibility. Building Brands. 1000+ campaigns executed across India.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <MobileStickyCTA />
      </body>
    </html>
  );
}
