import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, AlertCircle, Loader2, ChevronRight, ShieldCheck } from 'lucide-react';

export default function Login({ onBack }) {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem('selectedRole') || 'Member';
  const isAdmin = role === 'Admin';

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        if (isAdmin) throw new Error("Registration disabled for Administrators.");
        await signupWithEmail(email, password, name);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent opacity-50" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full relative z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-all text-[10px] font-black uppercase tracking-[0.3em]">
          <ArrowLeft size={14} /> Back to Roles
        </button>

        <div className="bg-[#0f0f0f] border border-white/5 p-10 rounded-[48px] shadow-2xl">
          <div className="mb-10">
            {isAdmin ? (
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="text-white" />
              </div>
            ) : null}
            <h2 className="text-4xl font-black text-white tracking-tighter mb-2">
              {isAdmin ? 'Secure Admin' : (isLogin ? 'Welcome Back' : 'Join IntelliTask')}
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              Accessing as <span className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] ml-1 px-2 py-1 bg-white/5 rounded-md">{role}</span>
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-xs font-bold leading-tight">
              <AlertCircle size={18} className="shrink-0" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && !isAdmin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input required type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-gray-700" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input required type="email" placeholder="System ID / Email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-gray-700 font-medium" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-gray-700" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all flex items-center justify-center shadow-lg active:scale-95">
              {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? 'Verify Credentials' : 'Register Member')}
            </button>
          </form>

       
          {!isAdmin && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]"><span className="px-4 bg-[#0f0f0f]">OR</span></div>
              </div>

              <button onClick={loginWithGoogle} className="w-full flex items-center justify-between bg-white text-black py-4 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all active:scale-95 group">
                <span className="flex items-center gap-3">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="" />
                  Continue with Google
                </span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="mt-8 text-center text-xs font-bold text-gray-600 uppercase tracking-widest">
                {isLogin ? "No account?" : "Have an account?"}
                <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 ml-2 hover:underline">
                  {isLogin ? "Join Team" : "Login Now"}
                </button>
              </p>
            </>
          )}
          
          {isAdmin && (
            <p className="mt-8 text-center text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] leading-relaxed">
              Manual ID/Password Authentication Only <br/>
              <span className="text-rose-500/50">Restricted System Access</span>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}