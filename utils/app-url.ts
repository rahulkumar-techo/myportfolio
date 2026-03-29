const DEV_FALLBACK_URL = "http://localhost:3000";

export function getAppBaseUrl() {
  const env = process.env.NODE_ENV;

  if (env === "development") {
    const devUrl = process.env.NEXT_PUBLIC_APP_URL_DEV;
    return devUrl && devUrl.trim().length > 0 ? devUrl.trim() : DEV_FALLBACK_URL;
  }

  const prodUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (prodUrl && prodUrl.trim().length > 0) {
    return prodUrl.trim();
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl && vercelUrl.trim().length > 0) {
    return `https://${vercelUrl.trim()}`;
  }

  return "";
}
