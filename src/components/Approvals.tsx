import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Eye, 
  Building2, 
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { rechargeService } from '../services/rechargeService';
import { locationService } from '../services/locationService';
import { cn } from '../lib/utils';
import { Location } from '../types';

export function Approvals() {
  const navigate = useNavigate();
  const [approvals, setApprovals] = React.useState<any[]>([]);
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rData, lData] = await Promise.all([
        rechargeService.getRecharges(),
        locationService.getLocations()
      ]);
      setApprovals(rData.filter(r => r.paymentStatus === 'Pending Approval'));
      setLocations(lData as any);
    } catch (err) {
      console.error('Error fetching approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    // In a real app, we would update the status in Database
    setApprovals(prev => prev.filter(r => r.id !== id));
    console.log(`${action === 'approve' ? 'Approved' : 'Rejected'} recharge:`, id);
  };

  const handleApproveAll = () => {
    setApprovals([]);
    console.log('Approved all pending recharges');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 italic serif">Pending Approvals</h2>
          <p className="text-sm text-slate-500">Review and approve recharge requests from branch managers</p>
        </div>
        <div className="flex items-center gap-2">
          {approvals.length > 0 && (
            <button 
              onClick={handleApproveAll}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <CheckSquare size={18} />
              Approve All
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
          <Loader2 className="animate-spin text-[#007AFF] mb-4" size={32} />
          <p className="text-sm font-medium text-slate-500">Fetching pending approvals...</p>
        </div>
      ) : approvals.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1 italic serif">All Caught Up!</h3>
          <p className="text-sm text-slate-500 max-w-xs">There are no pending recharge approvals at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {approvals.map((recharge) => {
            const location = locations.find(l => l.id === recharge.locationId);
            return (
              <div key={recharge.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-[#007AFF]/30 transition-all group">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#007AFF]">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{location?.name || 'N/A'}</h4>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          {recharge.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{location?.city || 'N/A'}, {location?.state || 'N/A'} • Requested on {recharge.rechargeDate}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="text-center md:text-left">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</div>
                      <div className="text-lg font-bold text-slate-900">₹{(recharge.total || 0).toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-400 italic">Incl. Tax: ₹{(recharge.tax || 0).toLocaleString('en-IN')}</div>
                    </div>
                    <div className="text-center md:text-left">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Method</div>
                      <div className="text-sm font-medium text-slate-700">{recharge.paymentMode}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[100px]">{recharge.transactionId}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate(`/locations/${location?.id}`)}
                        className="p-2 bg-slate-50 text-slate-400 hover:text-[#007AFF] hover:bg-slate-100 rounded-lg transition-all" 
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleAction(recharge.id, 'reject')}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors border border-rose-100"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                      <button 
                        onClick={() => handleAction(recharge.id, 'approve')}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm"
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
