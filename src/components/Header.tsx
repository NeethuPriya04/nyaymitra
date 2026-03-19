import { Globe, BookOpen } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚖️</span>
        <div>
          <h1 className="text-lg font-bold text-foreground">NyayMitra AI</h1>
          <p className="text-xs text-muted-foreground">Your Free AI Legal Friend — Available 24/7</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-secondary-foreground hover:bg-secondary transition-colors">
          <Globe className="w-4 h-4" />
          English
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-sm text-gold">
          <BookOpen className="w-4 h-4" />
          Free Legal Aid: 1516
        </div>
      </div>
    </header>
  );
};

export default Header;
