import React, { useEffect, useRef } from 'react';
import { useTimer } from '../../context/TimerContext';
import { useTask } from '../../context/TaskContext';

const TimerDisplay: React.FC = () => {
  const { 
    displayTime, 
    currentMode, 
    percentComplete, 
    isRunning 
  } = useTimer();
  
  const { currentTask } = useTask();
  const timerRef = useRef<HTMLDivElement>(null);

  // Define the mode labels
  const modeLabels = {
    focus: 'Focus Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break'
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Timer mode label */}
      <div 
        className={`
          text-xl font-medium mb-4 
          ${currentMode === 'focus' 
            ? 'text-indigo-600 dark:text-indigo-400' 
            : currentMode === 'shortBreak' 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-sky-600 dark:text-sky-400'}
          transition-colors duration-300
        `}
      >
        {modeLabels[currentMode]}
      </div>
      
      {/* Current task display */}
      {currentTask && (
        <div className="text-base text-gray-600 dark:text-gray-300 mb-6 max-w-xs text-center">
          Working on: <span className="font-medium">{currentTask.title}</span>
        </div>
      )}
      
      {/* Main timer display */}
      <div 
        ref={timerRef}
        className={`
          relative flex items-center justify-center 
          w-72 h-72 rounded-full 
          bg-white dark:bg-gray-800
          shadow-lg
          transition-all duration-300
          ${isRunning ? 'timer-glow' : ''}
        `}
      >
        {/* Progress circle */}
        <svg className="absolute w-72 h-72 -rotate-90">
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="130"
            cx="144"
            cy="144"
          />
          <circle
            className={`text-transparent ${currentMode === 'focus' ? 'stroke-indigo-500' : currentMode === 'shortBreak' ? 'stroke-emerald-500' : 'stroke-sky-500'}`}
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="130"
            cx="144"
            cy="144"
            strokeDasharray={2 * Math.PI * 130}
            strokeDashoffset={2 * Math.PI * 130 * (1 - percentComplete / 100)}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        
        {/* Time display */}
        <div 
          className={`
            text-6xl font-bold z-10
            ${isRunning ? 'timer-breathe' : ''}
            ${currentMode === 'focus' 
              ? 'text-indigo-700 dark:text-indigo-300' 
              : currentMode === 'shortBreak' 
                ? 'text-emerald-700 dark:text-emerald-300' 
                : 'text-sky-700 dark:text-sky-300'}
          `}
        >
          {displayTime}
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;