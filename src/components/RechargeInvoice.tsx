import React from 'react';
import { X, Printer, Globe, FileText } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { RechargeTransaction, Location } from '../types';
import { cn } from '../lib/utils';

interface RechargeInvoiceProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: RechargeTransaction | null;
  location: Location | null;
}

const numberToWords = (num: number): string => {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' and ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' lakh' + (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '');
  return num.toString();
};

const formatDate = (dateStr: string) => {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    return format(date, 'dd MMMM yyyy');
  } catch {
    return dateStr;
  }
};

export function RechargeInvoice({ isOpen, onClose, transaction, location }: RechargeInvoiceProps) {
  if (!isOpen || !transaction || !location) return null;

  const handlePrint = () => {
    window.print();
  };

  const gstRate = 0.18;
  const calculatedTax = transaction.amount * gstRate;
  const calculatedTotal = transaction.amount + calculatedTax;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print-overlay">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { 
            size: A4; 
            margin: 10mm; 
          }
          body { 
            background: white !important; 
            margin: 0;
            padding: 0;
          }
          .no-print { display: none !important; }
          .no-print-overlay {
            position: absolute !important;
            background: white !important;
            padding: 0 !important;
            display: block !important;
            z-index: 9999 !important;
          }
          .invoice-container { 
            box-shadow: none !important; 
            border: none !important; 
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
          }
          .print-border { border: 1px solid #e2e8f0 !important; }
          .print-bg-slate { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; }
          .print-text-blue { color: #007AFF !important; -webkit-print-color-adjust: exact; }
        }
      `}} />
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[95vh] invoice-container">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <FileText size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 italic serif">Invoice Preview</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-[#007AFF] text-white rounded-lg transition-all hover:bg-[#0066CC] flex items-center gap-2 text-xs font-bold shadow-md shadow-[#007AFF]/20"
            >
              <Printer size={16} />
              Print Invoice
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-10 overflow-y-auto space-y-8 flex-1 print:p-0 print:overflow-visible">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#007AFF] print-text-blue">
                <Globe size={32} strokeWidth={2.5} />
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter italic leading-none">NetRenew</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Central Management</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">Service Provider</p>
                <div className="text-xs text-slate-500 space-y-0.5">
                  <p className="font-bold text-slate-800 text-base">Mizaj IT Solutions Pvt Ltd</p>
                  <p>Corporate Office: 4th Floor, Tech Hub Tower</p>
                  <p>Cyber City, Phase II, Haryana - 122002</p>
                  <p>GSTIN: 06ABCDE1234F1Z5</p>
                  <p>CIN: U72900HR2023PTC123456</p>
                </div>
              </div>
            </div>

            <div className="text-right space-y-4">
              <div className="space-y-1">
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter opacity-10 leading-none">INVOICE</h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Original for Recipient</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 print-bg-slate print-border space-y-3">
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Invoice Number</p>
                  <p className="text-sm font-bold text-slate-900 font-mono">{transaction.transactionId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Billing Date</p>
                  <p className="text-sm font-bold text-slate-900">{formatDate(transaction.rechargeDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Due Date</p>
                  <p className="text-sm font-bold text-slate-900">{formatDate(transaction.validUntil)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 py-8 border-y-2 border-slate-900/10 print-border">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Billed To (Customer)</h5>
              </div>
              <div className="pl-3 space-y-1">
                <p className="font-bold text-slate-900 text-lg">{location.name}</p>
                <div className="text-xs text-slate-500 leading-relaxed max-w-[280px]">
                  <p>{location.address || 'Standard Service Location'}</p>
                  <p>{location.city}, {location.state}, {location.country}</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Contact:</span>
                      <span className="text-slate-900 font-bold">{location.contactPerson}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Account ID:</span>
                      <span className="text-slate-900 font-bold font-mono">{location.accountId}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-end">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Summary</h5>
                <div className="w-1.5 h-4 bg-[#007AFF] rounded-full"></div>
              </div>
              <div className="pr-3 text-right space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase">Payment Mode</p>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-wide">{transaction.paymentMode}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                  <span className={cn(
                    "inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    transaction.paymentStatus === 'Success' ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                  )}>
                    {transaction.paymentStatus}
                  </span>
                </div>
                {transaction.bankReference && (
                  <div className="space-y-1 pt-2">
                    <p className="text-xs font-bold text-slate-400 uppercase">Reference No / UTR</p>
                    <p className="text-sm font-bold text-[#007AFF] font-mono">{transaction.bankReference}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white print-bg-slate print:text-slate-900">
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest first:rounded-l-lg last:rounded-r-lg whitespace-nowrap">Description</th>
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-center whitespace-nowrap">HSN/SAC</th>
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-center whitespace-nowrap">Qty</th>
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-right whitespace-nowrap">Rate</th>
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-right whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="group">
                  <td className="px-6 py-8">
                    <div className="font-black text-slate-900 text-base">{location.bandwidth} Fiber Internet Service</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Provider: {location.ispProviderName}</div>
                    <div className="text-xs text-slate-500 mt-2 bg-slate-50 inline-block px-2 py-1 rounded print-bg-slate">
                      Service Period: <span className="font-bold text-slate-700">{formatDate(transaction.rechargeDate)}</span> to <span className="font-bold text-slate-700">{formatDate(transaction.validUntil)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-center text-xs font-mono font-bold text-slate-500">998422</td>
                  <td className="px-6 py-8 text-center text-sm font-bold text-slate-900">1</td>
                  <td className="px-6 py-8 text-right text-sm font-bold text-slate-900">₹{transaction.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-8 text-right font-black text-[#007AFF] text-lg print-text-blue">₹{transaction.amount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4">
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Subtotal (Taxable Value)</span>
                <span className="text-slate-900 font-bold">₹{transaction.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Integrated Tax (IGST 18%)</span>
                <span className="text-slate-900 font-bold">₹{calculatedTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 border-t-4 border-slate-900 flex justify-between items-center print-border">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-[#007AFF] print-text-blue uppercase tracking-[0.2em] leading-none mb-1">Grand Total</span>
                  <span className="text-[9px] text-slate-400 font-bold italic">Inclusive of all taxes</span>
                </div>
                <span className="text-4xl font-black text-slate-900 tracking-tighter italic serif">₹{calculatedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 print-bg-slate print-border">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Amount in Words</p>
                <p className="text-xs font-bold text-slate-900 italic capitalize leading-relaxed">
                  Rupees {numberToWords(Math.floor(calculatedTotal))} Only
                </p>
              </div>
              
              <div className="text-[10px] space-y-1">
                <p className="text-slate-900 font-bold uppercase tracking-wider">Terms & Conditions:</p>
                <ul className="text-slate-500 space-y-0.5 list-disc pl-4 italic">
                  <li>This is a computer-generated invoice and doesn't require a physical signature.</li>
                  <li>Receipt of payment is subject to bank clearance.</li>
                  <li>In case of discrepancy, notify the provider within 7 working days.</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-end space-y-4 pt-12 md:pt-0">
              <div className="w-full border-b-2 border-slate-900 pt-16 print-border"></div>
              <div className="text-center">
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Authorized Signatory</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">NetRenew Digital Records</p>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-12">
            <div className="inline-block px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black tracking-[0.3em] italic serif uppercase print:border print:border-slate-900 print:text-slate-900 print:bg-transparent">
              Certified NetRenew Service Record
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3 no-print">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-[#1A2B4C] text-white rounded-lg font-bold text-sm hover:bg-[#111d33] transition-colors shadow-lg shadow-[#1A2B4C]/20"
          >
            Close Preview
          </button>
          <button
            onClick={handlePrint}
            className="flex-2 flex items-center justify-center gap-2 bg-[#007AFF] text-white rounded-lg font-bold text-sm hover:bg-[#0066CC] transition-colors shadow-lg shadow-[#007AFF]/20"
          >
            <Printer size={18} />
            Print Official Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
