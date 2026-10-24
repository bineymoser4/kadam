// Пороговые баллы ОРТ для бюджетных (грантовых) и контрактных мест.
// Подтверждено несколькими независимыми источниками для 2026-2027 учебного года
// (пороги не менялись относительно прошлого цикла на момент проверки).
// Как и остальные данные в приложении: только то, что реально подтверждено
// источником, ничего не придумано. Проверяйте точный приказ Минобрнауки КР
// перед подачей документов — пороги может скорректировать конкретный вуз.
export const ORT_THRESHOLDS = {
  year: "2026–2027",
  source: "bilim.akipress.org, kaktus.media (независимые образовательные СМИ КР)",
  sourceUrl: "https://bilim.akipress.org/ru/news:2491913",
  verifiedDate: "2026-10-24",
  subjectTestMin: 60,
} as const;

export type OrtTrackId = "general" | "pedagogical" | "medical" | "agricultural" | "military";

export interface OrtTrack {
  id: OrtTrackId;
  label: string;
  grantScore: number | null;
  contractScore: number | null;
}

export const ORT_TRACKS: OrtTrack[] = [
  { id: "general", label: "Общий конкурс", grantScore: 110, contractScore: null },
  { id: "pedagogical", label: "Педагогические направления", grantScore: 130, contractScore: 115 },
  { id: "medical", label: "Медицинские направления", grantScore: 120, contractScore: 110 },
  { id: "agricultural", label: "Сельскохозяйственные направления", grantScore: 100, contractScore: null },
  { id: "military", label: "Военное образование", grantScore: 90, contractScore: null },
];

export type BenefitCategoryId = "none" | "disability" | "orphan";

export interface BenefitCategory {
  id: BenefitCategoryId;
  label: string;
  threshold: number | null;
  note: string;
}

export const BENEFIT_CATEGORIES: BenefitCategory[] = [
  { id: "none", label: "Без льготной категории", threshold: null, note: "" },
  {
    id: "disability",
    label: "Инвалидность I или II группы",
    threshold: 90,
    note: "Порог 90 баллов на грант и контракт по основному тесту — кроме медицинских и фармацевтических специальностей.",
  },
  {
    id: "orphan",
    label: "Круглый сирота / ребёнок, оставшийся без попечения родителей",
    threshold: 90,
    note: "Порог 90 баллов на грант и контракт по основному тесту — кроме медицинских и фармацевтических специальностей.",
  },
];

export type OrtVerdict = "above" | "below" | "unknown";

export interface OrtResult {
  verdict: OrtVerdict;
  effectiveThreshold: number | null;
  track: OrtTrack;
  benefitApplied: boolean;
}

export function evaluateOrt(score: number | null, trackId: OrtTrackId, benefitId: BenefitCategoryId): OrtResult {
  const track = ORT_TRACKS.find((item) => item.id === trackId) ?? ORT_TRACKS[0];
  const benefit = BENEFIT_CATEGORIES.find((item) => item.id === benefitId);
  const benefitApplied = Boolean(benefit?.threshold);
  const effectiveThreshold = benefitApplied ? (benefit!.threshold as number) : track.grantScore;

  if (score == null || effectiveThreshold == null) {
    return { verdict: "unknown", effectiveThreshold, track, benefitApplied };
  }
  return { verdict: score >= effectiveThreshold ? "above" : "below", effectiveThreshold, track, benefitApplied };
}
