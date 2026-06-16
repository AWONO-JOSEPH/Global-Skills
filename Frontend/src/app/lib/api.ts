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
  // Déconnexion du backend : retourne des données simulées au lieu de faire un fetch réel
  console.log(`API Fetch simulé pour : ${path}`);
  
  let data: any = [];
  
  if (path.includes("/api/news")) {
    data = []; // Les actualités sont gérées localement dans news.tsx si nécessaire
  } else if (path.includes("/api/profile")) {
    data = { first_name: "Visiteur", last_name: "", role: "guest" };
  } else if (path.includes("/api/formations")) {
    data = []; // Les formations sont déjà dans src/app/data/formations.ts
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
