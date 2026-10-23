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
  strong: "#7CFF00",
  ok: "#FACC15",
  weak: "#FB7185",
  missing: "#94A3B8",
};

export function Characteristics({ result }: { result: ChanceResult }) {
  const diagram = result.characteristics.map((item) => ({ label: item.short, score: Math.round(item.score ?? 0), fill: statusColor[item.status] }));
  const scored = result.characteristics.filter((item) => item.score != null);
  const strongest = scored.slice().sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0];
  const weakest = scored.slice().sort((a, b) => (a.score ?? 0) - (b.score ?? 0))[0];

  if (!result.characteristics.length) {
    return <p className="p-5 text-sm font-bold text-slate-500">Заполните профиль и выберите университет, чтобы увидеть характеристику.</p>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-[26px] bg-[#071014] p-4 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#cfff00]">индекс готовности</p>
            <p className="mt-2 text-4xl font-black">{result.score == null ? "—" : `${Math.round(result.score)}/100`}</p>
          </div>
          <span className={cn("rounded-full border px-3 py-1 text-xs font-black", chanceStyle[result.level])}>{result.level}</span>
        </div>

        <div className="mt-3 h-[250px]">
          <ReadinessRadar data={diagram} />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <p className="rounded-2xl bg-white/8 p-3 text-sm font-bold text-slate-200">Сильная сторона: {strongest?.label ?? "нет данных"}</p>
          <p className="rounded-2xl bg-white/8 p-3 text-sm font-bold text-slate-200">Главный риск: {weakest?.label ?? "нет данных"}</p>
        </div>
      </div>

      <ReadinessBars data={diagram} />

      {result.characteristics.map((item) => (
        <div key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[#071014]">{item.label}</p>
              <p className="mt-1 text-sm font-bold text-slate-600">{item.problem}</p>
            </div>
            <span className="rounded-full px-3 py-1 text-xs font-black" style={{ backgroundColor: `${statusColor[item.status]}33`, color: item.status === "ok" ? "#92400E" : statusColor[item.status] }}>
              {statusText[item.status]}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full" style={{ width: `${clamp(item.score ?? 0)}%`, backgroundColor: statusColor[item.status] }} />
          </div>
          <p className="mt-3 text-xs font-bold leading-relaxed text-slate-500">{item.why}</p>
          <p className="mt-2 text-sm font-black leading-relaxed text-[#071014]">{item.action}</p>
        </div>
      ))}
    </div>
  );
}
