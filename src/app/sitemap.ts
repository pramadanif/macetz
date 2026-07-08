import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.macetz.web.id';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/app`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/test-report`,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
}
