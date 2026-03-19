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
        <h2 className="text-xl font-bold text-foreground mb-1">What legal problem are you facing today?</h2>
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
          className="w-full rounded-lg bg-muted border border-border p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <div className="flex items-center justify-between mt-2">
          <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-gold transition-colors">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-secondary text-secondary-foreground border border-border hover:border-gold/50 transition-colors"
          >
            <span>{s.emoji}</span>
            {s.text}
          </button>
        ))}
      </div>

      <Button
        onClick={() => onSubmit(text, category)}
        disabled={!text.trim()}
        className="w-full py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-gold-dark transition-colors disabled:opacity-40"
      >
        Find My Rights →
      </Button>
    </div>
  );
};

export default ProblemForm;
