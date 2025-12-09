import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Calendar, Clock, Circle, CheckCircle, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';
import { Reminder } from '../types';

interface TasksProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
}

const Tasks: React.FC<TasksProps> = ({ reminders, setReminders }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [activeSwipeId, setActiveSwipeId] = useState<string | null>(null);

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    setActiveSwipeId(null);
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this task?")) {
        setReminders(prev => prev.filter(r => r.id !== id));
    }
    setActiveSwipeId(null);
  };

  const editTask = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/edit-task/${id}`);
  };

  const filteredReminders = reminders
    .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(r => showCompleted ? true : !r.completed)
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()); // Sort by date ascending

  const getPriorityDot = (p: string) => {
     switch(p) {
        case 'High': return 'bg-red-500';
        case 'Medium': return 'bg-yellow-500';
        default: return 'bg-blue-500';
     }
  };

  const isToday = (dateStr: string) => {
      const d = new Date(dateStr);
      const today = new Date();
      return d.getDate() === today.getDate() && 
             d.getMonth() === today.getMonth() && 
             d.getFullYear() === today.getFullYear();
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 relative">
      <div className="p-4 pb-24">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tasks</h1>

        {/* Search & Filter */}
        <div className="flex space-x-2 mb-6">
           <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              />
           </div>
           <button 
             onClick={() => setShowCompleted(!showCompleted)}
             className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
           >
              {showCompleted ? <EyeOff size={18} /> : <Eye size={18} />}
           </button>
        </div>

        <div className="flex justify-between items-center mb-2 px-1">
           <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
               {searchTerm ? 'Search Results' : 'Upcoming Tasks'}
           </h2>
        </div>

        <div className="space-y-3">
           {filteredReminders.length === 0 && (
               <div className="text-center py-10">
                   <p className="text-gray-400 text-sm">No tasks found.</p>
               </div>
           )}

           {filteredReminders.map(task => (
             <div 
               key={task.id} 
               className="relative overflow-hidden group"
               onMouseLeave={() => setActiveSwipeId(null)}
             >
                {/* Background Actions (simulating swipe) */}
                <div className="absolute inset-0 flex justify-between items-center px-4 rounded-xl bg-gray-100 dark:bg-gray-800">
                   <div className="text-green-600 font-semibold text-xs uppercase flex items-center">
                       <CheckCircle size={16} className="mr-1"/> Complete
                   </div>
                   <div className="flex space-x-2">
                       <div className="text-blue-600 font-semibold text-xs uppercase flex items-center">
                           <Edit2 size={16} className="mr-1"/>
                       </div>
                       <div className="text-red-600 font-semibold text-xs uppercase flex items-center">
                           <Trash2 size={16} className="mr-1"/>
                       </div>
                   </div>
                </div>

                {/* Main Card */}
                <div 
                  onClick={() => navigate(`/edit-task/${task.id}`)}
                  className={`relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-3 transition-transform ${activeSwipeId === task.id ? '-translate-x-12' : 'translate-x-0'}`}
                >
                   {/* Complete Toggle */}
                   <button 
                     onClick={(e) => toggleComplete(task.id, e)} 
                     className={`flex-shrink-0 ${task.completed ? 'text-green-500' : 'text-gray-300 dark:text-gray-600 hover:text-blue-500'}`}
                   >
                     {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                   </button>

                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                         <h3 className={`font-semibold text-sm truncate ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                            {task.title}
                         </h3>
                         {task.isImportant && <span className="text-xs ml-2">⭐</span>}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                         {/* Date Badge */}
                         <span className={`text-[10px] px-2 py-0.5 rounded-md flex items-center ${isToday(task.datetime) ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                            <Calendar size={10} className="mr-1"/> 
                            {new Date(task.datetime).toLocaleDateString('en-IN')}
                         </span>
                         
                         {/* Time Badge */}
                         <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-0.5 rounded-md flex items-center">
                            <Clock size={10} className="mr-1"/> 
                            {new Date(task.datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </span>

                         {/* Priority Dot */}
                         <span className={`w-2 h-2 rounded-full mt-1 ${getPriorityDot(task.priority)}`}></span>
                      </div>
                   </div>

                   {/* Desktop/Tablet Hover Actions (Since swipe is tricky on web) */}
                   <div className="flex flex-col space-y-2 pl-2 border-l border-gray-100 dark:border-gray-700">
                      <button onClick={(e) => editTask(task.id, e)} className="text-gray-400 hover:text-blue-500">
                          <Edit2 size={16} />
                      </button>
                      <button onClick={(e) => deleteTask(task.id, e)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={16} />
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* FAB */}
      <button 
        onClick={() => navigate('/add-task')}
        className="fixed bottom-20 right-5 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-40"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default Tasks;