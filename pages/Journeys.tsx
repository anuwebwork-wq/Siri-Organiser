import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Plus, Navigation, Clock, Calendar } from 'lucide-react';
import { Journey, ActiveJourneyState } from '../types';

interface JourneysProps {
  journeys: Journey[];
  setJourneys: React.Dispatch<React.SetStateAction<Journey[]>>;
  activeJourney: ActiveJourneyState;
  setActiveJourney: (val: ActiveJourneyState) => void;
}

const Journeys: React.FC<JourneysProps> = ({ journeys, setJourneys, activeJourney, setActiveJourney }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJourneys = journeys
    .filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(j => {
       if (filter === 'all') return true;
       return j.status === filter;
    })
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const getStatusColor = (status: string) => {
     switch(status) {
        case 'upcoming': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400';
        case 'in-progress': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400';
        case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400';
        default: return 'text-gray-600 bg-gray-50';
     }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
     e.stopPropagation();
     if(confirm("Delete this journey log?")) {
        setJourneys(prev => prev.filter(j => j.id !== id));
     }
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 relative">
      <div className="p-4 pb-24">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Journeys</h1>

        {/* Search */}
        <div className="relative mb-4">
           <Search size={18} className="absolute left-3 top-3 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search history..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
           />
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6 overflow-x-auto no-scrollbar">
           {['all', 'upcoming', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${filter === f ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}
              >
                {f}
              </button>
           ))}
        </div>

        {/* Pinned Active Journey */}
        {activeJourney.isActive && (
           <div className="mb-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50 rounded-2xl p-4 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-20">
                  <Navigation size={64} className="text-orange-500" />
               </div>
               <div className="relative z-10">
                   <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-orange-200 text-orange-800 mb-2 animate-pulse">LIVE</span>
                   <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Journey in Progress</h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Recording location & distance...</p>
                   
                   <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                         <Clock size={14} className="mr-2 text-orange-500"/>
                         Started at {new Date(activeJourney.startTime!).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                      </div>
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                         <MapPin size={14} className="mr-2 text-orange-500"/>
                         {activeJourney.startLocation}
                      </div>
                   </div>
               </div>
           </div>
        )}

        {/* Journey List */}
        <div className="space-y-4">
           {filteredJourneys.length === 0 && !activeJourney.isActive && (
               <p className="text-center text-gray-400 text-sm py-10">No journeys logged.</p>
           )}

           {filteredJourneys.map(journey => (
             <div key={journey.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 relative">
                <div className="flex justify-between items-start mb-3">
                   <div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusColor(journey.status)}`}>
                         {journey.status}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white mt-2">{journey.title}</h3>
                   </div>
                   <div className="text-right">
                       <span className="block text-lg font-bold text-gray-900 dark:text-white">{journey.distance} <span className="text-xs font-normal text-gray-500">km</span></span>
                       <span className="text-[10px] text-gray-400">
                          {new Date(journey.startTime).toLocaleDateString()}
                       </span>
                   </div>
                </div>
                
                <div className="space-y-3 relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-700"></div>

                    <div className="flex items-start relative z-10">
                        <div className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-500 flex-shrink-0 mr-3"></div>
                        <div>
                           <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                           <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{journey.startLocation}</p>
                           <p className="text-[10px] text-gray-400">{new Date(journey.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>

                    {journey.endLocation && (
                       <div className="flex items-start relative z-10">
                           <div className="w-4 h-4 rounded-full bg-red-100 border-2 border-red-500 flex-shrink-0 mr-3"></div>
                           <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{journey.endLocation}</p>
                              <p className="text-[10px] text-gray-400">{journey.endTime ? new Date(journey.endTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'}</p>
                           </div>
                       </div>
                    )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-700 flex justify-end space-x-3">
                    <button className="text-xs text-blue-600 dark:text-blue-400 font-medium">Edit</button>
                    <button onClick={(e) => handleDelete(journey.id, e)} className="text-xs text-red-600 dark:text-red-400 font-medium">Delete</button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* FAB: Add New Journey (Manual) */}
      <button 
        onClick={() => navigate('/add-journey')}
        className="fixed bottom-20 right-5 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-40"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default Journeys;