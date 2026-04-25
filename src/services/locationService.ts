import { firestoreService } from '../lib/firestoreService';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { Location } from '../types';

export const locationService = {
  async getLocations() {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const locations = await firestoreService.getAll<any>('locations', [
      where('userId', '==', userId),
      orderBy('name')
    ]);
    
    return locations.map(item => ({
      ...item,
      daysRemaining: item.nextDueDate ? Math.ceil((new Date(item.nextDueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0,
    })) as any[];
  },

  async getLocationById(id: string) {
    return firestoreService.getOne<any>('locations', id);
  },

  async createLocation(location: Partial<Location>) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    return firestoreService.create('locations', {
      ...location,
      userId,
      status: location.status || 'Active',
      createdAt: new Date().toISOString()
    });
  },

  async updateLocation(id: string, updates: Partial<Location>) {
    await firestoreService.update('locations', id, updates);
    return { id, ...updates };
  },

  async deleteLocation(id: string) {
    await firestoreService.delete('locations', id);
  },

  async getUrgentRenewals(limitCount = 5) {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const locations = await firestoreService.getAll<any>('locations', [
      where('userId', '==', userId),
      orderBy('nextDueDate', 'asc'),
      limit(limitCount)
    ]);

    return locations.map(item => ({
      ...item,
      daysRemaining: item.nextDueDate ? Math.ceil((new Date(item.nextDueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0
    }));
  },

  async getDashboardStats() {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const locations = await firestoreService.getAll<any>('locations', [
      where('userId', '==', userId)
    ]);

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const payments = await firestoreService.getAll<any>('recharges', [
      where('initiatedBy', '==', userId),
      where('rechargeDate', '>=', startOfMonth)
    ]);

    const stats = {
      totalLocations: locations.length,
      activePlans: locations.filter(l => l.status === 'Active').length,
      overduePlans: locations.filter(l => l.status === 'Overdue').length,
      noBackupCount: locations.filter(l => !l.backupAvailable).length,
      monthlyCost: locations.reduce((acc, l) => acc + (l.amount || 0), 0),
      totalPaidMTD: payments.filter(p => p.paymentStatus === 'Success').reduce((acc, p) => acc + Number(p.total || 0), 0),
      pendingPayments: payments.filter(p => p.paymentStatus === 'Pending Approval').length,
      failedPayments: payments.filter(p => p.paymentStatus === 'Failed').length,
      dueSoon3Days: locations.filter(l => {
        const days = Math.ceil((new Date(l.nextDueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        return days >= 0 && days <= 3;
      }).length,
      dueSoon7Days: locations.filter(l => {
        const days = Math.ceil((new Date(l.nextDueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        return days > 3 && days <= 7;
      }).length,
    };

    return stats;
  }
};
