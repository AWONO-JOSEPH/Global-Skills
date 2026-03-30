const rawBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
const DEFAULT_PROD_URL = "https://global-skills.onrender.com";

export function apiUrl(pathname: string): string {
  const base = (rawBase || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? DEFAULT_PROD_URL : "")).trim().replace(/\/+$/, "");
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
