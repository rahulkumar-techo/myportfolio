/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// Keep this config in sync with NEXT_PUBLIC_FIREBASE_* values.
firebase.initializeApp({
  apiKey: "AIzaSyB3HRTja3UFYPLOcLJHnDvJaNRHWoh_MF0",
  authDomain: "myportfolio-b4612.firebaseapp.com",
  projectId: "myportfolio-b4612",
  storageBucket: "myportfolio-b4612.firebasestorage.app",
  messagingSenderId: "983396163874",
  appId: "1:983396163874:web:6d2ff013d8598df8e7857b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || "Portfolio Update";
  const body = payload?.notification?.body || "New content is live.";
  const url = payload?.data?.url;

  self.registration.showNotification(title, {
    body,
    data: { url }
  });
});

self.addEventListener("notificationclick", (event) => {
  const url = event.notification?.data?.url;
  event.notification.close();

  if (url) {
    event.waitUntil(self.clients.openWindow(url));
  }
});
