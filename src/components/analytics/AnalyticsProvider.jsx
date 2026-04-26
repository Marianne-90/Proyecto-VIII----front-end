import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { absoluteUrl } from "../../lib/seo.js";
import {
  initAnalytics,
  trackPageView,
} from "../../services/marketing.js";

function GtmNoscript() {
  const gtmId = import.meta.env.VITE_GTM_ID;

  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}

export default function AnalyticsProvider() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      trackPageView({
        page_path: `${location.pathname}${location.search}${location.hash}`,
        page_location: absoluteUrl(`${location.pathname}${location.search}${location.hash}`),
        page_title: document.title,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname, location.search]);

  return <GtmNoscript />;
}
