import generateSitemap from '../app/sitemap.xml';
import * as fs from "node:fs";

function createSitemap() {
    const sitemap = generateSitemap();
    fs.writeFileSync('./public/sitemap.xml', sitemap);
    console.log('sitemap.xml generated successfully!');
}

createSitemap();
