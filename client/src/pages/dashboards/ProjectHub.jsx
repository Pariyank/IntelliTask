import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Folder, X, Clock, UserPlus, Loader2 } from 'lucide-react';
import { API_URL } from '../../context/AuthContext';

export default function ProjectHub() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', deadline: '', assignedMember: '' });

  const fetchData = async () => {
    try {
      const endpoint = user.role === 'Manager' ? 'manager-owned' : 'my-allocations';
      const [projRes, memberRes] = await Promise.all([
        axios.get(`${API_URL}/projects/${endpoint}`),
        user.role === 'Manager' ? axios.get('${API_URL}/admin/members-only') : Promise.resolve({ data: [] })
      ]);
      setProjects(projRes.data);
      setMembers(memberRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [user.role]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
     
      await axios.post('${API_URL}/projects', {
        ...form,
        members: [form.assignedMember] 
      });
      setIsModalOpen(false);
      setForm({ name: '', description: '', deadline: '', assignedMember: '' });
      fetchData();
    } catch (err) { alert("Error creating project allocation."); }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Project Hub</h1>
          <p className="text-gray-500 mt-1 font-medium">{user.role === 'Manager' ? 'Assign and oversee' : 'Your allocated work'}</p>
        </div>
        {user.role === 'Manager' && (
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
            <Plus size={18} /> New Allocation
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p._id} className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] hover:border-indigo-500/50 transition-all group">
            <Folder className="text-indigo-500 mb-6" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
            <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed">{p.description}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                p.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-400'
              }`}>
                {p.status}
              </span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <Clock size={12} /> {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'No Limit'}
              </div>
            </div>
          </div>
        ))}
      </div>


      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] w-full max-w-md p-10 rounded-[48px] border border-white/10 shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white italic">NEW ALLOCATION</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <input required placeholder="Project Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-indigo-500" 
                onChange={e => setForm({...form, name: e.target.value})} />
              
              <textarea required placeholder="Description..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none h-24 focus:ring-1 focus:ring-indigo-500"
                onChange={e => setForm({...form, description: e.target.value})} />

              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <select required 
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none appearance-none focus:ring-1 focus:ring-indigo-500"
                  onChange={e => setForm({...form, assignedMember: e.target.value})}
                >
                  <option value="" className="bg-[#0f0f0f]">Allocate to Team Member...</option>
                  {members.map(m => (
                    <option key={m._id} value={m._id} className="bg-[#0f0f0f]">{m.displayName}</option>
                  ))}
                </select>
              </div>

              <input required type="date" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-indigo-500"
                onChange={e => setForm({...form, deadline: e.target.value})} />

              <button className="w-full bg-indigo-600 py-5 rounded-2xl font-black text-white uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                Initialize & Dispatch
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}