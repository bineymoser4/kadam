import { cn } from "../lib/utils";

export type View = "characteristics" | "plan" | "scholarships" | "saved" | "compare";

const tabs: Array<[View, string]> = [
  ["characteristics", "Диаграмма"],
  ["plan", "План"],
  ["scholarships", "Стипендии"],
  ["saved", "Сохранённые"],
  ["compare", "Сравнение"],
];

export function Tabs({ view, onView }: { view: View; onView: (view: View) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-slate-200 p-3 sm:grid-cols-5">
      {tabs.map(([id, label]) => (
        <button
          key={id}
          onClick={() => onView(id)}
          className={cn("rounded-2xl px-3 py-3 text-xs font-black transition", view === id ? "bg-[#071014] text-[#dfff45]" : "bg-slate-50 text-slate-500 hover:bg-slate-100")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
