import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target } from 'lucide-react';

const FocusMode = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-10"
      >
        <button 
          onClick={onClose} 
          className="absolute top-10 right-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={32} className="text-gray-400 hover:text-gray-900" />
        </button>

        <div className="max-w-2xl w-full text-center">
          <div className="flex justify-center mb-6 text-indigo-600">
            <div className="p-5 bg-indigo-50 rounded-full animate-pulse">
              <Target size={64} />
            </div>
          </div>
          
          <h2 className="text-sm uppercase tracking-[0.2em] text-indigo-500 font-bold mb-4">
            Current Focus Mode
          </h2>
          
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            {task.title}
          </h1>
          
          <p className="text-xl text-gray-500 mb-12 leading-relaxed">
            {task.description || "No description provided for this task."}
          </p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={onClose}
              className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all"
            >
              Back to Board
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FocusMode; 