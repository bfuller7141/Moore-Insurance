import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const staticPaths = [
  '/',
  '/about/',
  '/accessibility-policy/',
  '/auto/',
  '/blog/',
  '/business/',
  '/grouphealth/',
  '/personal/',
  '/privacy-policy/',
  '/quote/auto/',
  '/quote/business/',
  '/quote/general/',
  '/quote/personal/',
  '/terms-of-service/',
];

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };

    return entities[character];
  });

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('The site URL must be set in astro.config.mjs to generate the sitemap.');
  }

  const [services, posts] = await Promise.all([
    getCollection('service'),
    getCollection('post'),
  ]);

  const urls = [
    ...staticPaths.map((path) => ({ loc: new URL(path, site).href })),
    ...services.map((service) => ({
      loc: new URL(`/services/${service.slug}/`, site).href,
    })),
    ...posts.map((post) => ({
      loc: new URL(`/blog/${post.slug}/`, site).href,
      lastmod: post.data.date.toISOString(),
    })),
  ].sort((a, b) => a.loc.localeCompare(b.loc));

  const entries = urls
    .map(
      ({ loc, lastmod }) => `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`,
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
