import React from 'react';
import { 
  Layout, 
  Monitor, 
  Smartphone, 
  Layers, 
  MousePointer2, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Calendar as CalendarIcon,
  Eye,
  FileText,
  Clock,
  Shield,
  CreditCard,
  Bell,
  Settings as SettingsIcon,
  Paperclip,
  History
} from 'lucide-react';
import { cn } from '../lib/utils';

export const UISpecsViewer: React.FC = () => {
  const [activeScreen, setActiveScreen] = React.useState('dashboard');

  const screens = [
    { id: 'dashboard', title: 'Dashboard', icon: Monitor },
    { id: 'location-list', title: 'Location Master List', icon: Layers },
    { id: 'location-detail', title: 'Location Detail Page', icon: Eye },
    { id: 'location-form', title: 'Add/Edit Location', icon: Plus },
    { id: 'isp-master', title: 'ISP Provider Master', icon: Shield },
    { id: 'plan-master', title: 'Plan Master', icon: FileText },
    { id: 'recharge-entry', title: 'Recharge Entry', icon: MousePointer2 },
    { id: 'payment-gateway', title: 'Payment Gateway (UPI/Cards)', icon: CreditCard },
    { id: 'reconciliation', title: 'Payment Reconciliation', icon: CheckCircle2 },
    { id: 'due-tracker', title: 'Due Tracker', icon: Clock },
    { id: 'overdue-dashboard', title: 'Overdue Dashboard', icon: AlertCircle },
    { id: 'approval-queue', title: 'Approval Queue', icon: CheckCircle2 },
    { id: 'notifications', title: 'Notification Templates', icon: Bell },
    { id: 'reports', title: 'Reports Page', icon: Monitor },
    { id: 'calendar', title: 'Calendar View', icon: CalendarIcon },
    { id: 'attachment', title: 'Attachment Drawer', icon: Paperclip },
    { id: 'audit-log', title: 'Audit Log Viewer', icon: History },
    { id: 'settings', title: 'Settings Page', icon: SettingsIcon },
  ];

  const renderSpecs = () => {
    switch (activeScreen) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <Monitor className="text-[#FF6B00]" size={24} />
                Dashboard Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">High-level visibility into ISP health, upcoming costs, and critical downtime risks.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Target User</h4>
                    <p className="text-slate-600">HO IT Manager, Super Admin, Finance Head.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Layout Structure</h4>
                    <p className="text-slate-600">Bento-grid style. 4 KPI cards at top. 2-column main area (Left: Due Soon List, Right: ISP Distribution Chart).</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">KPIs</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Total Active Locations</li>
                      <li>Due in 3 Days (Critical)</li>
                      <li>Overdue Count</li>
                      <li>Total Monthly ISP Cost</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Alerts</h4>
                    <p className="text-slate-600">Sticky banner if &gt; 5 locations are overdue.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Status Chips</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Healthy</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded uppercase">Due Soon</span>
                  <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded uppercase">Overdue</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Buttons</h4>
                <p className="text-xs text-slate-500">Export PDF, Refresh, Filter, View All Locations.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Mobile Behavior</h4>
                <p className="text-xs text-slate-500">Cards stack 1-per-row. Charts convert to simplified bar views.</p>
              </div>
            </div>
          </div>
        );
      case 'location-list':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <Layers className="text-[#FF6B00]" size={24} />
                Location Master List Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Centralized directory of all company branches and their ISP mapping.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Table Columns</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Location Name (Link to Detail)</li>
                      <li>City/State</li>
                      <li>Current ISP</li>
                      <li>Plan Name</li>
                      <li>Next Due Date</li>
                      <li>Status (Chip)</li>
                      <li>Actions (Edit/Delete)</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Filters</h4>
                    <p className="text-slate-600">Search by Name, Filter by ISP, Filter by Status, Filter by Region.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Empty State</h4>
                    <p className="text-slate-600">"No locations found. Add your first branch to start tracking." + [Add Location] Button.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'location-detail':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <Eye className="text-[#FF6B00]" size={24} />
                Location Detail Page Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">360-degree view of a specific location's internet infrastructure and history.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Layout</h4>
                    <p className="text-slate-600">Header with Status & Quick Actions. 3-Tab View: (1) Info, (2) Recharge History, (3) Credentials.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Fields</h4>
                    <p className="text-slate-600">ISP Portal URL, Account ID, Static IP, Primary Contact, Emergency Contact.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Buttons</h4>
                    <p className="text-slate-600">Edit Details, Initiate Recharge, Send Alert to Branch Manager.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'location-form':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <Plus className="text-[#FF6B00]" size={24} />
                Add/Edit Location Form Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Fields</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Location Name (Text)</li>
                      <li>Address (Textarea)</li>
                      <li>City/State (Select)</li>
                      <li>ISP Provider (Dropdown)</li>
                      <li>Plan Selection (Dependent Dropdown)</li>
                      <li>Account ID (Text)</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Validations</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Location Name: Required, Unique</li>
                      <li>Account ID: Required</li>
                      <li>ISP/Plan: Must be selected</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Mobile Behavior</h4>
                    <p className="text-slate-600">Full-screen modal on mobile with sticky footer buttons (Save/Cancel).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'isp-master':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <Shield className="text-[#FF6B00]" size={24} />
                ISP Provider Master Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Manage approved vendor list and their support contact details.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Fields</h4>
                    <p className="text-slate-600">ISP Name, Support Email, Support Phone, Portal URL, Logo Upload.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Table Columns</h4>
                    <p className="text-slate-600">Provider Name, Active Locations Count, Support Contact, Last Updated.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'plan-master':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <FileText className="text-[#FF6B00]" size={24} />
                Plan Master Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Standardize plans across locations to prevent billing errors.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Fields</h4>
                    <p className="text-slate-600">Plan Name, Bandwidth (Mbps), Validity (Days), Cost (INR), ISP Mapping.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Validations</h4>
                    <p className="text-slate-600">Cost must be &gt; 0. Validity must be &gt; 0.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'recharge-entry':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <MousePointer2 className="text-[#FF6B00]" size={24} />
                Recharge Entry Screen Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Manual entry of recharge details after payment is made on ISP portal.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Fields</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Location (Searchable Select)</li>
                      <li>Plan (Auto-populated, Read-only)</li>
                      <li>Transaction ID (Text)</li>
                      <li>Recharge Date (Datepicker)</li>
                      <li>Payment Proof (File Upload)</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Validations</h4>
                    <p className="text-slate-600">Proof upload mandatory. Transaction ID mandatory.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Buttons</h4>
                    <p className="text-slate-600">Submit for Approval, Save Draft, Cancel.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'payment-gateway':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <CreditCard className="text-[#FF6B00]" size={24} />
                Payment Gateway Specification (Indian Methods)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Seamless payment experience using Razorpay/PhonePe PG integration.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Supported Methods</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>UPI (GPay, PhonePe, Paytm)</li>
                      <li>Net Banking (All major banks)</li>
                      <li>Cards (Visa, MC, RuPay)</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">UI Components</h4>
                    <p className="text-slate-600">Standard PG Overlay, Success/Failure Animation, Transaction Summary.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'reconciliation':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <CheckCircle2 className="text-[#FF6B00]" size={24} />
                Payment Reconciliation Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Match bank statements with system records to ensure zero leakage.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Features</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Bank Statement Upload (CSV/Excel)</li>
                      <li>Auto-matching by UTR/Transaction ID</li>
                      <li>Manual Override for discrepancies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'due-tracker':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <Clock className="text-[#FF6B00]" size={24} />
                Due Tracker Screen Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Real-time monitoring of upcoming renewals with quick communication triggers.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Table Columns</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Location</li>
                      <li>Due Date</li>
                      <li>Days Remaining (Color Coded)</li>
                      <li>Quick Alerts (Email/WhatsApp Icons)</li>
                      <li>Status</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Status Chips</h4>
                    <p className="text-slate-600">Overdue (Rose), Due Today (Amber), Due in 3 Days (Orange), Upcoming (Blue).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'overdue-dashboard':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <AlertCircle className="text-[#FF6B00]" size={24} />
                Overdue Dashboard Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Critical view focusing only on locations where internet is potentially down.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">KPIs</h4>
                    <p className="text-slate-600">Total Overdue, Avg. Days Overdue, Estimated Downtime Cost.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Buttons</h4>
                    <p className="text-slate-600">Bulk Remind Managers, Export Overdue Report, Mark as "ISP Issue".</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'approval-queue':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <CheckCircle2 className="text-[#FF6B00]" size={24} />
                Approval Queue Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Financial control point to verify recharges before they update the master due date.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Layout</h4>
                    <p className="text-slate-600">List view with "Quick Compare" side-by-side (TXN Details vs Uploaded Proof).</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Buttons</h4>
                    <p className="text-slate-600">Approve, Reject (with Reason), View Proof, Edit Entry.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <Bell className="text-[#FF6B00]" size={24} />
                Notification Templates Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Centralized management of automated communication content across Email, WhatsApp, and Push.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Target User</h4>
                    <p className="text-slate-600">IT Admins, Operations Managers.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Key Features</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Dynamic Variable Injection</li>
                      <li>Subject Line Customization (Email)</li>
                      <li>Rich Text/Markdown Editor</li>
                      <li>Template Versioning</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <Monitor className="text-[#FF6B00]" size={24} />
                Reports Page Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Data-driven insights for budgeting and vendor performance analysis.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Report Types</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Monthly Expenditure Report</li>
                      <li>ISP Downtime/Overdue Analysis</li>
                      <li>Location-wise Cost Comparison</li>
                      <li>Audit Compliance Report</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Filters</h4>
                    <p className="text-slate-600">Date Range, ISP, Region, Cost Center.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <CalendarIcon className="text-[#FF6B00]" size={24} />
                Calendar Due-Date View Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Visual timeline of upcoming financial commitments.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Layout</h4>
                    <p className="text-slate-600">Standard Monthly Grid. Days with renewals show dots (Color-coded by ISP).</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Interaction</h4>
                    <p className="text-slate-600">Clicking a date opens a sidebar with the list of locations due on that day.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'attachment':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <Paperclip className="text-[#FF6B00]" size={24} />
                Attachment Upload Drawer Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Standardized UI for uploading payment proofs and ISP contracts.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Features</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Drag & Drop Zone</li>
                      <li>File Preview (Image/PDF)</li>
                      <li>Max Size Limit (5MB)</li>
                      <li>Allowed Formats: JPG, PNG, PDF</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Mobile Behavior</h4>
                    <p className="text-slate-600">Direct access to Camera for instant proof capture.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'audit-log':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <History className="text-[#FF6B00]" size={24} />
                Audit Log Viewer Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Traceability of all plan changes, approvals, and system automations.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Table Columns</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Timestamp</li>
                      <li>User</li>
                      <li>Action (e.g., PLAN_UPDATE)</li>
                      <li>Module</li>
                      <li>Changes (JSON Diff View)</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Filters</h4>
                    <p className="text-slate-600">Filter by User, Module, or Date Range.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 italic serif">
                <SettingsIcon className="text-[#FF6B00]" size={24} />
                Settings Page Specification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Purpose</h4>
                    <p className="text-slate-600">Configure global system behavior and notification rules.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Sections</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>User Management (RBAC)</li>
                      <li>Notification Templates (Email/SMS)</li>
                      <li>System Preferences (Currency, Date Format)</li>
                      <li>API Integrations (ISP Portal Sync)</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Mobile Behavior</h4>
                    <p className="text-slate-600">Vertical list of settings categories with chevron navigation.</p>
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
          <h2 className="text-2xl font-bold text-slate-900 italic serif">UI/UX Screen Specifications</h2>
          <p className="text-slate-500">Design guidelines and component logic for NetRenew Central</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
          <Layers size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Design System v1.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-1 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {screens.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveScreen(s.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group",
                  activeScreen === s.id 
                    ? "bg-[#1A2B4C] text-white shadow-lg" 
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    activeScreen === s.id ? "bg-white/10" : "bg-slate-100 group-hover:bg-slate-200"
                  )}>
                    <Icon size={16} />
                  </div>
                  <span className="text-xs font-bold">{s.title}</span>
                </div>
                <ChevronRight size={14} className={cn("transition-transform", activeScreen === s.id ? "rotate-90" : "opacity-0 group-hover:opacity-100")} />
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3">
          {renderSpecs()}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
};
