import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../dsm/Button';

interface HeaderProps {
  onNewTask?: () => void;
  showNewTaskButton?: boolean;
  isFormOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNewTask, 
  showNewTaskButton = false,
  isFormOpen = false
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Manager</h1>
            {user && (
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline-block self-end">
                Welcome, {user.name || user.username}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {showNewTaskButton && onNewTask && (
              <Button
                onClick={onNewTask}
                variant="primary"
                className="h-10"
              >
                {isFormOpen ? 'Cancel' : 'New Task'}
              </Button>
            )}

            <Button
              onClick={logout}
              variant="secondary"
              className="h-10"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
