/**
 * About Our School Section for Genius Zone Model School (GZMS)
 * History, Vision, Mission, Educational Philosophy, Facilities, Teaching Methods, and Achievements.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Target,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  Cpu,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { t } = useApp();

  const facilities = [
    {
      titleBn: 'মাল্টিমিডিয়া ডিজিটাল ক্লাসরুম',
      titleEn: 'Multimedia Digital Classrooms',
      descBn: 'প্রজেক্টর ও ইন্টারঅ্যাকটিভ স্মার্ট প্যানেলের মাধ্যমে ভিজ্যুয়াল লার্নিং।',
      descEn: 'Engaging interactive visual learning with projectors and modern audio-visual tools.',
      icon: Cpu,
    },
    {
      titleBn: 'স্মার্ট কিউআর হাজিরা ও এসএমএস',
      titleEn: 'Smart QR Attendance & SMS',
      descBn: 'প্রতিদিন সকাল ৯:২০ মিনিটে অনুপস্থিত শিক্ষার্থীদের অভিভাবকদের তাৎক্ষণিক নোটিফিকেশন।',
      descEn: 'Automatic daily guardian SMS alerts dispatched at 09:20 AM for absent pupils.',
      icon: ShieldCheck,
    },
    {
      titleBn: 'অভিজ্ঞ ও প্রশিক্ষণপ্রাপ্ত শিক্ষক',
      titleEn: 'Highly Qualified Faculty',
      descBn: 'বিশ্ববিদ্যালয় উত্তীর্ণ নিবেদিতপ্রাণ শিক্ষকমণ্ডলী দ্বারা পাঠদান।',
      descEn: 'Passionate university graduate teachers dedicated to child-centric development.',
      icon: BookOpen,
    },
    {
      titleBn: 'নৈতিক ও ধর্মীয় মূল্যবোধ',
      titleEn: 'Moral & Ethical Foundation',
      descBn: 'নিয়মিত নৈতিক পাঠ, শিষ্টাচার এবং চরিত্র গঠনের বিশেষ কর্মসূচি।',
      descEn: 'Structured moral lessons, respectful conduct, and character-building activities.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            {t('আমাদের পরিচিতি ও অঙ্গীকার', 'About Genius Zone')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-blue-950 mt-3 tracking-tight">
            {t('আদর্শ মানুষ গড়ার অনন্য ডিজিটাল শিক্ষাঙ্গন', 'Pioneering Human Excellence Through Value-Based Education')}
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mt-3 rounded-full" />
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            {t(
              'জিনিয়াস জোন মডেল স্কুল (GZMS) রংপুর জেলার বদরগঞ্জ উপজেলার বালাচৌড়ায় অবস্থিত একটি অনন্য আধুনিক শিক্ষাপ্রতিষ্ঠান। মুখস্থবিদ্যার গণ্ডি পেরিয়ে জ্ঞান, সৃজনশীলতা ও তথ্যপ্রযুক্তিতে সমৃদ্ধ আগামীর নেতৃত্ব গড়ে তোলাই আমাদের লক্ষ্য।',
              'Genius Zone Model School (GZMS), located at Balachowra, Badarganj, Rangpur, combines national curriculum rigor with cutting-edge digital infrastructure and deep moral ethos.'
            )}
          </p>
        </div>

        {/* Vision, Mission & Philosophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {/* Vision */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-2">
              {t('আমাদের রূপকল্প (Our Vision)', 'Our Vision')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'একটি শোষণমুক্ত, প্রগতিশীল এবং জ্ঞানভিত্তিক সমাজ গঠনে আত্মবিশ্বাসী, মানবিক গুণসম্পন্ন ও আধুনিক বিজ্ঞানমনস্ক প্রজন্মে রূপান্তর করা।',
                'To emerge as the premier progressive educational lighthouse inspiring students to attain their highest potential in academic, moral, and technological spheres.'
              )}
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-2">
              {t('আমাদের লক্ষ্য (Our Mission)', 'Our Mission')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'শিক্ষার্থীদের আনন্দময় পরিবেশে পাঠদান, নিয়মিত নিবিড় পর্যবেক্ষণ, দুর্বল শিক্ষার্থীদের জন্য রিমিডিয়াল ক্লাস এবং আধুনিক প্রযুক্তির বাস্তবসম্মত প্রয়োগ নিশ্চিত করা।',
                'To provide an joyful, nurturing, and disciplined learning environment where every child is personally mentored, intellectually empowered, and morally guided.'
              )}
            </p>
          </div>

          {/* Philosophy */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-2">
              {t('শিক্ষাদান দর্শন (Educational Philosophy)', 'Educational Philosophy')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                '"যেখানে স্বপ্ন সত্যি হয়" — প্রতিটি শিশুর মাঝে ঘুমিয়ে থাকা অপার সম্ভাবনাকে জাগ্রত করে তাকে সমাজে স্বাবলম্বী ও আলোকিত মানুষ হিসেবে প্রতিষ্ঠা করা।',
                '"Where Dreams Come True" — igniting the innate genius within every young mind with love, patience, scientific inquiry, and unyielding dedication.'
              )}
            </p>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {t('আধুনিক সুযোগ-সুবিধা', 'Modern Infrastructure & Facilities')}
            </span>
            <h3 className="text-2xl font-black mt-1">
              {t('কেন জিনিয়াস জোন মডেল স্কুল আপনার প্রথম পছন্দ?', 'Why Genius Zone Model School is the Best Choice for Your Child')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <div key={idx} className="bg-blue-900/50 border border-blue-800/80 rounded-2xl p-5 backdrop-blur-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-blue-950 flex items-center justify-center font-bold mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-amber-300 mb-1.5">
                    {t(fac.titleBn, fac.titleEn)}
                  </h4>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    {t(fac.descBn, fac.descEn)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
