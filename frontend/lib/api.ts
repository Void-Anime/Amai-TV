export function getApiBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.length > 0) return envUrl.replace(/\/$/, "");
  // Default backend URL (your deployment)
  const defaultBackend = "https://amai-tv-mnklmteux-shaan786lls-projects.vercel.app";
  if (process.env.NODE_ENV === "production") return defaultBackend;
  // Local dev fallback
  return "http://localhost:4000";
}

