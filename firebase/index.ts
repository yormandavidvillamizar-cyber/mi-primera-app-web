import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let persistenceInitialized = false;

async function initializeFirebase() {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
  
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);

  if (!persistenceInitialized) {
    try {
      await enableIndexedDbPersistence(firestore);
      persistenceInitialized = true;
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        // This can happen if multiple tabs are open.
        // Persistence is already enabled in another tab. We can still proceed.
        persistenceInitialized = true; 
      } else if (err.code === 'unimplemented') {
        // The current browser does not support persistence.
        console.warn('Firestore persistence is not supported in this browser.');
      }
    }
  }

  return { firebaseApp, auth, firestore };
}

export { initializeFirebase };
export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
