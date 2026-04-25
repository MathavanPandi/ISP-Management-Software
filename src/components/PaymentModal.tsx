import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  History
} from 'lucide-react';
import { Location } from '../types';
import { rechargeService } from '../services/rechargeService';
import { cn } from '../lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  location: Location | null;
}

export function PaymentModal({ isOpen, onClose, onSuccess, location }: PaymentModalProps) {
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');
  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Manual Offline'>('Manual Offline');
  const [txId, setTxId] = useState('');

  if (!isOpen || !location) return null;

  const handlePayment = async () => {
    setStep('processing');
    try {
      const paymentData = {
        locationId: location.id,
        amount: location.amount,
        paymentMode: method,
        planId: location.planId,
        tax: location.amount * 0.18, 
        transactionId: `MAN-${Math.floor(100000 + Math.random() * 900000)}`,
        rechargeDate: new Date().toISOString(),
        paymentStatus: 'Success',
        settlementStatus: 'Settled'
      };
      
      const result = await rechargeService.createRecharge(paymentData);
      setTxId(result.id || paymentData.transactionId);
      setStep('success');
      onSuccess?.();
    } catch (err) {
      console.error('Recording recharge error:', err);
      alert('Failed to record recharge. Please try again.');
      setStep('select');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <History size={18} className="text-[#007AFF]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Record Manual Recharge</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 'select' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recharging For</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#007AFF]">
                    <Building size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{location.name}</div>
                    <div className="text-xs text-slate-500">Account ID: {location.accountId}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div>
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Plan Amount</div>
                  <div className="text-2xl font-bold text-blue-700 italic serif">₹{location.amount.toLocaleString('en-IN')}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Next Cycle</div>
                  <div className="text-xs font-bold text-blue-700">+{location.billingCycle}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                  <AlertCircle className="text-amber-600 shrink-0" size={20} />
                  <p className="text-xs font-medium text-amber-800 leading-relaxed">
                    Please ensure you have already completed the payment on the official <strong>ISP Portal</strong>. This action will record the transaction and update the next due date in your tracking system.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mark Payment Method As</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['UPI', 'Manual Offline', 'Card', 'NetBanking'] as const).map((m) => (
                      <button 
                        key={m}
                        onClick={() => setMethod(m)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg border text-xs font-bold transition-all",
                          method === m ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        )}
                      >
                        {method === m && <CheckCircle2 size={14} />}
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full py-4 bg-[#FF6B00] hover:bg-[#E66000] text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
              >
                Confirm Manual Recharge
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-[#007AFF] rounded-full animate-spin mb-6"></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 italic serif">Recording Transaction</h3>
              <p className="text-sm text-slate-500">Updating location maturity dates...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 italic serif">Sync Successful!</h3>
              <p className="text-sm text-slate-500 mb-8 max-w-[280px]">
                The manual recharge for <strong>{location.name}</strong> has been logged. Your next due date has been automatically extended by 1 {location.billingCycle}.
              </p>
              <button 
                onClick={onClose}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
