import type { StudentLevel } from "../data/profile";

export interface Scholarship {
  id: string;
  name: string;
  nameRu: string;
  provider: string;
  country: string;
  levels: StudentLevel[];
  funding: "Полное финансирование" | "Частичное финансирование";
  about: string;
  sourceUrl: string;
  verifiedDate: string;
  deadlineNote: string;
}

// Curated by hand, not scraped. Only well-established, publicly documented programs
// open to applicants of any nationality (including Kyrgyzstan) are listed. Exact GPA
// cut-offs, English-score thresholds and this cycle's deadline are deliberately NOT
// encoded as pass/fail rules here — those details change yearly and differ in how
// strictly they're enforced, so the eligibility engine marks them "?" (нужно проверить)
// rather than inventing a number. Verify every detail on the official page before acting.
export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "chevening",
    name: "Chevening Scholarship",
    nameRu: "Стипендия Chevening",
    provider: "Правительство Великобритании",
    country: "Великобритания",
    levels: ["Магистратура"],
    funding: "Полное финансирование",
    about: "Полностью финансируемая годовая магистратура в Великобритании для будущих лидеров; требует опыт работы.",
    sourceUrl: "https://www.chevening.org/",
    verifiedDate: "2026-05-09",
    deadlineNote: "Обычно открывается в августе, закрывается в начале ноября — уточните точные даты на сайте.",
  },
  {
    id: "fulbright",
    name: "Fulbright Foreign Student Program",
    nameRu: "Программа Fulbright",
    provider: "Правительство США",
    country: "США",
    levels: ["Магистратура"],
    funding: "Полное финансирование",
    about: "Магистратура или исследовательская программа в США с полным покрытием расходов.",
    sourceUrl: "https://foreign.fulbrightonline.org/",
    verifiedDate: "2026-05-09",
    deadlineNote: "Сроки устанавливает посольство США в стране заявителя — проверьте локальную страницу программы.",
  },
  {
    id: "daad",
    name: "DAAD Scholarships",
    nameRu: "Стипендии DAAD",
    provider: "DAAD (Германия)",
    country: "Германия",
    levels: ["Магистратура"],
    funding: "Полное финансирование",
    about: "Крупнейшая немецкая программа академических обменов — десятки стипендий для магистратуры и аспирантуры.",
    sourceUrl: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    verifiedDate: "2026-05-09",
    deadlineNote: "Дедлайны разные для каждой программы — проверьте карточку конкретной стипендии.",
  },
  {
    id: "turkiye-burslari",
    name: "Türkiye Bursları",
    nameRu: "Türkiye Bursları (Турецкие стипендии)",
    provider: "Правительство Турции",
    country: "Турция",
    levels: ["Бакалавриат", "Магистратура"],
    funding: "Полное финансирование",
    about: "Государственная программа Турции: обучение, жильё, стипендия и курсы турецкого языка для всех уровней.",
    sourceUrl: "https://turkiyeburslari.gov.tr/",
    verifiedDate: "2026-05-09",
    deadlineNote: "Приём заявок обычно в январе-феврале — проверьте текущий цикл на сайте.",
  },
  {
    id: "stipendium-hungaricum",
    name: "Stipendium Hungaricum",
    nameRu: "Stipendium Hungaricum",
    provider: "Правительство Венгрии",
    country: "Венгрия",
    levels: ["Бакалавриат", "Магистратура"],
    funding: "Полное финансирование",
    about: "Венгерская госпрограмма: обучение без оплаты, стипендия на жизнь и частичное покрытие жилья.",
    sourceUrl: "https://stipendiumhungaricum.hu/",
    verifiedDate: "2026-05-09",
    deadlineNote: "Обычно закрывается в середине января — уточните точную дату для текущего цикла.",
  },
  {
    id: "gks",
    name: "Global Korea Scholarship (GKS)",
    nameRu: "Global Korea Scholarship",
    provider: "Правительство Южной Кореи",
    country: "Южная Корея",
    levels: ["Бакалавриат", "Магистратура"],
    funding: "Полное финансирование",
    about: "Южнокорейская госстипендия: обучение, перелёт, стипендия и языковые курсы перед программой.",
    sourceUrl: "https://www.studyinkorea.go.kr/",
    verifiedDate: "2026-05-09",
    deadlineNote: "Приём обычно проходит через посольство Кореи весной — проверьте локальные сроки.",
  },
  {
    id: "csc",
    name: "Chinese Government Scholarship (CSC)",
    nameRu: "Стипендия правительства Китая (CSC)",
    provider: "Правительство Китая",
    country: "Китай",
    levels: ["Бакалавриат", "Магистратура"],
    funding: "Полное финансирование",
    about: "Китайская госстипендия на обучение в партнёрских университетах по всей стране.",
    sourceUrl: "https://www.campuschina.org/",
    verifiedDate: "2026-05-09",
    deadlineNote: "Сроки зависят от выбранного университета и обычно приходятся на весну — проверьте напрямую.",
  },
  {
    id: "erasmus-mundus",
    name: "Erasmus Mundus Joint Master Degrees",
    nameRu: "Erasmus Mundus (совместная магистратура)",
    provider: "Европейский союз",
    country: "Евросоюз",
    levels: ["Магистратура"],
    funding: "Полное финансирование",
    about: "Магистратура на базе нескольких европейских университетов с полным грантом ЕС.",
    sourceUrl: "https://www.eacea.ec.europa.eu/scholarships/emjmd-catalogue_en",
    verifiedDate: "2026-05-09",
    deadlineNote: "Каждая программа задаёт свой дедлайн, обычно зима — проверьте карточку программы в каталоге.",
  },
  {
    id: "yenching",
    name: "Yenching Academy Scholarship",
    nameRu: "Стипендия Yenching Academy",
    provider: "Пекинский университет",
    country: "Китай",
    levels: ["Магистратура"],
    funding: "Полное финансирование",
    about: "Полностью финансируемая магистратура по китаеведению и глобальным вопросам в Пекинском университете.",
    sourceUrl: "https://yenchingacademy.pku.edu.cn/",
    verifiedDate: "2026-05-09",
    deadlineNote: "Обычно закрывается в начале декабря — проверьте точную дату на сайте.",
  },
  {
    id: "kg-state-grant",
    name: "Государственный грант КР",
    nameRu: "Государственный образовательный грант Кыргызской Республики",
    provider: "Министерство образования и науки КР",
    country: "Кыргызстан",
    levels: ["Бакалавриат"],
    funding: "Частичное финансирование",
    about: "Ежегодные государственные грантовые места в кыргызских вузах по результатам ОРТ.",
    sourceUrl: "https://kesiptanda.edu.gov.kg/",
    verifiedDate: "2026-05-09",
    deadlineNote: "Нужно проверить: пороги ОРТ и число мест публикуются отдельно на каждый год — не зафиксированы здесь.",
  },
];
