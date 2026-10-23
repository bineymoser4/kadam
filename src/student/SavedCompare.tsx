import { X } from "lucide-react";
import type { UniversityRecord } from "../university/normalize";
import type { StudentProfile } from "../data/profile";
import { chanceEngine } from "../scoring/engine";
import { money } from "../shared/format";

export function SavedList({ universities, onOpen, onRemove }: { universities: UniversityRecord[]; onOpen: (id: string) => void; onRemove: (id: string) => void }) {
  return (
    <div className="space-y-3 p-4">
      {universities.map((university) => (
        <div key={university.id} className="flex items-center justify-between gap-3 rounded-[24px] bg-slate-50 p-3">
          <button onClick={() => onOpen(university.id)} className="min-w-0 text-left">
            <p className="truncate text-sm font-black text-[#071014]">{university.name}</p>
            <p className="text-xs font-bold text-slate-500">{university.country}</p>
          </button>
          <button onClick={() => onRemove(university.id)} className="rounded-full bg-white p-2 text-slate-500">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      {!universities.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Пока нет сохранённых вузов.</p>}
    </div>
  );
}

export function Compare({ universities, profile }: { universities: UniversityRecord[]; profile: StudentProfile }) {
  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            <th className="py-3 pr-4">Вуз</th>
            <th className="py-3 pr-4">Шанс</th>
            <th className="py-3 pr-4">Стоимость</th>
            <th className="py-3 pr-4">Гранты</th>
          </tr>
        </thead>
        <tbody>
          {universities.map((university) => {
            const chance = chanceEngine(profile, university);
            return (
              <tr key={university.id} className="border-b border-slate-100">
                <td className="py-3 pr-4 font-black text-[#071014]">{university.name}</td>
                <td className="py-3 pr-4 font-bold">{chance.level}</td>
                <td className="py-3 pr-4 font-bold">{money(university.tuition)}</td>
                <td className="py-3 pr-4 font-bold">{university.scholarships[0]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!universities.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Сохраните несколько вузов, чтобы сравнить их.</p>}
    </div>
  );
}
