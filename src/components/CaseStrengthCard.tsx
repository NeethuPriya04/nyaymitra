import { useEffect, useState } from "react";
import type { CaseStrength } from "@/lib/openrouter";

function getColor(score: number): string {
  if (score <= 40) return "#ef4444";
  if (score <= 65) return "#f59e0b";
  if (score <= 80) return "#3b82f6";
  return "#16a34a";
}

function getVerdict(score: number) {
  if (score >= 81) return { emoji: "💪", text: "Strong Case — You Have Good Grounds", bg: "bg-green-100 text-green-800 border-green-300" };
  if (score >= 66) return { emoji: "👍", text: "Decent Case — Take Action Now", bg: "bg-blue-100 text-blue-800 border-blue-300" };
  if (score >= 41) return { emoji: "⚠️", text: "Moderate Case — Get Legal Guidance", bg: "bg-amber-100 text-amber-800 border-amber-300" };
  return { emoji: "🚨", text: "Weak Case — Consult a Lawyer Immediately", bg: "bg-red-100 text-red-800 border-red-300" };
}

const CircularGauge = ({ score }: { score: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const color = getColor(score);
  const radius = 80;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const startAngle = 135;
  const totalAngle = 270;
  const progress = (animatedScore / 100) * totalAngle;

  useEffect(() => {
    const start = performance.now();
    const duration = 1500;
    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedScore(Math.round(eased * score));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: 100 + radius * Math.cos(rad), y: 100 + radius * Math.sin(rad) };
  };

  const describeArc = (startA: number, endA: number) => {
    const start = polarToCartesian(endA);
    const end = polarToCartesian(startA);
    const largeArc = endA - startA > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <path
          d={describeArc(startAngle, startAngle + totalAngle)}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {animatedScore > 0 && (
          <path
            d={describeArc(startAngle, startAngle + progress)}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        )}
        <text x="100" y="95" textAnchor="middle" className="fill-foreground" style={{ fontSize: "42px", fontWeight: 800 }}>
          {animatedScore}
        </text>
        <text x="100" y="118" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: "16px", fontWeight: 500 }}>
          %
        </text>
      </svg>
      <p className="text-sm font-semibold text-muted-foreground -mt-4">Overall Case Strength</p>
    </div>
  );
};

const AnimatedBar = ({ label, score }: { label: string; score: number }) => {
  const [width, setWidth] = useState(0);
  const color = getColor(score);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex-1 min-w-[140px]">
      <p className="text-xs text-muted-foreground mb-1.5 font-medium">{label}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${width}%`,
              backgroundColor: color,
              transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
        <span className="text-xs font-bold min-w-[32px] text-right" style={{ color }}>{score}%</span>
      </div>
    </div>
  );
};

const CaseStrengthCard = ({ data }: { data: CaseStrength }) => {
  const verdict = getVerdict(data.overall_score);

  return (
    <div className="bg-orange-50/40 rounded-2xl p-6 card-shadow border-l-4 border-l-accent">
      <h3 className="text-base font-semibold text-primary mb-5 flex items-center gap-2">
        <span>⚡</span> Your Case Strength Analysis
      </h3>

      <CircularGauge score={data.overall_score} />

      <div className="flex flex-wrap gap-6 mt-6">
        <AnimatedBar label="Evidence Strength" score={data.evidence_score} />
        <AnimatedBar label="Legal Support" score={data.law_support_score} />
        <AnimatedBar label="Winning Probability" score={data.winning_probability} />
      </div>

      <p className="text-sm italic text-muted-foreground mt-5">
        ⚖️ {data.summary}
      </p>

      <div className="mt-4 flex justify-center">
        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border ${verdict.bg}`}>
          {verdict.emoji} {verdict.text}
        </span>
      </div>
    </div>
  );
};

export default CaseStrengthCard;
