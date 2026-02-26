import { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useListTools, useSearchTools } from '../hooks/useQueries';
import { useSeo } from '../hooks/useSeo';
import ToolCard from '../components/tools/ToolCard';
import ToolsSearchFilterBar from '../components/tools/ToolsSearchFilterBar';
import Pagination from '../components/pagination/Pagination';

export default function ToolsListingPage() {
  const searchParams = useSearch({ strict: false }) as any;
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState<string | null>(searchParams?.category || null);
  const [sortBy, setSortBy] = useState<string | null>('Newest');
  const [searchTerm, setSearchTerm] = useState(searchParams?.q || '');

  useSeo({
    title: 'Browse All Tools – Mix Daily',
    description: 'Explore our complete collection of AI and digital tools for every need.',
  });

  const { data: paginatedTools, isLoading: isLoadingList } = useListTools(
    currentPage,
    60,
    filter,
    sortBy
  );
  const { data: searchResults, isLoading: isSearching } = useSearchTools(searchTerm);

  useEffect(() => {
    setCurrentPage(0);
  }, [filter, sortBy, searchTerm]);

  const displayTools = searchTerm.trim() ? searchResults : paginatedTools?.tools;
  const isLoading = searchTerm.trim() ? isSearching : isLoadingList;

  return (
    <div className="bg-[oklch(0.97_0.01_280)]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">Browse All Tools</h1>
          <p className="text-muted-foreground">
            {paginatedTools
              ? `${paginatedTools.total} tools available`
              : 'Loading tools...'}
          </p>
        </div>

        <div className="mb-8">
          <ToolsSearchFilterBar
            onSearchChange={setSearchTerm}
            onFilterChange={setFilter}
            onSortChange={setSortBy}
            initialSearch={searchTerm}
          />
        </div>

        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading tools...</p>
            </div>
          </div>
        ) : displayTools && displayTools.length > 0 ? (
          <>
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayTools.map((tool) => (
                <ToolCard key={tool.id.toString()} tool={tool} />
              ))}
            </div>

            {!searchTerm.trim() && paginatedTools && (
              <Pagination
                currentPage={currentPage}
                totalPages={Number(paginatedTools.totalPages)}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">No tools found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
