import { z } from "zod";

export const CycleSchema = z
  .object({
    lastPeriodStart: z.preprocess(
      (arg) => {
        if (typeof arg === "string" || arg instanceof Date)
          return new Date(arg);
      },
      z.date({
        required_error: "Last period start date is required",
        invalid_type_error: "Last period start must be a valid date",
      })
    ),
    cycleLength: z.number().min(21).max(35).optional().default(28),
    periodLength: z.number().min(3).max(7).optional().default(5),
    ovulationLength: z.number().min(1).max(14).optional().default(1),
    lutealLength: z.number().min(1).max(14).optional().default(14),
    follicularLength: z.number().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    const {
      cycleLength,
      periodLength,
      ovulationLength,
      lutealLength,
      follicularLength,
    } = data;

    const used =
      periodLength + ovulationLength + lutealLength + (follicularLength ?? 0);

    if (used > cycleLength) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["follicularLength"],
        message: `The sum of phase lengths (${used}) exceeds the total cycle length (${cycleLength})`,
      });
    }
  });
