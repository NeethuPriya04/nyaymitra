import { useState, useRef, useEffect } from "react";
import { Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CategoryChips from "./CategoryChips";

const quickSuggestions = [
  { emoji: "💰", text: "Employer not paying salary for 2 months" },
  { emoji: "🏠", text: "Landlord refusing to return security deposit" },
  { emoji: "📋", text: "Need to file RTI about ration card" },
  { emoji: "🛒", text: "Received damaged product, company refusing refund" },
];

const getLangTag = (text: string): string => {
  if (/[\u0C00-\u0C7F]/.test(text)) return "te-IN";
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta-IN";
  if (/[\u0980-\u09FF]/.test(text)) return "bn-IN";
  if (/[\u0900-\u097F]/.test(text)) return "hi-IN";
  return "en-IN";
};

interface ProblemFormProps {
  onSubmit: (text: string, category: string | null) => void;
}

const ProblemForm = ({ onSubmit }: ProblemFormProps) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const maxLen = 2000;

  const stopRecording = () => {
    recognitionRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    recognitionRef.current = null;
    setIsRecording(false);
  };

  const handleMicClick = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      toast({ title: "Please use Chrome browser for voice input", variant: "destructive" });
      return;
    }

    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch {
      toast({ title: "Microphone access denied. Check browser permissions.", variant: "destructive" });
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = getLangTag(text);
    recognition.continuous = true;
    recognition.interimResults = true;

    const baseText = text;

    recognition.onresult = (event: any) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setText((baseText + " " + final + interim).trim().slice(0, maxLen));
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error);
      if (event.error !== "no-speech") {
        toast({ title: `Speech error: ${event.error}`, variant: "destructive" });
      }
      stopRecording();
    };

    recognition.onend = () => {
      stopRecording();
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  useEffect(() => {
    return () => { stopRecording(); };
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-primary mb-1">What legal problem are you facing today?</h2>
        <p className="text-sm text-muted-foreground">
          Describe your situation in any language. Hindi, Telugu, Tamil, English — anything works.
        </p>
      </div>

      <CategoryChips selected={category} onSelect={(c) => setCategory(c === category ? null : c)} />

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxLen))}
          rows={5}
          placeholder="Example: My employer has not paid my salary for 3 months and is threatening to fire me if I complain to anyone. I have no written contract. What are my rights?"
          className="w-full rounded-2xl bg-background border border-border p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={handleMicClick}
            className={`relative flex items-center gap-2 rounded-full px-3 py-1.5 transition-all ${
              isRecording
                ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40"
                : "bg-secondary text-muted-foreground hover:text-primary"
            }`}
          >
            <Mic className="w-4 h-4" />
            {isRecording && (
              <>
                <span className="text-xs font-medium">Recording... tap to stop</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-400 animate-ping" />
              </>
            )}
          </button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{text.length} / {maxLen}</span>
            {text && (
              <button onClick={() => setText("")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickSuggestions.map((s) => (
          <button
            key={s.text}
            onClick={() => setText(s.text)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-background text-primary border border-primary/30 hover:border-primary transition-colors"
          >
            <span>{s.emoji}</span>
            {s.text}
          </button>
        ))}
      </div>

      <Button
        onClick={() => onSubmit(text, category)}
        disabled={!text.trim()}
        className="w-full py-6 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl btn-shadow transition-all disabled:opacity-40"
      >
        Find My Rights →
      </Button>
    </div>
  );
};

export default ProblemForm;
