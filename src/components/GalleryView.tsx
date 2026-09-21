import React, { useState, useMemo } from 'react';
import { GalleryItem } from '../types';
import { Trash2, Plus, Image as ImageIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryViewProps {
  galleryItems: GalleryItem[];
  isOwnerMode: boolean;
  onAddGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  onDeleteGalleryItem: (id: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  galleryItems,
  isOwnerMode,
  onAddGalleryItem,
  onDeleteGalleryItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // State to manage addition form modal/inline toggle
  const [showAddForm, setShowAddForm] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Bridal');

  const categories = ['All', 'Bridal', 'Celebrity', 'Shoots', 'Editorial'];

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return galleryItems;
    return galleryItems.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [galleryItems, selectedCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) return;
    
    onAddGalleryItem({
      image: newImage,
      title: newTitle || 'Bespoke Transformation',
      category: newCategory,
    });

    // Reset Form
    setNewImage('');
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12 max-w-7xl mx-auto px-4 pb-20"
    >
      {/* Header Section */}
      <section className="text-center space-y-4">
        <h2 className="font-serif text-3xl md:text-5xl text-gray-900 dark:text-white font-bold">
          Portfolio Gallery
        </h2>
        <p className="text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto text-xs md:text-sm leading-relaxed">
          A premium showcase of flawless bridal makeovers, celebrity fashion shoots, and high-fashion editorial transformations.
        </p>
        <div className="w-16 h-0.5 bg-brand-gold mx-auto"></div>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-brand-gold text-white shadow-sm'
                : 'bg-white dark:bg-[#231e33] border border-gray-100 dark:border-[#2e2845] text-gray-500 hover:text-brand-gold'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Owner Dynamic Add Portfolio Trigger */}
      {isOwnerMode && (
        <div className="max-w-xl mx-auto p-5 bg-amber-500/10 dark:bg-amber-500/5 rounded-xl border border-brand-gold/30 text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            🔨 Owner Controls Active
          </p>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 bg-brand-dark dark:bg-[#2a2440] hover:bg-brand-gold dark:hover:bg-brand-gold text-brand-gold dark:text-gray-200 hover:text-brand-dark dark:hover:text-brand-dark px-5 py-2.5 rounded text-xs uppercase tracking-widest font-bold transition-all"
          >
            <Plus size={16} />
            {showAddForm ? 'Close Editor' : 'Add New Portfolio Photo'}
          </button>

          {/* Inline Addition Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="text-left bg-white dark:bg-[#231e33] p-5 rounded-lg border border-gray-200 dark:border-[#2e2845] space-y-4 mt-3">
              <h3 className="font-serif text-sm font-bold text-gray-900 dark:text-white">
                New Portfolio Entry Details
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-400 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 dark:border-[#2e2845] rounded bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-gold"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-400 mb-1">
                      Label / Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Classic Bridal Glam"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full text-xs p-2.5 border border-gray-200 dark:border-[#2e2845] rounded bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-400 mb-1">
                      Category Tab
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full text-xs p-2.5 border border-gray-200 dark:border-[#2e2845] rounded bg-white dark:bg-[#231e33] dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    >
                      <option value="Bridal">Bridal</option>
                      <option value="Celebrity">Celebrity</option>
                      <option value="Shoots">Shoots</option>
                      <option value="Editorial">Editorial</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-gold text-brand-dark py-2 rounded text-xs uppercase tracking-widest font-bold hover:bg-amber-500 transition-colors"
              >
                Insert Photo Live
              </button>
            </form>
          )}
        </div>
      )}

      {/* Masonry / Grid Container */}
      <section className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              className="break-inside-avoid relative group rounded-xl overflow-hidden bg-gray-50 dark:bg-[#231e33] border border-gray-100 dark:border-[#2e2845] shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
            >
              <img
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
              />

              {/* Elegant Text Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="inline-block px-2.5 py-0.5 bg-brand-pink text-brand-dark rounded-full font-sans text-[9px] uppercase font-bold mb-1.5 w-max">
                  {item.category}
                </span>
                <h3 className="font-serif text-sm md:text-base font-bold text-white">
                  {item.title}
                </h3>
              </div>

              {/* Static overlay header tag */}
              <div className="absolute top-3 left-3 bg-white/80 dark:bg-black/80 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/20">
                <span className="text-[9px] uppercase font-bold tracking-wider text-gray-700 dark:text-gray-300">
                  {item.category}
                </span>
              </div>

              {/* Owner Delete Trigger overlay */}
              {isOwnerMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this photo from portfolio gallery?')) {
                      onDeleteGalleryItem(item.id);
                    }
                  }}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                  title="Remove from gallery"
                  aria-label="Delete image"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </section>
    </motion.div>
  );
};

