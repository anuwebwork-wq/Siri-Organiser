import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Mic, Calendar, Clock, Bell, Repeat, Star } from 'lucide-react';
import { Reminder, Priority, RepeatFrequency } from '../types';

interface AddTaskProps {
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  reminders?: Reminder[];
}

const AddTask: React.FC<AddTaskProps> = ({ setReminders, reminders }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [repeat, setRepeat] = useState<RepeatFrequency>('None');
  const [isImportant, setIsImportant] = useState(false);

  useEffect(() => {
    if (isEditMode && reminders) {
      const task = reminders.find(r => r.id === id);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        const dt = new Date(task.datetime);
        setDate(dt.toISOString().split('T')[0]);
        setTime(dt.toTimeString().slice(0, 5));
        setPriority(task.priority);
        setRepeat(task.repeat);
        setIsImportant(task.isImportant);
      }
    }
  }, [id, reminders]);

  const handleSave = () => {
    if (!title) return;

    const taskData: Reminder = {
      id: isEditMode && id ? id : crypto.randomUUID(),
      title,
      description,
      datetime: `${date}T${time}`,
      completed: false,
      priority,
      repeat,
      isImportant
    };

    if (isEditMode) {
      setReminders(prev => prev.map(r => r.id === id ? taskData : r));
    } else {
      setReminders(prev => [taskData, ...prev]);
    }
    
    // In a real Android app, here we would call AlarmManager
    alert(`Task ${isEditMode ? 'updated' : 'added'}. Notification set for ${date} at ${time}.`);
    navigate(-1);
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">{isEditMode ? 'Edit Task' : 'New Task'}</h1>
        <div className="w-6"></div> {/* Spacer */}
      </div>

      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        
        {/* Title Input */}
        <div>
           <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Task Name</label>
           <div className="relative">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pay Electricity Bill"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 pr-12 text-base focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              />
              <Mic size={20} className="absolute right-4 top-4 text-gray-400 cursor-pointer hover:text-blue-500" />
           </div>
        </div>

        {/* Description */}
        <div>
           <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Description <span className="font-normal normal-case opacity-50">(Optional)</span></label>
           <div className="relative">
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details..."
                rows={3}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:text-white"
              />
              <Mic size={18} className="absolute right-4 bottom-4 text-gray-400 cursor-pointer hover:text-blue-500" />
           </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Date</label>
              <div className="relative">
                 <Calendar size={18} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                 <input 
                   type="date" 
                   value={date}
                   onChange={(e) => setDate(e.target.value)}
                   className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-3 py-3 text-sm outline-none focus:border-blue-500 dark:text-white"
                 />
              </div>
           </div>
           <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Time</label>
              <div className="relative">
                 <Clock size={18} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                 <input 
                   type="time" 
                   value={time}
                   onChange={(e) => setTime(e.target.value)}
                   className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-3 py-3 text-sm outline-none focus:border-blue-500 dark:text-white"
                 />
              </div>
           </div>
        </div>

        {/* Repeat */}
        <div>
           <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Repeat</label>
           <div className="relative">
              <Repeat size={18} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
              <select 
                value={repeat} 
                onChange={(e) => setRepeat(e.target.value as RepeatFrequency)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm appearance-none outline-none focus:border-blue-500 dark:text-white"
              >
                <option value="None">None</option>
                <option value="Daily">Every Day</option>
                <option value="WorkDays">Every Working Day (Mon-Fri)</option>
                <option value="Weekends">Every Weekend (Sat-Sun)</option>
                <option value="Weekly">Every Week</option>
                <option value="Monthly">Every Month</option>
              </select>
           </div>
        </div>

        {/* Priority & Important */}
        <div className="flex items-center justify-between p-1">
           <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Priority</label>
              <div className="flex space-x-2">
                 {['Low', 'Medium', 'High'].map((p) => (
                    <button 
                      key={p}
                      onClick={() => setPriority(p as Priority)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${priority === p ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
                    >
                      {p}
                    </button>
                 ))}
              </div>
           </div>

           <div className="flex flex-col items-end">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Mark Important</label>
              <button 
                 onClick={() => setIsImportant(!isImportant)}
                 className={`p-2 rounded-full border transition-colors ${isImportant ? 'bg-yellow-50 border-yellow-200 text-yellow-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-300'}`}
              >
                 <Star size={24} fill={isImportant ? "currentColor" : "none"} />
              </button>
           </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex space-x-4">
         <button onClick={() => navigate(-1)} className="flex-1 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Cancel
         </button>
         <button onClick={handleSave} className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none transition-colors">
            Save Task
         </button>
      </div>
    </div>
  );
};

export default AddTask;