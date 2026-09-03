import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID?.trim();

export const firebaseConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
);
const app = firebaseConfigured ? initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
export const db = app
  ? databaseId
    ? getFirestore(app, databaseId)
    : getFirestore(app)
  : null;
export const storage = app ? getStorage(app) : null;

export const requireFirebase = () => {
  if (!firebaseConfigured || !db)
    throw new Error(
      "This form is not connected yet. Please configure Firebase before accepting submissions.",
    );
};
