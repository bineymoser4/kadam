import { AlertTriangle, CheckCircle2, Clock, Users } from "lucide-react";
import { menteeStatus, menteeStatusColor, menteeStatusLabel, type MenteeStatus, type Plan } from "../data/plans";

export function Dashboard({ plans, onOpen }: { plans: Plan[]; onOpen: (id: string) => void }) {
  const statuses = plans.map((plan) => ({ plan, status: menteeStatus(plan) }));
  const count = (status: MenteeStatus) => statuses.filter((item) => item.status === status).length;

  const stats: Array<{ label: string; value: number; icon: typeof Users; color: string }> = [
    { label: "Всего учеников", value: plans.length, icon: Users, color: "#1f7a53" },
    { label: "Ждут проверки", value: count("needs_review"), icon: Clock, color: "#B7791F" },
    { label: "Застряли", value: count("stuck"), icon: AlertTriangle, color: "#E11D48" },
    { label: "В графике", value: count("on_track"), icon: CheckCircle2, color: "#1f7a53" },
  ];

  const queue = statuses
    .filter((item) => item.status === "needs_review" || item.status === "stuck")
    .sort((a) => (a.status === "needs_review" ? -1 : 1));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-[var(--color-line)] bg-white p-3.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm" style={{ backgroundColor: `${stat.color}1A`, color: stat.color }}>
              <stat.icon className="h-4 w-4" />
            </span>
            <p className="mt-2.5 text-xl font-black text-[var(--color-ink)]">{stat.value}</p>
            <p className="text-xs font-bold text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-[var(--color-line)] bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Требуют внимания</p>
          <span className="text-xs font-bold text-slate-400">{queue.length}</span>
        </div>

        {!queue.length ? (
          <p className="mt-3 text-sm font-bold text-slate-500">Все ученики в графике — проверять пока нечего.</p>
        ) : (
          <div className="mt-3 grid gap-2">
            {queue.map(({ plan, status }) => (
              <button
                key={plan.id}
                onClick={() => onOpen(plan.id)}
                className="flex items-center justify-between gap-4 rounded-sm border border-[var(--color-line)] bg-white p-3 text-left transition hover:border-[var(--color-accent)]"
              >
                <div>
                  <p className="text-sm font-black text-[var(--color-ink)]">{plan.studentName}</p>
                  <p className="text-xs font-bold text-slate-500">{plan.universityName}</p>
                </div>
                <span
                  className="flex shrink-0 items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] font-bold"
                  style={{ backgroundColor: `${menteeStatusColor[status]}1F`, color: menteeStatusColor[status] }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: menteeStatusColor[status] }} />
                  {menteeStatusLabel[status]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
