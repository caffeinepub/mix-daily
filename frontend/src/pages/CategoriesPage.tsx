import { Link } from '@tanstack/react-router';
import { ALLOWED_CATEGORIES } from '../lib/constants';
import { useSeo } from '../hooks/useSeo';
import { t } from '../i18n';

export default function CategoriesPage() {
  useSeo({
    title: 'Browse by Category – Mix Daily',
    description: 'Explore AI and digital tools organized by category.',
  });

  return (
    <div className="bg-[oklch(0.97_0.01_280)]">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">{t('home.sections.categories')}</h1>
          <p className="text-lg text-muted-foreground">
            Find the perfect tools for your needs
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {ALLOWED_CATEGORIES.map((category) => (
            <Link
              key={category}
              to="/tools"
              search={{ category }}
              className="group overflow-hidden rounded-[18px] border bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-xl font-bold group-hover:text-[oklch(0.55_0.22_280)]">
                {category}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
