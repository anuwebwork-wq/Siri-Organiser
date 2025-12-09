import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Journeys from './pages/Journeys';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import AddTask from './pages/AddTask';
import AddJourney from './pages/AddJourney';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Reminder, Journey, Note, ActiveJourneyState, Settings as SettingsType, DEFAULT_SETTINGS } from './types';

const App: React.FC = () => {
  // Global state management
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('app_reminders', []);
  const [journeys, setJourneys] = useLocalStorage<Journey[]>('app_journeys', []);
  const [notes, setNotes] = useLocalStorage<Note[]>('app_notes', []);
  const [settings, setSettings] = useLocalStorage<SettingsType>('app_settings', DEFAULT_SETTINGS);
  
  // Active Journey State (persisted so it survives refresh)
  const [activeJourney, setActiveJourney] = useLocalStorage<ActiveJourneyState>('app_active_journey', {
    isActive: false,
    startTime: null,
    startLocation: null,
    startCoords: null,
    currentDistance: 0
  });

  // Apply Theme
  useEffect(() => {
    const root = document.documentElement;
    const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={
            <Home 
              reminders={reminders} 
              activeJourney={activeJourney}
              setActiveJourney={setActiveJourney}
              addJourneyLog={(j) => setJourneys(prev => [j, ...prev])}
            />
          } />
          <Route path="/tasks" element={<Tasks reminders={reminders} setReminders={setReminders} />} />
          <Route path="/add-task" element={<AddTask setReminders={setReminders} />} />
          <Route path="/edit-task/:id" element={<AddTask setReminders={setReminders} reminders={reminders} />} />
          
          <Route path="/journeys" element={
            <Journeys 
              journeys={journeys} 
              setJourneys={setJourneys} 
              activeJourney={activeJourney}
              setActiveJourney={setActiveJourney}
            />
          } />
          <Route path="/add-journey" element={<AddJourney setJourneys={setJourneys} />} />
          
          <Route path="/notes" element={<Notes notes={notes} setNotes={setNotes} />} />
          <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;