import { CalendarClock } from "lucide-react";

interface Deadline {
  name: string;
  days: number;
}

const CATEGORY_DEADLINES: Record<string, Deadline[]> = {
  consumer: [
    { name: "File Consumer Complaint", days: 30 },
    { name: "Send Legal Notice to Company", days: 15 },
    { name: "Escalate to Consumer Forum", days: 45 },
  ],
  labour: [
    { name: "File Labour Complaint", days: 15 },
    { name: "Approach Labour Commissioner", days: 30 },
    { name: "File Case in Labour Court", days: 45 },
  ],
  property: [
    { name: "Send Legal Notice", days: 30 },
    { name: "File Police Complaint", days: 7 },
    { name: "Approach Civil Court", days: 60 },
  ],
  rti: [
    { name: "File RTI Application", days: 7 },
    { name: "First Appeal if No Response", days: 30 },
    { name: "Second Appeal to Commission", days: 60 },
  ],
  family: [
    { name: "File Police Complaint", days: 7 },
    { name: "Approach Family Court", days: 30 },
    { name: "Apply for Legal Aid", days: 15 },
  ],
  criminal: [
    { name: "File FIR / Police Complaint", days: 7 },
    { name: "Obtain Legal Counsel", days: 15 },
    { name: "Court Hearing Preparation", days: 30 },
  ],
};

const DEFAULT_DEADLINES: Deadline[] = [
  { name: "Send Legal Notice", days: 30 },
  { name: "File Formal Complaint", days: 15 },
  { name: "Seek Legal Consultation", days: 7 },
];

function getColor(daysLeft: number) {
  if (daysLeft < 7) return { text: "text-destructive", bg: "bg-red-100", bar: "bg-destructive" };
  if (daysLeft <= 14) return { text: "text-amber-600", bg: "bg-amber-100", bar: "bg-amber-500" };
  return { text: "text-green-600", bg: "bg-green-100", bar: "bg-green-600" };
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const LegalDeadlineTracker = ({ category }: { category: string | null }) => {
  const deadlines = CATEGORY_DEADLINES[category?.toLowerCase() || ""] || DEFAULT_DEADLINES;
  const today = new Date();

  return (
    <div className="bg-card rounded-2xl p-5 card-shadow border-l-4 border-l-destructive">
      <h3 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
        <span>⏰</span> Your Legal Deadlines
      </h3>

      <div className="space-y-3">
        {deadlines.map((d) => {
          const dueDate = new Date(today);
          dueDate.setDate(dueDate.getDate() + d.days);
          const colors = getColor(d.days);

          return (
            <div key={d.name} className={`flex items-center gap-3 rounded-xl p-3 ${colors.bg}`}>
              <CalendarClock className={`w-5 h-5 flex-shrink-0 ${colors.text}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{d.name}</p>
                <p className="text-xs text-muted-foreground">Due: {formatDate(dueDate)}</p>
              </div>
              <div className={`text-right flex-shrink-0`}>
                <span className={`text-lg font-bold ${colors.text}`}>{d.days}</span>
                <p className={`text-xs font-medium ${colors.text}`}>days left</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-4 italic">
        ⚠️ These are recommended timeframes. Actual legal deadlines may vary — consult NALSA at 1516.
      </p>
    </div>
  );
};

export default LegalDeadlineTracker;
