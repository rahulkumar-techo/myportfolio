export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? ""
  };
}

function buildServiceWorkerScript(config: Record<string, string>) {
  return `
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

const firebaseConfig = ${JSON.stringify(config)};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || "Portfolio Update";
  const body = payload?.notification?.body || "New content is live.";
  const dataUrl = payload?.data?.url || "/";

  self.registration.showNotification(title, {
    body,
    data: { url: dataUrl }
  });
});

self.addEventListener("notificationclick", (event) => {
  const url = event.notification?.data?.url;
  event.notification.close();
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
`;
}

export async function GET() {
  const config = buildFirebaseConfig();
  const body = buildServiceWorkerScript(config);

  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
