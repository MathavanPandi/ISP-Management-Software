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

  // Calculate GST (18%) and Total based on transaction amount as requested
  const gstRate = 0.18;
  const calculatedTax = transaction.amount * gstRate;
  const calculatedTotal = transaction.amount + calculatedTax;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: auto; margin: 20mm; }
          body { background: white !important; }
          .no-print { display: none !important; }
          .invoice-container { 
            box-shadow: none !important; 
            border: none !important; 
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-border-b { border-bottom: 2px solid #e2e8f0 !important; }
        }
      `}} />
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] invoice-container">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 no-print">
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
                <p className="font-bold text-lg text-slate-900">Mizaj IT Solutions Pvt Ltd</p>
                <p>123 Tech Park, Sector 62</p>
                <p>Noida, Uttar Pradesh - 201301</p>
                <p className="mt-2 font-bold text-slate-900">GSTIN: 29AAAAA0000A1Z5</p>
                <p>Email: support@mizaj.com | Phone: +91 120 456 7890</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <h4 className="text-4xl font-black text-slate-900 uppercase tracking-tighter opacity-10">INVOICE</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">NO: {transaction.transactionId.split('-').pop() || transaction.id.slice(0, 8).toUpperCase()}</p>
              <div className="mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Issue</p>
                <p className="text-sm font-bold text-slate-900">{transaction.rechargeDate}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 py-8 border-y border-slate-100 print-border-b">
            <div className="space-y-2">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bill To:</h5>
              <div className="text-sm">
                <p className="font-bold text-slate-900 text-base">{location.name}</p>
                <p className="text-slate-500">{location.address || 'Address Not Provided'}</p>
                <p className="text-slate-500">{location.city}, {location.state}</p>
                <p className="text-slate-500 mt-2"><strong>Contact:</strong> {location.contactPerson}</p>
                <p className="text-slate-500"><strong>GSTIN:</strong> {location.accountId || 'URD (Unregistered)'}</p>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Info:</h5>
              <div className="text-sm">
                <p className="font-bold text-slate-900 uppercase">{transaction.paymentMode}</p>
                <p className="text-slate-500">Method: {transaction.gatewayName || 'Manual Entry'}</p>
                <p className={cn(
                  "font-bold mt-1",
                  transaction.paymentStatus === 'Success' ? "text-emerald-600" : "text-amber-500"
                )}>
                  Payment Status: {transaction.paymentStatus}
                </p>
                {transaction.bankReference && (
                  <p className="text-slate-500 mt-1">UTR/Ref: <span className="font-mono">{transaction.bankReference}</span></p>
                )}
              </div>
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item Description</th>
                <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">HSN/SAC</th>
                <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Base Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-6">
                  <div className="font-bold text-slate-900">ISP Subscription - {location.bandwidth}</div>
                  <div className="text-xs text-slate-500 mt-1">Account ID: {location.accountId}</div>
                  <div className="text-xs text-slate-500 italic">Validity Period: {transaction.rechargeDate} to {transaction.validUntil}</div>
                </td>
                <td className="py-6 text-center text-xs font-mono text-slate-500">998422</td>
                <td className="py-6 text-right font-bold text-slate-900">₹{transaction.amount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900">
                <td colSpan={2} className="py-4 text-sm font-bold text-slate-900 text-right pr-12">Taxable Value</td>
                <td className="py-4 text-right text-sm font-bold text-slate-900">₹{transaction.amount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td colSpan={2} className="py-2 text-sm text-slate-500 text-right pr-12">IGST (18%)</td>
                <td className="py-2 text-right text-sm text-slate-500">₹{calculatedTax.toLocaleString('en-IN')}</td>
              </tr>
              <tr className="bg-slate-50 print:bg-transparent">
                <td colSpan={2} className="py-4 px-4 text-xl font-black text-slate-900 italic serif text-right pr-12 uppercase tracking-tighter">Grand Total</td>
                <td className="py-4 px-4 text-right text-xl font-black text-[#007AFF] italic serif ring-1 ring-inset ring-slate-100">₹{calculatedTotal.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          <div className="pt-12 space-y-8">
            <div className="flex justify-between items-end">
              <div className="space-y-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount in Words:</div>
                <p className="text-sm font-bold text-slate-900 italic capitalize">
                  {(() => {
                    const toWords = (num: number): string => {
                      const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
                      const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
                      
                      if (num < 20) return ones[num];
                      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
                      if (num < 1000) return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' and ' + toWords(num % 100) : '');
                      if (num < 100000) return toWords(Math.floor(num / 1000)) + ' thousand' + (num % 1000 !== 0 ? ' ' + toWords(num % 1000) : '');
                      return num.toString();
                    };
                    return `Rupees ${toWords(Math.floor(calculatedTotal))} Only`;
                  })()}
                </p>
              </div>
              <div className="text-center w-48 space-y-2">
                <div className="h-12 border-b border-slate-200"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Signatory</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3 no-print">
              <CheckCircle2 className="text-emerald-500" size={20} />
              <div className="text-xs text-emerald-700 font-medium">
                Payment verified and maturity dates updated successfully in the tracking engine.
              </div>
            </div>
            
            <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest border-t border-slate-100 pt-8">
              Thank you for choosing NetRenew Central - Empowering Connectivity
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3 no-print">
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
            <Printer size={18} />
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
