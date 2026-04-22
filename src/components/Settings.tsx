import React from 'react';
import { 
  Settings as SettingsIcon, 
  Users, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Mail, 
  MessageSquare, 
  Smartphone,
  ChevronRight,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserModal } from './UserModal';
import { RoleModal } from './RoleModal';
import { Profile, Role } from '../types';
import { userService } from '../services/userService';
import { roleService } from '../services/roleService';

export function Settings() {
  const [activeSection, setActiveSection] = React.useState('general');
  const [users, setUsers] = React.useState<Profile[]>([]);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<Profile | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedUsers, fetchedRoles] = await Promise.all([
        userService.getProfiles(),
        roleService.getRoles()
      ]);
      setUsers(fetchedUsers);
      setRoles(fetchedRoles);
    } catch (err) {
      console.error('Error fetching settings data:', err);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'general', label: 'General Settings', icon: SettingsIcon },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: 'Role Permissions', icon: Lock },
    { id: 'notifications', label: 'Notification Rules', icon: Bell },
    { id: 'security', label: 'Security & Audit', icon: Shield },
    { id: 'integrations', label: 'ISP Integrations', icon: Globe },
    { id: 'backup', label: 'Data & Backups', icon: Database },
  ];

  const handleSaveUser = async (userData: Partial<Profile>) => {
    try {
      if (selectedUser) {
        const updated = await userService.updateProfile(selectedUser.id, userData);
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...updated } : u));
      } else {
        // In a real app, creating a user would involve Database Auth
        // For now, we'll just handle updates or show a tip
        alert('New users must be created via Supabase Auth. Contact admin.');
      }
      setIsUserModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      alert('Error updating user');
    }
  };

  const handleSaveRole = async (roleData: Partial<Role>) => {
    try {
      if (selectedRole) {
        const updated = await roleService.updateRole(selectedRole.id, roleData);
        setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, ...updated } : r));
      } else {
        const created = await roleService.createRole(roleData);
        setRoles([...roles, created]);
      }
      setIsRoleModalOpen(false);
      setSelectedRole(null);
    } catch (err) {
      alert('Error saving role');
    }
  };

  const deleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user profile?')) {
      try {
        await userService.deleteProfile(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        alert('Error deleting user profile');
      }
    }
  };

  const deleteRole = async (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        await roleService.deleteRole(id);
        setRoles(roles.filter(r => r.id !== id));
      } catch (err) {
        alert('Error deleting role');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 italic serif">System Settings</h2>
          <p className="text-sm text-slate-500">Configure your NetRenew Central platform</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] text-white rounded-lg font-bold hover:bg-[#0066CC] transition-colors shadow-sm">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left",
                activeSection === section.id 
                  ? "bg-[#1A2B4C] text-white shadow-lg shadow-[#1A2B4C]/20" 
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <section.icon size={18} />
                <span className="text-sm font-bold">{section.label}</span>
              </div>
              <ChevronRight size={16} className={cn(activeSection === section.id ? "opacity-100" : "opacity-0")} />
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold italic serif">
                {sections.find(s => s.id === activeSection)?.label}
              </h3>
              {loading && <Loader2 className="animate-spin text-slate-400" size={18} />}
              {!loading && activeSection === 'users' && (
                <button 
                  onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#007AFF] text-white rounded-lg text-xs font-bold hover:bg-[#0066CC] transition-colors"
                >
                  <Plus size={14} />
                  Add User
                </button>
              )}
              {!loading && activeSection === 'roles' && (
                <button 
                  onClick={() => { setSelectedRole(null); setIsRoleModalOpen(true); }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors"
                >
                  <Plus size={14} />
                  Add Role
                </button>
              )}
            </div>
            
            <div className="p-6 space-y-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                  <Loader2 className="animate-spin" size={32} />
                  <p className="text-sm font-medium tracking-wide">Syncing with Supabase...</p>
                </div>
              ) : (
                <>
                  {activeSection === 'general' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company Name</label>
                          <input 
                            type="text" 
                            defaultValue="Mizaj IT Solutions"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Currency Symbol</label>
                          <input 
                            type="text" 
                            defaultValue="₹ (INR)"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time Zone</label>
                        <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20">
                          <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {activeSection === 'notifications' && (
                    <div className="space-y-6">
                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                        <AlertCircle className="text-amber-500 mt-0.5" size={18} />
                        <div>
                          <h4 className="text-sm font-bold text-amber-900">Notification Channels</h4>
                          <p className="text-xs text-amber-700">Configure how you want to receive alerts for upcoming renewals.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          { id: 'email', label: 'Email Notifications', icon: Mail, desc: 'Send alerts to IT head and branch managers via email.' },
                          { id: 'whatsapp', label: 'WhatsApp Alerts', icon: MessageSquare, desc: 'Real-time alerts on registered mobile numbers.' },
                          { id: 'push', label: 'Push Notifications', icon: Smartphone, desc: 'Browser and mobile app push notifications.' },
                        ].map((channel) => (
                          <div key={channel.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                <channel.icon size={20} />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900">{channel.label}</h4>
                                <p className="text-xs text-slate-500">{channel.desc}</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked={channel.id !== 'whatsapp'} />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007AFF]"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSection === 'users' && (
                    <div className="space-y-4">
                      {users.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm italic">No users found in Supabase.</div>
                      ) : (
                        users.map((user) => {
                          const role = roles.find(r => r.id === user.roleId);
                          return (
                            <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-[#007AFF]/30 transition-all">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#1A2B4C] flex items-center justify-center text-white text-sm font-bold">
                                  {user.fullName?.charAt(0) || user.email.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-slate-900">{user.fullName || 'Unnamed User'}</div>
                                  <div className="text-xs text-slate-500">{user.email}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="px-2 py-0.5 bg-white border border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider rounded-full">
                                  {role?.name || 'No Role'}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => { setSelectedUser(user); setIsUserModalOpen(true); }}
                                    className="p-1.5 text-slate-400 hover:text-[#007AFF] transition-colors"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button 
                                    onClick={() => deleteUser(user.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {activeSection === 'roles' && (
                    <div className="space-y-4">
                      {roles.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm italic">No roles found in Supabase.</div>
                      ) : (
                        roles.map((role) => (
                          <div key={role.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-emerald-500/30 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-500">
                                <Shield size={20} />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900">{role.name}</div>
                                <div className="text-xs text-slate-500">{role.description}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {role.permissions?.length || 0} Permissions
                              </span>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => { setSelectedRole(role); setIsRoleModalOpen(true); }}
                                  className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button 
                                  onClick={() => deleteRole(role.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeSection === 'integrations' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Airtel', 'Jio', 'ACT', 'BSNL'].map((isp) => (
                          <div key={isp} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:border-[#007AFF]/30 transition-all group">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#007AFF] transition-colors">
                                <Globe size={20} />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900">{isp} Portal</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Not Connected</p>
                              </div>
                            </div>
                            <button className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-200">
                              Connect
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <UserModal 
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        roles={roles}
      />

      <RoleModal 
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSave={handleSaveRole}
        role={selectedRole}
      />
    </div>
  );
}
