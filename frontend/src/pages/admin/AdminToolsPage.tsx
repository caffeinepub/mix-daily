import { useState } from 'react';
import { useAdminListTools, useDeleteTool } from '../../hooks/useAdmin';
import { Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import PricingBadge from '../../components/tools/PricingBadge';

export default function AdminToolsPage() {
  const { data: tools, isLoading } = useAdminListTools();
  const deleteMutation = useDeleteTool();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: bigint, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Tool deleted successfully');
    } catch (error) {
      toast.error('Failed to delete tool');
    }
  };

  const filteredTools = tools?.filter((tool) =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Manage Tools</h1>
        <input
          type="text"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 w-full max-w-md rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_280)]"
        />
      </div>

      <div className="overflow-hidden rounded-[18px] border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Tool</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Pricing</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTools && filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <tr key={tool.id.toString()} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={tool.iconUrl}
                          alt={tool.name}
                          className="h-10 w-10 rounded object-contain"
                        />
                        <div>
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {tool.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{tool.category}</td>
                    <td className="px-6 py-4">
                      <PricingBadge pricing={tool.pricingTag} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {tool.isFeatured && (
                          <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-600">
                            Featured
                          </span>
                        )}
                        {tool.isPopular && (
                          <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-600">
                            Popular
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDelete(tool.id, tool.name)}
                          disabled={deleteMutation.isPending}
                          className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No tools found
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
