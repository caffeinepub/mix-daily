# Specification

## Summary
**Goal:** Build “Mix Daily,” an AI & digital tools directory with a public browsing experience and an admin-managed Motoko-backed dataset, including submissions, collections, SEO, and newsletter capture.

**Planned changes:**
- Create a single-actor Motoko data model and stable persistence for Tool, Category (restricted set), Collection, ToolSubmission, and newsletter signups.
- Implement public backend queries: paginated tool listing (60/page) with total count, debounced full-text search, combined filter/sort options, and “new/popular” logic.
- Add slug-based tool detail retrieval with fields to render Overview, Key Features, Pricing Type, Use Case, Official Link, and Similar Tools.
- Implement admin-only backend APIs for tool/category/collection CRUD, featured/popularity controls, and SEO meta editor fields.
- Add Internet Identity admin authentication (frontend) with backend principal allowlist enforcing admin routes and admin API access.
- Build admin bulk CSV import with validation (required fields, allowed category/pricing, 18–25 word descriptions, uniqueness, valid official links/icon URLs) and a per-row accept/reject report.
- Seed the directory on first deploy with 1000 real, verified tools meeting the defined data rules (no placeholders/duplicates).
- Build public frontend pages: header/nav (Mix Daily text logo, menu, search, “Add Your Tool” CTA), Home sections, tools listing with cards + pagination + controls, tool detail page with breadcrumb, and About/Collections/Categories/Submit Tool pages.
- Implement “Submit Tool” public form creating pending submissions, plus an admin review UI to approve/reject (with reason) and publish approved tools.
- Add newsletter signup UI storing emails in backend and an admin export view (e.g., CSV download).
- Apply the specified UI theme (colors, Inter, spacing, rounded cards, minimal hover, no animations) and i18n-ready string structure (English only for now).
- Add disclaimer text site-wide and enforce outbound link behavior (new tab + `rel="nofollow noopener"`), plus placeholder ad slots capped at 2 per page.

**User-visible outcome:** Users can browse, search, filter, and view SEO-friendly detail pages for tools, submit new tools for review, and sign up for a newsletter; admins can sign in with Internet Identity to manage tools/categories/collections, review submissions, import tools via CSV, edit SEO fields, and export newsletter emails.
