import { describe, expect, it } from "vitest";
import { chanceEngine } from "./engine";
import { normalizeUniversity } from "../university/normalize";
import { ALL_UNIVERSITIES } from "../constants";
import type { StudentProfile } from "../data/profile";

const auca = normalizeUniversity(ALL_UNIVERSITIES.find((item) => item.id === "auca")!);

function profile(overrides: Partial<StudentProfile> = {}): StudentProfile {
  return {
    gpa: 3.3,
    sat: 1200,
    ielts: 6.5,
    budget: 9000,
    country: "Любая",
    major: "Computer Science",
    level: "Бакалавриат",
    deadline: "6 месяцев",
    portfolio: 60,
    desiredUniversityId: "auca",
    ...overrides,
  };
}

describe("chanceEngine — no constant fallbacks", () => {
  it("never returns a score for an unselected university", () => {
    const result = chanceEngine(profile(), null);
    expect(result.score).toBeNull();
    expect(result.level).toBe("Недостаточно данных");
  });

  it("excludes a missing budget from the score instead of guessing a value", () => {
    const withBudget = chanceEngine(profile({ budget: 9000 }), auca);
    const withoutBudget = chanceEngine(profile({ budget: null }), auca);

    const financeWith = withBudget.characteristics.find((item) => item.short === "Бюджет");
    const financeWithout = withoutBudget.characteristics.find((item) => item.short === "Бюджет");

    expect(financeWith?.score).not.toBeNull();
    expect(financeWithout?.score).toBeNull();
    expect(financeWithout?.status).toBe("missing");
    expect(withoutBudget.missingCount).toBeGreaterThan(withBudget.missingCount);
  });

  it("lowers confidence, never raises the score, when inputs are missing", () => {
    const full = chanceEngine(profile(), auca);
    const partial = chanceEngine(profile({ sat: null, ielts: null, budget: null }), auca);

    expect(partial.confidence).not.toBe("высокая");
    expect(partial.score).not.toBeNull();
    // Missing data must never be filled with a constant that inflates the score.
    expect(partial.score!).toBeLessThanOrEqual(full.score! + 1);
  });

  it("flags insufficient data per student, not per a single hard gate", () => {
    const result = chanceEngine(profile({ gpa: null }), auca);
    expect(result.level).toBe("Недостаточно данных");
    expect(result.missingCount).toBeGreaterThan(0);
  });
});

describe("chanceEngine — top actions", () => {
  it("only suggests actions with a real positive gain, ranked highest first", () => {
    const weak = chanceEngine(profile({ gpa: 2.0, sat: 800, ielts: 5.0, portfolio: 10 }), auca);
    expect(weak.topActions.length).toBeGreaterThan(0);
    for (let i = 1; i < weak.topActions.length; i += 1) {
      expect(weak.topActions[i - 1].gain).toBeGreaterThanOrEqual(weak.topActions[i].gain);
    }
    weak.topActions.forEach((action) => expect(action.gain).toBeGreaterThan(0));
  });

  it("suggests nothing further once every lever is already maxed", () => {
    const strong = chanceEngine(profile({ gpa: 4.0, sat: 1600, ielts: 9, portfolio: 100 }), auca);
    expect(strong.topActions.length).toBe(0);
  });
});

describe("chanceEngine — band thresholds", () => {
  it("places a strong profile in a higher band than a weak one for the same university", () => {
    const strong = chanceEngine(profile({ gpa: 3.9, sat: 1450, ielts: 7.5, portfolio: 90 }), auca);
    const weak = chanceEngine(profile({ gpa: 2.2, sat: 850, ielts: 5.0, portfolio: 10 }), auca);
    expect(strong.score!).toBeGreaterThan(weak.score!);
  });
});
