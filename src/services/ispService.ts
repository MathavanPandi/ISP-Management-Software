import { firestoreService } from '../lib/firestoreService';
import { db, auth } from '../lib/firebase';
import { where, orderBy } from 'firebase/firestore';
import { ISPProvider, ISPPlan } from '../types';

export const ispService = {
  async getProviders() {
    return firestoreService.getAll<ISPProvider>('providers', [
      orderBy('name')
    ]);
  },

  async createProvider(provider: Partial<ISPProvider>) {
    return firestoreService.create<ISPProvider>('providers', provider as ISPProvider);
  },

  async updateProvider(id: string, updates: Partial<ISPProvider>) {
    await firestoreService.update<ISPProvider>('providers', id, updates);
    return { id, ...updates } as ISPProvider;
  },

  async getPlansByProvider(providerId: string) {
    return firestoreService.getAll<ISPPlan>('plans', [
      where('providerId', '==', providerId),
      orderBy('amount')
    ]);
  },

  async createPlan(plan: Partial<ISPPlan>) {
    return firestoreService.create<ISPPlan>('plans', plan as ISPPlan);
  },

  async updatePlan(id: string, updates: Partial<ISPPlan>) {
    await firestoreService.update<ISPPlan>('plans', id, updates);
    return { id, ...updates } as ISPPlan;
  }
};
