import { Link } from '@tanstack/react-router';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useGetFeaturedCollections, useListTools, useGetFeaturedTools } from '../hooks/useQueries';
import { ALLOWED_CATEGORIES } from '../lib/constants';
import { t } from '../i18n';
import { useSeo } from '../hooks/useSeo';
import ToolCard from '../components/tools/ToolCard';
import NewsletterSignup from '../components/newsletter/NewsletterSignup';

export default function HomePage() {
  useSeo({
    title: 'Mix Daily – 1000+ AI & Digital Tools Updated Daily',
    description:
      'Discover the best AI and digital tools for creators, developers, and businesses. Handpicked collection updated daily.',
  });

  const { data: featuredCollections } = useGetFeaturedCollections();
  const { data: newestTools } = useListTools(0, 8, null, 'Newest');
  const { data: featuredTools } = useGetFeaturedTools();

  return (
    <div className="bg-[oklch(0.97_0.01_280)]">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-[oklch(0.55_0.22_280)]" />
              <span>1000+ Tools & Growing Daily</span>
            </div>
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            {t('home.hero.headline')}
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            {t('home.hero.subheadline')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.55_0.22_280)] px-8 py-4 font-medium text-white transition-colors hover:bg-[oklch(0.50_0.22_280)]"
            >
              {t('home.hero.ctaPrimary')}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 rounded-full border bg-card px-8 py-4 font-medium transition-colors hover:bg-muted"
            >
              {t('home.hero.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      {featuredTools && featuredTools.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Tools</h2>
            <Link
              to="/tools"
              className="text-sm font-medium text-[oklch(0.55_0.22_280)] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTools.slice(0, 4).map((tool) => (
              <ToolCard key={tool.id.toString()} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {featuredCollections && featuredCollections.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">{t('home.sections.featuredCollections')}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCollections.map((collection) => (
              <Link
                key={collection.id.toString()}
                to="/collections/$collectionId"
                params={{ collectionId: collection.id.toString() }}
                className="group overflow-hidden rounded-[18px] border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-3 text-xl font-bold group-hover:text-[oklch(0.55_0.22_280)]">
                  {collection.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {collection.tools.length} tools in this collection
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">{t('home.sections.categories')}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {ALLOWED_CATEGORIES.map((category) => (
            <Link
              key={category}
              to="/tools"
              search={{ category }}
              className="group rounded-[18px] border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="font-bold group-hover:text-[oklch(0.55_0.22_280)]">{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      {newestTools && newestTools.tools.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">{t('home.sections.dailyNew')}</h2>
            <Link
              to="/tools"
              search={{ sort: 'Newest' }}
              className="text-sm font-medium text-[oklch(0.55_0.22_280)] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newestTools.tools.map((tool) => (
              <ToolCard key={tool.id.toString()} tool={tool} />
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-16">
        <NewsletterSignup />
      </section>
    </div>
  );
}
