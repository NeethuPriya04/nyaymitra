import { useState } from "react";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ApiKeyBanner = () => {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openrouter-api-key", apiKey);
      setSaved(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-6 p-5 rounded-lg bg-card border border-border gold-glow">
      <div className="flex items-center gap-2 mb-1">
        <Key className="w-4 h-4 text-gold" />
        <h3 className="text-sm font-semibold text-foreground">Enter your OpenRouter API Key</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Get your free key at{" "}
        <a href="https://openrouter.ai/" target="_blank" rel="noreferrer" className="text-gold underline">
          openrouter.ai
        </a>
      </p>
      <div className="flex gap-2">
        <Input
          value={apiKey}
          onChange={(e) => { setApiKey(e.target.value); setSaved(false); }}
          placeholder="sk-or-..."
          className="flex-1 bg-muted border-border text-foreground placeholder:text-muted-foreground"
        />
        <Button onClick={handleSave} variant={saved ? "outline" : "default"} className="bg-primary text-primary-foreground hover:bg-gold-dark">
          {saved ? "Saved ✓" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default ApiKeyBanner;
