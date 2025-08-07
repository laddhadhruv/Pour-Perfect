import heroImage from "@/assets/coffee-hero.jpg";
import { BrewForm } from "@/components/brew/BrewForm";
import { BrewHistory } from "@/components/brew/BrewHistory";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { BrewRecord } from "@/types/brew";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const [brews, setBrews] = useLocalStorage<BrewRecord[]>("coffee-brews", []);

  const addBrew = (brew: BrewRecord) => {
    setBrews([brew, ...brews]);
  };

  const deleteBrew = (id: string) => {
    setBrews(brews.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 pt-10">
        <section className="relative overflow-hidden rounded-2xl border bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] text-primary-foreground">
          <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
                Coffee Brew Tracker
              </h1>
              <p className="mt-3 text-base/7 opacity-90 md:text-lg">
                Log recipes, ratios, timers and tasting notes. Iterate to your perfect cup.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#log" className="inline-flex">
                  <Button variant="hero">
                    Start a Brew <ArrowRight />
                  </Button>
                </a>
                <a href="#history" className="inline-flex">
                  <Button variant="secondary">View History</Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Pour-over coffee brewing with a gooseneck kettle and ceramic mug"
                className="mx-auto w-full max-w-xl rounded-xl border shadow-[var(--shadow-glow)]"
                loading="eager"
                width={800}
                height={448}
              />
            </div>
          </div>
        </section>
      </header>

      <main className="container mx-auto px-4 py-10">
        <section id="log" className="scroll-mt-24">
          <BrewForm onAdd={addBrew} />
        </section>

        <section id="history" className="mt-10 scroll-mt-24">
          <BrewHistory brews={brews} onDelete={deleteBrew} />
        </section>
      </main>
    </div>
  );
};

export default Index;
