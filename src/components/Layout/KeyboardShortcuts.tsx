import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  onClose: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ onClose }) => {
  const shortcuts = [
    { key: 'Space', description: 'Play/Pause Timer' },
    { key: 'R', description: 'Reset Current Timer' },
    { key: 'S', description: 'Skip to Next Session' }
  ];

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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <Keyboard size={20} className="mr-2" />
            Keyboard Shortcuts
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
        
        <div className="p-6">
          <div className="space-y-4">
            {shortcuts.map(shortcut => (
              <div 
                key={shortcut.key}
                className="flex items-center justify-between"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {shortcut.description}
                </span>
                <kbd 
                  className="
                    px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-700
                    border border-gray-300 dark:border-gray-600
                    text-gray-700 dark:text-gray-300
                    text-sm font-mono
                    shadow-sm
                  "
                >
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            Note: Keyboard shortcuts only work when you're not focused on an input field.
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;