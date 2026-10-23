import { ALL_UNIVERSITIES, type University } from "../constants";

export interface ImageMeta {
  url: string;
  credit: string;
}

export interface UniversityRecord {
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

const lastUpdated = "2026-05-09";

export const countryOptions = ["Любая", "Кыргызстан", "США", "Казахстан", "Великобритания", "Германия", "Канада", "Турция"];

export const countryRu: Record<string, string> = {
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

export const countryValue: Record<string, string> = {
  Кыргызстан: "Kyrgyzstan",
  США: "United States",
  Казахстан: "Kazakhstan",
  Великобритания: "United Kingdom",
  Германия: "Germany",
  Канада: "Canada",
  Турция: "Türkiye",
};

export const programRu: Record<string, string> = {
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

const commons = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1200`;

const universityImages: Record<string, ImageMeta> = {
  "knu-balasagyn": { url: commons("KNU 1.jpg"), credit: "Wikimedia Commons" },
  "kstu-razzakov": { url: commons("April 2012. Kyrgyz State Technical University named after I. Razzakov - panoramio.jpg"), credit: "Wikimedia Commons" },
  "ksma-akhunbaev": { url: commons("Kyrgyz State Medical Academy.jpg"), credit: "Wikimedia Commons" },
  "manas-university": { url: commons("Manas University.jpg"), credit: "Wikimedia Commons" },
  auca: { url: commons("American University of Central Asia, Bishkek (2005).jpg"), credit: "Wikimedia Commons" },
  alatoo: { url: commons("Main campus of IAAU.JPG"), credit: "Wikimedia Commons" },
  "uca-naryn": { url: commons("University of Central Asia Naryn Campus aerial shot.jpg"), credit: "Wikimedia Commons" },
  "osh-state": { url: commons("Osh state university.jpg"), credit: "Wikimedia Commons" },
  mit: { url: commons("Great dome of MIT, Feb 2021 (2) (cropped).jpg"), credit: "Wikimedia Commons" },
  imperial: { url: commons("Imperial College London - South Kensington Campus.jpg"), credit: "Wikimedia Commons" },
  stanford: { url: commons("Stanford University Main Quad May 2011 002.jpg"), credit: "Wikimedia Commons" },
  oxford: { url: commons("Radcliffe Camera, Oxford - Oct 2006.jpg"), credit: "Wikimedia Commons" },
  harvard: { url: commons("Harvard University - Harvard Yard.JPG"), credit: "Wikimedia Commons" },
  cambridge: { url: commons("Kings College Chapel Cambridge.jpg"), credit: "Wikimedia Commons" },
  "eth-zurich": { url: commons("ETH Zurich Zentrum.jpg"), credit: "Wikimedia Commons" },
  nus: { url: commons("National University of Singapore University Hall.jpg"), credit: "Wikimedia Commons" },
  ucl: { url: commons("University College London - Wilkins Building.jpg"), credit: "Wikimedia Commons" },
  caltech: { url: commons("California Institute of Technology campus.jpg"), credit: "Wikimedia Commons" },
  toronto: { url: commons("University College, University of Toronto.jpg"), credit: "Wikimedia Commons" },
  tum: { url: commons("Technische Universität München - Hauptgebäude.jpg"), credit: "Wikimedia Commons" },
  nazarbayev: { url: commons("Nazarbayev University, School of Science and Technology.jpg"), credit: "Wikimedia Commons" },
  koc: { url: commons("Koç University campus.jpg"), credit: "Wikimedia Commons" },
  amherst: { url: commons("Amherst College Main Quad.jpg"), credit: "Wikimedia Commons" },
  berea: { url: commons("Berea College campus.jpg"), credit: "Wikimedia Commons" },
  princeton: { url: commons("Princeton University Nassau Hall.jpg"), credit: "Wikimedia Commons" },
  yale: { url: commons("Yale University - Harkness Tower.jpg"), credit: "Wikimedia Commons" },
};

export function confidenceRu(value: string) {
  if (value === "official") return "официальные данные";
  if (value === "reported") return "данные из источников";
  return "нужно проверить";
}

export function normalizeUniversity(university: University): UniversityRecord {
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

export const allUniversityRecords: UniversityRecord[] = ALL_UNIVERSITIES.map(normalizeUniversity);

export function universityHaystack(university: UniversityRecord) {
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

export function matchesCountry(profileCountry: string, university: UniversityRecord) {
  if (profileCountry === "Любая") return true;
  const rawCountry = countryValue[profileCountry] ?? profileCountry;
  return university.raw.country === rawCountry || (rawCountry === "Kyrgyzstan" && university.raw.region === "KGZ");
}
