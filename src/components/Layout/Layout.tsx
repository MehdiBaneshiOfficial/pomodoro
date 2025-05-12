import React from 'react';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <main className="container mx-auto py-4 px-4">
          {children}
        </main>
        <footer className="text-center py-4 text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            Created by Mehdi Baneshi{' '}
            <a 
              href="https://github.com/mrDiban/pomodoro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Open source
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;