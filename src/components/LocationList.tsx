import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MapPin, 
  Globe, 
  Shield, 
  ShieldOff, 
  MoreVertical, 
  Filter,
  Download,
  Building2,
  Paperclip,
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { locationService } from '../services/locationService';
import { Location } from '../types';
import { cn } from '../lib/utils';
import { AttachmentDrawer } from './AttachmentDrawer';

export function LocationList() {
  const navigate = useNavigate();
  const [locations, setLocations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('All');
  const [selectedLocation, setSelectedLocation] = React.useState<{ id: string, name: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationService.getLocations();
      setLocations(data);
    } catch (err: any) {
      console.error('Error fetching locations:', err);
      setError('Could not load locations. Please check your Supabase connection.');
    } finally {
      setLoading(false);
    }
  };

  const openAttachments = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    setSelectedLocation({ id, name });
    setIsDrawerOpen(true);
  };

  const filteredLocations = locations.filter(loc => {
    const name = loc.name || '';
    const city = loc.city || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || loc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 italic serif">Location Master</h2>
          <p className="text-sm text-slate-500">Manage company branches, offices, and warehouses</p>
        </div>
        <button 
          onClick={() => navigate('/locations/new')}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] text-white rounded-lg font-bold hover:bg-[#E66000] transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add New Location
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by location name or city..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Due Soon">Due Soon</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
            <Filter size={18} />
          </button>
          <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Location Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Primary ISP</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Backup</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Monthly Cost</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Due Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-[#007AFF]" size={32} />
                      <p className="text-sm font-medium text-slate-500">Retrieving locations from Supabase...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                        <AlertCircle size={24} />
                      </div>
                      <p className="text-sm font-medium text-slate-900">{error}</p>
                      <button 
                        onClick={fetchLocations}
                        className="text-xs font-bold text-[#007AFF] hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <MapPin size={32} />
                      <p className="text-sm font-medium">No locations found. Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLocations.map((loc) => (
                  <tr 
                    key={loc.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/locations/${loc.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#007AFF] group-hover:bg-[#007AFF] group-hover:text-white transition-all">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{loc.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin size={12} /> {loc.city}, {loc.state}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">{loc.ispProviderName || 'Airtel Fiber'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        {loc.speedMbps ? `${loc.speedMbps} Mbps` : '100 Mbps'} • {loc.connectionType || 'Broadband'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {loc.backupAvailable ? (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <Shield size={14} />
                          <span className="text-xs font-bold uppercase tracking-wider">Yes</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-400">
                          <ShieldOff size={14} />
                          <span className="text-xs font-bold uppercase tracking-wider">No</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">₹{(loc.amount || 0).toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{loc.billingCycle || 'Monthly'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        loc.status === 'Active' ? "bg-emerald-50 text-emerald-700" :
                        loc.status === 'Due Soon' ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                      )}>
                        {loc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{loc.nextDueDate || 'N/A'}</div>
                      <div className={cn(
                        "text-[10px] font-bold uppercase",
                        (loc.daysRemaining || 0) < 0 ? "text-rose-600" : "text-amber-600"
                      )}>
                        {loc.daysRemaining === undefined ? 'Days not tracked' : 
                          loc.daysRemaining < 0 ? `${Math.abs(loc.daysRemaining)} days overdue` : `${loc.daysRemaining} days left`}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/locations/${loc.id}`);
                          }}
                          className="p-2 text-slate-400 hover:text-[#007AFF] transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={(e) => openAttachments(e, loc.id, loc.name)}
                          className="p-2 text-slate-400 hover:text-[#007AFF] transition-colors"
                          title="View Attachments"
                        >
                          <Paperclip size={18} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AttachmentDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        entityType="Location"
        entityId={selectedLocation?.id || ''}
        entityName={selectedLocation?.name}
      />
    </div>
  );
}
