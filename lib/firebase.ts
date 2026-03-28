import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyB3HRTja3UFYPLOcLJHnDvJaNRHWoh_MF0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "myportfolio-b4612.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "myportfolio-b4612",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "myportfolio-b4612.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "983396163874",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:983396163874:web:6d2ff013d8598df8e7857b",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-PSJGJML845"
};

let firebaseApp: FirebaseApp | null = null;

export function getFirebaseApp() {
  if (!firebaseApp) {
    firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }

  return firebaseApp;
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.apiKey) return null;

  const supported = await isSupported();
  if (!supported) return null;

  const app = getFirebaseApp();
  return getMessaging(app);
}
