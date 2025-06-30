export type CyclePhase = "Menstruation" | "Follicular" | "Ovulation" | "Luteal";

export interface CycleDay {
  date: Date;
  phase: CyclePhase;
  dayOfCycle: number;
}
