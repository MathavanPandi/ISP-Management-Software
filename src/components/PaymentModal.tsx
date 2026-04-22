import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight,
  CheckCircle2
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
  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [txId, setTxId] = useState('');

  if (!isOpen || !location) return null;

  const handlePayment = async () => {
    setStep('processing');
    try {
      const paymentData = {
        location_id: location.id,
        amount: location.amount,
        payment_method: method,
        plan_id: location.planId,
        tax: location.amount * 0.18, 
        transaction_id: `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      };
      
      const result = await rechargeService.createRecharge(paymentData);
      setTxId(result.transaction_id || paymentData.transaction_id);
      setStep('success');
      onSuccess?.();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
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
            <CreditCard size={18} className="text-[#007AFF]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Secure Payment</h3>
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
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Total Amount</div>
                  <div className="text-2xl font-bold text-blue-700 italic serif">₹{location.amount.toLocaleString('en-IN')}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Due Date</div>
                  <div className="text-xs font-bold text-blue-700">{location.nextDueDate}</div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Payment Method</label>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => setMethod('UPI')}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      method === 'UPI' ? "bg-blue-50 border-blue-200 ring-2 ring-blue-500/10" : "bg-white border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone size={20} className={method === 'UPI' ? "text-blue-600" : "text-slate-400"} />
                      <span className={cn("text-sm font-bold", method === 'UPI' ? "text-blue-900" : "text-slate-600")}>UPI (GPay, PhonePe)</span>
                    </div>
                    {method === 'UPI' && <CheckCircle2 size={18} className="text-blue-600" />}
                  </button>
                  <button 
                    onClick={() => setMethod('Card')}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      method === 'Card' ? "bg-blue-50 border-blue-200 ring-2 ring-blue-500/10" : "bg-white border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className={method === 'Card' ? "text-blue-600" : "text-slate-400"} />
                      <span className={cn("text-sm font-bold", method === 'Card' ? "text-blue-900" : "text-slate-600")}>Debit / Credit Card</span>
                    </div>
                    {method === 'Card' && <CheckCircle2 size={18} className="text-blue-600" />}
                  </button>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full py-4 bg-[#FF6B00] hover:bg-[#E66000] text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
              >
                Pay ₹{location.amount.toLocaleString('en-IN')}
                <ArrowRight size={18} />
              </button>

              <div className="flex items-center justify-center gap-2 text-slate-400">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">PCI-DSS Compliant • 256-bit SSL</span>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 italic serif">Processing Payment</h3>
              <p className="text-sm text-slate-500">Please do not refresh or close the window...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 italic serif">Payment Successful!</h3>
              <p className="text-sm text-slate-500 mb-8">
                The recharge for <strong>{location.name}</strong> has been processed successfully. 
                Transaction ID: <span className="font-mono font-bold text-slate-700">{txId || 'N/A'}</span>
              </p>
              <button 
                onClick={onClose}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
