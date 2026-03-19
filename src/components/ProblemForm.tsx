import { useState } from "react";
import { Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryChips from "./CategoryChips";

const quickSuggestions = [
  { emoji: "💰", text: "Employer not paying salary for 2 months" },
  { emoji: "🏠", text: "Landlord refusing to return security deposit" },
  { emoji: "📋", text: "Need to file RTI about ration card" },
  { emoji: "🛒", text: "Received damaged product, company refusing refund" },
];

interface ProblemFormProps {
  onSubmit: (text: string, category: string | null) => void;
}

const ProblemForm = ({ onSubmit }: ProblemFormProps) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const maxLen = 2000;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-primary mb-1">What legal problem are you facing today?</h2>
        <p className="text-sm text-muted-foreground">
          Describe your situation in any language. Hindi, Telugu, Tamil, English — anything works.
        </p>
      </div>

      <CategoryChips selected={category} onSelect={(c) => setCategory(c === category ? null : c)} />

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxLen))}
          rows={5}
          placeholder="Example: My employer has not paid my salary for 3 months and is threatening to fire me if I complain to anyone. I have no written contract. What are my rights?"
          className="w-full rounded-2xl bg-background border border-border p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <div className="flex items-center justify-between mt-2">
          <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <Mic className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{text.length} / {maxLen}</span>
            {text && (
              <button onClick={() => setText("")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickSuggestions.map((s) => (
          <button
            key={s.text}
            onClick={() => setText(s.text)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-background text-primary border border-primary/30 hover:border-primary transition-colors"
          >
            <span>{s.emoji}</span>
            {s.text}
          </button>
        ))}
      </div>

      <Button
        onClick={() => onSubmit(text, category)}
        disabled={!text.trim()}
        className="w-full py-6 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl btn-shadow transition-all disabled:opacity-40"
      >
        Find My Rights →
      </Button>
    </div>
  );
};

export default ProblemForm;
