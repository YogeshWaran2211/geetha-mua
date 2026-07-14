import React from 'react';
import { Home, Sparkles, Calendar, Image, Shield } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOwnerMode: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  isOwnerMode,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Sparkles },
    { id: 'book', label: 'Book', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: Image },
  ];

  if (isOwnerMode) {
    navItems.push({ id: 'owner', label: 'Owner Portal', icon: Shield });
  }

  return (
    <>
      {/* Bottom Nav Bar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-zinc-900 px-4 py-2 flex justify-around items-center transition-colors duration-300 shadow-lg">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 transition-all duration-200 ${
                isActive
                  ? 'text-brand-gold dark:text-brand-gold scale-110 font-bold'
                  : 'text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400'
              }`}
              id={`nav-btn-${item.id}`}
            >
              <IconComponent size={20} className={`${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] uppercase tracking-wider mt-1 font-medium">
                {item.label === 'Owner Portal' ? 'Portal' : item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Side / Top Header Nav Bar - Desktop Only */}
      <div className="hidden md:block fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md px-6 py-2.5 rounded-full shadow-md border border-gray-100 dark:border-zinc-900 transition-colors duration-300">
        <div className="flex items-center gap-8">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-gold text-white shadow-sm dark:bg-brand-gold'
                    : 'text-gray-500 dark:text-zinc-400 hover:text-brand-gold dark:hover:text-brand-gold'
                }`}
                id={`desktop-nav-${item.id}`}
              >
                <IconComponent size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Spacing for Desktop view header bar */}
      <div className="hidden md:block h-12" />
    </>
  );
};
