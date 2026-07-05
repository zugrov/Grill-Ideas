import { getLandingJsonLdScripts } from "@/lib/landing-schema";

export function LandingJsonLd() {
  const scripts = getLandingJsonLdScripts();

  return (
    <>
      {scripts.map((schema) => (
        <script
          key={(schema as { "@type": string })["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
