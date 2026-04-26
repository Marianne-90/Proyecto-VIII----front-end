export const SITE_NAME = "La Nonnesa Pizza Party";
export const SITE_DEFAULT_TITLE = "Pizzería italiana en Ponferrada";
export const SITE_DESCRIPTION =
  "Pizzería en Ponferrada con pizza italiana artesanal, carta gourmet, pedidos, reservas y eventos privados.";
export const SITE_IMAGE = "/pizza.png";
export const SITE_LOCALE = "es_ES";
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://www.lanonnesa.es").replace(/\/+$/, "");
export const SITE_PHONE = "+34 987 19 77 06";
export const SITE_ORDER_PHONE = "+34 603 16 15 79";
export const SITE_ALT_PHONE = "+34 667 81 15 48";
export const SITE_INSTAGRAM = "https://www.instagram.com/la_nonesa_pizzaparty/";
export const SITE_MAP_URL = "https://maps.app.goo.gl/LZLkXmzETGS89LNM6";
export const SITE_ADDRESS = {
  streetAddress: "Calle Obispo Osmundo, 3",
  addressLocality: "Ponferrada",
  addressRegion: "León",
  addressCountry: "ES",
};
export const SITE_COORDINATES = {
  latitude: 42.54615,
  longitude: -6.58879,
};

export function getSiteUrl() {
  if (SITE_URL) return SITE_URL;
  if (typeof window === "undefined") return "";
  return window.location.origin.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!base) return path;
  return new URL(path, base).toString();
}

export function buildTitle(title) {
  return title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | ${SITE_DEFAULT_TITLE}`;
}

export function buildRestaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE_NAME,
    image: absoluteUrl(SITE_IMAGE),
    url: absoluteUrl("/"),
    telephone: SITE_PHONE,
    servesCuisine: ["Italian", "Pizza"],
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      ...SITE_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      ...SITE_COORDINATES,
    },
    sameAs: [SITE_INSTAGRAM],
    menu: absoluteUrl("/carta"),
    acceptsReservations: true,
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    inLanguage: "es",
  };
}

export function buildBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildWebPageSchema({
  title,
  description,
  path,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(path),
    inLanguage: "es",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  };
}
