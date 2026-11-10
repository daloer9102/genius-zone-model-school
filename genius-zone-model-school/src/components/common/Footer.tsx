/**
 * Footer component for Genius Zone Model School (GZMS)
 * Includes official Bangladesh education links, contact information, and quick portals.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Shield,
  Heart,
  QrCode,
  FileCheck,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    t,
    setIsAuthModalOpen,
    setIsAdmissionModalOpen,
    setIsResultModalOpen,
    setIsScannerModalOpen,
    setActiveTab,
  } = useApp();

  const settings = schoolStorage.getSettings();

  const bdEduLinks = [
    { titleBn: 'শিক্ষা মন্ত্রণালয়', titleEn: 'Ministry of Education', url: 'https://moedu.gov.bd/' },
    { titleBn: 'মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (মাউশি)', titleEn: 'DSHE', url: 'https://dshe.gov.bd/' },
    { titleBn: 'প্রাথমিক শিক্ষা অধিদপ্তর', titleEn: 'DPE', url: 'https://dpe.gov.bd/' },
    { titleBn: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (এনসিটিবি)', titleEn: 'NCTB', url: 'https://nctb.gov.bd/' },
    { titleBn: 'বাংলাদেশ শিক্ষা বোর্ড ফলাফল', titleEn: 'Education Board Results', url: 'https://educationboard.gov.bd/' },
    { titleBn: 'ব্যানবেইস (BANBEIS)', titleEn: 'BANBEIS Bangladesh', url: 'https://banbeis.gov.bd/' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-900 border-2 border-amber-400 p-0.5 flex items-center justify-center shrink-0 overflow-hidden bg-white">
                {settings.logoUrl && !settings.logoUrl.includes('placeholder') ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.schoolNameEnglish}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <GraduationCap className="w-6 h-6 text-amber-400" />
                )}
              </div>
              <div>
                <h3 className="text-white font-black text-base leading-tight">
                  {t(settings.schoolNameBangla, settings.schoolNameEnglish)}
                </h3>
                <p className="text-xs text-amber-400 font-semibold">
                  {t(settings.taglineBangla, settings.taglineEnglish)}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t(
                'বদরগঞ্জ, রংপুরের একটি আধুনিক ও যুগোপযোগী আদর্শ শিক্ষাপ্রতিষ্ঠান। প্লে থেকে নবম শ্রেণী পর্যন্ত সৃজনশীল ও নৈতিক শিক্ষায় দীক্ষিত করার অনন্য ডিজিটাল বিদ্যাপীঠ।',
                'A modern progressive model school in Badarganj, Rangpur providing creative, digital, and value-based education from Play to Class 9.'
              )}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t('বালাচৌড়া, বদরগঞ্জ, রংপুর, বাংলাদেশ', 'Balachowra, Badarganj, Rangpur, Bangladesh')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:01308177171" className="hover:text-amber-300 font-bold">
                  01308177171
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:info.sbf21@gmail.com" className="hover:text-amber-300">
                  info.sbf21@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links & Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-amber-400 pl-2.5">
              {t('প্রয়োজনীয় লিংক ও সেবা', 'Portals & Quick Links')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setIsAdmissionModalOpen(true)}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span>
                  <span>{t('অনলাইন ভর্তি আবেদন ২০২৬', 'Online Admission 2026')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsResultModalOpen(true)}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span>
                  <span>{t('ফলাফল ও মার্কশিট অনুসন্ধান', 'Exam Results & Marksheet')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsScannerModalOpen(true)}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span>
                  <span>{t('স্মার্ট কিউআর হাজিরা স্ক্যানার', 'Smart QR Attendance Scanner')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('notices');
                    document.getElementById('notices')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span>
                  <span>{t('বিদ্যালয়ের নোটিশ বোর্ড', 'Notice Board')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span>
                  <span>{t('স্কুল ইভেন্ট ও ফটোগ্যালারি', 'Photo Gallery & Events')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Bangladesh Education Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-amber-400 pl-2.5">
              {t('জাতীয় শিক্ষা লিংকসমূহ', 'National Education Links')}
            </h4>
            <ul className="space-y-2 text-xs">
              {bdEduLinks.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 transition-colors flex items-center justify-between group"
                  >
                    <span>{t(item.titleBn, item.titleEn)}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Portal Logins & Security */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-amber-400 pl-2.5">
              {t('ব্যবহারকারী পোর্টাল লগইন', 'Secure Portal Access')}
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              {t(
                'শিক্ষার্থী, অভিভাবক, শিক্ষক ও প্রশাসনিক কর্মকর্তাদের জন্য পৃথক সুরক্ষিত লগইন পোর্টাল।',
                'Dedicated role-based portals for students, guardians, faculty, and school administration.'
              )}
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full bg-blue-900/90 hover:bg-blue-800 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 border border-blue-700 transition-all shadow-xs"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>{t('পোর্টাল লগইন করুন', 'Login to Dashboard')}</span>
              </button>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                <p className="font-semibold text-amber-400 mb-0.5">{t('জরুরি যোগাযোগ / হেল্পলাইন:', 'Helpline:')}</p>
                <p>০১৩০৮১৭৭১৭১ (অধ্যক্ষ / পরিচালনা দপ্তর)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Genius Zone Model School (GZMS). {t('সর্বস্বত্ব সংরক্ষিত।', 'All Rights Reserved.')}</p>
          <p className="flex items-center gap-1">
            <span>{t('কারিগরি সহযোগী:', 'Empowering Education at')}</span>
            <span className="font-bold text-slate-400">Balachowra, Badarganj, Rangpur</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
