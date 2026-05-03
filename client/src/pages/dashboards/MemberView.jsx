import React, { useState, useEffect } from 'react';
import { API_URL } from '../../context/AuthContext';
import axios from 'axios';
import { CheckCircle2, Clock, AlertCircle, Zap, Send, Loader2 } from 'lucide-react';

export default function MemberView() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('${API_URL}/tasks/my-tasks');
      setTasks(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const updateStatus = async (taskId, current) => {
    const next = current === 'To Do' ? 'In Progress' : 'Done';
    await axios.patch(`${API_URL}/tasks/${taskId}/status`, { status: next });
    fetchTasks();
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f0f0f] p-8 rounded-[32px] border border-white/5">
          <Zap className="text-indigo-500 mb-4" />
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Active Load</p>
          <h3 className="text-3xl font-bold text-white mt-1">{tasks.filter(t => t.status !== 'Done').length} Tasks</h3>
        </div>
        <div className="bg-[#0f0f0f] p-8 rounded-[32px] border border-white/5">
          <CheckCircle2 className="text-emerald-500 mb-4" />
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Efficiency</p>
          <h3 className="text-3xl font-bold text-white mt-1">
            {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100) : 0}%
          </h3>
        </div>
        <div className="bg-rose-500/10 p-8 rounded-[32px] border border-rose-500/20">
          <AlertCircle className="text-rose-500 mb-4" />
          <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest">Critical/Overdue</p>
          <h3 className="text-3xl font-bold text-white mt-1">
            {tasks.filter(t => t.status !== 'Done' && new Date(t.deadline) < new Date()).length}
          </h3>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] px-2 italic underline underline-offset-8 decoration-indigo-500/50">My Action Items</h3>
        <div className="space-y-4">
          {tasks.map(t => {
            const isOverdue = new Date(t.deadline) < new Date() && t.status !== 'Done';
            return (
              <div key={t._id} className={`bg-[#0f0f0f] border ${isOverdue ? 'border-rose-500/30' : 'border-white/5'} p-6 rounded-[32px] flex items-center justify-between hover:bg-white/[0.02] transition-all group`}>
                <div className="flex items-center gap-6">
                  <div 
                    onClick={() => updateStatus(t._id, t.status)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                      t.status === 'Done' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-700 hover:border-indigo-500'
                    }`}
                  >
                    {t.status === 'Done' && <CheckCircle2 size={16} className="text-white" />}
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${t.status === 'Done' ? 'text-gray-600 line-through' : 'text-white'}`}>{t.title}</h4>
                    <div className="flex gap-4 mt-1">
                       <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t.priority}</span>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${isOverdue ? 'text-rose-500 animate-pulse' : 'text-gray-600'}`}>
                         {isOverdue ? 'Overdue' : `Due: ${new Date(t.deadline).toLocaleDateString()}`}
                       </span>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Add Comment
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}