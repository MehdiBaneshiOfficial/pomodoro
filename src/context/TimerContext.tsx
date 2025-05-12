import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { formatTime } from '../utils/timeUtils';
import useSound from '../hooks/useSound';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  focus: number;       // in minutes
  shortBreak: number;  // in minutes
  longBreak: number;   // in minutes
  cycles: number;      // number of focus sessions before a long break
}

interface TimerContextType {
  isRunning: boolean;
  currentMode: TimerMode;
  elapsedSeconds: number;
  totalSeconds: number;
  currentCycle: number;
  completedCycles: number;
  displayTime: string;
  percentComplete: number;
  settings: TimerSettings;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipToNext: () => void;
  updateSettings: (newSettings: Partial<TimerSettings>) => void;
}

const DEFAULT_SETTINGS: TimerSettings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  cycles: 4
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const savedSettings = localStorage.getItem('timerSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState<TimerMode>('focus');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [completedCycles, setCompletedCycles] = useState(0);
  
  const timerRef = useRef<number | null>(null);
  
  const { playSound } = useSound();

  // Calculate total seconds for current mode
  const totalSeconds = settings[currentMode] * 60;
  
  // Format display time
  const displayTime = formatTime(totalSeconds - elapsedSeconds);
  
  // Calculate percentage complete
  const percentComplete = (elapsedSeconds / totalSeconds) * 100;

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(settings));
  }, [settings]);

  // Timer tick function
  const tick = useCallback(() => {
    setElapsedSeconds(prev => {
      const newElapsed = prev + 1;
      
      // Check if timer is complete
      if (newElapsed >= totalSeconds) {
        setIsRunning(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        // Play sound when timer completes
        playSound('timerComplete');
        
        // Handle cycle transitions
        if (currentMode === 'focus') {
          const newCompletedCycles = completedCycles + 1;
          setCompletedCycles(newCompletedCycles);
          
          if (newCompletedCycles % settings.cycles === 0) {
            setCurrentMode('longBreak');
          } else {
            setCurrentMode('shortBreak');
          }
        } else {
          // After a break, go back to focus mode
          setCurrentMode('focus');
          if (currentMode === 'longBreak') {
            setCurrentCycle(prev => prev + 1);
          }
        }
        
        return 0; // Reset elapsed time
      }
      
      return newElapsed;
    });
  }, [currentMode, totalSeconds, completedCycles, currentCycle, settings.cycles, playSound]);

  // Start the timer
  const startTimer = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = window.setInterval(tick, 1000);
      playSound('timerStart');
    }
  }, [isRunning, tick, playSound]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      playSound('timerPause');
    }
  }, [isRunning, playSound]);

  // Reset the timer
  const resetTimer = useCallback(() => {
    pauseTimer();
    setElapsedSeconds(0);
    playSound('timerReset');
  }, [pauseTimer, playSound]);

  // Skip to next session
  const skipToNext = useCallback(() => {
    pauseTimer();
    setElapsedSeconds(0);
    
    if (currentMode === 'focus') {
      if ((completedCycles + 1) % settings.cycles === 0) {
        setCurrentMode('longBreak');
      } else {
        setCurrentMode('shortBreak');
      }
      setCompletedCycles(prev => prev + 1);
    } else {
      setCurrentMode('focus');
      if (currentMode === 'longBreak') {
        setCurrentCycle(prev => prev + 1);
      }
    }
    
    playSound('timerSkip');
  }, [currentMode, completedCycles, settings.cycles, pauseTimer, playSound]);

  // Update timer settings
  const updateSettings = useCallback((newSettings: Partial<TimerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    // Reset timer when settings change
    resetTimer();
  }, [resetTimer]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.code === 'Space') {
        e.preventDefault();
        isRunning ? pauseTimer() : startTimer();
      } else if (e.code === 'KeyR') {
        resetTimer();
      } else if (e.code === 'KeyS') {
        skipToNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRunning, startTimer, pauseTimer, resetTimer, skipToNext]);

  return (
    <TimerContext.Provider
      value={{
        isRunning,
        currentMode,
        elapsedSeconds,
        totalSeconds,
        currentCycle,
        completedCycles,
        displayTime,
        percentComplete,
        settings,
        startTimer,
        pauseTimer,
        resetTimer,
        skipToNext,
        updateSettings
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};