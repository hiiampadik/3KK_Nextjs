import {QUERY_ALL_PROJECTS_SLUGS} from "../api/queries.ts";
import client from "../sanity/client.ts";
import {WEBSITE_URL} from "../components/Layout/index.tsx";

const SiteMap = function () {
    return <div>loading</div>;
};

function createXmlEntry(url) {
    return `
      <loc>${url}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>`;
}

export async function getServerSideProps({ res }) {
    const baseUrl = WEBSITE_URL;
    const urls = await client.fetch(QUERY_ALL_PROJECTS_SLUGS);
    const slugs = []

    slugs.push(`
        <loc>${baseUrl}</loc>
        <changefreq>weekly</changefreq>
        <priority>1</priority>
    `)

    slugs.push(`
        <loc>${baseUrl}/projects</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    `)

    slugs.push(`
        <loc>${baseUrl}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    `)

    slugs.push(`
        <loc>${baseUrl}/contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    `)

    const locations = [
        ...slugs,
        ...urls.map((slug) => createXmlEntry(`${baseUrl}/projects/${slug}`)),
    ];

    const createSitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${locations.map((location) => `<url> ${location}</url>`).join('')}
    </urlset>
    `;
    res.setHeader('Content-Type', 'text/xml');
    res.write(createSitemap());
    res.end();
    return {
        props: {},
    };
}

export default SiteMap;
