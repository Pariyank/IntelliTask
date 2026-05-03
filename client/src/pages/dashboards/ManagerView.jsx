import React, { useState, useEffect } from 'react';
import { API_URL } from '../../context/AuthContext';
import axios from 'axios';
import { 
  Trophy, CheckCircle, Clock, AlertCircle, 
  TrendingUp, Star, XCircle, Plus, Loader2 
} from 'lucide-react';

export default function ManagerView() {
  const [projects, setProjects] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [projRes, leaderRes] = await Promise.all([
        axios.get('${API_URL}/projects/manager-owned'),
        axios.get('${API_URL}/analytics/team-performance')
      ]);
      setProjects(projRes.data);
      setLeaderboard(leaderRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApproval = async (id, decision) => {
    try {
      const status = decision === 'approve' ? 'Completed' : 'Active';
      await axios.patch(`${API_URL}/projects/${id}/review`, { status });
      fetchData(); 
    } catch (err) {
      alert("Failed to update project.");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Control Room</h1>
          <p className="text-gray-500 mt-2 font-medium">Performance tracking and project lifecycle.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  
        <div className="lg:col-span-2 bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] shadow-2xl">
          <h3 className="text-xl font-bold flex items-center gap-2 text-white mb-8">
            <Trophy className="text-amber-500" /> Team Leaderboard
          </h3>
          <div className="space-y-4">
            {leaderboard.length === 0 ? (
              <p className="text-gray-600 italic">No completed projects yet.</p>
            ) : (
              leaderboard.map((member, index) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black w-6 text-gray-700">#{index + 1}</span>
                    <img src={member.photo} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                    <div>
                      <p className="font-bold text-white text-sm">{member.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{member.onTime} On-Time</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-indigo-400">{member.score} PTS</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1,2,3].map(i => <Star key={i} size={8} className="fill-amber-500 text-amber-500" />)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-[40px] flex flex-col justify-between shadow-2xl shadow-indigo-600/20">
          <div>
            <TrendingUp size={40} className="text-white mb-6 opacity-50" />
            <h3 className="text-3xl font-black text-white leading-tight">Project<br/>Velocity</h3>
            <p className="text-indigo-100 text-sm mt-4 opacity-80 leading-relaxed">Review submissions to update team scores.</p>
          </div>
          <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

 
      <div className="space-y-6">
        <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] px-2">Submissions Awaiting Approval</h3>
        <div className="grid grid-cols-1 gap-4">
          {projects.filter(p => p.status === 'Under Review').map(p => (
            <div key={p._id} className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center gap-6">
                <Clock className="text-indigo-500" size={28} />
                <div>
                  <h4 className="text-xl font-bold text-white tracking-tight">{p.name}</h4>
                  <p className="text-gray-500 text-sm italic mt-1">Notes: {p.submissionNotes || 'No notes'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleApproval(p._id, 'disapprove')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-rose-500 text-[10px] font-black uppercase hover:bg-rose-500 hover:text-white transition-all">
                  <XCircle size={16} /> Disapprove
                </button>
                <button onClick={() => handleApproval(p._id, 'approve')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all">
                  <CheckCircle size={16} /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}