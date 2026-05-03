import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, ArrowRight, ShieldCheck } from 'lucide-react';

const publicRoles = [
  { 
    id: 'Manager', 
    title: 'Project Manager', 
    icon: Briefcase, 
    desc: 'Organize projects, assign tasks, and monitor team velocity.',
    color: 'text-indigo-500' 
  },
  { 
    id: 'Member', 
    title: 'Team Member', 
    icon: Users, 
    desc: 'Execute assigned tasks, update progress, and collaborate.',
    color: 'text-emerald-500' 
  }
];

export default function RoleSelection({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (selected) onSelect(selected);
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
  
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[150px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full relative z-10"
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
            CHOOSE YOUR <span className="text-indigo-500 italic">PATH</span>
          </h1>
          <p className="text-gray-400 font-medium text-lg">Select a workspace identity to begin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {publicRoles.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(role.id)}
              className={`cursor-pointer p-10 rounded-[40px] border-2 transition-all duration-300 ${
                selected === role.id 
                ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_50px_rgba(79,70,229,0.2)]' 
                : 'border-white/5 bg-white/5 hover:border-white/10'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-white/5 ${role.color}`}>
                <role.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{role.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{role.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <motion.button
            disabled={!selected}
            onClick={handleContinue}
            className={`w-full max-w-sm flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all ${
              selected 
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-700' 
              : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
            }`}
          >
            Continue to Authentication <ArrowRight size={18} />
          </motion.button>

          {/* Secure Admin Portal Link */}
          <button 
            onClick={() => onSelect('Admin')}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] transition-colors"
          >
            <ShieldCheck size={14} /> Secure Admin Portal
          </button>
        </div>
      </motion.div>
    </div>
  );
}