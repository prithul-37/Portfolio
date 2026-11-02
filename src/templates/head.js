// SEO, social cards, favicon and structured data for <head>.
import { profile, seo } from '../content/profile.js';
import { asset, esc } from './html.js';

export function renderHead() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.shortName,
    jobTitle: profile.role,
    worksFor: { '@type': 'Organization', name: profile.company.name, url: profile.company.url },
    url: seo.siteUrl,
    image: seo.ogImage,
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: profile.city, addressCountry: profile.countryCode },
    sameAs: [profile.linkedin.url, profile.github],
    knowsAbout: seo.knowsAbout,
  };

  return `
    <title>${esc(seo.title)}</title>
    <meta name="description" content="${esc(seo.description)}" />
    <meta name="author" content="${esc(profile.shortName)}" />
    <meta name="keywords" content="${esc(seo.keywords)}" />
    <meta name="theme-color" content="#f6f3ec" />
    <link rel="canonical" href="${seo.siteUrl}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(seo.siteName)}" />
    <meta property="og:url" content="${seo.siteUrl}" />
    <meta property="og:title" content="${esc(seo.title)}" />
    <meta property="og:description" content="${esc(seo.ogDescription)}" />
    <meta property="og:image" content="${seo.ogImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(seo.ogImageAlt)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(seo.title)}" />
    <meta name="twitter:description" content="${esc(seo.twitterDescription)}" />
    <meta name="twitter:image" content="${seo.ogImage}" />

    <link rel="icon" type="image/png" sizes="32x32" href="${asset(profile.favicon.png)}" />
    <link rel="icon" type="image/svg+xml" href="${asset(profile.favicon.svg)}" />
    <link rel="apple-touch-icon" href="${asset(profile.favicon.touch)}" />

    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`;
}
