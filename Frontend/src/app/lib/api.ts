const rawBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
const DEFAULT_PROD_URL = "https://global-skills.onrender.com";

export function apiUrl(pathname: string): string {
  const base = (rawBase || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? DEFAULT_PROD_URL : "")).trim().replace(/\/+$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return base ? `${base}${path}` : path;
}

