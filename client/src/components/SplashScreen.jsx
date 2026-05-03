import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div 
      key="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="relative"
      >
      
        <div className="absolute inset-0 bg-indigo-600 blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="relative w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.4)]">
          <Zap size={48} className="text-white fill-current" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <h1 className="mt-8 text-3xl font-bold tracking-tighter text-white">
          IntelliTask <span className="text-indigo-500"></span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm tracking-[0.3em] uppercase font-medium">
          Manage Smarter. Work Faster.
        </p>
      </motion.div>
      <div className="absolute bottom-20 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="w-full h-full bg-indigo-500"
        />
      </div>
    </motion.div>
  );
}