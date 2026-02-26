import { Link } from '@tanstack/react-router';
import { useGetFeaturedCollections } from '../hooks/useQueries';
import { useSeo } from '../hooks/useSeo';
import { t } from '../i18n';

export default function CollectionsPage() {
  useSeo({
    title: 'Tool Collections – Mix Daily',
    description: 'Curated collections of the best AI and digital tools.',
  });

  const { data: collections, isLoading } = useGetFeaturedCollections();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[oklch(0.97_0.01_280)]">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">{t('home.sections.featuredCollections')}</h1>
          <p className="text-lg text-muted-foreground">
            Handpicked collections of the best tools
          </p>
        </div>

        {collections && collections.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Link
                key={collection.id.toString()}
                to="/collections/$collectionId"
                params={{ collectionId: collection.id.toString() }}
                className="group overflow-hidden rounded-[18px] border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h2 className="mb-3 text-2xl font-bold group-hover:text-[oklch(0.55_0.22_280)]">
                  {collection.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {collection.tools.length} tools in this collection
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">No collections available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
