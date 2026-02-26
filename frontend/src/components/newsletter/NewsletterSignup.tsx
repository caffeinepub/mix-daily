import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useSubscribeNewsletter } from '../../hooks/useQueries';
import { t } from '../../i18n';
import { toast } from 'sonner';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const subscribeMutation = useSubscribeNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await subscribeMutation.mutateAsync(email);
      toast.success(t('newsletter.success'));
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="rounded-[18px] border bg-card p-8 shadow-sm">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-[oklch(0.55_0.22_280)]/10 p-3">
            <Mail className="h-6 w-6 text-[oklch(0.55_0.22_280)]" />
          </div>
        </div>
        <h3 className="mb-2 text-2xl font-bold">{t('newsletter.title')}</h3>
        <p className="mb-6 text-sm text-muted-foreground">{t('newsletter.description')}</p>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder={t('newsletter.placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 flex-1 rounded-full border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_280)]"
            />
            <button
              type="submit"
              disabled={subscribeMutation.isPending}
              className="rounded-full bg-[oklch(0.55_0.22_280)] px-6 py-3 font-medium text-white transition-colors hover:bg-[oklch(0.50_0.22_280)] disabled:opacity-50"
            >
              {subscribeMutation.isPending ? 'Subscribing...' : t('newsletter.button')}
            </button>
          </div>
        </form>

        <p className="text-xs text-muted-foreground">{t('newsletter.privacy')}</p>
      </div>
    </div>
  );
}
