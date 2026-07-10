import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://animateui.xyz";

const appTsxPath = path.resolve(__dirname, "../src/App.tsx");
const outputPath = path.resolve(__dirname, "../public/sitemap.xml");

const appContent = fs.readFileSync(appTsxPath, "utf-8");

const routeRegex = /path="([^"]+)"/g;
const routes: string[] = [];
let match: RegExpExecArray | null;

while ((match = routeRegex.exec(appContent)) !== null) {
  const routePath = match[1];
  if (routePath.includes(":") || routePath === "*") continue;
  routes.push(routePath);
}

const today = new Date().toISOString().split("T")[0];

const urls = routes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(outputPath, sitemap, "utf-8");
console.log(`✅ Sitemap generated with ${routes.length} URLs → public/sitemap.xml`);
