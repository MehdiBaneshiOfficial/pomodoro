import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  createdAt: string;
  completedPomodoros: number;
}

interface TaskContextType {
  tasks: Task[];
  currentTask: Task | null;
  addTask: (title: string) => void;
  removeTask: (id: string) => void;
  setCurrentTask: (id: string | null) => void;
  incrementTaskPomodoros: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [currentTask, setCurrentTaskState] = useState<Task | null>(() => {
    const savedCurrentTaskId = localStorage.getItem('currentTaskId');
    if (!savedCurrentTaskId) return null;
    
    const savedTasks = localStorage.getItem('tasks');
    if (!savedTasks) return null;
    
    const parsedTasks: Task[] = JSON.parse(savedTasks);
    return parsedTasks.find(task => task.id === savedCurrentTaskId) || null;
  });

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Save current task ID to localStorage when it changes
  useEffect(() => {
    if (currentTask) {
      localStorage.setItem('currentTaskId', currentTask.id);
    } else {
      localStorage.removeItem('currentTaskId');
    }
  }, [currentTask]);

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      createdAt: new Date().toISOString(),
      completedPomodoros: 0
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    // If no task is currently selected, set this as the current task
    if (!currentTask) {
      setCurrentTaskState(newTask);
    }
  };

  const removeTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    // If the removed task is the current task, clear the current task
    if (currentTask && currentTask.id === id) {
      setCurrentTaskState(null);
    }
  };

  const setCurrentTask = (id: string | null) => {
    if (!id) {
      setCurrentTaskState(null);
      return;
    }
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      setCurrentTaskState(task);
    }
  };

  const incrementTaskPomodoros = () => {
    if (!currentTask) return;
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === currentTask.id 
          ? { ...task, completedPomodoros: task.completedPomodoros + 1 } 
          : task
      )
    );
    
    // Update the current task reference as well
    setCurrentTaskState(prev => 
      prev ? { ...prev, completedPomodoros: prev.completedPomodoros + 1 } : null
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        currentTask,
        addTask,
        removeTask,
        setCurrentTask,
        incrementTaskPomodoros
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};