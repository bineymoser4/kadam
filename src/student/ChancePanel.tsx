import { HelpCircle } from "lucide-react";
import type { ChanceResult, ChanceLevel } from "../scoring/engine";
import type { UniversityRecord } from "../university/normalize";
import { clamp } from "../shared/format";
import { cn } from "../lib/utils";

const chanceStyle: Record<ChanceLevel, string> = {
  "Высокий шанс": "border-[#bfff00]/60 bg-[#dfff45] text-[#071014]",
  "Средний шанс": "border-amber-300 bg-amber-100 text-amber-800",
  "Низкий шанс": "border-rose-300 bg-rose-100 text-rose-700",
  "Недостаточно данных": "border-slate-300 bg-slate-100 text-slate-600",
};

export function ChancePanel({ university, result, onHelp }: { university: UniversityRecord | null; result: ChanceResult; onHelp: () => void }) {
  return (
    <aside className="rounded-[30px] border border-[#cfff00]/30 bg-[#16242b] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)] xl:sticky xl:top-5 xl:self-start">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#cfff00]">Твои шансы</p>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-5xl font-black">{result.score == null ? "—" : Math.round(result.score)}</p>
          <p className="mt-1 text-sm font-bold text-slate-300">{university?.name}</p>
          {result.range && (
            <p className="mt-1 text-xs font-bold text-slate-400">
              Диапазон {Math.round(result.range[0])}–{Math.round(result.range[1])} · уверенность: {result.confidence}
              {result.missingCount > 0 ? ` · не хватает ${result.missingCount} показателей` : ""}
            </p>
          )}
        </div>
        <span className={cn("rounded-full border px-3 py-1 text-xs font-black", chanceStyle[result.level])}>{result.level}</span>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[#cfff00]" style={{ width: `${clamp(result.score ?? 0)}%` }} />
      </div>
      <div className="mt-5 grid gap-3">
        <MiniList title="Почему такой шанс?" items={result.factors} dark />
        <MiniList title="Что повысит шанс сильнее всего?" items={result.improvements.slice(0, 3)} dark />
      </div>
      <p className="mt-4 text-[11px] font-bold leading-relaxed text-slate-400">
        Модель экспертная, не гарантирует поступление. Она будет калиброваться по реальным результатам.
      </p>
      <button onClick={onHelp} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#cfff00] px-4 py-3 text-sm font-black text-[#071014]">
        <HelpCircle className="h-4 w-4" />
        Помощь
      </button>
    </aside>
  );
}

export function MiniList({ title, items, dark = false }: { title: string; items: string[]; dark?: boolean }) {
  return (
    <div>
      <p className={cn("text-xs font-black uppercase tracking-[0.18em]", dark ? "text-[#cfff00]" : "text-slate-400")}>{title}</p>
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <div key={item} className={cn("rounded-2xl p-3 text-sm font-bold leading-relaxed", dark ? "bg-white/8 text-slate-200" : "bg-slate-50 text-slate-600")}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export { chanceStyle };
