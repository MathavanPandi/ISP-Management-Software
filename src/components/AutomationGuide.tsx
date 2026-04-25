import React from 'react';
import { X, Smartphone, ShieldCheck, Mail, Copy, Check, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface AutomationGuideProps {
  onClose: () => void;
}

export const AutomationGuide: React.FC<AutomationGuideProps> = ({ onClose }) => {
  const [copied, setCopied] = React.useState<string | null>(null);
  
  // Get current host to show webhook URL
  const webhookUrl = `${window.location.origin}/api/webhook/otp`;
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const macroDroidJson = `{
  "secret": "YOUR_SECRET_KEY",
  "mobile": "{sms_number}",
  "otp": "{sms_message_extracted_otp}"
}`;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
              <Smartphone size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 italic serif">Mobile Bridge Setup</h3>
              <p className="text-xs text-slate-500 font-medium">Automatic OTP Forwarding via MacroDroid</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
              <h4 className="font-bold text-slate-900">Set Secret Key</h4>
            </div>
            <p className="text-sm text-slate-600 ml-8">
              Open <b>Settings &gt; Secrets</b> in your AI Studio sidebar and add:
            </p>
            <div className="ml-8 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <code className="text-sm font-mono text-slate-800">OTP_BRIDGE_SECRET</code>
              <button 
                onClick={() => copyToClipboard('OTP_BRIDGE_SECRET', 'secret_key')}
                className="text-slate-400 hover:text-[#007AFF]"
              >
                {copied === 'secret_key' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
              <h4 className="font-bold text-slate-900">Configure MacroDroid Action</h4>
            </div>
            <p className="text-sm text-slate-600 ml-8">
              In MacroDroid, create an <b>HTTP Request</b> action (POST) with these details:
            </p>
            
            <div className="ml-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Webhook URL</label>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <code className="text-xs font-mono text-slate-800 break-all">{webhookUrl}</code>
                  <button 
                    onClick={() => copyToClipboard(webhookUrl, 'url')}
                    className="text-slate-400 hover:text-[#007AFF] flex-shrink-0 ml-2"
                  >
                    {copied === 'url' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HTTP Body (JSON Content)</label>
                <div className="relative group">
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
                    {macroDroidJson}
                  </pre>
                  <button 
                    onClick={() => copyToClipboard(macroDroidJson, 'json')}
                    className="absolute top-3 right-3 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700"
                  >
                    {copied === 'json' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="ml-8 p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-800">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Security Tip</span>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
              Your secret key in MacroDroid must exactly match the <code className="bg-amber-100 px-1 rounded">OTP_BRIDGE_SECRET</code> secret you set in AI Studio.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            Got it, I'm ready!
          </button>
        </div>
      </div>
    </div>
  );
};
