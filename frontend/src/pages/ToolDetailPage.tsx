import { useParams, Link } from '@tanstack/react-router';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { useGetToolBySlug, useGetSimilarTools } from '../hooks/useQueries';
import { useSeo } from '../hooks/useSeo';
import { generateToolJsonLd, generateBreadcrumbJsonLd } from '../lib/seo/jsonLd';
import PricingBadge from '../components/tools/PricingBadge';
import SimilarToolsGrid from '../components/tools/SimilarToolsGrid';
import Breadcrumbs from '../components/navigation/Breadcrumbs';

export default function ToolDetailPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const { data: tool, isLoading } = useGetToolBySlug(slug);
  const { data: similarTools } = useGetSimilarTools(tool?.id || BigInt(0), 6);

  const seoTitle = tool?.seoTitle || `${tool?.name} – AI Tool | Mix Daily`;
  const seoDescription =
    tool?.seoDescription ||
    `Discover ${tool?.name}, features, pricing and best alternatives on Mix Daily.`;

  const jsonLd = tool
    ? [
        generateToolJsonLd(tool, window.location.origin),
        generateBreadcrumbJsonLd([
          { name: 'Home', url: window.location.origin },
          { name: tool.category, url: `${window.location.origin}/tools?category=${tool.category}` },
          { name: tool.name, url: window.location.href },
        ]),
      ]
    : undefined;

  useSeo({
    title: seoTitle,
    description: seoDescription,
    jsonLd,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading tool...</p>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Tool Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The tool you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[oklch(0.97_0.01_280)]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: tool.category, path: `/tools?category=${tool.category}` },
              { name: tool.name },
            ]}
          />
        </div>

        <div className="mb-12 overflow-hidden rounded-[18px] border bg-card shadow-sm">
          <div className="p-8">
            <div className="mb-6 flex items-start gap-6">
              <img
                src={tool.iconUrl}
                alt={`${tool.name} logo`}
                className="h-24 w-24 flex-shrink-0 rounded-lg object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23f0f0f0"/%3E%3C/svg%3E';
                }}
              />
              <div className="flex-1">
                <h1 className="mb-3 text-4xl font-bold">{tool.name}</h1>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <PricingBadge pricing={tool.pricingTag} />
                  <span className="text-sm text-muted-foreground">{tool.category}</span>
                </div>
                <a
                  href={tool.officialLink}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.55_0.22_280)] px-6 py-3 font-medium text-white transition-colors hover:bg-[oklch(0.50_0.22_280)]"
                >
                  Visit Official Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="mb-3 text-2xl font-bold">Tool Overview</h2>
                <p className="text-muted-foreground">{tool.description}</p>
              </section>

              <section>
                <h2 className="mb-3 text-2xl font-bold">Pricing Type</h2>
                <p className="text-muted-foreground">
                  This tool is available as <strong>{tool.pricingTag}</strong>.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-2xl font-bold">Category</h2>
                <p className="text-muted-foreground">
                  {tool.name} belongs to the <strong>{tool.category}</strong> category.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-2xl font-bold">Official Website</h2>
                <a
                  href={tool.officialLink}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[oklch(0.55_0.22_280)] hover:underline"
                >
                  {tool.officialLink}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </section>
            </div>
          </div>
        </div>

        {similarTools && similarTools.length > 0 && (
          <SimilarToolsGrid tools={similarTools} />
        )}
      </div>
    </div>
  );
}
