import { PRICING_BADGE_COLORS } from '../../lib/constants';

interface PricingBadgeProps {
  pricing: string;
}

export default function PricingBadge({ pricing }: PricingBadgeProps) {
  const color = PRICING_BADGE_COLORS[pricing as keyof typeof PRICING_BADGE_COLORS] || '#6B6B6B';

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {pricing}
    </span>
  );
}
