import { firestoreService } from '../lib/firestoreService';
import { db, auth } from '../lib/firebase';
import { orderBy } from 'firebase/firestore';
import { Profile } from '../types';

export const userService = {
  async getProfiles() {
    return firestoreService.getAll<Profile>('profiles', [
      orderBy('createdAt', 'desc')
    ]);
  },

  async updateProfile(id: string, updates: Partial<Profile>) {
    await firestoreService.update('profiles', id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return { id, ...updates };
  },

  async deleteProfile(id: string) {
    await firestoreService.delete('profiles', id);
  }
};
