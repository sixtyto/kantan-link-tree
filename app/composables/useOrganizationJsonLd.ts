export function useOrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Kantan Link Tree",
    description:
      "The easiest way to create a beautiful, personalized link tree",
    url: "https://kantan-link-tree.vercel.app",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    // TODO: Add aggregate rating
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1000",
    },
  };

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(jsonLd),
      },
    ],
  });
}
