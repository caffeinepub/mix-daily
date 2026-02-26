import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useGetCollection } from '../hooks/useQueries';
import { useSeo } from '../hooks/useSeo';
import ToolCard from '../components/tools/ToolCard';

export default function CollectionDetailPage() {
  const { collectionId } = useParams({ strict: false }) as { collectionId: string };
  const { data: collection, isLoading } = useGetCollection(collectionId);

  useSeo({
    title: collection ? `${collection.name} – Mix Daily` : 'Collection – Mix Daily',
    description: collection
      ? `Explore ${collection.tools.length} tools in the ${collection.name} collection.`
      : 'Explore our curated tool collection.',
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Collection Not Found</h1>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[oklch(0.97_0.01_280)]">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/collections"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </Link>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">{collection.name}</h1>
          <p className="text-muted-foreground">
            {collection.tools.length} tools in this collection
          </p>
        </div>

        {collection.tools.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collection.tools.map((tool) => (
              <ToolCard key={tool.id.toString()} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">No tools in this collection yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
