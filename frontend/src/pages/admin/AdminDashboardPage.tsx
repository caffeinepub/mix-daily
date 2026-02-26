import { Link } from '@tanstack/react-router';
import { Package, Upload, FileText, Mail } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/admin/tools"
          className="group overflow-hidden rounded-[18px] border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[oklch(0.55_0.22_280)]/10">
            <Package className="h-6 w-6 text-[oklch(0.55_0.22_280)]" />
          </div>
          <h2 className="mb-2 text-xl font-bold group-hover:text-[oklch(0.55_0.22_280)]">
            Manage Tools
          </h2>
          <p className="text-sm text-muted-foreground">Add, edit, or delete tools</p>
        </Link>

        <Link
          to="/admin/bulk-upload"
          className="group overflow-hidden rounded-[18px] border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[oklch(0.55_0.22_280)]/10">
            <Upload className="h-6 w-6 text-[oklch(0.55_0.22_280)]" />
          </div>
          <h2 className="mb-2 text-xl font-bold group-hover:text-[oklch(0.55_0.22_280)]">
            Bulk Upload
          </h2>
          <p className="text-sm text-muted-foreground">Upload tools via CSV</p>
        </Link>

        <Link
          to="/admin/submissions"
          className="group overflow-hidden rounded-[18px] border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[oklch(0.55_0.22_280)]/10">
            <FileText className="h-6 w-6 text-[oklch(0.55_0.22_280)]" />
          </div>
          <h2 className="mb-2 text-xl font-bold group-hover:text-[oklch(0.55_0.22_280)]">
            Submissions
          </h2>
          <p className="text-sm text-muted-foreground">Review tool submissions</p>
        </Link>

        <Link
          to="/admin/newsletter"
          className="group overflow-hidden rounded-[18px] border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[oklch(0.55_0.22_280)]/10">
            <Mail className="h-6 w-6 text-[oklch(0.55_0.22_280)]" />
          </div>
          <h2 className="mb-2 text-xl font-bold group-hover:text-[oklch(0.55_0.22_280)]">
            Newsletter
          </h2>
          <p className="text-sm text-muted-foreground">Manage newsletter subscribers</p>
        </Link>
      </div>
    </div>
  );
}
