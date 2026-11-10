/**
 * Hero Section for Genius Zone Model School (GZMS)
 * Royal blue & gold theme with action buttons and dynamic badges.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import {
  GraduationCap,
  Sparkles,
  Award,
  QrCode,
  Search,
  CheckCircle2,
  Users,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setIsAdmissionModalOpen, setIsResultModalOpen, setIsScannerModalOpen, t } = useApp();
  const settings = schoolStorage.getSettings();
  const students = schoolStorage.getStudents();
  const teachers = schoolStorage.getTeachers();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white py-16 sm:py-24 border-b-4 border-amber-400">
      {/* Decorative background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Action Buttons */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 bg-blue-800/80 border border-amber-400/60 rounded-full px-3.5 py-1 text-xs font-bold text-amber-300 shadow-sm backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('২০২৬ শিক্ষাবর্ষে ভর্তি চলছে • প্লে থেকে ৯ম শ্রেণী', 'Admissions Open 2026 • Play to Class 9')}</span>
            </div>

            {/* School Name & Titles */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {t(settings.schoolNameBangla, settings.schoolNameEnglish)}
              </h1>
              <p className="text-lg sm:text-xl font-bold text-amber-400 tracking-wide">
                {t(settings.taglineBangla, settings.taglineEnglish)}
              </p>
            </div>

            {/* Subtitle description */}
            <p className="text-sm sm:text-base text-blue-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t(
                'বদরগঞ্জ, রংপুরের একটি আধুনিক ও সৃজনশীল শিক্ষাপ্রতিষ্ঠান। নৈতিক মূল্যবোধ, তথ্যপ্রযুক্তিভিত্তিক ডিজিটাল ক্লাসরুম ও দক্ষ শিক্ষকমণ্ডলীর তত্ত্বাবধানে শিক্ষার্থীদের ভবিষ্যতের জন্য যোগ্য করে গড়ে তোলাই আমাদের লক্ষ্য।',
                'A pioneering digital model school in Badarganj, Rangpur dedicated to holistic character building, moral ethics, creative thinking, and 21st-century academic excellence.'
              )}
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => setIsAdmissionModalOpen(true)}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-6 py-3 rounded-xl text-sm shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-2 border border-amber-300 transform active:scale-95"
              >
                <GraduationCap className="w-5 h-5 text-blue-950" />
                <span>{t('অনলাইন ভর্তি আবেদন', 'Apply for Admission')}</span>
                <ArrowRight className="w-4 h-4 text-blue-950" />
              </button>

              <button
                onClick={() => setIsResultModalOpen(true)}
                className="bg-blue-800/80 hover:bg-blue-700/90 text-white font-bold px-5 py-3 rounded-xl text-sm border border-blue-400/40 shadow-sm transition-all flex items-center gap-2 backdrop-blur-xs"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>{t('ফলাফল ও মার্কশিট', 'Check Results')}</span>
              </button>

              <button
                onClick={() => setIsScannerModalOpen(true)}
                className="bg-slate-900/80 hover:bg-slate-900 text-amber-300 font-bold px-4 py-3 rounded-xl text-sm border border-amber-400/50 shadow-sm transition-all flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>{t('কিউআর হাজিরা', 'QR Scanner')}</span>
              </button>
            </div>

            {/* Badges bar */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-blue-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>{t('স্মার্ট কিউআর হাজিরা ও এসএমএস', 'Smart QR & Instant SMS')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{t('মেধাবীদের জন্য বিশেষ বৃত্তি', 'Merit Scholarship Facility')}</span>
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Card & Live Metric Box */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              {/* Main School Photo Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/80 bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"
                  alt="Genius Zone Model School Campus"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/30 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="bg-blue-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-blue-800/80">
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {t('প্রতিষ্ঠাতা ও পরিচালক বাণী', 'Director Message')}
                    </p>
                    <p className="text-xs text-slate-200 mt-1 italic line-clamp-2">
                      "{settings.directorSpeech.slice(0, 110)}..."
                    </p>
                    <p className="text-[11px] font-bold text-white mt-1.5 text-right">
                      — {settings.directorName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Stat Widget 1: Total Students */}
              <div className="absolute -top-5 -left-4 bg-white text-slate-900 p-3 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-black text-blue-950 leading-none block">
                    {students.length * 150}+
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    {t('শিক্ষার্থী', 'Active Students')}
                  </span>
                </div>
              </div>

              {/* Floating Stat Widget 2: 100% Pass Rate */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 p-3 rounded-2xl shadow-xl border border-amber-300 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-black leading-none block">১০০%</span>
                  <span className="text-[10px] font-bold text-slate-900 uppercase">
                    {t('পাসের সাফল্য', 'Board Success')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
