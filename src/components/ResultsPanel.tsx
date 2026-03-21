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

/** Clean AI response text that sometimes contains JSON/code artifacts */
const sanitizeResponse = (text: string): string => {
  let cleaned = text;

  // Remove JSON code fences like ```json ... ``` wrapping the whole response
  cleaned = cleaned.replace(/^```(?:json|javascript|js)?\s*\n?/gm, '');
  cleaned = cleaned.replace(/^```\s*$/gm, '');

  // If the entire response looks like a JSON object, try to extract readable content
  const trimmed = cleaned.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      // Convert JSON object values into readable markdown
      const lines: string[] = [];
      for (const [key, value] of Object.entries(parsed)) {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        if (Array.isArray(value)) {
          lines.push(`**${label}:**`);
          value.forEach((item: unknown) => {
            if (typeof item === 'object' && item !== null) {
              const obj = item as Record<string, unknown>;
              const parts = Object.values(obj).filter(v => typeof v === 'string').join(' — ');
              lines.push(`- ${parts || JSON.stringify(obj)}`);
            } else {
              lines.push(`- ${String(item)}`);
            }
          });
          lines.push('');
        } else if (typeof value === 'string') {
          lines.push(`**${label}:** ${value}\n`);
        } else if (typeof value === 'number') {
          lines.push(`**${label}:** ${value}\n`);
        }
      }
      if (lines.length > 0) return lines.join('\n');
    } catch {
      // Not valid JSON, continue with cleanup
    }
  }

  // Remove stray JSON brackets/braces that appear as formatting artifacts
  cleaned = cleaned.replace(/^\s*[\{\[]\s*$/gm, '');
  cleaned = cleaned.replace(/^\s*[\}\]]\s*,?\s*$/gm, '');
  // Remove lines that are just JSON keys like "key_name":
  cleaned = cleaned.replace(/^\s*"[a-z_]+":\s*[\[\{]?\s*$/gm, '');
  // Remove trailing commas on their own line
  cleaned = cleaned.replace(/^\s*,\s*$/gm, '');
  // Clean up excessive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
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
                {sanitizeResponse(r.response)}
              </ReactMarkdown>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResultsPanel;
