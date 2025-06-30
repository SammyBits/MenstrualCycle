import { z } from "zod";

export const CycleSchema = z.object({
  lastPeriodStart: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    },
    z.date({
      required_error: "Last period start date is required",
      invalid_type_error: "Last period start must be a valid date",
    })
  ),
  cycleLength: z.number().min(21).max(35).optional().default(28),
  periodLength: z.number().min(3).max(7).optional().default(5),
});

export type CycleSchema = z.infer<typeof CycleSchema>;
