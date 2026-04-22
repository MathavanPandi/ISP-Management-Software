import { firestoreService } from '../lib/firestoreService';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

export const portalSyncService = {
  async sendOTP(mobile: string, provider: string) {
    console.log(`Requesting OTP for ${mobile} via ${provider}`);
    // Simulate API call
    return new Promise((resolve) => setTimeout(resolve, 1500));
  },

  async syncWithCredentials(username: string, providerId: string) {
    console.log(`Syncing with credentials: ${username} for provider ${providerId}`);
    return this.performSync('credentials', username, providerId);
  },

  async verifyOTPAndSync(mobile: string, otp: string, providerId: string) {
    console.log(`Verifying OTP ${otp} for ${mobile} on provider ${providerId}`);
    if (otp !== '123456') {
      throw new Error('Invalid OTP. Please use the code shown in the test alert (123456).');
    }
    return this.performSync('mobile', mobile, providerId);
  },

  async performSync(authType: 'credentials' | 'mobile', authValue: string, providerId: string) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    // Simulate real sync logic
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const provider = await firestoreService.getOne<any>('providers', providerId);
    if (!provider) throw new Error('Provider not found');

    const providerName = provider.name.toLowerCase();
    
    let discoveredLocations: any[] = [];
    let discoveredPlans: any[] = [];

    if (providerName.includes('airtel')) {
      discoveredLocations = [
        {
          name: 'Bengaluru MG Road Office',
          branchType: 'Office',
          city: 'Bengaluru',
          state: 'Karnataka',
          address: '123 MG Road, Bengaluru',
          ispProviderId: providerId,
          accountId: 'AIR-KAR-9901',
          registeredMobile: authValue,
          status: 'Active',
          nextDueDate: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
        }
      ];
      discoveredPlans = [
        {
          providerId: providerId,
          name: 'Airtel Xstream Fiber 200Mbps',
          bandwidth: '200 Mbps',
          amount: 999,
          billingCycle: 'Monthly',
        }
      ];
    } else if (providerName.includes('jio')) {
      discoveredLocations = [
        {
          name: 'Mumbai HQ Office',
          branchType: 'Office',
          city: 'Mumbai',
          state: 'Maharashtra',
          address: 'Reliance Corporate Park, Navi Mumbai',
          ispProviderId: providerId,
          accountId: 'JIO-MUM-8822',
          registeredEmail: authType === 'credentials' ? authValue : undefined,
          status: 'Active',
          nextDueDate: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString(),
        }
      ];
      discoveredPlans = [
        {
          providerId: providerId,
          name: 'JioFiber Gold 1Gbps',
          bandwidth: '1000 Mbps',
          amount: 2499,
          billingCycle: 'Monthly',
        }
      ];
    } else if (providerName.includes('act')) {
      discoveredLocations = [
        {
          name: 'Bengaluru Indiranagar Branch',
          branchType: 'Office',
          city: 'Bengaluru',
          state: 'Karnataka',
          address: '80ft Road, Indiranagar',
          ispProviderId: providerId,
          accountId: 'ACT-BLR-1122',
          registeredMobile: authValue,
          status: 'Active',
          nextDueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
        }
      ];
      discoveredPlans = [
        {
          providerId: providerId,
          name: 'ACT Incredible 150Mbps',
          bandwidth: '150 Mbps',
          amount: 1159,
          billingCycle: 'Monthly',
        }
      ];
    }

    // 4. Save discovered plans
    for (const plan of discoveredPlans) {
      await firestoreService.create('plans', plan);
    }

    // 5. Save discovered locations
    for (const loc of discoveredLocations) {
      const plans = await firestoreService.getAll<any>('plans', [
        where('name', '==', discoveredPlans[0].name),
        where('providerId', '==', providerId)
      ]);
      const syncedPlan = plans[0];

      await firestoreService.create('locations', {
        ...loc,
        userId,
        planId: syncedPlan?.id
      });
    }

    return {
      locationsSynced: discoveredLocations.length,
      plansUpdated: discoveredPlans.length,
    };
  }
};
