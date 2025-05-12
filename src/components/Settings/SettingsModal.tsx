import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTimer, TimerMode } from '../../context/TimerContext';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings } = useTimer();
  
  const [formSettings, setFormSettings] = useState({
    focus: settings.focus,
    shortBreak: settings.shortBreak,
    longBreak: settings.longBreak,
    cycles: settings.cycles
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormSettings(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 1 // Ensure value is at least 1
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    onClose();
  };

  // Modal backdrop handler
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="
          bg-white dark:bg-gray-800 rounded-lg shadow-xl
          w-full max-w-md
          transform transition-all duration-300 ease-in-out
          animate-modal-in
        "
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Timer Settings
          </h2>
          <button
            onClick={onClose}
            className="
              text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
              transition-colors duration-200
            "
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Focus Duration */}
            <div>
              <label 
                htmlFor="focus"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Focus Duration (minutes)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="focus"
                  name="focus"
                  min="1"
                  max="60"
                  value={formSettings.focus}
                  onChange={handleChange}
                  className="
                    w-full h-2 bg-gray-200 rounded-lg appearance-none
                    dark:bg-gray-700 accent-indigo-600
                  "
                />
                <span className="ml-4 w-12 text-center text-gray-700 dark:text-gray-300">
                  {formSettings.focus}
                </span>
              </div>
            </div>
            
            {/* Short Break Duration */}
            <div>
              <label 
                htmlFor="shortBreak"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Short Break Duration (minutes)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="shortBreak"
                  name="shortBreak"
                  min="1"
                  max="30"
                  value={formSettings.shortBreak}
                  onChange={handleChange}
                  className="
                    w-full h-2 bg-gray-200 rounded-lg appearance-none
                    dark:bg-gray-700 accent-emerald-600
                  "
                />
                <span className="ml-4 w-12 text-center text-gray-700 dark:text-gray-300">
                  {formSettings.shortBreak}
                </span>
              </div>
            </div>
            
            {/* Long Break Duration */}
            <div>
              <label 
                htmlFor="longBreak"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Long Break Duration (minutes)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="longBreak"
                  name="longBreak"
                  min="5"
                  max="60"
                  value={formSettings.longBreak}
                  onChange={handleChange}
                  className="
                    w-full h-2 bg-gray-200 rounded-lg appearance-none
                    dark:bg-gray-700 accent-sky-600
                  "
                />
                <span className="ml-4 w-12 text-center text-gray-700 dark:text-gray-300">
                  {formSettings.longBreak}
                </span>
              </div>
            </div>
            
            {/* Number of Cycles */}
            <div>
              <label 
                htmlFor="cycles"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Number of Cycles Before Long Break
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="cycles"
                  name="cycles"
                  min="1"
                  max="10"
                  value={formSettings.cycles}
                  onChange={handleChange}
                  className="
                    w-full h-2 bg-gray-200 rounded-lg appearance-none
                    dark:bg-gray-700 accent-indigo-600
                  "
                />
                <span className="ml-4 w-12 text-center text-gray-700 dark:text-gray-300">
                  {formSettings.cycles}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2 border border-gray-300 dark:border-gray-600
                rounded-md shadow-sm text-sm font-medium
                text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700
                hover:bg-gray-50 dark:hover:bg-gray-600
                focus:outline-none focus:ring-2 focus:ring-indigo-500
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="
                px-4 py-2 border border-transparent rounded-md shadow-sm
                text-sm font-medium text-white bg-indigo-600
                hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
              "
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;