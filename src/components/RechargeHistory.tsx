import React from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MoreVertical,
  Building2,
  FileText,
  ExternalLink,
  Settings,
  Printer,
  ChevronDown,
  Plus,
  Loader2
} from 'lucide-react';
import { rechargeService } from '../services/rechargeService';
import { locationService } from '../services/locationService';
import { cn } from '../lib/utils';
import { RechargeInvoice } from './RechargeInvoice';
import { PaymentModal } from './PaymentModal';
import { RechargeTransaction, Location } from '../types';

export function RechargeHistory() {
  const [recharges, setRecharges] = React.useState<any[]>([]);
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('All');
  const [showColumnChooser, setShowColumnChooser] = React.useState(false);
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<RechargeTransaction | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = React.useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);

  const [visibleColumns, setVisibleColumns] = React.useState({
    transaction: true,
    location: true,
    mode: true,
    amount: true,
    status: true,
    settlement: true
  });

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
      setRecharges(rData);
      setLocations(lData as any);
    } catch (err) {
      console.error('Error fetching recharge history:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecharges = recharges.filter(recharge => {
    const location = locations.find(l => l.id === recharge.locationId);
    const locationName = location?.name || '';
    const matchesSearch = locationName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         recharge.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || recharge.paymentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewInvoice = (recharge: RechargeTransaction) => {
    const location = locations.find(l => l.id === recharge.locationId);
    setSelectedTransaction(recharge);
    setSelectedLocation(location || null);
    setIsInvoiceOpen(true);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}...`);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 italic serif">Payment & Recharge History</h2>
          <p className="text-sm text-slate-500">View and manage past plan renewals and payment records</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Download size={18} />
              Export
              <ChevronDown size={14} className={cn("transition-transform", showExportMenu && "rotate-180")} />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <button onClick={() => handleExport('CSV')} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" /> CSV Format
                </button>
                <button onClick={() => handleExport('Excel')} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2">
                  <FileText size={14} className="text-emerald-500" /> Excel Spreadsheet
                </button>
                <button onClick={() => handleExport('PDF')} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2">
                  <FileText size={14} className="text-rose-500" /> PDF Document
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] text-white rounded-lg font-bold hover:bg-[#E66000] transition-colors shadow-sm"
          >
            <Plus size={18} />
            New Recharge
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by location or transaction ID..." 
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
            <option value="Success">Success</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Failed">Failed</option>
            <option value="Settled">Settled</option>
          </select>
          
          <div className="relative">
            <button 
              onClick={() => setShowColumnChooser(!showColumnChooser)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title="Column Chooser"
            >
              <Settings size={18} />
            </button>
            {showColumnChooser && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Visible Columns</h4>
                <div className="space-y-2">
                  {Object.entries(visibleColumns).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all",
                        value ? "bg-[#007AFF] border-[#007AFF]" : "bg-white border-slate-300"
                      )}>
                        {value && <CheckCircle2 size={10} className="text-white" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={value}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, [key]: !value }))}
                      />
                      <span className="text-xs font-bold text-slate-600 capitalize group-hover:text-slate-900">{key}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {visibleColumns.transaction && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Transaction Details</th>}
                {visibleColumns.location && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Location</th>}
                {visibleColumns.mode && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Payment Mode</th>}
                {visibleColumns.amount && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Amount</th>}
                {visibleColumns.status && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Status</th>}
                {visibleColumns.settlement && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif">Settlement</th>}
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin text-[#007AFF] mx-auto mb-4" size={32} />
                    <p className="text-sm font-medium text-slate-500">Loading history from Database...</p>
                  </td>
                </tr>
              ) : filteredRecharges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                    <p className="text-sm">No transactions found</p>
                  </td>
                </tr>
              ) : (
                filteredRecharges.map((recharge) => {
                  const location = locations.find(l => l.id === recharge.locationId);
                  return (
                    <tr key={recharge.id} className="hover:bg-slate-50 transition-colors group">
                      {visibleColumns.transaction && (
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-900">{recharge.transactionId}</div>
                          <div className="text-xs text-slate-500">{recharge.rechargeDate}</div>
                          {recharge.bankReference && <div className="text-[10px] text-slate-400">UTR: {recharge.bankReference}</div>}
                        </td>
                      )}
                      {visibleColumns.location && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-[#007AFF]" />
                            <span className="text-sm font-medium text-slate-700">{location?.name || 'N/A'}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{location?.city || 'N/A'}</div>
                        </td>
                      )}
                      {visibleColumns.mode && (
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-700">{recharge.paymentMode}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{recharge.gatewayName || 'Manual'}</div>
                        </td>
                      )}
                      {visibleColumns.amount && (
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-900">₹{(recharge.total || 0).toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tax: ₹{(recharge.tax || 0).toLocaleString('en-IN')}</div>
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            recharge.paymentStatus === 'Success' ? "bg-emerald-50 text-emerald-700" :
                            recharge.paymentStatus === 'Pending Approval' ? "bg-amber-50 text-amber-700" : 
                            recharge.paymentStatus === 'Failed' ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-700"
                          )}>
                            {recharge.paymentStatus === 'Success' ? <CheckCircle2 size={10} /> : 
                             recharge.paymentStatus === 'Pending Approval' ? <Clock size={10} /> : <AlertCircle size={10} />}
                            {recharge.paymentStatus}
                          </span>
                        </td>
                      )}
                      {visibleColumns.settlement && (
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            recharge.settlementStatus === 'Settled' ? "text-emerald-600" : "text-slate-400"
                          )}>
                            {recharge.settlementStatus}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleViewInvoice(recharge)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-[#007AFF]/10 hover:text-[#007AFF] border border-slate-200 rounded-lg transition-all text-[10px] font-bold uppercase tracking-tight"
                            title="Print Invoice"
                          >
                            <Printer size={14} />
                            Print
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RechargeInvoice 
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        transaction={selectedTransaction}
        location={selectedLocation}
      />

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={fetchData}
        location={selectedLocation}
      />
    </div>
  );
}
