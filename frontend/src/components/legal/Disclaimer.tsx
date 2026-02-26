import { t } from '../../i18n';

export default function Disclaimer() {
  return (
    <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
      <p>{t('footer.disclaimer')}</p>
    </div>
  );
}
