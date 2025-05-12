import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { ListTodo, Plus, Check, Trash2 } from 'lucide-react';

const TaskSection: React.FC = () => {
  const { 
    tasks, 
    currentTask, 
    addTask, 
    removeTask, 
    setCurrentTask 
  } = useTask();
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  if (!isExpanded) {
    return (
      <div className="mt-4 w-full max-w-md flex justify-center">
        <button
          onClick={() => setIsExpanded(true)}
          className="
            flex items-center px-4 py-2 rounded-md
            bg-white dark:bg-gray-800
            text-gray-700 dark:text-gray-300
            border border-gray-300 dark:border-gray-700
            hover:bg-gray-50 dark:hover:bg-gray-700
            transition-all duration-200
            shadow-sm
          "
          aria-label="Show Tasks"
        >
          <ListTodo size={18} className="mr-2" />
          <span className="font-medium">
            {tasks.length > 0 
              ? `Tasks (${tasks.length})` 
              : 'Add Tasks'}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <ListTodo size={18} className="mr-2" />
          Tasks
        </h2>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Collapse Tasks"
        >
          Minimize
        </button>
      </div>
      
      <div className="p-4">
        {/* Add task form */}
        <form onSubmit={handleAddTask} className="flex mb-4">
          <input
            type="text"
            placeholder="What are you working on?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="
              flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600
              rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            "
          />
          <button
            type="submit"
            className="
              px-3 py-2 bg-indigo-600 text-white rounded-r-md
              hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center
            "
            disabled={!newTaskTitle.trim()}
            aria-label="Add Task"
          >
            <Plus size={20} />
          </button>
        </form>
        
        {/* Task list */}
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-center py-4 text-gray-500 dark:text-gray-400">
              No tasks yet. Add one to get started!
            </p>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id}
                className={`
                  flex items-center justify-between
                  p-3 rounded-md
                  ${currentTask?.id === task.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500' 
                    : 'bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  transition-all duration-200
                `}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 dark:text-gray-200 truncate">
                    {task.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {task.completedPomodoros} {task.completedPomodoros === 1 ? 'pomodoro' : 'pomodoros'} completed
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setCurrentTask(currentTask?.id === task.id ? null : task.id)}
                    className={`
                      p-1 rounded
                      ${currentTask?.id === task.id 
                        ? 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300' 
                        : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}
                      transition-colors duration-200
                    `}
                    aria-label={currentTask?.id === task.id ? "Deselect Task" : "Select Task"}
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="
                      p-1 rounded text-gray-400 hover:text-red-600 
                      hover:bg-red-50 dark:hover:bg-red-900/30
                      transition-colors duration-200
                    "
                    aria-label="Delete Task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskSection;