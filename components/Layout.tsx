import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipboardList, Home, Car } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {children}
      </main>

      <nav className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-16 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => navigate('/tasks')}
          className={`flex flex-col items-center justify-center w-full h-full ${isActive('/tasks') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <ClipboardList size={24} strokeWidth={isActive('/tasks') ? 2.5 : 2} />
          <span className="text-[10px] mt-1 font-medium">Tasks</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center w-full h-full ${isActive('/') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </button>

        <button
          onClick={() => navigate('/journeys')}
          className={`flex flex-col items-center justify-center w-full h-full ${isActive('/journeys') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <Car size={24} strokeWidth={isActive('/journeys') ? 2.5 : 2} />
          <span className="text-[10px] mt-1 font-medium">Journeys</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;