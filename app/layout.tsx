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
  alternates: {
    canonical: "./",
  },
  title: {
    default: "Big Street Media | 360° Outdoor Advertising, Billboard & OOH Agency Noida, Delhi NCR",
    template: "%s | Big Street Media & Advertisers",
  },
  description:
    "India's trusted 360° advertising agency in Noida & Bareilly since 2004. Experts in Outdoor Advertising (OOH), Billboard Hoardings, Transit Media, BTL Activations, and Retail Branding.",
  keywords: [
    "outdoor advertising Noida",
    "outdoor media agency Noida",
    "OOH advertising Noida",
    "billboard advertising Noida",
    "hoarding advertising Noida",
    "outdoor advertising Delhi NCR",
    "OOH advertising Delhi NCR",
    "billboard advertising India",
    "transit advertising Noida",
    "BTL activation agency Noida",
    "transit advertising India",
    "BTL activation agency India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Big Street Media & Advertisers",
    title: "Big Street Media | 360° Outdoor Advertising & OOH Agency",
    description:
      "Creating Visibility. Building Brands. 1000+ campaigns executed in Noida, Delhi NCR, Mumbai, Bengaluru, and PAN India.",
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Big Street Media & Advertisers",
    description:
      "Creating Visibility. Building Brands. 1000+ campaigns executed in Noida, Delhi NCR, Mumbai, Bengaluru, and PAN India.",
    images: [{ url: "/logo.png" }],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/logo-dark.png",
    shortcut: "/logo-dark.png",
    apple: "/logo-dark.png",
  },
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
