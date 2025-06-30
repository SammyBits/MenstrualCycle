import { MenstrualCycle } from "../src/services/MenstrualCycleService";
import { ValidationError } from "../src/errors/ValidationError";
import { ZodError } from "zod";

describe("MenstrualCycle", () => {
  it("should generate a correct 28-day cycle calendar", () => {
    const cycle = new MenstrualCycle({
      lastPeriodStart: new Date("2025-06-01"),
      cycleLength: 28,
      periodLength: 5,
    });

    const calendar = cycle.getCycleCalendar();

    expect(calendar.days).toHaveLength(28);
    expect(calendar.days[0].phase).toBe("Menstruation");
    expect(calendar.days[4].phase).toBe("Menstruation");
    expect(calendar.days[5].phase).toBe("Follicular");
    expect(calendar.days[13].phase).toBe("Ovulation");
    expect(calendar.days[14].phase).toBe("Luteal");

    expect(calendar.nextPeriodStart.toISOString().slice(0, 10)).toBe(
      "2025-06-29"
    );
  });

  it("should recalculate correctly when period starts earlier", () => {
    const cycle = new MenstrualCycle({
      lastPeriodStart: new Date("2025-06-01"),
    });

    const newCalendar = cycle.recalculateWithCorrection(new Date("2025-05-30"));

    expect(newCalendar.days[0].date.toISOString().slice(0, 10)).toBe(
      "2025-05-30"
    );
    expect(newCalendar.nextPeriodStart.toISOString().slice(0, 10)).toBe(
      "2025-06-27"
    );
  });

  it("should throw error on invalid date", () => {
    expect(
      () => new MenstrualCycle({ lastPeriodStart: new Date("invalid date") })
    ).toThrow(ZodError);
  });

  it("should support a short period (3 days) with valid phases", () => {
    const cycle = new MenstrualCycle({
      lastPeriodStart: new Date("2025-06-01"),
      periodLength: 3,
    });

    const calendar = cycle.getCycleCalendar();
    expect(calendar.days[2].phase).toBe("Menstruation");
    expect(calendar.days[3].phase).toBe("Follicular");
  });

  it("should support a long cycle (35 days)", () => {
    const cycle = new MenstrualCycle({
      lastPeriodStart: new Date("2025-06-01"),
      cycleLength: 35,
    });

    const calendar = cycle.getCycleCalendar();
    expect(calendar.days).toHaveLength(35);
    expect(calendar.nextPeriodStart.toISOString().slice(0, 10)).toBe(
      "2025-07-06"
    );
  });

  it("should correctly identify ovulation around day 14", () => {
    const cycle = new MenstrualCycle({
      lastPeriodStart: new Date("2025-06-01"),
    });

    const calendar = cycle.getCycleCalendar();
    const ovulationDay = calendar.days.find((day) => day.phase === "Ovulation");

    expect(ovulationDay).toBeDefined();
    expect(ovulationDay?.dayOfCycle).toBe(14);
    expect(calendar.ovulationDate.toISOString().slice(0, 10)).toBe(
      "2025-06-14"
    );
  });

  it("should return correct calendar when date is given as a string", () => {
    const cycle = new MenstrualCycle({
      lastPeriodStart: new Date("2025-06-05T00:00:00"),
    });

    const calendar = cycle.getCycleCalendar();
    expect(calendar.days[0].date.toISOString().slice(0, 10)).toBe("2025-06-05");
  });

  it("should throw if user skips required date", () => {
    expect(() => new MenstrualCycle({} as any)).toThrow();
  });

  it("should fail gracefully if cycle length is below accepted range", () => {
    expect(
      () =>
        new MenstrualCycle({
          lastPeriodStart: new Date("2025-06-01"),
          cycleLength: 19, // < 21, invalid
        })
    ).toThrow();
  });

  it("should fail gracefully if period length is above accepted range", () => {
    expect(
      () =>
        new MenstrualCycle({
          lastPeriodStart: new Date("2025-06-01"),
          periodLength: 10, // > 7, invalid
        })
    ).toThrow();
  });
});
