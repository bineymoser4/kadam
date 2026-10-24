import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { WEIGHTS } from "../scoring/config";

const weightLabels: Record<keyof typeof WEIGHTS, string> = {
  academic: "Академическая подготовка (GPA, SAT/ОРТ)",
  english: "Английский язык (IELTS/TOEFL)",
  finance: "Финансы (бюджет против стоимости)",
  portfolio: "Портфолио и доказательства",
  major: "Соответствие направлению",
  deadline: "Время до дедлайна",
  destination: "Соответствие стране",
};

export function HowWeScore() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-md border border-[var(--color-line)] bg-white">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span className="text-sm font-black text-[var(--color-ink)]">Как мы считаем индекс готовности</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="space-y-2 border-t border-[var(--color-line)] px-4 py-3">
          <p className="text-xs font-bold leading-relaxed text-slate-500">
            Каждый фактор сравнивается с ориентиром конкретного вуза и суммируется с весом ниже. Фактор без данных исключается из суммы — он не угадывается и не занижает/завышает шанс автоматически,
            а просто снижает уверенность оценки.
          </p>
          <div className="space-y-1.5">
            {(Object.keys(WEIGHTS) as Array<keyof typeof WEIGHTS>).map((key) => (
              <div key={key} className="flex items-center justify-between gap-3 text-xs font-bold">
                <span className="text-slate-600">{weightLabels[key]}</span>
                <span className="shrink-0 text-[var(--color-ink)]">{Math.round(WEIGHTS[key] * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
