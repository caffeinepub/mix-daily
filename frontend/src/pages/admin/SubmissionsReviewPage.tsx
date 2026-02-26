import { useListSubmissions, useApproveSubmission, useRejectSubmission } from '../../hooks/useAdmin';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import PricingBadge from '../../components/tools/PricingBadge';

export default function SubmissionsReviewPage() {
  const { data: submissions, isLoading } = useListSubmissions();
  const approveMutation = useApproveSubmission();
  const rejectMutation = useRejectSubmission();

  const handleApprove = async (id: bigint, name: string) => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success(`Approved "${name}"`);
    } catch (error) {
      toast.error('Failed to approve submission');
    }
  };

  const handleReject = async (id: bigint, name: string) => {
    if (!confirm(`Are you sure you want to reject "${name}"?`)) return;

    try {
      await rejectMutation.mutateAsync(id);
      toast.success(`Rejected "${name}"`);
    } catch (error) {
      toast.error('Failed to reject submission');
    }
  };

  const pendingSubmissions = submissions?.filter((s) => s.status === 'pending');

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Review Submissions</h1>

      <div className="overflow-hidden rounded-[18px] border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Tool</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Pricing</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Link</th>
                <th className="px-6 py-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pendingSubmissions && pendingSubmissions.length > 0 ? (
                pendingSubmissions.map((submission) => (
                  <tr key={submission.id.toString()} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={submission.iconUrl}
                          alt={submission.name}
                          className="h-10 w-10 rounded object-contain"
                        />
                        <div>
                          <div className="font-medium">{submission.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {submission.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{submission.category}</td>
                    <td className="px-6 py-4">
                      <PricingBadge pricing={submission.pricingTag} />
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={submission.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[oklch(0.55_0.22_280)] hover:underline"
                      >
                        Visit
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(submission.id, submission.name)}
                          disabled={approveMutation.isPending}
                          className="rounded-lg bg-green-500/10 p-2 text-green-600 transition-colors hover:bg-green-500/20 disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReject(submission.id, submission.name)}
                          disabled={rejectMutation.isPending}
                          className="rounded-lg bg-red-500/10 p-2 text-red-600 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No pending submissions
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
