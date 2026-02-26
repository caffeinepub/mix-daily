import { Download } from 'lucide-react';
import { useGetNewsletterEmails } from '../../hooks/useAdmin';
import { exportToCsv } from '../../lib/export/csvExport';
import { toast } from 'sonner';

export default function NewsletterAdminPage() {
  const { data: emails, isLoading } = useGetNewsletterEmails();

  const handleExport = () => {
    if (!emails || emails.length === 0) {
      toast.error('No emails to export');
      return;
    }

    const csvData = [['Email'], ...emails.map((email) => [email])];
    exportToCsv(csvData, 'newsletter-subscribers.csv');
    toast.success('Exported successfully');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Newsletter Subscribers</h1>
          <p className="text-muted-foreground">
            {emails?.length || 0} total subscribers
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={!emails || emails.length === 0}
          className="flex items-center gap-2 rounded-full bg-[oklch(0.55_0.22_280)] px-6 py-3 font-medium text-white transition-colors hover:bg-[oklch(0.50_0.22_280)] disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-[18px] border bg-card shadow-sm">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 border-b bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">#</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {emails && emails.length > 0 ? (
                emails.map((email, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm text-muted-foreground">{index + 1}</td>
                    <td className="px-6 py-4 text-sm">{email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                    No subscribers yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
