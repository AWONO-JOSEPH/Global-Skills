import { apiFetch } from './lib/api';

export type UserRole = "student" | "teacher" | "admin";

export interface User {
  name: string;
  email: string;
  role: UserRole;
  must_change_password?: boolean;
}

export function getCurrentAuth() {
  if (typeof window === "undefined") return null;

  const role = localStorage.getItem("gs_role") as UserRole | null;
  const email = localStorage.getItem("gs_email");
  const token = localStorage.getItem("auth_token");

  if (!role || !email || !token) return null;

  return { role, email, token };
}

export function saveAuth(token: string, user: User) {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("gs_role", user.role);
  localStorage.setItem("gs_email", user.email);
  localStorage.setItem("gs_user", JSON.stringify(user));
}

export async function logout() {
  if (typeof window === "undefined") return;
  
  try {
    await apiFetch('/api/logout', { method: 'POST' });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("gs_role");
    localStorage.removeItem("gs_email");
    localStorage.removeItem("gs_user");
  }
}

export function getUser(): User | null {
  const userJson = localStorage.getItem("gs_user");
  return userJson ? JSON.parse(userJson) : null;
}

export function getToken() {
  return localStorage.getItem("auth_token");
}
