import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Activity, Users, Target, Loader2, Sparkles, 
  TrendingUp, CheckCircle, Zap, Shield 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#6366f1', '#818cf8', '#22c55e', '#f43f5e'];

export default function AnalyticsView() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = user.role === 'Manager' 
      ? '${API_URL}/analytics/manager-stats' 
      : '${API_URL}/analytics/member-productivity';

    axios.get(endpoint)
      .then(res => setData(res.data))
      .catch(err => console.error("Analytics Fetch Error:", err))
      .finally(() => setLoading(false));
  }, [user.role]);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Aggregating Real-time Metrics...</p>
    </div>
  );

  if (user.role === 'Manager') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Intelligence Hub</h1>
          <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-2">
            <Shield size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Team Audit Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] shadow-2xl">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-10">Task Status Distribution</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.statusDistribution} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                    {data.statusDistribution.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-2">
               {data.statusDistribution.map((s, i) => (
                 <div key={i} className="flex items-center justify-between text-[10px] font-bold uppercase">
                   <span className="text-gray-500 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}} /> {s.name}
                   </span>
                   <span className="text-white">{s.value} Tasks</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] shadow-2xl">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-10">Team Workload Velocity</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={data.workload}>
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{backgroundColor: '#050505', border: 'none'}} />
                  <Bar dataKey="tasks" fill="#6366f1" radius={[12, 12, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-[40px] flex items-center gap-8 shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
          <Sparkles className="text-white w-12 h-12 opacity-50 shrink-0 group-hover:rotate-12 transition-transform" />
          <div className="relative z-10">
            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-1">Llama AI Predictive Insight</h4>
            <p className="text-indigo-50 font-medium leading-relaxed italic">
              "Detecting high concentration of 'Done' tasks on Friday. Velocity is peaking. Suggesting early allocation for next week's sprint to maintain momentum."
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Performance</h1>
          <p className="text-gray-500 mt-2 font-medium">Audit of your contribution to the system.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Efficiency', val: `${data.stats.efficiency}%`, color: 'text-white' },
          { label: 'Finalized', val: data.stats.completed, color: 'text-emerald-500' },
          { label: 'Pending', val: data.stats.pending, color: 'text-indigo-400' },
          { label: 'Work Rank', val: 'PRO', color: 'text-white italic' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0f0f0f] p-8 rounded-[32px] border border-white/5 hover:border-indigo-500/30 transition-all">
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
             <h2 className={`text-4xl font-black ${stat.color}`}>{stat.val}</h2>
          </div>
        ))}
      </div>

      <div className="bg-[#0f0f0f] border border-white/5 p-10 rounded-[48px] shadow-2xl">
        <div className="flex justify-between items-center mb-12">
           <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">7-Day Activity Velocity</h3>
           <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold">
              <TrendingUp size={16} /> +12% increase from last week
           </div>
        </div>
        <div className="flex justify-between items-end gap-6 h-56">
          {data.heatmap.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-6 group">
              <div className="w-full bg-white/5 rounded-[20px] relative overflow-hidden h-full">
                 <motion.div 
                   initial={{ height: 0 }} 
                   animate={{ height: `${(day.count / 5) * 100}%` }}
                   transition={{ delay: i * 0.1, duration: 1 }}
                   className="absolute bottom-0 w-full bg-indigo-600 rounded-t-[18px] shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:bg-indigo-400 transition-colors"
                 />
              </div>
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{day.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}