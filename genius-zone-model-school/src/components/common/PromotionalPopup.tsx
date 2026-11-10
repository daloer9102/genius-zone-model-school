/**
 * Dynamic Promotional Popup Poster Component for GZMS
 * Displays dynamic school admission / event announcements.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { X, ExternalLink, Sparkles, GraduationCap } from 'lucide-react';

export const PromotionalPopup: React.FC = () => {
  const { isPopupVisible, dismissPopup, setIsAdmissionModalOpen, t } = useApp();
  const popup = schoolStorage.getPopupSettings();

  if (!isPopupVisible || !popup.isEnabled) return null;

  // Check date bounds
  const today = new Date().toISOString().split('T')[0];
  if (popup.startDate && today < popup.startDate) return null;
  if (popup.endDate && today > popup.endDate) return null;

  const handleClickBanner = () => {
    if (popup.externalLink === '#admission') {
      dismissPopup();
      setIsAdmissionModalOpen(true);
    } else if (popup.externalLink && popup.externalLink.startsWith('http')) {
      window.open(popup.externalLink, '_blank', 'noopener,noreferrer');
    } else {
      dismissPopup();
      setIsAdmissionModalOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-400 transform transition-all animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={dismissPopup}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors shadow-md"
          aria-label="Close promotional popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Poster Image */}
        <div
          onClick={handleClickBanner}
          className="relative h-64 sm:h-72 w-full cursor-pointer overflow-hidden group"
        >
          <img
            src={popup.bannerImageUrl}
            alt={popup.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/40 to-transparent" />

          {/* Banner Tag */}
          <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('বিশেষ ঘোষণা', 'Special Notice')}</span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="text-xl sm:text-2xl font-black drop-shadow-md text-amber-300 leading-tight">
              {popup.title}
            </h3>
            <p className="text-xs text-blue-100 mt-1 line-clamp-2 drop-shadow-xs">
              {popup.subtitle}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            {t('আসন সংখ্যা সীমিত! দেরি না করে আজই ভর্তি নিশ্চিত করুন।', 'Limited seats available. Secure admission today!')}
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={dismissPopup}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg"
            >
              {t('পরে দেখুন', 'Remind Later')}
            </button>
            <button
              onClick={handleClickBanner}
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-lg shadow-sm flex items-center justify-center gap-1.5 border border-amber-300 transition-all"
            >
              <GraduationCap className="w-4 h-4 text-blue-950" />
              <span>{t('এখনই আবেদন করুন', 'Apply Online')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
