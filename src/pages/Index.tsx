import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import ApiKeyBanner from "@/components/ApiKeyBanner";
import ProblemForm from "@/components/ProblemForm";
import AgentsPanel from "@/components/AgentsPanel";

const Index = () => {
  const { toast } = useToast();

  const handleSubmit = (text: string, category: string | null) => {
    toast({
      title: "Processing your query...",
      description: `Category: ${category || "General"} — Our AI agents are analyzing your situation.`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <ApiKeyBanner />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProblemForm onSubmit={handleSubmit} />
          </div>
          <div>
            <AgentsPanel />
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-muted-foreground border-t border-border">
        Powered by Claude AI via OpenRouter
      </footer>
    </div>
  );
};

export default Index;
