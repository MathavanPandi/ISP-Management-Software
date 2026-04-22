import { firestoreService } from '../lib/firestoreService';
import { db, auth } from '../lib/firebase';
import { orderBy } from 'firebase/firestore';
import { Role } from '../types';

export const roleService = {
  async getRoles() {
    return firestoreService.getAll<Role>('roles', [
      orderBy('name')
    ]);
  },

  async createRole(role: Partial<Role>) {
    return firestoreService.create<Role>('roles', role as Role);
  },

  async updateRole(id: string, updates: Partial<Role>) {
    await firestoreService.update('roles', id, updates);
    return { id, ...updates };
  },

  async deleteRole(id: string) {
    await firestoreService.delete('roles', id);
  }
};
