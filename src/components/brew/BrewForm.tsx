import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Droplets, Scale } from "lucide-react";
import { Timer } from "./Timer";
import { StarRating } from "./StarRating";
import type { BrewMethod, BrewRecord, RoastProfile } from "@/types/brew";

const METHODS: BrewMethod[] = [
  "Pour Over",
  "Espresso",
  "Iced Americano",
  "Americano",
  "Cortado",
  "Cappuccino",
  "Cold Brew",
  "French Press",
];

interface BrewFormProps {
  onAdd: (brew: BrewRecord) => void;
  brews?: BrewRecord[]; // for suggestions
}

export const BrewForm = ({ onAdd, brews = [] }: BrewFormProps) => {
  const [method, setMethod] = useState<BrewMethod>("Pour Over");
  const [beans, setBeans] = useState("");
  const [roaster, setRoaster] = useState("");
  const [dose, setDose] = useState<number>(18);
  const [water, setWater] = useState<number>(300);
  const [roastProfile, setRoastProfile] = useState<RoastProfile | undefined>("Medium");
  const [grind, setGrind] = useState<number>(5.0);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [seconds, setSeconds] = useState(0);
  const [bloomAtSec, setBloomAtSec] = useState<number | undefined>(undefined);

  const beanOptions = useMemo(() => Array.from(new Set(brews.map(b => b.beans).filter(Boolean))) as string[], [brews]);
  const roasterOptions = useMemo(() => Array.from(new Set(brews.map(b => b.roaster).filter(Boolean))) as string[], [brews]);

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
        setGrind(2.0);
        break;
      case "French Press":
        setDose(30);
        setWater(500);
        setGrind(8.0);
        break;
      case "Cold Brew":
        setDose(100);
        setWater(1000);
        setGrind(9.0);
        break;
      case "Americano":
        setDose(18);
        setWater(200);
        setGrind(2.0);
        break;
      case "Iced Americano":
        setDose(18);
        setWater(220);
        setGrind(2.0);
        break;
      case "Cortado":
        setDose(16);
        setWater(32);
        setGrind(2.0);
        break;
      case "Cappuccino":
        setDose(18);
        setWater(36);
        setGrind(2.0);
        break;
      default:
        setDose(18);
        setWater(300);
        setGrind(5.0);
    }
  };

  const handleStop = () => {
    if (!dose || !water) {
      toast({ title: "Missing values", description: "Please fill dose and water." });
      return;
    }
    if (!beans.trim()) {
      toast({ title: "Beans required", description: "Please enter the beans used." });
      return;
    }

    const brew: BrewRecord = {
      id: `${Date.now()}`,
      dateISO: new Date().toISOString(),
      method,
      beans: beans.trim(),
      roaster: roaster.trim() || undefined,
      dose,
      water,
      ratio,
      roastProfile,
      grind: Number(grind.toFixed(1)),
      timeSec: Math.round(seconds),
      bloomAtSec,
      notes: notes.trim() || undefined,
      rating,
    };

    onAdd(brew);
    toast({ title: "Brew saved", description: `${method} • ${ratio}` });
    setSeconds(0);
    setBloomAtSec(undefined);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Log a Brew</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="beans">Beans</Label>
                <Input id="beans" required list="beans-list" placeholder="e.g. Ethiopia, Natural" value={beans} onChange={(e) => setBeans(e.target.value)} />
                <datalist id="beans-list">
                  {beanOptions.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="roaster">Roaster</Label>
                <Input id="roaster" list="roaster-list" placeholder="e.g. Local Roasters" value={roaster} onChange={(e) => setRoaster(e.target.value)} />
                <datalist id="roaster-list">
                  {roasterOptions.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
              </div>
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
                <Label htmlFor="roast">Roast Profile</Label>
                <Select value={roastProfile} onValueChange={(v) => setRoastProfile(v as RoastProfile)}>
                  <SelectTrigger id="roast">
                    <SelectValue placeholder="Select roast" />
                  </SelectTrigger>
                  <SelectContent>
                    {(["Extremely Light","Light","Medium","Medium-Dark","Dark"] as RoastProfile[]).map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="grind">Grind (0-10)</Label>
                <Input id="grind" type="number" inputMode="decimal" min={0} max={10} step={0.1} value={grind} onChange={(e) => setGrind(parseFloat(e.target.value) || 0)} />
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
              <Timer seconds={seconds} onChange={setSeconds} onStop={handleStop} bloomAtSec={bloomAtSec} onBloomChange={setBloomAtSec} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Taste, adjustments, etc." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rating">Rating</Label>
              <StarRating value={rating} onChange={setRating} />
            </div>

          </div>
        </form>
      </CardContent>
    </Card>
  );
};
