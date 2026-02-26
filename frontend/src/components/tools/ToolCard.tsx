import { Link } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
import type { Tool } from '../../backend';
import PricingBadge from './PricingBadge';
import { t } from '../../i18n';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="group overflow-hidden rounded-[18px] border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link to="/tool/$slug" params={{ slug: tool.slug }} className="block p-6">
        <div className="flex items-start gap-4">
          <img
            src={tool.iconUrl}
            alt={`${tool.name} logo`}
            className="h-16 w-16 flex-shrink-0 rounded-lg object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23f0f0f0"/%3E%3C/svg%3E';
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="mb-2 text-lg font-bold text-foreground group-hover:text-[oklch(0.55_0.22_280)]">
              {tool.name}
            </h3>
            <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
              {tool.description}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <PricingBadge pricing={tool.pricingTag} />
              <span className="text-xs text-muted-foreground">{tool.category}</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="border-t px-6 py-3">
        <a
          href={tool.officialLink}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm font-medium text-[oklch(0.55_0.22_280)] transition-colors hover:text-[oklch(0.50_0.22_280)]"
          onClick={(e) => e.stopPropagation()}
        >
          {t('tools.visitButton')}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
