import { useSeo } from '../hooks/useSeo';
import Disclaimer from '../components/legal/Disclaimer';

export default function AboutPage() {
  useSeo({
    title: 'About Mix Daily – AI & Digital Tools Directory',
    description: 'Learn more about Mix Daily and our mission to help you discover the best tools.',
  });

  return (
    <div className="bg-[oklch(0.97_0.01_280)]">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold">About Mix Daily</h1>

          <div className="space-y-6 rounded-[18px] border bg-card p-8 shadow-sm">
            <section>
              <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground">
                Mix Daily is your go-to directory for discovering the best AI and digital tools.
                We handpick and curate over 1000 tools to help creators, developers, students,
                marketers, and business owners find the perfect solutions for their needs.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold">What We Offer</h2>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>Daily updates with new tools</li>
                <li>Curated collections for specific use cases</li>
                <li>Organized categories for easy browsing</li>
                <li>Detailed tool information and pricing</li>
                <li>Direct links to official websites</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold">For Tool Creators</h2>
              <p className="text-muted-foreground">
                Have a tool you'd like to share? Submit it through our submission form and our
                team will review it for inclusion in our directory.
              </p>
            </section>
          </div>

          <div className="mt-8">
            <Disclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
