import { useEffect, useState } from "react";
import { Bookmark, GraduationCap, MapPin } from "lucide-react";
import type { UniversityRecord } from "../university/normalize";
import { confidenceRu } from "../university/normalize";
import { money } from "../shared/format";
import { cn } from "../lib/utils";

export function ImageBlock({ university, compact = false }: { university: UniversityRecord; compact?: boolean }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [university.imageUrl]);

  if (university.imageUrl && !failed) {
    return (
      <div className={cn("relative overflow-hidden bg-slate-100", compact ? "h-40" : "h-72")}>
        <img src={university.imageUrl} alt={university.name} className="h-full w-full object-cover" loading="lazy" onError={() => setFailed(true)} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071014]/80 to-transparent p-3">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase text-[#071014]">{university.imageCredit || "Фото кампуса"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full items-center justify-center bg-[#101b20]", compact ? "h-40" : "h-72")}>
      <div className="text-center">
        <GraduationCap className="mx-auto h-9 w-9 text-[#cfff00]" />
        <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-slate-300">Фото требует проверки</p>
      </div>
    </div>
  );
}

export function UniversityCard({
  university,
  active,
  saved,
  onOpen,
  onSave,
}: {
  university: UniversityRecord;
  active: boolean;
  saved: boolean;
  onOpen: () => void;
  onSave: () => void;
}) {
  return (
    <article className={cn("overflow-hidden rounded-[26px] border bg-white shadow-sm transition hover:-translate-y-0.5", active ? "border-[#9edb00] ring-4 ring-[#cfff00]/25" : "border-slate-200")}>
      <button onClick={onOpen} className="block w-full text-left">
        <ImageBlock university={university} compact />
        <div className="p-4">
          <h2 className="line-clamp-2 min-h-[48px] text-lg font-black leading-tight text-[#071014]">{university.name}</h2>
          <p className="mt-2 flex items-center gap-1 text-xs font-extrabold text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {university.city}, {university.country}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm font-black text-[#071014]">{money(university.tuition)}</p>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-500">{confidenceRu(university.dataConfidence)}</span>
          </div>
        </div>
      </button>
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{university.imageUrl ? "реальное фото" : "без фото"}</span>
        <button onClick={onSave} className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase", saved ? "bg-[#dfff45] text-[#071014]" : "bg-[#071014] text-white")}>
          <Bookmark className="h-3 w-3" />
          {saved ? "сохранено" : "сохранить"}
        </button>
      </div>
    </article>
  );
}
