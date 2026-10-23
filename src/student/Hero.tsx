import type React from "react";
import { BookOpen, ShieldCheck, Target } from "lucide-react";
import type { ChanceResult } from "../scoring/engine";

export function Hero({ result, universitiesCount }: { result: ChanceResult; universitiesCount: number }) {
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#f7f8f3] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] md:p-8">
      <div className="absolute right-0 top-0 h-28 w-28 border-b-[18px] border-l-[18px] border-[#dfff00]" />
      <span className="inline-flex rounded-full bg-[#071014] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#dfff45]">
        готовность к поступлению
      </span>
      <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.03] tracking-tight text-[#071014] md:text-6xl">
        Узнай шансы и получи понятный план.
      </h1>
      <p className="mt-4 max-w-2xl text-base font-bold leading-relaxed text-slate-600">
        Введите профиль, выберите вуз и сразу увидите шанс поступления, слабые места, диаграмму готовности и действия на ближайшие дни.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <HeroStat icon={ShieldCheck} label="Шанс" value={result.level} />
        <HeroStat icon={Target} label="Готовность" value={result.score == null ? "—" : `${Math.round(result.score)}/100`} />
        <HeroStat icon={BookOpen} label="Вузов в базе" value={`${universitiesCount}`} />
      </div>
    </div>
  );
}

function HeroStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#071014] text-[#cfff00]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 truncate text-lg font-black text-[#071014]">{value}</p>
    </div>
  );
}
