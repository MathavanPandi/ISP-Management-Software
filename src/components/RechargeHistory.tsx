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
  Loader2,
  GripVertical,
  Eye,
  ArrowRightLeft
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { format, parseISO, isValid } from 'date-fns';
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
  const [openRowMenu, setOpenRowMenu] = React.useState<string | null>(null);

  const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>({
    transactionId: true,
    rechargeDate: true,
    locationName: true,
    branchType: false,
    city: true,
    state: false,
    country: false,
    ispProvider: false,
    connectionType: false,
    bandwidth: false,
    simCount: false,
    paymentMode: true,
    baseAmount: false,
    taxAmount: false,
    totalAmount: true,
    paymentStatus: true,
    settlementStatus: true,
    utr: true
  });

  const [columnOrder, setColumnOrder] = React.useState<string[]>([
    'transactionId',
    'rechargeDate',
    'locationName',
    'branchType',
    'city',
    'state',
    'country',
    'ispProvider',
    'connectionType',
    'bandwidth',
    'simCount',
    'paymentMode',
    'baseAmount',
    'taxAmount',
    'totalAmount',
    'paymentStatus',
    'settlementStatus',
    'utr'
  ]);

  const [isSavingLayout, setIsSavingLayout] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const columnLabels: Record<string, string> = {
    transactionId: 'Transaction ID',
    rechargeDate: 'Date',
    locationName: 'Location',
    branchType: 'Branch Type',
    city: 'City',
    state: 'State',
    country: 'Country',
    ispProvider: 'ISP Provider',
    connectionType: 'Connection Type',
    bandwidth: 'Bandwidth',
    simCount: 'SIM Count',
    paymentMode: 'Payment Mode',
    baseAmount: 'Base Amount',
    taxAmount: 'Tax Amount',
    totalAmount: 'Total Amount',
    paymentStatus: 'Status',
    settlementStatus: 'Settlement',
    utr: 'UTR / Ref'
  };

  React.useEffect(() => {
    // Load saved table layout
    const savedLayout = localStorage.getItem('recharge_history_layout');
    if (savedLayout) {
      try {
        const { visibleColumns: savedVisible, columnOrder: savedOrder } = JSON.parse(savedLayout);
        if (savedVisible) setVisibleColumns(savedVisible);
        if (savedOrder) setColumnOrder(savedOrder);
      } catch (err) {
        console.error('Error loading saved layout:', err);
      }
    }
    fetchData();
  }, []);

  const saveLayout = () => {
    setIsSavingLayout(true);
    try {
      localStorage.setItem('recharge_history_layout', JSON.stringify({
        visibleColumns,
        columnOrder
      }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving layout:', err);
    } finally {
      setIsSavingLayout(false);
    }
  };

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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(columnOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setColumnOrder(items);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (!isValid(date)) return dateStr;
      return format(date, 'dd/MM/yyyy');
    } catch {
      return dateStr;
    }
  };
  const handleExport = (exportFormat: string) => {
    if (exportFormat === 'CSV') {
      const headers = [
        'Transaction ID', 
        'Date', 
        'Location Name',
        'Branch Type',
        'City', 
        'State',
        'Country',
        'ISP Provider',
        'Connection Type',
        'Bandwidth',
        'SIM Count',
        'Payment Mode', 
        'Base Amount', 
        'Tax Amount', 
        'Total Amount', 
        'Payment Status', 
        'Settlement Status',
        'UTR / Ref'
      ];

      const rows = filteredRecharges.map(recharge => {
        const location = locations.find(l => l.id === recharge.locationId);
        return [
          recharge.transactionId,
          recharge.rechargeDate,
          `"${(location?.name || 'N/A').replace(/"/g, '""')}"`,
          location?.branchType || 'N/A',
          `"${(location?.city || 'N/A').replace(/"/g, '""')}"`,
          location?.state || 'N/A',
          location?.country || 'N/A',
          location?.ispProviderName || 'N/A',
          location?.connectionType || 'N/A',
          location?.bandwidth || 'N/A',
          location?.simCount || (location?.connectionType === 'SIM Card' ? 1 : 0),
          recharge.paymentMode,
          recharge.amount,
          recharge.tax,
          recharge.total,
          recharge.paymentStatus,
          recharge.settlementStatus,
          recharge.bankReference || ''
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `ISP_Recharges_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log(`Exporting as ${exportFormat}...`);
    }
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
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Visible Columns & Order</h4>
                  <p className="text-[9px] text-slate-400 leading-none">Drag to reorder</p>
                </div>
                
                <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="columns">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                          {columnOrder.map((key, index) => (
                            /* @ts-ignore - dnd typing issue with key prop */
                            <Draggable key={key} draggableId={key} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={cn(
                                    "flex items-center gap-3 p-1 rounded-md transition-colors",
                                    snapshot.isDragging ? "bg-slate-50 shadow-sm" : "hover:bg-slate-50/50"
                                  )}
                                >
                                  <div {...provided.dragHandleProps} className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                                    <GripVertical size={14} />
                                  </div>
                                  <label className="flex items-center gap-2 cursor-pointer group flex-1">
                                    <div className={cn(
                                      "w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0",
                                      visibleColumns[key] ? "bg-[#007AFF] border-[#007AFF]" : "bg-white border-slate-300"
                                    )}>
                                      {visibleColumns[key] && <CheckCircle2 size={10} className="text-white" />}
                                    </div>
                                    <input 
                                      type="checkbox" 
                                      className="hidden" 
                                      checked={visibleColumns[key]}
                                      onChange={() => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
                                    />
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 leading-none flex-1">
                                      {columnLabels[key]}
                                    </span>
                                  </label>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={saveLayout}
                    disabled={isSavingLayout}
                    className={cn(
                      "w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2",
                      saveSuccess 
                        ? "bg-emerald-500 text-white" 
                        : "bg-[#007AFF] text-white hover:bg-[#0066CC] shadow-md shadow-[#007AFF]/20"
                    )}
                  >
                    {isSavingLayout ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : saveSuccess ? (
                      <>
                        <CheckCircle2 size={14} />
                        Layout Saved!
                      </>
                    ) : (
                      <>
                        <Settings size={14} />
                        Save as Default View
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="overflow-x-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {columnOrder.map(key => {
                  if (!visibleColumns[key]) return null;
                  return (
                    <th key={key} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif whitespace-nowrap">
                      {columnLabels[key]}
                    </th>
                  );
                })}
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider italic serif"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={columnOrder.filter(k => visibleColumns[k]).length + 1} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin text-[#007AFF] mx-auto mb-4" size={32} />
                    <p className="text-sm font-medium text-slate-500">Loading history from Database...</p>
                  </td>
                </tr>
              ) : filteredRecharges.length === 0 ? (
                <tr>
                  <td colSpan={columnOrder.filter(k => visibleColumns[k]).length + 1} className="px-6 py-20 text-center text-slate-400">
                    <p className="text-sm">No transactions found</p>
                  </td>
                </tr>
              ) : (
                filteredRecharges.map((recharge) => {
                  const location = locations.find(l => l.id === recharge.locationId);
                  return (
                    <tr key={recharge.id} className="hover:bg-slate-50 transition-colors group">
                      {columnOrder.map(key => {
                        if (!visibleColumns[key]) return null;
                        
                        switch (key) {
                          case 'transactionId':
                            return (
                              <td key={key} className="px-6 py-4 font-bold text-slate-900 text-sm">{recharge.transactionId}</td>
                            );
                          case 'rechargeDate':
                            return (
                              <td key={key} className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">{formatDate(recharge.rechargeDate)}</td>
                            );
                          case 'locationName':
                            return (
                              <td key={key} className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Building2 size={14} className="text-[#007AFF]" />
                                  <span className="text-sm font-medium text-slate-700">{location?.name || 'N/A'}</span>
                                </div>
                              </td>
                            );
                          case 'branchType':
                            return (
                              <td key={key} className="px-6 py-4 text-xs text-slate-500">{location?.branchType || 'N/A'}</td>
                            );
                          case 'city':
                            return (
                              <td key={key} className="px-6 py-4 text-[10px] text-slate-400 uppercase font-bold tracking-wider">{location?.city || 'N/A'}</td>
                            );
                          case 'state':
                            return (
                              <td key={key} className="px-6 py-4 text-[10px] text-slate-400 uppercase font-bold tracking-wider">{location?.state || 'N/A'}</td>
                            );
                          case 'country':
                            return (
                              <td key={key} className="px-6 py-4 text-[10px] text-slate-400 uppercase font-bold tracking-wider">{location?.country || 'N/A'}</td>
                            );
                          case 'ispProvider':
                            return (
                              <td key={key} className="px-6 py-4 text-xs text-slate-600 font-medium">{location?.ispProviderName || 'N/A'}</td>
                            );
                          case 'connectionType':
                            return (
                              <td key={key} className="px-6 py-4 text-[10px] text-slate-400 uppercase font-bold tracking-wider">{location?.connectionType || 'N/A'}</td>
                            );
                          case 'bandwidth':
                            return (
                              <td key={key} className="px-6 py-4 text-xs text-slate-600">{location?.bandwidth || 'N/A'}</td>
                            );
                          case 'simCount':
                            return (
                              <td key={key} className="px-6 py-4 text-xs text-slate-600">
                                {location?.simCount || (location?.connectionType === 'SIM Card' ? 1 : '-')}
                              </td>
                            );
                          case 'paymentMode':
                            return (
                              <td key={key} className="px-6 py-4 text-sm font-medium text-slate-700">{recharge.paymentMode}</td>
                            );
                          case 'baseAmount':
                            return (
                              <td key={key} className="px-6 py-4 text-sm text-slate-600 italic">₹{(recharge.amount || 0).toLocaleString('en-IN')}</td>
                            );
                          case 'taxAmount':
                            return (
                              <td key={key} className="px-6 py-4 text-xs text-slate-400 italic">₹{(recharge.tax || 0).toLocaleString('en-IN')}</td>
                            );
                          case 'totalAmount':
                            return (
                              <td key={key} className="px-6 py-4 font-bold text-slate-900 text-sm">₹{(recharge.total || 0).toLocaleString('en-IN')}</td>
                            );
                          case 'paymentStatus':
                            return (
                              <td key={key} className="px-6 py-4">
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
                            );
                          case 'settlementStatus':
                            return (
                              <td key={key} className="px-6 py-4">
                                <span className={cn(
                                  "text-[10px] font-bold uppercase tracking-wider",
                                  recharge.settlementStatus === 'Settled' ? "text-emerald-600" : "text-slate-400"
                                )}>
                                  {recharge.settlementStatus}
                                </span>
                              </td>
                            );
                          case 'utr':
                            return (
                              <td key={key} className="px-6 py-4 text-[10px] text-slate-400 font-mono">{recharge.bankReference || '-'}</td>
                            );
                          default:
                            return null;
                        }
                      })}
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
                          
                          <div className="relative">
                            <button 
                              onClick={() => setOpenRowMenu(openRowMenu === recharge.id ? null : recharge.id)}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                openRowMenu === recharge.id ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              )}
                            >
                              <MoreVertical size={18} />
                            </button>
                            
                            {openRowMenu === recharge.id && (
                              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2">
                                <button onClick={() => { handleViewInvoice(recharge); setOpenRowMenu(null); }} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2">
                                  <Eye size={14} className="text-[#007AFF]" /> View Full Details
                                </button>
                                <button onClick={() => { handleExport('PDF'); setOpenRowMenu(null); }} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2">
                                  <Download size={14} className="text-emerald-500" /> Download PDF Receipt
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2">
                                  <ArrowRightLeft size={14} className="text-amber-500" /> Re-trigger Settlement
                                </button>
                                <div className="border-t border-slate-100 my-1"></div>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-rose-600 font-medium">
                                  <AlertCircle size={14} /> Raise Reconciliation Issue
                                </button>
                              </div>
                            )}
                          </div>
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
