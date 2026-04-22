import { supabase } from '../lib/supabase';
import { Location } from '../types';

export const locationService = {
  async getLocations() {
    const { data, error } = await supabase
      .from('locations')
      .select(`
        *,
        isp_providers (name),
        plans (name, speed_mbps, price_base, validity_days)
      `)
      .order('name');
    
    if (error) throw error;
    
    return (data || []).map(item => {
      const provider = Array.isArray(item.isp_providers) ? item.isp_providers[0] : item.isp_providers;
      const plan = Array.isArray(item.plans) ? item.plans[0] : item.plans;
      
      return {
        id: item.id,
        name: item.name,
        branchType: item.branch_type,
        city: item.city,
        state: item.state,
        address: item.address,
        ispProviderId: item.isp_provider_id,
        planId: item.plan_id,
        accountId: item.account_id,
        registeredMobile: item.registered_mobile,
        registeredEmail: item.registered_email,
        status: item.status,
        lastRechargeDate: item.last_recharge_date,
        nextDueDate: item.next_due_date,
        daysRemaining: item.next_due_date ? Math.ceil((new Date(item.next_due_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0,
        ispProviderName: provider?.name,
        planName: plan?.name,
        amount: plan?.price_base ? Number(plan.price_base) : 0,
        billingCycle: plan?.validity_days >= 360 ? 'Yearly' : 
                      plan?.validity_days >= 180 ? 'Half-Yearly' :
                      plan?.validity_days >= 90 ? 'Quarterly' : 'Monthly'
      };
    }) as any[];
 
  },

  async getLocationById(id: string) {
    const { data, error } = await supabase
      .from('locations')
      .select(`
        *,
        isp_providers (*),
        plans (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return {
      ...data,
      branchType: data.branch_type,
      ispProviderId: data.isp_provider_id,
      planId: data.plan_id,
      accountId: data.account_id,
      registeredMobile: data.registered_mobile,
      registeredEmail: data.registered_email
    };
  },

  async createLocation(location: Partial<Location>) {
    const { data, error } = await supabase
      .from('locations')
      .insert([{
        name: location.name,
        branch_type: location.branchType,
        city: location.city,
        state: location.state,
        address: location.address,
        isp_provider_id: location.ispProviderId,
        plan_id: location.planId,
        account_id: location.accountId,
        registered_mobile: location.registeredMobile,
        registered_email: location.registeredEmail,
        status: location.status || 'Active'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateLocation(id: string, updates: Partial<Location>) {
    const { data, error } = await supabase
      .from('locations')
      .update({
        name: updates.name,
        branch_type: updates.branchType,
        city: updates.city,
        state: updates.state,
        address: updates.address,
        isp_provider_id: updates.ispProviderId,
        plan_id: updates.planId,
        account_id: updates.accountId,
        registered_mobile: updates.registeredMobile,
        registered_email: updates.registeredEmail,
        status: updates.status
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUrgentRenewals(limit = 5) {
    const { data, error } = await supabase
      .from('locations')
      .select(`
        *,
        isp_providers (name),
        plans (name)
      `)
      .order('next_due_date', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(item => ({
      ...item,
      ispProviderName: item.isp_providers?.name,
      planName: item.plans?.name,
      daysRemaining: Math.ceil((new Date(item.next_due_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    }));
  },

  async getDashboardStats() {
    const { data: locations, error: locError } = await supabase.from('locations').select('status, plans(price_base), backup_available, next_due_date');
    if (locError) throw locError;

    const { data: payments, error: payError } = await supabase
      .from('payments')
      .select('amount, status, payment_date')
      .gte('payment_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
    if (payError) throw payError;

    const stats = {
      totalLocations: locations.length,
      activePlans: locations.filter(l => l.status === 'Active').length,
      overduePlans: locations.filter(l => l.status === 'Overdue').length,
      noBackupCount: locations.filter(l => !l.backup_available).length,
      monthlyCost: (locations as any[]).reduce((acc, l) => {
        const plan = Array.isArray(l.plans) ? l.plans[0] : l.plans;
        return acc + (plan?.price_base ? Number(plan.price_base) : 0);
      }, 0),
      totalPaidMTD: payments.filter(p => p.status === 'success').reduce((acc, p) => acc + Number(p.amount), 0),
      pendingPayments: payments.filter(p => p.status === 'pending_approval').length,
      failedPayments: payments.filter(p => p.status === 'failed').length,
      dueSoon3Days: locations.filter(l => {
        const days = Math.ceil((new Date(l.next_due_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        return days >= 0 && days <= 3;
      }).length,
      dueSoon7Days: locations.filter(l => {
        const days = Math.ceil((new Date(l.next_due_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        return days > 3 && days <= 7;
      }).length,
    };

    return stats;
  }
};
