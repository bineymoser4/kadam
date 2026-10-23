import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Clock, PencilLine, Send } from "lucide-react";
import type { ChanceResult } from "../scoring/engine";
import type { UniversityRecord } from "../university/normalize";
import type { Plan, Task } from "../data/plans";
import { cn } from "../lib/utils";

const statusLabel: Record<Task["status"], string> = {
  to_do: "нужно сделать",
  submitted: "на проверке у ментора",
  needs_changes: "нужно доработать",
  approved: "принято",
};

const statusColor: Record<Task["status"], string> = {
  to_do: "bg-slate-100 text-slate-600",
  submitted: "bg-amber-100 text-amber-700",
  needs_changes: "bg-rose-100 text-rose-700",
  approved: "bg-[#dfff45] text-[#071014]",
};

export function PlanTasks({
  result,
  university,
  plan,
  onCreateAndSend,
  onSubmitEvidence,
}: {
  result: ChanceResult;
  university: UniversityRecord;
  plan: Plan | undefined;
  onCreateAndSend: () => void;
  onSubmitEvidence: (taskId: string, evidence: { text: string; link: string }) => void;
}) {
  if (!plan) {
    const preview = [
      `Сегодня: откройте источник ${university.name} и проверьте дедлайны.`,
      ...result.improvements,
      "Соберите паспорт, транскрипт, сертификаты и список рекомендаций.",
      "Подготовьте черновик мотивационного письма.",
    ];
    return (
      <div className="space-y-3 p-4">
        <p className="text-sm font-bold text-slate-500">Черновик плана по твоим слабым местам — нажми «Создать план», чтобы отправить его ментору и начать отслеживать прогресс.</p>
        {Array.from(new Set(preview)).slice(0, 5).map((step, index) => (
          <div key={step} className="flex gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#071014] text-sm font-black text-[#dfff45]">{index + 1}</div>
            <p className="text-sm font-extrabold leading-relaxed text-slate-700">{step}</p>
          </div>
        ))}
        <button onClick={onCreateAndSend} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#071014] px-4 py-4 text-sm font-black uppercase tracking-wide text-[#dfff45]">
          <Send className="h-4 w-4" />
          Создать план и отправить ментору
        </button>
      </div>
    );
  }

  const approvedCount = plan.tasks.filter((task) => task.status === "approved").length;

  return (
    <div className="space-y-3 p-4">
      <div className="rounded-[24px] bg-[#071014] p-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#cfff00]">{plan.status === "pending_review" ? "черновик — ждёт ментора" : "план утверждён ментором"}</p>
            <p className="mt-1 text-lg font-black">{approvedCount} из {plan.tasks.length} задач принято</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            {plan.status === "pending_review" ? <Clock className="h-5 w-5 text-[#cfff00]" /> : <CheckCircle2 className="h-5 w-5 text-[#cfff00]" />}
          </span>
        </div>
      </div>

      {plan.tasks.map((task) => (
        <TaskRow key={task.id} task={task} university={university} onSubmit={(evidence) => onSubmitEvidence(task.id, evidence)} />
      ))}
    </div>
  );
}

function TaskRow({ task, university, onSubmit }: { task: Task; university: UniversityRecord; onSubmit: (evidence: { text: string; link: string }) => void }) {
  const [text, setText] = useState(task.evidenceText ?? "");
  const [link, setLink] = useState(task.evidenceLink ?? "");
  const canEdit = task.status === "to_do" || task.status === "needs_changes";
  const isHandoff = task.title.includes("Подать заявку");

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-black leading-relaxed text-[#071014]">{task.title}</p>
        <span className={cn("shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase", statusColor[task.status])}>{statusLabel[task.status]}</span>
      </div>

      {task.mentorComment && (
        <p className="mt-2 rounded-2xl bg-rose-50 p-3 text-xs font-bold leading-relaxed text-rose-700">Комментарий ментора: {task.mentorComment}</p>
      )}

      {isHandoff && university.officialWebsite && (
        <a href={university.officialWebsite} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#071014] px-4 py-2 text-xs font-black uppercase text-[#dfff45]">
          Открыть официальный сайт
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}

      {canEdit ? (
        <div className="mt-3 space-y-2">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Что сделано? Короткое описание результата."
            rows={2}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold outline-none focus:border-[#9cff00] focus:ring-4 focus:ring-[#cfff00]/20"
          />
          <input
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="Ссылка на доказательство (необязательно)"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold outline-none focus:border-[#9cff00] focus:ring-4 focus:ring-[#cfff00]/20"
          />
          <button
            disabled={!text.trim()}
            onClick={() => onSubmit({ text: text.trim(), link: link.trim() })}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#071014] px-4 py-2 text-xs font-black uppercase text-[#dfff45] disabled:opacity-40"
          >
            <PencilLine className="h-3.5 w-3.5" />
            Отправить на проверку
          </button>
        </div>
      ) : (
        task.evidenceText && <p className="mt-3 text-xs font-bold leading-relaxed text-slate-500">Доказательство: {task.evidenceText}</p>
      )}
    </div>
  );
}
