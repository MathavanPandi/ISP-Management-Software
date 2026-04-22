import React, { useState, useEffect } from 'react';
import { X, Zap, Save, CreditCard, Clock, Database } from 'lucide-react';
import { ISPPlan, BillingCycle } from '../types';
import { ispService } from '../services/ispService';
import { cn } from '../lib/utils';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  plan: ISPPlan | null;
  providerId: string;
}

export function PlanModal({ isOpen, onClose, onSuccess, plan, providerId }: PlanModalProps) {
  const isEdit = Boolean(plan);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ISPPlan>>({
    name: '',
    bandwidth: '',
    amount: 0,
    billingCycle: 'Monthly',
    providerId: providerId,
  });

  useEffect(() => {
    if (plan) {
      setFormData(plan);
    } else {
      setFormData({
        name: '',
        bandwidth: '',
        amount: 0,
        billingCycle: 'Monthly',
        providerId: providerId,
      });
    }
  }, [plan, providerId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && plan) {
        await ispService.updatePlan(plan.id, formData);
      } else {
        await ispService.createPlan({
          ...formData,
          providerId: providerId 
        });
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error saving plan:', err);
      alert('Failed to save plan details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-[#FF6B00]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {isEdit ? 'Edit ISP Plan' : 'Add New ISP Plan'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plan Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Entertainment 200Mbps"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bandwidth</label>
              <div className="relative">
                <Database className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={formData.bandwidth}
                  onChange={(e) => setFormData({ ...formData, bandwidth: e.target.value })}
                  placeholder="e.g. 200 Mbps"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount (₹)</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="number" 
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Billing Cycle</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as BillingCycle })}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half-Yearly">Half-Yearly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-2 bg-[#FF6B00] text-white rounded-lg font-bold hover:bg-[#E66000] transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {isEdit ? 'Update Plan' : 'Save Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
