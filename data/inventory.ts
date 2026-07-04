export type MediaType =
  | "Hoardings"
  | "Bus Shelters"
  | "Unipoles"
  | "Mall Branding"
  | "Metro Stations"
  | "Airport Media"
  | "Railway Stations"
  | "Boat Media";

export type InventoryItem = {
  id: string;
  city: string;
  type: MediaType;
  landmark: string;
  size: string;
  dailyTraffic: string;
  available: boolean;
};

export const inventoryCities = [
  "Lucknow",
  "Kanpur",
  "Varanasi",
  "Patna",
  "Delhi",
  "Jaipur",
  "Mumbai",
  "Pune",
  "Ahmedabad",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Chandigarh",
  "Indore",
  "Bhopal",
  "Surat",
  "Nagpur",
  "Ludhiana",
  "Agra",
  "Noida",
  "Gurugram",
  "Ghaziabad",
  "Faridabad",
  "Amritsar",
  "Jodhpur",
  "Udaipur",
  "Vadodara",
  "Kochi",
  "Guwahati",
  "Ranchi",
  "Raipur",
  "Bhubaneswar",
  "Dehradun",
  "Jammu",
  "Mysuru",
  "Prayagraj",
  "Vijayawada",
  "Meerut",
  "Bareilly",
  "Gorakhpur",
] as const;

export const mediaTypes: MediaType[] = [
  "Hoardings",
  "Bus Shelters",
  "Unipoles",
  "Mall Branding",
  "Metro Stations",
  "Airport Media",
  "Railway Stations",
  "Boat Media",
];

export const inventory: InventoryItem[] = [
  { id: "lko-h1", city: "Lucknow", type: "Hoardings", landmark: "Hazratganj Crossing", size: "40 × 20 ft", dailyTraffic: "1.2L+ vehicles", available: true },
  { id: "lko-u1", city: "Lucknow", type: "Unipoles", landmark: "Shaheed Path", size: "20 × 10 ft", dailyTraffic: "85K+ vehicles", available: true },
  { id: "lko-m1", city: "Lucknow", type: "Metro Stations", landmark: "Charbagh Metro", size: "Concourse pkg", dailyTraffic: "40K+ footfall", available: false },
  { id: "knp-h1", city: "Kanpur", type: "Hoardings", landmark: "Mall Road", size: "30 × 15 ft", dailyTraffic: "95K+ vehicles", available: true },
  { id: "knp-b1", city: "Kanpur", type: "Bus Shelters", landmark: "Z-Square Mall", size: "12 × 4 ft", dailyTraffic: "60K+ footfall", available: true },
  { id: "vns-bt1", city: "Varanasi", type: "Boat Media", landmark: "Dashashwamedh Ghat", size: "Boat wrap", dailyTraffic: "50K+ pilgrims/day", available: true },
  { id: "vns-h1", city: "Varanasi", type: "Hoardings", landmark: "Cantt Station Road", size: "40 × 20 ft", dailyTraffic: "1L+ vehicles", available: true },
  { id: "pat-r1", city: "Patna", type: "Railway Stations", landmark: "Patna Junction", size: "Platform pkg", dailyTraffic: "3L+ daily", available: true },
  { id: "pat-u1", city: "Patna", type: "Unipoles", landmark: "Bailey Road", size: "20 × 10 ft", dailyTraffic: "70K+ vehicles", available: false },
  { id: "del-m1", city: "Delhi", type: "Mall Branding", landmark: "Select Citywalk", size: "Atrium pkg", dailyTraffic: "80K+ footfall", available: true },
  { id: "del-h1", city: "Delhi", type: "Hoardings", landmark: "NH-48 Toll", size: "60 × 20 ft", dailyTraffic: "2L+ vehicles", available: true },
  { id: "jai-h1", city: "Jaipur", type: "Hoardings", landmark: "Tonk Road", size: "40 × 20 ft", dailyTraffic: "90K+ vehicles", available: true },
];
