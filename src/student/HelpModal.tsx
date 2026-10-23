import { CheckCircle2, X } from "lucide-react";
import type { ChanceResult } from "../scoring/engine";
import type { UniversityRecord } from "../university/normalize";

export function HelpModal({ result, university, onClose }: { result: ChanceResult; university: UniversityRecord | null; onClose: () => void }) {
  const blocks = [
    { title: "Сегодня", items: [`Откройте источник ${university?.name ?? "университета"}.`, "Проверьте дедлайн, экзамены и документы."] },
    { title: "7 дней", items: ["Закройте самый слабый пункт из диаграммы.", "Соберите паспорт, транскрипт, сертификаты и рекомендации."] },
    { title: "30 дней", items: ["Подтяните экзамен, который сильнее всего влияет на шанс.", "Сделайте один портфолио-проект или обновите существующее доказательство."] },
    { title: "Самый большой рост", items: result.improvements.slice(0, 3) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071014]/80 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-[#cfff00]/30 bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-[#071014]">Помощь</p>
            <p className="text-sm font-bold text-slate-500">{result.level}{result.score != null ? ` / ${Math.round(result.score)}/100` : ""}</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {blocks.map((block) => (
            <div key={block.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-[#071014]">{block.title}</p>
              <ul className="mt-2 space-y-2">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm font-bold leading-relaxed text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#89d800]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
