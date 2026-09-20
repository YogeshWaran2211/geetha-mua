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
import { Service, GalleryItem, BookingDetails, Offer } from './types';
import { ShieldAlert, Sparkles, Cloud, CloudOff } from 'lucide-react';
import {
  fetchBookingsFromFirestore,
  fetchServicesFromFirestore,
  fetchOffersFromFirestore,
  saveServiceToFirestore,
  deleteServiceFromFirestore,
  saveOfferToFirestore,
  deleteOfferFromFirestore,
} from './firebase';

const DEFAULT_OWNER_PASSWORD = 'geetha@0411';

export default function App() {
  // ── Theme ────────────────────────────────────────────────────────────────
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('geetha-mua-theme');
    return saved ? saved === 'dark' : true;
  });

  // ── Owner Mode & Password ─────────────────────────────────────────────────
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [ownerPassword, setOwnerPassword] = useState<string>(() =>
    localStorage.getItem('geetha-mua-owner-pwd') || DEFAULT_OWNER_PASSWORD
  );

  // ── Navigation ───────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<string>('home');

  // ── Services — loaded from Firestore on startup ───────────────────────────
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('geetha-mua-services');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fall through */ }
    }
    return INITIAL_SERVICES;
  });
  const [servicesLoaded, setServicesLoaded] = useState(false);

  // ── Gallery ───────────────────────────────────────────────────────────────
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('geetha-mua-gallery');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fall through */ }
    }
    return INITIAL_GALLERY;
  });

  // ── Bookings ──────────────────────────────────────────────────────────────
  const [bookings, setBookings] = useState<BookingDetails[]>(() => {
    const saved = localStorage.getItem('geetha-mua-bookings');
    return saved ? JSON.parse(saved) : [];
  });

  // ── Offers ────────────────────────────────────────────────────────────────
  const [offers, setOffers] = useState<Offer[]>([]);

  // ── Currency ──────────────────────────────────────────────────────────────
  const [currencySymbol, setCurrencySymbol] = useState<string>(() => {
    const saved = localStorage.getItem('geetha-mua-currency');
    if (!saved || ['$', '£', '€'].includes(saved)) {
      localStorage.setItem('geetha-mua-currency', '₹');
      return '₹';
    }
    return saved;
  });

  // ── Pre-selected Service & Notification ───────────────────────────────────
  const [preSelectedService, setPreSelectedService] = useState<Service | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // ── Cloud Sync Status ─────────────────────────────────────────────────────
  const [cloudSynced, setCloudSynced] = useState<boolean>(false);
  const [cloudError, setCloudError] = useState<boolean>(false);

  // ════════════════════════════════════════════════════════════════════════════
  // On app start — fetch services & offers from Firestore for ALL clients
  // ════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    async function loadPublicData() {
      // Load services from Firestore (so all clients see owner's latest)
      const cloudServices = await fetchServicesFromFirestore();
      if (cloudServices.length > 0) {
        setServices(cloudServices);
        localStorage.setItem('geetha-mua-services', JSON.stringify(cloudServices));
      }
      setServicesLoaded(true);

      // Load offers from Firestore for bell icon
      const cloudOffers = await fetchOffersFromFirestore();
      setOffers(cloudOffers);
    }
    loadPublicData();
  }, []);

  // ════════════════════════════════════════════════════════════════════════════
  // Owner login — sync bookings from Firestore
  // ════════════════════════════════════════════════════════════════════════════
  const syncFromFirestore = useCallback(async () => {
    try {
      const cloudBookings = await fetchBookingsFromFirestore();
      setBookings(prev => {
        const cloudIds = new Set(cloudBookings.map(b => b.id));
        const localOnly = prev.filter(b => !cloudIds.has(b.id));
        const merged = [...cloudBookings, ...localOnly];
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

  // ── Sync useEffect triggers ───────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    isDarkMode ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('geetha-mua-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => { localStorage.setItem('geetha-mua-gallery',  JSON.stringify(galleryItems)); }, [galleryItems]);
  useEffect(() => { localStorage.setItem('geetha-mua-bookings', JSON.stringify(bookings));     }, [bookings]);
  useEffect(() => { localStorage.setItem('geetha-mua-currency', currencySymbol);               }, [currencySymbol]);
  useEffect(() => { localStorage.setItem('geetha-mua-owner-pwd', ownerPassword);               }, [ownerPassword]);

  useEffect(() => {
    if (isOwnerMode && activeTab === 'owner') syncFromFirestore();
  }, [isOwnerMode, activeTab, syncFromFirestore]);

  // ════════════════════════════════════════════════════════════════════════════
  // Notification helper
  // ════════════════════════════════════════════════════════════════════════════
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // ════════════════════════════════════════════════════════════════════════════
  // Owner mode handlers
  // ════════════════════════════════════════════════════════════════════════════
  const handleRequestOwnerMode = () => {
    if (isOwnerMode) {
      setIsOwnerMode(false);
      setActiveTab('home');
      setCloudSynced(false);
      triggerNotification('👁️ Returned to Client View.');
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    setIsOwnerMode(true);
    setActiveTab('owner');
    triggerNotification('🔐 Owner login verified. Loading bookings from cloud...');
    syncFromFirestore();
  };

  // ════════════════════════════════════════════════════════════════════════════
  // Service handlers — all sync to Firestore
  // ════════════════════════════════════════════════════════════════════════════
  const handleAddService = async (newService: Omit<Service, 'id'>) => {
    const service: Service = {
      ...newService,
      id: `s-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setServices(prev => {
      const updated = [...prev, service];
      localStorage.setItem('geetha-mua-services', JSON.stringify(updated));
      return updated;
    });
    await saveServiceToFirestore(service);
    triggerNotification('🚀 New service added & synced to cloud!');
  };

  const handleDeleteService = async (id: string) => {
    setServices(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('geetha-mua-services', JSON.stringify(updated));
      return updated;
    });
    await deleteServiceFromFirestore(id);
    triggerNotification('🗑️ Service removed from catalog.');
  };

  const handleUpdateService = async (id: string, updates: Partial<Service>) => {
    setServices(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      localStorage.setItem('geetha-mua-services', JSON.stringify(updated));
      return updated;
    });
    const existing = services.find(s => s.id === id);
    if (existing) await saveServiceToFirestore({ ...existing, ...updates });
    triggerNotification('💼 Service updated & synced to cloud!');
  };

  // ════════════════════════════════════════════════════════════════════════════
  // Offer handlers
  // ════════════════════════════════════════════════════════════════════════════
  const handleAddOffer = async (offer: Omit<Offer, 'id' | 'createdAt'>) => {
    const newOffer: Offer = {
      ...offer,
      id: `offer-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const firestoreId = await saveOfferToFirestore(newOffer);
    setOffers(prev => [{ ...newOffer, id: firestoreId }, ...prev]);
    triggerNotification('🎁 Offer published for clients!');
  };

  const handleDeleteOffer = async (id: string) => {
    setOffers(prev => prev.filter(o => o.id !== id));
    await deleteOfferFromFirestore(id);
    triggerNotification('🗑️ Offer removed.');
  };

  // ════════════════════════════════════════════════════════════════════════════
  // Other handlers
  // ════════════════════════════════════════════════════════════════════════════
  const handleBookNow = (service?: Service) => {
    setPreSelectedService(service || null);
    setActiveTab('book');
  };

  const handleBookingSubmit = (newBooking: BookingDetails) => {
    setBookings(prev => [newBooking, ...prev]);
    triggerNotification('✨ Appointment reserved & saved to cloud!');
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

  // ── Count for bell badge ──────────────────────────────────────────────────
  const newServicesCount = services.filter(s => {
    if (!s.createdAt) return false;
    const diff = Date.now() - new Date(s.createdAt).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000; // 7 days
  }).length;
  const bellCount = offers.length + newServicesCount;

  return (
    <div
      className="min-h-screen text-zinc-900 dark:text-gray-100 transition-colors duration-300 font-sans"
      style={{ backgroundColor: isDarkMode ? '#1a1625' : '#faf8f5' }}
    >
      <OwnerPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        ownerPassword={ownerPassword}
      />

      {/* Toast notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-dark dark:bg-zinc-900 border border-brand-gold text-brand-gold text-xs font-semibold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <Sparkles size={14} className="animate-pulse" />
          <span>{notification}</span>
        </div>
      )}

      {/* Cloud sync status (owner only) */}
      {isOwnerMode && (
        <div className={`fixed bottom-24 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md transition-all duration-300 ${
          cloudSynced
            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            : cloudError
            ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900'
            : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700'
        }`}>
          {cloudSynced ? <><Cloud size={11} /> Cloud Synced</>
            : cloudError ? <><CloudOff size={11} /> Offline Mode</>
            : <><Cloud size={11} /> Syncing...</>}
        </div>
      )}

      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isOwnerMode={isOwnerMode}
        onRequestOwnerMode={handleRequestOwnerMode}
        offers={offers}
        newServicesCount={newServicesCount}
        bellCount={bellCount}
        services={services}
      />

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isOwnerMode={isOwnerMode} />

      <main className="max-w-[1440px] mx-auto px-6 pt-6 pb-28 md:pb-20">
        {isOwnerMode && activeTab !== 'owner' && (
          <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-brand-gold/30 p-3 rounded-lg text-xs font-medium text-amber-800 dark:text-amber-400 mb-8 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} />
              <span>Owner Mode active — edits are unlocked.</span>
            </div>
            <button onClick={() => setActiveTab('owner')} className="underline text-[10px] font-bold uppercase tracking-wider">
              Go to Dashboard
            </button>
          </div>
        )}

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
            offers={offers}
            currencySymbol={currencySymbol}
            setCurrencySymbol={setCurrencySymbol}
            onAddService={handleAddService}
            onDeleteService={handleDeleteService}
            onUpdateService={handleUpdateService}
            onAddOffer={handleAddOffer}
            onDeleteOffer={handleDeleteOffer}
            ownerPassword={ownerPassword}
            setOwnerPassword={setOwnerPassword}
            cloudSynced={cloudSynced}
            onRefreshCloud={syncFromFirestore}
          />
        )}
      </main>
    </div>
  );
}
