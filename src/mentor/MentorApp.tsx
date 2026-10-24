import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, Users } from "lucide-react";
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
import { cn } from "../lib/utils";
import { Dashboard } from "./Dashboard";
import { MentorSideNav, MentorTabBar, MentorMobileHeader, type MentorView } from "./MentorNav";

export default function MentorApp({ onSwitchRole }: { onSwitchRole: () => void }) {
  const [tick, setTick] = useState(0);
  const [view, setView] = useState<MentorView>("dashboard");
  const [openPlanId, setOpenPlanId] = useState<string | null>(null);

  const plans = useMemo(() => getPlans().filter((plan) => plan.status !== "draft"), [tick]);
  const openPlan = plans.find((plan) => plan.id === openPlanId) ?? null;

  const refresh = () => setTick((value) => value + 1);

  const handleReset = () => {
    resetDemoData();
    setOpenPlanId(null);
    refresh();
  };

  const navigate = (next: MentorView) => {
    setOpenPlanId(null);
    setView(next);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <MentorSideNav view={view} menteeCount={plans.length} onNavigate={navigate} onReset={handleReset} onSwitchRole={onSwitchRole} />
      <MentorMobileHeader onReset={handleReset} onSwitchRole={onSwitchRole} />

      <main className="mx-auto max-w-[1000px] px-4 py-5 pb-20 lg:ml-[240px] lg:px-7 lg:pb-7">
        {openPlan ? (
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
        ) : view === "dashboard" ? (
          <Dashboard plans={plans} onOpen={setOpenPlanId} />
        ) : (
          <MenteesList plans={plans} onOpen={setOpenPlanId} />
        )}
      </main>

      <MentorTabBar view={view} onNavigate={navigate} />
    </div>
  );
}

function MenteesList({ plans, onOpen }: { plans: Plan[]; onOpen: (id: string) => void }) {
  if (!plans.length) {
    return (
      <div className="rounded-md border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
        <Users className="mx-auto h-7 w-7 text-slate-300" />
        <p className="mt-3 text-sm font-bold text-slate-500">Пока нет учеников — как только студент отправит план, он появится здесь.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2.5">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Ученики · {plans.length}</p>
      {plans.map((plan) => {
        const status: MenteeStatus = menteeStatus(plan);
        const approved = plan.tasks.filter((task) => task.status === "approved").length;
        return (
          <button
            key={plan.id}
            onClick={() => onOpen(plan.id)}
            className="flex items-center justify-between gap-4 rounded-md border border-[var(--color-line)] bg-white p-3.5 text-left transition hover:border-[var(--color-accent)]"
          >
            <div>
              <p className="text-sm font-black text-[var(--color-ink)]">{plan.studentName}</p>
              <p className="text-xs font-bold text-slate-500">{plan.universityName}</p>
              <p className="mt-1 text-xs font-bold text-slate-400">{approved} из {plan.tasks.length} задач принято</p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-sm px-2.5 py-1 text-[11px] font-bold" style={{ backgroundColor: `${menteeStatusColor[status]}1F`, color: menteeStatusColor[status] }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: menteeStatusColor[status] }} />
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
    <div className="space-y-3">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[var(--color-ink)]">
        <ArrowLeft className="h-4 w-4" />
        Все ученики
      </button>

      <div className="rounded-md border border-[var(--color-line)] bg-white p-4">
        <p className="text-lg font-black text-[var(--color-ink)]">{plan.studentName}</p>
        <p className="text-sm font-bold text-slate-500">{plan.universityName}</p>

        {plan.status === "pending_review" ? (
          <div className="mt-3 rounded-sm bg-amber-50 p-3">
            <p className="flex items-center gap-1.5 text-sm font-black text-amber-700">
              <Clock className="h-4 w-4" />
              Черновик плана ждёт утверждения
            </p>
            <p className="mt-1.5 text-xs font-bold text-amber-800/80">Проверьте задачи ниже и утвердите план — только после этого ученик видит его как активный.</p>
            <button onClick={onApprovePlan} className="mt-2.5 inline-flex items-center gap-1.5 rounded-sm bg-[var(--color-accent)] px-3.5 py-2 text-xs font-bold text-white">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Утвердить план
            </button>
          </div>
        ) : (
          <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-sm bg-[var(--color-accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--color-accent)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            План утверждён
          </p>
        )}
      </div>

      <div className="grid gap-2.5">
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
    <div className="rounded-md border border-[var(--color-line)] bg-white p-3.5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-black text-[var(--color-ink)]">{task.title}</p>
        <span className={cn("shrink-0 rounded-sm px-2 py-1 text-[10px] font-bold", statusBadge[task.status])}>{statusLabel[task.status]}</span>
      </div>

      {task.evidenceText && (
        <div className="mt-2.5 rounded-sm bg-slate-50 p-2.5">
          <p className="text-xs font-bold leading-relaxed text-slate-600">{task.evidenceText}</p>
          {task.evidenceLink && (
            <a href={task.evidenceLink} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-bold text-[var(--color-accent)] underline">
              {task.evidenceLink}
            </a>
          )}
        </div>
      )}

      {task.mentorComment && <p className="mt-2 text-xs font-bold italic text-rose-600">Ваш комментарий: {task.mentorComment}</p>}

      {needsReview && (
        <div className="mt-2.5 space-y-2">
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Комментарий ученику (необязательно для «принять»)"
            rows={2}
            className="w-full rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm font-bold text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
          />
          <div className="flex gap-2">
            <button onClick={() => onReview("approved", comment)} className="inline-flex items-center gap-1.5 rounded-sm bg-[var(--color-accent)] px-3.5 py-1.5 text-xs font-bold text-white">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Принять
            </button>
            <button onClick={() => onReview("needs_changes", comment)} className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--color-line)] px-3.5 py-1.5 text-xs font-bold text-slate-600">
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
  to_do: "bg-slate-100 text-slate-500",
  submitted: "bg-amber-100 text-amber-700",
  needs_changes: "bg-rose-100 text-rose-700",
  approved: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
};
