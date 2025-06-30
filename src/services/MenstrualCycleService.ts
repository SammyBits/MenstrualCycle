import { addDays } from "../utils/DateUtils";
import { ValidationError } from "../errors/ValidationError";
import { PHASES } from "../constants/Phases";
import type { CycleCalendar } from "../models/cycle/CycleCalendar";
import type { CycleConfig } from "../models/cycle/CycleConfig";
import type { CycleDay } from "../models/cycle/CycleDay";
import { CycleSchema } from "../schemas/CycleSchema";
/**
 * Class representing a menstrual cycle.
 * It calculates the menstrual cycle phases, next period start date, and ovulation date based on
 * the last period start date, cycle length, and period length.
 * @class
 */
export class MenstrualCycle {
  private readonly lastPeriodStart: Date;
  private readonly cycleLength: number;
  private readonly periodLength: number;
  private readonly ovulationLength: number;
  private readonly lutealLength: number;
  private readonly follicularLength: number;

  constructor(config: CycleConfig) {
    const parsedConfig = CycleSchema.parse(config);
    this.lastPeriodStart = parsedConfig.lastPeriodStart;
    this.cycleLength = parsedConfig.cycleLength;
    this.periodLength = parsedConfig.periodLength;

    this.ovulationLength = parsedConfig.ovulationLength;
    this.lutealLength = parsedConfig.lutealLength;

    this.follicularLength =
      parsedConfig.follicularLength ??
      this.cycleLength - this.lutealLength - this.ovulationLength;
  }
  /**
   * Determines the phase of the cycle based on the day of the cycle.
   * @param day Day of the cycle (1-based index).
   * @returns The phase of the cycle for the given day.
   */
  private getPhaseByDay(day: number): CycleDay["phase"] {
    if (day <= this.periodLength) return PHASES.MENSTRUATION;
    if (day <= this.follicularLength) return PHASES.FOLLICULAR;
    if (day === this.ovulationLength) return PHASES.OVULATION;
    return PHASES.LUTEAL;
  }
  /**
   * Generates a calendar for the menstrual cycle based on the last period start date, cycle length,
   * and period length.
   * @returns An object containing the cycle days, next period start date, and ovulation date
   * for the menstrual cycle.
   */
  public getCycleCalendar(): CycleCalendar {
    const days: CycleDay[] = Array.from(
      { length: this.cycleLength },
      (_, i) => {
        const dayOfCycle = i + 1;
        return {
          date: addDays(this.lastPeriodStart, i),
          phase: this.getPhaseByDay(dayOfCycle),
          dayOfCycle,
        };
      }
    );

    const nextPeriodStart = addDays(this.lastPeriodStart, this.cycleLength);
    const ovulationStartDay = this.periodLength + this.follicularLength + 1;
    const ovulationDate = addDays(this.lastPeriodStart, ovulationStartDay - 1);

    return {
      days,
      nextPeriodStart,
      ovulationDate,
    };
  }

  /**
   * Recalculates the cycle calendar with a new start date, adjusting the cycle length and period length
   * as needed.
   * @param newStartDate New start date for the menstrual cycle.
   * @returns A new cycle calendar with the adjusted cycle length and period length.
   * @throws ValidationError if newStartDate is not a valid Date object.
   */
  public recalculateWithCorrection(newStartDate: Date): CycleCalendar {
    if (!(newStartDate instanceof Date) || isNaN(newStartDate.getTime())) {
      throw new ValidationError("newStartDate must be a valid Date object");
    }
    return new MenstrualCycle({
      lastPeriodStart: newStartDate,
      cycleLength: this.cycleLength,
      periodLength: this.periodLength,
      ovulationLength: this.ovulationLength,
      lutealLength: this.lutealLength,
      follicularLength: this.follicularLength,
    }).getCycleCalendar();
  }
}
