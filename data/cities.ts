export const cityTiers = {
  "Tier 1": ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"],
  "Tier 2": [
    "Lucknow",
    "Kanpur",
    "Jaipur",
    "Patna",
    "Indore",
    "Nagpur",
    "Varanasi",
    "Surat",
    "Bhopal",
    "Ludhiana",
  ],
  "Tier 3": [
    "Gorakhpur",
    "Bareilly",
    "Aligarh",
    "Moradabad",
    "Jhansi",
    "Muzaffarpur",
    "Gaya",
    "Bilaspur",
    "Rohtak",
    "Haldwani",
  ],
} as const;

export type CityTier = keyof typeof cityTiers;
