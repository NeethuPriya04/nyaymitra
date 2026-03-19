import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import ProblemForm from "@/components/ProblemForm";
import AgentsPanel from "@/components/AgentsPanel";
import ResultsPanel from "@/components/ResultsPanel";
import { runAgentPipeline, type AgentResult } from "@/lib/openrouter";

const Index = () => {
  const { toast } = useToast();
  const [activeAgent, setActiveAgent] = useState(-1);
  const [completedAgents, setCompletedAgents] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<AgentResult[]>([]);

  const handleSubmit = useCallback(async (text: string, category: string | null) => {
    if (!text.trim()) return;

    setIsRunning(true);
    setActiveAgent(0);
    setCompletedAgents([]);
    setResults([]);

    toast({
      title: "Processing your query...",
      description: "Our AI agents are analyzing your situation.",
    });

    await runAgentPipeline(
      text,
      category,
      (index) => setActiveAgent(index),
      (index, result) => {
        setCompletedAgents((prev) => [...prev, index]);
        setResults((prev) => [...prev, result]);
      },
    );

    setIsRunning(false);
    toast({ title: "✅ Analysis complete!", description: "Scroll down to see your legal report." });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Banner />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProblemForm onSubmit={handleSubmit} />
            <ResultsPanel results={results} />
          </div>
          <div>
            <AgentsPanel activeAgent={activeAgent} completedAgents={completedAgents} isRunning={isRunning} />
          </div>
        </div>
      </main>

      <footer className="text-center py-4 px-4 text-xs bg-secondary text-secondary-foreground">
        Disclaimer: NyayMitra AI provides general legal information only. Always consult a qualified lawyer for specific legal advice.
      </footer>
    </div>
  );
};

export default Index;
