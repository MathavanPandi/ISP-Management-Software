import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LocationList } from './components/LocationList';
import { LocationForm } from './components/LocationForm';
import { LocationDetail } from './components/LocationDetail';
import { DueTracker } from './components/DueTracker';
import { ISPPlanMaster } from './components/ISPPlanMaster';
import { RechargeHistory } from './components/RechargeHistory';
import { PaymentReconciliation } from './components/PaymentReconciliation';
import { Approvals } from './components/Approvals';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { NotificationSettings } from './components/NotificationSettings';
import { Login } from './components/Login';
import { PRDViewer } from './components/PRDViewer';
import { UISpecsViewer } from './components/UISpecsViewer';

export default function App() {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#007AFF] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={() => {}} />; // Login component handles auth now
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/due-tracker" element={<DueTracker />} />
          
          <Route path="/locations" element={<LocationList />} />
          <Route path="/locations/new" element={<LocationForm />} />
          <Route path="/locations/:id" element={<LocationDetail />} />
          <Route path="/locations/:id/edit" element={<LocationForm />} />
          
          <Route path="/isp-plans" element={<ISPPlanMaster />} />
          <Route path="/history" element={<RechargeHistory />} />
          <Route path="/reconciliation" element={<PaymentReconciliation />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/notifications" element={<NotificationSettings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/prd" element={<PRDViewer />} />
          <Route path="/ui-specs" element={<UISpecsViewer />} />
          <Route path="/settings" element={<Settings />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
