import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTimer } from './TimerContext';

interface NotificationContextType {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isRunning, currentMode, elapsedSeconds, totalSeconds } = useTimer();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved ? JSON.parse(saved) : false;
  });

  // Request permission when notifications are enabled
  useEffect(() => {
    if (notificationsEnabled && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  // Send notification when timer completes
  useEffect(() => {
    if (
      notificationsEnabled && 
      Notification.permission === 'granted' && 
      !isRunning && 
      elapsedSeconds === 0 && 
      document.visibilityState === 'hidden'
    ) {
      // Only send notification if the app is in background
      let message = '';
      let title = '';
      
      switch (currentMode) {
        case 'focus':
          title = 'Focus Time Started';
          message = 'Time to concentrate on your work!';
          break;
        case 'shortBreak':
          title = 'Short Break Started';
          message = 'Take a quick 5-minute break!';
          break;
        case 'longBreak':
          title = 'Long Break Started';
          message = 'Time for a longer 15-minute break. You deserve it!';
          break;
      }
      
      // Don't send notification on first load
      if (title) {
        const notification = new Notification(title, {
          body: message,
          icon: '/notification-icon.png'
        });
        
        // Close notification after 5 seconds
        setTimeout(() => notification.close(), 5000);
      }
    }
  }, [notificationsEnabled, isRunning, currentMode, elapsedSeconds, totalSeconds]);

  const toggleNotifications = () => {
    if (!notificationsEnabled && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
        }
      });
    } else {
      setNotificationsEnabled(prev => !prev);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationsEnabled,
        toggleNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};