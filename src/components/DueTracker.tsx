import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  Search,
  Calendar,
  Building2,
  CreditCard,
  Eye,
  List,
  Loader2
} from 'lucide-react';
import { locationService } from '../services/locationService';
import { cn } from '../lib/utils';
import { PaymentModal } from './PaymentModal';
import { CalendarView } from './CalendarView';
import { BulkAlertModal } from './BulkAlertModal';
import { Location } from '../types';

export function DueTracker() {
  const navigate = useNavigate();
  const [locations, setLocations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<'list' | 'calendar'>('list');
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [isBulkAlertModalOpen, setIsBulkAlertModalOpen] = React.useState(false);

  React.useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await locationService.getLocations();
      setLocations(data);
    } catch (err) {
      console.error('Error fetching locations for tracker:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (e: React.MouseEvent, loc: Location) => {
    e.stopPropagation();
    setSelectedLocation(loc);
    setIsPaymentModalOpen(true);
  };

  const filteredLocations = locations.filter(loc => {
    const name = loc.name || '';
    const city = loc.city || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || loc.status === activeFilter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0));

  const stats = {
    overdue: locations.filter(l => l.status === 'Overdue').length,
    dueSoon: locations.filter(l => l.status === 'Due Soon').length,
    active: locations.filter(l => l.status === 'Active').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 italic serif">Due Date Tracker</h2>
          <p className="text-sm text-slate-500">Monitor upcoming plan renewals and send alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            {viewMode === 'list' ? (
              <>
                <Calendar size={18} />
                Calendar View
              </>
            ) : (
              <>
                <List size={18} />
                List View
              </>
            )}
          </button>
          <button 
            onClick={() => setIsBulkAlertModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] text-white rounded-lg font-bold hover:bg-[#0066CC] transition-colors shadow-sm"
          >
            <Send size={18} />
            Bulk Alerts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setActiveFilter('Overdue')}
          className={cn(
            "p-6 rounded-xl border transition-all text-left",
            activeFilter === 'Overdue' ? "bg-rose-50 border-rose-200 ring-2 ring-rose-500/20" : "bg-white border-slate-200 hover:border-rose-200"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overdue</span>
            <AlertCircle className="text-rose-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.overdue}</div>
          <div className="text-xs text-rose-600 mt-1 font-medium">Action required immediately</div>
        </button>

        <button 
          onClick={() => setActiveFilter('Due Soon')}
          className={cn(
            "p-6 rounded-xl border transition-all text-left",
            activeFilter === 'Due Soon' ? "bg-amber-50 border-amber-200 ring-2 ring-amber-500/20" : "bg-white border-slate-200 hover:border-amber-200"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Due Soon</span>
            <Clock className="text-amber-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.dueSoon}</div>
          <div className="text-xs text-amber-600 mt-1 font-medium">Renew within 7 days</div>
        </button>

        <button 
          onClick={() => setActiveFilter('Active')}
          className={cn(
            "p-6 rounded-xl border transition-all text-left",
            activeFilter === 'Active' ? "bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500/20" : "bg-white border-slate-200 hover:border-emerald-200"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active</span>
            <CheckCircle2 className="text-emerald-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.active}</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">Service running normally</div>
        </button>
      </div>

      {viewMode === 'list' ? (
        <>
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
            <button 
              onClick={() => setActiveFilter('All')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
                activeFilter === 'All' ? "bg-[#1A2B4C] text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              )}
            >
              Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[280px] animate-pulse">
                  <div className="h-1.5 w-full bg-slate-100"></div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-3 pt-4">
                      <div className="h-3 bg-slate-100 rounded"></div>
                      <div className="h-3 bg-slate-100 rounded"></div>
                      <div className="h-3 bg-slate-100 rounded"></div>
                    </div>
                    <div className="pt-6 border-t border-slate-50 flex gap-2">
                      <div className="h-8 bg-slate-100 rounded flex-1"></div>
                      <div className="h-8 bg-slate-100 rounded w-10"></div>
                      <div className="h-8 bg-slate-100 rounded w-10"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredLocations.length === 0 ? (
              <div className="col-span-full py-20 bg-white rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2">
                <AlertCircle size={40} />
                <p className="text-sm font-medium">No renewals found matching your criteria</p>
              </div>
            ) : (
              filteredLocations.map((loc) => (
                <div 
                  key={loc.id} 
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col cursor-pointer hover:border-[#007AFF]/30 transition-all group"
                  onClick={() => navigate(`/locations/${loc.id}`)}
                >
                  <div className={cn(
                    "h-1.5 w-full",
                    loc.status === 'Active' ? "bg-emerald-500" :
                    loc.status === 'Due Soon' ? "bg-amber-500" : "bg-rose-500"
                  )}></div>
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#007AFF] group-hover:bg-[#007AFF] group-hover:text-white transition-all">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{loc.name}</h4>
                          <p className="text-xs text-slate-500">{loc.city}, {loc.state}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        loc.status === 'Active' ? "bg-emerald-50 text-emerald-700" :
                        loc.status === 'Due Soon' ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                      )}>
                        {loc.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Due Date</span>
                        <span className="text-sm font-bold text-slate-900">{loc.nextDueDate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Days Left</span>
                        <span className={cn(
                          "text-sm font-bold",
                          (loc.daysRemaining || 0) < 0 ? "text-rose-600" : 
                          (loc.daysRemaining || 0) <= 3 ? "text-amber-600" : "text-slate-900"
                        )}>
                          {loc.daysRemaining === undefined ? 'N/A' :
                            loc.daysRemaining < 0 ? `${Math.abs(loc.daysRemaining)} Days Overdue` : `${loc.daysRemaining} Days`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">ISP</span>
                        <span className="text-sm font-medium text-slate-700">{loc.ispProviderName || 'Airtel Fiber'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                      <button 
                        onClick={(e) => handlePayNow(e, loc)}
                        className="flex-1 py-2 bg-[#007AFF] text-white rounded-lg text-xs font-bold hover:bg-[#0066CC] transition-colors flex items-center justify-center gap-2"
                      >
                        <CreditCard size={14} />
                        Pay Now
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/locations/${loc.id}`);
                        }}
                        className="p-2 text-slate-400 hover:text-[#007AFF] hover:bg-slate-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 rounded-lg transition-all" 
                          title="Send WhatsApp"
                        >
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <CalendarView 
          locations={locations} 
          onLocationClick={(id) => navigate(`/locations/${id}`)} 
        />
      )}

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={fetchLocations}
        location={selectedLocation}
      />

      <BulkAlertModal 
        isOpen={isBulkAlertModalOpen}
        onClose={() => setIsBulkAlertModalOpen(false)}
        locations={locations}
      />
    </div>
  );
}
