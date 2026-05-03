import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Megaphone, Activity, Database, Server, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SystemSettings() {
  const [broadcast, setBroadcast] = useState('');
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHealth = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/health');
    setHealth(res.data);
  };

  useEffect(() => { fetchHealth(); }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/admin/broadcast', { message: broadcast });
      alert("Announcement broadcasted to all users.");
      setBroadcast('');
    } catch (err) {
      alert("Failed to send broadcast.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">System Control</h1>
        <p className="text-gray-500 mt-2 font-medium italic">Configure global parameters and monitor infrastructure.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
     
        <div className="bg-[#0f0f0f] border border-white/5 p-10 rounded-[40px] relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <Megaphone className="text-indigo-500" /> Global Broadcast
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Publish a message that will appear at the top of every Project Manager and Team Member's dashboard.
            </p>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <textarea 
                required
                value={broadcast}
                onChange={(e) => setBroadcast(e.target.value)}
                placeholder="Type system-wide announcement..."
                className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-white outline-none focus:ring-2 focus:ring-indigo-600 h-32 transition-all"
              />
              <button 
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                {loading ? <Loader2 className="animate-spin" size={16}/> : <Send size={16}/>}
                Publish Announcement
              </button>
            </form>
          </div>
        </div>

    
        <div className="space-y-6">
          <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] px-2">Infrastructure Status</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-[32px] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                  <Database size={20} />
                </div>
                <p className="font-bold text-white">Database Cluster</p>
              </div>
              <span className="text-emerald-500 text-xs font-black uppercase">Active</span>
            </div>

            <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-[32px] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                  <Server size={20} />
                </div>
                <p className="font-bold text-white">API Gateway</p>
              </div>
              <span className="text-indigo-400 text-xs font-black uppercase">{health?.latency || '24ms'}</span>
            </div>

            <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-[32px] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500">
                  <Activity size={20} />
                </div>
                <p className="font-bold text-white">Memory Load</p>
              </div>
              <span className="text-gray-500 text-xs font-black uppercase">Normal</span>
            </div>
          </div>

          <div className="p-8 bg-indigo-600 rounded-[40px] shadow-2xl shadow-indigo-600/20">
             <ShieldCheck className="text-white mb-4" size={32} />
             <h4 className="text-white font-bold">Maintenance Mode</h4>
             <p className="text-indigo-100 text-xs mt-1 leading-relaxed">Disable public registration and lock APIs for updates.</p>
             <button className="mt-6 px-6 py-2 bg-white text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105">
                Enable Lock
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}