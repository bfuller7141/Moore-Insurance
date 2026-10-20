import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

const firstSentence = (value: string) => {
  const normalized = normalize(value);
  const match = normalized.match(/^.*?[.!?](?:\s|$)/);
  return match?.[0].trim() ?? normalized;
};

const markdownLink = (label: string, url: string, description: string) =>
  `- [${label}](${url}): ${description}`;

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Site URL is not configured.', { status: 500 });
  }

  const [services, posts] = await Promise.all([
    getCollection('service'),
    getCollection('post'),
  ]);

  const serviceLinks = services
    .sort((a, b) => a.data.serviceName.localeCompare(b.data.serviceName))
    .map((service) =>
      markdownLink(
        service.data.serviceName,
        new URL(`/services/${service.slug}/`, site).href,
        firstSentence(service.data.seoDescription ?? service.data.description ?? `${service.data.serviceName} coverage information.`),
      ),
    );

  const articleLinks = posts
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((post) =>
      markdownLink(
        post.data.title,
        new URL(`/blog/${post.slug}/`, site).href,
        normalize(post.data.description),
      ),
    );

  const absolute = (path: string) => new URL(path, site).href;

  const content = [
    '# Moore Insurance Agency',
    '',
    '> Moore Insurance is an independent insurance agency based in Surprise, Arizona, serving individuals, families, and businesses throughout Arizona with a focus on the West Valley.',
    '',
    'Moore Insurance Agency LLC compares coverage options from multiple insurance carriers. Policy availability, premiums, limits, exclusions, and eligibility vary by carrier and applicant. Website information is general and does not bind coverage.',
    '',
    'Location: 15282 W Brookside Ln, Suite 110, Surprise, AZ 85374. Phone: +1-623-556-1576. Email: helen@mooreinsure.net.',
    '',
    '## Primary Pages',
    '',
    markdownLink('Home', absolute('/'), 'Overview of the agency, insurance categories, customer reviews, and common questions.'),
    markdownLink('About Moore Insurance', absolute('/about/'), 'Information about the agency and its local team in Surprise, Arizona.'),
    markdownLink('Personal Insurance', absolute('/personal/'), 'Personal insurance options including home, renters, life, and umbrella coverage.'),
    markdownLink('Auto and Vehicle Insurance', absolute('/auto/'), 'Insurance options for cars, motorcycles, RVs, ATVs, golf carts, and commercial vehicles.'),
    markdownLink('Business Insurance', absolute('/business/'), 'Business coverage including liability, property, commercial auto, cyber, umbrella, and workers compensation.'),
    markdownLink('Health Insurance and Financial Planning', absolute('/grouphealth/'), 'Group health, life insurance, annuities, trusts, and related planning services.'),
    '',
    '## Insurance Services',
    '',
    ...serviceLinks,
    '',
    '## Quote Requests',
    '',
    markdownLink('General Insurance Quote', absolute('/quote/general/'), 'Request help choosing the appropriate insurance category.'),
    markdownLink('Personal Insurance Quote', absolute('/quote/personal/'), 'Submit personal insurance coverage details for agency review.'),
    markdownLink('Auto Insurance Quote', absolute('/quote/auto/'), 'Submit driver and vehicle details for agency review.'),
    markdownLink('Business Insurance Quote', absolute('/quote/business/'), 'Submit business and coverage details for agency review.'),
    '',
    '## Insurance Articles',
    '',
    markdownLink('Insurance Blog', absolute('/blog/'), 'Insurance guides and educational articles from Moore Insurance.'),
    ...articleLinks,
    '',
    '## Site Resources',
    '',
    markdownLink('XML Sitemap', absolute('/sitemap.xml'), 'Canonical inventory of indexable website URLs.'),
    markdownLink('Robots Policy', absolute('/robots.txt'), 'Crawler access rules and sitemap location.'),
    markdownLink('Privacy Policy', absolute('/privacy-policy/'), 'How information submitted through the website is handled.'),
    markdownLink('Accessibility Policy', absolute('/accessibility-policy/'), 'Website accessibility commitment and assistance information.'),
    markdownLink('Terms of Service', absolute('/terms-of-service/'), 'Terms governing use of the website.'),
    '',
  ].join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
