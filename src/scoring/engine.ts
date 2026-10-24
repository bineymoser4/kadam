import type { StudentProfile } from "../data/profile";
import type { University } from "../constants";
import type { UniversityRecord } from "../university/normalize";
import { countryValue } from "../university/normalize";
import { clamp } from "../shared/format";
import { ACADEMIC_SUBWEIGHTS, CONFIDENCE_BANDS, LEVEL_THRESHOLDS, RANGE_MARGIN, STATUS_THRESHOLDS, WEIGHTS } from "./config";

export type ChanceLevel = "Высокий шанс" | "Средний шанс" | "Низкий шанс" | "Недостаточно данных";
export type Confidence = "высокая" | "средняя" | "низкая";
export type FactorKey = keyof typeof WEIGHTS;

export interface Characteristic {
  label: string;
  short: string;
  score: number | null;
  status: "strong" | "ok" | "weak" | "missing";
  problem: string;
  why: string;
  action: string;
}

export interface TopAction {
  label: string;
  gain: number;
  action: string;
}

export interface ChanceResult {
  score: number | null;
  range: [number, number] | null;
  level: ChanceLevel;
  confidence: Confidence;
  missingCount: number;
  factors: string[];
  improvements: string[];
  topActions: TopAction[];
  characteristics: Characteristic[];
}

/** Ratio of value to target, 0-100. Returns null (never a guessed constant) when either side is unknown. */
function ratio(value: number | null | undefined, target: number | null | undefined): number | null {
  if (value == null || !target) return null;
  return clamp((value / target) * 100);
}

function computeFactors(profile: StudentProfile, raw: University): Record<FactorKey, number | null> {
  const gpaScore = ratio(profile.gpa, raw.admissionProfile.gpa);
  const satScore = ratio(profile.sat, raw.admissionProfile.satTarget);
  const ieltsScore = ratio(profile.ielts, raw.admissionProfile.ielts || null);

  const academicParts: Array<[number, number]> = [];
  if (gpaScore != null) academicParts.push([gpaScore, ACADEMIC_SUBWEIGHTS.gpa]);
  if (satScore != null) academicParts.push([satScore, ACADEMIC_SUBWEIGHTS.sat]);
  if (ieltsScore != null) academicParts.push([ieltsScore, ACADEMIC_SUBWEIGHTS.ielts]);
  const academicWeightSum = academicParts.reduce((sum, [, weight]) => sum + weight, 0);
  const academic = academicWeightSum > 0 ? clamp(academicParts.reduce((sum, [score, weight]) => sum + score * weight, 0) / academicWeightSum) : null;

  const finance = profile.budget == null ? null : clamp((profile.budget / Math.max(raw.annualCostUsd, 1)) * 85 + (raw.fundingStrength === "high" ? 24 : raw.fundingStrength === "medium" ? 12 : 0));

  const major = profile.major
    ? raw.programs.some((program) => program.toLowerCase().includes(profile.major.toLowerCase()) || profile.major.toLowerCase().includes(program.toLowerCase()))
      ? 92
      : 60
    : null;

  const deadline = profile.deadline ? (profile.deadline === "Сейчас" ? 58 : profile.deadline === "6 месяцев" ? 78 : 92) : null;

  const wantedCountry = countryValue[profile.country] ?? profile.country;
  const destination = profile.country === "Любая" || wantedCountry === raw.country || (wantedCountry === "Kyrgyzstan" && raw.region === "KGZ") ? 92 : 68;

  return { academic, english: ieltsScore, finance, major, deadline, destination };
}

function aggregate(factors: Record<FactorKey, number | null>): { score: number | null; missingCount: number } {
  let weightSum = 0;
  let scoreSum = 0;
  let missingCount = 0;
  for (const key of Object.keys(WEIGHTS) as FactorKey[]) {
    const value = factors[key];
    if (value == null) {
      missingCount += 1;
      continue;
    }
    const weight = WEIGHTS[key];
    weightSum += weight;
    scoreSum += value * weight;
  }
  return { score: weightSum > 0 ? clamp(scoreSum / weightSum) : null, missingCount };
}

function selectivityPenaltyFor(raw: University) {
  return raw.acceptanceRate.includes("Ultra") ? 12 : raw.acceptanceRate.includes("Highly") ? 7 : 0;
}

function statusFor(score: number | null): Characteristic["status"] {
  if (score == null) return "missing";
  if (score >= STATUS_THRESHOLDS.strong) return "strong";
  if (score >= STATUS_THRESHOLDS.ok) return "ok";
  return "weak";
}

function levelFor(score: number): ChanceLevel {
  if (score >= LEVEL_THRESHOLDS.high) return "Высокий шанс";
  if (score >= LEVEL_THRESHOLDS.medium) return "Средний шанс";
  return "Низкий шанс";
}

function confidenceFor(missingCount: number): Confidence {
  if (missingCount <= CONFIDENCE_BANDS.high) return "высокая";
  if (missingCount <= CONFIDENCE_BANDS.medium) return "средняя";
  return "низкая";
}

function buildCharacteristics(factors: Record<FactorKey, number | null>): Characteristic[] {
  const fitParts = [factors.major, factors.destination].filter((value): value is number => value != null);
  const fit = fitParts.length ? clamp(fitParts.reduce((a, b) => a + b, 0) / fitParts.length) : null;

  const missingText = (what: string) => `Нет данных: заполните ${what}, чтобы учесть этот фактор.`;

  return [
    {
      label: "Академическая подготовка",
      short: "Учёба",
      score: factors.academic,
      status: statusFor(factors.academic),
      problem: factors.academic == null ? missingText("GPA, SAT или ОРТ") : factors.academic >= STATUS_THRESHOLDS.strong ? "Сильная база." : "Оценки или экзамены ниже ориентира.",
      why: "Вузу важно видеть стабильность оценок и готовность к нагрузке.",
      action: "Поднимите самый слабый компонент: GPA, SAT или ОРТ.",
    },
    {
      label: "Английский",
      short: "Язык",
      score: factors.english,
      status: statusFor(factors.english),
      problem: factors.english == null ? missingText("IELTS или TOEFL") : factors.english >= STATUS_THRESHOLDS.strong ? "Языковой риск низкий." : "IELTS/TOEFL может ограничить выбор программ.",
      why: "Английский влияет на поступление, визу, интервью и учёбу.",
      action: "Сделайте 2 writing и 2 speaking тренировки в неделю.",
    },
    {
      label: "Финансы",
      short: "Бюджет",
      score: factors.finance,
      status: statusFor(factors.finance),
      problem: factors.finance == null ? missingText("бюджет") : factors.finance >= STATUS_THRESHOLDS.strong ? "Бюджет выглядит устойчиво." : "Нужен грант или более доступный маршрут.",
      why: "Даже сильный offer не работает без финансового плана.",
      action: "Добавьте 3 high-aid вуза и подготовьте финансовые документы.",
    },
    {
      label: "Дедлайны",
      short: "Сроки",
      score: factors.deadline,
      status: statusFor(factors.deadline),
      problem: factors.deadline == null ? missingText("срок до подачи") : factors.deadline >= STATUS_THRESHOLDS.strong ? "Времени достаточно." : "Сроки могут стать главным риском.",
      why: "Документы, экзамены и эссе требуют времени.",
      action: "Составьте календарь: экзамены, документы, эссе, отправка.",
    },
    {
      label: "Соответствие вузу",
      short: "Fit",
      score: fit,
      status: statusFor(fit),
      problem: fit == null ? missingText("направление") : factors.major != null && factors.major >= STATUS_THRESHOLDS.strong ? "Направление совпадает." : "Программа не идеально совпадает с целью.",
      why: "Fit показывает, насколько профиль логичен для выбранной программы.",
      action: "Уточните направление или выберите вуз с более близкой программой.",
    },
  ];
}

function computeTopActions(profile: StudentProfile, raw: University, currentScore: number): TopAction[] {
  type Lever = { label: string; apply: (profile: StudentProfile) => StudentProfile };
  const levers: Lever[] = [];

  if (raw.admissionProfile.gpa) {
    levers.push({ label: `Поднять GPA до ${raw.admissionProfile.gpa}`, apply: (p) => ({ ...p, gpa: raw.admissionProfile.gpa }) });
  }
  if (raw.admissionProfile.satTarget) {
    const target = raw.admissionProfile.satTarget;
    levers.push({ label: `Сдать SAT/ОРТ на ${target}`, apply: (p) => ({ ...p, sat: target }) });
  }
  if (raw.admissionProfile.ielts) {
    const target = raw.admissionProfile.ielts;
    levers.push({ label: `Сдать IELTS на ${target}`, apply: (p) => ({ ...p, ielts: target }) });
  }
  const penalty = selectivityPenaltyFor(raw);
  const results: TopAction[] = [];
  for (const lever of levers) {
    const hypoFactors = computeFactors(lever.apply(profile), raw);
    const { score: hypoRaw } = aggregate(hypoFactors);
    if (hypoRaw == null) continue;
    const hypoScore = clamp(hypoRaw - penalty);
    const gain = Math.round(hypoScore - currentScore);
    if (gain > 0) results.push({ label: lever.label, gain, action: `${lever.label} → +${gain} баллов` });
  }

  return results.sort((a, b) => b.gain - a.gain).slice(0, 3);
}

function insufficientData(reason: string, missingCount: number): ChanceResult {
  return {
    score: null,
    range: null,
    level: "Недостаточно данных",
    confidence: "низкая",
    missingCount,
    factors: [reason],
    improvements: ["Добавьте GPA, направление и желаемый университет."],
    topActions: [],
    characteristics: [],
  };
}

export function chanceEngine(profile: StudentProfile, university: UniversityRecord | null): ChanceResult {
  if (!university) return insufficientData("Выберите университет, чтобы увидеть анализ.", 7);
  if (!profile.gpa || !profile.major) return insufficientData("Заполните профиль и выберите университет.", 7);

  const raw = university.raw;
  const factors = computeFactors(profile, raw);
  const { score: rawScore, missingCount } = aggregate(factors);

  if (rawScore == null) return insufficientData("Недостаточно данных для оценки этого университета.", missingCount);

  const score = clamp(rawScore - selectivityPenaltyFor(raw));
  const confidence = confidenceFor(missingCount);
  const margin = RANGE_MARGIN[confidence];
  const range: [number, number] = [clamp(score - margin), clamp(score + margin)];
  const level = levelFor(score);
  const characteristics = buildCharacteristics(factors);
  const topActions = computeTopActions(profile, raw, score);

  const factorSummaries = characteristics
    .filter((item) => item.score != null)
    .slice()
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 3)
    .map((item) => `${item.label}: ${Math.round(item.score ?? 0)}/100`);

  return {
    score,
    range,
    level,
    confidence,
    missingCount,
    factors: factorSummaries,
    improvements: topActions.length ? topActions.map((item) => item.action) : ["Проверьте дедлайны и официальный сайт перед подачей."],
    topActions,
    characteristics,
  };
}
