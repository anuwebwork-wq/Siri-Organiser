import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mic, MapPin, Clock, Calendar, Bell } from 'lucide-react';
import { Journey } from '../types';

interface AddJourneyProps {
  setJourneys: React.Dispatch<React.SetStateAction<Journey[]>>;
}

const AddJourney: React.FC<AddJourneyProps> = ({ setJourneys }) => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [startLoc, setStartLoc] = useState('');
  const [endLoc, setEndLoc] = useState('');
  const [reminder, setReminder] = useState('1 Hour Before');

  const handleSave = () => {
    if (!title || !startLoc) return;

    const journey: Journey = {
      id: crypto.randomUUID(),
      title,
      startTime: `${startDate}T${startTime}`,
      startLocation: startLoc,
      endLocation: endLoc || 'TBD',
      distance: 0, // Manual upcoming journey usually doesn't have distance yet
      status: 'upcoming',
      isAuto: false
    };

    setJourneys(prev => [journey, ...prev]);
    alert(`Journey scheduled. Reminder set for ${reminder}.`);
    navigate('/journeys');
  };

  const useCurrentLocation = () => {
     if("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
           setStartLoc(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`);
        });
     }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">Add New Journey</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-5 overflow-y-auto space-y-6">
         {/* Title */}
        <div>
           <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Journey Title</label>
           <div className="relative">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Visit to Tirupati"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 pr-12 text-base focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
              <Mic size={20} className="absolute right-4 top-4 text-gray-400 cursor-pointer hover:text-indigo-500" />
           </div>
        </div>

        {/* Date Time */}
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Start Date</label>
              <div className="relative">
                 <input 
                   type="date" 
                   value={startDate}
                   onChange={(e) => setStartDate(e.target.value)}
                   className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 text-sm outline-none focus:border-indigo-500 dark:text-white"
                 />
              </div>
           </div>
           <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Start Time</label>
              <div className="relative">
                 <input 
                   type="time" 
                   value={startTime}
                   onChange={(e) => setStartTime(e.target.value)}
                   className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 text-sm outline-none focus:border-indigo-500 dark:text-white"
                 />
              </div>
           </div>
        </div>

        {/* Locations */}
        <div>
           <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Start Location</label>
           <div className="relative flex space-x-2">
              <div className="relative flex-1">
                 <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
                 <input 
                   type="text" 
                   value={startLoc}
                   onChange={(e) => setStartLoc(e.target.value)}
                   placeholder="Origin"
                   className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-3 py-3 text-sm outline-none focus:border-indigo-500 dark:text-white"
                 />
              </div>
              <button onClick={useCurrentLocation} className="bg-indigo-50 text-indigo-600 px-3 rounded-xl text-xs font-medium">
                 Use Current
              </button>
           </div>
        </div>

        <div>
           <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Destination</label>
           <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input 
                type="text" 
                value={endLoc}
                onChange={(e) => setEndLoc(e.target.value)}
                placeholder="Where are you going?"
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-3 py-3 text-sm outline-none focus:border-indigo-500 dark:text-white"
              />
           </div>
        </div>

        {/* Reminder */}
        <div>
           <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Set Reminder</label>
           <div className="relative">
              <Bell size={18} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
              <select 
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm appearance-none outline-none focus:border-indigo-500 dark:text-white"
              >
                <option>10 minutes before</option>
                <option>30 minutes before</option>
                <option>1 Hour Before</option>
                <option>1 Day Before</option>
              </select>
           </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
         <button onClick={handleSave} className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-colors">
            Save Journey
         </button>
      </div>
    </div>
  );
};

export default AddJourney;