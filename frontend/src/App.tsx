import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import ToolDetailPage from './pages/ToolDetailPage';
import SubmitToolPage from './pages/SubmitToolPage';
import AboutPage from './pages/AboutPage';
import ToolsListingPage from './pages/ToolsListingPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import BulkUploadPage from './pages/admin/BulkUploadPage';
import SubmissionsReviewPage from './pages/admin/SubmissionsReviewPage';
import NewsletterAdminPage from './pages/admin/NewsletterAdminPage';
import AdminToolsPage from './pages/admin/AdminToolsPage';
import SiteLayout from './components/layout/SiteLayout';
import AdminRouteGuard from './components/auth/AdminRouteGuard';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: SiteLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const categoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/categories',
  component: CategoriesPage,
});

const collectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/collections',
  component: CollectionsPage,
});

const collectionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/collections/$collectionId',
  component: CollectionDetailPage,
});

const toolDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tool/$slug',
  component: ToolDetailPage,
});

const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit',
  component: SubmitToolPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const toolsListingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tools',
  component: ToolsListingPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRouteGuard>
      <AdminDashboardPage />
    </AdminRouteGuard>
  ),
});

const adminToolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/tools',
  component: () => (
    <AdminRouteGuard>
      <AdminToolsPage />
    </AdminRouteGuard>
  ),
});

const adminBulkUploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/bulk-upload',
  component: () => (
    <AdminRouteGuard>
      <BulkUploadPage />
    </AdminRouteGuard>
  ),
});

const adminSubmissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/submissions',
  component: () => (
    <AdminRouteGuard>
      <SubmissionsReviewPage />
    </AdminRouteGuard>
  ),
});

const adminNewsletterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/newsletter',
  component: () => (
    <AdminRouteGuard>
      <NewsletterAdminPage />
    </AdminRouteGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  categoriesRoute,
  collectionsRoute,
  collectionDetailRoute,
  toolDetailRoute,
  submitRoute,
  aboutRoute,
  toolsListingRoute,
  adminRoute,
  adminToolsRoute,
  adminBulkUploadRoute,
  adminSubmissionsRoute,
  adminNewsletterRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
