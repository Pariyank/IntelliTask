import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Trash2, ShieldCheck, Mail, Loader2, Search } from 'lucide-react';
import { API_URL } from '../../context/AuthContext';

export default function AdminView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('${API_URL}/admin/users');
      setUsers(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (id) => {
    if (window.confirm("Permanently remove this user?")) {
      await axios.delete(`${API_URL}/admin/users/${id}`);
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Authority</h1>
          <p className="text-gray-500 mt-2 font-medium italic">Manage system participants and verify roles.</p>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" placeholder="Search..." 
            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all w-80"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-[48px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="p-8">Identity</th>
              <th className="p-8">Role</th>
              <th className="p-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan="3" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" /></td></tr>
            ) : filteredUsers.map(user => (
              <tr key={user._id} className="hover:bg-white/[0.02] transition-all group">
                <td className="p-8 flex items-center gap-4">
                  <img src={user.photoURL} className="w-12 h-12 rounded-full border border-white/10" alt="" />
                  <div>
                    <p className="text-white font-bold text-lg">{user.displayName}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-1"><Mail size={12}/> {user.email}</p>
                  </div>
                </td>
                <td className="p-8">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    user.role === 'Manager' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-8 text-right">
                  <button onClick={() => deleteUser(user._id)} className="p-4 text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}