import { useEffect, useState } from "react";
import { getRole, setRole as persistRole, type Role } from "./data/plans";
import RoleScreen from "./entry/RoleScreen";
import StudentApp from "./student/StudentApp";
import MentorApp from "./mentor/MentorApp";

export default function App() {
  const [role, setRoleState] = useState<Role | null>(getRole);
  const [entered, setEntered] = useState(false);
  const [darkTheme, setDarkTheme] = useState(() => localStorage.getItem("kadam-theme-v1") === "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = darkTheme ? "dark" : "light";
    localStorage.setItem("kadam-theme-v1", darkTheme ? "dark" : "light");
  }, [darkTheme]);

  const pickRole = (next: Role) => {
    persistRole(next);
    setRoleState(next);
    setEntered(true);
  };

  const switchRole = () => {
    const next: Role = role === "mentor" ? "student" : "mentor";
    pickRole(next);
  };

  if (!entered) return <RoleScreen darkTheme={darkTheme} onToggleTheme={() => setDarkTheme((dark) => !dark)} onPick={pickRole} />;
  if (role === "student") return <StudentApp darkTheme={darkTheme} onToggleTheme={() => setDarkTheme((dark) => !dark)} onSwitchRole={switchRole} />;
  if (role === "mentor") return <MentorApp darkTheme={darkTheme} onToggleTheme={() => setDarkTheme((dark) => !dark)} onSwitchRole={switchRole} />;
  return <RoleScreen darkTheme={darkTheme} onToggleTheme={() => setDarkTheme((dark) => !dark)} onPick={pickRole} />;
}
