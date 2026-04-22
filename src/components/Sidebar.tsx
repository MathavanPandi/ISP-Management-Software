import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Clock, 
  CreditCard, 
  Globe, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  FileText,
  Layout,
  Bell,
  ArrowRightLeft
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'due-tracker', label: 'Due Tracker', icon: Clock, path: '/due-tracker' },
  { id: 'locations', label: 'Locations', icon: MapPin, path: '/locations' },
  { id: 'isp-plans', label: 'ISP & Plans', icon: Globe, path: '/isp-plans' },
  { id: 'history', label: 'Recharge History', icon: CreditCard, path: '/history' },
  { id: 'reconciliation', label: 'Reconciliation', icon: ArrowRightLeft, path: '/reconciliation' },
  { id: 'approvals', label: 'Approvals', icon: CheckSquare, path: '/approvals' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'prd', label: 'PRD Specs', icon: FileText, path: '/prd' },
  { id: 'ui-specs', label: 'UI/UX Specs', icon: Layout, path: '/ui-specs' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <>
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-[#1A2B4C] text-white transition-transform duration-300 transform lg:translate-x-0",
        !isOpen && "-translate-x-full"
      )}>
        <div className="flex items-center justify-center h-20 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF6B00] rounded-lg flex items-center justify-center font-bold text-xl text-white">N</div>
            <span className="text-xl font-bold tracking-tight">NetRenew Central</span>
          </div>
        </div>

        <nav className="mt-6 px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                isActive 
                  ? "bg-[#007AFF] text-white" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/10 bg-[#1A2B4C]">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white cursor-pointer transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </div>
        </div>
      </div>
    </>
  );
}
