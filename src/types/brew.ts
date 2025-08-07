export type BrewMethod =
  | "Pour Over"
  | "Espresso"
  | "French Press"
  | "AeroPress"
  | "Cold Brew";

export interface BrewRecord {
  id: string;
  dateISO: string;
  method: BrewMethod;
  beans?: string;
  dose: number; // grams
  water: number; // grams
  ratio: string; // e.g. 1:15
  temperature?: number; // C
  grind?: string;
  timeSec: number; // seconds
  notes?: string;
  rating?: number; // 1-5
}
