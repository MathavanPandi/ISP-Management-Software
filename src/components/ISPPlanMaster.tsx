import React from 'react';
import { 
  Plus, 
  Globe, 
  ChevronRight, 
  Zap, 
  Shield, 
  Database,
  Edit3,
  Loader2
} from 'lucide-react';
import { ispService } from '../services/ispService';
import { cn } from '../lib/utils';
import { ISPModal } from './ISPModal';
import { PlanModal } from './PlanModal';
import { PortalSyncModal } from './PortalSyncModal';
import { ISPProvider, ISPPlan } from '../types';

export function ISPPlanMaster() {
  const [providers, setProviders] = React.useState<ISPProvider[]>([]);
  const [plans, setPlans] = React.useState<ISPPlan[]>([]);
  const [activeProviderId, setActiveProviderId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  const [isISPModalOpen, setIsISPModalOpen] = React.useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = React.useState(false);
  const [isPortalSyncOpen, setIsPortalSyncOpen] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<ISPProvider | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<ISPPlan | null>(null);

  React.useEffect(() => {
    fetchProviders();
  }, []);

  React.useEffect(() => {
    if (activeProviderId) {
      fetchPlans(activeProviderId);
    }
  }, [activeProviderId]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const data = await ispService.getProviders();
      setProviders(data);
      if (data.length > 0 && !activeProviderId) {
        setActiveProviderId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async (providerId: string) => {
    try {
      const data = await ispService.getPlansByProvider(providerId);
      setPlans(data);
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  const currentProvider = providers.find(p => p.id === activeProviderId);

  const handleAddProvider = () => {
    setSelectedProvider(null);
    setIsISPModalOpen(true);
  };

  const handleEditProvider = (provider: ISPProvider) => {
    setSelectedProvider(provider);
    setIsISPModalOpen(true);
  };

  const handleAddPlan = () => {
    setSelectedPlan(null);
    setIsPlanModalOpen(true);
  };

  const handleEditPlan = (plan: ISPPlan) => {
    setSelectedPlan(plan);
    setIsPlanModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 italic serif">ISP & Plan Master</h2>
          <p className="text-sm text-slate-500">Manage ISP providers, their plans, and portal credentials</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAddProvider}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Provider
          </button>
          <button 
            onClick={handleAddPlan}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] text-white rounded-lg font-bold hover:bg-[#E66000] transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add New Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">ISP Providers</h3>
            <div className="space-y-2">
              {loading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="animate-spin text-slate-300" size={24} />
                </div>
              ) : providers.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center p-4">No providers found</p>
              ) : (
                providers.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setActiveProviderId(provider.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-left",
                      activeProviderId === provider.id 
                        ? "bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/20" 
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Globe size={18} />
                      <span className="text-sm font-bold">{provider.name}</span>
                    </div>
                    <ChevronRight size={16} className={cn(activeProviderId === provider.id ? "opacity-100" : "opacity-0")} />
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="bg-[#1A2B4C] p-6 rounded-xl text-white">
            <h3 className="text-sm font-bold mb-2 italic serif">Portal Sync</h3>
            <p className="text-xs text-slate-400 mb-4">
              Connect your ISP portal credentials to automatically sync plan details and due dates.
            </p>
            <button 
              onClick={() => setIsPortalSyncOpen(true)}
              className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold transition-colors"
            >
              Configure Sync
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {loading ? (
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px] flex items-center justify-center">
               <Loader2 className="animate-spin text-[#007AFF]" size={40} />
             </div>
          ) : currentProvider ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#007AFF]">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{currentProvider.name}</h3>
                    <p className="text-sm text-slate-500">Support: {currentProvider.supportContact || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditProvider(currentProvider)}
                    className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-200 flex items-center gap-1"
                  >
                    <Edit3 size={14} />
                    Edit Provider
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Plans</div>
                  <div className="text-2xl font-bold text-slate-900">{plans.length}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Cost</div>
                  <div className="text-2xl font-bold text-slate-900">
                    ₹{plans.length > 0 
                      ? Math.round(plans.reduce((acc, p) => acc + (p.amount || 0), 0) / plans.length).toLocaleString('en-IN')
                      : 0}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Locations</div>
                  <div className="text-2xl font-bold text-slate-900">Live</div>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-4 italic serif">Available Plans</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <div 
                    key={plan.id} 
                    className="p-5 border border-slate-200 rounded-xl hover:border-[#007AFF]/30 transition-all group cursor-pointer relative"
                    onClick={() => handleEditPlan(plan)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="font-bold text-slate-900 group-hover:text-[#007AFF] transition-colors">{plan.name}</h5>
                        <p className="text-xs text-slate-500">{plan.bandwidth || plan.bandwidth_mbps + ' Mbps'}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">₹{(plan.amount || 0).toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Per {plan.billingCycle || 'month'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <Zap size={12} className="text-amber-500" />
                        {plan.type || 'Connection'}
                      </div>
                      {plan.static_ip && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <Shield size={12} className="text-emerald-500" />
                          Static IP
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <Database size={12} className="text-[#007AFF]" />
                        Unlimited
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit3 size={14} className="text-slate-400" />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={handleAddPlan}
                  className="p-5 border-2 border-dashed border-slate-200 rounded-xl hover:border-[#FF6B00] hover:bg-orange-50/30 transition-all group flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#FF6B00]"
                >
                  <Plus size={24} />
                  <span className="text-sm font-bold uppercase tracking-widest">Add New Plan</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-slate-400 gap-3">
              <Globe size={40} />
              <p className="text-sm font-medium">Select a provider to view plans</p>
            </div>
          )}
        </div>
      </div>

      <ISPModal 
        isOpen={isISPModalOpen}
        onClose={() => setIsISPModalOpen(false)}
        onSuccess={fetchProviders}
        provider={selectedProvider}
      />

      <PlanModal 
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSuccess={() => activeProviderId && fetchPlans(activeProviderId)}
        plan={selectedPlan}
        providerId={activeProviderId || ''}
      />

      <PortalSyncModal 
        isOpen={isPortalSyncOpen}
        onClose={() => setIsPortalSyncOpen(false)}
        onSuccess={() => {
          fetchProviders();
          if (activeProviderId) fetchPlans(activeProviderId);
        }}
        providers={providers}
        activeProviderId={activeProviderId || ''}
      />
    </div>
  );
}
