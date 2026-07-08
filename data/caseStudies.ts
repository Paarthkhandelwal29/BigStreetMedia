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
  image: string;
  icon: "ooh" | "transit" | "events";
  gradient: string;
  description: string;
  overview?: string;
  servicesDelivered?: { title: string; description: string }[];
  executionProcess?: string[] | { title: string; description: string }[];
  highlights?: string[];
  overviewBullets?: { text: string; subBullets?: string[] }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "v-mart-store-launches",
    brand: "V-Mart",
    industry: "Retail & Fashion",
    campaignType: "360° Launch Campaign",
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
    image: `https://ik.imagekit.io/${"Paarthkhandelwal29"}/bigstreetmedia/WhatsApp_Image_2026-07-02_at_10.28.45_PM_vFPemijpA.jpeg`,
    icon: "ooh",
    gradient: "from-[#ff4e50] to-[#f9d423]",
    description: "High-impact 360° launch campaign spanning OOH, transit wraps, and signature Varanasi boat branding.",
    overview: "For several years, Big Street Media has partnered with V-Mart to execute marketing campaigns across multiple cities in India.\n\nOur role has ranged from launching new retail stores and executing outdoor advertising campaigns to managing transit branding and rural marketing initiatives.\n\nEach campaign required meticulous planning, vendor coordination, field execution and transparent reporting to ensure every activity was delivered according to brand standards.",
    servicesDelivered: [
      {
        title: "Store Launch Activations",
        description: "Launching new V-Mart stores with complete on-ground execution including branding, event setup and promotional activities.",
      },
      {
        title: "Outdoor Advertising",
        description: "Identifying premium advertising locations, leasing media spaces, installation and campaign monitoring.",
      },
      {
        title: "Transit Branding",
        description: "Branding auto-rickshaws, e-rickshaws and boats across multiple cities with geo-tagged reporting.",
      },
      {
        title: "Rural Marketing",
        description: "Executing promotional campaigns to increase brand visibility in high-potential rural markets.",
      },
    ],
    executionProcess: [
      "Brief",
      "Planning & Coordination",
      "Production & Procurement",
      "On-ground Execution",
      "Quality Verification",
      "Reporting",
    ],
    overviewBullets: [
      {
        text: "Big Street Media has collaborated with V-Mart for several years to execute marketing campaigns across multiple cities in India.",
      },
      {
        text: "Scope of Services:",
        subBullets: [
          "Launching new retail stores.",
          "Executing outdoor advertising campaigns.",
          "Managing transit branding.",
          "Implementing rural marketing initiatives.",
        ],
      },
      {
        text: "Operational Excellence: Every campaign involved:",
        subBullets: [
          "Meticulous planning.",
          "Vendor coordination.",
          "Field execution.",
          "Transparent reporting to ensure adherence to brand standards.",
        ],
      },
    ],
  },
  {
    slug: "extramarks-exhibition",
    brand: "Extramarks",
    industry: "Education",
    campaignType: "360° Launch Campaign",
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
    image: `https://ik.imagekit.io/${"Paarthkhandelwal29"}/bigstreetmedia/IMG_5630_eanZN7BFq.JPG?updatedAt=1783005500258`,
    icon: "ooh",
    gradient: "from-[#111111] via-[#1c1c1c] to-[#2d2a1f]",
    description: "High-visibility hoarding campaign across prime arterial roads and education corridors.",
    overview: "Big Street Media partnered with Extramarks to execute large-scale branding, deployment and event management projects across India.\n\nOur team personally travelled to 400+ cities, covering locations from Jammu to Kerala and Gujarat to Arunachal Pradesh, to deploy school branding boards while maintaining consistent quality and timely execution across every site.\n\nBeyond school deployments, we managed end-to-end exhibitions, executed transit branding campaigns, fabricated and installed arch gates, and provided PAN India Outdoor Advertising (OOH) solutions through our trusted vendor network. Every project was delivered with meticulous planning, seamless coordination and transparent reporting.",
    highlights: [
      "400+ Cities Covered",
      "PAN India Execution",
      "School Board Deployments",
      "End-to-End Exhibition Management",
      "Bus Branding Campaigns",
      "Arch Gate Fabrication & Installation",
      "Nationwide OOH Media Solutions",
    ],
    servicesDelivered: [
      {
        title: "School Board Deployment",
        description: "Personally executed school branding board installations across 400+ cities, ensuring standardized deployment, timely completion and consistent brand visibility across educational institutions.",
      },
      {
        title: "Exhibition Management",
        description: "Executed exhibitions from concept to completion, including stall design, fabrication, transportation, installation, venue coordination, host hiring, on-ground management and dismantling.",
      },
      {
        title: "PAN India OOH Media",
        description: "Delivered outdoor advertising solutions across India through our extensive vendor network, including media planning, site procurement, campaign execution and monitoring.",
      },
      {
        title: "Bus Branding",
        description: "Designed, produced and installed bus branding campaigns across multiple cities to maximize brand visibility and audience reach.",
      },
      {
        title: "Arch Gate Fabrication & Installation",
        description: "Fabricated and installed customized entrance arch gates for schools, exhibitions and promotional campaigns with high-quality finishing and structural reliability.",
      },
    ],
    executionProcess: [
      {
        title: "Project Brief",
        description: "Understanding campaign objectives, branding guidelines, timelines, deployment locations and execution requirements.",
      },
      {
        title: "Planning & Coordination",
        description: "Preparing city-wise deployment schedules, coordinating logistics, assigning execution teams and collaborating with regional vendors where required.",
      },
      {
        title: "Production & Logistics",
        description: "Fabricating branding materials, exhibition structures and campaign assets, followed by nationwide transportation and material dispatch.",
      },
      {
        title: "On-Ground Execution",
        description: "Executing school board installations, exhibition setups, bus branding, arch gate installations and OOH campaigns while ensuring adherence to brand standards.",
      },
      {
        title: "Quality Verification",
        description: "Conducting on-site inspections, verifying installation quality and ensuring every execution met client expectations before project completion.",
      },
      {
        title: "Reporting",
        description: "Providing geo-tagged photographs, completion reports and execution documentation to maintain complete transparency across every activity.",
      },
    ],
  },
  {
    slug: "cashify-transit",
    brand: "Cashify",
    industry: "Consumer Electronics",
    campaignType: "360° Launch Campaign",
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
    image: `https://ik.imagekit.io/${"Paarthkhandelwal29"}/bigstreetmedia/WhatsApp_Image_2026-07-03_at_10.52.51_PM_kqjeeLXqNe.jpeg?updatedAt=1783169047093`,
    icon: "transit",
    gradient: "from-[#0d2818] via-[#1a3a2a] to-[#111111]",
    description: "Auto rickshaw wrap campaign delivering hyper-local reach across high-traffic zones.",
    overview: "For several years, Big Street Media has partnered with Cashify to execute high-impact marketing campaigns across multiple cities in India.\n\nOur role has included managing outdoor advertising campaigns in over 50 cities, supporting store launch activations across the country, and executing transit media and on-ground promotional activities.\n\nFrom media planning and site execution to branding installations and field operations, every campaign was delivered with meticulous planning, coordinated execution and transparent reporting to ensure maximum brand visibility and consistency.",
    highlights: [
      "50+ Cities Covered",
      "PAN India Store Launch Support",
      "Outdoor Advertising Campaigns",
      "Transit Media Branding",
      "Leaflet Distribution",
      "Kiosk Activations",
    ],
    servicesDelivered: [
      {
        title: "Outdoor Advertising",
        description: "Executed hoarding and billboard campaigns across 50+ cities, including media planning, site procurement, installation, campaign monitoring and maintenance.",
      },
      {
        title: "Store Launch Activations",
        description: "Supported the launch of multiple Cashify stores across India with complete on-ground branding, installation and execution.",
      },
      {
        title: "Transit Media Branding",
        description: "Managed branding campaigns across auto-rickshaws, cabs and other transit media to maximize visibility in high-footfall locations.",
      },
      {
        title: "Kiosk Activations",
        description: "Designed and executed promotional kiosk activities to engage customers, generate leads and strengthen brand presence at strategic locations.",
      },
      {
        title: "Leaflet Distribution",
        description: "Planned and managed targeted leaflet distribution campaigns to drive awareness and increase footfall during store launches and promotional campaigns.",
      },
    ],
    executionProcess: [
      {
        title: "Campaign Brief",
        description: "Understanding campaign objectives, target markets, timelines and branding requirements.",
      },
      {
        title: "Planning & Coordination",
        description: "Identifying suitable advertising locations, planning city-wise execution and coordinating with regional teams and media partners.",
      },
      {
        title: "Production & Procurement",
        description: "Printing campaign creatives, producing branding materials and arranging logistics for timely deployment.",
      },
      {
        title: "On-Ground Execution",
        description: "Installing hoardings and billboards, executing transit branding, managing store launch branding and conducting promotional activities.",
      },
      {
        title: "Quality Verification",
        description: "Inspecting every installation and activity to ensure brand consistency, execution quality and compliance with campaign standards.",
      },
      {
        title: "Reporting",
        description: "Providing geo-tagged photographs, execution reports and campaign completion documentation for complete transparency and performance tracking.",
      },
    ],
  },
];

export const caseStudyBySlug = (slug: string) =>
  caseStudies.find((c) => c.slug === slug);
