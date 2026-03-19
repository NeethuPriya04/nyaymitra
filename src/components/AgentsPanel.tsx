import { CheckCircle2 } from "lucide-react";

const agents = [
  { emoji: "🧠", name: "Intake Agent", status: "Waiting for your problem...", active: true },
  { emoji: "⚖️", name: "Legal Research Agent", status: "Standing by...", active: false },
  { emoji: "📝", name: "Document Drafter Agent", status: "Standing by...", active: false },
  { emoji: "🏛️", name: "Scheme Radar Agent", status: "Standing by...", active: false },
];

interface AgentsPanelProps {
  activeAgent?: number;
  completedAgents?: number[];
}

const AgentsPanel = ({ activeAgent = 0, completedAgents = [] }: AgentsPanelProps) => {
  return (
    <div className="bg-[hsl(220_60%_97%)] rounded-2xl p-5 card-shadow">
      <h2 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
        <span>🤖</span> AI Agents Working For You
      </h2>
      <div className="space-y-3">
        {agents.map((agent, i) => (
          <div
            key={agent.name}
            className={`flex items-center gap-3 p-3 rounded-xl bg-background card-shadow transition-colors`}
          >
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-lg shrink-0">
              {agent.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{agent.name}</p>
              <p className="text-xs text-muted-foreground truncate">{agent.status}</p>
            </div>
            {completedAgents.includes(i) ? (
              <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))] ml-auto shrink-0" />
            ) : (
              <div className={`w-2.5 h-2.5 rounded-full ml-auto shrink-0 ${i === activeAgent ? "bg-accent animate-pulse" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentsPanel;
