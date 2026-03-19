import { useRef } from "react";
import type { AgentResult, CaseStrength } from "@/lib/openrouter";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface CaseSummaryReportProps {
  results: AgentResult[];
  caseStrength: CaseStrength | null;
  userProblem: string;
}

function getGaugeColor(score: number) {
  if (score <= 40) return "#ef4444";
  if (score <= 70) return "#f59e0b";
  return "#16a34a";
}

function extractLaws(researchText: string) {
  const lines = researchText.split("\n").filter((l) => l.trim());
  const laws: { act: string; description: string }[] = [];
  for (const line of lines) {
    const match = line.match(/(?:Section\s+[\d\w]+.*?(?:of|,)\s+)?(.+?(?:Act|Code|Rules|Bill|Ordinance).+?\d{4})/i);
    if (match) {
      laws.push({ act: match[1].trim(), description: line.replace(/^[\s\-*•]+/, "").trim() });
    }
  }
  return laws.length > 0 ? laws.slice(0, 5) : [{ act: "Applicable Laws", description: researchText.slice(0, 200) }];
}

function extractSteps(drafterText: string) {
  const steps: string[] = [];
  const lines = drafterText.split("\n");
  for (const line of lines) {
    const match = line.match(/^\s*(?:\d+[\.\)]\s*|[-*•]\s*)/);
    if (match) {
      const cleaned = line.replace(/^\s*(?:\d+[\.\)]\s*|[-*•]\s*)/, "").replace(/\*\*/g, "").trim();
      if (cleaned.length > 5 && cleaned.length < 80) steps.push(cleaned);
    }
  }
  return steps.slice(0, 5);
}

function extractResources(schemeText: string) {
  const lines = schemeText.split("\n").filter((l) => l.trim().length > 10);
  return lines.slice(0, 5).map((l) => l.replace(/^[\s\-*•]+/, "").replace(/\*\*/g, "").trim());
}

const reportId = Math.floor(100000 + Math.random() * 900000);

const CaseSummaryReport = ({ results, caseStrength, userProblem }: CaseSummaryReportProps) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const researchResult = results.find((r) => r.agent === "research");
  const drafterResult = results.find((r) => r.agent === "drafter");
  const schemeResult = results.find((r) => r.agent === "scheme");

  const laws = researchResult ? extractLaws(researchResult.response) : [];
  const steps = drafterResult ? extractSteps(drafterResult.response) : [];
  const resources = schemeResult ? extractResources(schemeResult.response) : [];

  const score = caseStrength?.overall_score ?? 50;
  const gaugeColor = getGaugeColor(score);

  const hasRTI = drafterResult?.response.toLowerCase().includes("rti");
  const hasNotice = drafterResult?.response.toLowerCase().includes("legal notice");
  const hasComplaint = drafterResult?.response.toLowerCase().includes("complaint");

  const handlePrint = () => {
    window.print();
  };

  const radius = 70;
  const stroke = 10;
  const startAngle = 135;
  const totalAngle = 270;
  const progress = (score / 100) * totalAngle;

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: 90 + radius * Math.cos(rad), y: 90 + radius * Math.sin(rad) };
  };

  const describeArc = (startA: number, endA: number) => {
    const start = polarToCartesian(endA);
    const end = polarToCartesian(startA);
    const largeArc = endA - startA > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  const urgencyScore = caseStrength?.winning_probability ?? 50;
  const urgencyColor = getGaugeColor(urgencyScore);

  return (
    <>
      <Button onClick={handlePrint} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
        <Printer className="w-4 h-4" /> Generate Case Summary Report
      </Button>

      {/* Print-only report */}
      <div ref={reportRef} className="hidden print:block print-report">
        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            .print-report, .print-report * { visibility: visible !important; }
            .print-report {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              background: white !important;
              z-index: 99999 !important;
              padding: 24px 32px !important;
              font-family: 'Inter', sans-serif !important;
              font-size: 11px !important;
              color: #1a3c5e !important;
            }
            @page { margin: 0.5in; size: A4; }
          }
        `}</style>

        {/* SECTION 1 — Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a3c5e", margin: 0 }}>⚖️ NyayMitra AI</h1>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#1a3c5e", margin: 0 }}>Legal Rights Report</p>
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "#6b7280" }}>
            <p style={{ margin: 0 }}>Date: {new Date().toLocaleDateString("en-IN")}</p>
            <p style={{ margin: 0 }}>Report ID: #{reportId}</p>
          </div>
        </div>
        <hr style={{ border: "none", height: 3, background: "#f97316", marginBottom: 12 }} />

        {/* SECTION 2 — Problem Summary */}
        <div style={{ background: "#eff6ff", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: "#1a3c5e", margin: "0 0 4px" }}>📋 Your Situation</h2>
          <p style={{ fontSize: 10, color: "#374151", margin: 0, lineHeight: 1.5 }}>{userProblem}</p>
        </div>

        {/* SECTION 3 — Case Strength */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: "#1a3c5e", marginBottom: 4 }}>📊 Case Strength</h2>
          <svg width="140" height="140" viewBox="0 0 180 180">
            <path d={describeArc(startAngle, startAngle + totalAngle)} fill="none" stroke="#e5e7eb" strokeWidth={stroke} strokeLinecap="round" />
            <path d={describeArc(startAngle, startAngle + progress)} fill="none" stroke={gaugeColor} strokeWidth={stroke} strokeLinecap="round" />
            <text x="90" y="85" textAnchor="middle" style={{ fontSize: 32, fontWeight: 800, fill: gaugeColor }}>{score}</text>
            <text x="90" y="105" textAnchor="middle" style={{ fontSize: 12, fontWeight: 500, fill: "#6b7280" }}>%</text>
          </svg>
          <p style={{ fontWeight: 700, fontSize: 11, color: "#1a3c5e", marginTop: -8 }}>Case Strength</p>
        </div>

        {/* SECTION 4 — Laws */}
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: "#1a3c5e", marginBottom: 6 }}>⚖️ Laws That Protect You</h2>
          {laws.map((law, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, borderLeft: "3px solid #3b82f6", padding: "4px 8px", marginBottom: 4, background: "#f9fafb", borderRadius: 4 }}>
              <span style={{ background: "#f97316", color: "white", padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{law.act.slice(0, 30)}</span>
              <span style={{ fontSize: 9, color: "#374151", lineHeight: 1.4 }}>{law.description.slice(0, 120)}</span>
            </div>
          ))}
        </div>

        {/* SECTION 5 — Documents */}
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: "#1a3c5e", marginBottom: 6 }}>📝 Your Legal Documents</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ label: "RTI Application", has: hasRTI }, { label: "Legal Notice", has: hasNotice }, { label: "Complaint Letter", has: hasComplaint }].map((d) => (
              <span key={d.label} style={{ padding: "3px 10px", borderRadius: 12, fontSize: 9, fontWeight: 600, background: d.has ? "#dcfce7" : "#f3f4f6", color: d.has ? "#166534" : "#9ca3af", border: `1px solid ${d.has ? "#86efac" : "#e5e7eb"}` }}>
                {d.has ? "✅" : "—"} {d.label}
              </span>
            ))}
          </div>
        </div>

        {/* SECTION 6 — Action Timeline */}
        {steps.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: 12, fontWeight: 700, color: "#1a3c5e", marginBottom: 8 }}>🗺️ Action Timeline</h2>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
              {steps.map((step, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#1a3c5e", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, zIndex: 1 }}>{i + 1}</div>
                  {i < steps.length - 1 && <div style={{ position: "absolute", top: 12, left: "50%", width: "100%", height: 2, background: "#f97316" }} />}
                  <p style={{ fontSize: 8, textAlign: "center", color: "#374151", marginTop: 4, lineHeight: 1.3, maxWidth: 80 }}>{step.slice(0, 50)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 7 — Lawyer Urgency */}
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: "#1a3c5e", marginBottom: 4 }}>🧑‍⚖️ Lawyer Urgency</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 10, borderRadius: 6, background: "#e5e7eb", overflow: "hidden" }}>
              <div style={{ width: `${urgencyScore}%`, height: "100%", borderRadius: 6, background: urgencyColor }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: urgencyColor }}>{urgencyScore}%</span>
          </div>
        </div>

        {/* SECTION 8 — Free Legal Aid */}
        <div style={{ background: "#1a3c5e", borderRadius: 8, padding: 12, marginBottom: 12, color: "white" }}>
          <p style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>📞 NALSA 1516</p>
          <p style={{ fontSize: 9, margin: "0 0 6px", opacity: 0.8 }}>Free Legal Aid Helpline — Available 24/7</p>
          {resources.slice(0, 4).map((r, i) => (
            <p key={i} style={{ fontSize: 9, margin: "2px 0", opacity: 0.9 }}>• {r.slice(0, 100)}</p>
          ))}
        </div>

        {/* SECTION 9 — Footer */}
        <div style={{ textAlign: "center", borderTop: "1px solid #e5e7eb", paddingTop: 8 }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: "#1a3c5e", margin: 0 }}>Generated by NyayMitra AI — Free legal help for every Indian</p>
          <p style={{ fontSize: 8, color: "#9ca3af", margin: "2px 0" }}>Disclaimer: This is general legal information only. Always consult a qualified lawyer for specific legal advice.</p>
          <p style={{ fontSize: 8, color: "#6b7280", margin: 0 }}>nalsa.gov.in</p>
        </div>
      </div>
    </>
  );
};

export default CaseSummaryReport;
