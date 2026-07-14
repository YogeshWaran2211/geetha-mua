import React, { useState, useMemo } from 'react';
import { Service } from '../types';
import { Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesViewProps {
  services: Service[];
  onBookNow: (service: Service) => void;
  currencySymbol: string;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  onBookNow,
  currencySymbol,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Dynamically calculate unique categories in the services list
  const categories = useMemo(() => {
    const list = new Set(services.map((s) => s.category));
    return ['All', ...Array.from(list)];
  }, [services]);

  // Filter services dynamically
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12 max-w-7xl mx-auto px-4 pb-20"
    >
      {/* Search & Header Section */}
      <section className="text-center space-y-6">
        <h1 className="font-serif text-3xl md:text-5xl text-gray-900 dark:text-white font-bold">
          Our Services
        </h1>
        <div className="w-16 h-0.5 bg-brand-gold mx-auto"></div>
        
        {/* Modern Search Input */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search makeup services (e.g., Bridal, Airbrush, Reception)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-brand-gold text-white shadow-sm'
                  : 'bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-500 hover:text-brand-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Services Grid (Bento/Card Style) */}
      <section>
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
            <Sparkles size={40} className="mx-auto text-gray-300 dark:text-zinc-700 mb-4" />
            <p className="text-gray-500 dark:text-zinc-400 text-sm">
              No services found matching your query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={service.id}
                  className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-gray-100 dark:border-zinc-800 ambient-shadow hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="aspect-[4/5] w-full relative bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={service.image}
                      alt={service.name}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-zinc-900/95 text-brand-dark dark:text-white text-[10px] uppercase font-bold tracking-wider shadow-sm border border-gray-100 dark:border-zinc-800">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow justify-between text-center space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        {service.name}
                      </h3>
                      <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-brand-gold text-sm">
                          From {currencySymbol}{service.fromPrice.toLocaleString()}
                        </span>
                        <span className="text-gray-400 font-medium">
                          🕒 {service.duration} hrs
                        </span>
                      </div>

                      <button
                        onClick={() => onBookNow(service)}
                        className="w-full bg-brand-dark dark:bg-zinc-800 hover:bg-brand-gold text-brand-gold dark:text-gray-300 hover:text-brand-dark dark:hover:text-brand-dark font-semibold text-xs uppercase tracking-widest py-3 transition-all duration-200"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </motion.div>
  );
};
