import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Bookmark, MapPin } from "lucide-react";
import type { UniversityRecord } from "../university/normalize";
import { confidenceRu, programRu } from "../university/normalize";
import type { StudentProfile } from "../data/profile";
import type { ChanceResult } from "../scoring/engine";
import type { Plan } from "../data/plans";
import { money } from "../shared/format";
import { ImageBlock } from "./UniversityCard";
import { ChancePanel } from "./ChancePanel";
import { Characteristics } from "./Characteristics";
import { OrtPanel } from "./OrtPanel";
import { HowWeScore } from "./HowWeScore";
import { PlanTasks } from "./PlanTasks";

type DetailTab = "admission" | "cost" | "requirements" | "deadlines" | "programs";

const tabs: Array<[DetailTab, string]> = [
  ["admission", "Поступление"],
  ["cost", "Стоимость"],
  ["requirements", "Требования"],
  ["deadlines", "Дедлайны"],
  ["programs", "Специальности"],
];

export function UniversityPage({
  university,
  profile,
  result,
  plan,
  saved,
  onBack,
  onToggleSave,
  onCreateAndSend,
  onSubmitEvidence,
}: {
  university: UniversityRecord;
  profile: StudentProfile;
  result: ChanceResult;
  plan: Plan | undefined;
  saved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onCreateAndSend: () => void;
  onSubmitEvidence: (taskId: string, evidence: { text: string; link: string }) => void;
}) {
  const [tab, setTab] = useState<DetailTab>("admission");

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[var(--color-ink)]">
        <ArrowLeft className="h-4 w-4" />
        Все вузы
      </button>

      <div className="overflow-hidden rounded-md border border-[var(--color-line)] bg-white">
        <ImageBlock university={university} />
        <div className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-black leading-tight text-[var(--color-ink)]">{university.name}</h1>
              <p className="mt-0.5 text-xs font-bold text-slate-500">{university.englishName}</p>
              <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                {university.city}, {university.country}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onToggleSave}
                className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs font-bold ${saved ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" : "border border-[var(--color-line)] text-slate-600"}`}
              >
                <Bookmark className="h-3.5 w-3.5" />
                {saved ? "Сохранено" : "Сохранить"}
              </button>
              {university.officialWebsite && (
                <a
                  href={university.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-[var(--color-ink)] px-3 py-2 text-xs font-bold text-white"
                >
                  Сайт
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5 border-t border-[var(--color-line)] pt-3.5">
            <Stat label="Стоимость" value={`${money(university.tuition)}/год`} />
            <Stat label="Шанс" value={result.score == null ? "—" : `${Math.round(result.score)}/100`} />
            <Stat label="Данные" value={confidenceRu(university.dataConfidence)} />
          </div>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-[var(--color-line)]">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`shrink-0 rounded-t-sm px-3 py-2 text-xs font-bold ${tab === id ? "border-b-2 border-[var(--color-accent)] text-[var(--color-ink)]" : "text-slate-400"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "admission" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <Characteristics result={result} />
            <HowWeScore />
            {university.raw.region === "KGZ" && <OrtPanel profile={profile} />}
          </div>
          <ChancePanel university={university} result={result} />
        </div>
      )}

      {tab === "cost" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoCard title="Стоимость в год" items={[money(university.tuition)]} />
          <InfoCard title="Финансовая поддержка" items={[university.raw.financialAid]} />
          <InfoCard title="Стипендии этого вуза" items={university.scholarships} />
          <InfoCard title="Сила финансирования" items={[fundingLabel[university.raw.fundingStrength]]} />
        </div>
      )}

      {tab === "requirements" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoCard title="Требования" items={university.requirements} />
          <InfoCard title="Критерии отбора" items={university.admissionCriteria} />
          <InfoCard title="Документы" items={university.documents} />
          <InfoCard title="Экзамены" items={university.exams} />
        </div>
      )}

      {tab === "deadlines" && (
        <div className="space-y-3">
          <InfoCard title="Дедлайны" items={university.deadlines.length ? university.deadlines : ["Данные требуют проверки на официальном сайте"]} />
          <PlanTasks result={result} university={university} plan={plan} onCreateAndSend={onCreateAndSend} onSubmitEvidence={onSubmitEvidence} />
        </div>
      )}

      {tab === "programs" && (
        <div className="rounded-md border border-[var(--color-line)] bg-white p-4">
          <div className="flex flex-wrap gap-2">
            {university.programs.map((program) => (
              <span key={program} className="rounded-sm bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                {programRu[program] ?? program}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const fundingLabel: Record<string, string> = {
  high: "Высокая — много финансовой поддержки",
  medium: "Средняя — поддержка по программам",
  low: "Низкая — рассчитывайте в основном на свои средства",
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm bg-slate-50 p-2.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-black text-[var(--color-ink)]">{value}</p>
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-[var(--color-line)] bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.slice(0, 6).map((item) => (
          <li key={item} className="text-sm font-bold leading-relaxed text-slate-700">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
