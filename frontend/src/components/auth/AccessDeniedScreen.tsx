import { Link } from '@tanstack/react-router';
import { ShieldAlert } from 'lucide-react';

export default function AccessDeniedScreen() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-bold">Access Denied</h1>
        <p className="mb-8 text-muted-foreground">
          You don't have permission to access this area. Admin privileges are required.
        </p>
        <Link
          to="/"
          className="inline-block rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
