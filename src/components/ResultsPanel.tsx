import type { AgentResult } from "@/lib/openrouter";
import ReactMarkdown from "react-markdown";
import React from "react";

const agentMeta: Record<string, { emoji: string; title: string; color: string }> = {
  intake: { emoji: "🧠", title: "Your Rights at a Glance", color: "border-l-purple-500" },
  research: { emoji: "⚖️", title: "Laws That Protect You", color: "border-l-blue-500" },
  drafter: { emoji: "📝", title: "Your Legal Documents", color: "border-l-green-500" },
  scheme: { emoji: "🏛️", title: "Government Schemes You Qualify For", color: "border-l-amber-500" },
};

/** Replace **text** with <strong>text</strong> for pre-formatted blocks */
const parseBold = (text: string): React.ReactNode[] => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const match = part.match(/^\*\*(.+)\*\*$/);
    if (match) return <strong key={i} className="font-bold text-primary">{match[1]}</strong>;
    return part;
  });
};

/** Clean AI response text that sometimes contains JSON/code artifacts */
const sanitizeResponse = (text: string): string => {
  let cleaned = text;

  // Remove "language_detected: english" or similar meta lines
  cleaned = cleaned.replace(/^\s*\**\s*language[_ ]detected\s*[:=]\s*\w+\s*\**\s*$/gim, '');
  // Remove intro fluff lines
  cleaned = cleaned.replace(/^\s*(Here'?s? (what I found|is|are)|Based on your (situation|problem|query)).*$/gim, '');

  // Remove JSON code fences
  cleaned = cleaned.replace(/^```(?:json|javascript|js)?\s*\n?/gm, '');
  cleaned = cleaned.replace(/^```\s*$/gm, '');

  // If the entire response looks like a JSON object, try to extract readable content
  const trimmed = cleaned.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      const lines: string[] = [];
      for (const [key, value] of Object.entries(parsed)) {
        if (key === 'language_detected') continue;
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
      // Not valid JSON
    }
  }

  // Remove stray JSON artifacts
  cleaned = cleaned.replace(/^\s*[\{\[]\s*$/gm, '');
  cleaned = cleaned.replace(/^\s*[\}\]]\s*,?\s*$/gm, '');
  cleaned = cleaned.replace(/^\s*"[a-z_]+":\s*[\[\{]?\s*$/gm, '');
  cleaned = cleaned.replace(/^\s*,\s*$/gm, '');
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
            <h3 className="flex items-center gap-2 mb-4 pl-2 border-l-4 border-accent"
                style={{ fontSize: '20px', fontWeight: 700, color: 'hsl(var(--primary))' }}>
              <span>{meta.emoji}</span> {meta.title}
            </h3>
            <div className="text-sm text-foreground leading-relaxed prose prose-sm max-w-none
              prose-strong:text-primary prose-strong:font-bold
              prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-1
              prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-1
              prose-li:marker:text-accent
              prose-p:mb-2
              prose-headings:text-primary prose-headings:font-semibold
              overflow-hidden max-w-full">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h4 className="flex items-center gap-2 mt-4 mb-2 pl-2 border-l-4 border-accent"
                        style={{ fontSize: '18px', fontWeight: 700, color: 'hsl(var(--primary))' }}>
                      {children}
                    </h4>
                  ),
                  h2: ({ children }) => (
                    <h4 className="flex items-center gap-2 mt-4 mb-2 pl-2 border-l-4 border-accent"
                        style={{ fontSize: '18px', fontWeight: 700, color: 'hsl(var(--primary))' }}>
                      {children}
                    </h4>
                  ),
                  h3: ({ children }) => (
                    <h4 className="flex items-center gap-2 mt-3 mb-2 pl-2 border-l-4 border-accent"
                        style={{ fontSize: '16px', fontWeight: 700, color: 'hsl(var(--primary))' }}>
                      {children}
                    </h4>
                  ),
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
                        <code className="whitespace-pre-wrap break-words max-w-full block overflow-hidden" style={{ overflowWrap: 'break-word' }}>
                          {parseBold(text)}
                        </code>
                      );
                    }
                    return (
                      <code className="bg-accent/20 text-accent px-1.5 py-0.5 rounded text-xs font-semibold" style={{ overflowWrap: 'break-word' }}>
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
