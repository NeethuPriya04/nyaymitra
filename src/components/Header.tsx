import { Globe, BookOpen } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-primary px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-xl">
            ⚖️
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary-foreground">NyayMitra AI</h1>
            <p className="text-xs text-primary-foreground/70">Your Free AI Legal Friend — Available 24/7</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
            <Globe className="w-4 h-4" />
            English
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary-foreground/10 text-sm text-accent">
            <BookOpen className="w-4 h-4" />
            Free Legal Aid: 1516
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
