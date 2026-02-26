import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { t } from '../../i18n';

interface ToolsSearchFilterBarProps {
  onSearchChange: (search: string) => void;
  onFilterChange: (filter: string | null) => void;
  onSortChange: (sort: string | null) => void;
  initialSearch?: string;
}

export default function ToolsSearchFilterBar({
  onSearchChange,
  onFilterChange,
  onSortChange,
  initialSearch = '',
}: ToolsSearchFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<string | null>('Newest');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearchChange]);

  const handleFilterClick = (filter: string | null) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  const handleSortChange = (sort: string) => {
    setActiveSort(sort);
    onSortChange(sort);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={t('header.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 w-full rounded-full border bg-background pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_280)]"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterClick(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeFilter === null
              ? 'bg-[oklch(0.55_0.22_280)] text-white'
              : 'border bg-background hover:bg-muted'
          }`}
        >
          {t('tools.filters.all')}
        </button>
        <button
          onClick={() => handleFilterClick('Free')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeFilter === 'Free'
              ? 'bg-[oklch(0.55_0.22_280)] text-white'
              : 'border bg-background hover:bg-muted'
          }`}
        >
          {t('tools.filters.free')}
        </button>
        <button
          onClick={() => handleFilterClick('Paid')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeFilter === 'Paid'
              ? 'bg-[oklch(0.55_0.22_280)] text-white'
              : 'border bg-background hover:bg-muted'
          }`}
        >
          {t('tools.filters.paid')}
        </button>
        <button
          onClick={() => handleFilterClick('Popular')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeFilter === 'Popular'
              ? 'bg-[oklch(0.55_0.22_280)] text-white'
              : 'border bg-background hover:bg-muted'
          }`}
        >
          {t('tools.filters.popular')}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Sort by:</span>
        <select
          value={activeSort || 'Newest'}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_280)]"
        >
          <option value="Newest">{t('tools.sort.newest')}</option>
          <option value="Popular">{t('tools.sort.popular')}</option>
          <option value="Alphabetical">{t('tools.sort.alphabetical')}</option>
        </select>
      </div>
    </div>
  );
}
