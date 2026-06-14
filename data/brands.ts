export type BrandCategory =
  | "automobile"
  | "retail"
  | "electronics"
  | "fmcg"
  | "infra"
  | "education"
  | "finance";

export type Brand = {
  name: string;
  /** path under /public/logos — placeholder SVGs generated at build time */
  logo: string;
  industry: BrandCategory;
  hasCaseStudy: boolean;
};

export const brandCategories: { key: BrandCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "automobile", label: "Automobile" },
  { key: "fmcg", label: "FMCG" },
  { key: "retail", label: "Retail" },
  { key: "electronics", label: "Consumer Electronics" },
  { key: "education", label: "Education" },
  { key: "finance", label: "Finance" },
  { key: "infra", label: "Steel & Infra" },
];

export const brands: Brand[] = [
  // Automobile
  { name: "Hero", logo: "/logos/hero.svg", industry: "automobile", hasCaseStudy: true },
  { name: "TVS", logo: "/logos/tvs.svg", industry: "automobile", hasCaseStudy: true },
  { name: "Tata Motors", logo: "/logos/tata-motors.svg", industry: "automobile", hasCaseStudy: false },
  { name: "Ather", logo: "/logos/ather.svg", industry: "automobile", hasCaseStudy: false },
  // Retail / Fashion
  { name: "V-Mart", logo: "/logos/v-mart.svg", industry: "retail", hasCaseStudy: true },
  { name: "Vishal Mega Mart", logo: "/logos/vishal-mega-mart.svg", industry: "retail", hasCaseStudy: false },
  { name: "Style Baazar", logo: "/logos/style-baazar.svg", industry: "retail", hasCaseStudy: false },
  { name: "Citykart", logo: "/logos/citykart.svg", industry: "retail", hasCaseStudy: false },
  { name: "LimeRoad", logo: "/logos/limeroad.svg", industry: "retail", hasCaseStudy: false },
  { name: "Trends", logo: "/logos/trends.svg", industry: "retail", hasCaseStudy: false },
  // Consumer Electronics
  { name: "LG", logo: "/logos/lg.svg", industry: "electronics", hasCaseStudy: false },
  { name: "Haier", logo: "/logos/haier.svg", industry: "electronics", hasCaseStudy: false },
  { name: "Luminous", logo: "/logos/luminous.svg", industry: "electronics", hasCaseStudy: false },
  { name: "Reliance Digital", logo: "/logos/reliance-digital.svg", industry: "electronics", hasCaseStudy: false },
  { name: "Cashify", logo: "/logos/cashify.svg", industry: "electronics", hasCaseStudy: true },
  // FMCG / Consumer
  { name: "P&G", logo: "/logos/pg.svg", industry: "fmcg", hasCaseStudy: false },
  { name: "Berger Paints", logo: "/logos/berger.svg", industry: "fmcg", hasCaseStudy: false },
  { name: "Nerolac", logo: "/logos/nerolac.svg", industry: "fmcg", hasCaseStudy: false },
  { name: "Gulf Oil", logo: "/logos/gulf-oil.svg", industry: "fmcg", hasCaseStudy: true },
  { name: "Sensodyne", logo: "/logos/sensodyne.svg", industry: "fmcg", hasCaseStudy: false },
  { name: "Nilkamal", logo: "/logos/nilkamal.svg", industry: "fmcg", hasCaseStudy: false },
  // Steel / Infra
  { name: "Gallantt TMT", logo: "/logos/gallantt.svg", industry: "infra", hasCaseStudy: false },
  { name: "Shyam Steel", logo: "/logos/shyam-steel.svg", industry: "infra", hasCaseStudy: false },
  { name: "Ecozen", logo: "/logos/ecozen.svg", industry: "infra", hasCaseStudy: false },
  { name: "Adani Cement", logo: "/logos/adani-cement.svg", industry: "infra", hasCaseStudy: false },
  // Education
  { name: "Extramarks", logo: "/logos/extramarks.svg", industry: "education", hasCaseStudy: true },
  { name: "Britannica Education", logo: "/logos/britannica.svg", industry: "education", hasCaseStudy: false },
  // Finance / Travel
  { name: "MakeMyTrip", logo: "/logos/makemytrip.svg", industry: "finance", hasCaseStudy: false },
];
