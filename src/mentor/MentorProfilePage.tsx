import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { defaultMentorProfile, loadMentorProfile, mentorInitials, saveMentorProfile, type MentorProfile } from "../data/mentorProfile";
import type { Plan } from "../data/plans";

export function MentorProfilePage({ plans, onSaved }: { plans: Plan[]; onSaved?: () => void }) {
  const [profile, setProfile] = useState<MentorProfile>(loadMentorProfile);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const reviewedCount = plans.reduce((sum, plan) => sum + plan.tasks.filter((task) => task.status === "approved" || task.status === "needs_changes").length, 0);

  const setField = <K extends keyof MentorProfile>(field: K, value: MentorProfile[K]) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    if (!profile.name.trim()) {
      setError("Укажите имя — поле не может быть пустым.");
      return;
    }
    setError("");
    saveMentorProfile(profile);
    setSaved(true);
    onSaved?.();
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-md border border-[var(--color-line)] bg-white p-5">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full opacity-[0.07] blur-2xl" style={{ background: "#1f7a53" }} />
          <div className="absolute -bottom-20 left-10 h-28 w-28 rounded-full opacity-[0.07] blur-2xl" style={{ background: "#B7791F" }} />
        </div>

        <div className="relative flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent)] text-xl font-black text-white">{mentorInitials(profile.name || defaultMentorProfile.name)}</div>
          <div className="min-w-0">
            <p className="text-xl font-black text-[var(--color-ink)]">{profile.name || "Без имени"}</p>
            <p className="text-sm font-bold text-slate-500">Ментор</p>
          </div>
          <div className="ml-auto flex gap-6">
            <Stat label="Учеников" value={plans.length} />
            <Stat label="Проверено работ" value={reviewedCount} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Специализация" value={profile.specialization} onChange={(v) => setField("specialization", v)} />
        <Field label="Страны поступления" value={profile.countries} onChange={(v) => setField("countries", v)} />
        <Field label="Языки" value={profile.languages} onChange={(v) => setField("languages", v)} />
        <Field label="Свободные слоты для встреч" value={profile.slots} onChange={(v) => setField("slots", v)} />
        <Field label="Контакты" value={profile.contacts} onChange={(v) => setField("contacts", v)} />
        <Field label="Имя" value={profile.name} onChange={(v) => setField("name", v)} />
      </div>

      <label className="block rounded-md border border-[var(--color-line)] bg-white p-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">О себе</span>
        <textarea
          value={profile.about}
          onChange={(event) => setField("about", event.target.value)}
          rows={3}
          className="mt-1.5 w-full resize-none rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--color-accent)]"
        />
      </label>

      {error && <p className="text-xs font-bold text-rose-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="rounded-sm bg-[var(--color-accent)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[var(--color-accent-dark)]">
          Сохранить
        </button>
        {saved && (
          <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-accent)]">
            <CheckCircle2 className="h-4 w-4" />
            Сохранено
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xl font-black text-[var(--color-ink)]">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-sm border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm font-bold outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
      />
    </label>
  );
}
