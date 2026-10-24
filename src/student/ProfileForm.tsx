import type { StudentProfile, StudentLevel } from "../data/profile";
import { countryOptions, programRu } from "../university/normalize";
import { NumberField, SelectField } from "../shared/fields";
import { ORT_TRACKS, BENEFIT_CATEGORIES, type OrtTrackId, type BenefitCategoryId } from "../scholarships/ortThresholds";

const levelOptions: StudentLevel[] = ["Школа", "Бакалавриат", "Магистратура"];

export function ProfileForm({
  profile,
  majors,
  universityOptions,
  onChange,
  onSubmit,
}: {
  profile: StudentProfile;
  majors: string[];
  universityOptions: Array<{ id: string; name: string }>;
  onChange: <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="rounded-md border border-[var(--color-line)] bg-white p-5">
      <p className="text-lg font-black text-[var(--color-ink)]">Профиль студента</p>
      <p className="mt-1 text-sm font-bold text-slate-500">Минимум данных, максимум пользы. Оставьте поле пустым, если не знаете значение — мы не станем его угадывать.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <NumberField label="GPA" value={profile.gpa} step={0.1} max={4} onChange={(value) => onChange("gpa", value)} />
        <NumberField label="SAT" value={profile.sat} step={10} max={1600} onChange={(value) => onChange("sat", value)} />
        <NumberField label="IELTS" value={profile.ielts} step={0.5} max={9} onChange={(value) => onChange("ielts", value)} />
        <NumberField label="Бюджет $" value={profile.budget} step={500} onChange={(value) => onChange("budget", value)} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <SelectField label="Страна" value={profile.country} options={countryOptions} onChange={(value) => onChange("country", value)} />
        <SelectField label="Направление" value={profile.major} options={majors} formatOption={(value) => programRu[value] ?? value} onChange={(value) => onChange("major", value)} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <SelectField label="Уровень" value={profile.level} options={levelOptions} onChange={(value) => onChange("level", value as StudentLevel)} />
        <SelectField label="Дедлайн" value={profile.deadline} options={["Сейчас", "6 месяцев", "12 месяцев"]} onChange={(value) => onChange("deadline", value)} />
      </div>

      <label className="mt-3 block">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Желаемый университет</span>
        <select
          value={profile.desiredUniversityId ?? ""}
          onChange={(event) => onChange("desiredUniversityId", event.target.value || null)}
          className="mt-1 w-full rounded-sm border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm font-bold outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
        >
          <option value="">Не выбрано — покажу первый подходящий</option>
          {universityOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-5 border-t border-[var(--color-line)] pt-4">
        <p className="text-sm font-black text-[var(--color-ink)]">Поступление в Кыргызстан</p>
        <p className="mt-1 text-xs font-bold text-slate-500">Заполните, если сдаёте ОРТ — используется на странице кыргызских вузов.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <NumberField label="Балл ОРТ" value={profile.ort} onChange={(value) => onChange("ort", value)} />
          <SelectField
            label="Направление"
            value={profile.ortTrack}
            options={ORT_TRACKS.map((t) => t.id)}
            formatOption={(id) => ORT_TRACKS.find((t) => t.id === id)?.label ?? id}
            onChange={(value) => onChange("ortTrack", value as OrtTrackId)}
          />
          <SelectField
            label="Льготная категория"
            value={profile.benefitCategory}
            options={BENEFIT_CATEGORIES.map((b) => b.id)}
            formatOption={(id) => BENEFIT_CATEGORIES.find((b) => b.id === id)?.label ?? id}
            onChange={(value) => onChange("benefitCategory", value as BenefitCategoryId)}
          />
        </div>
      </div>

      <button onClick={onSubmit} className="mt-5 w-full rounded-sm bg-[var(--color-accent)] px-4 py-3 text-sm font-black text-white transition hover:bg-[var(--color-accent-dark)]">
        Проверить мои шансы
      </button>
    </section>
  );
}
