import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, Repeat, RotateCcw, Users } from "lucide-react";
import {
  approvePlan,
  getPlans,
  menteeStatus,
  menteeStatusColor,
  menteeStatusLabel,
  resetDemoData,
  reviewEvidence,
  type MenteeStatus,
  type Plan,
  type Task,
} from "../data/plans";
import { Logo } from "../shared/fields";
import { cn } from "../lib/utils";

export default function MentorApp({ onSwitchRole }: { onSwitchRole: () => void }) {
  const [tick, setTick] = useState(0);
  const [openPlanId, setOpenPlanId] = useState<string | null>(null);

  const plans = useMemo(() => getPlans().filter((plan) => plan.status !== "draft"), [tick]);
  const openPlan = plans.find((plan) => plan.id === openPlanId) ?? null;

  const refresh = () => setTick((value) => value + 1);

  const handleReset = () => {
    resetDemoData();
    setOpenPlanId(null);
    refresh();
  };

  return (
    <div className="min-h-screen bg-[#071014] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071014]/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <p className="text-xl font-black">Kadam · Ментор</p>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#dfff45]">кабинет наставника</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleReset} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-slate-200">
              <RotateCcw className="h-3.5 w-3.5" />
              Сбросить демо
            </button>
            <button onClick={onSwitchRole} className="inline-flex items-center gap-1.5 rounded-full bg-[#cfff00] px-3 py-2 text-xs font-black text-[#071014]">
              <Repeat className="h-3.5 w-3.5" />
              Сменить роль
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-4 py-6">
        {!openPlan ? (
          <MenteesList plans={plans} onOpen={setOpenPlanId} />
        ) : (
          <ReviewQueue
            plan={openPlan}
            onBack={() => setOpenPlanId(null)}
            onApprovePlan={() => {
              approvePlan(openPlan.id);
              refresh();
            }}
            onReview={(taskId, decision, comment) => {
              reviewEvidence(openPlan.id, taskId, decision, comment);
              refresh();
            }}
          />
        )}
      </main>
    </div>
  );
}

function MenteesList({ plans, onOpen }: { plans: Plan[]; onOpen: (id: string) => void }) {
  if (!plans.length) {
    return (
      <div className="rounded-[26px] border border-white/10 bg-[#16242b] p-6 text-center">
        <Users className="mx-auto h-8 w-8 text-[#cfff00]" />
        <p className="mt-3 text-sm font-bold text-slate-300">Пока нет учеников — как только студент отправит план, он появится здесь.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#cfff00]">Ученики · {plans.length}</p>
      {plans.map((plan) => {
        const status: MenteeStatus = menteeStatus(plan);
        const approved = plan.tasks.filter((task) => task.status === "approved").length;
        return (
          <button
            key={plan.id}
            onClick={() => onOpen(plan.id)}
            className="flex items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-[#16242b] p-4 text-left transition hover:border-[#cfff00]/40"
          >
            <div>
              <p className="text-base font-black">{plan.studentName}</p>
              <p className="text-sm font-bold text-slate-400">{plan.universityName}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{approved} из {plan.tasks.length} задач принято</p>
            </div>
            <span className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black" style={{ backgroundColor: `${menteeStatusColor[status]}26`, color: menteeStatusColor[status] }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: menteeStatusColor[status] }} />
              {menteeStatusLabel[status]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ReviewQueue({
  plan,
  onBack,
  onApprovePlan,
  onReview,
}: {
  plan: Plan;
  onBack: () => void;
  onApprovePlan: () => void;
  onReview: (taskId: string, decision: "approved" | "needs_changes", comment: string) => void;
}) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-black text-slate-300">
        <ArrowLeft className="h-4 w-4" />
        Все ученики
      </button>

      <div className="rounded-[26px] border border-white/10 bg-[#16242b] p-5">
        <p className="text-xl font-black">{plan.studentName}</p>
        <p className="text-sm font-bold text-slate-400">{plan.universityName}</p>

        {plan.status === "pending_review" ? (
          <div className="mt-4 rounded-2xl bg-amber-500/15 p-4">
            <p className="flex items-center gap-2 text-sm font-black text-amber-300">
              <Clock className="h-4 w-4" />
              Черновик плана ждёт утверждения
            </p>
            <p className="mt-2 text-xs font-bold text-slate-300">Проверьте задачи ниже и утвердите план — только после этого ученик видит его как активный.</p>
            <button onClick={onApprovePlan} className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-[#cfff00] px-4 py-2.5 text-sm font-black text-[#071014]">
              <CheckCircle2 className="h-4 w-4" />
              Утвердить план
            </button>
          </div>
        ) : (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#dfff45]/15 px-3 py-1.5 text-xs font-black text-[#dfff45]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            План утверждён
          </p>
        )}
      </div>

      <div className="grid gap-3">
        {plan.tasks.map((task) => (
          <TaskReviewCard key={task.id} task={task} planApproved={plan.status === "approved"} onReview={(decision, comment) => onReview(task.id, decision, comment)} />
        ))}
      </div>
    </div>
  );
}

function TaskReviewCard({ task, planApproved, onReview }: { task: Task; planApproved: boolean; onReview: (decision: "approved" | "needs_changes", comment: string) => void }) {
  const [comment, setComment] = useState("");
  const needsReview = planApproved && task.status === "submitted";

  return (
    <div className="rounded-[22px] border border-white/10 bg-[#16242b] p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-black text-white">{task.title}</p>
        <span className={cn("shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase", statusBadge[task.status])}>{statusLabel[task.status]}</span>
      </div>

      {task.evidenceText && (
        <div className="mt-3 rounded-2xl bg-white/5 p-3">
          <p className="text-xs font-bold leading-relaxed text-slate-200">{task.evidenceText}</p>
          {task.evidenceLink && (
            <a href={task.evidenceLink} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-black text-[#cfff00] underline">
              {task.evidenceLink}
            </a>
          )}
        </div>
      )}

      {task.mentorComment && <p className="mt-2 text-xs font-bold italic text-rose-300">Ваш комментарий: {task.mentorComment}</p>}

      {needsReview && (
        <div className="mt-3 space-y-2">
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Комментарий ученику (необязательно для «принять»)"
            rows={2}
            className="w-full rounded-2xl border border-white/10 bg-[#071014] px-3 py-2 text-sm font-bold text-white outline-none focus:border-[#9cff00]"
          />
          <div className="flex gap-2">
            <button onClick={() => onReview("approved", comment)} className="inline-flex items-center gap-1.5 rounded-2xl bg-[#cfff00] px-4 py-2 text-xs font-black text-[#071014]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Принять
            </button>
            <button onClick={() => onReview("needs_changes", comment)} className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-white">
              Нужны правки
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const statusLabel: Record<Task["status"], string> = {
  to_do: "не начато",
  submitted: "на проверке",
  needs_changes: "нужны правки",
  approved: "принято",
};

const statusBadge: Record<Task["status"], string> = {
  to_do: "bg-white/10 text-slate-300",
  submitted: "bg-amber-400/20 text-amber-300",
  needs_changes: "bg-rose-400/20 text-rose-300",
  approved: "bg-[#cfff00]/20 text-[#cfff00]",
};
