import { supabase } from '../lib/supabase';
import { RechargeTransaction } from '../types';

export const rechargeService = {
  async getRecharges() {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        locations (name, city)
      `)
      .order('payment_date', { ascending: false });
    
    if (error) throw error;
    
    // Transform to match frontend interface
    return data.map(item => ({
      id: item.id,
      transactionId: item.transaction_id || `TRX-${item.id.slice(0, 8)}`,
      locationId: item.location_id,
      rechargeDate: new Date(item.payment_date).toLocaleDateString(),
      planId: item.plan_id,
      amount: item.amount,
      tax: item.tax || 0,
      total: item.amount + (item.tax || 0),
      paymentStatus: item.status, // Success, Pending, Failed
      paymentMode: item.payment_method,
      gatewayName: item.payment_gateway,
      bankReference: item.utr_number,
      settlementStatus: item.reconciled ? 'Settled' : 'Unsettled'
    })) as any[];
  },

  async createRecharge(payment: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        ...payment,
        recorded_by: user?.id,
        payment_date: new Date().toISOString(),
        status: 'success'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getISPDistribution() {
    const { data, error } = await supabase
      .from('locations')
      .select('isp_providers(name)');
    
    if (error) throw error;

    const distribution: Record<string, number> = {};
    (data as any[] || []).forEach(item => {
      const provider = Array.isArray(item.isp_providers) ? item.isp_providers[0] : item.isp_providers;
      const name = provider?.name || 'Unknown';
      distribution[name] = (distribution[name] || 0) + 1;
    });

    const total = data.length;
    return Object.entries(distribution).map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    })).sort((a, b) => b.count - a.count);
  },

  async getExpenditureTrend(type: 'Daily' | 'Monthly' | 'Yearly') {
    // This is a simplified version. In a real app, you'd do more complex grouping in SQL.
    const { data, error } = await supabase
      .from('payments')
      .select('amount, payment_date')
      .eq('status', 'success')
      .order('payment_date');
    
    if (error) throw error;

    // Default mock behavior if no data
    if (!data || data.length === 0) return [];

    const trend: Record<string, number> = {};
    data.forEach(p => {
      const date = new Date(p.payment_date);
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
