import type { CycleDay } from "./CycleDay";

export interface CycleCalendar {
  days: CycleDay[];
  nextPeriodStart: Date;
  ovulationDate: Date;
}
