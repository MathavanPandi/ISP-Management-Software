import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { handleFirestoreError } from './firestoreService';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore with long polling to ensure connection in restricted environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();

// Critical directive: Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection established.');
  } catch (error) {
    console.error('Firebase Connection Error:', error);
    try {
      handleFirestoreError(error, 'get', 'test/connection');
    } catch (e: any) {
      console.error('System Permission Error:', e.message);
    }
    
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Firebase Error: The client is offline. Please check your configuration.');
    }
    // If it's unavailable, log a more specific warning
    if (error && typeof error === 'object' && 'code' in error && error.code === 'unavailable') {
      console.warn('Firestore service is currently unavailable. This might be a transient network issue or the database is still provisioning.');
    }
  }
}

if (process.env.NODE_ENV !== 'test') {
  testConnection();
}
