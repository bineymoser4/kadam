import type { StudentProfile } from "../data/profile";
import type { Scholarship } from "./data";

export type EligibilityMark = "yes" | "no" | "check";

export interface EligibilityRow {
  label: string;
  mark: EligibilityMark;
  note: string;
}

export interface EligibilityResult {
  rows: EligibilityRow[];
  summary: EligibilityMark; // "no" if any hard rule fails, else "check" (we never promise a clean "yes" without checking the source ourselves)
}

/**
 * Only citizenship and degree level are evaluated as a hard ✓/✗ — both are publicly
 * documented and binary. English score and the current cycle's deadline are always
 * "?" (нужно проверить): we don't have a verified, current-year number for them, and
 * per the no-invented-data rule they must never silently pass or fail a real check.
 */
export function evaluateEligibility(scholarship: Scholarship, profile: StudentProfile): EligibilityResult {
  const levelOk = scholarship.levels.includes(profile.level);

  const rows: EligibilityRow[] = [
    { label: "Гражданство", mark: "yes", note: "Программа открыта для заявителей из любой страны, включая Кыргызстан." },
    {
      label: "Уровень обучения",
      mark: levelOk ? "yes" : "no",
      note: levelOk ? `Подходит для уровня «${profile.level}».` : `Эта программа не покрывает уровень «${profile.level}» — ${scholarship.levels.join(", ")} доступно.`,
    },
    { label: "Английский / язык", mark: "check", note: "Точный проходной балл меняется по годам — проверьте актуальное требование на сайте программы." },
    { label: "Дедлайн этого цикла", mark: "check", note: scholarship.deadlineNote },
  ];

  const summary: EligibilityMark = rows.some((row) => row.mark === "no") ? "no" : "check";
  return { rows, summary };
}
