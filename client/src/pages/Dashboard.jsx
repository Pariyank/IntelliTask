import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Users, FolderOpen, PieChart, 
  Settings, LogOut, ShieldCheck, Loader2, Menu, ChevronLeft, Zap
} from 'lucide-react';

import AdminView from './dashboards/AdminView';
import Overview from './dashboards/Overview';
import ProjectHub from './dashboards/ProjectHub';
import TeamView from './dashboards/TeamView';
import AnalyticsView from './dashboards/AnalyticsView';
import SystemSettings from './dashboards/SystemSettings';
import MemberView from './dashboards/MemberView';

const Dashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuConfig = {
    Admin: [
      { name: 'Overview', icon: Layout },
      { name: 'User Management', icon: Users },
      { name: 'System Settings', icon: Settings },
    ],
    Manager: [
      { name: 'Overview', icon: Layout },
      { name: 'Projects', icon: FolderOpen },
      { name: 'My Team', icon: Users },
      { name: 'Analytics', icon: PieChart },
    ],
    Member: [
      { name: 'Overview', icon: Layout },
      { name: 'My Tasks', icon: Zap },
      { name: 'Project Hub', icon: FolderOpen },
      { name: 'Productivity', icon: PieChart },
    ]
  };

  const currentMenu = menuConfig[user?.role] || menuConfig.Member;

  const renderView = () => {
    if (user?.role === 'Admin') {
      switch (activeTab) {
        case 'User Management': return <AdminView />;
        case 'System Settings': return <SystemSettings />;
        default: return <Overview />;
      }
    }

    switch (activeTab) {
      case 'Overview': return <Overview />;
      case 'Projects':
      case 'Project Hub': return <ProjectHub />;
      case 'My Team': return <TeamView />;
      case 'Analytics':
      case 'Productivity': return <AnalyticsView />;
      case 'My Tasks': return <MemberView />;
      default: return <Overview />;
    }
  };

  if (authLoading || !user) {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <p className="text-gray-500 font-black tracking-widest uppercase text-xs italic">Verifying Authorization...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
 
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} border-r border-white/5 bg-[#0a0a0a] flex flex-col p-6 transition-all duration-300 relative z-50`}>
        <div className="flex items-center gap-3 mb-12 px-2 font-black text-xl italic text-indigo-500">
          <ShieldCheck size={28} fill="currentColor" />
          {isSidebarOpen && <span className="tracking-tighter">IntelliTask</span>}
        </div>

        <nav className="flex-1 space-y-2">
          {currentMenu.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                activeTab === item.name 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className="shrink-0" />
              {isSidebarOpen && <span className="truncate">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all font-black uppercase tracking-[0.2em] text-[10px] border border-rose-500/20"
          >
            <LogOut size={18} className="shrink-0" />
            {isSidebarOpen && <span>Terminate Session</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#050505]/50 backdrop-blur-xl shrink-0 z-40">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-all"
            >
              {isSidebarOpen ? <ChevronLeft size={20}/> : <Menu size={20}/>}
            </button>
            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-600">
              {activeTab} Module / {user.role} Identity
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 pl-6 border-l border-white/10 text-right">
              <div>
                <p className="text-sm font-bold text-white leading-none tracking-tight">{user.displayName}</p>
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1.5">{user.role}</p>
              </div>
              <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-indigo-600/30" alt="" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;