/**
 * Awards & Honors Section for Genius Zone Model School (GZMS)
 * Student of the Week / Month and Teacher of the Month recognitions.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Trophy, Star, Sparkles, CheckCircle2 } from 'lucide-react';

export const AwardsSection: React.FC = () => {
  const { t } = useApp();

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            {t('সম্মাননা ও মেধার স্বীকৃতি', 'Merit & Recognition')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-blue-950 mt-3 tracking-tight">
            {t('সেরা শিক্ষার্থী ও মাসের সেরা শিক্ষক', 'Student of the Month & Teacher of the Month')}
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mt-3 rounded-full" />
          <p className="text-sm text-slate-600 mt-3">
            {t(
              'হাজিরা, পরীক্ষার ফলাফল, ক্লাসে সক্রিয় অংশগ্রহণ এবং হোমওয়ার্ক মূল্যায়নের ভিত্তিতে স্বয়ংক্রিয়ভাবে নির্বাচিত।',
              'Evaluated on digital attendance (30%), academic performance (35%), homework (20%), and participation (15%).'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Student of the Month */}
          <div className="bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 rounded-3xl p-6 border-2 border-amber-400 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              <span>{t('মাসের সেরা শিক্ষার্থী', 'Student of Month')}</span>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80"
                  alt="Tanvir Ahmed"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {t('তানভীর আহমেদ', 'Tanvir Ahmed')}
                  </h3>
                  <p className="text-xs font-bold text-blue-800">Class 5 • Roll: 0001</p>
                  <span className="text-[11px] font-mono font-bold text-slate-500">Reg: GZMS0001</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('ডিজিটাল হাজিরা:', 'Attendance:')}</span>
                  <span className="font-bold text-emerald-700">98.5% (A+)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('একাডেমিক গ্রেড:', 'Academic GPA:')}</span>
                  <span className="font-bold text-blue-700">GPA 5.00 (A+)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('হোমওয়ার্ক সম্পন্ন:', 'Homework Completion:')}</span>
                  <span className="font-bold text-amber-700">100% (Best)</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 italic">
                "{t('অসাধারণ একাগ্রতা ও পরীক্ষার সকল বিষয়ে সর্বোচ্চ নম্বরের জন্য নির্বাচিত।', 'Selected for outstanding consistency and exemplary discipline.')}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200 text-center">
              <span className="text-[11px] font-bold text-amber-900">
                {t('নভেম্বর ২০২৬ পুরস্কার বিজেতা', 'Awarded for: November 2026')}
              </span>
            </div>
          </div>

          {/* Card 2: Student of the Week */}
          <div className="bg-gradient-to-br from-blue-500/10 via-white to-blue-500/5 rounded-3xl p-6 border-2 border-blue-400 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-3 right-3 bg-blue-700 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-300" />
              <span>{t('সপ্তাহের সেরা শিক্ষার্থী', 'Student of Week')}</span>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80"
                  alt="Nusrat Jahan Mimi"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-sm"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {t('নুসরাত জাহান মিমি', 'Nusrat Jahan Mimi')}
                  </h3>
                  <p className="text-xs font-bold text-blue-800">Class 5 • Roll: 0002</p>
                  <span className="text-[11px] font-mono font-bold text-slate-500">Reg: GZMS0002</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-blue-200 shadow-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('ডিজিটাল হাজিরা:', 'Attendance:')}</span>
                  <span className="font-bold text-emerald-700">100% (On-Time)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('ক্লাস সক্রিয়তা:', 'Class Participation:')}</span>
                  <span className="font-bold text-blue-700">Excellent</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('হোমওয়ার্ক মান:', 'Homework Grade:')}</span>
                  <span className="font-bold text-amber-700">Best</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 italic">
                "{t('সপ্তাহের প্রতিটি ক্লাসে সক্রিয় অংশগ্রহণ ও চমৎকার হাতের লেখার জন্য স্বীকৃতি।', 'Recognized for 100% attendance and outstanding class participation.')}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-200 text-center">
              <span className="text-[11px] font-bold text-blue-900">
                {t('বর্তমান সপ্তাহ (চলতি মেধা তালিকা)', 'Current Week Star Award')}
              </span>
            </div>
          </div>

          {/* Card 3: Teacher of the Month */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-white to-emerald-500/5 rounded-3xl p-6 border-2 border-emerald-400 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-3 right-3 bg-emerald-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-300" />
              <span>{t('মাসের সেরা শিক্ষক', 'Teacher of Month')}</span>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
                  alt="Fatema Tuz Zohra"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {t('ফাতেমা তুজ জোহরা', 'Fatema Tuz Zohra')}
                  </h3>
                  <p className="text-xs font-bold text-emerald-800">
                    {t('সিনিয়র সহকারী শিক্ষক (ইংরেজি)', 'Senior Teacher (English)')}
                  </p>
                  <span className="text-[11px] font-medium text-slate-500">M.A in English, B.Ed</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-emerald-200 shadow-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('ক্লাস উপস্থিতি:', 'Class Attendance:')}</span>
                  <span className="font-bold text-emerald-700">100% Punctual</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('হোমওয়ার্ক মূল্যায়ন:', 'Homework Evaluation:')}</span>
                  <span className="font-bold text-blue-700">Rapid & Detailed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('পদ্ধতিগত সাফল্য:', 'Student Progress:')}</span>
                  <span className="font-bold text-amber-700">Outstanding</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 italic">
                "{t('ইন্টারেক্টিভ ইংরেজি ভাষা শিক্ষাদান ও শিক্ষার্থীদের বাড়তি যত্ন নেওয়ার জন্য প্রশংসিত।', 'Celebrated for innovative phonetics methodology and empathetic mentoring.')}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200 text-center">
              <span className="text-[11px] font-bold text-emerald-900">
                {t('কর্তৃপক্ষ কর্তৃক অনুমোদিত • নভেম্বর ২০২৬', 'Approved by Administration • Nov 2026')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
