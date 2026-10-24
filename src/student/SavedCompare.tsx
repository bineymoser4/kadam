import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { UniversityRecord } from "../university/normalize";
import type { StudentProfile } from "../data/profile";
import { chanceEngine } from "../scoring/engine";
import { money } from "../shared/format";
import { cn } from "../lib/utils";

export function SavedList({ universities, onOpen, onRemove }: { universities: UniversityRecord[]; onOpen: (id: string) => void; onRemove: (id: string) => void }) {
  if (!universities.length) {
    return (
      <div className="rounded-md border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
        <p className="text-sm font-bold text-slate-500">Пока нет сохранённых вузов — сохраняйте их в каталоге.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2.5">
      {universities.map((university) => (
        <div key={university.id} className="flex items-center justify-between gap-3 rounded-md border border-[var(--color-line)] bg-white p-3.5">
          <button onClick={() => onOpen(university.id)} className="min-w-0 text-left">
            <p className="truncate text-sm font-black text-[var(--color-ink)]">{university.name}</p>
            <p className="text-xs font-bold text-slate-500">{university.country} · {money(university.tuition)}/год</p>
          </button>
          <button onClick={() => onRemove(university.id)} className="shrink-0 rounded-sm p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

const MAX_COMPARE = 4;

export function Compare({ universities, profile }: { universities: UniversityRecord[]; profile: StudentProfile }) {
  const [selected, setSelected] = useState<string[]>(() => universities.slice(0, MAX_COMPARE).map((u) => u.id));

  useEffect(() => {
    setSelected((current) => {
      const valid = current.filter((id) => universities.some((u) => u.id === id));
      if (valid.length) return valid;
      return universities.slice(0, MAX_COMPARE).map((u) => u.id);
    });
  }, [universities]);

  if (!universities.length) {
    return (
      <div className="rounded-md border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
        <p className="text-sm font-bold text-slate-500">Сохраните несколько вузов, чтобы сравнить их.</p>
      </div>
    );
  }

  const toggle = (id: string) => {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= MAX_COMPARE) return current;
      return [...current, id];
    });
  };

  const rows = universities
    .filter((u) => selected.includes(u.id))
    .map((university) => ({ university, chance: chanceEngine(profile, university) }));

  const bestCost = rows.length ? Math.min(...rows.map((r) => r.university.tuition)) : null;
  const bestChance = rows.length ? Math.max(...rows.map((r) => r.chance.score ?? -1)) : null;

  return (
    <div className="space-y-3">
      {universities.length > MAX_COMPARE && (
        <div className="flex flex-wrap gap-1.5">
          {universities.map((university) => (
            <button
              key={university.id}
              onClick={() => toggle(university.id)}
              disabled={!selected.includes(university.id) && selected.length >= MAX_COMPARE}
              className={cn(
                "rounded-sm px-2.5 py-1 text-xs font-bold disabled:opacity-40",
                selected.includes(university.id) ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" : "bg-slate-100 text-slate-500",
              )}
            >
              {university.name}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-md border border-[var(--color-line)] bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line)] text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
              <th className="px-4 py-3">Вуз</th>
              <th className="px-4 py-3">Шанс</th>
              <th className="px-4 py-3">Стоимость</th>
              <th className="px-4 py-3">Тип</th>
              <th className="px-4 py-3">Гранты</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ university, chance }) => (
              <tr key={university.id} className="border-b border-[var(--color-line)] last:border-0">
                <td className="px-4 py-3 font-black text-[var(--color-ink)]">{university.name}</td>
                <td className={cn("px-4 py-3 font-bold", chance.score === bestChance && "bg-[var(--color-accent-soft)] text-[var(--color-accent)]")}>{chance.level}</td>
                <td className={cn("px-4 py-3 font-bold", university.tuition === bestCost && "bg-[var(--color-accent-soft)] text-[var(--color-accent)]")}>{money(university.tuition)}</td>
                <td className="px-4 py-3 font-bold text-slate-600">{typeRu[university.raw.type]}</td>
                <td className="px-4 py-3 font-bold text-slate-600">{university.scholarships[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const typeRu: Record<string, string> = {
  public: "Государственный",
  private: "Частный",
  international: "Международный",
  specialized: "Специализированный",
};
