import { useLocation } from "react-router-dom";
import type { AgentResult } from "@/lib/openrouter";
import Header from "@/components/Header";
import ResultsPanel from "@/components/ResultsPanel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = (location.state?.results as AgentResult[]) || [];

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">No results found. Please submit a query first.</p>
          <Button onClick={() => navigate("/")} className="bg-accent text-accent-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <Button onClick={() => navigate("/")} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Ask Another Question
        </Button>
        <ResultsPanel results={results} />
      </main>
      <footer className="text-center py-4 px-4 text-xs bg-secondary text-secondary-foreground">
        Disclaimer: NyayMitra AI provides general legal information only. Always consult a qualified lawyer for specific legal advice.
      </footer>
    </div>
  );
};

export default Results;
