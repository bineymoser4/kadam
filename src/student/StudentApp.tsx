import { useMemo, useState } from "react";
import { allUniversityRecords } from "../university/normalize";
import { chanceEngine } from "../scoring/engine";
import { loadProfile, loadSaved, saveProfile, saveSaved, type StudentProfile } from "../data/profile";
import { allYourPlans, createOrGetPlanDraft, findYourPlan, sendPlanToMentor, submitEvidence, type PlanDocument } from "../data/plans";
import { StudentSideNav, StudentTabBar, StudentMobileHeader, type StudentView } from "./StudentNav";
import { CatalogPage } from "./CatalogPage";
import { UniversityPage } from "./UniversityPage";
import { PlanPage } from "./PlanPage";
import { SavedList, Compare } from "./SavedCompare";
import { ProfileForm } from "./ProfileForm";

export default function StudentApp({ onSwitchRole, darkTheme, onToggleTheme }: { onSwitchRole: () => void; darkTheme: boolean; onToggleTheme: () => void }) {
  const [profile, setProfile] = useState<StudentProfile>(loadProfile);
  const [saved, setSaved] = useState<string[]>(loadSaved);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<StudentView>("plan");
  const [plansTick, setPlansTick] = useState(0);

  const universities = allUniversityRecords;
  const selectedUniversity = universities.find((university) => university.id === selectedId) ?? null;
  const result = useMemo(() => chanceEngine(profile, selectedUniversity), [profile, selectedUniversity]);
  const yourPlan = useMemo(() => (selectedUniversity ? findYourPlan(selectedUniversity.id) : undefined), [selectedUniversity, plansTick]);

  const desiredUniversity = universities.find((university) => university.id === profile.desiredUniversityId) ?? universities[0] ?? null;
  const desiredResult = useMemo(() => chanceEngine(profile, desiredUniversity), [profile, desiredUniversity]);

  const allPlans = useMemo(() => allYourPlans(), [plansTick]);
  const savedUniversities = universities.filter((university) => saved.includes(university.id));

  const majors = useMemo(() => {
    const list = new Set<string>();
    universities.forEach((university) => university.programs.forEach((program) => list.add(program)));
    return Array.from(list).sort();
  }, [universities]);

  const setField = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => {
    setProfile((current) => {
      const next = { ...current, [field]: value };
      saveProfile(next);
      return next;
    });
  };

  const toggleSaved = (id: string) => {
    setSaved((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      saveSaved(next);
      return next;
    });
  };

  const navigate = (next: StudentView) => {
    if (next !== "university") setSelectedId(null);
    setView(next);
  };

  const openUniversity = (id: string) => {
    setSelectedId(id);
    setView("university");
  };

  const handleCreateAndSend = () => {
    if (!selectedUniversity) return;
    const plan = createOrGetPlanDraft(selectedUniversity, result.improvements);
    sendPlanToMentor(plan.id);
    setPlansTick((tick) => tick + 1);
  };

  const handleCreatePlan = (university: typeof universities[number], documents: PlanDocument[]) => {
    const universityResult = chanceEngine(profile, university);
    createOrGetPlanDraft(university, universityResult.improvements, documents);
    setPlansTick((tick) => tick + 1);
  };

  const handleSubmitEvidence = (taskId: string, evidence: { text: string; link: string }) => {
    if (!yourPlan) return;
    submitEvidence(yourPlan.id, taskId, evidence);
    setPlansTick((tick) => tick + 1);
  };

  return (
    <div className="min-h-screen text-[var(--color-ink)]">
      <StudentSideNav view={view} result={desiredResult} onNavigate={navigate} onSwitchRole={onSwitchRole} darkTheme={darkTheme} onToggleTheme={onToggleTheme} />
      <StudentMobileHeader onSwitchRole={onSwitchRole} darkTheme={darkTheme} onToggleTheme={onToggleTheme} />

      <main className="mx-auto max-w-[1200px] px-4 py-5 pb-20 lg:ml-[240px] lg:px-7 lg:pb-7">
        {view === "university" && selectedUniversity ? (
          <UniversityPage
            university={selectedUniversity}
            profile={profile}
            result={result}
            plan={yourPlan}
            saved={saved.includes(selectedUniversity.id)}
            onBack={() => navigate("catalog")}
            onToggleSave={() => toggleSaved(selectedUniversity.id)}
            onCreateAndSend={handleCreateAndSend}
            onSubmitEvidence={handleSubmitEvidence}
          />
        ) : view === "plan" ? (
          <PlanPage plans={allPlans} universities={universities} onOpenUniversity={openUniversity} onCreatePlan={handleCreatePlan} />
        ) : view === "saved" ? (
          <SavedList universities={savedUniversities} onOpen={openUniversity} onRemove={toggleSaved} />
        ) : view === "compare" ? (
          <Compare universities={savedUniversities} profile={profile} />
        ) : view === "profile" ? (
          <ProfileForm
            profile={profile}
            majors={majors}
            universityOptions={universities.map((university) => ({ id: university.id, name: university.name }))}
            onChange={setField}
            onSubmit={() => (desiredUniversity ? openUniversity(desiredUniversity.id) : navigate("catalog"))}
          />
        ) : (
          <CatalogPage profile={profile} saved={saved} onOpen={openUniversity} onToggleSave={toggleSaved} />
        )}
      </main>

      <StudentTabBar view={view} onNavigate={navigate} />
    </div>
  );
}
