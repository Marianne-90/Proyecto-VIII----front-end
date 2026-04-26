const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
];

const STORAGE_KEY = "la_nonnesa_attribution";
const GTM_ID = import.meta.env.VITE_GTM_ID;
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

function canUseBrowser() {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

function injectScript({ id, src, inline }) {
  if (typeof document === "undefined") return;
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;

  if (src) {
    script.async = true;
    script.src = src;
  }

  if (inline) {
    script.text = inline;
  }

  document.head.appendChild(script);
}

export function captureAttribution() {
  if (!canUseBrowser()) return null;

  const url = new URL(window.location.href);
  const current = Object.fromEntries(
    ATTRIBUTION_KEYS.map((key) => [key, url.searchParams.get(key) || ""])
  );

  const hasCampaignParams = Object.values(current).some(Boolean);
  const stored = getStoredAttribution();

  if (!hasCampaignParams) return stored;

  const payload = {
    ...stored,
    ...current,
    landing_page: stored?.landing_page || window.location.href,
    first_seen_at: stored?.first_seen_at || new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
    referrer: document.referrer || stored?.referrer || "",
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function getStoredAttribution() {
  if (!canUseBrowser()) return {};

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getAttributionFields() {
  const stored = captureAttribution() || {};

  return {
    ...stored,
    page_url: typeof window !== "undefined" ? window.location.href : "",
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
  };
}

export function trackEvent(eventName, payload = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  const eventPayload = {
    event: eventName,
    ...payload,
  };

  window.dataLayer.push(eventPayload);

  if (typeof window.gtag === "function" && GA_MEASUREMENT_ID) {
    window.gtag("event", eventName, payload);
  }
}

export function initAnalytics() {
  if (typeof window === "undefined") return;
  if (window.__laNonnesaAnalyticsInitialized) return;

  window.dataLayer = window.dataLayer || [];

  if (GTM_ID) {
    window.dataLayer.push({
      "gtm.start": Date.now(),
      event: "gtm.js",
    });

    injectScript({
      id: "gtm-loader",
      src: `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`,
    });
  }

  if (GA_MEASUREMENT_ID) {
    injectScript({
      id: "ga4-src",
      src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
    });
    injectScript({
      id: "ga4-inline",
      inline: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
      `,
    });
  }

  window.__laNonnesaAnalyticsInitialized = true;
}

export function trackPageView(payload = {}) {
  if (typeof window === "undefined") return;

  const pagePayload = {
    event: "page_view",
    ...payload,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(pagePayload);

  if (typeof window.gtag === "function" && GA_MEASUREMENT_ID) {
    window.gtag("event", "page_view", payload);
  }
}
