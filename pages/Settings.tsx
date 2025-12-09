import React from 'react';
import { User, Bell, Volume2, Clock, Info, ChevronRight, HelpCircle, Moon, Globe, Database, RotateCcw } from 'lucide-react';
import { Settings as SettingsType } from '../types';

interface SettingsProps {
  settings: SettingsType;
  setSettings: (val: SettingsType | ((prev: SettingsType) => SettingsType)) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {

  const updateSetting = (key: keyof SettingsType, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 pb-20">
      <div className="bg-white dark:bg-gray-800 p-4 text-center border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile */}
        <div className="flex flex-col items-center py-4">
           <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 mb-3 shadow-inner">
              <User size={40} />
           </div>
           <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Profile</h2>
           <p className="text-sm text-gray-500 dark:text-gray-400">Siri Organiser User</p>
        </div>

        {/* Section: Notifications */}
        <div>
           <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-2">Notifications</h3>
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                 <div className="flex items-center space-x-3">
                    <div className="bg-red-500 p-1.5 rounded-md text-white">
                        <Bell size={18} />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">Push Notifications</span>
                 </div>
                 <div className="relative inline-block w-12 h-6">
                    <input 
                      type="checkbox" 
                      id="toggle" 
                      className="peer sr-only"
                      checked={settings.pushNotifications}
                      onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                    />
                    <label htmlFor="toggle" className="block h-full bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer peer-checked:bg-green-500 transition-colors"></label>
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></span>
                 </div>
              </div>

              <div className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-700">
                 <div className="flex items-center space-x-3">
                    <div className="bg-orange-500 p-1.5 rounded-md text-white">
                        <Volume2 size={18} />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">Notification Sound</span>
                 </div>
                 <div className="flex items-center text-gray-400">
                    <span className="text-sm mr-2">{settings.notificationSound}</span>
                    <ChevronRight size={18} />
                 </div>
              </div>
           </div>
        </div>

        {/* Section: Preferences */}
        <div>
           <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-2">Preferences</h3>
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                 <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 p-1.5 rounded-md text-white">
                        <Clock size={18} />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">Default Time</span>
                 </div>
                 <span className="text-sm text-gray-400">{settings.reminderTime} min before</span>
              </div>

              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                 <div className="flex items-center space-x-3">
                    <div className="bg-indigo-500 p-1.5 rounded-md text-white">
                        <Globe size={18} />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">Voice Language</span>
                 </div>
                 <span className="text-sm text-gray-400">English (US)</span>
              </div>

              <div className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-700" onClick={() => {
                  const modes: ('light'|'dark'|'system')[] = ['light', 'dark', 'system'];
                  const next = modes[(modes.indexOf(settings.theme) + 1) % modes.length];
                  updateSetting('theme', next);
              }}>
                 <div className="flex items-center space-x-3">
                    <div className="bg-gray-800 dark:bg-gray-600 p-1.5 rounded-md text-white">
                        <Moon size={18} />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">Theme</span>
                 </div>
                 <span className="text-sm text-gray-400 capitalize">{settings.theme}</span>
              </div>
           </div>
        </div>

        {/* Section: Advanced */}
        <div>
           <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-2">Advanced</h3>
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer active:bg-gray-50 dark:active:bg-gray-700">
                 <div className="flex items-center space-x-3">
                    <div className="bg-green-600 p-1.5 rounded-md text-white">
                        <Database size={18} />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">Backup to Drive</span>
                 </div>
                 <ChevronRight size={18} className="text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-700" onClick={() => confirm('Reset app data?') && localStorage.clear()}>
                 <div className="flex items-center space-x-3">
                    <div className="bg-red-600 p-1.5 rounded-md text-white">
                        <RotateCcw size={18} />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">Reset App Data</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Section: About */}
        <div>
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                 <div className="flex items-center space-x-3">
                    <div className="bg-gray-500 p-1.5 rounded-md text-white">
                        <Info size={18} />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">Version</span>
                 </div>
                 <span className="text-gray-400 text-sm">1.0.0</span>
              </div>
              
              <div className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-700">
                 <div className="flex items-center space-x-3">
                    <div className="bg-purple-500 p-1.5 rounded-md text-white">
                        <HelpCircle size={18} />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">Help & Support</span>
                 </div>
                 <ChevronRight size={18} className="text-gray-400" />
              </div>
           </div>
        </div>

        <div className="text-center text-gray-400 text-xs pt-6 pb-4">
           Siri Organiser &copy; 2024
        </div>
      </div>
    </div>
  );
};

export default Settings;