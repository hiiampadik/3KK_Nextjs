import {QUERY_ALL_PROJECTS_SLUGS} from "../api/queries.ts";
import client from "../sanity/client.ts";
import {WEBSITE_URL} from "../components/Layout/index.tsx";

const SiteMap = function () {
    return <div>loading</div>;
};

function createXmlEntry(url, changefreq = 'weekly', priority = '0.7') {
    return `
      <loc>${url}</loc>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>`;
}

export async function getServerSideProps({ res }) {
    const baseUrl = WEBSITE_URL;
    const urls = await client.fetch(QUERY_ALL_PROJECTS_SLUGS);
    const entries = []

    // Root redirects to /cs
    entries.push(createXmlEntry(`${baseUrl}/cs`, 'weekly', '1'))
    entries.push(createXmlEntry(`${baseUrl}/en`, 'weekly', '1'))

    // Static pages per locale
    for (const locale of ['cs', 'en']) {
        entries.push(createXmlEntry(`${baseUrl}/${locale}/projects`, 'weekly', '0.9'))
        entries.push(createXmlEntry(`${baseUrl}/${locale}/about`, 'monthly', '0.9'))
        entries.push(createXmlEntry(`${baseUrl}/${locale}/contact`, 'monthly', '0.9'))
    }

    // Project pages per locale
    for (const slug of urls) {
        for (const locale of ['cs', 'en']) {
            entries.push(createXmlEntry(`${baseUrl}/${locale}/projects/${slug}`))
        }
    }

    const createSitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${entries.map((entry) => `<url> ${entry}</url>`).join('')}
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
