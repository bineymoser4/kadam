import type { ChanceResult, ChanceLevel } from "../scoring/engine";
import type { UniversityRecord } from "../university/normalize";
import { clamp } from "../shared/format";
import { cn } from "../lib/utils";

const chanceStyle: Record<ChanceLevel, string> = {
  "Высокий шанс": "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
  "Средний шанс": "bg-amber-50 text-amber-700",
  "Низкий шанс": "bg-rose-50 text-rose-700",
  "Недостаточно данных": "bg-slate-100 text-slate-600",
};

export function ChancePanel({ university, result }: { university: UniversityRecord | null; result: ChanceResult }) {
  return (
    <aside className="rounded-md border border-[var(--color-line)] bg-white p-4 xl:sticky xl:top-5 xl:self-start">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Твои шансы</p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-4xl font-black text-[var(--color-ink)]">{result.score == null ? "—" : Math.round(result.score)}</p>
          <p className="mt-1 text-sm font-bold text-slate-500">{university?.name}</p>
          {result.range && (
            <p className="mt-1 text-xs font-bold text-slate-400">
              Диапазон {Math.round(result.range[0])}–{Math.round(result.range[1])} · уверенность: {result.confidence}
              {result.missingCount > 0 ? ` · не хватает ${result.missingCount} показателей` : ""}
            </p>
          )}
        </div>
        <span className={cn("rounded-sm px-2.5 py-1 text-xs font-bold", chanceStyle[result.level])}>{result.level}</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-sm bg-slate-100">
        <div className="h-full rounded-sm bg-[var(--color-accent)]" style={{ width: `${clamp(result.score ?? 0)}%` }} />
      </div>
      <div className="mt-4 grid gap-3">
        <MiniList title="Почему такой шанс?" items={result.factors} />
        <MiniList title="Что повысит шанс сильнее всего?" items={result.improvements.slice(0, 3)} />
      </div>
      <p className="mt-4 text-[11px] font-bold leading-relaxed text-slate-400">Модель экспертная, не гарантирует поступление. Она будет калиброваться по реальным результатам.</p>
    </aside>
  );
}

export function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{title}</p>
      <div className="mt-2 space-y-1.5">
        {items.map((item) => (
          <div key={item} className="rounded-sm bg-slate-50 p-2.5 text-sm font-bold leading-relaxed text-slate-600">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export { chanceStyle };
