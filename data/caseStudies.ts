export type CaseStudy = {
  slug: string;
  brand: string;
  industry: string;
  campaignType: string;
  challenge: string;
  brief: {
    objective: string;
    duration: string;
    cities: string;
    type: string;
  };
  strategy: string[];
  execution: string[];
  media: string[];
  results: { label: string; value: string }[];
  testimonial?: { quote: string; name: string; title: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "v-mart-store-launches",
    brand: "V-Mart",
    industry: "Retail & Fashion",
    campaignType: "360° Launch",
    challenge:
      "V-Mart was opening new stores across Tier 2 and Tier 3 towns and needed each launch to drive footfall from day one — not slowly build awareness over months.",
    brief: {
      objective: "Store Launch / Footfall",
      duration: "6 weeks per launch",
      cities: "Bareilly, Lucknow, Patna +",
      type: "OOH + Transit + Activations + Boat",
    },
    strategy: [
      "Saturate each launch town with high-frequency OOH so the brand felt unavoidable in the week before opening.",
      "Wrap local transit (buses, e-rickshaws) to carry the message into every neighbourhood.",
      "In Varanasi, deploy signature Ghat boat branding — a format no competitor uses — for talkability.",
    ],
    execution: [
      "Ground teams secured premium hoardings near each store and along key arterial roads.",
      "Launch-week activations drove walk-ins with offers and on-ground engagement.",
      "Geo-tagged proof of display delivered for every site within 48 hours of going live.",
    ],
    media: ["Hoardings", "Bus Branding", "E-Rickshaw", "Mall Activation", "Boat Branding"],
    results: [
      { label: "Total Reach", value: "25 Lakh+" },
      { label: "Cities Covered", value: "12" },
      { label: "Impressions", value: "1.8 Crore+" },
      { label: "Campaign Duration", value: "42 Days" },
    ],
    testimonial: {
      quote:
        "Every store opened to a crowd. Big Street handled the entire launch footprint so our team could focus on the store itself.",
      name: "Marketing Lead",
      title: "V-Mart",
    },
  },
  {
    slug: "extramarks-exhibition",
    brand: "Extramarks",
    industry: "Education",
    campaignType: "Exhibition + OOH",
    challenge:
      "Extramarks needed to stand out at a crowded education expo and sustain visibility across the city during the admission season.",
    brief: {
      objective: "Lead Generation / Awareness",
      duration: "4 weeks",
      cities: "Lucknow, Delhi",
      type: "Exhibition + OOH",
    },
    strategy: [
      "Design a stall that pulled traffic on a busy expo floor, with lead capture built in.",
      "Reinforce expo presence with city-wide hoardings during admission season.",
    ],
    execution: [
      "Custom stall fabrication and on-ground staffing managed end to end.",
      "OOH placements near schools and coaching hubs ran in parallel.",
    ],
    media: ["Exhibition Stall", "Hoardings", "Lead Capture"],
    results: [
      { label: "Total Reach", value: "8 Lakh+" },
      { label: "Cities Covered", value: "2" },
      { label: "Impressions", value: "60 Lakh+" },
      { label: "Campaign Duration", value: "28 Days" },
    ],
  },
  {
    slug: "cashify-transit",
    brand: "Cashify",
    industry: "Consumer Electronics",
    campaignType: "Transit Media",
    challenge:
      "Cashify wanted city-wide awareness on a performance budget — reaching commuters repeatedly without premium hoarding costs.",
    brief: {
      objective: "Awareness / Recall",
      duration: "8 weeks",
      cities: "Kanpur, Lucknow",
      type: "Transit (Autos + E-Rickshaw)",
    },
    strategy: [
      "Use auto and e-rickshaw branding for high-frequency, low-cost repetition across every locality.",
      "Concentrate vehicles around electronics markets and high-density residential zones.",
    ],
    execution: [
      "Fleet branding rolled out across hundreds of vehicles with monitoring.",
      "Coverage maps shared weekly so the client could see reach by area.",
    ],
    media: ["Auto Branding", "E-Rickshaw", "Bus Branding"],
    results: [
      { label: "Total Reach", value: "15 Lakh+" },
      { label: "Cities Covered", value: "2" },
      { label: "Impressions", value: "1.2 Crore+" },
      { label: "Campaign Duration", value: "56 Days" },
    ],
  },
  {
    slug: "gulf-oil-awards",
    brand: "Gulf Oil",
    industry: "FMCG / Lubricants",
    campaignType: "Corporate Event",
    challenge:
      "Gulf Oil needed a flawless dealer awards function that reinforced the brand and rewarded its distribution network.",
    brief: {
      objective: "Dealer Engagement",
      duration: "1 event",
      cities: "Delhi",
      type: "Events & Production",
    },
    strategy: [
      "Produce a premium awards evening that made dealers feel valued and the brand feel large.",
      "Manage every detail end to end so the client's team could host, not run logistics.",
    ],
    execution: [
      "Full event production: venue, staging, AV, branding, and on-ground coordination.",
      "Tight run-of-show kept the evening on schedule from registration to closing.",
    ],
    media: ["Event Production", "Stage Branding", "AV"],
    results: [
      { label: "Total Reach", value: "500+ Dealers" },
      { label: "Cities Covered", value: "1" },
      { label: "Satisfaction", value: "Top-rated" },
      { label: "Campaign Duration", value: "1 Day" },
    ],
  },
];

export const caseStudyBySlug = (slug: string) =>
  caseStudies.find((c) => c.slug === slug);
