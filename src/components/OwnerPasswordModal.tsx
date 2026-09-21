import React, { useState, useEffect, useRef } from 'react';
import { Shield, X, Eye, EyeOff, Lock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OwnerPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ownerPassword: string;
}

export const OwnerPasswordModal: React.FC<OwnerPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  ownerPassword,
}) => {
  const [input, setInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the password field when modal opens
  useEffect(() => {
    if (isOpen) {
      setInput('');
      setError('');
      setAttempts(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ownerPassword) {
      setError('');
      onSuccess();
      setInput('');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      triggerShake();
      if (newAttempts >= 3) {
        setError(`Incorrect password. ${newAttempts} failed attempt${newAttempts > 1 ? 's' : ''}. Contact Geetha MUA admin.`);
      } else {
        setError('Incorrect password. Please try again.');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Card */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={
                shake
                  ? { opacity: 1, scale: 1, y: 0, x: [0, -10, 10, -8, 8, -4, 4, 0] }
                  : { opacity: 1, scale: 1, y: 0, x: 0 }
              }
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: shake ? 0.4 : 0.25, ease: 'easeOut' }}
              className="bg-white dark:bg-[#231e33] rounded-2xl border border-gray-100 dark:border-[#2e2845] shadow-2xl w-full max-w-sm p-8 relative"
              onKeyDown={handleKeyDown}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              {/* Icon + Title */}
              <div className="text-center space-y-4 mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 mx-auto">
                  <Shield size={28} className="text-brand-gold" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                    Owner Suite Access
                  </h2>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Enter the admin password to manage services,<br />edit content, and view all bookings.
                  </p>
                </div>
              </div>

              {/* Password Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600" />
                    <input
                      ref={inputRef}
                      type={showPassword ? 'text' : 'password'}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter password..."
                      className={`w-full pl-9 pr-10 py-3 text-sm rounded-lg border transition-all duration-200 bg-gray-50 dark:bg-[#2a2440] text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                        error
                          ? 'border-red-400 dark:border-red-700 focus:ring-red-300/30'
                          : 'border-gray-200 dark:border-[#3d3560] focus:ring-brand-gold/30 focus:border-brand-gold'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[11px] text-red-500 font-semibold flex items-center gap-1"
                      >
                        <span>⚠</span> {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-gold hover:bg-amber-500 disabled:bg-gray-100 disabled:dark:bg-[#2a2440] text-brand-dark disabled:text-gray-400 rounded-lg font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-md shadow-brand-gold/10 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  <Sparkles size={14} />
                  Enter Owner Suite
                </button>

                <p className="text-center text-[10px] text-gray-300 dark:text-zinc-600">
                  Password protected · Geetha MUA Admin Only
                </p>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

