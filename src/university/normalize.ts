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

const universityImages: Record<string, ImageMeta> = {
  "knu-balasagyn": { url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/KNU_1.jpg", credit: "Wikimedia Commons" },
  "kstu-razzakov": { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/April_2012._Kyrgyz_State_Technical_University_named_after_I._Razzakov_-_panoramio.jpg/960px-April_2012._Kyrgyz_State_Technical_University_named_after_I._Razzakov_-_panoramio.jpg", credit: "Wikimedia Commons" },
  "manas-university": { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Manas_University.jpg/960px-Manas_University.jpg", credit: "Wikimedia Commons" },
  "krsu-yeltsin": { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Kyrgyz-Russian_Slavic_University.jpg/960px-Kyrgyz-Russian_Slavic_University.jpg", credit: "Wikimedia Commons" },
  auca: { url: "https://upload.wikimedia.org/wikipedia/commons/8/89/American_University_of_Central_Asia%2C_Bishkek_%282005%29.jpg", credit: "Wikimedia Commons" },
  alatoo: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Main_campus_of_IAAU.JPG/960px-Main_campus_of_IAAU.JPG", credit: "Wikimedia Commons" },
  "uca-naryn": { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/University_of_Central_Asia_Naryn_Campus_aerial_shot.jpg/960px-University_of_Central_Asia_Naryn_Campus_aerial_shot.jpg", credit: "Wikimedia Commons" },
  "osh-state": { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Osh_state_university.jpg/960px-Osh_state_university.jpg", credit: "Wikimedia Commons" },
  mit: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Great_dome_of_MIT%2C_Feb_2021_%282%29_%28cropped%29.jpg/960px-Great_dome_of_MIT%2C_Feb_2021_%282%29_%28cropped%29.jpg", credit: "Wikimedia Commons" },
  imperial: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Royal_School_of_Mines_Imperial_College_London_2020_01.jpg/960px-Royal_School_of_Mines_Imperial_College_London_2020_01.jpg", credit: "Wikimedia Commons" },
  stanford: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Stanford_University_Main_Quad_May_2011_002.jpg/960px-Stanford_University_Main_Quad_May_2011_002.jpg", credit: "Wikimedia Commons" },
  oxford: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Radcliffe_Camera%2C_Oxford_-_Oct_2006.jpg/960px-Radcliffe_Camera%2C_Oxford_-_Oct_2006.jpg", credit: "Wikimedia Commons" },
  harvard: { url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/HarvardYard.jpg", credit: "Wikimedia Commons" },
  cambridge: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Kings_College_Cambridge_Chapel_from_the_river.jpg/960px-Kings_College_Cambridge_Chapel_from_the_river.jpg", credit: "Wikimedia Commons" },
  "eth-zurich": { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH_Zurich%2C_Main_building.jpg/960px-ETH_Zurich%2C_Main_building.jpg", credit: "Wikimedia Commons" },
  nus: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/National_University_of_Singapore%2C_panorama%2C_Nov_06.jpg/960px-National_University_of_Singapore%2C_panorama%2C_Nov_06.jpg", credit: "Wikimedia Commons" },
  ucl: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Wilkins_Building%2C_University_College_London.jpg/960px-Wilkins_Building%2C_University_College_London.jpg", credit: "Wikimedia Commons" },
  caltech: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/California_Institute_of_Technology%2C_Pasadena%2C_California_%2814516438274%29.jpg/960px-California_Institute_of_Technology%2C_Pasadena%2C_California_%2814516438274%29.jpg", credit: "Wikimedia Commons" },
  toronto: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/University_College%2C_University_of_Toronto.jpg/960px-University_College%2C_University_of_Toronto.jpg", credit: "Wikimedia Commons" },
  nazarbayev: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Nazarbayev_University%2C_School_of_Science_and_Technology.jpg/960px-Nazarbayev_University%2C_School_of_Science_and_Technology.jpg", credit: "Wikimedia Commons" },
  amherst: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Amherst_College_Main_Quad.jpg/960px-Amherst_College_Main_Quad.jpg", credit: "Wikimedia Commons" },
  berea: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Berea_Campus_image_%2813408551233%29.jpg/960px-Berea_Campus_image_%2813408551233%29.jpg", credit: "Wikimedia Commons" },
  bowdoin: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Massachusetts_Hall%2C_Bowdoin_College.jpg/960px-Massachusetts_Hall%2C_Bowdoin_College.jpg", credit: "Wikimedia Commons" },
  brown: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Brown_University_-_Main_Campus_02.jpg/960px-Brown_University_-_Main_Campus_02.jpg", credit: "Wikimedia Commons" },
  grinnell: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Campus_walkway_at_Grinnell_College_in_Grinnell%2C_Iowa_01.jpg/960px-Campus_walkway_at_Grinnell_College_in_Grinnell%2C_Iowa_01.jpg", credit: "Wikimedia Commons" },
  "johns-hopkins": { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/East_Gate_of_Johns_Hopkins_University_Homewood_Campus_%282016%2C_Dec%29.jpg/960px-East_Gate_of_Johns_Hopkins_University_Homewood_Campus_%282016%2C_Dec%29.jpg", credit: "Wikimedia Commons" },
  northwestern: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Northwestern_University_campus%2C_Evanston%2C_IL.jpg/960px-Northwestern_University_campus%2C_Evanston%2C_IL.jpg", credit: "Wikimedia Commons" },
  pomona: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Pomona_College_-_Claremont_Colleges.jpg/960px-Pomona_College_-_Claremont_Colleges.jpg", credit: "Wikimedia Commons" },
  princeton: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Nassau_Hall%2C_Princeton_University%2C_Princeton_NJ.jpg/960px-Nassau_Hall%2C_Princeton_University%2C_Princeton_NJ.jpg", credit: "Wikimedia Commons" },
  smith: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Smith_College_Campus_view.jpg/960px-Smith_College_Campus_view.jpg", credit: "Wikimedia Commons" },
  swarthmore: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Parrish_Hall.jpg/960px-Parrish_Hall.jpg", credit: "Wikimedia Commons" },
  uchicago: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/University_of_Chicago_main_quadrangles.jpg/960px-University_of_Chicago_main_quadrangles.jpg", credit: "Wikimedia Commons" },
  upenn: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/University_of_Pennsylvania_Campus_20240528.jpg/960px-University_of_Pennsylvania_Campus_20240528.jpg", credit: "Wikimedia Commons" },
  williams: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Campus%2C_Williams_College%2C_Williamstown%2C_Mass_%28NYPL_b12647398-67704%29.tiff/lossy-page1-960px-Campus%2C_Williams_College%2C_Williamstown%2C_Mass_%28NYPL_b12647398-67704%29.tiff.jpg", credit: "Wikimedia Commons" },
  yale: { url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/2014-04-17-Yale-Old-Campus-Courtyard-Harkness-Tower.jpg/960px-2014-04-17-Yale-Old-Campus-Courtyard-Harkness-Tower.jpg", credit: "Wikimedia Commons" },
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
