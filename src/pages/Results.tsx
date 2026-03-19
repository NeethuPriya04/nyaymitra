import { useLocation, useNavigate } from "react-router-dom";
import type { AgentResult, CaseStrength } from "@/lib/openrouter";
import Header from "@/components/Header";
import ResultsPanel from "@/components/ResultsPanel";
import CaseStrengthCard from "@/components/CaseStrengthCard";
import LegalDeadlineTracker from "@/components/LegalDeadlineTracker";
import CaseSummaryReport from "@/components/CaseSummaryReport";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = (location.state?.results as AgentResult[]) || [];
  const caseStrength = (location.state?.caseStrength as CaseStrength) || null;
  const userProblem = (location.state?.userProblem as string) || "";
  const category = (location.state?.category as string) || null;

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

  // intake = first, then case strength, then research, then deadline, then drafter, then scheme
  const intakeResult = results.find((r) => r.agent === "intake");
  const researchResult = results.find((r) => r.agent === "research");
  const drafterResult = results.find((r) => r.agent === "drafter");
  const schemeResult = results.find((r) => r.agent === "scheme");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 print:hidden">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Ask Another Question
          </Button>
          <CaseSummaryReport results={results} caseStrength={caseStrength} userProblem={userProblem} />
        </div>
        <div className="mt-8 space-y-5">
          <h2 className="text-xl font-bold text-primary">📋 Your Legal Report</h2>
          {intakeResult && <ResultsPanel results={[intakeResult]} />}
          {caseStrength && <CaseStrengthCard data={caseStrength} />}
          {researchResult && <ResultsPanel results={[researchResult]} />}
          {drafterResult && <ResultsPanel results={[drafterResult]} />}
          <LegalDeadlineTracker category={category} />
          {schemeResult && <ResultsPanel results={[schemeResult]} />}
        </div>
      </main>
      <footer className="text-center py-4 px-4 text-xs bg-secondary text-secondary-foreground print:hidden">
        Disclaimer: NyayMitra AI provides general legal information only. Always consult a qualified lawyer for specific legal advice.
      </footer>
    </div>
  );
};

export default Results;
