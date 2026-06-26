import { site } from "@/lib/site";

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description:
      "360° Advertising Agency — OOH, Transit, BTL, Events, Retail, Digital",
    foundingDate: String(site.established),
    areaServed: "India",
    telephone: "+916398930211",
    email: site.email,
    url: site.url,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
