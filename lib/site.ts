// Single source of truth for brand + contact details.
// Swap these values once; the whole site updates.

export const site = {
  name: "Big Street Media & Advertisers",
  shortName: "Big Street Media",
  tagline: "Creating Visibility. Building Brands.",
  established: 2004,
  url: "https://bigstreetmedia.in",
  email: "bigstreetbly@gmail.com",
  phones: ["+91-6398930211", "+91-9837329698"],
  whatsapp: {
    number: "916398930211",
    defaultText: "Hi, I'd like to know more about your services",
  },
  region: "Uttar Pradesh, India",
  stats: {
    years: "20+",
    cities: "400+",
    campaigns: "1000+",
    brands: "100+",
  },
} as const;

export function whatsappLink(text: string = site.whatsapp.defaultText) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Media Inventory", href: "/media-inventory" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
