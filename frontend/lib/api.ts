export function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://amai-tv-68k2q4uug-shaan786lls-projects.vercel.app"
  );
}
