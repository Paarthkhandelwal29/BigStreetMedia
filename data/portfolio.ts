export type PortfolioCategory =
  | "OOH"
  | "Transit"
  | "Events"
  | "Exhibitions"
  | "Retail Launches"
  | "Special Activations";

export const portfolioFormatsByCategory = {
  OOH: [
    "Billboard",
    "Hoarding",
    "Unipole",
    "Gantry",
    "Pole Kiosk",
    "Digital Screen",
    "Mall Media",
    "Wall Wrap",
    "Building Wrap",
    "Street Furniture",
    "Bus Shelter",
    "Traffic Booth Branding",
    "Petrol Pump Branding",
  ],
  Transit: [
    "Metro Branding",
    "Metro Station Branding",
    "Metro Train Wrap",
    "Airport Branding",
    "Airport Media",
    "Railway Branding",
    "Railway Station Branding",
    "Train Wrap",
    "Bus Branding",
    "Bus Shelter Branding",
    "Cab Branding",
    "Auto Rickshaw Branding",
    "EV Charging Station Branding",
  ],
  Events: [
    "Corporate Event",
    "Brand Activation",
    "Promotional Event",
    "Roadshow",
    "Product Launch",
    "Press Event",
    "Consumer Engagement Activity",
    "Sampling Campaign",
    "Influencer Event",
  ],
  Exhibitions: [
    "Trade Show",
    "Expo Stall",
    "Exhibition Stall Design",
    "Convention Branding",
    "Pavilion Branding",
    "B2B Exhibition",
    "Industry Expo",
    "Conference Branding",
  ],
  "Retail Launches": [
    "Store Launch",
    "Mall Activation",
    "Retail Promotion",
    "Shop Opening Campaign",
    "In-Store Branding",
    "Retail Experience Zone",
    "Product Display Activation",
    "Point of Sale Branding",
  ],
  "Special Activations": [
    "Boat Branding",
    "Beach Branding",
    "Experiential Marketing",
    "Custom Activation",
    "Island Branding",
    "Projection Mapping",
    "Ambient Media",
    "Guerrilla Marketing",
    "Flash Mob Activation",
    "Human Billboard Campaign",
    "Sky Balloon Branding",
    "Inflatable Branding",
    "3D Installation Branding",
  ],
} as const;

export type PortfolioFormat =
  (typeof portfolioFormatsByCategory)[keyof typeof portfolioFormatsByCategory][number];

export type PortfolioItem = {
  id: string;
  brand: string;
  category: PortfolioCategory;
  format: PortfolioFormat;
  city: string;
  year: string;
  /** masonry sizing hint */
  tall?: boolean;
};

export const portfolioCategories: (PortfolioCategory | "All")[] = [
  "All",
  "OOH",
  "Transit",
  "Events",
  "Exhibitions",
  "Retail Launches",
  "Special Activations",
];

export const portfolio: PortfolioItem[] = [
  { id: "p1", brand: "Adani Holi Milan", category: "Events", format: "Corporate Event", city: "Ahmedabad", year: "2024", tall: true },
  { id: "p2", brand: "Tata Motors", category: "Events", format: "Product Launch", city: "Lucknow", year: "2023" },
  { id: "p3", brand: "TVS NTorq Launch", category: "Events", format: "Promotional Event", city: "Kanpur", year: "2023" },
  { id: "p4", brand: "Gulf Oil Awards", category: "Events", format: "Press Event", city: "Delhi", year: "2022", tall: true },
  { id: "p5", brand: "Luminous Family Carnival", category: "Events", format: "Consumer Engagement Activity", city: "Jaipur", year: "2024" },
  { id: "p6", brand: "ISEC Conference", category: "Exhibitions", format: "Conference Branding", city: "Varanasi", year: "2023" },
  { id: "p7", brand: "Extramarks Stall", category: "Exhibitions", format: "Expo Stall", city: "Delhi", year: "2024", tall: true },
  { id: "p8", brand: "Extramarks", category: "OOH", format: "Hoarding", city: "Lucknow", year: "2023" },
  { id: "p9", brand: "V-Mart Gantries", category: "OOH", format: "Gantry", city: "Patna", year: "2024" },
  { id: "p10", brand: "Cashify Autos", category: "Transit", format: "Auto Rickshaw Branding", city: "Kanpur", year: "2023", tall: true },
  { id: "p11", brand: "Gallantt TMT", category: "OOH", format: "Billboard", city: "Gorakhpur", year: "2022" },
  { id: "p12", brand: "Shyam Steel", category: "OOH", format: "Unipole", city: "Patna", year: "2023" },
  { id: "p13", brand: "Hero E-Rickshaw", category: "Transit", format: "Auto Rickshaw Branding", city: "Varanasi", year: "2024" },
  { id: "p14", brand: "V-Mart Bus Wrap", category: "Transit", format: "Bus Branding", city: "Lucknow", year: "2023", tall: true },
  { id: "p15", brand: "V-Mart Store Opening", category: "Retail Launches", format: "Store Launch", city: "Bareilly", year: "2024" },
  { id: "p16", brand: "Ahmedabad Shopping Festival", category: "Retail Launches", format: "Mall Activation", city: "Ahmedabad", year: "2023" },
  { id: "p17", brand: "Yousta Launch", category: "Retail Launches", format: "Shop Opening Campaign", city: "Lucknow", year: "2024", tall: true },
  { id: "p18", brand: "V-Mart Boat Branding", category: "Special Activations", format: "Boat Branding", city: "Varanasi", year: "2024", tall: true },
  { id: "p19", brand: "LN Guard — Ghats", category: "Special Activations", format: "Ambient Media", city: "Varanasi", year: "2023" },
];
