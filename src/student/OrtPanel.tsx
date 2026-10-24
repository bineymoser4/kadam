import { ArrowUpRight, CheckCircle2, CircleHelp, XCircle } from "lucide-react";
import type { StudentProfile } from "../data/profile";
import { ORT_THRESHOLDS, ORT_TRACKS, BENEFIT_CATEGORIES, evaluateOrt } from "../scholarships/ortThresholds";

export function OrtPanel({ profile }: { profile: StudentProfile }) {
  const result = evaluateOrt(profile.ort, profile.ortTrack, profile.benefitCategory);

  const Icon = result.verdict === "above" ? CheckCircle2 : result.verdict === "below" ? XCircle : CircleHelp;
  const color = result.verdict === "above" ? "text-[var(--color-accent)]" : result.verdict === "below" ? "text-rose-600" : "text-amber-600";
  const bg = result.verdict === "above" ? "bg-[var(--color-accent-soft)]" : result.verdict === "below" ? "bg-rose-50" : "bg-amber-50";

  const track = ORT_TRACKS.find((t) => t.id === profile.ortTrack);
  const benefit = BENEFIT_CATEGORIES.find((b) => b.id === profile.benefitCategory);

  return (
    <div className="rounded-md border border-[var(--color-line)] bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">ОРТ и грант в Кыргызстане</p>

      <div className={`mt-3 flex items-start gap-3 rounded-sm p-3 ${bg}`}>
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} />
        <div>
          {profile.ort == null ? (
            <p className="text-sm font-bold text-slate-600">Укажите балл ОРТ в профиле, чтобы увидеть, проходите ли вы порог.</p>
          ) : result.effectiveThreshold == null ? (
            <p className="text-sm font-bold text-slate-600">Для этого направления нужно проверить порог на официальном сайте.</p>
          ) : (
            <p className="text-sm font-bold text-[var(--color-ink)]">
              Ваш балл {profile.ort} {result.verdict === "above" ? "выше" : "ниже"} порога {result.effectiveThreshold} ({track?.label}
              {result.benefitApplied ? `, льготная категория: ${benefit?.label}` : ""}).
            </p>
          )}
          <p className="mt-1 text-xs font-bold leading-relaxed text-slate-500">
            Минимум по предметному тесту — {ORT_THRESHOLDS.subjectTestMin} баллов. Пороги на {ORT_THRESHOLDS.year} учебный год, подтверждены независимыми источниками — уточните точный приказ
            Минобрнауки КР перед подачей.
          </p>
        </div>
      </div>

      <a
        href="https://kesiptanda.edu.gov.kg/ru/articles/4/"
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-accent)]"
      >
        Источник: {ORT_THRESHOLDS.source}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
