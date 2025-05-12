import React, { useState } from 'react';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import PomodoroProgress from './PomodoroProgress';
import TaskSection from '../Task/TaskSection';
import SettingsModal from '../Settings/SettingsModal';
import KeyboardShortcuts from '../Layout/KeyboardShortcuts';

const TimerContainer: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center space-y-8">
      <PomodoroProgress />
      <TimerDisplay />
      <TimerControls 
        onSettingsClick={() => setShowSettings(true)}
        onKeyboardShortcutsClick={() => setShowKeyboardShortcuts(true)}
      />
      <TaskSection />
      
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
      
      {showKeyboardShortcuts && (
        <KeyboardShortcuts onClose={() => setShowKeyboardShortcuts(false)} />
      )}
    </div>
  );
};

export default TimerContainer;