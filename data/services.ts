import type { IconName } from "@/lib/icons";

export type Service = {
  slug: string;
  title: string;
  /** client-first one-liner outcome */
  outcome: string;
  /** longer benefit headline for the service page hero */
  headline: string;
  icon: IconName;
  formats: string[];
};

export const services: Service[] = [
  {
    slug: "ooh-media",
    title: "OOH Media",
    outcome: "Put your brand where 10 lakh+ eyes pass it every day.",
    headline: "Put Your Brand Where 10 Lakh+ Eyes See It Daily",
    icon: "billboard",
    formats: [
      "Hoardings & Billboards",
      "Unipoles & Gantries",
      "Wall Painting",
      "Society Gate Branding",
      "Bus Shelters",
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
    formats: ["FM Spots", "RJ Mentions", "Radio Contests", "Sponsorships"],
  },
  {
    slug: "tv",
    title: "TV Advertising",
    outcome: "Land your message in the living room at prime time.",
    headline: "Reach Households at the Moment They're Watching",
    icon: "tv",
    formats: ["TVC Production", "Regional Channel Buys", "Prime Slots", "L-Bands & Tickers"],
  },
  {
    slug: "cinema",
    title: "Cinema Advertising",
    outcome: "Capture a captive audience on the big screen.",
    headline: "The One Screen No One Skips",
    icon: "cinema",
    formats: ["On-Screen Ads", "Lobby Branding", "Multiplex Standees", "Seat Branding"],
  },
  {
    slug: "digital",
    title: "Digital Marketing",
    outcome: "Find your customer online and bring them in-store.",
    headline: "Performance That Connects Online Reach to Real Sales",
    icon: "phone",
    formats: ["Performance Ads", "Social Media", "SEO", "Programmatic", "Landing Pages"],
  },
  {
    slug: "influencer",
    title: "Influencer Marketing",
    outcome: "Borrow the trust creators have already built.",
    headline: "Reach Audiences Through Voices They Already Trust",
    icon: "influencer",
    formats: ["Macro Influencers", "Micro & Nano Creators", "Regional Creators", "Campaign Management"],
  },
  {
    slug: "rural",
    title: "Rural Marketing",
    outcome: "Take your brand to the 65% of India that lives beyond the metros.",
    headline: "Reach the India That Most Agencies Can't",
    icon: "tractor",
    formats: ["Haat & Mandi Activation", "Wall Painting", "Van Campaigns", "Mela Branding"],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
