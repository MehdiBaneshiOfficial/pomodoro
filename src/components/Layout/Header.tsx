import React from 'react';
import { Timer } from 'lucide-react';
import { useTimer } from '../../context/TimerContext';

const Header: React.FC = () => {
  const { currentMode } = useTimer();

  // Dynamic color based on current mode
  const getModeColor = () => {
    if (currentMode === 'focus') {
      return 'bg-indigo-600';
    } else if (currentMode === 'shortBreak') {
      return 'bg-emerald-600';
    } else {
      return 'bg-sky-600';
    }
  };

  return (
    <header className={`${getModeColor()} text-white shadow-md transition-colors duration-300`}>
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Timer size={28} className="mr-2" />
          <h1 className="text-xl font-bold">FocusFlow</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;