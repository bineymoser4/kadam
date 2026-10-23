import { useState } from "react";
import { getRole, setRole as persistRole, type Role } from "./data/plans";
import RoleScreen from "./entry/RoleScreen";
import StudentApp from "./student/StudentApp";
import MentorApp from "./mentor/MentorApp";

export default function App() {
  const [role, setRoleState] = useState<Role | null>(getRole);

  const pickRole = (next: Role) => {
    persistRole(next);
    setRoleState(next);
  };

  const switchRole = () => {
    const next: Role = role === "mentor" ? "student" : "mentor";
    pickRole(next);
  };

  if (role === "student") return <StudentApp onSwitchRole={switchRole} />;
  if (role === "mentor") return <MentorApp onSwitchRole={switchRole} />;
  return <RoleScreen onPick={pickRole} />;
}
