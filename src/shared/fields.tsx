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
        className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold outline-none transition focus:border-[#9cff00] focus:ring-4 focus:ring-[#cfff00]/20"
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
        className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold outline-none transition focus:border-[#9cff00] focus:ring-4 focus:ring-[#cfff00]/20"
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

export function Logo() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#cfff00] text-[#071014] shadow-[0_0_24px_rgba(207,255,0,0.35)]">
      <div className="absolute left-3 top-3 h-2 w-2 rounded-full bg-[#071014]" />
      <div className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-[#071014]" />
      <div className="h-5 w-5 rotate-45 rounded-sm border-l-4 border-t-4 border-[#071014]" />
    </div>
  );
}
