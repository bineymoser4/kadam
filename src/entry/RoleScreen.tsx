import { ArrowRight, GraduationCap, MoveUpRight } from "lucide-react";
import { Logo, ThemeToggle } from "../shared/fields";
import type { Role } from "../data/plans";
import { allUniversityRecords } from "../university/normalize";

export default function RoleScreen({ onPick, darkTheme, onToggleTheme }: { onPick: (role: Role) => void; darkTheme: boolean; onToggleTheme: () => void }) {
  const campus = allUniversityRecords.find((university) => university.imageUrl);

  return (
    <main className="grid min-h-screen text-[var(--color-ink)] lg:grid-cols-[0.9fr_1.1fr]">
      <section
        className="welcome-surface relative flex min-h-[520px] flex-col justify-between overflow-hidden px-6 py-7 sm:px-10 sm:py-9 lg:min-h-screen lg:px-14 lg:py-12"
      >
        <div className="absolute right-5 top-5 z-10 text-[var(--color-ink)] sm:right-8 sm:top-8">
          <ThemeToggle dark={darkTheme} onToggle={onToggleTheme} />
        </div>
        <div className="relative flex items-center gap-3">
          <Logo />
          <div>
            <p className="text-xl font-black">Qadam</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">путь к поступлению</p>
          </div>
        </div>

        <div className="relative my-12 max-w-xl lg:my-0">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase text-[var(--color-accent)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-mentor-accent)]" />
            Твой следующий шаг
          </p>
          <h1 className="text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">Большая цель.<br /><span className="text-[var(--color-accent)]">Понятный план.</span></h1>
          <p className="mt-5 max-w-md text-base font-semibold leading-relaxed text-slate-600">Выбери университет, собери документы и двигайся к поступлению шаг за шагом.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button onClick={() => onPick("student")} className="inline-flex items-center gap-3 rounded-sm bg-[var(--color-mentor-accent)] px-5 py-3.5 text-sm font-black text-black transition hover:bg-lime-300">
              <GraduationCap className="h-5 w-5" />
              Начать свой план
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => onPick("mentor")} className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-[var(--color-ink)]">
              Я ментор <MoveUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="relative text-xs font-bold text-slate-400">Поступление начинается не с идеального резюме, а с первого шага.</p>
      </section>

      <section className="relative min-h-[300px] overflow-hidden bg-[var(--color-sidebar)] lg:min-h-screen">
        {campus?.imageUrl && <img src={campus.imageUrl} alt={`${campus.name} campus`} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-white sm:bottom-9 sm:left-10 sm:right-10">
          <div>
            <p className="text-[10px] font-bold uppercase text-white/70">Твоя дорога начинается здесь</p>
            <p className="mt-1 text-lg font-black">Найди университет, который подходит тебе.</p>
          </div>
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-mentor-accent)] text-black sm:flex"><ArrowRight className="h-5 w-5" /></span>
        </div>
      </section>
    </main>
  );
}
