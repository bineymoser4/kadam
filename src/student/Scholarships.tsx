import type React from "react";
import { ArrowUpRight, CheckCircle2, CircleHelp, XCircle } from "lucide-react";
import type { StudentProfile } from "../data/profile";
import { SCHOLARSHIPS } from "../scholarships/data";
import { evaluateEligibility, type EligibilityMark } from "../scholarships/eligibility";

const markIcon: Record<EligibilityMark, React.ElementType> = {
  yes: CheckCircle2,
  no: XCircle,
  check: CircleHelp,
};

const markColor: Record<EligibilityMark, string> = {
  yes: "text-[#7CFF00]",
  no: "text-rose-400",
  check: "text-amber-400",
};

export function ScholarshipsPanel({ profile }: { profile: StudentProfile }) {
  return (
    <div className="space-y-3 p-4">
      <p className="text-sm font-bold text-slate-500">
        Проверено вручную, без автоматического сбора данных. Пороги по языку и дедлайны этого цикла меняются каждый год — отмечены «нужно проверить» и не используются для подсчёта шанса.
      </p>
      {SCHOLARSHIPS.map((scholarship) => {
        const eligibility = evaluateEligibility(scholarship, profile);
        return (
          <div key={scholarship.id} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[#071014]">{scholarship.nameRu}</p>
                <p className="text-xs font-bold text-slate-500">{scholarship.provider} · {scholarship.country} · {scholarship.funding}</p>
              </div>
              <a href={scholarship.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-[#071014] px-3 py-1.5 text-[10px] font-black uppercase text-[#dfff45]">
                Источник <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
            <p className="mt-2 text-sm font-bold leading-relaxed text-slate-600">{scholarship.about}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {eligibility.rows.map((row) => {
                const Icon = markIcon[row.mark];
                return (
                  <div key={row.label} className="flex items-start gap-2 rounded-2xl bg-slate-50 p-3">
                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${markColor[row.mark]}`} />
                    <div>
                      <p className="text-xs font-black text-[#071014]">{row.label}</p>
                      <p className="text-xs font-bold leading-relaxed text-slate-500">{row.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Проверено: {scholarship.verifiedDate}</p>
          </div>
        );
      })}
    </div>
  );
}
