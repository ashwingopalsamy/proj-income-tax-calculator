import { writeFileSync } from 'fs';

interface Page {
    url: string;
    lastmod: string;
    priority: number;
}

const generateSitemap = (): string => {
    const hostname = "https://simpleincometax.vercel.app";
    const currentDate = new Date().toISOString();

    const pages: Page[] = [
        { url: `${hostname}`, lastmod: currentDate, priority: 1.0 },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(
            (page) => `
            <url>
              <loc>${page.url}</loc>
              <lastmod>${page.lastmod}</lastmod>
              <priority>${page.priority}</priority>
            </url>
          `
        )
        .join("")}
    </urlset>`;

    return sitemap;
};

export default generateSitemap;
