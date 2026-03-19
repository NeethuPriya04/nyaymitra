import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
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
      <Banner />

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

      <footer className="text-center py-4 px-4 text-xs bg-secondary text-secondary-foreground">
        Disclaimer: NyayMitra AI provides general legal information only. Always consult a qualified lawyer for specific legal advice.
      </footer>
    </div>
  );
};

export default Index;
