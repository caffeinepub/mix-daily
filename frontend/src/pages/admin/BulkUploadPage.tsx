import { useState } from 'react';
import { Upload } from 'lucide-react';
import { parseCsv } from '../../lib/csv';
import { validateToolData } from '../../lib/validation/toolValidation';
import { useBulkUploadTools } from '../../hooks/useAdmin';
import { toast } from 'sonner';
import type { Tool } from '../../backend';

interface ValidationRow {
  row: any;
  valid: boolean;
  errors: string[];
}

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationRow[]>([]);
  const [showResults, setShowResults] = useState(false);
  const uploadMutation = useBulkUploadTools();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setShowResults(false);
    }
  };

  const handleValidate = async () => {
    if (!file) return;

    const content = await file.text();
    const { rows, errors } = parseCsv(content);

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    const results: ValidationRow[] = rows.map((row) => {
      const toolData = {
        name: row.name || row.tool_name || '',
        iconUrl: row.iconUrl || row.icon_url || row.tool_icon_url || '',
        description: row.description || '',
        category: row.category || '',
        pricingTag: row.pricingTag || row.pricing_tag || '',
        officialLink: row.officialLink || row.official_link || '',
      };

      const validation = validateToolData(toolData);
      return {
        row: toolData,
        valid: validation.valid,
        errors: validation.errors,
      };
    });

    setValidationResults(results);
    setShowResults(true);
  };

  const handleUpload = async () => {
    const validRows = validationResults.filter((r) => r.valid);
    if (validRows.length === 0) {
      toast.error('No valid rows to upload');
      return;
    }

    const tools: Tool[] = validRows.map((r, index) => ({
      id: BigInt(0),
      name: r.row.name,
      iconUrl: r.row.iconUrl,
      description: r.row.description,
      category: r.row.category,
      pricingTag: r.row.pricingTag,
      officialLink: r.row.officialLink,
      createdAt: BigInt(Date.now() * 1000000),
      updatedAt: BigInt(Date.now() * 1000000),
      isFeatured: false,
      isPopular: false,
      slug: '',
      seoTitle: undefined,
      seoDescription: undefined,
      seoKeywords: undefined,
    }));

    try {
      await uploadMutation.mutateAsync(tools);
      toast.success(`Successfully uploaded ${tools.length} tools`);
      setFile(null);
      setValidationResults([]);
      setShowResults(false);
    } catch (error) {
      toast.error('Failed to upload tools');
    }
  };

  const validCount = validationResults.filter((r) => r.valid).length;
  const invalidCount = validationResults.length - validCount;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Bulk Upload Tools</h1>

      <div className="space-y-6">
        <div className="rounded-[18px] border bg-card p-8 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Upload CSV File</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            CSV should include columns: name, iconUrl, description, category, pricingTag,
            officialLink
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex h-12 cursor-pointer items-center gap-2 rounded-lg border bg-background px-4 transition-colors hover:bg-muted">
                <Upload className="h-4 w-4" />
                <span className="text-sm font-medium">Choose File</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {file && <span className="text-sm text-muted-foreground">{file.name}</span>}
            </div>

            {file && !showResults && (
              <button
                onClick={handleValidate}
                className="rounded-full bg-[oklch(0.55_0.22_280)] px-6 py-3 font-medium text-white transition-colors hover:bg-[oklch(0.50_0.22_280)]"
              >
                Validate CSV
              </button>
            )}
          </div>
        </div>

        {showResults && (
          <div className="rounded-[18px] border bg-card p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Validation Results</h2>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">Valid: {validCount}</span>
                <span className="text-red-600">Invalid: {invalidCount}</span>
              </div>
            </div>

            <div className="mb-6 max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left">Tool Name</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Errors</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {validationResults.map((result, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{result.row.name}</td>
                      <td className="px-4 py-2">
                        {result.valid ? (
                          <span className="text-green-600">✓ Valid</span>
                        ) : (
                          <span className="text-red-600">✗ Invalid</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">
                        {result.errors.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {validCount > 0 && (
              <button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="rounded-full bg-[oklch(0.55_0.22_280)] px-6 py-3 font-medium text-white transition-colors hover:bg-[oklch(0.50_0.22_280)] disabled:opacity-50"
              >
                {uploadMutation.isPending
                  ? 'Uploading...'
                  : `Upload ${validCount} Valid Tools`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
