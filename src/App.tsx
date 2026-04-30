import { useState } from "react";
import { Button } from "./components/ui/Button/button";

function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-surface text-ink transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-10">

        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            Aurora Practice
          </h1>
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-md text-sm border border-line text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            {isDark ? "Light mode" : "Dark mode"}
          </button>
        </header>

        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-widest text-ink-muted">
            Component sandbox
          </h2>
          <div className="p-6 rounded-lg border border-line flex gap-3 flex-wrap">
            <Button>Build me out</Button>
          </div>
        </section>

      </div>
    </div>
  );
}

export default App;
