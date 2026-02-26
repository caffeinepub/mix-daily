import type { Tool } from '../../backend';
import ToolCard from './ToolCard';

interface SimilarToolsGridProps {
  tools: Tool[];
}

export default function SimilarToolsGrid({ tools }: SimilarToolsGridProps) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Similar Tools</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id.toString()} tool={tool} />
        ))}
      </div>
    </div>
  );
}
