import { useEffect, useState } from "react";
import { Bookmark, GraduationCap, MapPin } from "lucide-react";
import type { UniversityRecord } from "../university/normalize";
import { money } from "../shared/format";
import { cn } from "../lib/utils";

export function ImageBlock({ university, compact = false }: { university: UniversityRecord; compact?: boolean }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [university.imageUrl]);

  if (university.imageUrl && !failed) {
    return (
      <div className={cn("overflow-hidden bg-slate-100", compact ? "h-32" : "h-56")}>
        <img src={university.imageUrl} alt={university.name} className="h-full w-full object-cover" loading="lazy" onError={() => setFailed(true)} />
      </div>
    );
  }

  return (
    <div className={cn("flex w-full items-center justify-center bg-[var(--color-accent-soft)]", compact ? "h-32" : "h-56")}>
      <GraduationCap className="h-8 w-8 text-[var(--color-accent)]" />
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
    <article className={cn("overflow-hidden rounded-md border bg-white transition", active ? "border-[var(--color-accent)]" : "border-[var(--color-line)]")}>
      <button onClick={onOpen} className="block w-full text-left">
        <ImageBlock university={university} compact />
        <div className="p-3.5">
          <h2 className="line-clamp-2 min-h-[42px] text-sm font-black leading-tight text-[var(--color-ink)]">{university.name}</h2>
          <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {university.city}, {university.country}
          </p>
          <p className="mt-2 text-sm font-black text-[var(--color-ink)]">{money(university.tuition)}/год</p>
        </div>
      </button>
      <div className="flex items-center justify-end border-t border-[var(--color-line)] px-3.5 py-2">
        <button
          onClick={onSave}
          className={cn(
            "inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-[11px] font-bold",
            saved ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" : "bg-slate-100 text-slate-600",
          )}
        >
          <Bookmark className="h-3 w-3" />
          {saved ? "сохранено" : "сохранить"}
        </button>
      </div>
    </article>
  );
}
