import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import type { Plan } from "../data/plans";

export function PlanPage({ plans, onOpenUniversity }: { plans: Plan[]; onOpenUniversity: (universityId: string) => void }) {
  if (!plans.length) {
    return (
      <div className="rounded-md border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
        <p className="text-sm font-bold text-slate-500">Пока нет планов. Откройте вуз и нажмите «Создать план», чтобы начать отслеживать задачи.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {plans.map((plan) => {
        const approved = plan.tasks.filter((task) => task.status === "approved").length;
        const progress = plan.tasks.length ? Math.round((approved / plan.tasks.length) * 100) : 0;
        return (
          <button
            key={plan.id}
            onClick={() => onOpenUniversity(plan.universityId)}
            className="rounded-md border border-[var(--color-line)] bg-white p-4 text-left transition hover:border-[var(--color-accent)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[var(--color-ink)]">{plan.universityName}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  {plan.status === "pending_review" ? <Clock className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  {plan.status === "pending_review" ? "Ждёт утверждения ментора" : "План утверждён"}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
            </div>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-slate-100">
                <div className="h-full rounded-sm bg-[var(--color-accent)]" style={{ width: `${progress}%` }} />
              </div>
              <span className="shrink-0 text-xs font-bold text-slate-500">
                {approved}/{plan.tasks.length}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
