import { loadState, saveState } from "./localStorage";
import type { OrtTrackId, BenefitCategoryId } from "../scholarships/ortThresholds";

export type StudentLevel = "Школа" | "Бакалавриат" | "Магистратура";

export interface StudentProfile {
  gpa: number | null;
  sat: number | null;
  ielts: number | null;
  budget: number | null;
  country: string;
  major: string;
  level: StudentLevel;
  deadline: string;
  portfolio: number;
  desiredUniversityId: string | null;
  ort: number | null;
  ortTrack: OrtTrackId;
  benefitCategory: BenefitCategoryId;
}

export const profileKey = "kadam-profile-v5";
export const savedKey = "kadam-saved-v5";

export const defaultProfile: StudentProfile = {
  gpa: 3.45,
  sat: 1260,
  ielts: 6.5,
  budget: 9000,
  country: "Любая",
  major: "Computer Science",
  level: "Бакалавриат",
  deadline: "6 месяцев",
  portfolio: 58,
  desiredUniversityId: "auca",
  ort: null,
  ortTrack: "general",
  benefitCategory: "none",
};

export const defaultSaved = ["auca", "berea", "amherst"];

export function loadProfile(): StudentProfile {
  return loadState(profileKey, defaultProfile);
}

export function saveProfile(profile: StudentProfile) {
  saveState(profileKey, profile);
}

export function loadSaved(): string[] {
  return loadState(savedKey, defaultSaved);
}

export function saveSaved(saved: string[]) {
  saveState(savedKey, saved);
}
