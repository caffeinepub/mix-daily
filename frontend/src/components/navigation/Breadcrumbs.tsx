import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="mx-2 h-4 w-4" />}
          {item.path ? (
            <Link
              to={item.path}
              className="transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-foreground">{item.name}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
