export type PortfolioCategory =
  | "Events"
  | "Exhibitions"
  | "OOH"
  | "Transit"
  | "Store Launch"
  | "Boat Branding";

export type PortfolioItem = {
  id: string;
  brand: string;
  category: PortfolioCategory;
  city: string;
  year: string;
  /** masonry sizing hint */
  tall?: boolean;
};

export const portfolioCategories: (PortfolioCategory | "All")[] = [
  "All",
  "Events",
  "Exhibitions",
  "OOH",
  "Transit",
  "Store Launch",
  "Boat Branding",
];

export const portfolio: PortfolioItem[] = [
  { id: "p1", brand: "Adani Holi Milan", category: "Events", city: "Ahmedabad", year: "2024", tall: true },
  { id: "p2", brand: "Tata Motors", category: "Events", city: "Lucknow", year: "2023" },
  { id: "p3", brand: "TVS NTorq Launch", category: "Events", city: "Kanpur", year: "2023" },
  { id: "p4", brand: "Gulf Oil Awards", category: "Events", city: "Delhi", year: "2022", tall: true },
  { id: "p5", brand: "Luminous Family Carnival", category: "Events", city: "Jaipur", year: "2024" },
  { id: "p6", brand: "ISEC Conference", category: "Events", city: "Varanasi", year: "2023" },
  { id: "p7", brand: "Extramarks Stall", category: "Exhibitions", city: "Delhi", year: "2024", tall: true },
  { id: "p8", brand: "Extramarks", category: "OOH", city: "Lucknow", year: "2023" },
  { id: "p9", brand: "V-Mart Gantries", category: "OOH", city: "Patna", year: "2024" },
  { id: "p10", brand: "Cashify Autos", category: "Transit", city: "Kanpur", year: "2023", tall: true },
  { id: "p11", brand: "Gallantt TMT", category: "OOH", city: "Gorakhpur", year: "2022" },
  { id: "p12", brand: "Shyam Steel", category: "OOH", city: "Patna", year: "2023" },
  { id: "p13", brand: "Hero E-Rickshaw", category: "Transit", city: "Varanasi", year: "2024" },
  { id: "p14", brand: "V-Mart Bus Wrap", category: "Transit", city: "Lucknow", year: "2023", tall: true },
  { id: "p15", brand: "V-Mart Store Opening", category: "Store Launch", city: "Bareilly", year: "2024" },
  { id: "p16", brand: "Ahmedabad Shopping Festival", category: "Store Launch", city: "Ahmedabad", year: "2023" },
  { id: "p17", brand: "Yousta Launch", category: "Store Launch", city: "Lucknow", year: "2024", tall: true },
  { id: "p18", brand: "V-Mart Boat Branding", category: "Boat Branding", city: "Varanasi", year: "2024", tall: true },
  { id: "p19", brand: "LN Guard — Ghats", category: "Boat Branding", city: "Varanasi", year: "2023" },
];
