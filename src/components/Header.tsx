import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Shield, Eye, Bell, Tag, Sparkles } from 'lucide-react';
import { Offer, Service } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isOwnerMode: boolean;
  onRequestOwnerMode: () => void;
  offers: Offer[];
  newServicesCount: number;
  bellCount: number;
  services: Service[];
}

// Helper: is service new (added within 7 days)?
function isNewService(service: Service): boolean {
  if (!service.createdAt) return false;
  return Date.now() - new Date(service.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  setIsDarkMode,
  isOwnerMode,
  onRequestOwnerMode,
  offers,
  newServicesCount,
  bellCount,
  services,
}) => {
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    if (bellOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [bellOpen]);

  const newServices = services.filter(isNewService);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#211d2e] border-b border-gray-100 dark:border-[#2e2845] transition-colors duration-300 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 h-16 md:h-20 flex justify-between items-center relative">

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg md:text-2xl font-bold tracking-widest text-brand-gold uppercase">
              GEETHA MUA
            </span>
            {isOwnerMode && (
              <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/50">
                Owner Mode
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* Owner Mode Toggle */}
            <button
              onClick={onRequestOwnerMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border bg-gray-50 dark:bg-[#2a2440] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-[#3d3560] hover:bg-gray-100 dark:hover:bg-[#332d50]"
              title={isOwnerMode ? 'Switch to Client View' : 'Switch to Owner View'}
              id="owner-toggle-btn"
            >
              {isOwnerMode ? (
                <><Eye size={14} className="text-emerald-500" /><span className="hidden sm:inline">Client View</span></>
              ) : (
                <><Shield size={14} className="text-brand-gold" /><span className="hidden sm:inline">Owner Mode</span></>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2440] text-gray-600 dark:text-gray-400 transition-all duration-200"
              aria-label="Toggle Theme"
              id="theme-toggle-btn"
            >
              {isDarkMode ? <Sun size={20} className="text-brand-gold" /> : <Moon size={20} />}
            </button>

            {/* 🔔 Bell Notification Icon */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen(o => !o)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2440] text-gray-600 dark:text-gray-400 relative transition-all duration-200"
                aria-label="Notifications & Offers"
              >
                <Bell size={20} className={bellCount > 0 ? 'text-brand-gold' : ''} />
                {bellCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-brand-gold text-brand-dark text-[9px] font-extrabold rounded-full flex items-center justify-center px-0.5 new-badge">
                    {bellCount}
                  </span>
                )}
              </button>

              {/* Bell Dropdown */}
              {bellOpen && (
                <div className="bell-dropdown absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#211d2e] border border-gray-100 dark:border-[#2e2845] rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-[#2e2845]">
                    <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                      <Bell size={14} className="text-brand-gold" /> Announcements & Offers
                    </h3>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {/* Active Offers */}
                    {offers.map(offer => (
                      <div key={offer.id} className="px-4 py-3 border-b border-gray-50 dark:border-[#2e2845] hover:bg-gray-50 dark:hover:bg-[#2a2440] transition-colors">
                        <div className="flex items-start gap-2">
                          <Tag size={14} className="text-brand-gold mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-gray-900 dark:text-white">{offer.title}</p>
                            <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">{offer.description}</p>
                            {offer.validUntil && (
                              <p className="text-[10px] text-brand-gold mt-1 font-semibold">
                                Valid until {new Date(offer.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Newly Added Services */}
                    {newServices.map(service => (
                      <div key={service.id} className="px-4 py-3 border-b border-gray-50 dark:border-[#2e2845] hover:bg-gray-50 dark:hover:bg-[#2a2440] transition-colors">
                        <div className="flex items-start gap-2">
                          <Sparkles size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-gray-900 dark:text-white">{service.name}</p>
                              <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider new-badge">NEW</span>
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">{service.category} · Newly added service</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Empty state */}
                    {bellCount === 0 && (
                      <div className="px-4 py-8 text-center">
                        <Bell size={24} className="mx-auto mb-2 text-gray-300 dark:text-zinc-700" />
                        <p className="text-xs text-gray-400 dark:text-zinc-500">No announcements right now</p>
                        <p className="text-[10px] text-gray-300 dark:text-zinc-600 mt-1">Check back later for new offers!</p>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-2 bg-gray-50 dark:bg-[#1a1625] text-[10px] text-gray-400 dark:text-zinc-600 text-center">
                    Geetha MUA — Beauty Artistry
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
};

