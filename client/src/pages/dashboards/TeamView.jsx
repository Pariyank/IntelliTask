import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Users, Trash2, Mail, CheckCircle, ShieldAlert, UserCheck } from 'lucide-react';

export default function TeamView() {
  const { user: currentUser } = useAuth(); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
    
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);


  const displayedUsers = users.filter(u => {
    if (currentUser.role === 'Admin') return true; 
    if (currentUser.role === 'Manager') return u.role === 'Member'; 
    return false; 
  });

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.post('http://localhost:5000/api/admin/update-role', { userId, newRole });
      fetchUsers();
    } catch (err) {
      alert("Unauthorized: Only Admins can modify permissions.");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("CRITICAL: Permanent removal of this user?")) {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
            {currentUser.role === 'Manager' ? 'My Team' : 'Identity Registry'}
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            {currentUser.role === 'Manager' 
              ? "Directory of team members available for project allocation." 
              : "Global governance and credential management."}
          </p>
        </div>
        
        {currentUser.role === 'Manager' && (
          <div className="bg-indigo-600/10 border border-indigo-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
            <UserCheck size={16} className="text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              Team View Mode
            </span>
          </div>
        )}
      </header>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <th className="p-6">Identity</th>
              <th className="p-6">System Role</th>
              <th className="p-6">Performance Status</th>
              {currentUser.role === 'Admin' && <th className="p-6 text-right">Operations</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayedUsers.length === 0 && !loading && (
              <tr>
                <td colSpan="4" className="p-20 text-center text-gray-600 italic">
                  No eligible team members found in the directory.
                </td>
              </tr>
            )}
            
            {displayedUsers.map((u) => (
              <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img src={u.photoURL} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                    <div>
                      <p className="font-bold text-white text-sm">{u.displayName}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail size={12}/> {u.email}
                      </p>
                    </div>
                  </div>
                </td>
                
                <td className="p-6">
                  {currentUser.role === 'Admin' ? (
                    <select 
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="bg-[#050505] border border-white/10 text-indigo-400 text-[10px] font-black uppercase px-3 py-1 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Member">Member</option>
                    </select>
                  ) : (
                    <span className="text-indigo-400 text-[10px] font-black uppercase bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                      {u.role}
                    </span>
                  )}
                </td>

                <td className="p-6">
                  <span className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                    <CheckCircle size={14} /> Available
                  </span>
                </td>

                {currentUser.role === 'Admin' && (
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => deleteUser(u._id)}
                      className="p-3 text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {loading && (
          <div className="p-10 flex flex-col items-center gap-4">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Accessing Registry...</p>
          </div>
        )}
      </div>
    </div>
  );
}