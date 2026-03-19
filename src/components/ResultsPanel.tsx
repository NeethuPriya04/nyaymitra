import type { AgentResult } from "@/lib/openrouter";
import ReactMarkdown from "react-markdown";
import React from "react";

const agentMeta: Record<string, { emoji: string; title: string; color: string }> = {
  intake: { emoji: "🧠", title: "Problem Analysis", color: "border-l-purple-500" },
  research: { emoji: "⚖️", title: "Your Legal Rights", color: "border-l-blue-500" },
  drafter: { emoji: "📝", title: "Action Plan & Documents", color: "border-l-green-500" },
  scheme: { emoji: "🏛️", title: "Government Schemes & Help", color: "border-l-amber-500" },
};

/** Replace **text** with <strong>text</strong> for pre-formatted blocks */
const parseBold = (text: string): React.ReactNode[] => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const match = part.match(/^\*\*(.+)\*\*$/);
    if (match) return <strong key={i} className="font-bold text-[#1a3c5e]">{match[1]}</strong>;
    return part;
  });
};

interface ResultsPanelProps {
  results: AgentResult[];
}

const ResultsPanel = ({ results }: ResultsPanelProps) => {
  if (results.length === 0) return null;

  return (
    <div className="space-y-5">
      {results.map((r) => {
        const meta = agentMeta[r.agent];
        return (
          <div
            key={r.agent}
            className={`bg-card rounded-2xl p-5 card-shadow border-l-4 ${meta.color} overflow-hidden`}
          >
            <h3 className="text-base font-semibold text-primary mb-3 flex items-center gap-2">
              <span>{meta.emoji}</span> {meta.title}
            </h3>
            <div className="text-sm text-foreground leading-relaxed prose prose-sm max-w-none
              prose-strong:text-[#1a3c5e] prose-strong:font-bold
              prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-1
              prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-1
              prose-li:marker:text-[#f59e0b]
              prose-p:mb-2
              prose-headings:text-primary prose-headings:font-semibold
              overflow-hidden max-w-full">
              <ReactMarkdown
                components={{
                  pre: ({ children }) => (
                    <pre className="whitespace-pre-wrap break-words overflow-x-hidden max-w-full bg-muted/50 rounded-lg p-4 my-3 text-xs font-mono border border-border overflow-hidden">
                      {children}
                    </pre>
                  ),
                  code: ({ children, className }) => {
                    const isBlock = className?.includes("language-");
                    if (isBlock) {
                      const text = String(children);
                      return (
                        <code className="whitespace-pre-wrap break-words overflow-wrap-anywhere max-w-full block overflow-hidden" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                          {parseBold(text)}
                        </code>
                      );
                    }
                    return (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono break-words" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                        {typeof children === 'string' ? parseBold(children) : children}
                      </code>
                    );
                  },
                }}
              >
                {r.response}
              </ReactMarkdown>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResultsPanel;
