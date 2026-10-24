import { loadState, saveState } from "./localStorage";

export interface MentorProfile {
  name: string;
  specialization: string;
  countries: string;
  languages: string;
  about: string;
  slots: string;
  contacts: string;
}

const mentorProfileKey = "kadam-mentor-profile-v1";

export const defaultMentorProfile: MentorProfile = {
  name: "Айбек Молдоев",
  specialization: "Поступление в США и Великобританию",
  countries: "США, Великобритания, Кыргызстан",
  languages: "Кыргызский, русский, английский",
  about: "Помогаю студентам выстроить реалистичный план поступления и не терять дедлайны.",
  slots: "Вт, Чт 16:00–18:00",
  contacts: "mentor@qadam.app · Telegram @qadam_mentor",
};

export function loadMentorProfile(): MentorProfile {
  return loadState(mentorProfileKey, defaultMentorProfile);
}

export function saveMentorProfile(profile: MentorProfile) {
  saveState(mentorProfileKey, profile);
}

export function mentorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "М";
  return parts.slice(0, 2).map((part) => part[0]!.toUpperCase()).join("");
}
