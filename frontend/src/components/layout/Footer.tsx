import { Heart } from 'lucide-react';
import { t } from '../../i18n';
import Disclaimer from '../legal/Disclaimer';

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Disclaimer />
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 border-t pt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            {t('footer.copyright')}
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[oklch(0.55_0.22_280)] hover:underline"
            >
              {t('footer.caffeineLink')}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
