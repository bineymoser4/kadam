import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { allUniversityRecords, countryOptions, matchesCountry, programRu, universityHaystack } from "../university/normalize";
import type { UniversityRecord } from "../university/normalize";
import type { StudentProfile } from "../data/profile";
import { chanceEngine } from "../scoring/engine";
import { UniversityCard } from "./UniversityCard";
import { ScholarshipsPanel } from "./Scholarships";

const typeOptions: Array<{ value: UniversityRecord["raw"]["type"] | "Любой"; label: string }> = [
  { value: "Любой", label: "Любой тип" },
  { value: "public", label: "Государственный" },
  { value: "private", label: "Частный" },
  { value: "international", label: "Международный" },
  { value: "specialized", label: "Специализированный" },
];

const costBuckets = [
  { value: "any", label: "Любая стоимость" },
  { value: "low", label: "До $2 000/год" },
  { value: "mid", label: "$2 000–10 000/год" },
  { value: "high", label: "$10 000–30 000/год" },
  { value: "top", label: "От $30 000/год" },
];

function inCostBucket(cost: number, bucket: string) {
  if (bucket === "low") return cost < 2000;
  if (bucket === "mid") return cost >= 2000 && cost < 10000;
  if (bucket === "high") return cost >= 10000 && cost < 30000;
  if (bucket === "top") return cost >= 30000;
  return true;
}

type SortKey = "chance" | "cost-asc" | "cost-desc" | "name";

export function CatalogPage({
  profile,
  saved,
  onOpen,
  onToggleSave,
}: {
  profile: StudentProfile;
  saved: string[];
  onOpen: (id: string) => void;
  onToggleSave: (id: string) => void;
}) {
  const [tab, setTab] = useState<"catalog" | "scholarships">("catalog");
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("Любая");
  const [type, setType] = useState<string>("Любой");
  const [cost, setCost] = useState("any");
  const [language, setLanguage] = useState("Любой");
  const [major, setMajor] = useState("Любое");
  const [sort, setSort] = useState<SortKey>("chance");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const universities = allUniversityRecords;

  const languages = useMemo(() => {
    const set = new Set<string>();
    universities.forEach((u) => u.raw.language.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [universities]);

  const majors = useMemo(() => {
    const set = new Set<string>();
    universities.forEach((u) => u.programs.forEach((p) => set.add(p)));
    return Array.from(set).sort();
  }, [universities]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let list = universities.filter((u) => {
      if (needle && !universityHaystack(u).includes(needle)) return false;
      if (!matchesCountry(country, u)) return false;
      if (type !== "Любой" && u.raw.type !== type) return false;
      if (!inCostBucket(u.tuition, cost)) return false;
      if (language !== "Любой" && !u.raw.language.includes(language)) return false;
      if (major !== "Любое" && !u.programs.includes(major)) return false;
      return true;
    });

    list = list.slice().sort((a, b) => {
      if (sort === "cost-asc") return a.tuition - b.tuition;
      if (sort === "cost-desc") return b.tuition - a.tuition;
      if (sort === "name") return a.name.localeCompare(b.name, "ru");
      const chanceA = chanceEngine(profile, a).score ?? -1;
      const chanceB = chanceEngine(profile, b).score ?? -1;
      return chanceB - chanceA;
    });

    return list;
  }, [universities, query, country, type, cost, language, major, sort, profile]);

  const resetFilters = () => {
    setQuery("");
    setCountry("Любая");
    setType("Любой");
    setCost("any");
    setLanguage("Любой");
    setMajor("Любое");
  };

  const hasActiveFilters = country !== "Любая" || type !== "Любой" || cost !== "any" || language !== "Любой" || major !== "Любое" || query.trim() !== "";

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-[var(--color-line)] pb-3">
        <button
          onClick={() => setTab("catalog")}
          className={`rounded-sm px-3 py-1.5 text-xs font-bold ${tab === "catalog" ? "bg-[var(--color-ink)] text-white" : "text-slate-500"}`}
        >
          Каталог вузов
        </button>
        <button
          onClick={() => setTab("scholarships")}
          className={`rounded-sm px-3 py-1.5 text-xs font-bold ${tab === "scholarships" ? "bg-[var(--color-ink)] text-white" : "text-slate-500"}`}
        >
          Стипендии
        </button>
      </div>

      {tab === "scholarships" ? (
        <ScholarshipsPanel profile={profile} />
      ) : (
        <>
          <div className="rounded-md border border-[var(--color-line)] bg-white p-3.5">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Найти университет, город или направление"
                  className="w-full rounded-sm border border-[var(--color-line)] bg-white py-2.5 pl-9 pr-3 text-sm font-bold outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </div>
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-[var(--color-line)] px-3 py-2.5 text-xs font-bold text-slate-600 sm:w-auto"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Фильтры
              </button>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2.5 text-xs font-bold text-slate-600 outline-none"
              >
                <option value="chance">По шансу</option>
                <option value="cost-asc">Дешевле сначала</option>
                <option value="cost-desc">Дороже сначала</option>
                <option value="name">По названию</option>
              </select>
            </div>

            {filtersOpen && (
              <div className="mt-3 grid gap-2.5 border-t border-[var(--color-line)] pt-3 sm:grid-cols-2 lg:grid-cols-4">
                <FilterSelect label="Страна" value={country} onChange={setCountry} options={countryOptions} />
                <FilterSelect
                  label="Тип вуза"
                  value={type}
                  onChange={setType}
                  options={typeOptions.map((o) => o.value as string)}
                  formatOption={(v) => typeOptions.find((o) => o.value === v)?.label ?? v}
                />
                <FilterSelect label="Стоимость" value={cost} onChange={setCost} options={costBuckets.map((b) => b.value)} formatOption={(v) => costBuckets.find((b) => b.value === v)?.label ?? v} />
                <FilterSelect label="Язык обучения" value={language} onChange={setLanguage} options={["Любой", ...languages]} />
                <FilterSelect label="Направление" value={major} onChange={setMajor} options={["Любое", ...majors]} formatOption={(v) => programRu[v] ?? v} />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">{filtered.length} вузов найдено</p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[var(--color-ink)]">
                <X className="h-3.5 w-3.5" />
                Сбросить фильтры
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-md border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
              <p className="text-sm font-bold text-slate-500">Ничего не найдено по этим фильтрам.</p>
              <button onClick={resetFilters} className="mt-3 rounded-sm bg-[var(--color-ink)] px-4 py-2 text-xs font-bold text-white">
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((university) => (
                <UniversityCard
                  key={university.id}
                  university={university}
                  active={false}
                  saved={saved.includes(university.id)}
                  onOpen={() => onOpen(university.id)}
                  onSave={() => onToggleSave(university.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  formatOption = (v: string) => v,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  formatOption?: (value: string) => string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-sm border border-[var(--color-line)] bg-white px-2.5 py-2 text-xs font-bold outline-none focus:border-[var(--color-accent)]"
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
