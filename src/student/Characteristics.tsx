import type { ChanceResult, Characteristic } from "../scoring/engine";
import { chanceStyle } from "./ChancePanel";
import { clamp } from "../shared/format";
import { ReadinessBars, ReadinessRadar } from "./charts";
import { cn } from "../lib/utils";

const statusText: Record<Characteristic["status"], string> = {
  strong: "сильно",
  ok: "нормально",
  weak: "слабо",
  missing: "нет данных",
};

const statusColor: Record<Characteristic["status"], string> = {
  strong: "#1f7a53",
  ok: "#B7791F",
  weak: "#E11D48",
  missing: "#94A3B8",
};

export function Characteristics({ result }: { result: ChanceResult }) {
  const diagram = result.characteristics.map((item) => ({ label: item.short, score: Math.round(item.score ?? 0), fill: statusColor[item.status] }));
  const scored = result.characteristics.filter((item) => item.score != null);
  const strongest = scored.slice().sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0];
  const weakest = scored.slice().sort((a, b) => (a.score ?? 0) - (b.score ?? 0))[0];

  if (!result.characteristics.length) {
    return (
      <div className="rounded-md border border-[var(--color-line)] bg-white p-5">
        <p className="text-sm font-bold text-slate-500">Заполните профиль и выберите университет, чтобы увидеть характеристику.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-md border border-[var(--color-line)] bg-white p-4">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full opacity-[0.08] blur-2xl" style={{ background: "#1f7a53" }} />
          <div className="absolute -bottom-16 -left-10 h-32 w-32 rounded-full opacity-[0.08] blur-2xl" style={{ background: "#B7791F" }} />
          <div className="absolute right-20 bottom-0 h-20 w-20 rounded-full opacity-[0.06] blur-xl" style={{ background: "#E11D48" }} />
        </div>

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">индекс готовности</p>
            <p className="mt-1 text-3xl font-black text-[var(--color-ink)]">{result.score == null ? "—" : `${Math.round(result.score)}/100`}</p>
          </div>
          <span className={cn("rounded-sm px-2.5 py-1 text-xs font-bold", chanceStyle[result.level])}>{result.level}</span>
        </div>

        <div className="relative mt-2 h-[220px]">
          <ReadinessRadar data={diagram} />
        </div>

        <div className="relative grid gap-2 sm:grid-cols-2">
          <p className="rounded-sm bg-slate-50 p-2.5 text-sm font-bold text-slate-600">Сильная сторона: {strongest?.label ?? "нет данных"}</p>
          <p className="rounded-sm bg-slate-50 p-2.5 text-sm font-bold text-slate-600">Главный риск: {weakest?.label ?? "нет данных"}</p>
        </div>
      </div>

      <ReadinessBars data={diagram} />

      {result.characteristics.map((item) => (
        <div key={item.label} className="rounded-md border border-[var(--color-line)] bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[var(--color-ink)]">{item.label}</p>
              <p className="mt-1 text-sm font-bold text-slate-600">{item.problem}</p>
            </div>
            <span className="shrink-0 rounded-sm px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: `${statusColor[item.status]}1A`, color: statusColor[item.status] }}>
              {statusText[item.status]}
            </span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-sm bg-slate-100">
            <div className="h-full rounded-sm" style={{ width: `${clamp(item.score ?? 0)}%`, backgroundColor: statusColor[item.status] }} />
          </div>
          <p className="mt-2.5 text-xs font-bold leading-relaxed text-slate-500">{item.why}</p>
          <p className="mt-1.5 text-sm font-black leading-relaxed text-[var(--color-ink)]">{item.action}</p>
        </div>
      ))}
    </div>
  );
}
