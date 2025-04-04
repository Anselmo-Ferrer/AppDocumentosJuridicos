// instlar: npx expo install firebase
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  FIREBASE_API_KEY_DOCUMENTS,
  FIREBASE_AUTH_DOMAIN_DOCUMENTS,
  FIREBASE_PROJECT_ID_DOCUMENTS,
  FIREBASE_STORAGE_BUCKET_DOCUMENTS,
  FIREBASE_MESSAGING_SENDER_ID_DOCUMENTS,
  FIREBASE_APP_ID_DOCUMENTS
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY_DOCUMENTS,
  authDomain: FIREBASE_AUTH_DOMAIN_DOCUMENTS,
  projectId: FIREBASE_PROJECT_ID_DOCUMENTS,
  storageBucket: FIREBASE_STORAGE_BUCKET_DOCUMENTS,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID_DOCUMENTS,
  appId: FIREBASE_APP_ID_DOCUMENTS
};

const app = getApps().find(app => app.name === 'docsApp') || initializeApp(firebaseConfig, 'docsApp');
export const dbDocuments = getFirestore(app);