import React from 'react';
import { X, Send, Check, AlertCircle, MessageSquare, Mail, Smartphone } from 'lucide-react';
import { Location } from '../types';
import { cn } from '../lib/utils';

interface BulkAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
}

export function BulkAlertModal({ isOpen, onClose, locations }: BulkAlertModalProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [channel, setChannel] = React.useState<'WhatsApp' | 'Email' | 'Push'>('WhatsApp');

  const dueSoonOrOverdue = locations.filter(l => l.status === 'Due Soon' || l.status === 'Overdue');

  React.useEffect(() => {
    if (isOpen) {
      setSelectedIds(dueSoonOrOverdue.map(l => l.id));
      setSent(false);
      setSending(false);
    }
  }, [isOpen]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
              <Send size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 italic serif">Bulk Renewal Alerts</h3>
              <p className="text-xs text-slate-500">Notify branch managers about upcoming dues</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-2">
            {[
              { id: 'WhatsApp', icon: MessageSquare, label: 'WhatsApp' },
              { id: 'Email', icon: Mail, label: 'Email' },
              { id: 'Push', icon: Smartphone, label: 'Push' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setChannel(c.id as any)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm transition-all",
                  channel === c.id 
                    ? "bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-lg shadow-[#1A2B4C]/20" 
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                <c.icon size={18} />
                {c.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
            <div className="flex items-center justify-between px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Select Locations ({selectedIds.length})</span>
              <button 
                onClick={() => setSelectedIds(selectedIds.length === dueSoonOrOverdue.length ? [] : dueSoonOrOverdue.map(l => l.id))}
                className="text-[#007AFF] hover:underline"
              >
                {selectedIds.length === dueSoonOrOverdue.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            {dueSoonOrOverdue.map((loc) => (
              <button
                key={loc.id}
                onClick={() => toggleSelect(loc.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                  selectedIds.includes(loc.id) 
                    ? "bg-slate-50 border-[#007AFF]/30 shadow-sm" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-5 h-5 rounded border flex items-center justify-center transition-all",
                    selectedIds.includes(loc.id) ? "bg-[#007AFF] border-[#007AFF]" : "bg-white border-slate-300"
                  )}>
                    {selectedIds.includes(loc.id) && <Check size={12} className="text-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{loc.name}</div>
                    <div className="text-[10px] text-slate-500">{loc.city} • Due in {loc.daysRemaining} days</div>
                  </div>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  loc.status === 'Due Soon' ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                )}>
                  {loc.status}
                </span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <AlertCircle size={14} className="text-[#007AFF]" />
              Message Preview
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Hi [Manager Name], this is an automated reminder from NetRenew Central. The ISP plan for {selectedIds.length > 0 ? locations.find(l => l.id === selectedIds[0])?.name : '[Location]'} is expiring in [Days] days. Please ensure timely recharge to avoid downtime."
            </p>
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
            onClick={handleSend}
            disabled={selectedIds.length === 0 || sending || sent}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm",
              sent 
                ? "bg-emerald-500 text-white" 
                : "bg-[#007AFF] text-white hover:bg-[#0066CC] disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : sent ? (
              <>
                <Check size={18} />
                Alerts Sent!
              </>
            ) : (
              <>
                <Send size={18} />
                Send {selectedIds.length} Alerts
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
