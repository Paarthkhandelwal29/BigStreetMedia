import { site } from "@/lib/site";

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description:
      "India's trusted 360° advertising agency specializing in OOH, Transit Media, BTL Activations, and Retail Branding since 2004.",
    logo: `${site.url}/logo-dark.png`,
    image: `${site.url}/logo.png`,
    priceRange: "₹₹",
    foundingDate: String(site.established),
    url: site.url,
    telephone: "+916398930211",
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mahadev Colony, Sector 73",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201301",
      addressCountry: "IN",
    },
    founders: [
      {
        "@type": "Person",
        name: "Aditya Khandelwal",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-6398930211",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    areaServed: [
      { "@type": "AdministrativeArea", "name": "India" },
      { "@type": "AdministrativeArea", "name": "Delhi NCR" },
      { "@type": "AdministrativeArea", "name": "Noida" },
      { "@type": "AdministrativeArea", "name": "Mumbai" },
      { "@type": "AdministrativeArea", "name": "Bengaluru" },
    ],
    sameAs: [
      "https://www.facebook.com/bigstreetmedia",
      "https://www.linkedin.com/company/bigstreetmedia",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbListSchema({
  crumbs,
}: {
  crumbs: { name: string; item: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.item.startsWith("http") ? c.item : `${site.url}${c.item}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceSchema({
  name,
  description,
  serviceType,
  provider = {
    "@type": "LocalBusiness",
    name: site.name,
    url: site.url,
  },
}: {
  name: string;
  description: string;
  serviceType: string;
  provider?: any;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    provider,
    areaServed: "IN",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
