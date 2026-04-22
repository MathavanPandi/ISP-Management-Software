import React from 'react';
import { X, Printer, Download, Building2, Globe, CreditCard, CheckCircle2, FileText } from 'lucide-react';
import { RechargeTransaction, Location } from '../types';
import { cn } from '../lib/utils';

interface RechargeInvoiceProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: RechargeTransaction | null;
  location: Location | null;
}

export function RechargeInvoice({ isOpen, onClose, transaction, location }: RechargeInvoiceProps) {
  if (!isOpen || !transaction || !location) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 italic serif">Tax Invoice</h3>
              <p className="text-xs text-slate-500">Transaction ID: {transaction.transactionId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-600 flex items-center gap-2 text-sm font-bold"
            >
              <Printer size={18} />
              Print
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 flex-1 print:p-0">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#007AFF]">
                <Globe size={24} strokeWidth={3} />
                <span className="text-xl font-black tracking-tighter italic">NetRenew Central</span>
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                <p className="font-bold text-slate-900">Mizaj IT Solutions Pvt Ltd</p>
                <p>123 Tech Park, Sector 62</p>
                <p>Noida, Uttar Pradesh - 201301</p>
                <p>GSTIN: 09AAACM1234A1Z5</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Invoice</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">#{transaction.transactionId.split('-')[1]}</p>
              <p className="text-sm font-bold text-slate-900 mt-4">{transaction.rechargeDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 py-8 border-y border-slate-100">
            <div className="space-y-2">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bill To:</h5>
              <div className="text-sm">
                <p className="font-bold text-slate-900">{location.name}</p>
                <p className="text-slate-500">{location.city}, {location.state}</p>
                <p className="text-slate-500">Contact: {location.contactPerson}</p>
                <p className="text-slate-500">{location.registeredEmail}</p>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Details:</h5>
              <div className="text-sm">
                <p className="font-bold text-slate-900">{transaction.paymentMode}</p>
                <p className="text-slate-500">Gateway: {transaction.gatewayName || 'Manual'}</p>
                <p className="text-slate-500">Status: {transaction.paymentStatus}</p>
                {transaction.bankReference && <p className="text-slate-500">UTR: {transaction.bankReference}</p>}
              </div>
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
                <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-4">
                  <div className="font-bold text-slate-900">ISP Recharge - {location.bandwidth} Plan</div>
                  <div className="text-xs text-slate-500">Validity: {transaction.rechargeDate} to {transaction.validUntil}</div>
                </td>
                <td className="py-4 text-right font-bold text-slate-900">₹{transaction.amount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900">
                <td className="py-4 text-sm font-bold text-slate-900">Subtotal</td>
                <td className="py-4 text-right text-sm font-bold text-slate-900">₹{transaction.amount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-2 text-sm text-slate-500">GST (18%)</td>
                <td className="py-2 text-right text-sm text-slate-500">₹{transaction.tax.toLocaleString('en-IN')}</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="py-4 px-4 text-lg font-black text-slate-900 italic serif">Total Amount</td>
                <td className="py-4 px-4 text-right text-lg font-black text-[#007AFF] italic serif">₹{transaction.total.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          <div className="pt-8 space-y-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" size={20} />
              <div className="text-xs text-emerald-700 font-medium">
                This is a computer generated invoice and does not require a physical signature.
              </div>
            </div>
            <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Thank you for choosing NetRenew Central
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-[#1A2B4C] text-white rounded-lg font-bold text-sm hover:bg-[#111d33] transition-colors shadow-lg shadow-[#1A2B4C]/20"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
