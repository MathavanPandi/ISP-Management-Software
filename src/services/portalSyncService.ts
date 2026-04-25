import { firestoreService } from '../lib/firestoreService';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

export const portalSyncService = {
  async sendOTP(mobile: string, provider: string) {
    const response = await fetch('/api/sync/otp-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, provider }),
    });
    if (!response.ok) throw new Error('Automation server failed to request OTP');
    return response.json();
  },

  async checkBridgeOTP(mobile: string) {
    const response = await fetch(`/api/sync/check-otp?mobile=${encodeURIComponent(mobile)}`);
    if (!response.ok) return { found: false };
    return response.json();
  },

  async getBridgeStatus() {
    const response = await fetch('/api/sync/bridge-status');
    if (!response.ok) return { online: false };
    return response.json();
  },

  async scanBill(base64Image: string, mimeType: string) {
    const { GoogleGenAI, Type } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
            {
              text: "Extract ISP plan details from this image. Return the following fields: providerName, planName, bandwidth (e.g. 100Mbps), amount (number), rechargeDate (DD/MM/YYYY), validUntil (DD/MM/YYYY), and accountId. If a field is not found, leave it as null.",
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              providerName: { type: Type.STRING },
              planName: { type: Type.STRING },
              bandwidth: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              rechargeDate: { type: Type.STRING },
              validUntil: { type: Type.STRING },
              accountId: { type: Type.STRING }
            }
          }
        }
      });

      const extracted = JSON.parse(response.text || "{}");
      return extracted;
    } catch (err) {
      console.error("AI Scan Error:", err);
      throw new Error("Failed to extract data from image");
    }
  },

  async syncWithCredentials(username: string, providerId: string) {
    // Similarly update credentials flow if implemented on backend
    return this.performSync('credentials', username, providerId);
  },

  async verifyOTPAndSync(mobile: string, otp: string, providerId: string) {
    // Get provider details first to pass to backend
    const provider = await firestoreService.getOne<any>('providers', providerId);
    
    const response = await fetch('/api/sync/verify-and-fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        mobile, 
        otp, 
        providerId, 
        providerName: provider?.name || 'Unknown' 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Automation failed');
    }

    const { data: discovered } = await response.json();
    const userId = auth.currentUser?.uid;

    if (!userId) throw new Error('User not authenticated');

    // Save discovered plans
    for (const plan of discovered.plans) {
      await firestoreService.create('plans', plan);
    }

    // Save discovered locations
    for (const loc of discovered.locations) {
      // Find the associated plan
      const plans = await firestoreService.getAll<any>('plans', [
        where('name', '==', discovered.plans[0].name),
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
      locationsSynced: discovered.locations.length,
      plansUpdated: discovered.plans.length,
    };
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
