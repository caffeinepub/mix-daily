import type { Tool } from '../../backend';

export function generateToolJsonLd(tool: Tool, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.category,
    offers: {
      '@type': 'Offer',
      price: tool.pricingTag === 'Free' ? '0' : undefined,
      priceCurrency: 'USD',
    },
    url: tool.officialLink,
    image: tool.iconUrl,
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
