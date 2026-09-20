import { useState, useEffect, useCallback } from 'react';
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
import { ShieldAlert, Sparkles, Cloud, CloudOff } from 'lucide-react';
import { fetchBookingsFromFirestore } from './firebase';

const DEFAULT_OWNER_PASSWORD = 'geetha@0411';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('geetha-mua-theme');
    return saved ? saved === 'dark' : true;
  });

  // Mode state
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
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SERVICES;
  });

  // Gallery items state with persistence
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('geetha-mua-gallery');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_GALLERY;
  });

  // Client Bookings — load from localStorage first, then merge with Firestore
  const [bookings, setBookings] = useState<BookingDetails[]>(() => {
    const saved = localStorage.getItem('geetha-mua-bookings');
    return saved ? JSON.parse(saved) : [];
  });

  // Cloud sync state
  const [cloudSynced, setCloudSynced] = useState<boolean>(false);
  const [cloudError, setCloudError] = useState<boolean>(false);

  // Currency state — always ₹
  const [currencySymbol, setCurrencySymbol] = useState<string>(() => {
    const saved = localStorage.getItem('geetha-mua-currency');
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

  // ── Fetch ALL bookings from Firestore when Owner logs in ────────────────────
  const syncFromFirestore = useCallback(async () => {
    try {
      const cloudBookings = await fetchBookingsFromFirestore();

      // Firestore is the authoritative source — set bookings from cloud
      // Also merge any local-only bookings that may not have uploaded yet
      setBookings(prev => {
        const cloudIds = new Set(cloudBookings.map(b => b.id));
        const localOnlyBookings = prev.filter(b => !cloudIds.has(b.id));
        // Cloud bookings first (newest first from Firestore), then any local-only ones
        const merged = [...cloudBookings, ...localOnlyBookings];
        localStorage.setItem('geetha-mua-bookings', JSON.stringify(merged));
        return merged;
      });

      setCloudSynced(true);
      setCloudError(false);
    } catch (err) {
      console.error('Firestore sync failed:', err);
      setCloudError(true);
      setCloudSynced(false);
    }
  }, []);

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
  useEffect(() => { localStorage.setItem('geetha-mua-services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('geetha-mua-gallery', JSON.stringify(galleryItems)); }, [galleryItems]);
  useEffect(() => { localStorage.setItem('geetha-mua-bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('geetha-mua-currency', currencySymbol); }, [currencySymbol]);
  useEffect(() => { localStorage.setItem('geetha-mua-owner-pwd', ownerPassword); }, [ownerPassword]);

  // Fetch from Firestore whenever owner dashboard is opened
  useEffect(() => {
    if (isOwnerMode && activeTab === 'owner') {
      syncFromFirestore();
    }
  }, [isOwnerMode, activeTab, syncFromFirestore]);

  // Utility to display brief auto-dismiss notifications
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Owner Mode password gate
  const handleRequestOwnerMode = () => {
    if (isOwnerMode) {
      setIsOwnerMode(false);
      setActiveTab('home');
      setCloudSynced(false);
      triggerNotification('👁️ Returning to Client View.');
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    setIsOwnerMode(true);
    setActiveTab('owner');
    triggerNotification('🔐 Owner login verified. Loading bookings from cloud...');
    // Immediately fetch all bookings from Firestore on owner login
    syncFromFirestore();
  };

  // Booking handlers
  const handleBookNow = (service?: Service) => {
    setPreSelectedService(service || null);
    setActiveTab('book');
  };

  const handleBookingSubmit = (newBooking: BookingDetails) => {
    setBookings(prev => [newBooking, ...prev]);
    triggerNotification('✨ Appointment reserved & saved to cloud!');
  };

  const handleAddService = (newService: Omit<Service, 'id'>) => {
    const service: Service = { ...newService, id: `s-${Date.now()}` };
    setServices(prev => [...prev, service]);
    triggerNotification('🚀 New service added to catalog!');
  };

  const handleDeleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    triggerNotification('🗑️ Service removed from catalog.');
  };

  const handleUpdateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    triggerNotification('💼 Service updated successfully!');
  };

  const handleAddGalleryItem = (newItem: Omit<GalleryItem, 'id'>) => {
    const item: GalleryItem = { ...newItem, id: `g-${Date.now()}` };
    setGalleryItems(prev => [item, ...prev]);
    triggerNotification('📸 New photo added to gallery!');
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
    triggerNotification('🗑️ Gallery photo removed.');
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

      {/* Cloud sync status indicator */}
      {isOwnerMode && (
        <div className={`fixed bottom-24 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md transition-all duration-300 ${
          cloudSynced
            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            : cloudError
            ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900'
            : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700'
        }`}>
          {cloudSynced
            ? <><Cloud size={11} /> Cloud Synced</>
            : cloudError
            ? <><CloudOff size={11} /> Offline Mode</>
            : <><Cloud size={11} /> Syncing...</>
          }
        </div>
      )}

      {/* Header bar */}
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

        {/* Owner mode reminder banner */}
        {isOwnerMode && activeTab !== 'owner' && (
          <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-brand-gold/30 p-3 rounded-lg text-xs font-medium text-amber-800 dark:text-amber-400 mb-8 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} />
              <span>Owner Mode active — edits are unlocked.</span>
            </div>
            <button
              onClick={() => setActiveTab('owner')}
              className="underline text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        <div>
          {activeTab === 'home' && (
            <HomeView services={services} onBookNow={handleBookNow} currencySymbol={currencySymbol} />
          )}
          {activeTab === 'services' && (
            <ServicesView services={services} onBookNow={handleBookNow} currencySymbol={currencySymbol} />
          )}
          {activeTab === 'book' && (
            <BookingView
              services={services}
              preSelectedService={preSelectedService}
              currencySymbol={currencySymbol}
              onBookingSubmit={handleBookingSubmit}
              onBackToHome={() => { setPreSelectedService(null); setActiveTab('gallery'); }}
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
              cloudSynced={cloudSynced}
              onRefreshCloud={syncFromFirestore}
            />
          )}
        </div>

      </main>
    </div>
  );
}
