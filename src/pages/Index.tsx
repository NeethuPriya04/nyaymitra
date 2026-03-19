import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import ProblemForm from "@/components/ProblemForm";
import AgentsPanel from "@/components/AgentsPanel";
import { runAgentPipeline, type AgentResult } from "@/lib/openrouter";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeAgent, setActiveAgent] = useState(-1);
  const [completedAgents, setCompletedAgents] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleSubmit = useCallback(async (text: string, category: string | null) => {
    if (!text.trim()) return;

    setIsRunning(true);
    setActiveAgent(0);
    setCompletedAgents([]);

    toast({
      title: "Processing your query...",
      description: "Our AI agents are analyzing your situation.",
    });

    const results: AgentResult[] = [];

    await runAgentPipeline(
      text,
      category,
      (index) => setActiveAgent(index),
      (index, result) => {
        setCompletedAgents((prev) => [...prev, index]);
        results.push(result);
      },
    );

    setIsRunning(false);
    navigate("/results", { state: { results } });
  }, [toast, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Banner />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProblemForm onSubmit={handleSubmit} />
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
