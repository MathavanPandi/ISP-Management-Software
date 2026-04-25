import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Building2, 
  MapPin, 
  Globe, 
  CreditCard, 
  Shield, 
  History,
  Paperclip,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Loader2,
  Printer
} from 'lucide-react';
import { locationService } from '../services/locationService';
import { ispService } from '../services/ispService';
import { rechargeService } from '../services/rechargeService';
import { cn } from '../lib/utils';
import { AttachmentDrawer } from './AttachmentDrawer';
import { RechargeInvoice } from './RechargeInvoice';
import { RechargeTransaction } from '../types';

export function LocationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<RechargeTransaction | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!id) return;
      const loc = await locationService.getLocationById(id);
      if (!loc) {
        setError('Location not found');
        setLoading(false);
        return;
      }
      setLocation(loc);

      // Fetch provider
      if (loc.ispProviderId) {
        try {
          const provs = await ispService.getProviders();
          setProvider(provs.find((p: any) => p.id === loc.ispProviderId));
        } catch (pErr) {
          console.error('Error fetching provider:', pErr);
        }
      }

      // Fetch history
      try {
        const txns = await rechargeService.getLocationHistory(id);
        setHistory(txns);
      } catch (hErr) {
        console.error('Error fetching history:', hErr);
      }
    } catch (err) {
      console.error('Error fetching location data:', err);
      setError('Could not load location details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await locationService.deleteLocation(id);
      navigate('/locations');
    } catch (err) {
      console.error('Error deleting location:', err);
      alert('Failed to delete location.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#007AFF] mb-2" size={32} />
        <p className="text-slate-500 font-medium tracking-tight">Loading location intelligence...</p>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <AlertTriangle size={48} className="mb-4 text-amber-500" />
        <h3 className="text-xl font-bold text-slate-900 mb-2 italic serif">{error || 'Location Not Found'}</h3>
        <p className="mb-6">The location you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate('/locations')}
          className="px-6 py-2 bg-[#007AFF] text-white rounded-lg font-bold hover:bg-[#0066CC] transition-colors"
        >
          Back to Locations
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/locations')}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 italic serif">{location.name}</h2>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                location.status === 'Active' ? "bg-emerald-50 text-emerald-700" :
                location.status === 'Due Soon' ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
              )}>
                {location.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <MapPin size={14} /> {location.city}, {location.state} • Account ID: {location.accountId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Paperclip size={18} />
            Attachments
          </button>
          <button 
            onClick={() => navigate(`/locations/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-[#007AFF] rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Edit3 size={18} />
            Edit
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 bg-white border border-slate-200 text-rose-500 rounded-lg hover:bg-rose-50 transition-colors shadow-sm"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Connection Overview */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[#FF6B00]" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Connection Overview</h3>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <CheckCircle2 size={14} />
                ONLINE
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Provider</div>
                <div className="text-sm font-bold text-slate-900">{provider?.name}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Plan</div>
                <div className="text-sm font-bold text-slate-900">{location.bandwidth}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Type</div>
                <div className="text-sm font-bold text-slate-900">{location.connectionType}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Cost</div>
                <div className="text-sm font-bold text-slate-900">₹{location.amount.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          {/* Recharge History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <History size={18} className="text-[#007AFF]" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Recharges</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction ID</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">{txn.rechargeDate}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-mono">{txn.transactionId}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{txn.total.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          txn.paymentStatus === 'Success' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        )}>
                          {txn.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedTransaction(txn);
                            setIsInvoiceOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-[#007AFF] hover:bg-[#007AFF]/5 rounded-lg transition-all"
                          title="Print Invoice"
                        >
                          <Printer size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm italic">
                        No recharge history found for this location.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="space-y-6">
          {/* Renewal Card */}
          <div className="bg-[#1A2B4C] text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Renewal Status</div>
                <Clock size={20} className="text-[#FF6B00]" />
              </div>
              <div className="text-4xl font-bold mb-1">{location.daysRemaining}</div>
              <div className="text-xs font-medium text-white/70 mb-6 uppercase tracking-wider">Days Remaining</div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Next Due Date</span>
                  <span className="font-bold">{location.nextDueDate}</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#FF6B00] h-full rounded-full" 
                    style={{ width: `${Math.max(0, Math.min(100, (location.daysRemaining / 30) * 100))}%` }}
                  ></div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/due-tracker')}
                className="w-full py-3 bg-[#FF6B00] hover:bg-[#E66000] text-white rounded-lg font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CreditCard size={18} />
                Recharge Now
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 size={16} className="text-[#007AFF]" />
              Contact Details
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Person</div>
                <div className="text-sm font-bold text-slate-900">{location.contactPerson}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mobile Number</div>
                <div className="text-sm font-bold text-slate-900">{location.registeredMobile}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</div>
                <div className="text-sm font-bold text-slate-900 truncate">{location.registeredEmail}</div>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe size={16} className="text-[#007AFF]" />
              ISP Support
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Support Contact</span>
                <span className="text-sm font-bold text-slate-900">{provider?.supportContact}</span>
              </div>
              {provider?.portalUrl && (
                <a 
                  href={provider.portalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  <ExternalLink size={14} />
                  Visit ISP Portal
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 italic serif">Delete Location?</h3>
            <p className="text-sm text-slate-500 mb-8">
              Are you sure you want to delete <strong>{location.name}</strong>? This action cannot be undone and all history will be lost.
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleDelete();
                }}
                className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AttachmentDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        entityType="Location"
        entityId={id || ''}
        entityName={location.name}
      />

      <RechargeInvoice 
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        transaction={selectedTransaction}
        location={location}
      />
    </div>
  );
}
