import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Plus, MapPin, Navigation, Clock, Calendar } from 'lucide-react';
import { Reminder, Journey, ActiveJourneyState } from '../types';

interface HomeProps {
  reminders: Reminder[];
  activeJourney: ActiveJourneyState;
  setActiveJourney: (val: ActiveJourneyState) => void;
  addJourneyLog: (j: Journey) => void;
}

const Home: React.FC<HomeProps> = ({ reminders, activeJourney, setActiveJourney, addJourneyLog }) => {
  const navigate = useNavigate();
  const [showEndJourneyModal, setShowEndJourneyModal] = useState(false);
  const [journeyTitle, setJourneyTitle] = useState('');

  // Filter pending tasks (incomplete), sorted by date ascending (overdue first)
  const pendingTasks = reminders
    .filter(r => !r.completed)
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
    .slice(0, 5);

  const startJourney = () => {
    if (activeJourney.isActive) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const mockLocation = `Loc: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        
        setActiveJourney({
          isActive: true,
          startTime: new Date().toISOString(),
          startLocation: mockLocation,
          startCoords: { lat: latitude, lng: longitude },
          currentDistance: 0
        });
      }, (error) => {
        alert("Unable to retrieve location. Starting journey with unknown location.");
        setActiveJourney({
          isActive: true,
          startTime: new Date().toISOString(),
          startLocation: "Unknown Location",
          startCoords: null,
          currentDistance: 0
        });
      });
    } else {
       alert("Geolocation not supported.");
    }
  };

  const confirmEndJourney = () => {
    if (!activeJourney.isActive) {
      alert("No journey in progress");
      return;
    }
    setShowEndJourneyModal(true);
  };

  const endJourney = () => {
    if (!activeJourney.isActive) return;

    // Capture end location
    let endLoc = "Unknown Location";
    if ("geolocation" in navigator) {
       navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          endLoc = `Loc: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          finalizeJourney(endLoc);
       }, () => finalizeJourney(endLoc));
    } else {
      finalizeJourney(endLoc);
    }
  };

  const finalizeJourney = (endLocation: string) => {
    const newJourney: Journey = {
      id: crypto.randomUUID(),
      title: journeyTitle || "Untitled Trip",
      startTime: activeJourney.startTime!,
      endTime: new Date().toISOString(),
      startLocation: activeJourney.startLocation!,
      endLocation: endLocation,
      distance: parseFloat((Math.random() * 10 + 2).toFixed(2)), // Mock distance
      status: 'completed',
      isAuto: true
    };

    addJourneyLog(newJourney);
    setActiveJourney({
      isActive: false,
      startTime: null,
      startLocation: null,
      startCoords: null,
      currentDistance: 0
    });
    setJourneyTitle('');
    setShowEndJourneyModal(false);
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="flex justify-between items-center px-5 py-4 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 flex-shrink-0">
        <div className="flex items-center space-x-3">
          {/* Logo Recreation */}
          <div className="relative w-10 h-10 flex-shrink-0">
             <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
               <defs>
                 <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" style={{stopColor:'#004aad', stopOpacity:1}} />
                   <stop offset="100%" style={{stopColor:'#009d57', stopOpacity:1}} />
                 </linearGradient>
                 <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
                   <stop offset="0%" style={{stopColor:'#d4af37', stopOpacity:1}} />
                   <stop offset="100%" style={{stopColor:'#009d57', stopOpacity:1}} />
                 </linearGradient>
               </defs>
               <path d="M70 20 C 30 20, 30 50, 50 50 C 70 50, 70 80, 30 80" stroke="url(#grad1)" strokeWidth="18" fill="none" strokeLinecap="round" />
               <path d="M70 20 C 30 20, 30 50, 50 50" stroke="url(#grad2)" strokeWidth="18" fill="none" strokeLinecap="round" opacity="0.5"/>
               <circle cx="70" cy="20" r="5" fill="white" />
               <circle cx="30" cy="80" r="5" fill="white" />
               <circle cx="50" cy="50" r="5" fill="white" />
             </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-[#0B1E48] dark:text-white leading-none tracking-tight">
              Siri Organiser
            </h1>
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 tracking-[0.2em] uppercase mt-0.5">
              Productivity. Unified.
            </span>
          </div>
        </div>
        <button onClick={() => navigate('/settings')} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <Settings size={22} />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Top: Pending Tasks */}
        <div className="mb-4">
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending Tasks</h2>
            <button onClick={() => navigate('/tasks')} className="text-xs font-semibold text-blue-600 dark:text-blue-400">View All</button>
          </div>

          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
               <div className="py-4 text-center">
                  <p className="text-sm text-gray-400 dark:text-gray-500">No pending tasks.</p>
               </div>
            ) : (
              pendingTasks.map(task => (
                <div key={task.id} onClick={() => navigate(`/edit-task/${task.id}`)} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-3 active:scale-[0.99] transition-transform">
                   <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}></div>
                   <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{task.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                         <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-md flex items-center">
                            <Calendar size={10} className="mr-1"/> 
                            {new Date(task.datetime).toLocaleDateString('en-IN', {day: '2-digit', month: '2-digit'})}
                         </span>
                         <span className="text-gray-400 text-[10px] flex items-center">
                            <Clock size={10} className="mr-1"/>
                            {new Date(task.datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </span>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Spacer to push Journey/Motivation to bottom */}
        <div className="flex-1"></div>

        {/* Bottom Section: Motivation & Journey */}
        <div className="mt-6 space-y-4">
            
            {/* Motivation Quote (Only if no pending tasks) */}
            {pendingTasks.length === 0 && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center mx-2">
                 <p className="text-gray-500 dark:text-gray-400 italic text-sm">"The secret of getting ahead is getting started."</p>
                 <p className="text-xs text-gray-300 dark:text-gray-600 mt-2 font-medium">- Mark Twain</p>
              </div>
            )}

            {/* Journey in Progress Card */}
            {activeJourney.isActive && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50 rounded-2xl p-4 shadow-sm animate-pulse-slow">
                 <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                       <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Journey in Progress</span>
                    </div>
                    <span className="text-xs font-mono text-orange-800 dark:text-orange-300">
                       {new Date(activeJourney.startTime!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                 </div>
                 <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Current Trip</h3>
                 <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={14} className="mr-1 text-orange-500"/>
                    {activeJourney.startLocation}
                 </div>
              </div>
            )}

            {/* Journey Controls */}
            <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={startJourney}
                 disabled={activeJourney.isActive}
                 className={`h-16 rounded-2xl flex items-center justify-center font-semibold shadow-sm transition-all ${activeJourney.isActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'}`}
               >
                 <div className="flex flex-col items-center">
                   <Navigation size={20} className="mb-1" />
                   Start Journey
                 </div>
               </button>

               <button 
                 onClick={confirmEndJourney}
                 className="h-16 rounded-2xl flex items-center justify-center font-semibold shadow-sm transition-all bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
               >
                 <div className="flex flex-col items-center">
                   <MapPin size={20} className="mb-1" />
                   End Journey
                 </div>
               </button>
            </div>
        </div>
      </div>

      {/* FAB */}
      <button 
        onClick={() => navigate('/add-task')}
        className="fixed bottom-24 right-5 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-40"
        aria-label="Add Task"
      >
        <Plus size={28} />
      </button>

      {/* End Journey Modal */}
      {showEndJourneyModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-scale-up">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">End this journey?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Confirm to stop tracking and save this trip.</p>
              
              <div className="mb-4">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title for Journey</label>
                 <input 
                   type="text" 
                   value={journeyTitle}
                   onChange={(e) => setJourneyTitle(e.target.value)}
                   placeholder="e.g. Office Trip"
                   className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                   autoFocus
                 />
              </div>

              <div className="flex space-x-3">
                 <button onClick={() => setShowEndJourneyModal(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">No, Resume</button>
                 <button onClick={endJourney} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700">Yes, Save</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Home;