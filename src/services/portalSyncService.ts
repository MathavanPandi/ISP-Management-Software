import { supabase } from '../lib/supabase';

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
    // Simulate real sync logic
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const { data: provider } = await supabase.from('isp_providers').select('*').eq('id', providerId).single();
    if (!provider) throw new Error('Provider not found');

    const providerName = provider.name.toLowerCase();
    
    let discoveredLocations: any[] = [];
    let discoveredPlans: any[] = [];

    if (providerName.includes('airtel')) {
      discoveredLocations = [
        {
          name: 'Bengaluru MG Road Office',
          branch_type: 'Office',
          city: 'Bengaluru',
          state: 'Karnataka',
          address: '123 MG Road, Bengaluru',
          isp_provider_id: providerId,
          account_id: 'AIR-KAR-9901',
          registered_mobile: authValue,
          status: 'Active',
          next_due_date: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
        }
      ];
      discoveredPlans = [
        {
          provider_id: providerId,
          name: 'Airtel Xstream Fiber 200Mbps',
          speed_mbps: 200,
          price_base: 999,
          validity_days: 30,
        }
      ];
    } else if (providerName.includes('jio')) {
      discoveredLocations = [
        {
          name: 'Mumbai HQ Office',
          branch_type: 'Office',
          city: 'Mumbai',
          state: 'Maharashtra',
          address: 'Reliance Corporate Park, Navi Mumbai',
          isp_provider_id: providerId,
          account_id: 'JIO-MUM-8822',
          registered_email: authType === 'credentials' ? authValue : undefined,
          status: 'Active',
          next_due_date: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString(),
        }
      ];
      discoveredPlans = [
        {
          provider_id: providerId,
          name: 'JioFiber Gold 1Gbps',
          speed_mbps: 1000,
          price_base: 2499,
          validity_days: 30,
        }
      ];
    } else if (providerName.includes('act')) {
      discoveredLocations = [
        {
          name: 'Bengaluru Indiranagar Branch',
          branch_type: 'Office',
          city: 'Bengaluru',
          state: 'Karnataka',
          address: '80ft Road, Indiranagar',
          isp_provider_id: providerId,
          account_id: 'ACT-BLR-1122',
          registered_mobile: authValue,
          status: 'Active',
          next_due_date: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
        }
      ];
      discoveredPlans = [
        {
          provider_id: providerId,
          name: 'ACT Incredible 150Mbps',
          speed_mbps: 150,
          price_base: 1159,
          validity_days: 30,
        }
      ];
    }

    // 4. Upsert discovered plans
    for (const plan of discoveredPlans) {
      await supabase.from('plans').upsert(plan, { onConflict: 'name, provider_id' });
    }

    // 5. Upsert discovered locations
    for (const loc of discoveredLocations) {
      const { data: syncedPlan } = await supabase.from('plans')
        .select('id')
        .eq('name', discoveredPlans[0].name)
        .eq('provider_id', providerId)
        .single();

      await supabase.from('locations').upsert({
        ...loc,
        plan_id: syncedPlan?.id
      }, { onConflict: 'account_id' });
    }

    return {
      locationsSynced: discoveredLocations.length,
      plansUpdated: discoveredPlans.length,
    };
  }
};
