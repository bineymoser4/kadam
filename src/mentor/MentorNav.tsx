import { LayoutDashboard, RotateCcw, Users } from "lucide-react";
import { Logo } from "../shared/fields";
import { cn } from "../lib/utils";

export type MentorView = "dashboard" | "mentees";

const items: Array<{ label: string; icon: typeof Users; view: MentorView }> = [
  { label: "Дашборд", icon: LayoutDashboard, view: "dashboard" },
  { label: "Ученики", icon: Users, view: "mentees" },
];

export function MentorSideNav({
  view,
  menteeCount,
  onNavigate,
  onReset,
  onSwitchRole,
}: {
  view: MentorView;
  menteeCount: number;
  onNavigate: (view: MentorView) => void;
  onReset: () => void;
  onSwitchRole: () => void;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col border-r border-white/10 bg-[var(--color-sidebar)] p-4 text-white lg:flex">
      <div className="flex items-center gap-2.5">
        <Logo />
        <div>
          <p className="text-lg font-black tracking-tight">Kadam</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">наставник</p>
        </div>
      </div>

      <nav className="mt-6 min-h-0 flex-1 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const active = view === item.view;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-bold transition",
                active ? "bg-[var(--color-accent)] text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="rounded-md border border-white/10 bg-[var(--color-sidebar-soft)] p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Личный кабинет</p>
        <p className="mt-1 text-sm font-black">Ментор · {menteeCount} учеников</p>
        <div className="mt-2.5 grid gap-1.5">
          <button onClick={onReset} className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-white/15 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white/70 hover:bg-white/5">
            <RotateCcw className="h-3 w-3" />
            Сбросить демо
          </button>
          <button onClick={onSwitchRole} className="rounded-sm border border-white/15 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white/70 hover:bg-white/5">
            Сменить роль
          </button>
        </div>
      </div>
    </aside>
  );
}

export function MentorTabBar({ view, onNavigate }: { view: MentorView; onNavigate: (view: MentorView) => void }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[var(--color-line)] bg-white px-1 pt-1.5 lg:hidden"
      style={{ paddingBottom: "max(6px, env(safe-area-inset-bottom))" }}
    >
      {items.map((item) => {
        const active = view === item.view;
        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.view)}
            className={cn("flex flex-1 flex-col items-center gap-0.5 rounded-sm py-1.5 text-[10px] font-bold", active ? "text-[var(--color-accent)]" : "text-slate-400")}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export function MentorMobileHeader({ onReset, onSwitchRole }: { onReset: () => void; onSwitchRole: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-line)] bg-white px-4 py-2.5 lg:hidden">
      <div className="flex items-center gap-2">
        <Logo />
        <p className="text-base font-black text-[var(--color-ink)]">Kadam · Ментор</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onReset} className="rounded-sm border border-[var(--color-line)] p-1.5 text-slate-500" aria-label="Сбросить демо">
          <RotateCcw className="h-4 w-4" />
        </button>
        <button onClick={onSwitchRole} className="rounded-sm border border-[var(--color-line)] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
          Роль
        </button>
      </div>
    </header>
  );
}
