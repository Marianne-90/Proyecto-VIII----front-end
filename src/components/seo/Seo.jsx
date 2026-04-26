import { useEffect } from "react";
import {
  SITE_DESCRIPTION,
  SITE_IMAGE,
  SITE_LOCALE,
  absoluteUrl,
  buildTitle,
} from "../../lib/seo.js";

function upsertMeta(selector, attributes) {
  let node = document.head.querySelector(selector);

  if (!node) {
    node = document.createElement("meta");
    document.head.appendChild(node);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });
}

function upsertLink(selector, attributes) {
  let node = document.head.querySelector(selector);

  if (!node) {
    node = document.createElement("link");
    document.head.appendChild(node);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });
}

export default function Seo({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  image = SITE_IMAGE,
  type = "website",
  keywords = [],
  noindex = false,
  jsonLd = [],
}) {
  useEffect(() => {
    const fullTitle = buildTitle(title);
    const canonical = absoluteUrl(path);
    const imageUrl = absoluteUrl(image);
    const robots = noindex ? "noindex, nofollow" : "index, follow";
    const keywordText = Array.isArray(keywords) ? keywords.join(", ") : keywords;

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: robots,
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: fullTitle,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonical,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: imageUrl,
    });
    upsertMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: SITE_LOCALE,
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: fullTitle,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: imageUrl,
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: canonical,
    });

    if (keywordText) {
      upsertMeta('meta[name="keywords"]', {
        name: "keywords",
        content: keywordText,
      });
    }

    const scriptId = "seo-json-ld";
    const previous = document.getElementById(scriptId);
    if (previous) previous.remove();

    if (jsonLd.length > 0) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [description, image, jsonLd, keywords, noindex, path, title, type]);

  return null;
}
