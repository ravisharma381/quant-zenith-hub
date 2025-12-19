import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  type Firestore,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const functions = getFunctions(app, "asia-south1");
export const storage = getStorage(app);

// Avoid duplicate Firestore initialization across hot reloads / embedded previews.
const FIRESTORE_SINGLETON_KEY = "__quantprof_firestore__";
export const db: Firestore = (() => {
  const g = globalThis as unknown as Record<string, unknown>;
  const existing = g[FIRESTORE_SINGLETON_KEY] as Firestore | undefined;
  if (existing) return existing;

  try {
    const instance = initializeFirestore(app, {
      localCache: persistentLocalCache(),
    });
    g[FIRESTORE_SINGLETON_KEY] = instance;
    return instance;
  } catch (err) {
    // If persistence isn't available (common in some embedded previews), fall back.
    console.warn("Firestore persistence unavailable; falling back to default.", err);
    const instance = getFirestore(app);
    g[FIRESTORE_SINGLETON_KEY] = instance;
    return instance;
  }
})();

export default app;
