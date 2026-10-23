import type React from "react";
import { ArrowUpRight, BookOpen, Compass, ListChecks, Sparkles, Target, Wallet, ShieldCheck } from "lucide-react";
import type { UniversityRecord } from "../university/normalize";
import { confidenceRu } from "../university/normalize";
import { money } from "../shared/format";
import { ImageBlock } from "./UniversityCard";

export function UniversityDetail({ university }: { university: UniversityRecord }) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <ImageBlock university={university} />
      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="rounded-full bg-[#dfff45] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#071014]">
              {confidenceRu(university.dataConfidence)}
            </span>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#071014]">{university.name}</h2>
            <p className="mt-1 text-sm font-extrabold text-slate-500">{university.englishName}</p>
            <p className="mt-2 text-sm font-bold text-slate-500">{university.city}, {university.country}</p>
          </div>
          {university.officialWebsite ? (
            <a href={university.officialWebsite} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#071014] px-4 py-3 text-xs font-black uppercase text-[#dfff45]">
              Источник
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : (
            <span className="rounded-full bg-slate-100 px-4 py-3 text-xs font-black uppercase text-slate-500">проверить сайт</span>
          )}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <DetailGroup title="Стоимость" icon={Wallet} items={[money(university.tuition)]} />
          <DetailGroup title="Экзамены" icon={Target} items={university.exams} />
          <DetailGroup title="Требования" icon={ShieldCheck} items={university.requirements} />
          <DetailGroup title="Дедлайны" icon={ListChecks} items={university.deadlines.length ? university.deadlines : ["Данные требуют проверки на официальном сайте"]} />
          <DetailGroup title="Документы" icon={BookOpen} items={university.documents} />
          <DetailGroup title="Стипендии" icon={Sparkles} items={university.scholarships} />
          <DetailGroup title="Критерии" icon={Compass} items={university.admissionCriteria} />
          <DetailGroup title="Ссылки" icon={ArrowUpRight} items={university.sourceLinks.length ? university.sourceLinks : ["Данные требуют проверки на официальном сайте"]} />
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          Обновлено: {university.lastUpdated} / {confidenceRu(university.dataConfidence)}
        </p>
      </div>
    </section>
  );
}

function DetailGroup({ title, icon: Icon, items }: { title: string; icon: React.ElementType; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#071014] text-[#cfff00]">
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{title}</p>
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.slice(0, 4).map((item) => (
          <li key={item} className="break-words text-sm font-bold leading-relaxed text-slate-700">{item}</li>
        ))}
      </ul>
    </div>
  );
}
