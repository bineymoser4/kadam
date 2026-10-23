import { loadState, saveState, clearKeys } from "./localStorage";
import type { UniversityRecord } from "../university/normalize";

export type Role = "student" | "mentor";
export type TaskStatus = "to_do" | "submitted" | "needs_changes" | "approved";
export type PlanStatus = "draft" | "pending_review" | "approved";
export type MenteeStatus = "needs_review" | "stuck" | "slipping" | "on_track";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  evidenceText?: string;
  evidenceLink?: string;
  mentorComment?: string;
}

export interface Plan {
  id: string;
  studentName: string;
  isYou: boolean;
  universityId: string;
  universityName: string;
  officialWebsite: string;
  status: PlanStatus;
  createdAt: string;
  tasks: Task[];
}

const roleKey = "kadam-role-v1";
const plansKey = "kadam-plans-v1";

function seedTasks(approvedCount: number, extra?: Partial<Task>[]): Task[] {
  const base: Task[] = [
    { id: "t1", title: "Собрать документы: паспорт, аттестат, транскрипт", status: "to_do" },
    { id: "t2", title: "Сдать или пересдать языковой экзамен", status: "to_do" },
    { id: "t3", title: "Подготовить черновик мотивационного письма", status: "to_do" },
    { id: "t4", title: "Собрать 2 рекомендации от преподавателей", status: "to_do" },
    { id: "t5", title: "Подать заявку через официальный сайт", status: "to_do" },
  ];
  base.forEach((task, index) => {
    if (index < approvedCount) task.status = "approved";
  });
  extra?.forEach((patch, index) => {
    if (base[index]) Object.assign(base[index], patch);
  });
  return base;
}

function seedPlans(): Plan[] {
  return [
    {
      id: "demo-aiperi",
      studentName: "Айпери Б.",
      isYou: false,
      universityId: "auca",
      universityName: "Американский университет в Центральной Азии",
      officialWebsite: "https://kesiptanda.edu.gov.kg/ru/articles/4/",
      status: "approved",
      createdAt: "2026-04-02",
      tasks: seedTasks(3, [
        {},
        {},
        {},
        { status: "submitted", evidenceText: "Рекомендации собраны у двух преподавателей, прикладываю фото.", evidenceLink: "" },
        {},
      ]),
    },
    {
      id: "demo-nurlan",
      studentName: "Нурлан Т.",
      isYou: false,
      universityId: "nazarbayev",
      universityName: "Nazarbayev University",
      officialWebsite: "",
      status: "approved",
      createdAt: "2026-03-18",
      tasks: seedTasks(1, [
        {},
        { status: "needs_changes", evidenceText: "IELTS сдан на 5.5, ниже целевого.", mentorComment: "Нужно пересдать — запишись минимум за месяц до дедлайна." },
        {},
        {},
        {},
      ]),
    },
  ];
}

export function getRole(): Role | null {
  return loadState<Role | null>(roleKey, null);
}

export function setRole(role: Role | null) {
  saveState(roleKey, role);
}

export function getPlans(): Plan[] {
  return loadState<Plan[]>(plansKey, seedPlans());
}

function savePlans(plans: Plan[]) {
  saveState(plansKey, plans);
}

export function resetDemoData() {
  clearKeys([plansKey]);
  savePlans(seedPlans());
}

export function findYourPlan(universityId: string): Plan | undefined {
  return getPlans().find((plan) => plan.isYou && plan.universityId === universityId);
}

function buildTaskList(improvementActions: string[]): Task[] {
  const actions = improvementActions.slice(0, 2);
  return [
    { id: "t1", title: "Собрать документы: паспорт, аттестат, транскрипт", status: "to_do" },
    ...actions.map((action, index) => ({ id: `t${index + 2}`, title: action, status: "to_do" as TaskStatus })),
    { id: "t4", title: "Подготовить черновик мотивационного письма", status: "to_do" },
    { id: "t5", title: "Подать заявку через официальный сайт", status: "to_do" },
  ];
}

/** Creates (or returns the existing) draft plan for this university — no AI, a plain template. */
export function createOrGetPlanDraft(university: UniversityRecord, improvementActions: string[]): Plan {
  const plans = getPlans();
  const existing = plans.find((plan) => plan.isYou && plan.universityId === university.id);
  if (existing) return existing;

  const plan: Plan = {
    id: `you-${university.id}`,
    studentName: "Вы",
    isYou: true,
    universityId: university.id,
    universityName: university.name,
    officialWebsite: university.officialWebsite,
    status: "draft",
    createdAt: new Date().toISOString().slice(0, 10),
    tasks: buildTaskList(improvementActions),
  };
  savePlans([...plans, plan]);
  return plan;
}

export function sendPlanToMentor(planId: string) {
  const plans = getPlans();
  savePlans(plans.map((plan) => (plan.id === planId ? { ...plan, status: "pending_review" as PlanStatus } : plan)));
}

export function approvePlan(planId: string) {
  const plans = getPlans();
  savePlans(plans.map((plan) => (plan.id === planId ? { ...plan, status: "approved" as PlanStatus } : plan)));
}

export function submitEvidence(planId: string, taskId: string, evidence: { text: string; link: string }) {
  const plans = getPlans();
  savePlans(
    plans.map((plan) =>
      plan.id === planId
        ? {
            ...plan,
            tasks: plan.tasks.map((task) =>
              task.id === taskId ? { ...task, status: "submitted" as TaskStatus, evidenceText: evidence.text, evidenceLink: evidence.link, mentorComment: undefined } : task,
            ),
          }
        : plan,
    ),
  );
}

export function reviewEvidence(planId: string, taskId: string, decision: "approved" | "needs_changes", comment: string) {
  const plans = getPlans();
  savePlans(
    plans.map((plan) =>
      plan.id === planId
        ? {
            ...plan,
            tasks: plan.tasks.map((task) => (task.id === taskId ? { ...task, status: decision as TaskStatus, mentorComment: comment || undefined } : task)),
          }
        : plan,
    ),
  );
}

export function menteeStatus(plan: Plan): MenteeStatus {
  if (plan.status === "pending_review") return "needs_review";
  if (plan.tasks.some((task) => task.status === "needs_changes")) return "stuck";
  if (plan.tasks.some((task) => task.status === "submitted")) return "needs_review";
  if (!plan.tasks.some((task) => task.status === "approved")) return "slipping";
  return "on_track";
}

export const menteeStatusLabel: Record<MenteeStatus, string> = {
  needs_review: "ждёт проверки",
  stuck: "застрял",
  slipping: "нет прогресса",
  on_track: "в графике",
};

export const menteeStatusColor: Record<MenteeStatus, string> = {
  needs_review: "#FACC15",
  stuck: "#FB7185",
  slipping: "#F59E0B",
  on_track: "#7CFF00",
};
