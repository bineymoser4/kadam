import { ArrowRight, GraduationCap, Users } from "lucide-react";
import { Logo } from "../shared/fields";
import type { Role } from "../data/plans";

export default function RoleScreen({ onPick }: { onPick: (role: Role) => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-sidebar)] px-4 py-10 text-white">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-center gap-3">
          <Logo />
          <div>
            <p className="text-2xl font-black">Kadam</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">образование не должно зависеть от того, где ты начал</p>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-lg text-center text-sm font-bold leading-relaxed text-white/60">
          Без регистрации и паролей — выберите, кто вы, и попробуйте Kadam прямо сейчас.
        </p>

        <div className="mt-7 grid gap-3.5 sm:grid-cols-2">
          <RoleCard
            icon={GraduationCap}
            title="Ученик"
            description="Узнай шанс поступления, получи план и отправь его ментору на проверку."
            onClick={() => onPick("student")}
          />
          <RoleCard
            icon={Users}
            title="Ментор"
            description="Смотри учеников, утверждай планы и проверяй доказательства выполненных задач."
            onClick={() => onPick("mentor")}
          />
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon: Icon, title, description, onClick }: { icon: typeof GraduationCap; title: string; description: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-start gap-3.5 rounded-md border border-white/10 bg-[var(--color-sidebar-soft)] p-5 text-left transition hover:border-[var(--color-accent)]/60"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-accent)] text-white">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xl font-black">{title}</p>
        <p className="mt-1.5 text-sm font-bold leading-relaxed text-white/60">{description}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-accent)] transition group-hover:gap-2.5">
        Продолжить
        <ArrowRight className="h-4 w-4" />
      </span>
    </button>
  );
}
