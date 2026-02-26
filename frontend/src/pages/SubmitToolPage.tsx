import { useState } from 'react';
import { useSubmitTool } from '../hooks/useQueries';
import { ALLOWED_CATEGORIES, ALLOWED_PRICING_TAGS } from '../lib/constants';
import { validateToolData } from '../lib/validation/toolValidation';
import { useSeo } from '../hooks/useSeo';
import { t } from '../i18n';
import { toast } from 'sonner';

export default function SubmitToolPage() {
  useSeo({
    title: 'Submit Your Tool – Mix Daily',
    description: 'Share your AI or digital tool with our community.',
  });

  const [formData, setFormData] = useState({
    name: '',
    iconUrl: '',
    description: '',
    category: '',
    pricingTag: '',
    officialLink: '',
  });

  const submitMutation = useSubmitTool();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateToolData(formData);
    if (!validation.valid) {
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    try {
      await submitMutation.mutateAsync(formData);
      toast.success(t('submit.success'));
      setFormData({
        name: '',
        iconUrl: '',
        description: '',
        category: '',
        pricingTag: '',
        officialLink: '',
      });
    } catch (error) {
      toast.error('Failed to submit tool. Please try again.');
    }
  };

  return (
    <div className="bg-[oklch(0.97_0.01_280)]">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">{t('submit.title')}</h1>
            <p className="text-muted-foreground">{t('submit.description')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-[18px] border bg-card p-8 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t('submit.fields.name')} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 w-full rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_280)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                {t('submit.fields.iconUrl')} *
              </label>
              <input
                type="url"
                required
                value={formData.iconUrl}
                onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                className="h-12 w-full rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_280)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                {t('submit.fields.description')} *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_280)]"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {formData.description.trim().split(/\s+/).filter(Boolean).length} words (18-25
                required)
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                {t('submit.fields.category')} *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="h-12 w-full rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_280)]"
              >
                <option value="">Select a category</option>
                {ALLOWED_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                {t('submit.fields.pricingTag')} *
              </label>
              <select
                required
                value={formData.pricingTag}
                onChange={(e) => setFormData({ ...formData, pricingTag: e.target.value })}
                className="h-12 w-full rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_280)]"
              >
                <option value="">Select pricing</option>
                {ALLOWED_PRICING_TAGS.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                {t('submit.fields.officialLink')} *
              </label>
              <input
                type="url"
                required
                value={formData.officialLink}
                onChange={(e) => setFormData({ ...formData, officialLink: e.target.value })}
                className="h-12 w-full rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_280)]"
              />
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full rounded-full bg-[oklch(0.55_0.22_280)] px-6 py-3 font-medium text-white transition-colors hover:bg-[oklch(0.50_0.22_280)] disabled:opacity-50"
            >
              {submitMutation.isPending ? 'Submitting...' : t('submit.button')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
