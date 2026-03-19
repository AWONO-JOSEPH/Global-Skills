const rawBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;

export function apiUrl(pathname: string): string {
  const base = (rawBase ?? "").trim().replace(/\/+$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return base ? `${base}${path}` : path;
}

