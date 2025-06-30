export const PHASES = {
  MENSTRUATION: "Menstruation",
  FOLLICULAR: "Follicular",
  OVULATION: "Ovulation",
  LUTEAL: "Luteal",
} as const;

export type CyclePhase = (typeof PHASES)[keyof typeof PHASES];
