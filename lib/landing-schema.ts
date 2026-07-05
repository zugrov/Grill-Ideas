import { PRODUCT_NAME } from "@/lib/brand";
import {
  FAQ_ITEMS,
  PROMO_PRICE,
  SEO_DESCRIPTION,
  TESTIMONIALS,
} from "@/lib/landing-content";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function buildFaqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: PRODUCT_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: SEO_DESCRIPTION,
    url: appUrl,
    offers: {
      "@type": "Offer",
      price: PROMO_PRICE,
      priceCurrency: "RUB",
      description: "Полный AI-анализ бизнес-идеи, этапы 2–14",
    },
    provider: {
      "@type": "Organization",
      name: "maxima consulting",
    },
  };
}

/** Маркетинговые кейсы для rich snippets */
export function buildProductReviewSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: PRODUCT_NAME,
    description: SEO_DESCRIPTION,
    brand: {
      "@type": "Brand",
      name: "maxima consulting",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: String(TESTIMONIALS.length),
      bestRating: "5",
      worstRating: "1",
    },
    review: TESTIMONIALS.map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.name,
      },
      reviewBody: t.quote,
      name: `Отзыв: ${t.role}`,
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
    })),
  };
}

export function getLandingJsonLdScripts(): object[] {
  return [
    buildFaqPageSchema(),
    buildSoftwareApplicationSchema(),
    buildProductReviewSchema(),
  ];
}
