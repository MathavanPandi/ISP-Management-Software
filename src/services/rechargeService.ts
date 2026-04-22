import { firestoreService } from '../lib/firestoreService';
import { db, auth } from '../lib/firebase';
import { where, orderBy } from 'firebase/firestore';
import { RechargeTransaction } from '../types';

export const rechargeService = {
  async getRecharges() {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const recharges = await firestoreService.getAll<any>('recharges', [
      where('initiatedBy', '==', userId),
      orderBy('rechargeDate', 'desc')
    ]);
    
    return recharges;
  },

  async createRecharge(payment: any) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    
    return firestoreService.create('recharges', {
      ...payment,
      initiatedBy: userId,
      rechargeDate: new Date().toISOString(),
      paymentStatus: 'Success'
    });
  },

  async getISPDistribution() {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const locations = await firestoreService.getAll<any>('locations', [
      where('userId', '==', userId)
    ]);

    const distribution: Record<string, number> = {};
    const providers = await firestoreService.getAll<any>('providers');

    locations.forEach(item => {
      const provider = providers.find(p => p.id === item.ispProviderId);
      const name = provider?.name || 'Unknown';
      distribution[name] = (distribution[name] || 0) + 1;
    });

    const total = locations.length;
    return Object.entries(distribution).map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    })).sort((a, b) => b.count - a.count);
  },

  async getExpenditureTrend(type: 'Daily' | 'Monthly' | 'Yearly') {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const recharges = await firestoreService.getAll<any>('recharges', [
      where('initiatedBy', '==', userId),
      where('paymentStatus', '==', 'Success'),
      orderBy('rechargeDate')
    ]);
    
    if (!recharges || recharges.length === 0) return [];

    const trend: Record<string, number> = {};
    recharges.forEach(p => {
      const date = new Date(p.rechargeDate);
      let key = '';
      if (type === 'Daily') key = date.toLocaleDateString('en-US', { weekday: 'short' });
      else if (type === 'Monthly') key = date.toLocaleDateString('en-US', { month: 'short' });
      else key = date.getFullYear().toString();

      trend[key] = (trend[key] || 0) + Number(p.amount);
    });

    return Object.entries(trend).map(([name, actual]) => ({
      name,
      actual,
      budget: actual * 1.1 // Mock budget for now
    }));
  }
};
