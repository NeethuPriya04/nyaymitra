import { CheckCircle2, Loader2 } from "lucide-react";

const agents = [
  { emoji: "🧠", name: "Intake Agent" },
  { emoji: "⚖️", name: "Legal Research Agent" },
  { emoji: "📝", name: "Document Drafter Agent" },
  { emoji: "🏛️", name: "Scheme Radar Agent" },
];

const statusText = [
  "Analyzing your problem...",
  "Researching relevant laws...",
  "Drafting documents...",
  "Finding government schemes...",
];

interface AgentsPanelProps {
  activeAgent: number;
  completedAgents: number[];
  isRunning: boolean;
}

const AgentsPanel = ({ activeAgent, completedAgents, isRunning }: AgentsPanelProps) => {
  return (
    <div className="bg-[hsl(220_60%_97%)] rounded-2xl p-5 card-shadow">
      <h2 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
        <span>🤖</span> AI Agents Working For You
      </h2>
      <div className="space-y-3">
        {agents.map((agent, i) => {
          const isCompleted = completedAgents.includes(i);
          const isActive = isRunning && i === activeAgent;
          let status = "Standing by...";
          if (isCompleted) status = "Done ✓";
          else if (isActive) status = statusText[i];

          return (
            <div
              key={agent.name}
              className={`flex items-center gap-3 p-3 rounded-xl bg-background card-shadow transition-colors ${isActive ? "ring-2 ring-accent" : ""}`}
            >
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-lg shrink-0">
                {agent.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{agent.name}</p>
                <p className="text-xs text-muted-foreground truncate">{status}</p>
              </div>
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))] ml-auto shrink-0" />
              ) : isActive ? (
                <Loader2 className="w-5 h-5 text-accent ml-auto shrink-0 animate-spin" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full ml-auto shrink-0 bg-border" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentsPanel;
