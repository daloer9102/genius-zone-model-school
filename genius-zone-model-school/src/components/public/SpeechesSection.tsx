/**
 * Speeches Section for Genius Zone Model School (GZMS)
 * President's Speech and Founder & Director's Speech with photos and signatures.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { Quote, Sparkles } from 'lucide-react';

export const SpeechesSection: React.FC = () => {
  const { t } = useApp();
  const settings = schoolStorage.getSettings();

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            {t('দিকনির্দেশনামূলক বাণী', 'Leadership Messages')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-blue-950 mt-3 tracking-tight">
            {t('প্রতিষ্ঠাতা পরিচালক ও সভাপতির বাণী', 'Messages from Director & President')}
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Founder & Managing Director */}
          <div className="bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={settings.directorPhoto}
                  alt={settings.directorName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0"
                />
                <div>
                  <span className="inline-block bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-300 mb-1">
                    {t('প্রতিষ্ঠাতা ও পরিচালক', 'Founder & Director')}
                  </span>
                  <h3 className="text-lg font-black text-blue-950 leading-tight">
                    {settings.directorName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {settings.directorTitle}
                  </p>
                </div>
              </div>

              <div className="relative mb-6">
                <Quote className="w-8 h-8 text-blue-200 absolute -top-4 -left-2 -z-10 opacity-60" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{settings.directorSpeech}"
                </p>
              </div>
            </div>

            {/* Signature & Seal */}
            <div className="pt-4 border-t border-blue-100 flex items-center justify-between">
              <div className="text-left">
                <p className="font-serif italic font-bold text-blue-900 text-sm">
                  {settings.directorSignature || 'Delowar Hossain'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('প্রতিষ্ঠাতা ও পরিচালক, জিনিয়াস জোন', 'Founder & Director, GZMS')}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center text-[8px] font-bold text-amber-700 bg-amber-50">
                GZMS SEAL
              </div>
            </div>
          </div>

          {/* Card 2: President, School Managing Committee */}
          <div className="bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={settings.presidentPhoto}
                  alt={settings.presidentName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-600 shadow-md shrink-0"
                />
                <div>
                  <span className="inline-block bg-blue-100 text-blue-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-blue-300 mb-1">
                    {t('সভাপতি', 'President')}
                  </span>
                  <h3 className="text-lg font-black text-blue-950 leading-tight">
                    {settings.presidentName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {settings.presidentTitle}
                  </p>
                </div>
              </div>

              <div className="relative mb-6">
                <Quote className="w-8 h-8 text-amber-200 absolute -top-4 -left-2 -z-10 opacity-60" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{settings.presidentSpeech}"
                </p>
              </div>
            </div>

            {/* Signature & Seal */}
            <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
              <div className="text-left">
                <p className="font-serif italic font-bold text-amber-900 text-sm">
                  {settings.presidentSignature || 'Mostafizur Rahman'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('সভাপতি, পরিচালনা পরিষদ', 'President, Managing Committee')}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center text-[8px] font-bold text-blue-800 bg-blue-50">
                GZMS SEAL
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
