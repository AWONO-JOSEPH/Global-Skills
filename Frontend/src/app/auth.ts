export type UserRole = "student" | "teacher" | "admin";

export function getCurrentAuth() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("gs_token");
  const role = localStorage.getItem("gs_role") as UserRole | null;
  const email = localStorage.getItem("gs_email");

  if (!token || !role || !email) return null;

  return { token, role, email };
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("gs_token");
  localStorage.removeItem("gs_role");
  localStorage.removeItem("gs_email");
}

