import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { allUniversityRecords, confidenceRu, matchesCountry, universityHaystack } from "../university/normalize";
import { chanceEngine } from "../scoring/engine";
import { loadProfile, loadSaved, saveProfile, saveSaved, type StudentProfile } from "../data/profile";
import { createOrGetPlanDraft, findYourPlan, sendPlanToMentor, submitEvidence } from "../data/plans";
import { downloadFile, csv, scrollToSection } from "../shared/format";
import { SideNav, MobileHeader } from "./SideNav";
import { Hero } from "./Hero";
import { ProfileForm } from "./ProfileForm";
import { UniversityCard } from "./UniversityCard";
import { UniversityDetail } from "./UniversityDetail";
import { ChancePanel } from "./ChancePanel";
import { Characteristics } from "./Characteristics";
import { PlanTasks } from "./PlanTasks";
import { ScholarshipsPanel } from "./Scholarships";
import { SavedList, Compare } from "./SavedCompare";
import { HelpModal } from "./HelpModal";
import { Tabs, type View } from "./Tabs";

export default function StudentApp({ onSwitchRole }: { onSwitchRole: () => void }) {
  const [profile, setProfile] = useState<StudentProfile>(loadProfile);
  const [saved, setSaved] = useState<string[]>(loadSaved);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(profile.desiredUniversityId ?? "auca");
  const [view, setView] = useState<View>("characteristics");
  const [helpOpen, setHelpOpen] = useState(false);
  const [plansTick, setPlansTick] = useState(0);

  const universities = allUniversityRecords;
  const selectedUniversity = universities.find((university) => university.id === selectedId) ?? universities[0] ?? null;
  const result = useMemo(() => chanceEngine(profile, selectedUniversity), [profile, selectedUniversity]);
  const yourPlan = useMemo(() => (selectedUniversity ? findYourPlan(selectedUniversity.id) : undefined), [selectedUniversity, plansTick]);

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
    setProfile((current) => {
      const next = { ...current, [field]: value };
      saveProfile(next);
      return next;
    });
  };

  const navigate = (section: string, nextView?: View) => {
    if (nextView) setView(nextView);
    requestAnimationFrame(() => scrollToSection(section));
  };

  const checkChance = () => {
    const found = profile.desiredUniversityId ? universities.find((university) => university.id === profile.desiredUniversityId) : null;
    setSelectedId(found?.id ?? filtered[0]?.id ?? selectedId);
    setView("characteristics");
    requestAnimationFrame(() => scrollToSection("university"));
  };

  const toggleSaved = (id: string) => {
    setSaved((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      saveSaved(next);
      return next;
    });
  };

  const exportStats = () => {
    const rows = [
      ["университет", "страна", "город", "шанс", "score", "стоимость", "данные"],
      ...universities.map((university) => {
        const chance = chanceEngine(profile, university);
        return [university.name, university.country, university.city, chance.level, chance.score == null ? "—" : Math.round(chance.score), university.tuition, confidenceRu(university.dataConfidence)];
      }),
    ];
    downloadFile("kadam-readiness-statistics.csv", rows.map((row) => row.map(csv).join(",")).join("\n"), "text/csv;charset=utf-8");
  };

  const handleCreateAndSend = () => {
    if (!selectedUniversity) return;
    const plan = createOrGetPlanDraft(selectedUniversity, result.improvements);
    sendPlanToMentor(plan.id);
    setPlansTick((tick) => tick + 1);
    setView("plan");
  };

  const handleSubmitEvidence = (taskId: string, evidence: { text: string; link: string }) => {
    if (!yourPlan) return;
    submitEvidence(yourPlan.id, taskId, evidence);
    setPlansTick((tick) => tick + 1);
  };

  return (
    <div className="min-h-screen bg-[#071014] text-slate-950">
      <SideNav onNavigate={navigate} onHelp={() => setHelpOpen(true)} onExport={exportStats} onSwitchRole={onSwitchRole} />
      <MobileHeader onNavigate={navigate} onHelp={() => setHelpOpen(true)} onSwitchRole={onSwitchRole} />

      <main className="relative mx-auto max-w-[1480px] px-4 py-5 lg:ml-[286px] lg:px-7">
        <section id="profile" className="grid scroll-mt-6 gap-5 xl:grid-cols-[1fr_430px]">
          <Hero result={result} universitiesCount={universities.length} />
          <ProfileForm
            profile={profile}
            majors={majors}
            universityOptions={universities.map((university) => ({ id: university.id, name: university.name }))}
            onChange={setField}
            onSubmit={checkChance}
          />
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
              {view === "plan" && (
                <PlanTasks result={result} university={selectedUniversity} plan={yourPlan} onCreateAndSend={handleCreateAndSend} onSubmitEvidence={handleSubmitEvidence} />
              )}
              {view === "scholarships" && <ScholarshipsPanel profile={profile} />}
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
