/**
 * Admission Notice Section for Genius Zone Model School (GZMS)
 * Prominently presents session 2026 admission details, criteria, and CTA.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export const AdmissionNoticeSection: React.FC = () => {
  const { setIsAdmissionModalOpen, t } = useApp();

  const criteria = [
    { textBn: 'শিক্ষার্থীর ২ কপি পাসপোর্ট সাইজ রঙিন ছবি', textEn: '2 Passport Size Student Photographs' },
    { textBn: 'অনলাইন জন্ম নিবন্ধন সনদের ডিজিটাল কপি', textEn: 'Digital Online Birth Registration Certificate' },
    { textBn: 'পিতা ও মাতার জাতীয় পরিচয়পত্রের (NID) ফটোকপি', textEn: 'Parents National ID (NID) photocopies' },
    { textBn: 'পূর্ববর্তী বিদ্যালয়ের প্রশংসাপত্র / ছাড়পত্র (যদি থাকে)', textEn: 'Transfer Certificate / Previous Report Card (if applicable)' },
  ];

  return (
    <section id="admission" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border-2 border-amber-400">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-950" />
                <span>{t('ভর্তি বিজ্ঞপ্তি ২০২৬', 'Admission Circular 2026')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                {t(
                  'প্লে থেকে নবম শ্রেণী পর্যন্ত নতুন ভর্তি আবেদন শুরু হয়েছে',
                  'Enroll Today: Admissions Open for Play Group through Class 9'
                )}
              </h2>

              <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
                {t(
                  'জিনিয়াস জোন মডেল স্কুলে আপনার সন্তানের ভবিষ্যৎ সুরক্ষিত করুন। আধুনিক ডিজিটাল শ্রেণীকক্ষ, আন্তরিক ও দায়িত্বশীল শিক্ষক এবং সার্বক্ষণিক সিসিটিভি ও স্মার্ট কিউআর হাজিরা ব্যবস্থার মাধ্যমে আমরা নিশ্চিত করি মানসম্মত শিক্ষা।',
                  'Empower your child with 21st-century academic rigor, moral character, and joyful digital classrooms at Genius Zone Model School, Balachowra, Badarganj.'
                )}
              </p>

              {/* Requirements Checklist */}
              <div className="pt-2">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  {t('ভর্তির প্রয়োজনীয় কাগজপত্র:', 'Required Admission Documents:')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-100">
                  {criteria.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{t(c.textBn, c.textEn)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Card: Dates & Action */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-4">
              <div className="inline-block p-3 rounded-2xl bg-amber-400 text-blue-950 font-bold mb-1 shadow-md">
                <GraduationCap className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs text-blue-200 block uppercase font-bold tracking-wider">
                  {t('শিক্ষাবর্ষ', 'Academic Session')}
                </span>
                <span className="text-2xl font-black text-amber-300 font-mono">২০২৬ (2026)</span>
              </div>

              <div className="text-xs text-slate-200 border-y border-white/15 py-3 space-y-1">
                <p>
                  <span className="text-amber-300 font-bold">{t('আবেদন শেষ তারিখ:', 'Deadline:')}</span> ৩১ ডিসেম্বর ২০২৬
                </p>
                <p>
                  <span className="text-amber-300 font-bold">{t('ভর্তি সহায়তা:', 'Helpline:')}</span> 01308177171
                </p>
              </div>

              <button
                onClick={() => setIsAdmissionModalOpen(true)}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>{t('অনলাইন ফরম পূরণ করুন', 'Fill Admission Form Online')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
