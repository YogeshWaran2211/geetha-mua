import React from 'react';
import { Service } from '../types';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  services: Service[];
  onBookNow: (service?: Service) => void;
  currencySymbol: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  services,
  onBookNow,
  currencySymbol,
}) => {
  // Let's grab the traditional bridal as our primary look
  const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdQcZ9Kwnvg7AcCLMYlwkccLTLlra3Tplc0Ult0F6eN2ueqyJMumaalxT-wFMNb5qsS-wqcG0C41-n05VEikckvmCKMGTRBke70f0-fnkejbvMtyeuCEfB4P6uzznzEsMVv-9futo01FFicYemJUUfXeufoLNm-kOZM9Xnt1NgDC0RizrV5vIFlyVOafeogJEfK5TFt056MwFyXgfZTWXM2Z_obREgqGsYtI_0-MVwlB3n_TdDvxrsOc-ROD-IgXZV6oNFcNo_dKM';

  // Packages list with prices styled in premium checklist formats
  const packages = [
    {
      id: 'p1',
      name: 'Essential Elegance',
      price: 35000,
      features: [
        'Pre-wedding thorough consultation',
        'High Definition (HD) Bridal Makeup',
        'Premium mink lashes & hair extensions',
        'Premium saree draping & hair styling'
      ]
    },
    {
      id: 'p2',
      name: 'Signature Bridal Royalty',
      price: 65000,
      popular: true,
      features: [
        'Detailed bridal trial session included',
        'Flawless Airbrush or HD specialized makeup',
        'Exquisite hair styling & intricate saree draping',
        'Full premium customized touch-up kit',
        'Assistant MUA for 2 close family members'
      ]
    },
    {
      id: 'p3',
      name: 'The Royal Luxury Elixir',
      price: 120000,
      features: [
        'Dual-event coverage (Muhurtham & Reception)',
        'VIP luxury airbrush makeup application',
        'Saree pre-pleating & couture styling assistance',
        'Premium luxury lashes & customized fresh flowers',
        'On-site standby touch-up service for 6 hours',
        'Full family styling for up to 4 members'
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-16 pb-20"
    >
      {/* 1. Hero Cover Section */}
      <section className="relative w-full h-[550px] md:h-[680px] bg-zinc-900 overflow-hidden flex items-center justify-center rounded-2xl">
        <div className="absolute inset-0 z-0">
          <img
            alt="Geetha MUA Bridal Showcase"
            className="w-full h-full object-cover opacity-60 dark:opacity-40 transition-transform duration-1000 hover:scale-105"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl flex flex-col items-center space-y-6">
          <span className="font-sans text-xs md:text-sm text-brand-gold bg-white/10 dark:bg-black/40 px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md border border-white/20">
            Premium Makeup Artistry
          </span>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white font-bold leading-tight drop-shadow-md">
            Elevating Your <br />
            <span className="italic text-brand-gold">Natural Beauty</span>
          </h1>
          <p className="text-gray-200 text-sm md:text-lg max-w-xl font-light leading-relaxed">
            Crafting tailored, timeless, and flawless makeup masterpieces for weddings, editorials, and special occasions.
          </p>
          <button
            onClick={() => onBookNow()}
            className="mt-4 bg-brand-gold hover:bg-amber-500 text-brand-dark px-8 py-3.5 rounded text-xs uppercase tracking-widest font-bold transition-all duration-300 transform hover:scale-[1.03] shadow-lg shadow-amber-500/20"
          >
            Book Custom Consultation
          </button>
        </div>
      </section>

      {/* 2. Our Specialties Section */}
      <section className="px-4 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="font-serif text-2xl md:text-4xl text-gray-900 dark:text-white font-semibold">
            Our Specialties
          </h2>
          <div className="w-16 h-0.5 bg-brand-gold mx-auto"></div>
          <p className="text-gray-500 dark:text-zinc-400 max-w-xl mx-auto text-xs md:text-sm">
            Expertly crafted services customized by owner Geetha to deliver perfect, radiant perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white dark:bg-[#231e33] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-[#2e2845] transform hover:-translate-y-1.5"
            >
              <div className="h-64 w-full relative overflow-hidden bg-gray-200 dark:bg-[#2a2440]">
                <img
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={service.image}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full bg-brand-pink/95 text-brand-dark shadow-sm">
                    {service.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5 text-center space-y-3">
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-gold transition-colors duration-200">
                  {service.name}
                </h3>
                <p className="text-gray-500 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
                <div className="pt-2 flex justify-between items-center border-t border-gray-100 dark:border-[#2e2845] text-xs">
                  <span className="text-brand-gold font-bold">
                    From {currencySymbol}{service.fromPrice.toLocaleString()}
                  </span>
                  <span className="text-gray-400">
                    🕒 {service.duration} hrs
                  </span>
                </div>
                <button
                  onClick={() => onBookNow(service)}
                  className="w-full py-2 bg-brand-dark dark:bg-[#2a2440] hover:bg-brand-gold dark:hover:bg-brand-gold text-brand-gold dark:text-gray-200 hover:text-brand-dark dark:hover:text-brand-dark text-[10px] uppercase font-bold tracking-widest transition-colors duration-200"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Luxury Packages Horizontal Carousel */}
      <section className="bg-brand-pink/15 dark:bg-[#231e33]/40 py-16 px-4 -mx-4 md:-mx-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left space-y-2">
              <h2 className="font-serif text-2xl md:text-3xl text-gray-900 dark:text-white font-bold">
                Luxury Packages
              </h2>
              <p className="text-gray-500 dark:text-zinc-400 text-xs md:text-sm">
                Complete, bespoke beauty journeys designed for full-event splendor.
              </p>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-6 pt-2 gap-6 snap-x snap-mandatory hide-scrollbar">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`min-w-[290px] sm:min-w-[380px] max-w-[400px] snap-center bg-white dark:bg-[#231e33] p-6 md:p-8 rounded-xl shadow-sm border transition-all duration-300 flex flex-col justify-between ${
                  pkg.popular
                    ? 'border-brand-gold ring-2 ring-brand-gold/30 scale-[1.01] relative'
                    : 'border-gray-100 dark:border-[#2e2845]'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-brand-gold text-brand-dark text-[9px] uppercase font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg tracking-wider">
                    Most Popular
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                      {pkg.name}
                    </h4>
                    <p className="text-2xl font-bold text-brand-gold mt-1">
                      {currencySymbol}{pkg.price.toLocaleString()}
                    </p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-gray-600 dark:text-zinc-400">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={14} className="text-brand-gold shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => onBookNow({
                      id: pkg.id,
                      name: pkg.name,
                      category: 'Custom Package',
                      description: pkg.features.join(', '),
                      fromPrice: pkg.price,
                      duration: 4,
                      image: heroImage
                    })}
                    className={`w-full py-3 rounded text-xs uppercase tracking-widest font-bold transition-all duration-200 ${
                      pkg.popular
                        ? 'bg-brand-gold hover:bg-amber-500 text-brand-dark'
                        : 'bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark'
                    }`}
                  >
                    Select Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

