import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Coffee, Thermometer, Droplets, Scale } from "lucide-react";
import { Timer } from "./Timer";
import type { BrewMethod, BrewRecord } from "@/types/brew";

const METHODS: BrewMethod[] = [
  "Pour Over",
  "Espresso",
  "French Press",
  "AeroPress",
  "Cold Brew",
];

interface BrewFormProps {
  onAdd: (brew: BrewRecord) => void;
}

export const BrewForm = ({ onAdd }: BrewFormProps) => {
  const [method, setMethod] = useState<BrewMethod>("Pour Over");
  const [beans, setBeans] = useState("");
  const [dose, setDose] = useState<number>(18);
  const [water, setWater] = useState<number>(300);
  const [temperature, setTemperature] = useState<number>(96);
  const [grind, setGrind] = useState<string>("Medium");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [seconds, setSeconds] = useState(0);

  const ratio = useMemo(() => {
    if (!dose || !water) return "1:–";
    const r = water / dose;
    return `1:${r.toFixed(1)}`;
  }, [dose, water]);

  const preset = (m: BrewMethod) => {
    setMethod(m);
    switch (m) {
      case "Espresso":
        setDose(18);
        setWater(36);
        setTemperature(93);
        setGrind("Fine");
        break;
      case "French Press":
        setDose(30);
        setWater(500);
        setTemperature(96);
        setGrind("Coarse");
        break;
      case "AeroPress":
        setDose(15);
        setWater(220);
        setTemperature(93);
        setGrind("Medium-Fine");
        break;
      case "Cold Brew":
        setDose(100);
        setWater(1000);
        setTemperature(20);
        setGrind("Coarse");
        break;
      default:
        setDose(18);
        setWater(300);
        setTemperature(96);
        setGrind("Medium");
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dose || !water) {
      toast({ title: "Missing values", description: "Please fill dose and water." });
      return;
    }
    const brew: BrewRecord = {
      id: `${Date.now()}`,
      dateISO: new Date().toISOString(),
      method,
      beans: beans.trim() || undefined,
      dose,
      water,
      ratio,
      temperature,
      grind: grind.trim() || undefined,
      timeSec: Math.round(seconds),
      notes: notes.trim() || undefined,
      rating,
    };
    onAdd(brew);
    toast({ title: "Brew saved", description: `${method} • ${ratio}` });
    setSeconds(0);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Log a Brew</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="method">Method</Label>
              <Select value={method} onValueChange={(v) => preset(v as BrewMethod)}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="beans">Beans (optional)</Label>
              <Input id="beans" placeholder="e.g. Ethiopia, Natural" value={beans} onChange={(e) => setBeans(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dose" className="flex items-center gap-2"><Scale className="size-4"/> Dose (g)</Label>
                <Input id="dose" type="number" min={0} step={0.1} value={dose} onChange={(e) => setDose(parseFloat(e.target.value) || 0)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="water" className="flex items-center gap-2"><Droplets className="size-4"/> Water (g)</Label>
                <Input id="water" type="number" min={0} step={1} value={water} onChange={(e) => setWater(parseFloat(e.target.value) || 0)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="temp" className="flex items-center gap-2"><Thermometer className="size-4"/> Temp (°C)</Label>
                <Input id="temp" type="number" min={0} max={100} step={1} value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="grind" className="flex items-center gap-2"><Coffee className="size-4"/> Grind</Label>
                <Input id="grind" placeholder="e.g. Medium" value={grind} onChange={(e) => setGrind(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Ratio</Label>
              <div className="rounded-md border bg-muted/40 px-3 py-2 font-mono">{ratio}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Timer</Label>
              <Timer seconds={seconds} onChange={setSeconds} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Taste, adjustments, etc." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input id="rating" type="number" min={1} max={5} step={1} value={rating ?? ""} onChange={(e) => setRating(e.target.value ? Math.max(1, Math.min(5, parseInt(e.target.value))) : undefined)} />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="hero" className="w-full">Save Brew</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
