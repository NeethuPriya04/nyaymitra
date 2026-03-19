import type { AgentResult } from "@/lib/openrouter";

const agentMeta: Record<string, { emoji: string; title: string; color: string }> = {
  intake: { emoji: "🧠", title: "Problem Analysis", color: "border-l-purple-500" },
  research: { emoji: "⚖️", title: "Your Legal Rights", color: "border-l-blue-500" },
  drafter: { emoji: "📝", title: "Action Plan & Documents", color: "border-l-green-500" },
  scheme: { emoji: "🏛️", title: "Government Schemes & Help", color: "border-l-amber-500" },
};

interface ResultsPanelProps {
  results: AgentResult[];
}

const ResultsPanel = ({ results }: ResultsPanelProps) => {
  if (results.length === 0) return null;

  return (
    <div className="mt-8 space-y-5">
      <h2 className="text-xl font-bold text-primary">📋 Your Legal Report</h2>
      {results.map((r) => {
        const meta = agentMeta[r.agent];
        return (
          <div
            key={r.agent}
            className={`bg-card rounded-2xl p-5 card-shadow border-l-4 ${meta.color}`}
          >
            <h3 className="text-base font-semibold text-primary mb-3 flex items-center gap-2">
              <span>{meta.emoji}</span> {meta.title}
            </h3>
            <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {r.response}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResultsPanel;
