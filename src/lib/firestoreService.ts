import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db, auth } from './firebase';

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: any[];
  }
}

export function handleFirestoreError(error: any, operationType: any, path: string | null = null): never {
  const currentUser = auth.currentUser;
  
  const errorInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : (typeof error === 'object' && error?.message) ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: currentUser?.uid || 'anonymous',
      email: currentUser?.email || 'none',
      emailVerified: currentUser?.emailVerified || false,
      isAnonymous: currentUser?.isAnonymous || true,
      providerInfo: currentUser?.providerData?.map(p => ({
        providerId: p.providerId,
        displayName: p.displayName,
        email: p.email
      })) || []
    }
  };

  throw new Error(JSON.stringify(errorInfo));
}

export const firestoreService = {
  async getOne<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T : null;
    } catch (error) {
      return handleFirestoreError(error, 'get', `${collectionName}/${id}`);
    }
  },

  async getAll<T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const colRef = collection(db, collectionName);
      const q = query(colRef, ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
    } catch (error) {
      return handleFirestoreError(error, 'list', collectionName);
    }
  },

  async create<T extends { id?: string }>(collectionName: string, data: T): Promise<T> {
    try {
      const id = data.id || doc(collection(db, collectionName)).id;
      const docRef = doc(db, collectionName, id);
      const finalData = { ...data, id };
      await setDoc(docRef, finalData);
      return finalData;
    } catch (error) {
      return handleFirestoreError(error, 'create', collectionName);
    }
  },

  async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data as DocumentData);
    } catch (error) {
      return handleFirestoreError(error, 'update', `${collectionName}/${id}`);
    }
  },

  async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      return handleFirestoreError(error, 'delete', `${collectionName}/${id}`);
    }
  }
};
