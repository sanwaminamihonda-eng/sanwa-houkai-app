import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@sanwa-houkai-app/dataconnect';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Skip initialization during build time when API key is not available
const isValidConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _dataConnect: DataConnect | null = null;

if (isValidConfig) {
  // Initialize Firebase
  _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  _auth = getAuth(_app);
  _db = getFirestore(_app);

  // Initialize Data Connect
  _dataConnect = getDataConnect(_app, connectorConfig);
}

// Runtime getters that throw if Firebase is not initialized
function getFirebaseApp(): FirebaseApp {
  if (!_app) throw new Error('Firebase is not initialized. Check environment variables.');
  return _app;
}

function getFirebaseAuth(): Auth {
  if (!_auth) throw new Error('Firebase Auth is not initialized. Check environment variables.');
  return _auth;
}

function getFirebaseDb(): Firestore {
  if (!_db) throw new Error('Firestore is not initialized. Check environment variables.');
  return _db;
}

function getFirebaseDataConnect(): DataConnect {
  if (!_dataConnect) throw new Error('Data Connect is not initialized. Check environment variables.');
  return _dataConnect;
}

// Export both direct references (nullable) and getter functions (non-nullable at runtime)
export const app = _app as FirebaseApp;
export const auth = _auth as Auth;
export const db = _db as Firestore;
export const dataConnect = _dataConnect as DataConnect;

export { getFirebaseApp, getFirebaseAuth, getFirebaseDb, getFirebaseDataConnect };
