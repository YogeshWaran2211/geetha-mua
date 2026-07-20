import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ServicesView } from './components/ServicesView';
import { GalleryView } from './components/GalleryView';
import { BookingView } from './components/BookingView';
import { OwnerDashboard } from './components/OwnerDashboard';
import { OwnerPasswordModal } from './components/OwnerPasswordModal';

import { INITIAL_SERVICES, INITIAL_GALLERY } from './initialData';
import { Service, GalleryItem, BookingDetails } from './types';
import { ShieldAlert, Sparkles } from 'lucide-react';

const DEFAULT_OWNER_PASSWORD = 'geetha@0411';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('geetha-mua-theme');
    return saved ? saved === 'dark' : true; // Default to eye-safe dark theme
  });

  // Mode state (Client or Owner mode toggled)
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(false);

  // Password gate state
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [ownerPassword, setOwnerPassword] = useState<string>(() => {
    return localStorage.getItem('geetha-mua-owner-pwd') || DEFAULT_OWNER_PASSWORD;
  });

  // Active Screen / Tab navigation
  const [activeTab, setActiveTab] = useState<string>('home');

  // Services Catalog state with persistence
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('geetha-mua-services');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SERVICES;
  });

  // Gallery items state with persistence
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('geetha-mua-gallery');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_GALLERY;
  });

  // Client Bookings state with persistence
  const [bookings, setBookings] = useState<BookingDetails[]>(() => {
    const saved = localStorage.getItem('geetha-mua-bookings');
    return saved ? JSON.parse(saved) : [];
  });

  // Currency state — always ₹ (Indian Rupees), reset any old saved value
  const [currencySymbol, setCurrencySymbol] = useState<string>(() => {
    const saved = localStorage.getItem('geetha-mua-currency');
    // Force reset to ₹ if old value was $ or other foreign currency
    if (!saved || saved === '$' || saved === '£' || saved === '€') {
      localStorage.setItem('geetha-mua-currency', '₹');
      return '₹';
    }
    return saved;
  });

  // Selected Service to pre-populate booking flow
  const [preSelectedService, setPreSelectedService] = useState<Service | null>(null);

  // Success Notification banner helper
  const [notification, setNotification] = useState<string | null>(null);

  // Sync theme with HTML tag
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('geetha-mua-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('geetha-mua-theme', 'light');
    }
  }, [isDarkMode]);

  // Sync state data into LocalStorage
  useEffect(() => {
    localStorage.setItem('geetha-mua-services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('geetha-mua-gallery', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('geetha-mua-bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('geetha-mua-currency', currencySymbol);
  }, [currencySymbol]);

  useEffect(() => {
    localStorage.setItem('geetha-mua-owner-pwd', ownerPassword);
  }, [ownerPassword]);

  // Utility to display brief auto-dismiss notifications
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Owner Mode password gate — open modal instead of directly toggling
  const handleRequestOwnerMode = () => {
    if (isOwnerMode) {
      // Already in owner mode → just exit
      setIsOwnerMode(false);
      setActiveTab('home');
      triggerNotification('👁️ Returning to Client View.');
    } else {
      setShowPasswordModal(true);
    }
  };

  // Called when password modal succeeds
  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    setIsOwnerMode(true);
    setActiveTab('owner');
    triggerNotification('🔨 Admin Suite opened. Edit catalog, gallery and reservations.');
  };

  // Mapped functions to connect UI events to persistence Layer
  const handleBookNow = (service?: Service) => {
    if (service) {
      setPreSelectedService(service);
    } else {
      setPreSelectedService(null);
    }
    setActiveTab('book');
  };

  const handleBookingSubmit = (newBooking: BookingDetails) => {
    setBookings([newBooking, ...bookings]);
    triggerNotification('✨ Appointment reservation recorded successfully!');
  };

  const handleAddService = (newService: Omit<Service, 'id'>) => {
    const service: Service = {
      ...newService,
      id: `s-${Date.now()}`,
    };
    setServices([...services, service]);
    triggerNotification('🚀 New service added successfully to the catalog!');
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
    triggerNotification('🗑️ Service successfully removed from catalog.');
  };

  const handleUpdateService = (id: string, updates: Partial<Service>) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    triggerNotification('💼 Service details updated successfully!');
  };

  const handleAddGalleryItem = (newItem: Omit<GalleryItem, 'id'>) => {
    const item: GalleryItem = {
      ...newItem,
      id: `g-${Date.now()}`,
    };
    setGalleryItems([item, ...galleryItems]);
    triggerNotification('📸 New transformation photo appended to gallery!');
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryItems(galleryItems.filter((item) => item.id !== id));
    triggerNotification('🗑️ Gallery photo successfully removed.');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#121212] text-zinc-900 dark:text-gray-100 transition-colors duration-300 font-sans">
      
      {/* Secure Owner Password Modal */}
      <OwnerPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        ownerPassword={ownerPassword}
      />

      {/* Dynamic Success Toast Alerts */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-dark dark:bg-zinc-900 border border-brand-gold text-brand-gold text-xs font-semibold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <Sparkles size={14} className="animate-pulse" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header bar: Logo, Dark mode button, Owner View switch */}
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isOwnerMode={isOwnerMode}
        onRequestOwnerMode={handleRequestOwnerMode}
      />

      {/* Navigation tabs wrapper */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOwnerMode={isOwnerMode}
      />

      {/* Primary Display Content Grid */}
      <main className="max-w-[1440px] mx-auto px-6 pt-6 pb-28 md:pb-20">
        
        {/* Quick reminder banner when in Owner Mode */}
        {isOwnerMode && activeTab !== 'owner' && (
          <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-brand-gold/30 p-3 rounded-lg text-xs font-medium text-amber-800 dark:text-amber-400 mb-8 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} />
              <span>You are viewing as Owner. Gallery deletes and inline price edits are unlocked.</span>
            </div>
            <button
              onClick={() => setActiveTab('owner')}
              className="underline text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300"
            >
              Configure Service List
            </button>
          </div>
        )}

        {/* Dynamic Route Rendering with elegant state switching */}
        <div>
          {activeTab === 'home' && (
            <HomeView
              services={services}
              onBookNow={handleBookNow}
              currencySymbol={currencySymbol}
            />
          )}

          {activeTab === 'services' && (
            <ServicesView
              services={services}
              onBookNow={handleBookNow}
              currencySymbol={currencySymbol}
            />
          )}

          {activeTab === 'book' && (
            <BookingView
              services={services}
              preSelectedService={preSelectedService}
              currencySymbol={currencySymbol}
              onBookingSubmit={handleBookingSubmit}
              onBackToHome={() => {
                setPreSelectedService(null);
                setActiveTab('gallery');
              }}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryView
              galleryItems={galleryItems}
              isOwnerMode={isOwnerMode}
              onAddGalleryItem={handleAddGalleryItem}
              onDeleteGalleryItem={handleDeleteGalleryItem}
            />
          )}

          {activeTab === 'owner' && isOwnerMode && (
            <OwnerDashboard
              services={services}
              bookings={bookings}
              currencySymbol={currencySymbol}
              setCurrencySymbol={setCurrencySymbol}
              onAddService={handleAddService}
              onDeleteService={handleDeleteService}
              onUpdateService={handleUpdateService}
              ownerPassword={ownerPassword}
              setOwnerPassword={setOwnerPassword}
            />
          )}
        </div>

      </main>

    </div>
  );
}
