import { BarChart3, Bookmark, Download, GraduationCap, Home, LayoutDashboard, ListChecks, Repeat, Search, Sparkles } from "lucide-react";
import type { View } from "./Tabs";
import { Logo } from "../shared/fields";

export function SideNav({
  onNavigate,
  onHelp,
  onExport,
  onSwitchRole,
}: {
  onNavigate: (section: string, view?: View) => void;
  onHelp: () => void;
  onExport: () => void;
  onSwitchRole: () => void;
}) {
  const items: Array<{ label: string; icon: typeof Home; section: string; view?: View }> = [
    { label: "Профиль", icon: Home, section: "profile" },
    { label: "Поиск", icon: Search, section: "search" },
    { label: "Университет", icon: GraduationCap, section: "university" },
    { label: "Характеристика", icon: BarChart3, section: "analysis", view: "characteristics" },
    { label: "План", icon: ListChecks, section: "analysis", view: "plan" },
    { label: "Стипендии", icon: Sparkles, section: "analysis", view: "scholarships" },
    { label: "Сохранённые", icon: Bookmark, section: "analysis", view: "saved" },
    { label: "Сравнение", icon: LayoutDashboard, section: "analysis", view: "compare" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[286px] flex-col border-r border-white/10 bg-[#16242b] p-4 text-white lg:flex">
      <div className="flex items-center gap-3">
        <Logo />
        <div>
          <p className="text-2xl font-black tracking-tight">Kadam</p>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#dfff45]">поступление</p>
        </div>
      </div>

      <div className="mt-5 rounded-[22px] border border-white/10 bg-[#071014] p-3">
        <p className="text-xs font-bold text-slate-400">Личный кабинет</p>
        <p className="mt-1 text-lg font-black">Ученик</p>
        <button onClick={onSwitchRole} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#dfff45]">
          <Repeat className="h-3 w-3" />
          Сменить роль
        </button>
      </div>

      <nav className="mt-4 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.section, item.view)}
            className="group flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-extrabold text-slate-300 transition hover:bg-[#cfff00] hover:text-[#071014]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#cfff00] transition group-hover:border-[#071014]/10 group-hover:bg-[#071014]">
              <item.icon className="h-4 w-4" />
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-3 grid gap-2">
        <button onClick={onHelp} className="rounded-2xl border border-[#cfff00]/40 bg-[#cfff00] px-4 py-2.5 text-sm font-black text-[#071014]">
          Помощь
        </button>
        <button onClick={onExport} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-black text-white">
          <Download className="h-4 w-4" />
          Экспорт CSV
        </button>
      </div>
    </aside>
  );
}

export function MobileHeader({ onNavigate, onHelp, onSwitchRole }: { onNavigate: (section: string, view?: View) => void; onHelp: () => void; onSwitchRole: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071014]/92 px-4 py-3 text-white backdrop-blur lg:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <p className="text-xl font-black">Kadam</p>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#dfff45]">поступление</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onSwitchRole} className="rounded-full bg-white/10 px-3 py-2 text-xs font-black text-white">
            Роль
          </button>
          <button onClick={onHelp} className="rounded-full bg-[#cfff00] px-4 py-2 text-xs font-black text-[#071014]">
            Помощь
          </button>
        </div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {[
          ["profile", "Профиль"],
          ["search", "Поиск"],
          ["university", "Вуз"],
          ["analysis", "Анализ"],
        ].map(([section, label]) => (
          <button key={section} onClick={() => onNavigate(section)} className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-slate-200">
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
