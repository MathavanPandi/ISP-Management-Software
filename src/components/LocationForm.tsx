import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2,
  X, 
  Building2, 
  MapPin, 
  Globe, 
  CreditCard, 
  Shield,
  Info,
  Loader2
} from 'lucide-react';
import { locationService } from '../services/locationService';
import { ispService } from '../services/ispService';
import { Location, BranchType, ConnectionType, BillingCycle, PriorityLevel } from '../types';
import { cn } from '../lib/utils';

export function LocationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<Partial<Location>>({
    name: '',
    branchType: 'Store',
    city: '',
    state: '',
    ispProviderId: '',
    connectionType: 'FTTH',
    planId: '',
    bandwidth: '',
    amount: 0,
    billingCycle: 'Monthly',
    accountId: '',
    registeredMobile: '',
    registeredEmail: '',
    paymentMode: 'UPI',
    autoPay: false,
    status: 'Active',
    contactPerson: '',
    priority: 'Medium',
    criticality: 'Medium',
    backupAvailable: false,
  });

  useEffect(() => {
    fetchInitialData();
  }, [id, isEdit]);

  const fetchInitialData = async () => {
    setFetching(true);
    try {
      const pData = await ispService.getProviders();
      setProviders(pData);

      if (isEdit && id) {
        const locations = await locationService.getLocations();
        const location = locations.find(l => l.id === id);
        if (location) {
          setFormData(location);
          if (location.ispProviderId) {
            const planData = await ispService.getPlansByProvider(location.ispProviderId);
            setPlans(planData);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching form data:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleProviderChange = async (providerId: string) => {
    setFormData(prev => ({ ...prev, ispProviderId: providerId, planId: '' }));
    if (providerId) {
      try {
        const planData = await ispService.getPlansByProvider(providerId);
        setPlans(planData);
      } catch (err) {
        console.error('Error fetching plans:', err);
      }
    } else {
      setPlans([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    if (name === 'ispProviderId') {
      handleProviderChange(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: val
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && id) {
        await locationService.updateLocation(id, formData);
      } else {
        await locationService.createLocation(formData as any);
      }
      navigate('/locations');
    } catch (err) {
      console.error('Error saving location:', err);
      alert('Failed to save location details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this location? This action cannot be undone.')) return;
    
    setLoading(true);
    try {
      await locationService.deleteLocation(id);
      navigate('/locations');
    } catch (err) {
      console.error('Error deleting location:', err);
      alert('Failed to delete location.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#007AFF]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 italic serif">
              {isEdit ? 'Edit Location' : 'Add New Location'}
            </h2>
            <p className="text-sm text-slate-500">
              {isEdit ? `Updating details for ${formData.name}` : 'Register a new branch or office in the system'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/locations')}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          {isEdit && (
            <button 
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg font-bold hover:bg-rose-100 transition-colors"
            >
              <Trash2 size={18} />
              Delete
            </button>
          )}
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-[#FF6B00] text-white rounded-lg font-bold hover:bg-[#E66000] transition-colors shadow-sm"
          >
            <Save size={18} />
            {isEdit ? 'Update Location' : 'Save Location'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-12">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Building2 size={18} className="text-[#007AFF]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Basic Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Bengaluru HSR Store"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Branch Type</label>
              <select 
                name="branchType"
                value={formData.branchType}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              >
                <option value="Store">Store</option>
                <option value="Office">Office</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Factory">Factory</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">City</label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Bengaluru"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">State</label>
              <input 
                type="text" 
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Karnataka"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* ISP & Connection Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Globe size={18} className="text-[#007AFF]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">ISP & Connection Details</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">ISP Provider</label>
              <select 
                name="ispProviderId"
                value={formData.ispProviderId}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              >
                <option value="">Select Provider</option>
                {providers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selected Plan</label>
              <select 
                name="planId"
                value={formData.planId}
                onChange={handleChange}
                disabled={!formData.ispProviderId}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all disabled:opacity-50"
              >
                <option value="">Select Plan</option>
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (₹{p.price_base})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Connection Type</label>
              <select 
                name="connectionType"
                value={formData.connectionType}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              >
                <option value="FTTH">FTTH</option>
                <option value="Broadband">Broadband</option>
                <option value="Leased Line">Leased Line</option>
                <option value="Wireless">Wireless</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Account ID / CID</label>
              <input 
                type="text" 
                name="accountId"
                value={formData.accountId}
                onChange={handleChange}
                placeholder="ISP Account Number"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              />
            </div>
            <div className="space-y-2 flex items-end">
              <label className="flex items-center gap-3 cursor-pointer p-2 bg-slate-50 border border-slate-200 rounded-lg w-full">
                <input 
                  type="checkbox" 
                  name="backupAvailable"
                  checked={formData.backupAvailable}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#007AFF] rounded focus:ring-[#007AFF]/20"
                />
                <span className="text-sm font-medium text-slate-700">Backup Connection Available</span>
              </label>
            </div>
          </div>
        </div>

        {/* Billing & Contact */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <CreditCard size={18} className="text-[#007AFF]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Billing & Contact</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Billing Cycle</label>
              <select 
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half-Yearly">Half-Yearly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contact Person</label>
              <input 
                type="text" 
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Name of person at site"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Registered Mobile</label>
              <input 
                type="tel" 
                name="registeredMobile"
                value={formData.registeredMobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Registered Email</label>
              <input 
                type="email" 
                name="registeredEmail"
                value={formData.registeredEmail}
                onChange={handleChange}
                placeholder="Email for notifications"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Criticality & Priority */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Shield size={18} className="text-[#007AFF]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Operational Criticality</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Priority Level</label>
              <div className="flex items-center gap-3">
                {(['High', 'Medium', 'Low'] as PriorityLevel[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: p }))}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all",
                      formData.priority === p 
                        ? p === 'High' ? "bg-rose-50 border-rose-200 text-rose-700" :
                          p === 'Medium' ? "bg-amber-50 border-amber-200 text-amber-700" :
                          "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Criticality Level</label>
              <div className="flex items-center gap-3">
                {(['High', 'Medium', 'Low'] as PriorityLevel[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, criticality: p }))}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all",
                      formData.criticality === p 
                        ? p === 'High' ? "bg-rose-50 border-rose-200 text-rose-700" :
                          p === 'Medium' ? "bg-amber-50 border-amber-200 text-amber-700" :
                          "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700">
          <Info size={20} className="shrink-0" />
          <p className="text-xs leading-relaxed">
            By saving this location, the system will automatically start tracking its ISP renewal cycle. 
            Notifications will be sent to the registered mobile and email based on the global alert settings.
          </p>
        </div>
      </form>
    </div>
  );
}
