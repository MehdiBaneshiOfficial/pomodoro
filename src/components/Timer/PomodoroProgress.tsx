import React, { useEffect, useRef } from 'react';
import { useTimer } from '../../context/TimerContext';

const PomodoroProgress: React.FC = () => {
  const { 
    settings, 
    currentCycle, 
    completedCycles, 
    currentMode 
  } = useTimer();
  
  const progressRef = useRef<HTMLDivElement>(null);

  // Generate array of cycles for current set
  const cycleDots = Array.from({ length: settings.cycles }, (_, index) => ({
    cycleNumber: index + 1,
    isCompleted: index + 1 <= completedCycles % settings.cycles,
    isCurrent: currentMode === 'focus' && index + 1 === completedCycles % settings.cycles + 1
  }));

  // Animation effect when cycle changes
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.classList.add('progress-pulse');
      const timer = setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.classList.remove('progress-pulse');
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [completedCycles, currentCycle]);

  return (
    <div 
      ref={progressRef}
      className="w-full max-w-md mb-8 flex flex-col items-center"
    >
      <div className="w-full flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Cycle {currentCycle}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {completedCycles} completed
        </span>
      </div>
      
      <div className="w-full flex justify-between items-center py-2">
        {cycleDots.map(({ cycleNumber, isCompleted, isCurrent }) => (
          <div 
            key={cycleNumber}
            className="relative flex flex-col items-center"
          >
            <div 
              className={`
                w-4 h-4 rounded-full 
                ${isCurrent 
                  ? 'bg-indigo-600 ring-4 ring-indigo-200 dark:ring-indigo-900' 
                  : isCompleted 
                    ? 'bg-indigo-500' 
                    : 'bg-gray-300 dark:bg-gray-700'}
                transition-all duration-300
              `}
            />
            
            {/* Connecting line */}
            {cycleNumber < settings.cycles && (
              <div 
                className={`
                  absolute top-2 left-4 h-0.5 w-full 
                  ${isCompleted ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-700'}
                  transition-all duration-300
                `}
              />
            )}
            
            {/* Cycle number */}
            <span 
              className={`
                text-xs mt-2
                ${isCurrent 
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                  : 'text-gray-500 dark:text-gray-400'}
              `}
            >
              {cycleNumber}
            </span>
          </div>
        ))}
      </div>
      
      {/* Current mode indicator */}
      <div 
        className={`
          text-sm font-medium mt-2 px-3 py-1 rounded-full
          ${currentMode === 'focus' 
            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
            : currentMode === 'shortBreak' 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' 
              : 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300'}
          transition-colors duration-300
        `}
      >
        {currentMode === 'focus' 
          ? 'Focus Session' 
          : currentMode === 'shortBreak' 
            ? 'Short Break' 
            : 'Long Break'}
      </div>
    </div>
  );
};

export default PomodoroProgress;