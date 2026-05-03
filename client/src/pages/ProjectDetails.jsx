import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Plus, Layout } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';

export default function ProjectDetails({ project, onBack }) {
  return (
    <div className="min-h-screen bg-dark text-white p-8">

      <div className="flex justify-between items-center mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-2 rounded-xl text-sm border border-white/10 transition-all">
            <Sparkles size={16} className="text-indigo-400" /> AI Insights
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all">
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      <header className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter mb-4">Development Sprint A</h1>
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
          The main execution phase for the Q3 mobile redesign. Focus on high-velocity task completion.
        </p>
      </header>

      <div className="mt-8">
        <KanbanBoard />
      </div>
    </div>
  );
}