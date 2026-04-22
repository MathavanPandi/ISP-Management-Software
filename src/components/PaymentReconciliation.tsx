import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  ArrowRightLeft, 
  Download,
  ExternalLink,
  RefreshCw,
  MoreVertical,
  Clock,
  Eye,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { rechargeService } from '../services/rechargeService';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
  status: 'matched' | 'mismatch' | 'pending';
  source: 'system' | 'gateway';
}

export function PaymentReconciliation() {
  const [activeTab, setActiveTab] = useState<'all' | 'mismatch' | 'pending'>('all');
  const [loading, setLoading] = useState(true);
  const [systemRecords, setSystemRecords] = useState<Transaction[]>([]);
  const [gatewayRecords, setGatewayRecords] = useState<Transaction[]>([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const payments = await rechargeService.getRecharges();
      
      const records: Transaction[] = payments.map((p: any) => ({
        id: p.id,
        date: new Date(p.payment_date).toLocaleDateString(),
        amount: Number(p.amount),
        method: p.payment_method || 'UPI',
        reference: p.transaction_id || 'N/A',
        status: p.status === 'success' ? 'matched' : 'pending',
        source: 'system'
      }));

      setSystemRecords(records);
      
      // Simulate gateway records
      const gRecords: Transaction[] = records.map((r, idx) => ({
        ...r,
        id: `GAT-${idx}`,
        source: 'gateway',
        amount: idx === 1 && records.length > 1 ? r.amount - 50 : r.amount,
        status: idx === 1 && records.length > 1 ? 'mismatch' : r.status
      }));
      setGatewayRecords(gRecords);

    } catch (err) {
      console.error('Error fetching reconciliation data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#007AFF]" size={40} />
      </div>
    );
  }

  const totals = {
    matched: systemRecords.filter((r, idx) => r.status === 'matched' && gatewayRecords[idx]?.amount === r.amount).reduce((acc, r) => acc + r.amount, 0),
    mismatch: systemRecords.filter((r, idx) => gatewayRecords[idx]?.amount !== r.amount).reduce((acc, r) => acc + r.amount, 0),
    pending: systemRecords.filter(r => r.status === 'pending').reduce((acc, r) => acc + r.amount, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 italic serif">Payment Reconciliation</h2>
          <p className="text-sm text-slate-500">Match system records with gateway settlements to ensure financial accuracy</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm">
            <RefreshCw size={18} />
            Sync Gateway
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] text-white rounded-lg font-bold hover:bg-[#0066CC] transition-colors shadow-sm">
            <ArrowRightLeft size={18} />
            Auto-Match
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">₹{totals.matched.toLocaleString('en-IN')}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Successfully Matched</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
            <XCircle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">₹{totals.mismatch.toLocaleString('en-IN')}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Discrepancies Found</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">₹{totals.pending.toLocaleString('en-IN')}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Verification</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['all', 'mismatch', 'pending'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-md transition-all uppercase tracking-wider",
                  activeTab === tab 
                    ? "bg-white text-[#007AFF] shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search Reference ID..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all w-full md:w-64"
              />
            </div>
            <button className="p-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gateway Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diff</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {systemRecords.filter(r => {
                if (activeTab === 'all') return true;
                if (activeTab === 'pending') return r.status === 'pending';
                if (activeTab === 'mismatch') {
                  const idx = systemRecords.indexOf(r);
                  return gatewayRecords[idx]?.amount !== r.amount;
                }
                return true;
              }).map((record) => {
                const idx = systemRecords.indexOf(record);
                const gateway = gatewayRecords[idx];
                const diff = record.amount - (gateway?.amount || 0);
                
                return (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{record.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-700 font-mono">{record.reference}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{record.method}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">₹{record.amount.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">₹{gateway?.amount.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "text-sm font-bold",
                        diff === 0 ? "text-slate-400" : "text-rose-600"
                      )}>
                        {diff === 0 ? '-' : `₹${diff.toLocaleString('en-IN')}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        gateway?.amount === record.amount && record.status === 'matched' ? "bg-emerald-50 text-emerald-700" :
                        gateway?.amount !== record.amount ? "bg-rose-50 text-rose-700" :
                        "bg-amber-50 text-amber-700"
                      )}>
                        {gateway?.amount !== record.amount ? 'mismatch' : record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-[#007AFF] hover:bg-white rounded-lg transition-all">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
