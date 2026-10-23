import { ArrowRight, GraduationCap, Users } from "lucide-react";
import { Logo } from "../shared/fields";
import type { Role } from "../data/plans";

export default function RoleScreen({ onPick }: { onPick: (role: Role) => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#071014] px-4 py-10 text-white">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-center gap-3">
          <Logo />
          <div>
            <p className="text-3xl font-black">Kadam</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#dfff45]">образование не должно зависеть от того, где ты начал</p>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-lg text-center text-sm font-bold leading-relaxed text-slate-400">
          Без регистрации и паролей — выберите, кто вы, и попробуйте Kadam прямо сейчас.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
      className="group flex flex-col items-start gap-4 rounded-[30px] border border-white/10 bg-[#16242b] p-6 text-left transition hover:border-[#cfff00]/50 hover:bg-[#1c2d35]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#cfff00] text-[#071014]">
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-2xl font-black">{title}</p>
        <p className="mt-2 text-sm font-bold leading-relaxed text-slate-400">{description}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#cfff00] transition group-hover:gap-3">
        Продолжить
        <ArrowRight className="h-4 w-4" />
      </span>
    </button>
  );
}
