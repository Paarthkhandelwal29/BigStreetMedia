export type BrandCategory =
  | "automobile"
  | "retail"
  | "electronics"
  | "fmcg"
  | "infra"
  | "education"
  | "finance";

export interface Brand {
  id: number;
  name: string;
  logo: string;
  website?: string;
  category: string;
  scale?: number;
}

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

export function getBrandIndustry(category: string): BrandCategory {
  const normalized = category.toLowerCase().trim();
  if (normalized.includes("automobile") || normalized.includes("car") || normalized.includes("bike") || normalized.includes("motor")) return "automobile";
  if (normalized.includes("fmcg") || normalized.includes("paint") || normalized.includes("consumer") || normalized.includes("oil") || normalized.includes("times")) return "fmcg";
  if (normalized.includes("retail") || normalized.includes("fashion") || normalized.includes("mart") || normalized.includes("clothing") || normalized.includes("trend") || normalized.includes("bazaar") || normalized.includes("baazar") || normalized.includes("kart")) return "retail";
  if (normalized.includes("electronics") || normalized.includes("digital") || normalized.includes("appliances")) return "electronics";
  if (normalized.includes("education") || normalized.includes("school") || normalized.includes("college") || normalized.includes("britannica") || normalized.includes("ilbs") || normalized.includes("marks")) return "education";
  if (normalized.includes("finance") || normalized.includes("insurance") || normalized.includes("travel") || normalized.includes("bank") || normalized.includes("trip") || normalized.includes("youtag")) return "finance";
  if (normalized.includes("steel") || normalized.includes("infra") || normalized.includes("cement") || normalized.includes("construction") || normalized.includes("zen") || normalized.includes("l_t") || normalized.includes("l&t") || normalized.includes("fenesta") || normalized.includes("fanesta")) return "infra";
  return "fmcg"; // default fallback
}

export const brands: Brand[] = [
  // Automobile
  { id: 1, name: "Hero", logo: "Hero-removebg-preview.png", website: "heromotocorp.com", category: "Automobile", scale: 1.2 },
  { id: 2, name: "TVS", logo: "TVS-removebg-preview.png", website: "tvsmotor.com", category: "Automobile", scale: 1.15 },
  { id: 3, name: "Tata Motors", logo: "TataMotors-removebg-preview.png", website: "tatamotors.com", category: "Automobile", scale: 1.0 },
  { id: 4, name: "Ather", logo: "Ather_black-removebg-preview.png", website: "atherenergy.com", category: "Automobile", scale: 1.15 },
  // Retail / Fashion
  { id: 5, name: "V-Mart", logo: "V_Mart-removebg-preview.png", website: "vmartretail.com", category: "Retail", scale: 1.2 },
  { id: 6, name: "Vishal Mega Mart", logo: "Vishal_Mega_Mart-removebg-preview.png", website: "vishalmegamart.com", category: "Retail", scale: 1.0 },
  { id: 7, name: "Style Baazar", logo: "Style_baazar-removebg-preview.png", website: "stylebaazar.in", category: "Retail", scale: 1.2 },
  { id: 8, name: "Citykart", logo: "City_kart-removebg-preview.png", website: "citykart.co.in", category: "Retail", scale: 1.15 },
  { id: 9, name: "Trends", logo: "Trends-removebg-preview.png", website: "trends.ajio.com", category: "Retail", scale: 1.2 },
  { id: 10, name: "V-Bazaar", logo: "V_bazar-removebg-preview (1).png", website: "v-bazaar.com", category: "Retail", scale: 1.15 },
  // Consumer Electronics
  { id: 11, name: "LG", logo: "LG-removebg-preview.png", website: "lg.com", category: "Consumer Electronics", scale: 1.05 },
  { id: 12, name: "Luminous", logo: "Luminous_Logo-removebg-preview.png", website: "luminousindia.com", category: "Consumer Electronics", scale: 1.15 },
  { id: 13, name: "Reliance Digital", logo: "Reliance digital logo.png", website: "reliancedigital.in", category: "Consumer Electronics", scale: 3.5 },
  { id: 14, name: "Cashify", logo: "Cashify_logo-removebg-preview.png", website: "cashify.in", category: "Consumer Electronics", scale: 1.5 },
  // FMCG / Consumer
  { id: 15, name: "Sensodyne", logo: "Sensodyne-removebg-preview.png", website: "sensodyne.com", category: "FMCG", scale: 1.9 },
  { id: 16, name: "Gulf Oil", logo: "Gulf_logo-removebg-preview.png", website: "gulfoilindia.com", category: "FMCG", scale: 1.7 },
  { id: 17, name: "The Times Group", logo: "The_times_group-removebg-preview.png", website: "timesgroup.com", category: "FMCG", scale: 1.4 },
  // Steel / Infra
  { id: 18, name: "Gallantt TMT", logo: "Screenshot_2026-07-06_225136-removebg-preview.png", website: "gallantt.com", category: "Steel & Infra", scale: 1.05 },
  { id: 19, name: "Shyam Steel", logo: "Shyam_Steel_logo-removebg-preview.png", website: "shyamsteel.com", category: "Steel & Infra", scale: 1.2 },
  { id: 20, name: "Ecozen", logo: "Ecozen.png", website: "ecozen.co.in", category: "Steel & Infra", scale: 1.0 },
  { id: 21, name: "Adani Cement", logo: "Adani_ACC_cement-removebg-preview.png", website: "adanicement.com", category: "Steel & Infra", scale: 1.0 },
  { id: 22, name: "Ambuja Cement", logo: "Adani_Ambuja_Cement-removebg-preview.png", website: "ambujacement.com", category: "Steel & Infra", scale: 1.15 },
  { id: 23, name: "L&T", logo: "L_T_-removebg-preview.png", website: "larsentoubro.com", category: "Steel & Infra", scale: 1.15 },
  { id: 24, name: "Fenesta", logo: "Fanesta_Logo-removebg-preview.png", website: "fenesta.com", category: "Steel & Infra", scale: 1.05 },
  // Education
  { id: 25, name: "Extramarks", logo: "Extramarks-removebg-preview.png", website: "extramarks.com", category: "Education", scale: 1.2 },
  { id: 26, name: "Britannica Education", logo: "Britannica Education.png", website: "britannica.com", category: "Education", scale: 1.0 },
  { id: 27, name: "ILBS", logo: "Ilbs_logo-removebg-preview.png", website: "ilbs.in", category: "Education", scale: 1.7 },
  // Finance
  { id: 28, name: "Youtag", logo: "Youtag.png", website: "youtagindia.com", category: "Finance", scale: 2.4 },
];
