import { useState } from "react";
import { ArrowDownToLine, ArrowRight, CheckCircle2, Clock, FilePlus2, Plus, X } from "lucide-react";
import type { Plan, PlanDocument } from "../data/plans";
import type { UniversityRecord } from "../university/normalize";
import { ImageBlock } from "./UniversityCard";

export function PlanPage({ plans, universities, onOpenUniversity, onCreatePlan }: { plans: Plan[]; universities: UniversityRecord[]; onOpenUniversity: (universityId: string) => void; onCreatePlan: (university: UniversityRecord, documents: PlanDocument[]) => void }) {
  const [creating, setCreating] = useState(false);
  const [universityId, setUniversityId] = useState(universities[0]?.id ?? "");
  const [documents, setDocuments] = useState<PlanDocument[]>([]);
  const [uploadError, setUploadError] = useState("");
  const selectedUniversity = universities.find((university) => university.id === universityId);

  const readDocuments = async (files: FileList | null) => {
    setUploadError("");
    if (!files?.length) return;
    const selectedFiles = Array.from(files);
    if (selectedFiles.length + documents.length > 5) {
      setUploadError("Можно прикрепить не больше 5 документов.");
      return;
    }
    if (selectedFiles.some((file) => file.size > 1024 * 1024)) {
      setUploadError("Размер каждого файла не должен превышать 1 МБ.");
      return;
    }
    const loaded = await Promise.all(selectedFiles.map((file) => new Promise<PlanDocument>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, dataUrl: String(reader.result) });
      reader.onerror = () => reject(new Error("Не удалось прочитать файл."));
      reader.readAsDataURL(file);
    })));
    setDocuments((current) => [...current, ...loaded]);
  };

  const submitPlan = () => {
    if (!selectedUniversity) return;
    onCreatePlan(selectedUniversity, documents);
    setCreating(false);
    setDocuments([]);
    setUploadError("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-black text-[var(--color-ink)]">Мои планы</p>
          <p className="mt-1 text-sm font-bold text-slate-500">Поступление и документы по выбранным вузам.</p>
        </div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-mentor-accent)] px-4 py-2.5 text-sm font-black text-black hover:bg-lime-300">
          <Plus className="h-4 w-4" />
          Создать план
        </button>
      </div>

      {!plans.length ? (
        <div className="rounded-md border border-dashed border-[var(--color-line)] bg-white/90 p-10 text-center">
          <p className="text-sm font-bold text-slate-500">Пока нет планов. Создайте план и выберите вуз.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {plans.map((plan) => {
        const university = universities.find((item) => item.id === plan.universityId);
        const approved = plan.tasks.filter((task) => task.status === "approved").length;
        const progress = plan.tasks.length ? Math.round((approved / plan.tasks.length) * 100) : 0;
        return (
          <article key={plan.id} className="overflow-hidden rounded-md border border-[var(--color-line)] bg-white/95">
            {university && <ImageBlock university={university} compact={false} />}
            <div className="p-4">
              <button onClick={() => onOpenUniversity(plan.universityId)} className="flex w-full items-start justify-between gap-3 text-left">
                <div>
                  <p className="text-sm font-black text-[var(--color-ink)]">{plan.universityName}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    {plan.status === "pending_review" ? <Clock className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    {plan.status === "pending_review" ? "Ждёт утверждения ментора" : plan.status === "draft" ? "Черновик плана" : "План утверждён"}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
              <div className="mt-3 flex items-center gap-2.5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-slate-100">
                  <div className="h-full rounded-sm bg-[var(--color-accent)]" style={{ width: `${progress}%` }} />
                </div>
                <span className="shrink-0 text-xs font-bold text-slate-500">{approved}/{plan.tasks.length}</span>
              </div>
              {!!plan.documents?.length && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--color-line)] pt-3">
                  {plan.documents.map((document, index) => (
                    <a key={`${document.name}-${index}`} href={document.dataUrl} download={document.name} className="inline-flex max-w-full items-center gap-1.5 rounded-sm bg-[var(--color-accent-soft)] px-2.5 py-1.5 text-xs font-bold text-[var(--color-ink)]">
                      <ArrowDownToLine className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{document.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </article>
        );
          })}
        </div>
      )}

      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreating(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="create-plan-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md bg-[var(--color-surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-4">
              <h2 id="create-plan-title" className="text-lg font-black">Создать план поступления</h2>
              <button onClick={() => setCreating(false)} aria-label="Закрыть" className="rounded-sm p-1.5 text-slate-500 hover:bg-black/5"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-5">
              <label className="block text-xs font-bold text-slate-600">
                Выберите вуз
                <select value={universityId} onChange={(event) => setUniversityId(event.target.value)} className="mt-1.5 w-full rounded-sm border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]">
                  {universities.map((university) => <option key={university.id} value={university.id}>{university.name}</option>)}
                </select>
              </label>
              {selectedUniversity && (
                <div className="overflow-hidden rounded-sm border border-[var(--color-line)] bg-white">
                  <ImageBlock university={selectedUniversity} />
                  <div className="px-3 py-2 text-xs font-bold text-slate-600">{selectedUniversity.name}</div>
                </div>
              )}
              <label className="block rounded-sm border border-dashed border-[var(--color-line)] bg-white p-4 text-sm font-bold text-slate-700">
                <span className="flex items-center gap-2"><FilePlus2 className="h-4 w-4 text-[var(--color-accent)]" />Добавить документы</span>
                <span className="mt-1 block text-xs font-medium text-slate-500">До 5 файлов, максимум 1 МБ каждый. Файлы можно скачать из карточки плана.</span>
                <input type="file" multiple onChange={(event) => { void readDocuments(event.target.files).catch(() => setUploadError("Не удалось прочитать выбранный файл.")); event.currentTarget.value = ""; }} className="mt-3 block w-full text-xs file:mr-3 file:rounded-sm file:border-0 file:bg-[var(--color-accent-soft)] file:px-3 file:py-2 file:font-bold file:text-[var(--color-ink)]" />
              </label>
              {uploadError && <p role="alert" className="text-xs font-bold text-rose-700">{uploadError}</p>}
              {!!documents.length && <ul className="space-y-1 text-xs font-bold text-slate-600">{documents.map((document, index) => <li key={`${document.name}-${index}`}>{document.name}</li>)}</ul>}
              <button disabled={!selectedUniversity} onClick={submitPlan} className="w-full rounded-sm bg-[var(--color-mentor-accent)] px-4 py-3 text-sm font-black text-black hover:bg-lime-300 disabled:opacity-50">Создать план</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
