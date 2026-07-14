import React, { useState } from 'react';
import { Service, BookingDetails } from '../types';
import {
  Plus, Trash2, Calendar, Edit3, Briefcase, FileText,
  Sparkles, TrendingUp, Users, Download, Key, Save,
  ChevronDown, ChevronUp, Image, CheckCircle2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OwnerDashboardProps {
  services: Service[];
  bookings: BookingDetails[];
  currencySymbol: string;
  setCurrencySymbol: (symbol: string) => void;
  onAddService: (service: Omit<Service, 'id'>) => void;
  onDeleteService: (id: string) => void;
  onUpdateService: (id: string, updates: Partial<Service>) => void;
  ownerPassword: string;
  setOwnerPassword: (pwd: string) => void;
}

// ─── CSV Export Helper ───────────────────────────────────────────────────────
function exportBookingsToCSV(bookings: BookingDetails[], currencySymbol: string) {
  if (bookings.length === 0) return;

  const headers = [
    'Booking ID',
    'Booked At',
    'Client Name',
    'Phone',
    'Email',
    'Package / Event',
    'Event Date',
    'Event Time',
    `Total Amount (${currencySymbol})`,
    `Makeup Artistry (${currencySymbol})`,
    `Styling (${currencySymbol})`,
    `Travel Charges (${currencySymbol})`,
    `Early Morning Surcharge (${currencySymbol})`,
    'Inspiration Image URL',
  ];

  const rows = bookings.map((b) => {
    const makeupSvc = b.selectedServices.find((s) => s.id === 'item-mu');
    const stylingSvc = b.selectedServices.find((s) => s.id === 'item-st');
    return [
      b.id || '',
      b.bookedAt ? new Date(b.bookedAt).toLocaleString('en-IN') : '',
      `${b.firstName} ${b.lastName}`,
      b.phone,
      b.email,
      b.packageName || b.eventType,
      b.date || '',
      b.time || '',
      b.amount,
      makeupSvc?.price ?? '',
      stylingSvc?.price ?? '',
      b.travelCharges,
      b.earlyMorningCharges,
      b.inspirationImage || '',
    ];
  });

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `geetha-mua-bookings-${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────
export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  services,
  bookings,
  currencySymbol,
  setCurrencySymbol,
  onAddService,
  onDeleteService,
  onUpdateService,
  ownerPassword,
  setOwnerPassword,
}) => {
  // Active section tab
  const [activeSection, setActiveSection] = useState<'services' | 'bookings' | 'settings'>('services');

  // Service creation form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Bridal');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [fromPrice, setFromPrice] = useState<number>(10000);
  const [duration, setDuration] = useState<number>(2);
  const [image, setImage] = useState('');

  // Full-edit state for an existing service
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Partial<Service>>({});

  // Password change state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdMessage, setPwdMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // CSV download feedback
  const [csvDownloaded, setCsvDownloaded] = useState(false);

  const totalBookingsAmt = bookings.reduce((sum, b) => sum + b.amount, 0);

  // ── Add Service ─────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;
    onAddService({
      name,
      category: category === 'Other' ? customCategory || 'Artistry' : category,
      description,
      fromPrice: fromPrice || 5000,
      duration: duration || 1.5,
      image: image || 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600',
    });
    setName(''); setDescription(''); setFromPrice(10000); setDuration(2); setImage('');
    setShowAddForm(false);
  };

  // ── Start full-edit for a service ────────────────────────────────────────────
  const handleStartEdit = (service: Service) => {
    setEditingServiceId(service.id);
    setEditFields({ ...service });
  };

  const handleSaveEdit = (id: string) => {
    onUpdateService(id, editFields);
    setEditingServiceId(null);
    setEditFields({});
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setEditFields({});
  };

  // ── Password Change ──────────────────────────────────────────────────────────
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPwd !== ownerPassword) {
      setPwdMessage({ type: 'error', text: 'Current password is incorrect.' });
      return;
    }
    if (newPwd.length < 6) {
      setPwdMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setOwnerPassword(newPwd);
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    setPwdMessage({ type: 'success', text: '✅ Password changed successfully! Use it next time you log in.' });
  };

  // ── CSV Export ───────────────────────────────────────────────────────────────
  const handleCSVDownload = () => {
    exportBookingsToCSV(bookings, currencySymbol);
    setCsvDownloaded(true);
    setTimeout(() => setCsvDownloaded(false), 2500);
  };

  const sectionTabs = [
    { id: 'services', label: 'Services & Pricing', icon: <Briefcase size={14} /> },
    { id: 'bookings', label: `Bookings (${bookings.length})`, icon: <FileText size={14} /> },
    { id: 'settings', label: 'Settings', icon: <Key size={14} /> },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 pb-24 space-y-8"
    >
      {/* 1. Dashboard Header */}
      <section className="text-center space-y-4">
        <h1 className="font-serif text-3xl md:text-5xl text-gray-900 dark:text-white font-bold">
          Owner Management Suite
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 text-xs md:text-sm max-w-xl mx-auto">
          Welcome back, Geetha! Manage packages, edit content, export client data, and configure settings.
        </p>
        <div className="w-16 h-0.5 bg-brand-gold mx-auto"></div>
      </section>

      {/* 2. Admin Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 ambient-shadow flex items-center gap-4">
          <div className="p-3 bg-brand-pink/25 dark:bg-zinc-800 rounded-lg text-brand-dark dark:text-brand-gold">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Reserved Volume</span>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
              {currencySymbol}{totalBookingsAmt.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 ambient-shadow flex items-center gap-4">
          <div className="p-3 bg-brand-pink/25 dark:bg-zinc-800 rounded-lg text-brand-dark dark:text-brand-gold">
            <Calendar size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Total Bookings</span>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
              {bookings.length} reservations
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 ambient-shadow flex items-center gap-4">
          <div className="p-3 bg-brand-pink/25 dark:bg-zinc-800 rounded-lg text-brand-dark dark:text-brand-gold">
            <Briefcase size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Active Services</span>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
              {services.length} cataloged
            </p>
          </div>
        </div>

        {/* Currency Picker */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 ambient-shadow flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-2">
            Base Currency Symbol
          </span>
          <div className="flex gap-2">
            {['₹', '$', '£', '€'].map((sym) => (
              <button
                key={sym}
                onClick={() => setCurrencySymbol(sym)}
                className={`flex-1 py-1.5 rounded text-xs font-bold transition-all duration-200 ${
                  currencySymbol === sym
                    ? 'bg-brand-gold text-brand-dark'
                    : 'bg-gray-50 dark:bg-zinc-800 dark:text-gray-300 hover:bg-gray-100'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Section Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-100 dark:border-zinc-800">
        {sectionTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 -mb-px ${
              activeSection === tab.id
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── SERVICES TAB ─────────────────────────────────────────────────── */}
        {activeSection === 'services' && (
          <motion.section
            key="services"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-xl border border-gray-100 dark:border-zinc-800 ambient-shadow space-y-6"
          >
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-4">
              <h2 className="font-serif text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Briefcase size={18} className="text-brand-gold" /> Services Catalog & Pricing
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-amber-500 text-brand-dark px-4 py-2 rounded text-xs uppercase tracking-widest font-bold transition-all"
              >
                <Plus size={14} /> {showAddForm ? 'Hide Form' : 'Add New Service'}
              </button>
            </div>

            {/* Add Service Form */}
            {showAddForm && (
              <form onSubmit={handleSubmit} className="p-5 bg-gray-50 dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-4">
                <h3 className="font-serif text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  <Sparkles size={14} className="text-brand-gold" /> New Service Specification
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-400 mb-1">Service Name</label>
                    <input type="text" required placeholder="e.g. Airbrush HD Muhurtham Look" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded dark:text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-400 mb-1">Category</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded dark:text-white">
                        <option>Bridal</option>
                        <option>Reception</option>
                        <option>Baby Shower</option>
                        <option>Party</option>
                        <option value="Other">Other Category...</option>
                      </select>
                    </div>
                    {category === 'Other' && (
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-400 mb-1">Custom Tag</label>
                        <input type="text" placeholder="e.g. Editorial" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded dark:text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-400 mb-1">Starting Price ({currencySymbol})</label>
                    <input type="number" required value={fromPrice} onChange={(e) => setFromPrice(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-400 mb-1">Duration (hours)</label>
                    <input type="number" step="0.5" required value={duration} onChange={(e) => setDuration(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-400 mb-1">Image URL</label>
                    <input type="url" placeholder="https://images.unsplash.com/..." value={image} onChange={(e) => setImage(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-400 mb-1">Description</label>
                  <textarea required rows={3} placeholder="Describe the makeup, styling, and inclusions..."
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded dark:text-white" />
                </div>

                <button type="submit"
                  className="w-full py-2.5 bg-brand-gold text-brand-dark rounded text-xs uppercase tracking-widest font-bold hover:bg-amber-500 transition-all">
                  Add Service to Catalog
                </button>
              </form>
            )}

            {/* Existing Services — Full Edit Table */}
            <div className="space-y-4">
              {services.map((s) => (
                <div key={s.id} className="rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                  {/* Service Row Summary */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50/50 dark:bg-zinc-950/40">
                    <img src={editingServiceId === s.id ? (editFields.image || s.image) : s.image}
                      alt={s.name} className="w-14 h-14 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{s.name}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{s.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                        <span className="px-2 py-0.5 rounded-full bg-brand-pink/60 dark:bg-zinc-800 text-brand-dark dark:text-gray-200 font-bold">{s.category}</span>
                        <span>{s.duration}h · {currencySymbol}{s.fromPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {editingServiceId === s.id ? (
                        <>
                          <button onClick={() => handleSaveEdit(s.id)}
                            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-[10px] font-bold">
                            <Save size={12} /> Save
                          </button>
                          <button onClick={handleCancelEdit}
                            className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded text-[10px] font-bold">
                            <X size={12} /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleStartEdit(s)}
                            className="flex items-center gap-1 text-brand-gold hover:text-amber-500 px-2 py-1.5 rounded text-[10px] font-bold border border-brand-gold/30 hover:bg-brand-gold/5">
                            <Edit3 size={12} /> Edit All
                          </button>
                          <button onClick={() => { if (confirm(`Delete "${s.name}" from catalog?`)) onDeleteService(s.id); }}
                            className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded Edit Form */}
                  <AnimatePresence>
                    {editingServiceId === s.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900 space-y-4 overflow-hidden"
                      >
                        <p className="text-[10px] uppercase font-bold text-brand-gold tracking-wider flex items-center gap-1">
                          <Edit3 size={11} /> Edit Service Details
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Service Name</label>
                            <input type="text" value={editFields.name || ''} onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                              className="w-full text-xs p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded dark:text-white" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Category</label>
                            <input type="text" value={editFields.category || ''} onChange={(e) => setEditFields({ ...editFields, category: e.target.value })}
                              className="w-full text-xs p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded dark:text-white" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Price ({currencySymbol})</label>
                            <input type="number" value={editFields.fromPrice || 0} onChange={(e) => setEditFields({ ...editFields, fromPrice: parseFloat(e.target.value) || 0 })}
                              className="w-full text-xs p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded dark:text-white" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Duration (hours)</label>
                            <input type="number" step="0.5" value={editFields.duration || 0} onChange={(e) => setEditFields({ ...editFields, duration: parseFloat(e.target.value) || 0 })}
                              className="w-full text-xs p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded dark:text-white" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center gap-1">
                            <Image size={11} /> Image URL
                          </label>
                          <input type="url" value={editFields.image || ''} onChange={(e) => setEditFields({ ...editFields, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full text-xs p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded dark:text-white" />
                          {editFields.image && (
                            <img src={editFields.image} alt="Preview" className="mt-2 h-16 object-cover rounded border border-gray-200 dark:border-zinc-700" referrerPolicy="no-referrer" />
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Description</label>
                          <textarea rows={3} value={editFields.description || ''} onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
                            className="w-full text-xs p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded dark:text-white" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── BOOKINGS TAB ─────────────────────────────────────────────────── */}
        {activeSection === 'bookings' && (
          <motion.section
            key="bookings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-xl border border-gray-100 dark:border-zinc-800 ambient-shadow space-y-6"
          >
            {/* Bookings Header + CSV Export */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-zinc-800 pb-4">
              <h2 className="font-serif text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText size={18} className="text-brand-gold" /> Client Bookings ({bookings.length})
              </h2>
              <button
                onClick={handleCSVDownload}
                disabled={bookings.length === 0}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                  csvDownloaded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-gold hover:bg-amber-500 text-brand-dark'
                } disabled:bg-gray-100 disabled:dark:bg-zinc-800 disabled:text-gray-400 disabled:cursor-not-allowed`}
              >
                {csvDownloaded ? (
                  <><CheckCircle2 size={14} /> Downloaded!</>
                ) : (
                  <><Download size={14} /> Export CSV for Google Sheets</>
                )}
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Users size={32} className="mx-auto mb-3 text-gray-300 dark:text-zinc-700" />
                <p className="text-sm font-medium">No client bookings yet.</p>
                <p className="text-[10px] mt-1">Head to the Book screen to place a booking!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, idx) => (
                  <div key={booking.id || idx}
                    className="p-5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/40 space-y-3 text-xs">
                    {/* Row 1: Name + Event badge + Date */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {booking.firstName} {booking.lastName}
                      </span>
                      <span className="bg-brand-gold/15 text-brand-gold text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {booking.packageName || booking.eventType}
                      </span>
                      {booking.bookedAt && (
                        <span className="text-gray-400 text-[10px]">
                          Reserved: {new Date(booking.bookedAt).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Row 2: Contact */}
                    <div className="flex flex-wrap gap-4 text-gray-500 dark:text-zinc-400">
                      <span>📞 {booking.phone}</span>
                      <span>✉️ {booking.email}</span>
                      <span>📅 {booking.date} at {booking.time}</span>
                    </div>

                    {/* Row 3: Package breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {booking.selectedServices.map((svc) => (
                        <div key={svc.id} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded p-2">
                          <p className="text-[10px] text-gray-400 uppercase font-bold truncate">{svc.name}</p>
                          <p className="font-bold text-gray-900 dark:text-white text-xs mt-0.5">{currencySymbol}{svc.price.toLocaleString()}</p>
                        </div>
                      ))}
                      {booking.travelCharges > 0 && (
                        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded p-2">
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Travel</p>
                          <p className="font-bold text-gray-900 dark:text-white text-xs mt-0.5">{currencySymbol}{booking.travelCharges.toLocaleString()}</p>
                        </div>
                      )}
                      {booking.earlyMorningCharges > 0 && (
                        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded p-2">
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Early AM</p>
                          <p className="font-bold text-gray-900 dark:text-white text-xs mt-0.5">{currencySymbol}{booking.earlyMorningCharges.toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {/* Row 4: Grand Total */}
                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200 dark:border-zinc-800">
                      {booking.inspirationImage && (
                        <a href={booking.inspirationImage} target="_blank" rel="noreferrer"
                          className="text-[10px] text-blue-500 underline hover:text-blue-600 truncate max-w-[240px]">
                          🖼 Inspiration ref
                        </a>
                      )}
                      <div className="ml-auto text-right">
                        <span className="text-gray-400 text-[10px] uppercase font-bold block">Grand Total</span>
                        <span className="text-lg font-extrabold text-brand-gold">{currencySymbol}{booking.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* ── SETTINGS TAB ─────────────────────────────────────────────────── */}
        {activeSection === 'settings' && (
          <motion.section
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-lg mx-auto bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-xl border border-gray-100 dark:border-zinc-800 ambient-shadow space-y-6"
          >
            <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-4">
              <Key size={18} className="text-brand-gold" /> Change Owner Password
            </h2>

            <p className="text-xs text-gray-400 leading-relaxed">
              Your password protects the Owner Suite from accidental access. Choose something memorable that only you know.
            </p>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Current Password</label>
                <input type="password" value={currentPwd} onChange={(e) => { setCurrentPwd(e.target.value); setPwdMessage(null); }}
                  placeholder="Enter current password"
                  className="w-full text-sm p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">New Password</label>
                <input type="password" value={newPwd} onChange={(e) => { setNewPwd(e.target.value); setPwdMessage(null); }}
                  placeholder="Minimum 6 characters"
                  className="w-full text-sm p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Confirm New Password</label>
                <input type="password" value={confirmPwd} onChange={(e) => { setConfirmPwd(e.target.value); setPwdMessage(null); }}
                  placeholder="Re-enter new password"
                  className="w-full text-sm p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all" />
              </div>

              {/* Message feedback */}
              <AnimatePresence>
                {pwdMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-xs font-semibold px-3 py-2 rounded-lg ${
                      pwdMessage.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-50 dark:bg-red-950/20 text-red-500'
                    }`}
                  >
                    {pwdMessage.text}
                  </motion.p>
                )}
              </AnimatePresence>

              <button type="submit" disabled={!currentPwd || !newPwd || !confirmPwd}
                className="w-full flex items-center justify-center gap-2 py-3 bg-brand-gold hover:bg-amber-500 disabled:bg-gray-100 disabled:dark:bg-zinc-800 text-brand-dark disabled:text-gray-400 rounded-lg font-bold text-xs uppercase tracking-widest transition-all disabled:cursor-not-allowed">
                <Save size={14} /> Update Password
              </button>
            </form>

            {/* CSV Export shortcut in settings too */}
            <div className="border-t border-gray-100 dark:border-zinc-800 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Data Export</h3>
              <p className="text-[11px] text-gray-400 mb-3">
                Download all client bookings as a CSV file. Open it in Google Sheets or Microsoft Excel.
              </p>
              <button onClick={handleCSVDownload} disabled={bookings.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold hover:bg-amber-500 text-brand-dark rounded text-xs font-bold uppercase tracking-widest transition-all disabled:bg-gray-100 disabled:dark:bg-zinc-800 disabled:text-gray-400 disabled:cursor-not-allowed">
                <Download size={14} /> Download Bookings CSV ({bookings.length})
              </button>
            </div>
          </motion.section>
        )}

      </AnimatePresence>
    </motion.div>
  );
};
