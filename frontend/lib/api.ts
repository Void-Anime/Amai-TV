export function getApiBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.length > 0) return envUrl.replace(/\/$/, "");
  // In production on Vercel, prefer relative /api and use rewrites to proxy to backend
  if (process.env.NODE_ENV === "production") return "";
  // Local dev fallback
  return "http://localhost:4000";
}

