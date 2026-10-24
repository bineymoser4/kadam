import { useState } from "react";
import { ArrowDownToLine, ArrowUpRight, CheckCircle2, FileText } from "lucide-react";
import { pendingReviewRows, type Plan, type ReviewCategory, type ReviewRow } from "../data/plans";
import { cn } from "../lib/utils";

const filters: Array<[ReviewCategory | "all", string]> = [
  ["all", "Все"],
  ["essay", "Эссе"],
  ["documents", "Документы"],
  ["tasks", "Задачи"],
];

export function ReviewPage({
  plans,
  onReview,
}: {
  plans: Plan[];
  onReview: (planId: string, taskId: string, decision: "approved" | "needs_changes", comment: string) => void;
}) {
  const [filter, setFilter] = useState<ReviewCategory | "all">("all");
  const rows = pendingReviewRows(plans);
  const visible = filter === "all" ? rows : rows.filter((row) => row.category === filter);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-lg font-black text-[var(--color-ink)]">Проверка</p>
        <p className="mt-1 text-sm font-bold text-slate-500">Очередь всего, что ждёт твоей проверки.</p>
      </div>

      <div className="flex gap-1.5 border-b border-[var(--color-line)] pb-3">
        {filters.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cn("rounded-sm px-3 py-1.5 text-xs font-bold", filter === id ? "bg-[var(--color-ink)] text-white" : "text-slate-500 hover:bg-slate-100")}
          >
            {label}
            {id !== "all" && <span className="ml-1 text-slate-400">· {rows.filter((row) => row.category === id).length}</span>}
          </button>
        ))}
      </div>

      {!visible.length ? (
        <div className="rounded-md border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
          <CheckCircle2 className="mx-auto h-7 w-7 text-[var(--color-accent)]" />
          <p className="mt-3 text-sm font-bold text-slate-500">Всё проверено</p>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {visible.map((row) => (
            <ReviewRowCard key={`${row.planId}-${row.taskId}`} row={row} onReview={(decision, comment) => onReview(row.planId, row.taskId, decision, comment)} />
          ))}
        </div>
      )}
    </div>
  );
}

const categoryLabel: Record<ReviewCategory, string> = {
  essay: "Эссе",
  documents: "Документы",
  tasks: "Задача",
};

function ReviewRowCard({ row, onReview }: { row: ReviewRow; onReview: (decision: "approved" | "needs_changes", comment: string) => void }) {
  const [comment, setComment] = useState("");

  return (
    <div className="rounded-md border border-[var(--color-line)] bg-white p-3.5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-[var(--color-ink)]">{row.studentName}</p>
            <span className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">{categoryLabel[row.category]}</span>
          </div>
          <p className="text-xs font-bold text-slate-500">{row.universityName}</p>
          <p className="mt-1.5 text-sm font-bold text-slate-700">{row.title}</p>
          {row.evidenceText && <p className="mt-1 text-xs font-bold leading-relaxed text-slate-500">{row.evidenceText}</p>}
          {row.evidenceLink && (
            <a href={row.evidenceLink} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-accent)] underline">
              Ссылка на доказательство
              <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
          {!!row.planDocuments?.length && (
            <div className="mt-2 border-t border-[var(--color-line)] pt-2">
              <p className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-400"><FileText className="h-3.5 w-3.5" />Документы плана</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {row.planDocuments.map((document, index) => (
                  <a key={`${document.name}-${index}`} href={document.dataUrl} download={document.name} className="inline-flex max-w-full items-center gap-1 rounded-sm bg-[var(--color-sidebar)] px-2 py-1 text-[10px] font-bold text-[var(--color-mentor-accent)]">
                    <ArrowDownToLine className="h-3 w-3 shrink-0" />
                    <span className="truncate">{document.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="shrink-0 text-xs font-bold text-slate-400">{row.date}</p>
      </div>

      <div className="mt-3 space-y-2">
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Комментарий ученику (необязательно для «принять»)"
          rows={2}
          className="w-full rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--color-accent)]"
        />
        <div className="flex gap-2">
          <button onClick={() => onReview("approved", comment)} className="inline-flex items-center gap-1.5 rounded-sm bg-[var(--color-accent)] px-3.5 py-1.5 text-xs font-bold text-white">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Принять
          </button>
          <button onClick={() => onReview("needs_changes", comment)} className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--color-line)] px-3.5 py-1.5 text-xs font-bold text-slate-600">
            Вернуть на доработку
          </button>
        </div>
      </div>
    </div>
  );
}
