import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Singleton instances
let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

function getFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    throw new Error('Firebase client SDK cannot be used on the server!');
  }

  if (_app) return _app;

  if (!getApps().length) {
    _app = initializeApp(firebaseConfig);
  } else {
    _app = getApp();
  }

  return _app;
}

export function getClientDb(): Firestore {
  if (typeof window === 'undefined') {
    throw new Error('getClientDb() called on the server.');
  }

  if (_db) return _db;

  const app = getFirebaseApp();
  _db = getFirestore(app);

  return _db;
}

export function getClientApp(): FirebaseApp {
  return getFirebaseApp();
}
