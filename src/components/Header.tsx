import React from 'react';
import { Sun, Moon, Shield, Eye, Bell } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isOwnerMode: boolean;
  onRequestOwnerMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  setIsDarkMode,
  isOwnerMode,
  onRequestOwnerMode,
}) => {
  return (
    <>
      {/* Desktop & Mobile Fixed Top App Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-zinc-900 transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-6 h-16 md:h-20 flex justify-between items-center relative">
          
          {/* Brand Logo - Playfair Serif */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg md:text-2xl font-bold tracking-widest text-brand-gold dark:text-brand-gold uppercase">
              GEETHA MUA
            </span>
            {isOwnerMode && (
              <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/50">
                Owner Mode
              </span>
            )}
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* View Mode Toggle Button — now calls password gate */}
            <button
              onClick={onRequestOwnerMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
              title={isOwnerMode ? 'Switch to Client View' : 'Switch to Owner View (Password Required)'}
              id="owner-toggle-btn"
            >
              {isOwnerMode ? (
                <>
                  <Eye size={14} className="text-emerald-500" />
                  <span className="hidden sm:inline">Client View</span>
                </>
              ) : (
                <>
                  <Shield size={14} className="text-brand-gold" />
                  <span className="hidden sm:inline">Owner Mode</span>
                </>
              )}
            </button>

            {/* Dark & Light Theme Option */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400 transition-all duration-200"
              aria-label="Toggle Theme"
              id="theme-toggle-btn"
            >
              {isDarkMode ? <Sun size={20} className="text-brand-gold" /> : <Moon size={20} />}
            </button>

            {/* Simple notification bell accent */}
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400 relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-gold rounded-full"></span>
            </button>

          </div>

        </div>
      </header>
      {/* Spacer to prevent header from overlapping content */}
      <div className="h-16 md:h-20" />
    </>
  );
};
