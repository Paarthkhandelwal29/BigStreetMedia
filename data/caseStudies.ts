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
  executionProcess?: string[];
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
    image: "/images/v_mart_launch.png",
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
    image: "/images/ooh_hoarding.png",
    icon: "ooh",
    gradient: "from-[#111111] via-[#1c1c1c] to-[#2d2a1f]",
    description: "High-visibility hoarding campaign across prime arterial roads and education corridors.",
    overview: "Extramarks wanted to create an outstanding brand presence at a highly crowded education expo in Delhi and Lucknow, while reinforcing its city-wide reach during the critical school and coaching admission season.\n\nOur partnership focused on delivering an end-to-end activation model, wrapping major corridors with outdoor media and implementing interactive stalls to capture, qualify, and deliver high-potential student leads to the sales team.",
    servicesDelivered: [
      {
        title: "Exhibition Stall Design & Fabrication",
        description: "Designing and constructing an engaging exhibition stall on the busy expo floor with integrated interactive lead capture systems.",
      },
      {
        title: "High-Impact OOH Campaigns",
        description: "Deploying prime billboard and hoarding placements near major schools, coaching hubs, and high-traffic student corridors.",
      },
      {
        title: "Lead Generation Strategy",
        description: "Implementing data capture workflows to gather and qualify prospective student leads on-ground during the admission season.",
      },
      {
        title: "Brand Positioning",
        description: "Sustaining city-wide awareness and top-of-mind brand recall throughout the critical educational admission window.",
      },
    ],
    executionProcess: [
      "Brief",
      "Stall Fabrication",
      "OOH Installation",
      "Expo Activation",
      "Quality Check",
      "Reporting",
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
    image: "/images/transit_wrap.png",
    icon: "transit",
    gradient: "from-[#0d2818] via-[#1a3a2a] to-[#111111]",
    description: "Auto rickshaw wrap campaign delivering hyper-local reach across high-traffic zones.",
    overview: "Cashify aimed to drive massive city-wide awareness on a performance budget. The campaign focused on establishing high-frequency repetition among daily commuters without incurring the premium costs associated with traditional static hoardings.\n\nBy leveraging transit media as a canvas, we created a mobile outdoor network that moved with the target audience throughout Lucknow and Kanpur.",
    servicesDelivered: [
      {
        title: "Transit Media Wrap",
        description: "Full vehicle wraps on e-rickshaws and auto-rickshaws for highly visible mobile advertising.",
      },
      {
        title: "Targeted Route Planning",
        description: "Concentrating the vehicle fleet around busy electronics markets, transit hubs, and high-density neighborhoods.",
      },
      {
        title: "Hyper-local Penetration",
        description: "Generating high-frequency repetitive brand impressions across dense residential areas on a strict performance budget.",
      },
      {
        title: "Fleet Tracking & Verification",
        description: "Monitoring transit execution and providing geo-tagged display verification to track daily route coverage.",
      },
    ],
    executionProcess: [
      "Brief",
      "Fleet Selection",
      "Wrap Production",
      "Installation",
      "Quality Audits",
      "Reporting",
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
    image: "/images/tata_event.png",
    icon: "events",
    gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    description: "Premium awards evening celebrating dealer networks with full event production and staging.",
    overview: "Gulf Oil required a flawless corporate dealer awards function in Delhi that celebrated its retail network, rewarded high performers, and reinforced premium brand values.\n\nBig Street Media managed the entire production lifecycle end to end, enabling the client's internal marketing team to host delegates and focus entirely on relationship-building.",
    servicesDelivered: [
      {
        title: "Event Production & Management",
        description: "End-to-end management of premium awards ceremonies including stage design, fabrication, and show logistics.",
      },
      {
        title: "Creative Branding & AV",
        description: "Designing high-impact stage backgrounds, custom promotional collateral, lighting design, and premium AV production.",
      },
      {
        title: "Dealer Engagement Activations",
        description: "Curating on-stage award flows, dealer recognition sequences, and engagement activities to build strong partner relations.",
      },
      {
        title: "On-ground Coordination",
        description: "Running tight registration setups, guest relations, scheduling, and live run-of-show support.",
      },
    ],
    executionProcess: [
      "Brief",
      "Venue Selection",
      "Staging & AV Design",
      "Collateral Printing",
      "Live Show Execution",
      "Post-event Reporting",
    ],
  },
];

export const caseStudyBySlug = (slug: string) =>
  caseStudies.find((c) => c.slug === slug);
