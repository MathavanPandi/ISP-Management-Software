import React from 'react';
import { X, Shield, Save, Check } from 'lucide-react';
import { Role } from '../types';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Partial<Role>) => void;
  role?: Role | null;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'dashboard.view', label: 'View Dashboard' },
  { id: 'locations.view', label: 'View Locations' },
  { id: 'locations.edit', label: 'Edit Locations' },
  { id: 'locations.delete', label: 'Delete Locations' },
  { id: 'plans.manage', label: 'Manage ISP Plans' },
  { id: 'payments.approve', label: 'Approve Payments' },
  { id: 'reports.view', label: 'View Reports' },
  { id: 'settings.manage', label: 'Manage Settings' },
];

export function RoleModal({ isOpen, onClose, onSave, role }: RoleModalProps) {
  const [formData, setFormData] = React.useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: [],
  });

  React.useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        permissions: role.permissions || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: [],
      });
    }
  }, [role, isOpen]);

  const togglePermission = (permId: string) => {
    const current = formData.permissions || [];
    if (current.includes(permId)) {
      setFormData({ ...formData, permissions: current.filter(p => p !== permId) });
    } else {
      setFormData({ ...formData, permissions: [...current, permId] });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 italic serif">{role ? 'Edit Role' : 'Add New Role'}</h3>
              <p className="text-xs text-slate-500">Define access levels and permissions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Branch Manager"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What can this role do?"
                rows={2}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 resize-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Permissions</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {AVAILABLE_PERMISSIONS.map((perm) => {
                const isSelected = formData.permissions?.includes(perm.id);
                return (
                  <button
                    key={perm.id}
                    onClick={() => togglePermission(perm.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      isSelected 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' 
                        : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold">{perm.label}</span>
                    {isSelected && <Check size={14} className="text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#007AFF] text-white rounded-lg font-bold text-sm hover:bg-[#0066CC] transition-colors shadow-sm"
          >
            <Save size={18} />
            {role ? 'Update Role' : 'Create Role'}
          </button>
        </div>
      </div>
    </div>
  );
}
