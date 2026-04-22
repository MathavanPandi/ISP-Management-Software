import React, { useState, useEffect } from 'react';
import { X, Globe, Save, Phone, Link as LinkIcon } from 'lucide-react';
import { ISPProvider } from '../types';
import { ispService } from '../services/ispService';
import { cn } from '../lib/utils';

interface ISPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  provider: ISPProvider | null;
}

export function ISPModal({ isOpen, onClose, onSuccess, provider }: ISPModalProps) {
  const isEdit = Boolean(provider);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ISPProvider>>({
    name: '',
    supportContact: '',
    portalUrl: '',
  });

  useEffect(() => {
    if (provider) {
      setFormData(provider);
    } else {
      setFormData({
        name: '',
        supportContact: '',
        portalUrl: '',
      });
    }
  }, [provider, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && provider) {
        await ispService.updateProvider(provider.id, formData);
      } else {
        await ispService.createProvider(formData);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error saving ISP:', err);
      alert('Failed to save ISP provider.');
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
            <Globe size={18} className="text-[#007AFF]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {isEdit ? 'Edit ISP Provider' : 'Add New ISP Provider'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Provider Name</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Airtel Fiber"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Support Contact</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={formData.supportContact}
                onChange={(e) => setFormData({ ...formData, supportContact: e.target.value })}
                placeholder="Customer care number"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Portal URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="url" 
                value={formData.portalUrl}
                onChange={(e) => setFormData({ ...formData, portalUrl: e.target.value })}
                placeholder="https://isp-portal.com"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              />
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
              className="flex-1 py-2 bg-[#007AFF] text-white rounded-lg font-bold hover:bg-[#0066CC] transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
