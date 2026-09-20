import React, { useState, useEffect } from 'react';
import { Service, BookingDetails } from '../types';
import { Calendar, Clock, User, Phone, Mail, FileText, ArrowRight, ArrowLeft, Check, Camera, Sparkles, Printer, CheckCircle2, Loader2, CloudOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveBookingToFirestore } from '../firebase';


interface BookingViewProps {
  services: Service[];
  preSelectedService?: Service | null;
  currencySymbol: string;
  onBookingSubmit: (booking: BookingDetails) => void;
  onBackToHome: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  services,
  preSelectedService,
  currencySymbol,
  onBookingSubmit,
  onBackToHome,
}) => {
  const [step, setStep] = useState(1);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [cloudSaved, setCloudSaved] = useState(false);

  // Client personal details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Event details
  const [selectedServiceId, setSelectedServiceId] = useState(preSelectedService?.id || services[0]?.id || 'custom');
  const [customEventName, setCustomEventName] = useState('');
  const [eventDate, setEventDate] = useState('2026-08-15');
  const [eventTime, setEventTime] = useState('06:00');
  const [inspirationUrl, setInspirationUrl] = useState('');

  // Package breakdown editable items (fully customized as requested)
  const [makeupPrice, setMakeupPrice] = useState<number>(25000);
  const [stylingPrice, setStylingPrice] = useState<number>(8000);
  const [travelPrice, setTravelPrice] = useState<number>(1500);
  const [earlyMorningPrice, setEarlyMorningPrice] = useState<number>(2000);

  // Synchronize base prices when service selection changes
  useEffect(() => {
    if (preSelectedService) {
      setSelectedServiceId(preSelectedService.id);
    }
  }, [preSelectedService]);

  useEffect(() => {
    const service = services.find(s => s.id === selectedServiceId);
    if (service) {
      setMakeupPrice(service.fromPrice);
      // Give styling price relative to service scale
      if (service.category === 'Bridal') {
        setStylingPrice(8000);
        setEarlyMorningPrice(2000);
      } else {
        setStylingPrice(4000);
        setEarlyMorningPrice(0);
      }
    } else if (selectedServiceId === 'custom') {
      setMakeupPrice(10000);
      setStylingPrice(3000);
    }
  }, [selectedServiceId, services]);

  // Calculate live Grand Total
  const grandTotal = makeupPrice + stylingPrice + travelPrice + earlyMorningPrice;

  // Simulate premium recalculation visual trigger
  const handlePriceFieldChange = (setter: (val: number) => void, valStr: string) => {
    const val = parseFloat(valStr) || 0;
    setter(val);
    setIsRecalculating(true);
    setTimeout(() => setIsRecalculating(false), 250);
  };

  const handleNextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Package submission
      const activeService = services.find(s => s.id === selectedServiceId);
      const packageLabel = activeService
        ? activeService.name
        : customEventName || 'Custom Artistry Session';

      const bookingData: BookingDetails = {
        id: `BK-${Date.now()}`,
        bookedAt: new Date().toISOString(),
        packageName: packageLabel,
        firstName,
        lastName,
        phone,
        email,
        eventType: packageLabel,
        amount: grandTotal,
        inspirationImage: inspirationUrl || undefined,
        selectedServices: [
          {
            id: 'item-mu',
            name: `${activeService ? activeService.name : 'Custom'} Makeup`,
            category: activeService ? activeService.category : 'Artistry',
            price: makeupPrice,
          },
          {
            id: 'item-st',
            name: 'Hair Styling & Saree Draping',
            category: 'Styling',
            price: stylingPrice,
          }
        ],
        travelCharges: travelPrice,
        earlyMorningCharges: earlyMorningPrice,
        date: eventDate,
        time: eventTime,
      };

      // ── Save to Firestore + send email ─────────────────────────
      setIsSaving(true);
      setSaveError(null);
      try {
        await saveBookingToFirestore(bookingData);
        setCloudSaved(true);

      } catch (err) {
        console.error('Firestore save failed:', err);
        setSaveError('Could not save to cloud. Your booking is saved locally.');
        setCloudSaved(false);
      } finally {
        setIsSaving(false);
      }

      onBookingSubmit(bookingData);
      setStep(4); // Advance to receipt
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Predefined inspiration presets to help user click easily
  const inspirationPresets = [
    { name: 'Traditional South Indian', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIeinQ3T1I-M2PvfiPuMEohJPI549HWWZ86z7vX68XcSbZ-tYfvgiya9IyHWJTtbJm_tds5eo_bGEFHSR5bSwT4QxqoG7kBeEwNagkyr3drKS7g18AUJk4h8qiW36nKsU9vJ4hs2p5W-jXYPTNcWpOQPQVDhpqTgiJP4NFruIKXe3D6Og1hw149ez9h3DqR4qUngA66Bl-5zLeVi19cKZovgEE2ljHRq6DCle1JPW6RJUMM0j-oqTHlVPBb04lfuMszM_NEygICX4' },
    { name: 'Editorial Graphic', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5aADu2r8V0nG26vTugmMnClTp8BpxDpGWHkGmufLPifqfTrjK8AoJUgTFKULizN_iHEeBRWpmlDyVW4v_0T08YKxEw4HFr1NPMZoka_ZfT4C4ps3HWTn1kxvi_1s2eLHuCB85-Bohr61ZtLbGBpTSmLLkItYH8D0uW0sPkagA0Kwoz5_ayewq-x5BokyVHXJ1i5_7pOT3QIQGsoIlhNChXyrZZ010HmytrOfF4GsXkiHHryl1a20NS3xplEn187r4AiztOLHGMOE' },
    { name: 'Dewy Reception lehenga look', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1W3Of_IOjEQko6s-SaxKOCRA1WXuHimMAqKMDy_QM4JTPFKhZqZdzQdwOqaZo-kVUo2QvttbqSYj4dgY4oogfcaBJMoi2AasWJjI2NUvze_vmglsrRrtczRU52RpBYetlhZ9VlsuDULmmkWP7Ptr5Zrce4dA6vFiuew8i-JpLCte2CB1A7Xb5wJyu1pALPY7COQKy6hJWT68XgsPO49DoTQM2FjLKiXoBWhnIYbISg-cc9FbjKhuuGXrCkuSW4-60L-fNUl4eddI' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 pb-24">
      {/* Step Header */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white font-bold">
          Book Your Appointment
        </h1>
        {step < 4 && (
          <p className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-semibold">
            Step {step} of 3:{' '}
            {step === 1 && 'Personal Details'}
            {step === 2 && 'Event Details'}
            {step === 3 && 'Package Calculation Summary'}
          </p>
        )}

        {/* Beautiful Progress Timeline Indicator */}
        {step < 4 && (
          <div className="flex justify-center items-center gap-3 pt-4 max-w-xs mx-auto">
            <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-brand-gold' : 'bg-gray-200 dark:bg-zinc-800'}`} />
            <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-brand-gold' : 'bg-gray-200 dark:bg-zinc-800'}`} />
            <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-brand-gold' : 'bg-gray-200 dark:bg-zinc-800'}`} />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Personal details form */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-xl border border-gray-100 dark:border-zinc-800 ambient-shadow space-y-6"
          >
            <div className="border-b border-gray-100 dark:border-zinc-800 pb-4 mb-4">
              <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User size={18} className="text-brand-gold" /> Personal Details
              </h2>
              <p className="text-xs text-gray-400">Please provide your contact information to reserve a booking.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Geetha"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-200 dark:border-zinc-800 py-2 focus:border-brand-gold focus:outline-none text-gray-900 dark:text-white text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Lakshmi"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-200 dark:border-zinc-800 py-2 focus:border-brand-gold focus:outline-none text-gray-900 dark:text-white text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  required
                  placeholder="+91 1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-200 dark:border-zinc-800 py-2 pl-6 focus:border-brand-gold focus:outline-none text-gray-900 dark:text-white text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="geethalakshmi@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-200 dark:border-zinc-800 py-2 pl-6 focus:border-brand-gold focus:outline-none text-gray-900 dark:text-white text-sm transition-colors"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={handleNextStep}
                disabled={!firstName || !lastName || !phone || !email}
                className="inline-flex items-center gap-2 bg-brand-dark dark:bg-zinc-800 hover:bg-brand-gold disabled:bg-gray-100 disabled:dark:bg-zinc-800 text-brand-gold dark:text-gray-300 hover:text-brand-dark disabled:text-gray-400 py-3.5 px-8 rounded font-semibold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Event Details</span> <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Event Details Selection */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-xl border border-gray-100 dark:border-zinc-800 ambient-shadow space-y-6"
          >
            <div className="border-b border-gray-100 dark:border-zinc-800 pb-4 mb-4">
              <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar size={18} className="text-brand-gold" /> Event Details & Inspiration
              </h2>
              <p className="text-xs text-gray-400">Tell us about your event, preferred timing, and visual look.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Service/Event Category
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full border-b border-gray-200 dark:border-zinc-800 bg-transparent py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-brand-gold"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id} className="dark:bg-zinc-950">
                      {s.name} ({currencySymbol}{s.fromPrice.toLocaleString()}+)
                    </option>
                  ))}
                  <option value="custom" className="dark:bg-zinc-950">Custom Appointment</option>
                </select>
              </div>

              {selectedServiceId === 'custom' && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                    Custom Event Type Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engagement, Pre-shoot"
                    value={customEventName}
                    onChange={(e) => setCustomEventName(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-200 dark:border-zinc-800 py-2 focus:border-brand-gold focus:outline-none text-gray-900 dark:text-white text-sm transition-colors"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-200 dark:border-zinc-800 py-2 focus:border-brand-gold focus:outline-none text-gray-900 dark:text-white text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Preferred Setup Start Time
                </label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-200 dark:border-zinc-800 py-2 focus:border-brand-gold focus:outline-none text-gray-900 dark:text-white text-sm transition-colors"
                />
              </div>
            </div>

            {/* Inspiration Image Link Option (with preset suggestions) */}
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Camera size={14} className="text-brand-gold" /> Paste Inspiration Photo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or choose preset below"
                  value={inspirationUrl}
                  onChange={(e) => setInspirationUrl(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-200 dark:border-zinc-800 py-2 text-xs focus:border-brand-gold focus:outline-none text-gray-900 dark:text-white transition-colors"
                />
              </div>

              {/* Presets Grid */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Quick Select Preset Inspiration Look
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {inspirationPresets.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setInspirationUrl(preset.url)}
                      className={`relative border text-left p-1 rounded overflow-hidden aspect-[4/3] group transition-all duration-200 ${
                        inspirationUrl === preset.url
                          ? 'border-brand-gold ring-2 ring-brand-gold/30'
                          : 'border-gray-100 dark:border-zinc-800'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover rounded opacity-80"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] text-white text-center font-bold">
                          {preset.name}
                        </span>
                      </div>
                      {inspirationUrl === preset.url && (
                        <div className="absolute bottom-1 right-1 bg-brand-gold text-brand-dark p-0.5 rounded-full">
                          <Check size={10} className="stroke-[3px]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <button
                onClick={handlePrevStep}
                className="inline-flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 py-3.5 px-6 rounded font-semibold text-xs uppercase tracking-widest transition-all duration-200"
              >
                <ArrowLeft size={14} /> <span>Back</span>
              </button>

              <button
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 bg-brand-dark dark:bg-zinc-800 hover:bg-brand-gold text-brand-gold dark:text-gray-300 hover:text-brand-dark dark:hover:text-brand-dark py-3.5 px-8 rounded font-semibold text-xs uppercase tracking-widest transition-all duration-200"
              >
                <span>Calculate Package</span> <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Complete Package Summary and Calculation */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-xl border border-gray-100 dark:border-zinc-800 ambient-shadow space-y-8"
          >
            <div className="border-b border-gray-100 dark:border-zinc-800 pb-4 mb-4">
              <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText size={18} className="text-brand-gold" /> Customized Package Summary
              </h2>
              <p className="text-xs text-gray-400">
                Configure, customize, and edit the prices below. Total is recalculated instantly.
              </p>
            </div>

            {/* Editable Breakdown Grid */}
            <div className="space-y-6">
              {/* Makeup price edit */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-brand-pink text-brand-dark text-[9px] font-bold uppercase">
                      Artistry
                    </span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
                      Primary Makeup Artistry Price
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">Includes HD base makeup, false lashes, and contour design.</p>
                </div>
                <div className="flex items-center gap-2 w-32 ml-auto">
                  <span className="text-gray-400 font-bold">{currencySymbol}</span>
                  <input
                    type="number"
                    aria-label="Customize primary makeup fee"
                    value={makeupPrice}
                    onChange={(e) => handlePriceFieldChange(setMakeupPrice, e.target.value)}
                    className="w-full bg-transparent border-b border-brand-pink text-right focus:border-brand-gold focus:outline-none text-sm font-bold text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Hair/Draping edit */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 text-[9px] font-bold uppercase">
                      Styling
                    </span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
                      Saree Draping & Hair styling
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">Premium pre-pleating, styling, and extension placement.</p>
                </div>
                <div className="flex items-center gap-2 w-32 ml-auto">
                  <span className="text-gray-400 font-bold">{currencySymbol}</span>
                  <input
                    type="number"
                    aria-label="Customize styling fee"
                    value={stylingPrice}
                    onChange={(e) => handlePriceFieldChange(setStylingPrice, e.target.value)}
                    className="w-full bg-transparent border-b border-brand-pink text-right focus:border-brand-gold focus:outline-none text-sm font-bold text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Travel charges edit */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-1">
                    📍 Outstation Travel Charges
                  </span>
                  <p className="text-[11px] text-gray-400">Covers venue transport, tools conveyance, and travel time.</p>
                </div>
                <div className="flex items-center gap-2 w-32 ml-auto">
                  <span className="text-gray-400 font-bold">{currencySymbol}</span>
                  <input
                    type="number"
                    aria-label="Customize travel fee"
                    value={travelPrice}
                    onChange={(e) => handlePriceFieldChange(setTravelPrice, e.target.value)}
                    className="w-full bg-transparent border-b border-brand-pink text-right focus:border-brand-gold focus:outline-none text-sm font-bold text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Early Morning charges edit */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-1">
                    🌅 Early Morning surcharge (Before 6 AM)
                  </span>
                  <p className="text-[11px] text-gray-400">Applied for pre-dawn setup schedules or Muhurtham shifts.</p>
                </div>
                <div className="flex items-center gap-2 w-32 ml-auto">
                  <span className="text-gray-400 font-bold">{currencySymbol}</span>
                  <input
                    type="number"
                    aria-label="Customize early morning surcharge"
                    value={earlyMorningPrice}
                    onChange={(e) => handlePriceFieldChange(setEarlyMorningPrice, e.target.value)}
                    className="w-full bg-transparent border-b border-brand-pink text-right focus:border-brand-gold focus:outline-none text-sm font-bold text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Total Display Block with Recalculating overlay effect */}
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-zinc-800/40 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden border border-gray-100 dark:border-zinc-800">
              <div className="text-center md:text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gold block mb-1">
                  Estimated Grand Total
                </span>
                <span className="text-xs text-gray-400">All local taxes & licensing included.</span>
              </div>

              <div className="flex items-baseline font-serif text-3xl font-extrabold text-brand-dark dark:text-white">
                <span className="text-lg mr-1 text-brand-gold">{currencySymbol}</span>
                <span className={`transition-opacity duration-200 ${isRecalculating ? 'opacity-40' : 'opacity-100'}`}>
                  {grandTotal.toLocaleString()}
                </span>
                {isRecalculating && (
                  <Sparkles size={16} className="text-brand-gold ml-2 animate-spin shrink-0" />
                )}
              </div>
            </div>

            {/* Step Controls */}
            <div className="pt-6 flex justify-between">
              <button
                onClick={handlePrevStep}
                className="inline-flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 py-3.5 px-6 rounded font-semibold text-xs uppercase tracking-widest transition-all duration-200"
              >
                <ArrowLeft size={14} /> <span>Back</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-brand-gold hover:bg-amber-500 disabled:bg-amber-300 text-brand-dark py-3.5 px-8 rounded font-semibold text-xs uppercase tracking-widest transition-all duration-200 shadow-md shadow-brand-gold/10 disabled:cursor-wait"
              >
                {isSaving ? (
                  <><Loader2 size={14} className="animate-spin" /><span>Saving...</span></>
                ) : (
                  <><span>Confirm &amp; Reserve</span><Check size={14} /></>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Success & Invoice Print-ready Screen */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-xl border border-gray-100 dark:border-zinc-800 ambient-shadow space-y-8 text-center"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-2">
                <CheckCircle2 size={40} className="animate-bounce" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-gray-900 dark:text-white font-bold">
                Appointment Reserved!
              </h2>
              <p className="text-gray-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
                Thank you, <span className="font-bold text-gray-800 dark:text-gray-100">{firstName}</span>! Geetha MUA has received your request and will contact you shortly.
              </p>
              {/* Cloud save status */}
              {cloudSaved ? (
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  ☁️ Saved to cloud database
                </div>
              ) : saveError ? (
                <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-[11px] font-bold px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800">
                  <CloudOff size={11} /> {saveError}
                </div>
              ) : null}
            </div>

            {/* Print-ready Invoice Card */}
            <div className="text-left bg-gray-50 dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 max-w-xl mx-auto space-y-6 font-mono text-xs text-gray-800 dark:text-zinc-300">
              <div className="flex justify-between items-start border-b border-dashed border-gray-300 dark:border-zinc-800 pb-4">
                <div>
                  <h3 className="font-serif font-extrabold text-brand-gold text-sm tracking-wider">GEETHA MUA</h3>
                  <p className="text-[10px] text-gray-400 mt-1">High-End Minimalist Artistry</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">INVOICE #G{Math.floor(Math.random() * 9000) + 1000}</p>
                  <p className="text-gray-400">{eventDate} {eventTime}</p>
                </div>
              </div>

              {/* Client specifications */}
              <div className="space-y-1">
                <p><span className="text-gray-400">CLIENT:</span> {firstName} {lastName}</p>
                <p><span className="text-gray-400">PHONE :</span> {phone}</p>
                <p><span className="text-gray-400">EMAIL :</span> {email}</p>
              </div>

              {/* Inspiration Image block */}
              {inspirationUrl && (
                <div className="border border-gray-200 dark:border-zinc-800 rounded p-1 flex items-center gap-3">
                  <img src={inspirationUrl} alt="Inspiration Look" className="w-10 h-10 object-cover rounded" />
                  <div>
                    <p className="font-bold uppercase text-[9px] text-brand-gold">Inspiration Look Loaded</p>
                    <p className="text-[9px] text-gray-400 truncate max-w-[320px]">{inspirationUrl}</p>
                  </div>
                </div>
              )}

              {/* Price list itemisation */}
              <div className="space-y-2 border-t border-dashed border-gray-300 dark:border-zinc-800 pt-4">
                <div className="flex justify-between">
                  <span>Makeup Artistry Fee</span>
                  <span>{currencySymbol}{makeupPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hair & Saree Draping</span>
                  <span>{currencySymbol}{stylingPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport Surcharge</span>
                  <span>{currencySymbol}{travelPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Muhurtham / Surcharge</span>
                  <span>{currencySymbol}{earlyMorningPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Calculated Total */}
              <div className="flex justify-between items-center border-t border-dashed border-gray-300 dark:border-zinc-800 pt-4 font-bold text-sm">
                <span className="text-brand-gold uppercase tracking-wider">Estimated Total:</span>
                <span className="text-lg text-gray-900 dark:text-white">{currencySymbol}{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 dark:border-zinc-800 rounded hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-widest transition-colors duration-200"
              >
                <Printer size={14} /> Print / Save Receipt
              </button>

              <button
                onClick={onBackToHome}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-gold hover:bg-amber-500 text-brand-dark rounded text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-md shadow-brand-gold/10"
              >
                Return to Gallery
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
