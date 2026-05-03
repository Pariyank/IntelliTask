import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MoreVertical, User, MessageSquare, Zap } from 'lucide-react';

const TaskCard = ({ task, onMove, onFocus }) => {
  const priorityColors = { 
    High: 'bg-red-100 text-red-600', 
    Medium: 'bg-amber-100 text-amber-600', 
    Low: 'bg-emerald-100 text-emerald-600' 
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 group hover:border-indigo-400 transition-all cursor-pointer relative"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${priorityColors[task.priority] || 'bg-gray-100'}`}>
          {task.priority}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onFocus(task); }}
          className="text-indigo-500 hover:text-indigo-700 p-1 bg-indigo-50 rounded"
          title="Enter Focus Mode"
        >
          <Zap size={14} fill="currentColor" />
        </button>
      </div>
      
      <h4 className="font-semibold text-gray-800 mb-1">{task.title}</h4>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{task.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {task.assignedTo ? (
            <img 
              src={task.assignedTo.photoURL || 'https://via.placeholder.com/150'} 
              className="w-7 h-7 rounded-full border-2 border-white" 
              alt={task.assignedTo.displayName}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
              <User size={12} className="text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {task.status !== 'Done' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onMove(task._id, task.status === 'To Do' ? 'In Progress' : 'Done'); }}
              className="text-[10px] bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors"
            >
              Move Next
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const KanbanBoard = ({ projectId, onFocusTask }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = ['To Do', 'In Progress', 'Done'];

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/tasks/project/${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const moveTask = async (taskId, newStatus) => {
    try {
     
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      
  
      await axios.patch(`http://localhost:5000/api/tasks/${taskId}/status`, { status: newStatus });
    } catch (err) {
      console.error("Failed to move task:", err);
      fetchTasks(); // Revert on error
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading board...</div>;

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
      {columns.map(col => (
        <div key={col} className="bg-gray-100/50 p-4 rounded-2xl w-80 min-h-[70vh] border border-gray-200">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              {col}
              <span className="bg-white text-gray-400 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-gray-200">
                {tasks.filter(t => t.status === col).length}
              </span>
            </h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
          </div>
          
          <div className="space-y-4">
            {tasks
              .filter(t => t.status === col)
              .map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onMove={moveTask} 
                  onFocus={onFocusTask} 
                />
              ))
            }
            {tasks.filter(t => t.status === col).length === 0 && (
              <div className="border-2 border-dashed border-gray-200 rounded-lg h-24 flex items-center justify-center text-gray-400 text-sm">
                No tasks here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard; 