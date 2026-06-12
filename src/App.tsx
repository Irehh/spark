import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Bell, User, Shield, Flame, Search, TrendingUp, Settings as SettingsIcon, Wallet } from 'lucide-react';
import { useStore } from './store/useStore';

// Pages
import DiscoveryPage from './pages/DiscoveryPage';
import MatchesPage from './pages/MatchesPage';
import ChatPage from './pages/ChatPage';
import NotificationPage from './pages/NotificationPage';
import ProfilePage from './pages/ProfilePage';
import SafetyCenter from './pages/SafetyCenter';
import { AdminDashboard } from './pages/AdminDashboard'; // Added AdminDashboard import
import { WalletPage } from './pages/WalletPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { PreferencesPage } from './pages/PreferencesPage';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Search, path: '/', label: 'Discover' },
    { icon: Heart, path: '/matches', label: 'Matches' },
    { icon: MessageCircle, path: '/chat', label: 'Messages' },
    { icon: Bell, path: '/notifications', label: 'Notifications' },
    { icon: Shield, path: '/safety', label: 'Safety Hub' },
    { icon: User, path: '/profile', label: 'My Profile' },
    { icon: Wallet, path: '/wallet', label: 'Wallet' },
    { icon: SettingsIcon, path: '/admin', label: 'Admin panel' },
  ];

  return (
    <aside className="hidden lg:flex w-72 h-screen bg-dark-900 border-r border-dark-800 flex-col p-8 sticky top-0">
      <div className="flex items-center space-x-2 mb-12">
        <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center shadow-lg shadow-brand-red/20">
          <Flame className="text-white" size={20} fill="currentColor" />
        </div>
        <h1 className="text-2xl font-black tracking-tighter text-brand-red italic">SPARK<span className="w-1.5 h-1.5 bg-brand-red inline-block ml-1 rounded-full"></span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-dark-800 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm font-semibold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="bg-dark-800/50 rounded-2xl p-5 border border-white/5">
        <div className="flex items-center space-x-2 text-brand-red text-xs font-bold uppercase tracking-widest mb-2">
          <Shield size={14} />
          <span>Safety Center</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed mb-4">Share date details with a trusted contact.</p>
        <button 
          onClick={() => navigate('/safety')}
          className="text-xs font-bold text-brand-red hover:underline"
        >
          Share My Date →
        </button>
      </div>
    </aside>
  );
};

const ActivityPanel = () => {
  const matches = useStore(state => state.matches);
  
  return (
    <aside className="hidden xl:flex w-80 h-screen bg-dark-900 border-l border-dark-800 flex-col p-8 sticky top-0 overflow-y-auto">
      <section className="mb-10">
        <h3 className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-6">New Matches</h3>
        <div className="flex -space-x-3">
          {matches.slice(0, 5).map((match, i) => (
            <div key={match.id} className="w-12 h-12 rounded-full border-2 border-dark-900 overflow-hidden shadow-xl" style={{ zIndex: 10 - i }}>
              <img src={match.user.images[0]} className="w-full h-full object-cover" />
            </div>
          ))}
          {matches.length > 5 && (
            <div className="w-12 h-12 rounded-full border-2 border-dark-900 bg-dark-800 flex items-center justify-center text-xs font-bold text-gray-400 relative z-0">
               +{matches.length - 5}
            </div>
          )}
          {matches.length === 0 && <p className="text-xs text-gray-600 italic">No matches yet</p>}
        </div>
      </section>

      <section>
        <h3 className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-6">Recent Activity</h3>
        <div className="space-y-6">
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red transition-all group-hover:scale-110">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-200">Global Search</p>
              <p className="text-[10px] text-gray-500 font-medium">Matching with locals in London</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue transition-all group-hover:scale-110">
              <Shield size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-200">Profile Verified</p>
              <p className="text-[10px] text-gray-500 font-medium">Security scan completed today</p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
};

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Search, path: '/', label: 'Discover' },
    { icon: Heart, path: '/matches', label: 'Matches' },
    { icon: MessageCircle, path: '/chat', label: 'Chat' },
    { icon: Bell, path: '/notifications', label: 'Alerts' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-dark-900/90 backdrop-blur-2xl border-t border-dark-800 px-6 flex items-center justify-between z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
              isActive ? 'text-brand-red scale-110' : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
          </button>
        );
      })}
    </nav>
  );
};

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Layout Wrappers
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-dark-950 text-white font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:max-w-4xl mx-auto w-full relative h-screen overflow-y-auto pb-16 lg:pb-0">
        {children}
      </main>
      <ActivityPanel />
      <BottomNav />
    </div>
  );
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-dark-950 text-white font-sans overflow-hidden">
      {children}
    </div>
  );
};

export default function App() {
  const fetchDiscovery = useStore(state => state.fetchDiscovery);

  useEffect(() => {
    fetchDiscovery();
    
    useStore.getState().addNotification({
      type: 'safety',
      title: 'Welcome to Spark',
      content: 'Your safety is our priority. Complete your profile verification to build trust.'
    });
  }, []);

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
          <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />

          {/* App Routes */}
          <Route path="/" element={<AppLayout><DiscoveryPage /></AppLayout>} />
          <Route path="/matches" element={<AppLayout><MatchesPage /></AppLayout>} />
          <Route path="/chat/:matchId?" element={<AppLayout><ChatPage /></AppLayout>} />
          <Route path="/notifications" element={<AppLayout><NotificationPage /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
          <Route path="/safety" element={<AppLayout><SafetyCenter /></AppLayout>} />
          <Route path="/admin" element={<AppLayout><AdminDashboard /></AppLayout>} />
          <Route path="/wallet" element={<AppLayout><WalletPage /></AppLayout>} />
          <Route path="/edit-profile" element={<AppLayout><EditProfilePage /></AppLayout>} />
          <Route path="/preferences" element={<AppLayout><PreferencesPage /></AppLayout>} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}
