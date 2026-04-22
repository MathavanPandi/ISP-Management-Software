import { supabase } from '../lib/supabase';
import { ISPProvider, ISPPlan } from '../types';

export const ispService = {
  async getProviders() {
    const { data, error } = await supabase
      .from('isp_providers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return (data || []).map(p => ({
      id: p.id,
      name: p.name,
      supportContact: p.support_contact,
      portalUrl: p.portal_url,
      logo: p.logo_url
    })) as ISPProvider[];
  },

  async createProvider(provider: Partial<ISPProvider>) {
    const { data, error } = await supabase
      .from('isp_providers')
      .insert([{
        name: provider.name,
        support_contact: provider.supportContact,
        portal_url: provider.portalUrl,
        logo_url: provider.logo
      }])
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      supportContact: data.support_contact,
      portalUrl: data.portal_url,
      logo: data.logo_url
    } as ISPProvider;
  },

  async updateProvider(id: string, updates: Partial<ISPProvider>) {
    const { data, error } = await supabase
      .from('isp_providers')
      .update({
        name: updates.name,
        support_contact: updates.supportContact,
        portal_url: updates.portalUrl,
        logo_url: updates.logo
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      supportContact: data.support_contact,
      portalUrl: data.portal_url,
      logo: data.logo_url
    } as ISPProvider;
  },

  async getPlansByProvider(providerId: string) {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('provider_id', providerId)
      .order('price_base');
    
    if (error) throw error;
    
    return (data || []).map(p => ({
      id: p.id,
      providerId: p.provider_id,
      name: p.name,
      bandwidth: `${p.speed_mbps} Mbps`,
      amount: Number(p.price_base),
      billingCycle: p.validity_days >= 360 ? 'Yearly' : 
                    p.validity_days >= 180 ? 'Half-Yearly' :
                    p.validity_days >= 90 ? 'Quarterly' : 'Monthly'
    })) as ISPPlan[];
  },

  async createPlan(plan: Partial<ISPPlan>) {
    // Determine validity days and speed
    const validity = plan.billingCycle === 'Yearly' ? 365 :
                     plan.billingCycle === 'Half-Yearly' ? 180 :
                     plan.billingCycle === 'Quarterly' ? 90 : 30;
    
    const speed = parseInt(plan.bandwidth || '0') || 0;

    const { data, error } = await supabase
      .from('plans')
      .insert([{
        provider_id: plan.providerId,
        name: plan.name,
        speed_mbps: speed,
        price_base: plan.amount,
        validity_days: validity,
        data_limit_gb: null // Default to unlimited for now
      }])
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      providerId: data.provider_id,
      name: data.name,
      bandwidth: `${data.speed_mbps} Mbps`,
      amount: Number(data.price_base),
      billingCycle: plan.billingCycle
    } as ISPPlan;
  },

  async updatePlan(id: string, updates: Partial<ISPPlan>) {
    const patch: any = {
      name: updates.name,
      price_base: updates.amount,
    };

    if (updates.billingCycle) {
      patch.validity_days = updates.billingCycle === 'Yearly' ? 365 :
                           updates.billingCycle === 'Half-Yearly' ? 180 :
                           updates.billingCycle === 'Quarterly' ? 90 : 30;
    }

    if (updates.bandwidth) {
      patch.speed_mbps = parseInt(updates.bandwidth) || 0;
    }

    const { data, error } = await supabase
      .from('plans')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      providerId: data.provider_id,
      name: data.name,
      bandwidth: `${data.speed_mbps} Mbps`,
      amount: Number(data.price_base),
      billingCycle: updates.billingCycle || 'Monthly'
    } as ISPPlan;
  }
};
