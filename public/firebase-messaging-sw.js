/* eslint-disable no-undef */

importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js");
const firebaseConfig = {
  apiKey: "AIzaSyB3HRTja3UFYPLOcLJHnDvJaNRHWoh_MF0",
  authDomain: "myportfolio-b4612.firebaseapp.com",
  projectId: "myportfolio-b4612",
  storageBucket: "myportfolio-b4612.firebasestorage.app",
  messagingSenderId: "983396163874",
  appId: "1:983396163874:web:6d2ff013d8598df8e7857b",
  measurementId: "G-PSJGJML845"
};

try {
  if (firebaseConfig.apiKey) {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const notification = payload?.notification || {};
      const title = notification.title || "New notification";
      const options = {
        body: notification.body || "",
        icon: notification.icon || "/logo.png",
        data: payload?.data || {}
      };

      self.registration.showNotification(title, options);
    });
  } else {
    console.warn("Firebase messaging disabled: missing config.");
  }
} catch (err) {
  console.error("Firebase messaging service worker failed to initialize.", err);
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification?.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client && client.url === target) {
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(target);
      }

      return undefined;
    })
  );
});
