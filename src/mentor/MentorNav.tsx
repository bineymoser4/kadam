import { useState } from "react";
import { ClipboardCheck, LayoutDashboard, MoreHorizontal, RotateCcw, Users, UserRound } from "lucide-react";
import { allUniversityRecords } from "../university/normalize";
import { menteeStatus, type Plan } from "../data/plans";
import { mentorInitials } from "../data/mentorProfile";
import { cn } from "../lib/utils";
import { ThemeToggle } from "../shared/fields";

export type MentorView = "dashboard" | "mentees" | "review" | "profile";

const items: Array<{ label: string; icon: typeof Users; view: MentorView }> = [
  { label: "Дашборд", icon: LayoutDashboard, view: "dashboard" },
  { label: "Ученики", icon: Users, view: "mentees" },
  { label: "Проверка", icon: ClipboardCheck, view: "review" },
  { label: "Профиль", icon: UserRound, view: "profile" },
];

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="ml-auto flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-sm bg-[var(--color-mentor-accent)] px-1 text-[10px] font-black text-[var(--color-mentor-bg)]">
      {count}
    </span>
  );
}

function TodayBlock({ plans, onViewAttention }: { plans: Plan[]; onViewAttention: () => void }) {
  const upcoming = plans
    .map((plan) => ({ plan, uni: allUniversityRecords.find((u) => u.id === plan.universityId) }))
    .filter((item) => item.uni?.deadlines.length)
    .slice(0, 3);

  const attentionCount = plans.filter((plan) => {
    const status = menteeStatus(plan);
    return status === "needs_review" || status === "stuck";
  }).length;

  return (
    <div className="rounded-md border border-white/10 bg-[var(--color-mentor-panel)] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Сегодня</p>
      {!upcoming.length ? (
        <p className="mt-2 text-xs font-bold text-white/50">Дедлайнов пока нет.</p>
      ) : (
        <div className="mt-2 space-y-1.5">
          {upcoming.map(({ plan, uni }) => (
            <div key={plan.id} className="rounded-sm bg-white/5 px-2 py-1.5">
              <p className="truncate text-xs font-bold text-white/85">{plan.studentName}</p>
              <p className="truncate text-[10px] font-bold text-white/45">{uni?.deadlines[0]}</p>
            </div>
          ))}
        </div>
      )}
      <button onClick={onViewAttention} className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-mentor-accent)] hover:underline">
        Требуют внимания: {attentionCount}
      </button>
    </div>
  );
}

function AccountMenu({ onReset, onSwitchRole, darkTheme, onToggleTheme, direction = "up" }: { onReset: () => void; onSwitchRole: () => void; darkTheme: boolean; onToggleTheme: () => void; direction?: "up" | "down" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="rounded-sm p-1.5 text-white/50 hover:bg-white/5 hover:text-white" aria-label="Меню аккаунта">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "absolute right-0 z-20 w-44 rounded-md border border-white/10 bg-[var(--color-mentor-panel)] p-1 shadow-lg",
              direction === "up" ? "bottom-full mb-1.5" : "top-full mt-1.5",
            )}
          >
            <div className="flex items-center justify-between px-2.5 py-2 text-xs font-bold text-white/75">
              Тема
              <ThemeToggle dark={darkTheme} onToggle={onToggleTheme} />
            </div>
            <button
              onClick={() => {
                setOpen(false);
                onReset();
              }}
              className="flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-left text-xs font-bold text-white/75 hover:bg-white/5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Сбросить демо
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onSwitchRole();
              }}
              className="flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-left text-xs font-bold text-white/75 hover:bg-white/5"
            >
              Сменить роль
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function MentorSideNav({
  view,
  plans,
  reviewCount,
  mentorName,
  onNavigate,
  onReset,
  onSwitchRole,
  darkTheme,
  onToggleTheme,
}: {
  view: MentorView;
  plans: Plan[];
  reviewCount: number;
  mentorName: string;
  onNavigate: (view: MentorView) => void;
  onReset: () => void;
  onSwitchRole: () => void;
  darkTheme: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col border-r border-white/10 bg-[var(--color-mentor-bg)] p-4 text-white lg:flex">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-mentor-accent)]">
          <span className="text-sm font-black text-[var(--color-mentor-bg)]">Q</span>
        </div>
        <div>
          <p className="text-lg font-black tracking-tight">Qadam</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">наставник</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2.5 rounded-md border border-white/10 bg-[var(--color-mentor-panel)] p-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-mentor-accent)] text-xs font-black text-[var(--color-mentor-bg)]">
          {mentorInitials(mentorName)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black">{mentorName}</p>
          <p className="truncate text-[10px] font-bold text-white/45">Ментор · {plans.length} учеников</p>
        </div>
      </div>

      <p className="mb-1.5 mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Меню</p>
      <nav className="space-y-1">
        {items.map((item) => {
          const active = view === item.view;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-bold transition",
                active ? "bg-[var(--color-mentor-accent)] text-[var(--color-mentor-bg)]" : "text-white/55 hover:bg-white/5 hover:text-white/90",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
              {item.view === "review" && !active && <Badge count={reviewCount} />}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
        <TodayBlock plans={plans} onViewAttention={() => onNavigate("dashboard")} />
      </div>

      <div className="mt-3 flex items-center justify-between rounded-md border border-white/10 bg-[var(--color-mentor-panel)] px-2.5 py-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/40">Аккаунт</p>
        <AccountMenu onReset={onReset} onSwitchRole={onSwitchRole} darkTheme={darkTheme} onToggleTheme={onToggleTheme} />
      </div>
    </aside>
  );
}

export function MentorTabBar({ view, reviewCount, onNavigate }: { view: MentorView; reviewCount: number; onNavigate: (view: MentorView) => void }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-[var(--color-mentor-bg)] px-1 pt-1.5 lg:hidden"
      style={{ paddingBottom: "max(6px, env(safe-area-inset-bottom))" }}
    >
      {items.map((item) => {
        const active = view === item.view;
        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.view)}
            className={cn("relative flex flex-1 flex-col items-center gap-0.5 rounded-sm py-1.5 text-[10px] font-bold", active ? "text-[var(--color-mentor-accent)]" : "text-white/40")}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
            {item.view === "review" && reviewCount > 0 && (
              <span className="absolute right-[22%] top-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-sm bg-[var(--color-mentor-accent)] px-0.5 text-[9px] font-black text-[var(--color-mentor-bg)]">
                {reviewCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

export function MentorMobileHeader({ onReset, onSwitchRole, darkTheme, onToggleTheme }: { onReset: () => void; onSwitchRole: () => void; darkTheme: boolean; onToggleTheme: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[var(--color-mentor-bg)] px-4 py-2.5 text-white lg:hidden">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-mentor-accent)]">
          <span className="text-xs font-black text-[var(--color-mentor-bg)]">Q</span>
        </div>
        <p className="text-base font-black">Qadam · Ментор</p>
      </div>
      <AccountMenu onReset={onReset} onSwitchRole={onSwitchRole} darkTheme={darkTheme} onToggleTheme={onToggleTheme} direction="down" />
    </header>
  );
}
