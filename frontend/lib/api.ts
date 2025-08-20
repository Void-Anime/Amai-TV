export function getApiBaseUrl() {
  // In browser, use relative URLs to work with Next.js rewrites
  if (typeof window !== "undefined") {
    return "";
  }
  
  // In server-side rendering, use the environment variable
  if (typeof process !== "undefined") {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl && envUrl.length > 0) return envUrl.replace(/\/$/, "");
  }
  return "http://localhost:4000";
}

