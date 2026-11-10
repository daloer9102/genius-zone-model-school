/**
 * Responsive Navigation Header for Genius Zone Model School (GZMS)
 * Royal blue theme with golden accents, mobile menu, and multi-role access.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  QrCode,
  LogIn,
  User as UserIcon,
  Globe,
  FileText,
  Search,
  Bell,
  Award,
  Shield,
  LogOut,
  KeyRound,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    activeRole,
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    setIsAuthModalOpen,
    setIsAdmissionModalOpen,
    setIsResultModalOpen,
    setIsApplicationModalOpen,
    setIsScannerModalOpen,
    setIsChangePasswordModalOpen,
    logout,
    t,
  } = useApp();

  const settings = schoolStorage.getSettings();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home' },
    { id: 'about', labelBn: 'আমাদের সম্পর্কে', labelEn: 'About Us' },
    { id: 'admission', labelBn: 'ভর্তি তথ্য', labelEn: 'Admission', action: () => setIsAdmissionModalOpen(true) },
    { id: 'results', labelBn: 'ফলাফল', labelEn: 'Results', action: () => setIsResultModalOpen(true) },
    { id: 'gallery', labelBn: 'ফটোগ্যালারি', labelEn: 'Photo Gallery' },
    { id: 'applications', labelBn: 'আবেদন পোর্টাল', labelEn: 'Applications', action: () => setIsApplicationModalOpen(true) },
    { id: 'notices', labelBn: 'নোটিশ বোর্ড', labelEn: 'Notice Board' },
    { id: 'contact', labelBn: 'যোগাযোগ', labelEn: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-blue-100">
      {/* Top Notification & Contact Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-blue-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('বালাচৌড়া, বদরগঞ্জ, রংপুর', 'Balachowra, Badarganj, Rangpur')}</span>
            </span>
            <a
              href="tel:01308177171"
              className="flex items-center gap-1.5 text-blue-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-amber-300">01308177171</span>
            </a>
            <a
              href="mailto:info.sbf21@gmail.com"
              className="hidden md:flex items-center gap-1.5 text-blue-200 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>info.sbf21@gmail.com</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Bengali/English Switcher */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 bg-blue-800/80 hover:bg-blue-700 text-white px-2.5 py-0.5 rounded-full border border-blue-600/60 transition-all text-[11px] font-medium"
              title="Toggle Language / ভাষা পরিবর্তন"
            >
              <Globe className="w-3 h-3 text-amber-300" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Attendance QR scanner shortcut */}
            <button
              onClick={() => setIsScannerModalOpen(true)}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-blue-950 px-2.5 py-0.5 rounded-full font-bold shadow-sm transition-all text-[11px]"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{t('কিউআর হাজিরা', 'QR Attendance')}</span>
            </button>

            {/* Auth status or login trigger */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="bg-blue-800/90 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-700">
                  {currentUser.role}
                </span>
                <button
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className="bg-blue-800/80 hover:bg-blue-700 text-amber-300 hover:text-white px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-600 flex items-center gap-1 transition-colors"
                  title={t('পাসওয়ার্ড পরিবর্তন করুন', 'Change your password')}
                >
                  <KeyRound className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">{t('পাসওয়ার্ড', 'Password')}</span>
                </button>
                <button
                  onClick={logout}
                  className="text-red-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors bg-red-950/40 hover:bg-red-900/60 px-2 py-0.5 rounded border border-red-800/50"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{t('লগআউট', 'Logout')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1 text-blue-100 hover:text-white font-medium text-[11px] bg-blue-800/40 hover:bg-blue-800/80 px-2 py-0.5 rounded border border-blue-700/50"
              >
                <LogIn className="w-3 h-3 text-amber-300" />
                <span>{t('লগইন পোর্টাল', 'Portal Login')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Brand & Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo badge with dynamic logo or fallback crest */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-900 to-blue-700 border-2 border-amber-400 p-0.5 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden bg-white">
            {settings.logoUrl && !settings.logoUrl.includes('placeholder') ? (
              <img
                src={settings.logoUrl}
                alt={settings.schoolNameEnglish || 'GZMS Logo'}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-blue-950 flex flex-col items-center justify-center text-amber-400">
                <GraduationCap className="w-6 h-6" />
                <span className="text-[8px] font-black tracking-tighter text-white">GZMS</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-blue-950 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
                {t(settings.schoolNameBangla, settings.schoolNameEnglish)}
              </h1>
              <span className="hidden sm:inline-block bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-amber-300">
                {settings.schoolShortName || 'GZMS'}
              </span>
            </div>
            <p className="text-xs font-semibold text-blue-600 mt-0.5">
              {t(settings.taglineBangla, settings.taglineEnglish)}
            </p>
          </div>
        </div>

        {/* Action Buttons & Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  setActiveTab(item.id);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-xs'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-slate-50'
              }`}
            >
              {language === 'bn' ? item.labelBn : item.labelEn}
            </button>
          ))}

          {/* Quick Apply Button */}
          <button
            onClick={() => setIsAdmissionModalOpen(true)}
            className="ml-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 border border-amber-400"
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-950" />
            <span>{t('ভর্তি আবেদন', 'Apply Now')}</span>
          </button>

          {/* Role dashboard buttons */}
          {currentUser && (
            <button
              onClick={() => {
                if (currentUser.role === 'ADMIN' || currentUser.role === 'STAFF') setActiveTab('admin');
                else if (currentUser.role === 'TEACHER') setActiveTab('teacher');
                else setActiveTab('student');
              }}
              className="ml-1.5 bg-blue-800 hover:bg-blue-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-amber-300" />
              <span>{t('ড্যাশবোর্ড', 'Dashboard')}</span>
            </button>
          )}
        </nav>

        {/* Mobile menu trigger button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setIsAdmissionModalOpen(true)}
            className="bg-amber-500 text-blue-950 font-bold px-2.5 py-1 rounded text-xs shadow-xs"
          >
            {t('ভর্তি', 'Apply')}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-3 shadow-xl space-y-1.5 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMobileMenuOpen(false);
                if (item.action) {
                  item.action();
                } else {
                  setActiveTab(item.id);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-900 flex items-center justify-between"
            >
              <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
              <span className="text-slate-400 text-xs">→</span>
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsScannerModalOpen(true);
              }}
              className="w-full bg-blue-50 text-blue-900 border border-blue-200 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-amber-600" />
              <span>{t('হাজিরা স্ক্যানার', 'QR Scanner')}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentUser) {
                  if (currentUser.role === 'ADMIN') setActiveTab('admin');
                  else if (currentUser.role === 'TEACHER') setActiveTab('teacher');
                  else setActiveTab('student');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="w-full bg-blue-900 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Shield className="w-4 h-4 text-amber-300" />
              <span>{currentUser ? t('ড্যাশবোর্ড', 'Dashboard') : t('লগইন পোর্টাল', 'Portal Login')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
