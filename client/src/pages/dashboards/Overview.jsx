import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Zap, Target } from 'lucide-react';

export default function Overview() {
  const { user } = useAuth();

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-5xl font-black tracking-tighter">GOOD MORNING, {user.displayName.toUpperCase()}</h1>
        <p className="text-gray-500 mt-2 text-lg italic">The AI cluster is stable. You have 3 pending notifications.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-card border border-white/5 rounded-[32px]">
          <Shield className="text-indigo-500 mb-4" />
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Global Rank</p>
          <p className="text-2xl font-bold text-white mt-1">Tier 1 {user.role}</p>
        </div>
        <div className="p-8 bg-card border border-white/5 rounded-[32px]">
          <Zap className="text-amber-500 mb-4" />
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Active Sprint</p>
          <p className="text-2xl font-bold text-white mt-1">Q2 Execution</p>
        </div>
        <div className="p-8 bg-card border border-white/5 rounded-[32px]">
          <Target className="text-rose-500 mb-4" />
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Project Health</p>
          <p className="text-2xl font-bold text-white mt-1 text-emerald-500">Stable</p>
        </div>
      </div>

      {user.role === 'Member' && (
        <div className="p-10 bg-indigo-600/10 border border-indigo-500/20 rounded-[40px]">
          <h3 className="text-xl font-bold text-indigo-400 mb-2">Member Recommendation</h3>
          <p className="text-gray-400">Llama suggests starting your 'Documentation' task today as it's the least complex and will build momentum.</p>
        </div>
      )}
    </div>
  );
}