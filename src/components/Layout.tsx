import React from 'react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export function Layout({ children, onLogout }: LayoutProps) {
  const location = useLocation();
  
  // Map routes to titles
  const getTitle = (pathname: string) => {
    if (pathname === '/') return 'IT Operations Dashboard';
    if (pathname.startsWith('/locations')) return 'Location Management';
    if (pathname.startsWith('/due-tracker')) return 'Due Tracker';
    if (pathname.startsWith('/isp-plans')) return 'ISP & Plans';
    if (pathname.startsWith('/history')) return 'Recharge History';
    if (pathname.startsWith('/reconciliation')) return 'Payment Reconciliation';
    if (pathname.startsWith('/approvals')) return 'Approvals';
    if (pathname.startsWith('/notifications')) return 'Notifications';
    if (pathname.startsWith('/reports')) return 'Reports & Analytics';
    if (pathname.startsWith('/settings')) return 'Settings';
    return 'ISP Management';
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="hidden lg:block">
            <div className="text-sm font-medium text-slate-500 italic serif">NetRenew Central • Enterprise</div>
            <div className="text-lg font-bold text-slate-900">{getTitle(location.pathname)}</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-[#FF6B00] rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">System Online</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img 
                src="https://picsum.photos/seed/netrenew/100/100" 
                alt="Admin" 
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
