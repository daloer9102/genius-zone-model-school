/**
 * Multi-Role Authentication Modal for Genius Zone Model School (GZMS)
 * Supports Admin, Teacher, Staff, Student, and Guardian logins with 1-click demo access.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import type { UserRole } from '../../types';
import {
  Shield,
  User,
  GraduationCap,
  Users,
  Briefcase,
  KeyRound,
  X,
  CheckCircle2,
  Lock,
  AlertCircle,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAs, showToast, t } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const userToVerify = username.trim() || selectedRole.toLowerCase();

    // Verify password if entered
    if (password) {
      const isValid = schoolStorage.verifyUserPassword(userToVerify, password);
      if (!isValid) {
        setAuthError(t('ভুল পাসওয়ার্ড! আপনি যদি পাসওয়ার্ড পরিবর্তন করে থাকেন তবে নতুনটি দিন (ডিফল্ট: 123456)।', 'Incorrect password! Please use your updated password or default 123456.'));
        return;
      }
    }

    loginAs(selectedRole, {
      username: userToVerify,
    });
  };

  const roles = [
    {
      role: 'ADMIN' as UserRole,
      titleBn: 'অ্যাডমিন',
      titleEn: 'Admin',
      icon: Shield,
      color: 'border-red-500 text-red-700 bg-red-50',
      demoUser: 'admin',
      demoNote: 'Full Control / সকল নিয়ন্ত্রণ',
    },
    {
      role: 'TEACHER' as UserRole,
      titleBn: 'শিক্ষক',
      titleEn: 'Teacher',
      icon: GraduationCap,
      color: 'border-blue-500 text-blue-700 bg-blue-50',
      demoUser: 'teacher.rafiq',
      demoNote: 'Attendance & Marks / হাজিরা ও মার্কস',
    },
    {
      role: 'STUDENT' as UserRole,
      titleBn: 'শিক্ষার্থী',
      titleEn: 'Student',
      icon: User,
      color: 'border-emerald-500 text-emerald-700 bg-emerald-50',
      demoUser: 'GZMS0001',
      demoNote: 'Results & Admit Card / ফলাফল ও প্রবেশপত্র',
    },
    {
      role: 'GUARDIAN' as UserRole,
      titleBn: 'অভিভাবক',
      titleEn: 'Guardian',
      icon: Users,
      color: 'border-amber-500 text-amber-700 bg-amber-50',
      demoUser: 'gdn.01712998877',
      demoNote: 'Progress & Fees / বেতন ও অগ্রগতি',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 text-white text-center relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-blue-950/60 hover:bg-blue-950 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-xl bg-blue-800/90 border border-amber-400 flex items-center justify-center text-amber-400 mb-2 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-black text-amber-300">
            {t('সুরক্ষিত পোর্টাল লগইন', 'Secure Portal Login')}
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            {t('জিনিয়াস জোন মডেল স্কুল ম্যানেজমেন্ট সিস্টেম', 'Genius Zone Model School Management System')}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r.role);
                    setUsername(r.demoUser);
                    setPassword('123456');
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs font-bold scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-blue-700' : 'text-slate-500'}`} />
                  <span className="text-xs">{t(r.titleBn, r.titleEn)}</span>
                </button>
              );
            })}
          </div>

          {/* Quick 1-Click Demo Login Button */}
          <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-amber-900 block">
                {t('দ্রুত পরীক্ষামূলক প্রবেশ:', 'Instant 1-Click Access:')}
              </span>
              <span className="text-amber-800 text-[11px]">
                {selectedRole} ({roles.find((r) => r.role === selectedRole)?.demoNote})
              </span>
            </div>
            <button
              onClick={() => loginAs(selectedRole)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs transition-transform active:scale-95"
            >
              {t('প্রবেশ করুন', 'Enter Now')}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {selectedRole === 'STUDENT'
                  ? t('রেজিস্ট্রেশন নম্বর (যেমন: GZMS0001)', 'Registration Number (e.g. GZMS0001)')
                  : selectedRole === 'GUARDIAN'
                  ? t('অভিভাবকের মোবাইল / শিক্ষার্থীর রেজিঃ', 'Guardian Phone or Student Reg No')
                  : t('ইউজারনেম বা ইমেইল', 'Username or Email')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    selectedRole === 'STUDENT'
                      ? 'GZMS0001'
                      : selectedRole === 'ADMIN'
                      ? 'admin'
                      : 'username'
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('পাসওয়ার্ড', 'Password')}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {t('ডিফল্ট ডেমো পাসওয়ার্ড: 123456', 'Default demo password: 123456')}
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>{t('লগইন করুন', 'Sign In')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
