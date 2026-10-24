import { Bookmark, Landmark, ListChecks, Scale, UserRound } from "lucide-react";
import { Logo, ThemeToggle } from "../shared/fields";
import { cn } from "../lib/utils";
import type { ChanceResult } from "../scoring/engine";

export type StudentView = "catalog" | "university" | "plan" | "saved" | "compare" | "profile";

const items: Array<{ label: string; icon: typeof Landmark; view: StudentView }> = [
  { label: "Вузы", icon: Landmark, view: "catalog" },
  { label: "Мой план", icon: ListChecks, view: "plan" },
  { label: "Сохранённые", icon: Bookmark, view: "saved" },
  { label: "Сравнение", icon: Scale, view: "compare" },
  { label: "Профиль", icon: UserRound, view: "profile" },
];

function isActive(current: StudentView, item: StudentView) {
  if (item === "catalog") return current === "catalog" || current === "university";
  return current === item;
}

export function StudentSideNav({
  view,
  result,
  onNavigate,
  onSwitchRole,
  darkTheme,
  onToggleTheme,
}: {
  view: StudentView;
  result: ChanceResult;
  onNavigate: (view: StudentView) => void;
  onSwitchRole: () => void;
  darkTheme: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col border-r border-white/10 bg-[var(--color-sidebar)] p-4 text-white lg:flex">
      <div className="flex items-center gap-2.5">
        <Logo />
        <div>
          <p className="text-lg font-black tracking-tight">Qadam</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">поступление</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-md border border-white/10 bg-[var(--color-sidebar-soft)] px-3 py-2 text-white">
        <span className="text-xs font-bold text-white/65">Тема</span>
        <ThemeToggle dark={darkTheme} onToggle={onToggleTheme} />
      </div>

      <nav className="mt-6 min-h-0 flex-1 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const active = isActive(view, item.view);
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-bold transition",
                active ? "bg-[var(--color-mentor-accent)] text-black" : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="rounded-md border border-white/10 bg-[var(--color-sidebar-soft)] p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-mentor-accent)]">Готовность</p>
        <p className="mt-1 text-xl font-black">{result.score == null ? "—" : `${Math.round(result.score)}/100`}</p>
        <p className="mt-0.5 text-xs font-bold text-white/60">{result.level}</p>
        <button onClick={onSwitchRole} className="mt-2.5 w-full rounded-sm border border-white/15 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white/70 hover:bg-white/5">
          Сменить роль
        </button>
      </div>
    </aside>
  );
}

export function StudentTabBar({ view, onNavigate }: { view: StudentView; onNavigate: (view: StudentView) => void }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-[var(--color-sidebar)] px-1 pt-1.5 text-white lg:hidden"
      style={{ paddingBottom: "max(6px, env(safe-area-inset-bottom))" }}
    >
      {items.map((item) => {
        const active = isActive(view, item.view);
        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.view)}
            className={cn("flex flex-1 flex-col items-center gap-0.5 rounded-sm py-1.5 text-[10px] font-bold", active ? "text-[var(--color-mentor-accent)]" : "text-white/55")}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export function StudentMobileHeader({ onSwitchRole, darkTheme, onToggleTheme }: { onSwitchRole: () => void; darkTheme: boolean; onToggleTheme: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[var(--color-sidebar)] px-4 py-2.5 text-white lg:hidden">
      <div className="flex items-center gap-2">
        <Logo />
        <p className="text-base font-black">Qadam</p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle dark={darkTheme} onToggle={onToggleTheme} />
        <button onClick={onSwitchRole} className="rounded-sm border border-white/20 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white/70">
          Роль
        </button>
      </div>
    </header>
  );
}
