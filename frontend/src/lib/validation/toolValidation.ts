import { ALLOWED_CATEGORIES, ALLOWED_PRICING_TAGS } from '../constants';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateToolData(data: {
  name: string;
  iconUrl: string;
  description: string;
  category: string;
  pricingTag: string;
  officialLink: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Tool name is required');
  }

  if (!data.iconUrl || !isValidUrl(data.iconUrl)) {
    errors.push('Valid icon URL is required');
  }

  const wordCount = data.description.trim().split(/\s+/).length;
  if (wordCount < 18 || wordCount > 25) {
    errors.push(`Description must be 18-25 words (current: ${wordCount})`);
  }

  if (!ALLOWED_CATEGORIES.includes(data.category as any)) {
    errors.push(`Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  }

  if (!ALLOWED_PRICING_TAGS.includes(data.pricingTag as any)) {
    errors.push(`Pricing tag must be one of: ${ALLOWED_PRICING_TAGS.join(', ')}`);
  }

  if (!data.officialLink || !isValidUrl(data.officialLink)) {
    errors.push('Valid official link is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function normalizeToolName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.origin + parsed.pathname.replace(/\/$/, '');
  } catch {
    return url.trim().toLowerCase();
  }
}
