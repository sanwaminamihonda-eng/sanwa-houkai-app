import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDataConnect } from 'firebase/data-connect';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { connectorConfig } from '@sanwa-houkai-app/dataconnect';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth
const auth = getAuth(app);

// Initialize Data Connect
const dataConnect = getDataConnect(app, connectorConfig);

// Initialize Functions (asia-northeast1)
const functions = getFunctions(app, 'asia-northeast1');

export { app, auth, dataConnect, functions, httpsCallable };
