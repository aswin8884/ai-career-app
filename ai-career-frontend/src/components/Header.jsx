import React from 'react';
import { Bot, Moon, Sun } from 'lucide-react';

const Header = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-md shadow-indigo-200 dark:shadow-none">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
            AI Career <span className="text-indigo-600 dark:text-indigo-400">Engine</span>
          </h1>
        </div>

        {/* Dark Mode Toggle Button */}
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

      </div>
    </header>
  );
};

export default Header;