import React, { useState, useEffect } from 'react';
import { Eye, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CookieBannerProps {
  onPrivacyClick: () => void;
}

export default function CookieBanner({ onPrivacyClick }: CookieBannerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isAccepted = localStorage.getItem('cookies_accepted');
    if (!isAccepted) {
      // Show with a brief delay for smoother UX
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookies_accepted', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-slate-800 z-50 text-left"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4.5 h-4.5 text-blue-400" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold tracking-wide uppercase text-slate-200">
                  Polityka Plików Cookie
                </h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-350 leading-relaxed mb-4">
                Nasza strona korzysta z niezbędnych plików cookie oraz pamięci lokalnej (localStorage) w celu zapamiętania Twoich preferencji i prawidłowego działania formularza rezerwacji.
              </p>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleAccept}
                  className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm focus:outline-none cursor-pointer text-center"
                >
                  Akceptuję wszystkie
                </button>
                <a
                  href="https://www.qjonathan.pl/polityka-prywatnosci"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 focus:outline-none cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Polityka</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
