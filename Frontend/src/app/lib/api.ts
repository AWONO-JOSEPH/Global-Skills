const rawBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
const defaultProdBase = ((import.meta as any).env?.VITE_DEFAULT_API_BASE_URL as string | undefined)
  || "https://global-skills.onrender.com";

export function apiUrl(pathname: string): string {
  // Prefer `VITE_API_BASE_URL`. If not set:
  // - Local dev: relative paths (proxy / same host)
  // - Prod: use a safe default backend base (overrideable via `VITE_DEFAULT_API_BASE_URL`)
  const isLocalhost = typeof window !== "undefined"
    && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  const base = (rawBase || (isLocalhost ? "" : defaultProdBase)).trim().replace(/\/+$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return base ? `${base}${path}` : path;
}

/**
 * Centralized fetch function that automatically attaches the Bearer token
 * from localStorage and handles common headers.
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('auth_token');

  const headers: HeadersInit = {
    'Accept': 'application/json',
    ...(options.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  // If it's not FormData, default to JSON content type
  if (!(options.body instanceof FormData) && !headers.hasOwnProperty('Content-Type')) {
    (headers as any)['Content-Type'] = 'application/json';
  }

  return fetch(apiUrl(path), {
    ...options,
    headers,
  });
}
