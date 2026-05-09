import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Compass,
  Download,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutDashboard,
  ListChecks,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
  X,
} from "lucide-react";
import { ALL_UNIVERSITIES, type University } from "./constants";
import { cn } from "./lib/utils";

type View = "characteristics" | "plan" | "saved" | "compare";
type ChanceLevel = "Высокий шанс" | "Средний шанс" | "Низкий шанс" | "Недостаточно данных";

interface StudentProfile {
  gpa: number;
  sat: number;
  ielts: number;
  budget: number;
  country: string;
  major: string;
  deadline: string;
  portfolio: number;
  desiredUniversity: string;
}

interface ImageMeta {
  url: string;
  credit: string;
}

interface UniversityRecord {
  id: string;
  name: string;
  englishName: string;
  country: string;
  city: string;
  imageUrl: string;
  imageCredit: string;
  officialWebsite: string;
  tuition: number;
  scholarships: string[];
  requirements: string[];
  exams: string[];
  documents: string[];
  deadlines: string[];
  admissionCriteria: string[];
  sourceLinks: string[];
  lastUpdated: string;
  dataConfidence: string;
  programs: string[];
  raw: University;
}

interface ChanceResult {
  score: number;
  level: ChanceLevel;
  factors: string[];
  improvements: string[];
  characteristics: Characteristic[];
}

interface Characteristic {
  label: string;
  short: string;
  score: number;
  status: "strong" | "ok" | "weak" | "missing";
  problem: string;
  why: string;
  action: string;
}

const profileKey = "kadam-profile-v4";
const savedKey = "kadam-saved-v4";
const lastUpdated = "2026-05-09";

const defaultProfile: StudentProfile = {
  gpa: 3.45,
  sat: 1260,
  ielts: 6.5,
  budget: 9000,
  country: "Любая",
  major: "Computer Science",
  deadline: "6 месяцев",
  portfolio: 58,
  desiredUniversity: "Американский университет в Центральной Азии",
};

const defaultSaved = ["auca", "berea", "amherst"];

const countryOptions = ["Любая", "Кыргызстан", "США", "Казахстан", "Великобритания", "Германия", "Канада", "Турция"];

const countryRu: Record<string, string> = {
  Kyrgyzstan: "Кыргызстан",
  "United States": "США",
  Kazakhstan: "Казахстан",
  "United Kingdom": "Великобритания",
  Germany: "Германия",
  Canada: "Канада",
  "Türkiye": "Турция",
  Turkey: "Турция",
  Switzerland: "Швейцария",
  Singapore: "Сингапур",
};

const countryValue: Record<string, string> = {
  Кыргызстан: "Kyrgyzstan",
  США: "United States",
  Казахстан: "Kazakhstan",
  Великобритания: "United Kingdom",
  Германия: "Germany",
  Канада: "Canada",
  Турция: "Türkiye",
};

const programRu: Record<string, string> = {
  "Computer Science": "Компьютерные науки",
  Engineering: "Инженерия",
  Economics: "Экономика",
  Business: "Бизнес",
  Medicine: "Медицина",
  Law: "Право",
  Education: "Образование",
  Psychology: "Психология",
  "International Relations": "Международные отношения",
  Philology: "Филология",
  Architecture: "Архитектура",
  Energy: "Энергетика",
  Transport: "Транспорт",
  Dentistry: "Стоматология",
  Pharmacy: "Фармация",
  "Public Health": "Общественное здоровье",
  Communication: "Коммуникации",
  Tourism: "Туризм",
  Humanities: "Гуманитарные науки",
  IT: "IT",
  Agriculture: "Аграрные науки",
  Physics: "Физика",
  AI: "Искусственный интеллект",
  Biology: "Биология",
  Design: "Дизайн",
  Government: "Государственное управление",
  Linguistics: "Лингвистика",
  "Natural Sciences": "Естественные науки",
};

const chanceStyle: Record<ChanceLevel, string> = {
  "Высокий шанс": "border-[#bfff00]/60 bg-[#dfff45] text-[#071014]",
  "Средний шанс": "border-amber-300 bg-amber-100 text-amber-800",
  "Низкий шанс": "border-rose-300 bg-rose-100 text-rose-700",
  "Недостаточно данных": "border-slate-300 bg-slate-100 text-slate-600",
};

const statusText: Record<Characteristic["status"], string> = {
  strong: "сильно",
  ok: "нормально",
  weak: "слабо",
  missing: "нет данных",
};

const statusColor: Record<Characteristic["status"], string> = {
  strong: "#7CFF00",
  ok: "#FACC15",
  weak: "#FB7185",
  missing: "#94A3B8",
};

const commons = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1200`;

const universityImages: Record<string, ImageMeta> = {
  "knu-balasagyn": {
    url: commons("KNU 1.jpg"),
    credit: "Wikimedia Commons",
  },
  "kstu-razzakov": {
    url: commons("April 2012. Kyrgyz State Technical University named after I. Razzakov - panoramio.jpg"),
    credit: "Wikimedia Commons",
  },
  "ksma-akhunbaev": {
    url: commons("Kyrgyz State Medical Academy.jpg"),
    credit: "Wikimedia Commons",
  },
  "manas-university": {
    url: commons("Manas University.jpg"),
    credit: "Wikimedia Commons",
  },
  "auca": {
    url: commons("American University of Central Asia, Bishkek (2005).jpg"),
    credit: "Wikimedia Commons",
  },
  "alatoo": {
    url: commons("Main campus of IAAU.JPG"),
    credit: "Wikimedia Commons",
  },
  "uca-naryn": {
    url: commons("University of Central Asia Naryn Campus aerial shot.jpg"),
    credit: "Wikimedia Commons",
  },
  "osh-state": {
    url: commons("Osh state university.jpg"),
    credit: "Wikimedia Commons",
  },
  mit: {
    url: commons("Great dome of MIT, Feb 2021 (2) (cropped).jpg"),
    credit: "Wikimedia Commons",
  },
  imperial: {
    url: commons("Imperial College London - South Kensington Campus.jpg"),
    credit: "Wikimedia Commons",
  },
  stanford: {
    url: commons("Stanford University Main Quad May 2011 002.jpg"),
    credit: "Wikimedia Commons",
  },
  oxford: {
    url: commons("Radcliffe Camera, Oxford - Oct 2006.jpg"),
    credit: "Wikimedia Commons",
  },
  harvard: {
    url: commons("Harvard University - Harvard Yard.JPG"),
    credit: "Wikimedia Commons",
  },
  cambridge: {
    url: commons("Kings College Chapel Cambridge.jpg"),
    credit: "Wikimedia Commons",
  },
  "eth-zurich": {
    url: commons("ETH Zurich Zentrum.jpg"),
    credit: "Wikimedia Commons",
  },
  nus: {
    url: commons("National University of Singapore University Hall.jpg"),
    credit: "Wikimedia Commons",
  },
  ucl: {
    url: commons("University College London - Wilkins Building.jpg"),
    credit: "Wikimedia Commons",
  },
  caltech: {
    url: commons("California Institute of Technology campus.jpg"),
    credit: "Wikimedia Commons",
  },
  toronto: {
    url: commons("University College, University of Toronto.jpg"),
    credit: "Wikimedia Commons",
  },
  tum: {
    url: commons("Technische Universität München - Hauptgebäude.jpg"),
    credit: "Wikimedia Commons",
  },
  nazarbayev: {
    url: commons("Nazarbayev University, School of Science and Technology.jpg"),
    credit: "Wikimedia Commons",
  },
  koc: {
    url: commons("Koç University campus.jpg"),
    credit: "Wikimedia Commons",
  },
  amherst: {
    url: commons("Amherst College Main Quad.jpg"),
    credit: "Wikimedia Commons",
  },
  berea: {
    url: commons("Berea College campus.jpg"),
    credit: "Wikimedia Commons",
  },
  princeton: {
    url: commons("Princeton University Nassau Hall.jpg"),
    credit: "Wikimedia Commons",
  },
  yale: {
    url: commons("Yale University - Harkness Tower.jpg"),
    credit: "Wikimedia Commons",
  },
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const money = (value: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(fallback)) return (Array.isArray(parsed) ? parsed : fallback) as T;
    if (typeof fallback === "object" && fallback && typeof parsed === "object" && parsed && !Array.isArray(parsed)) {
      return { ...fallback, ...parsed } as T;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

function confidenceRu(value: string) {
  if (value === "official") return "официальные данные";
  if (value === "reported") return "данные из источников";
  return "нужно проверить";
}

function normalizeUniversity(university: University): UniversityRecord {
  const hasOfficialData = university.dataConfidence === "official";
  const image = universityImages[university.id];
  const exams = [
    university.admissionProfile.satTarget ? "SAT/ОРТ" : "",
    university.admissionProfile.ielts ? "IELTS/TOEFL" : "",
    university.region === "KGZ" ? "внутренний экзамен или ОРТ" : "",
  ].filter(Boolean);

  return {
    id: university.id,
    name: university.nameRu || university.name,
    englishName: university.name,
    country: countryRu[university.country] ?? university.country,
    city: university.city,
    imageUrl: image?.url ?? "",
    imageCredit: image?.credit ?? "",
    officialWebsite: university.sourceUrl.startsWith("http") ? university.sourceUrl : "",
    tuition: university.annualCostUsd,
    scholarships: university.scholarships.length ? university.scholarships : ["Данные требуют проверки на официальном сайте"],
    requirements: [
      university.admissionProfile.gpa
        ? `${hasOfficialData ? "GPA" : "GPA, ориентир для анализа"}: ${university.admissionProfile.gpa}`
        : "GPA: данные требуют проверки на официальном сайте",
      university.admissionProfile.satTarget
        ? `${hasOfficialData ? "SAT/ОРТ" : "SAT/ОРТ, ориентир для анализа"}: ${university.admissionProfile.satTarget}`
        : "SAT/ОРТ: зависит от программы",
      university.admissionProfile.ielts
        ? `${hasOfficialData ? "IELTS" : "IELTS, ориентир для анализа"}: ${university.admissionProfile.ielts}`
        : "IELTS: зависит от языка программы",
      hasOfficialData ? "Источник указан в карточке" : "Данные требуют проверки на официальном сайте",
    ],
    exams: exams.length ? exams : ["Данные требуют проверки на официальном сайте"],
    documents: ["Паспорт", "Аттестат или транскрипт", "Сертификаты экзаменов", "Рекомендации", "Финансовые документы"],
    deadlines: university.deadlines.map((deadline) => `${deadline.intake}: ${deadline.month}`),
    admissionCriteria: ["Академическая готовность", "Английский", "Финансы", "Портфолио", "Соответствие программе"],
    sourceLinks: university.sourceUrl.startsWith("http") ? [university.sourceUrl] : [],
    lastUpdated,
    dataConfidence: university.dataConfidence,
    programs: university.programs,
    raw: university,
  };
}

function scoreAgainst(value: number, target?: number, fallback = 76) {
  if (!target) return fallback;
  if (!value) return 0;
  return clamp((value / target) * 100, 0, 100);
}

function characteristic(label: string, short: string, score: number, problem: string, why: string, action: string): Characteristic {
  const status = score >= 82 ? "strong" : score >= 64 ? "ok" : score > 0 ? "weak" : "missing";
  return { label, short, score, status, problem, why, action };
}

function chanceEngine(profile: StudentProfile, university: UniversityRecord | null): ChanceResult {
  if (!university || !profile.gpa || !profile.major) {
    return {
      score: 0,
      level: "Недостаточно данных",
      factors: ["Заполните профиль и выберите университет."],
      improvements: ["Добавьте GPA, направление и желаемый вуз."],
      characteristics: [],
    };
  }

  const raw = university.raw;
  const academic = clamp(
    scoreAgainst(profile.gpa, raw.admissionProfile.gpa, 70) * 0.48 +
      scoreAgainst(profile.sat, raw.admissionProfile.satTarget, raw.region === "KGZ" ? 78 : 62) * 0.3 +
      scoreAgainst(profile.ielts, raw.admissionProfile.ielts || undefined, raw.language.includes("English") ? 62 : 82) * 0.22,
  );
  const english = scoreAgainst(profile.ielts, raw.admissionProfile.ielts || undefined, raw.language.includes("English") ? 62 : 86);
  const finance = clamp((profile.budget / Math.max(university.tuition, 1)) * 85 + (raw.fundingStrength === "high" ? 24 : raw.fundingStrength === "medium" ? 12 : 0));
  const portfolio = clamp(profile.portfolio);
  const major = raw.programs.some((program) => program.toLowerCase().includes(profile.major.toLowerCase()) || profile.major.toLowerCase().includes(program.toLowerCase())) ? 92 : 62;
  const deadline = profile.deadline === "Сейчас" ? 58 : profile.deadline === "6 месяцев" ? 78 : 92;
  const wantedCountry = countryValue[profile.country] ?? profile.country;
  const destination = profile.country === "Любая" || wantedCountry === raw.country || (wantedCountry === "Kyrgyzstan" && raw.region === "KGZ") ? 92 : 68;
  const selectivityPenalty = raw.acceptanceRate.includes("Ultra") ? 12 : raw.acceptanceRate.includes("Highly") ? 7 : 0;
  const score = clamp(academic * 0.28 + english * 0.14 + finance * 0.18 + portfolio * 0.15 + major * 0.15 + deadline * 0.06 + destination * 0.04 - selectivityPenalty);

  const characteristics = [
    characteristic(
      "Академическая подготовка",
      "Учёба",
      academic,
      academic >= 82 ? "Сильная база." : "Оценки или экзамены ниже ориентира.",
      "Вузу важно видеть стабильность оценок и готовность к нагрузке.",
      "Поднимите самый слабый компонент: GPA, SAT или ОРТ.",
    ),
    characteristic(
      "Английский",
      "Язык",
      english,
      english >= 82 ? "Языковой риск низкий." : "IELTS/TOEFL может ограничить выбор программ.",
      "Английский влияет на поступление, визу, интервью и учебу.",
      "Сделайте 2 writing и 2 speaking тренировки в неделю.",
    ),
    characteristic(
      "Финансы",
      "Бюджет",
      finance,
      finance >= 82 ? "Бюджет выглядит устойчиво." : "Нужен грант или более доступный маршрут.",
      "Даже сильный offer не работает без финансового плана.",
      "Добавьте 3 high-aid вуза и подготовьте финансовые документы.",
    ),
    characteristic(
      "Портфолио",
      "Доказательства",
      portfolio,
      portfolio >= 82 ? "Есть сильное подтверждение интереса." : "Недостаточно доказательств вне оценок.",
      "Проекты, олимпиады и волонтёрство показывают мотивацию.",
      "Соберите один проект с результатом, ссылкой и коротким описанием.",
    ),
    characteristic(
      "Дедлайны",
      "Сроки",
      deadline,
      deadline >= 82 ? "Времени достаточно." : "Сроки могут стать главным риском.",
      "Документы, экзамены и эссе требуют времени.",
      "Составьте календарь: экзамены, документы, эссе, отправка.",
    ),
    characteristic(
      "Соответствие вузу",
      "Fit",
      clamp((major + destination) / 2),
      major >= 82 ? "Направление совпадает." : "Программа не идеально совпадает с целью.",
      "Fit показывает, насколько профиль логичен для выбранной программы.",
      "Уточните major или выберите вуз с более близкой программой.",
    ),
  ];

  const level: ChanceLevel = score >= 78 ? "Высокий шанс" : score >= 58 ? "Средний шанс" : "Низкий шанс";
  const weak = characteristics.filter((item) => item.status === "weak" || item.status === "missing").slice(0, 3);

  return {
    score,
    level,
    factors: characteristics
      .slice()
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => `${item.label}: ${Math.round(item.score)}/100`),
    improvements: weak.length ? weak.map((item) => item.action) : ["Проверьте дедлайны и официальный сайт перед подачей."],
    characteristics,
  };
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csv(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function universityHaystack(university: UniversityRecord) {
  return [
    university.id,
    university.name,
    university.englishName,
    university.raw.nameRu,
    university.country,
    university.raw.country,
    university.city,
    university.raw.focus,
    university.raw.tags.join(" "),
    university.programs.join(" "),
    university.programs.map((program) => programRu[program] ?? program).join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesCountry(profileCountry: string, university: UniversityRecord) {
  if (profileCountry === "Любая") return true;
  const rawCountry = countryValue[profileCountry] ?? profileCountry;
  return university.raw.country === rawCountry || (rawCountry === "Kyrgyzstan" && university.raw.region === "KGZ");
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(() => loadState(profileKey, defaultProfile));
  const [saved, setSaved] = useState<string[]>(() => loadState(savedKey, defaultSaved));
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("auca");
  const [view, setView] = useState<View>("characteristics");
  const [helpOpen, setHelpOpen] = useState(false);

  const universities = useMemo(() => ALL_UNIVERSITIES.map(normalizeUniversity), []);
  const selectedUniversity = universities.find((university) => university.id === selectedId) ?? universities[0] ?? null;
  const result = chanceEngine(profile, selectedUniversity);

  useEffect(() => {
    localStorage.setItem(profileKey, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(savedKey, JSON.stringify(saved));
  }, [saved]);

  const majors = useMemo(() => {
    const list = new Set<string>();
    universities.forEach((university) => university.programs.forEach((program) => list.add(program)));
    return Array.from(list).sort();
  }, [universities]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return universities.filter((university) => (!needle || universityHaystack(university).includes(needle)) && matchesCountry(profile.country, university));
  }, [universities, query, profile.country]);

  const savedUniversities = universities.filter((university) => saved.includes(university.id));

  const setField = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const navigate = (section: string, nextView?: View) => {
    if (nextView) setView(nextView);
    requestAnimationFrame(() => scrollToSection(section));
  };

  const checkChance = () => {
    const requested = profile.desiredUniversity.trim().toLowerCase();
    const found = requested ? universities.find((university) => universityHaystack(university).includes(requested)) : null;
    if (found) setSelectedId(found.id);
    else if (filtered[0]) setSelectedId(filtered[0].id);
    setView("characteristics");
    requestAnimationFrame(() => scrollToSection("university"));
  };

  const toggleSaved = (id: string) => {
    setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const exportStats = () => {
    const rows = [
      ["университет", "страна", "город", "шанс", "score", "стоимость", "данные"],
      ...universities.map((university) => {
        const chance = chanceEngine(profile, university);
        return [university.name, university.country, university.city, chance.level, Math.round(chance.score), university.tuition, confidenceRu(university.dataConfidence)];
      }),
    ];
    downloadFile("kadam-readiness-statistics.csv", rows.map((row) => row.map(csv).join(",")).join("\n"), "text/csv;charset=utf-8");
  };

  return (
    <div className="min-h-screen bg-[#071014] text-slate-950">
      <SideNav onNavigate={navigate} onHelp={() => setHelpOpen(true)} onExport={exportStats} />
      <MobileHeader onNavigate={navigate} onHelp={() => setHelpOpen(true)} />

      <main className="relative mx-auto max-w-[1480px] px-4 py-5 lg:ml-[286px] lg:px-7">
        <section id="profile" className="grid scroll-mt-6 gap-5 xl:grid-cols-[1fr_430px]">
          <Hero result={result} universitiesCount={universities.length} />
          <ProfileForm profile={profile} majors={majors} onChange={setField} onSubmit={checkChance} />
        </section>

        <section id="search" className="mt-5 grid scroll-mt-6 gap-5 xl:grid-cols-[1fr_390px]">
          <div className="rounded-[30px] border border-white/10 bg-white p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Найти университет, город или направление"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-extrabold outline-none transition focus:border-[#9cff00] focus:ring-4 focus:ring-[#cfff00]/20"
                />
              </div>
              <span className="rounded-full bg-[#071014] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#dfff45]">
                {filtered.length} вузов
              </span>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {filtered.slice(0, 8).map((university) => (
                <React.Fragment key={university.id}>
                  <UniversityCard
                    university={university}
                    active={selectedUniversity?.id === university.id}
                    saved={saved.includes(university.id)}
                    onOpen={() => {
                      setSelectedId(university.id);
                      requestAnimationFrame(() => scrollToSection("university"));
                    }}
                    onSave={() => toggleSaved(university.id)}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>

          <ChancePanel university={selectedUniversity} result={result} onHelp={() => setHelpOpen(true)} />
        </section>

        {selectedUniversity && (
          <section id="university" className="mt-5 grid scroll-mt-6 gap-5 xl:grid-cols-[1fr_440px]">
            <UniversityDetail university={selectedUniversity} />
            <section id="analysis" className="scroll-mt-6 rounded-[30px] border border-white/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              <Tabs view={view} onView={setView} />
              {view === "characteristics" && <Characteristics result={result} />}
              {view === "plan" && <PreparationPlan result={result} university={selectedUniversity} />}
              {view === "saved" && <SavedList universities={savedUniversities} onOpen={setSelectedId} onRemove={toggleSaved} />}
              {view === "compare" && <Compare universities={savedUniversities} profile={profile} />}
            </section>
          </section>
        )}
      </main>

      {helpOpen && <HelpModal result={result} university={selectedUniversity} onClose={() => setHelpOpen(false)} />}
    </div>
  );
}

function SideNav({
  onNavigate,
  onHelp,
  onExport,
}: {
  onNavigate: (section: string, view?: View) => void;
  onHelp: () => void;
  onExport: () => void;
}) {
  const items = [
    { label: "Профиль", icon: Home, section: "profile" },
    { label: "Поиск", icon: Search, section: "search" },
    { label: "Университет", icon: GraduationCap, section: "university" },
    { label: "Характеристика", icon: BarChart3, section: "analysis", view: "characteristics" as View },
    { label: "План", icon: ListChecks, section: "analysis", view: "plan" as View },
    { label: "Сохранённые", icon: Bookmark, section: "analysis", view: "saved" as View },
    { label: "Сравнение", icon: LayoutDashboard, section: "analysis", view: "compare" as View },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[286px] flex-col border-r border-white/10 bg-[#16242b] p-4 text-white lg:flex">
      <div className="flex items-center gap-3">
        <Logo />
        <div>
          <p className="text-2xl font-black tracking-tight">Kadam</p>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#dfff45]">поступление</p>
        </div>
      </div>

      <div className="mt-5 rounded-[22px] border border-white/10 bg-[#071014] p-3">
        <p className="text-xs font-bold text-slate-400">Личный кабинет</p>
        <p className="mt-1 text-lg font-black">Студент</p>
        <div className="mt-3 h-2 rounded-full bg-white/10">
          <div className="h-full w-2/3 rounded-full bg-[#cfff00]" />
        </div>
      </div>

      <nav className="mt-4 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.section, item.view)}
            className="group flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-extrabold text-slate-300 transition hover:bg-[#cfff00] hover:text-[#071014]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#cfff00] transition group-hover:border-[#071014]/10 group-hover:bg-[#071014]">
              <item.icon className="h-4 w-4" />
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-3 grid gap-2">
        <button onClick={onHelp} className="rounded-2xl border border-[#cfff00]/40 bg-[#cfff00] px-4 py-2.5 text-sm font-black text-[#071014]">
          Помощь
        </button>
        <button onClick={onExport} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-black text-white">
          <Download className="h-4 w-4" />
          Экспорт CSV
        </button>
      </div>
    </aside>
  );
}

function MobileHeader({ onNavigate, onHelp }: { onNavigate: (section: string, view?: View) => void; onHelp: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071014]/92 px-4 py-3 text-white backdrop-blur lg:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <p className="text-xl font-black">Kadam</p>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#dfff45]">поступление</p>
          </div>
        </div>
        <button onClick={onHelp} className="rounded-full bg-[#cfff00] px-4 py-2 text-xs font-black text-[#071014]">
          Помощь
        </button>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {[
          ["profile", "Профиль"],
          ["search", "Поиск"],
          ["university", "Вуз"],
          ["analysis", "Анализ"],
        ].map(([section, label]) => (
          <button key={section} onClick={() => onNavigate(section)} className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-slate-200">
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#cfff00] text-[#071014] shadow-[0_0_24px_rgba(207,255,0,0.35)]">
      <div className="absolute left-3 top-3 h-2 w-2 rounded-full bg-[#071014]" />
      <div className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-[#071014]" />
      <div className="h-5 w-5 rotate-45 rounded-sm border-l-4 border-t-4 border-[#071014]" />
    </div>
  );
}

function Hero({ result, universitiesCount }: { result: ChanceResult; universitiesCount: number }) {
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#f7f8f3] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] md:p-8">
      <div className="absolute right-0 top-0 h-28 w-28 border-b-[18px] border-l-[18px] border-[#dfff00]" />
      <span className="inline-flex rounded-full bg-[#071014] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#dfff45]">
        готовность к поступлению
      </span>
      <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.03] tracking-tight text-[#071014] md:text-6xl">
        Узнай шансы и получи понятный план.
      </h1>
      <p className="mt-4 max-w-2xl text-base font-bold leading-relaxed text-slate-600">
        Введите профиль, выберите вуз и сразу увидите шанс поступления, слабые места, диаграмму готовности и действия на ближайшие дни.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <HeroStat icon={ShieldCheck} label="Шанс" value={result.level} />
        <HeroStat icon={Target} label="Готовность" value={`${Math.round(result.score)}/100`} />
        <HeroStat icon={BookOpen} label="Вузов в базе" value={`${universitiesCount}`} />
      </div>
    </div>
  );
}

function HeroStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#071014] text-[#cfff00]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 truncate text-lg font-black text-[#071014]">{value}</p>
    </div>
  );
}

function ProfileForm({
  profile,
  majors,
  onChange,
  onSubmit,
}: {
  profile: StudentProfile;
  majors: string[];
  onChange: <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="rounded-[34px] border border-white/10 bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-black text-[#071014]">Профиль студента</p>
          <p className="text-sm font-bold text-slate-500">Минимум данных, максимум пользы.</p>
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
        <SelectField label="Дедлайн" value={profile.deadline} options={["Сейчас", "6 месяцев", "12 месяцев"]} onChange={(value) => onChange("deadline", value)} />
        <label>
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
      </div>

      <label className="mt-3 block">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Желаемый университет</span>
        <input
          value={profile.desiredUniversity}
          onChange={(event) => onChange("desiredUniversity", event.target.value)}
          placeholder="Например: MIT, AUCA, Назарбаев"
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold outline-none transition focus:border-[#9cff00] focus:ring-4 focus:ring-[#cfff00]/20"
        />
      </label>

      <button onClick={onSubmit} className="mt-4 w-full rounded-2xl bg-[#071014] px-4 py-4 text-sm font-black uppercase tracking-wide text-[#dfff45] transition hover:bg-[#16242b]">
        Проверить мои шансы
      </button>
    </section>
  );
}

function NumberField({
  label,
  value,
  step = 1,
  max,
  onChange,
}: {
  label: string;
  value: number;
  step?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</span>
      <input
        value={value}
        step={step}
        max={max}
        type="number"
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold outline-none transition focus:border-[#9cff00] focus:ring-4 focus:ring-[#cfff00]/20"
      />
    </label>
  );
}

function SelectField({
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

function UniversityCard({
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

function ImageBlock({ university, compact = false }: { university: UniversityRecord; compact?: boolean }) {
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

function ChancePanel({ university, result, onHelp }: { university: UniversityRecord | null; result: ChanceResult; onHelp: () => void }) {
  return (
    <aside className="rounded-[30px] border border-[#cfff00]/30 bg-[#16242b] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)] xl:sticky xl:top-5 xl:self-start">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#cfff00]">Твои шансы</p>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-5xl font-black">{Math.round(result.score)}</p>
          <p className="mt-1 text-sm font-bold text-slate-300">{university?.name}</p>
        </div>
        <span className={cn("rounded-full border px-3 py-1 text-xs font-black", chanceStyle[result.level])}>{result.level}</span>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[#cfff00]" style={{ width: `${clamp(result.score)}%` }} />
      </div>
      <div className="mt-5 grid gap-3">
        <MiniList title="Почему такой шанс?" items={result.factors} dark />
        <MiniList title="Что повысит шанс?" items={result.improvements.slice(0, 3)} dark />
      </div>
      <button onClick={onHelp} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#cfff00] px-4 py-3 text-sm font-black text-[#071014]">
        <HelpCircle className="h-4 w-4" />
        Помощь
      </button>
    </aside>
  );
}

function MiniList({ title, items, dark = false }: { title: string; items: string[]; dark?: boolean }) {
  return (
    <div>
      <p className={cn("text-xs font-black uppercase tracking-[0.18em]", dark ? "text-[#cfff00]" : "text-slate-400")}>{title}</p>
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <div key={item} className={cn("rounded-2xl p-3 text-sm font-bold leading-relaxed", dark ? "bg-white/8 text-slate-200" : "bg-slate-50 text-slate-600")}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function UniversityDetail({ university }: { university: UniversityRecord }) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <ImageBlock university={university} />
      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="rounded-full bg-[#dfff45] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#071014]">
              {confidenceRu(university.dataConfidence)}
            </span>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#071014]">{university.name}</h2>
            <p className="mt-1 text-sm font-extrabold text-slate-500">{university.englishName}</p>
            <p className="mt-2 text-sm font-bold text-slate-500">{university.city}, {university.country}</p>
          </div>
          {university.officialWebsite ? (
            <a href={university.officialWebsite} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#071014] px-4 py-3 text-xs font-black uppercase text-[#dfff45]">
              Источник
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : (
            <span className="rounded-full bg-slate-100 px-4 py-3 text-xs font-black uppercase text-slate-500">проверить сайт</span>
          )}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <DetailGroup title="Стоимость" icon={Wallet} items={[money(university.tuition)]} />
          <DetailGroup title="Экзамены" icon={Target} items={university.exams} />
          <DetailGroup title="Требования" icon={ShieldCheck} items={university.requirements} />
          <DetailGroup title="Дедлайны" icon={ListChecks} items={university.deadlines.length ? university.deadlines : ["Данные требуют проверки на официальном сайте"]} />
          <DetailGroup title="Документы" icon={BookOpen} items={university.documents} />
          <DetailGroup title="Стипендии" icon={Sparkles} items={university.scholarships} />
          <DetailGroup title="Критерии" icon={Compass} items={university.admissionCriteria} />
          <DetailGroup title="Ссылки" icon={ArrowUpRight} items={university.sourceLinks.length ? university.sourceLinks : ["Данные требуют проверки на официальном сайте"]} />
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          Обновлено: {university.lastUpdated} / {confidenceRu(university.dataConfidence)}
        </p>
      </div>
    </section>
  );
}

function DetailGroup({ title, icon: Icon, items }: { title: string; icon: React.ElementType; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#071014] text-[#cfff00]">
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{title}</p>
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.slice(0, 4).map((item) => (
          <li key={item} className="break-words text-sm font-bold leading-relaxed text-slate-700">{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Tabs({ view, onView }: { view: View; onView: (view: View) => void }) {
  const tabs: Array<[View, string]> = [
    ["characteristics", "Диаграмма"],
    ["plan", "План"],
    ["saved", "Сохранённые"],
    ["compare", "Сравнение"],
  ];

  return (
    <div className="grid grid-cols-2 gap-2 border-b border-slate-200 p-3 sm:grid-cols-4">
      {tabs.map(([id, label]) => (
        <button
          key={id}
          onClick={() => onView(id)}
          className={cn("rounded-2xl px-3 py-3 text-xs font-black transition", view === id ? "bg-[#071014] text-[#dfff45]" : "bg-slate-50 text-slate-500 hover:bg-slate-100")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Characteristics({ result }: { result: ChanceResult }) {
  const diagram = result.characteristics.map((item) => ({ label: item.short, score: Math.round(item.score), fill: statusColor[item.status] }));
  const strongest = result.characteristics.slice().sort((a, b) => b.score - a.score)[0];
  const weakest = result.characteristics.slice().sort((a, b) => a.score - b.score)[0];

  if (!result.characteristics.length) {
    return <p className="p-5 text-sm font-bold text-slate-500">Заполните профиль, чтобы увидеть характеристику.</p>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-[26px] bg-[#071014] p-4 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#cfff00]">индекс готовности</p>
            <p className="mt-2 text-4xl font-black">{Math.round(result.score)}/100</p>
          </div>
          <span className={cn("rounded-full border px-3 py-1 text-xs font-black", chanceStyle[result.level])}>{result.level}</span>
        </div>

        <div className="mt-3 h-[250px]">
          <ReadinessRadar data={diagram} />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <p className="rounded-2xl bg-white/8 p-3 text-sm font-bold text-slate-200">Сильная сторона: {strongest?.label}</p>
          <p className="rounded-2xl bg-white/8 p-3 text-sm font-bold text-slate-200">Главный риск: {weakest?.label}</p>
        </div>
      </div>

      <ReadinessBars data={diagram} />

      {result.characteristics.map((item) => (
        <div key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[#071014]">{item.label}</p>
              <p className="mt-1 text-sm font-bold text-slate-600">{item.problem}</p>
            </div>
            <span className="rounded-full px-3 py-1 text-xs font-black" style={{ backgroundColor: `${statusColor[item.status]}33`, color: item.status === "ok" ? "#92400E" : statusColor[item.status] }}>
              {statusText[item.status]}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full" style={{ width: `${clamp(item.score)}%`, backgroundColor: statusColor[item.status] }} />
          </div>
          <p className="mt-3 text-xs font-bold leading-relaxed text-slate-500">{item.why}</p>
          <p className="mt-2 text-sm font-black leading-relaxed text-[#071014]">{item.action}</p>
        </div>
      ))}
    </div>
  );
}

function ReadinessRadar({ data }: { data: Array<{ label: string; score: number; fill: string }> }) {
  const size = 250;
  const center = size / 2;
  const radius = 86;
  const total = data.length || 1;
  const point = (index: number, value = 100) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;
    const distance = (radius * value) / 100;
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    };
  };
  const polygon = data.map((item, index) => point(index, item.score)).map((dot) => `${dot.x},${dot.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" role="img" aria-label="Диаграмма готовности">
      {[25, 50, 75, 100].map((level) => (
        <polygon
          key={level}
          points={data.map((_, index) => point(index, level)).map((dot) => `${dot.x},${dot.y}`).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
        />
      ))}
      {data.map((item, index) => {
        const outer = point(index, 100);
        const label = point(index, 119);
        return (
          <g key={item.label}>
            <line x1={center} y1={center} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.14)" />
            <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fill="#dfff45" fontSize="11" fontWeight="900">
              {item.label}
            </text>
          </g>
        );
      })}
      <polygon points={polygon} fill="rgba(207,255,0,0.34)" stroke="#cfff00" strokeWidth="3" />
      {data.map((item, index) => {
        const dot = point(index, item.score);
        return <circle key={item.label} cx={dot.x} cy={dot.y} r="4" fill={item.fill} stroke="#071014" strokeWidth="2" />;
      })}
      <circle cx={center} cy={center} r="3" fill="#cfff00" />
    </svg>
  );
}

function ReadinessBars({ data }: { data: Array<{ label: string; score: number; fill: string }> }) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs font-black text-slate-500">
              <span>{item.label}</span>
              <span>{item.score}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full" style={{ width: `${clamp(item.score)}%`, backgroundColor: item.fill }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreparationPlan({ result, university }: { result: ChanceResult; university: UniversityRecord }) {
  const steps = [
    `Сегодня: откройте источник ${university.name} и проверьте дедлайны.`,
    ...result.improvements,
    "7 дней: соберите паспорт, транскрипт, сертификаты и список рекомендаций.",
    "30 дней: обновите портфолио и подготовьте черновик мотивационного письма.",
  ];

  return (
    <div className="space-y-3 p-4">
      {Array.from(new Set(steps)).slice(0, 6).map((step, index) => (
        <div key={step} className="flex gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#071014] text-sm font-black text-[#dfff45]">{index + 1}</div>
          <p className="text-sm font-extrabold leading-relaxed text-slate-700">{step}</p>
        </div>
      ))}
    </div>
  );
}

function SavedList({ universities, onOpen, onRemove }: { universities: UniversityRecord[]; onOpen: (id: string) => void; onRemove: (id: string) => void }) {
  return (
    <div className="space-y-3 p-4">
      {universities.map((university) => (
        <div key={university.id} className="flex items-center justify-between gap-3 rounded-[24px] bg-slate-50 p-3">
          <button onClick={() => onOpen(university.id)} className="min-w-0 text-left">
            <p className="truncate text-sm font-black text-[#071014]">{university.name}</p>
            <p className="text-xs font-bold text-slate-500">{university.country}</p>
          </button>
          <button onClick={() => onRemove(university.id)} className="rounded-full bg-white p-2 text-slate-500">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      {!universities.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Пока нет сохранённых вузов.</p>}
    </div>
  );
}

function Compare({ universities, profile }: { universities: UniversityRecord[]; profile: StudentProfile }) {
  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            <th className="py-3 pr-4">Вуз</th>
            <th className="py-3 pr-4">Шанс</th>
            <th className="py-3 pr-4">Стоимость</th>
            <th className="py-3 pr-4">Гранты</th>
          </tr>
        </thead>
        <tbody>
          {universities.map((university) => {
            const chance = chanceEngine(profile, university);
            return (
              <tr key={university.id} className="border-b border-slate-100">
                <td className="py-3 pr-4 font-black text-[#071014]">{university.name}</td>
                <td className="py-3 pr-4 font-bold">{chance.level}</td>
                <td className="py-3 pr-4 font-bold">{money(university.tuition)}</td>
                <td className="py-3 pr-4 font-bold">{university.scholarships[0]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!universities.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Сохраните несколько вузов, чтобы сравнить их.</p>}
    </div>
  );
}

function HelpModal({ result, university, onClose }: { result: ChanceResult; university: UniversityRecord | null; onClose: () => void }) {
  const blocks = [
    { title: "Сегодня", items: [`Откройте источник ${university?.name ?? "университета"}.`, "Проверьте дедлайн, экзамены и документы."] },
    { title: "7 дней", items: ["Закройте самый слабый пункт из диаграммы.", "Соберите паспорт, транскрипт, сертификаты и рекомендации."] },
    { title: "30 дней", items: ["Подтяните экзамен, который сильнее всего влияет на шанс.", "Сделайте один портфолио-проект или обновите существующее доказательство."] },
    { title: "Самый большой рост", items: result.improvements.slice(0, 3) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071014]/80 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-[#cfff00]/30 bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-[#071014]">Помощь</p>
            <p className="text-sm font-bold text-slate-500">{result.level} / {Math.round(result.score)}/100</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {blocks.map((block) => (
            <div key={block.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-[#071014]">{block.title}</p>
              <ul className="mt-2 space-y-2">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm font-bold leading-relaxed text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#89d800]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
