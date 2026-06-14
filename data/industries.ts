import type { IconName } from "@/lib/icons";

export type Industry = {
  slug: string;
  name: string;
  icon: IconName;
  /** client-first one-liner */
  outcome: string;
  /** industry page headline */
  headline: string;
};

export const industries: Industry[] = [
  {
    slug: "fmcg",
    name: "FMCG & Consumer",
    icon: "fmcg",
    outcome: "Mass reach across urban and rural markets.",
    headline: "Reach Every Shelf, Every Street, Every State",
  },
  {
    slug: "automobile",
    name: "Automobile",
    icon: "automobile",
    outcome: "Dealer branding, city launches, OOH dominance.",
    headline: "Dominate Your Market at Launch",
  },
  {
    slug: "real-estate",
    name: "Real Estate & Infra",
    icon: "realestate",
    outcome: "Site hoardings and city-wide awareness campaigns.",
    headline: "Sell Out Before You Break Ground",
  },
  {
    slug: "bfsi",
    name: "BFSI",
    icon: "bfsi",
    outcome: "Branch visibility and financial product awareness.",
    headline: "Build Trust Where Customers Make Money Decisions",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    icon: "healthcare",
    outcome: "Hospital launches, pharma outreach, awareness drives.",
    headline: "Reach Patients Before They Search for You",
  },
  {
    slug: "telecom-tech",
    name: "Telecom & Tech",
    icon: "telecom",
    outcome: "Rapid retail activation and city-wide product launches.",
    headline: "Move at the Speed Your Product Launches",
  },
  {
    slug: "education",
    name: "Education",
    icon: "education",
    outcome: "Admission drives and institution brand building.",
    headline: "Fill Every Seat, Every Admission Season",
  },
  {
    slug: "retail-hospitality",
    name: "Retail & Hospitality",
    icon: "retail",
    outcome: "Store launches, footfall generation, in-store visuals.",
    headline: "Turn Locations Into Landmarks",
  },
  {
    slug: "government",
    name: "Government",
    icon: "government",
    outcome: "Public scheme announcements and awareness campaigns.",
    headline: "Reach Every Citizen the Scheme Is Built For",
  },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
