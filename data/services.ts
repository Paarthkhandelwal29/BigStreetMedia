import type { IconName } from "@/lib/icons";
import type { PortfolioCategory } from "@/data/portfolio";

export type Service = {
  slug: string;
  title: string;
  outcome: string;
  headline: string;
  icon: IconName;
  formats: string[];
  heroStats: { label: string; value: string }[];
  /** Maps this service to its portfolio category for campaign cards */
  portfolioCategory: PortfolioCategory | null;
};

export const services: Service[] = [
  {
    slug: "ooh-media",
    title: "OOH Media",
    outcome: "Put your brand where 10 lakh+ eyes pass it every day.",
    headline: "Put Your Brand Where 10 Lakh+ Eyes See It Daily",
    icon: "billboard",
    heroStats: [
      { value: "PAN India", label: "Coverage" },
      { value: "5000+", label: "Hoarding Sites" },
      { value: "Best Rates", label: "Assured" },
      { value: "End-to-End", label: "Execution" },
    ],
    portfolioCategory: "OOH",
    formats: [
      "Hoardings & Billboards",
      "Unipoles & Gantries",
      "Wall Painting",
      "Society Gate Branding",
      "Bus Shelters",
      "Metro Media",
      "Airport Media",
      "Railway Media",
    ],
  },
  {
    slug: "transit-media",
    title: "Transit Media",
    outcome: "Reach commuters across the city — your ad travels with them.",
    headline: "Your Brand, Moving Through Every Street in the City",
    icon: "bus",
    heroStats: [
      { value: "PAN India", label: "Coverage" },
      { value: "1000+", label: "Transit Options" },
      { value: "Best Rates", label: "Assured" },
      { value: "End-to-End", label: "Execution" },
    ],
    portfolioCategory: "Transit",
    formats: [
      "Bus Branding & Wraps",
      "Auto & E-Rickshaw Branding",
      "Cab Branding",
      "Metro Station Media",
      "Railway Station Media",
    ],
  },
  {
    slug: "btl-activations",
    title: "BTL Activations",
    outcome: "Turn foot traffic into customers with on-ground activations.",
    headline: "Meet Your Customer Where They Already Are",
    icon: "megaphone",
    heroStats: [
      { value: "400+", label: "Cities Active" },
      { value: "500+", label: "Activations Done" },
      { value: "Trained", label: "Ground Teams" },
      { value: "End-to-End", label: "Execution" },
    ],
    portfolioCategory: "Events",
    formats: [
      "Mall Activations",
      "RWA & Society Activations",
      "Sampling Campaigns",
      "Road Shows",
      "Canopy & Kiosk Activities",
    ],
  },
  {
    slug: "retail-branding",
    title: "Retail Branding",
    outcome: "Own the shelf and the storefront in every market you sell in.",
    headline: "Win the Last Three Feet Before the Sale",
    icon: "store",
    heroStats: [
      { value: "PAN India", label: "Coverage" },
      { value: "10,000+", label: "Outlets Branded" },
      { value: "Best Rates", label: "Assured" },
      { value: "End-to-End", label: "Execution" },
    ],
    portfolioCategory: "Retail Launches",
    formats: [
      "In-Store Branding",
      "Shop Front Boards",
      "Dealer Branding",
      "Glow Sign Boards",
      "POS & Visual Merchandising",
    ],
  },
  {
    slug: "events-launches",
    title: "Events & Launches",
    outcome: "Launch products and stores with events people talk about.",
    headline: "Make Your Launch the Thing the City Remembers",
    icon: "star",
    heroStats: [
      { value: "200+", label: "Events Managed" },
      { value: "PAN India", label: "Coverage" },
      { value: "Full", label: "Production Support" },
      { value: "End-to-End", label: "Execution" },
    ],
    portfolioCategory: "Events",
    formats: [
      "Product Launches",
      "Store Openings",
      "Dealer Meets",
      "Corporate Events",
      "Award Functions",
    ],
  },
  {
    slug: "exhibitions",
    title: "Exhibition Management",
    outcome: "Stand out on the floor with stalls that pull the crowd.",
    headline: "Be the Stall Everyone Stops At",
    icon: "exhibition",
    heroStats: [
      { value: "100+", label: "Stalls Built" },
      { value: "Custom", label: "Stall Design" },
      { value: "On-Ground", label: "Staffing" },
      { value: "End-to-End", label: "Execution" },
    ],
    portfolioCategory: "Exhibitions",
    formats: [
      "Custom Stall Design",
      "Fabrication & Setup",
      "On-Ground Staffing",
      "Lead Capture Systems",
    ],
  },
  {
    slug: "radio",
    title: "Radio Advertising",
    outcome: "Stay in your customer's ear through every commute.",
    headline: "Be Heard in Every Car, Every Morning",
    icon: "radio",
    heroStats: [
      { value: "All Major", label: "FM Stations" },
      { value: "PAN India", label: "Coverage" },
      { value: "Best Rates", label: "Assured" },
      { value: "End-to-End", label: "Production" },
    ],
    portfolioCategory: null,
    formats: ["FM Spots", "RJ Mentions", "Radio Contests", "Sponsorships"],
  },
  {
    slug: "cinema",
    title: "Cinema Advertising",
    outcome: "Capture a captive audience on the big screen.",
    headline: "The One Screen No One Skips",
    icon: "cinema",
    heroStats: [
      { value: "500+", label: "Multiplex Screens" },
      { value: "PAN India", label: "Coverage" },
      { value: "Best Rates", label: "Assured" },
      { value: "End-to-End", label: "Execution" },
    ],
    portfolioCategory: null,
    formats: ["On-Screen Ads", "Lobby Branding", "Multiplex Standees", "Seat Branding"],
  },
  {
    slug: "digital",
    title: "Digital Marketing",
    outcome: "Find your customer online and bring them in-store.",
    headline: "Performance That Connects Online Reach to Real Sales",
    icon: "phone",
    heroStats: [
      { value: "Meta &", label: "Google Certified" },
      { value: "ROI-First", label: "Approach" },
      { value: "Real-Time", label: "Reporting" },
      { value: "End-to-End", label: "Management" },
    ],
    portfolioCategory: null,
    formats: ["Performance Ads", "Social Media", "SEO", "Programmatic", "Landing Pages"],
  },
  {
    slug: "influencer",
    title: "Influencer Marketing",
    outcome: "Borrow the trust creators have already built.",
    headline: "Reach Audiences Through Voices They Already Trust",
    icon: "influencer",
    heroStats: [
      { value: "1000+", label: "Creator Network" },
      { value: "Micro &", label: "Macro Creators" },
      { value: "Regional", label: "Coverage" },
      { value: "End-to-End", label: "Management" },
    ],
    portfolioCategory: null,
    formats: ["Macro Influencers", "Micro & Nano Creators", "Regional Creators", "Campaign Management"],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
