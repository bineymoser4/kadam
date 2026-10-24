import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
      title={dark ? "Светлая тема" : "Тёмная тема"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-current/15 text-current/70 transition hover:bg-current/5 hover:text-current"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function NumberField({
  label,
  value,
  step = 1,
  max,
  onChange,
}: {
  label: string;
  value: number | null;
  step?: number;
  max?: number;
  onChange: (value: number | null) => void;
}) {
  return (
    <label>
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</span>
      <input
        value={value ?? ""}
        step={step}
        max={max}
        type="number"
        placeholder="не указано"
        onChange={(event) => {
          const raw = event.target.value;
          onChange(raw === "" ? null : Number(raw));
        }}
        className="mt-1 w-full rounded-sm border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm font-bold outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  formatOption = (option: string) => option,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  formatOption?: (value: string) => string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-sm border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm font-bold outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOption(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className={`flex items-center justify-center rounded-md bg-[var(--color-accent)] text-white ${box}`}>
      <span className="text-sm font-black">K</span>
    </div>
  );
}
