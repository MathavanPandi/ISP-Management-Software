import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Building2,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { locationService } from '../services/locationService';
import { rechargeService } from '../services/rechargeService';
import { cn } from '../lib/utils';
import { PaymentModal } from './PaymentModal';
import { Location } from '../types';

export function Dashboard() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [stats, setStats] = React.useState<any>(null);
  const [urgentRenewals, setUrgentRenewals] = React.useState<any[]>([]);
  const [ispDistribution, setIspDistribution] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, renewalsData, distributionData] = await Promise.all([
        locationService.getDashboardStats(),
        locationService.getUrgentRenewals(5),
        rechargeService.getISPDistribution()
      ]);
      setStats(statsData);
      setUrgentRenewals(renewalsData);
      setIspDistribution(distributionData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = (e: React.MouseEvent, loc: Location) => {
    e.stopPropagation();
    setSelectedLocation(loc);
    setIsPaymentModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#007AFF]" size={40} />
      </div>
    );
  }

  const colors = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Paid (MTD)</span>
            <TrendingUp className="text-emerald-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-900">₹{stats?.totalPaidMTD.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Successful Transactions</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Approval</span>
            <Clock className="text-amber-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats?.pendingPayments}</div>
          <div className="text-xs text-amber-600 mt-1 font-medium">Awaiting verification</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Failed Payments</span>
            <AlertCircle className="text-rose-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats?.failedPayments}</div>
          <div className="text-xs text-rose-600 mt-1 font-medium">Requires retry</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monthly OpEx</span>
            <Building2 className="text-[#007AFF]" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-900">₹{stats?.monthlyCost.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Projected ISP Cost</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-bold italic serif">Urgent Renewals</h3>
            <button 
              onClick={() => navigate('/due-tracker')}
              className="text-sm font-bold text-[#007AFF] hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Location</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">ISP</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Due Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {urgentRenewals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No urgent renewals found</td>
                  </tr>
                ) : (
                  urgentRenewals.map((loc) => (
                    <tr 
                      key={loc.id} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/locations/${loc.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 group-hover:text-[#007AFF] transition-colors">{loc.name}</div>
                        <div className="text-xs text-slate-500">{loc.city}, {loc.state}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-700">{loc.ispProviderName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900">{new Date(loc.next_due_date).toLocaleDateString()}</div>
                        <div className={cn(
                          "text-[10px] font-bold uppercase",
                          loc.daysRemaining < 0 ? "text-rose-600" : "text-amber-600"
                        )}>
                          {loc.daysRemaining < 0 ? `${Math.abs(loc.daysRemaining)} days overdue` : `${loc.daysRemaining} days left`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold",
                          loc.status === 'Active' ? "bg-emerald-50 text-emerald-700" :
                          loc.status === 'Due Soon' ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                        )}>
                          {loc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={(e) => handleRecharge(e, loc)}
                          className="px-3 py-1.5 bg-[#FF6B00] text-white rounded-lg text-xs font-bold hover:bg-[#E66000] transition-colors shadow-sm"
                        >
                          Recharge
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4 italic serif">ISP Distribution</h3>
            <div className="space-y-4">
              {ispDistribution.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No data available</p>
              ) : (
                ispDistribution.map((isp, index) => (
                  <div key={isp.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">{isp.name}</span>
                      <span className="text-slate-900">{isp.count} Locations</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={cn("h-1.5 rounded-full", colors[index % colors.length])}
                        style={{ width: `${isp.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-[#1A2B4C] p-6 rounded-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2 italic serif">Criticality Alert</h3>
              <p className="text-sm text-slate-400 mb-4">
                {stats?.noBackupCount} locations are currently without a backup connection.
              </p>
              <button 
                onClick={() => navigate('/due-tracker')}
                className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-bold transition-colors"
              >
                View Risk Report
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={fetchData}
        location={selectedLocation}
      />
    </div>
  );
}
