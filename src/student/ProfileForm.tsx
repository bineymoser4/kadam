import { Sparkles } from "lucide-react";
import type { StudentProfile, StudentLevel } from "../data/profile";
import { countryOptions, programRu } from "../university/normalize";
import { NumberField, SelectField } from "../shared/fields";

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
    <section className="rounded-[34px] border border-white/10 bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-black text-[#071014]">Профиль студента</p>
          <p className="text-sm font-bold text-slate-500">Минимум данных, максимум пользы. Оставьте поле пустым, если не знаете значение — мы не станем его угадывать.</p>
        </div>
        <Sparkles className="h-6 w-6 text-[#9edb00]" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <NumberField label="GPA" value={profile.gpa} step={0.1} max={4} onChange={(value) => onChange("gpa", value)} />
        <NumberField label="SAT / ОРТ" value={profile.sat} onChange={(value) => onChange("sat", value)} />
        <NumberField label="IELTS / TOEFL" value={profile.ielts} step={0.5} max={120} onChange={(value) => onChange("ielts", value)} />
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
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Портфолио: {profile.portfolio}</span>
        <input
          value={profile.portfolio}
          type="range"
          min={0}
          max={100}
          onChange={(event) => onChange("portfolio", Number(event.target.value))}
          className="mt-4 w-full accent-[#9edb00]"
        />
      </label>

      <label className="mt-3 block">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Желаемый университет</span>
        <select
          value={profile.desiredUniversityId ?? ""}
          onChange={(event) => onChange("desiredUniversityId", event.target.value || null)}
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold outline-none transition focus:border-[#9cff00] focus:ring-4 focus:ring-[#cfff00]/20"
        >
          <option value="">Не выбрано — покажу первый подходящий</option>
          {universityOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </label>

      <button onClick={onSubmit} className="mt-4 w-full rounded-2xl bg-[#071014] px-4 py-4 text-sm font-black uppercase tracking-wide text-[#dfff45] transition hover:bg-[#16242b]">
        Проверить мои шансы
      </button>
    </section>
  );
}
