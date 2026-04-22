import React from 'react';
import { FileText, ChevronRight, CheckCircle2, AlertCircle, ShieldCheck, Database, Zap, Workflow, Layout, Search, Filter, Paperclip, ClipboardList } from 'lucide-react';
import { cn } from '../lib/utils';

export const PRDViewer: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState('overview');

  const sections = [
    { id: 'overview', title: 'Project Overview', icon: FileText },
    { id: 'roles', title: 'Role Matrix', icon: ShieldCheck },
    { id: 'modules', title: 'Module Specs', icon: Layout },
    { id: 'workflows', title: 'Workflows', icon: Workflow },
    { id: 'automation', title: 'Automation', icon: Zap },
    { id: 'technical', title: 'Technical Specs', icon: Database },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="text-[#FF6B00]" size={24} />
                NetRenew Central: Project Overview
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                NetRenew Central is a specialized SaaS platform designed for multi-location enterprises to centralize the management of ISP (Internet Service Provider) connections, track renewal due dates, manage recharge approvals, and prevent internet downtime across branches, stores, and offices.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Target Audience</h4>
                  <p className="text-sm text-slate-500">HO IT Teams, Branch Managers, Finance Departments of multi-location retail/office chains.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Core Value Prop</h4>
                  <p className="text-sm text-slate-500">Zero downtime due to missed recharges, centralized financial control, and automated escalation.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'roles':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-[#FF6B00]" size={24} />
                Role Permission Matrix
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module</th>
                      <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Super Admin</th>
                      <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">IT Manager</th>
                      <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch Mgr</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-700">Location Master</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">CRUD</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">CRUD</td>
                      <td className="py-3 px-4 text-slate-400">View Only</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-700">Due Tracker</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">All</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">All</td>
                      <td className="py-3 px-4 text-blue-600 font-bold">Own Branch</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-700">Approvals</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Final</td>
                      <td className="py-3 px-4 text-blue-600 font-bold">Review</td>
                      <td className="py-3 px-4 text-slate-400">No Access</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'modules':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Dashboard', desc: 'Real-time KPIs (Due in 3/7 days, Overdue, Monthly Cost).' },
                { title: 'Due Tracker', desc: 'Actionable list with "Initiate Recharge" and "Send Reminder" triggers.' },
                { title: 'Location Master', desc: 'Branch-wise ISP details, Account IDs, and Admin Owners.' },
                { title: 'ISP Plan Master', desc: 'Approved vendor catalog with bandwidth and billing cycles.' },
              ].map((m, i) => (
                <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-2">{m.title}</h4>
                  <p className="text-sm text-slate-500">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'workflows':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Workflow className="text-[#FF6B00]" size={24} />
                Core Workflows
              </h3>
              <div className="space-y-8">
                <div className="relative pl-8 border-l-2 border-slate-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#FF6B00] border-4 border-white shadow-sm"></div>
                  <h4 className="font-bold text-slate-900 mb-2">Recharge Entry Workflow</h4>
                  <p className="text-sm text-slate-500">Select Location → Auto-populate Plan → Enter TXN Ref → Upload Proof → Submit for Approval.</p>
                </div>
                <div className="relative pl-8 border-l-2 border-slate-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
                  <h4 className="font-bold text-slate-900 mb-2">Approval Logic</h4>
                  <p className="text-sm text-slate-500">IT Review (Plan Check) → Finance Verification (Bank Statement Match) → Final Approval.</p>
                </div>
                <div className="relative pl-8 border-l-2 border-slate-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-rose-500 border-4 border-white shadow-sm"></div>
                  <h4 className="font-bold text-slate-900 mb-2">Overdue Escalation</h4>
                  <p className="text-sm text-slate-500">T-3: Email to Mgr → T-1: WhatsApp Alert → Day 0: SMS to Admin → Day +1: Email to HO IT Head.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'automation':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Zap className="text-[#FF6B00]" size={24} />
                Automation Logic
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-1">Daily Due-Date Sync</h4>
                  <p className="text-sm text-slate-500 italic mb-2">Trigger: 00:01 AM Daily</p>
                  <code className="text-xs bg-slate-900 text-slate-300 p-3 rounded-lg block">
                    DaysRemaining = NextDueDate - CurrentDate;<br />
                    if (DaysRemaining &lt; 0) status = 'Overdue';<br />
                    else if (DaysRemaining &lt;= 7) status = 'Due Soon';
                  </code>
                </div>
              </div>
            </div>
          </div>
        );
      case 'technical':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Database className="text-[#FF6B00]" size={24} />
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database Schema</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> <strong>locations:</strong> PK, name, isp_id, plan_id, due_date</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> <strong>transactions:</strong> PK, loc_id, amount, proof_url, status</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> <strong>audit_logs:</strong> timestamp, user, action, module</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit Log Format</h4>
                  <div className="p-3 bg-slate-900 rounded-lg text-[10px] font-mono text-slate-300">
                    {`{
  "timestamp": "2026-04-01T12:00:00Z",
  "user": "HO-IT-01",
  "action": "UPDATE_PLAN",
  "metadata": { "old": "PL-001", "new": "PL-002" }
}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 italic serif">Product Requirement Document</h2>
          <p className="text-slate-500">Implementation-ready specifications for NetRenew Central</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
          <CheckCircle2 size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">v1.0 Approved</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl transition-all text-left",
                  activeSection === s.id 
                    ? "bg-[#FF6B00] text-white shadow-lg shadow-orange-200" 
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="text-sm font-bold">{s.title}</span>
                </div>
                <ChevronRight size={16} className={cn("transition-transform", activeSection === s.id ? "rotate-90" : "")} />
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};
