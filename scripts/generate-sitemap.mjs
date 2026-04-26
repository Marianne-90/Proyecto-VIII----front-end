import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const shouldWriteDist = process.argv.includes("--dist");
const siteUrl = (process.env.VITE_SITE_URL || process.env.SITE_URL || "https://www.lanonnesa.es").replace(/\/+$/, "");
const today = new Date().toISOString().split("T")[0];

const routes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/carta", changefreq: "weekly", priority: "0.9" },
  { path: "/especialidades", changefreq: "weekly", priority: "0.85" },
  { path: "/reservar", changefreq: "weekly", priority: "0.9" },
  { path: "/contacto", changefreq: "monthly", priority: "0.8" },
];

const urlEntries = routes
  .map(
    ({ path: routePath, changefreq, priority }) => `  <url>
    <loc>${siteUrl}${routePath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`;

const fileTargets = [
  { file: "sitemap.xml", content: xml, dir: path.join(cwd, "public") },
  { file: "robots.txt", content: robots, dir: path.join(cwd, "public") },
];

if (shouldWriteDist && fs.existsSync(path.join(cwd, "dist"))) {
  fileTargets.push(
    { file: "sitemap.xml", content: xml, dir: path.join(cwd, "dist") },
    { file: "robots.txt", content: robots, dir: path.join(cwd, "dist") }
  );
}

for (const { dir, file, content } of fileTargets) {
  fs.writeFileSync(path.join(dir, file), content, "utf8");
}

process.stdout.write(`Sitemap generado para ${siteUrl}\n`);
