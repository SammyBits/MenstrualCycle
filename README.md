# 📅 Menstrual Cycle Calculator

A lightweight TypeScript library for calculating menstrual cycle phases, built for integration into health-focused apps or backend systems.

Designed to help track menstrual, follicular, ovulation, and luteal phases based on user-provided cycle data.

---

## 🚀 Features

- Predicts **menstrual cycle phases** day by day
- Calculates:
  - Next period start date
  - Ovulation day
- Supports **cycle correction** if period starts earlier/later than expected
- Written in **modern TypeScript**
- Clean, test-driven and production-ready

---

## 📦 Installation

```bash
npm install menstrual-cycle
```

```bash
bun add menstrual-cycle
```

---

## 🔧 Usage

```ts
import { MenstrualCycle } from "menstrual-cycle-lib";

const cycle = new MenstrualCycle({
  lastPeriodStart: new Date("2025-06-01"),
  cycleLength: 28,
  periodLength: 5,
});

const calendar = cycle.getCycleCalendar();

console.log(calendar.days);
/*
[
  { date: 2025-06-01, phase: 'Menstruation', dayOfCycle: 1 },
  { date: 2025-06-02, phase: 'Menstruation', dayOfCycle: 2 },
  ...
  { date: 2025-06-14, phase: 'Ovulation', dayOfCycle: 14 },
  ...
]
*/

console.log(calendar.nextPeriodStart); // 2025-06-29
console.log(calendar.ovulationDate); // 2025-06-14
```

---

## 🔁 Recalculate with Correction

```ts
const updated = cycle.recalculateWithCorrection(new Date("2025-05-30"));
console.log(updated.nextPeriodStart); // 2025-06-27
```

---

## 📘 Cycle Configuration

| Field              | Type     | Description                          | Default |
| ------------------ | -------- | ------------------------------------ | ------- |
| `lastPeriodStart`  | `Date`   | Required. Start date of last period. | —       |
| `cycleLength`      | `number` | Optional. Must be between 21 and 35. | `28`    |
| `periodLength`     | `number` | Optional. Must be between 3 and 7.   | `5`     |
| `ovulationLength`  | `number` | Optional. Must be between 1 and 14.  | `1`     |
| `lutealLength`     | `number` | Optional. Must be between 1 and 14.  | `14`    |
| `follicularLength` | `number` | Optional. Must be between 1 and 14.  | —       |

---

## ❗ Validation & Errors

If invalid input is provided, the library will throw a `ZodError`. You can catch and inspect errors like this:

```ts
import { ZodError } from "zod";

try {
  new MenstrualCycle({ lastPeriodStart: new Date("invalid") });
} catch (err) {
  if (err instanceof ZodError) {
    console.error(err.errors); // Array of validation errors
  }
}
```

---

## 🧪 Testing

```bash
bun test
# or
npm run test
```
