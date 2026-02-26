import { Link, useNavigate } from '@tanstack/react-router';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { t } from '../../i18n';
import LoginButton from '../auth/LoginButton';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/tools', search: { q: searchQuery } });
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[oklch(0.55_0.22_280)]">
              {t('header.logo')}
            </span>
          </Link>

          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-[oklch(0.55_0.22_280)]"
            >
              {t('header.menu.home')}
            </Link>
            <Link
              to="/collections"
              className="text-sm font-medium transition-colors hover:text-[oklch(0.55_0.22_280)]"
            >
              {t('header.menu.collections')}
            </Link>
            <Link
              to="/categories"
              className="text-sm font-medium transition-colors hover:text-[oklch(0.55_0.22_280)]"
            >
              {t('header.menu.categories')}
            </Link>
            <Link
              to="/submit"
              className="text-sm font-medium transition-colors hover:text-[oklch(0.55_0.22_280)]"
            >
              {t('header.menu.submit')}
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:text-[oklch(0.55_0.22_280)]"
            >
              {t('header.menu.about')}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-64 rounded-full border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_280)]"
                />
              </div>
            </form>

            <Link
              to="/submit"
              className="hidden rounded-full bg-[oklch(0.55_0.22_280)] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[oklch(0.50_0.22_280)] md:block"
            >
              {t('header.cta')}
            </Link>

            <LoginButton />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.menu.home')}
              </Link>
              <Link
                to="/collections"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.menu.collections')}
              </Link>
              <Link
                to="/categories"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.menu.categories')}
              </Link>
              <Link
                to="/submit"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.menu.submit')}
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.menu.about')}
              </Link>
              <form onSubmit={handleSearch} className="pt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('header.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-full rounded-full border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_280)]"
                  />
                </div>
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
