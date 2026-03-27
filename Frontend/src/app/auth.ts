export type UserRole = "student" | "teacher" | "admin";

export function getCurrentAuth() {
  if (typeof window === "undefined") return null;

  const role = localStorage.getItem("gs_role") as UserRole | null;
  const email = localStorage.getItem("gs_email");

  if (!role || !email) return null;

  return { role, email };
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("gs_role");
  localStorage.removeItem("gs_email");
}

