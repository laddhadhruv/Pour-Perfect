export type BrewMethod =
  | "Pour Over"
  | "Espresso"
  | "Iced Americano"
  | "Americano"
  | "Cortado"
  | "Cappuccino"
  | "Cold Brew"
  | "French Press";

export type RoastProfile =
  | "Extremely Light"
  | "Light"
  | "Medium"
  | "Medium-Dark"
  | "Dark";

export interface BrewRecord {
  id: string;
  dateISO: string; // brew date
  roastDate: string; // roast date (mandatory)
  method: BrewMethod;
  beans: string; // required
  roaster?: string; // optional text
  dose: number; // grams
  water: number; // grams
  ratio: string; // e.g. 1:15
  roastProfile?: RoastProfile; // replaces temperature
  grind: number; // numeric with one decimal place
  timeSec: number; // seconds
  bloomAtSec?: number; // optional bloom flag time
  notes?: string;
  rating?: number; // 1-7 scale (integer). Double-click to clear
}
