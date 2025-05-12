import React from 'react';
import { Play, Pause, SkipForward, RefreshCw, Settings, Keyboard } from 'lucide-react';
import { useTimer } from '../../context/TimerContext';
import { useNotification } from '../../context/NotificationContext';

interface TimerControlsProps {
  onSettingsClick: () => void;
  onKeyboardShortcutsClick: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({ 
  onSettingsClick,
  onKeyboardShortcutsClick
}) => {
  const { 
    isRunning, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    skipToNext 
  } = useTimer();
  
  const { notificationsEnabled, toggleNotifications } = useNotification();

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      {/* Primary controls */}
      <div className="flex items-center justify-center space-x-8">
        {/* Reset button */}
        <button 
          onClick={resetTimer}
          className="
            p-3 rounded-full bg-gray-200 hover:bg-gray-300 
            text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200
            transition-all duration-200 transform active:scale-95
            flex items-center justify-center
          "
          aria-label="Reset Timer"
        >
          <RefreshCw size={24} />
        </button>
        
        {/* Play/Pause button */}
        <button 
          onClick={isRunning ? pauseTimer : startTimer}
          className="
            p-5 rounded-full 
            bg-indigo-600 hover:bg-indigo-700 
            text-white
            transition-all duration-200 transform active:scale-95
            shadow-md
            flex items-center justify-center
            w-16 h-16
          "
          aria-label={isRunning ? "Pause Timer" : "Start Timer"}
        >
          {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        
        {/* Skip button */}
        <button 
          onClick={skipToNext}
          className="
            p-3 rounded-full bg-gray-200 hover:bg-gray-300 
            text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200
            transition-all duration-200 transform active:scale-95
            flex items-center justify-center
          "
          aria-label="Skip to Next Session"
        >
          <SkipForward size={24} />
        </button>
      </div>
      
      {/* Secondary controls */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onSettingsClick}
          className="
            flex items-center px-3 py-2 rounded-md 
            bg-gray-100 hover:bg-gray-200
            text-gray-700
            dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300
            transition-all duration-200
            text-sm font-medium
          "
          aria-label="Timer Settings"
        >
          <Settings size={18} className="mr-2" />
          Settings
        </button>
        
        <button 
          onClick={toggleNotifications}
          className={`
            flex items-center px-3 py-2 rounded-md 
            ${notificationsEnabled 
              ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900 dark:hover:bg-indigo-800 dark:text-indigo-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'}
            transition-all duration-200
            text-sm font-medium
          `}
          aria-label={notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
        >
          {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
        </button>
        
        <button 
          onClick={onKeyboardShortcutsClick}
          className="
            flex items-center px-3 py-2 rounded-md 
            bg-gray-100 hover:bg-gray-200
            text-gray-700
            dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300
            transition-all duration-200
            text-sm font-medium
          "
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard size={18} className="mr-2" />
          Shortcuts
        </button>
      </div>
    </div>
  );
};

export default TimerControls;