const agents = [
  { emoji: "🧠", name: "Intake Agent", status: "Waiting for your problem...", color: "text-gold" },
  { emoji: "⚖️", name: "Legal Research Agent", status: "Standing by...", color: "text-muted-foreground" },
  { emoji: "📝", name: "Document Drafter Agent", status: "Standing by...", color: "text-muted-foreground" },
  { emoji: "🏛️", name: "Scheme Radar Agent", status: "Standing by...", color: "text-muted-foreground" },
];

interface AgentsPanelProps {
  activeAgent?: number;
}

const AgentsPanel = ({ activeAgent = 0 }: AgentsPanelProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <span>🤖</span> AI Agents Working For You
      </h2>
      <div className="space-y-3">
        {agents.map((agent, i) => (
          <div
            key={agent.name}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              i === activeAgent ? "bg-muted" : "bg-transparent"
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-lg shrink-0">
              {agent.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{agent.name}</p>
              <p className="text-xs text-muted-foreground truncate">{agent.status}</p>
            </div>
            <div className={`w-2 h-2 rounded-full ml-auto shrink-0 ${i === activeAgent ? "bg-gold animate-pulse-gold" : "bg-muted-foreground/30"}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentsPanel;
