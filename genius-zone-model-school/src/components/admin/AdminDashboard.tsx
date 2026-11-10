/**
 * Main Administrator Dashboard for Genius Zone Model School (GZMS)
 * Central command center for school management, admissions, fees, results, and SMS.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { AdminStudents } from './AdminStudents';
import { AdminAdmissions } from './AdminAdmissions';
import { AdminAttendance } from './AdminAttendance';
import { AdminFees } from './AdminFees';
import { AdminResults } from './AdminResults';
import { AdminAdmitCards } from './AdminAdmitCards';
import { AdminSMS } from './AdminSMS';
import { AdminSettings } from './AdminSettings';
import { AdminSupabaseSql } from './AdminSupabaseSql';
import { AdminExamControl } from './AdminExamControl';
import { AdminGallery } from './AdminGallery';
import {
  Shield,
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Award,
  FileCheck,
  MessageSquare,
  Settings,
  Database,
  ArrowLeft,
  QrCode,
  Bell,
  Smartphone,
  TrendingUp,
  BookOpen,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser, setActiveTab, setIsScannerModalOpen, t } = useApp();
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<
    | 'OVERVIEW'
    | 'STUDENTS'
    | 'ADMISSIONS'
    | 'ATTENDANCE'
    | 'FEES'
    | 'EXAM_CONTROL'
    | 'RESULTS'
    | 'ADMIT_CARDS'
    | 'GALLERY_ADMIN'
    | 'SMS'
    | 'SETTINGS'
    | 'SUPABASE_SQL'
  >('OVERVIEW');

  const students = schoolStorage.getStudents();
  const admissions = schoolStorage.getAdmissions();
  const payments = schoolStorage.getPayments();
  const teachers = schoolStorage.getTeachers();
  const attendance = schoolStorage.getAttendance();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayPresentCount = attendance.filter((a) => a.date === todayStr && a.status !== 'ABSENT').length;
  const pendingAdmissions = admissions.filter((a) => a.status === 'PENDING').length;
  const pendingPayments = payments.filter((p) => p.status === 'PENDING').length;
  const totalVerifiedFees = payments
    .filter((p) => p.status === 'APPROVED')
    .reduce((sum, p) => sum + p.amount, 0);

  const tabs = [
    { id: 'OVERVIEW', labelBn: 'একনজরে (Overview)', labelEn: 'Overview', icon: TrendingUp },
    { id: 'STUDENTS', labelBn: 'শিক্ষার্থী ব্যবস্থাপনা', labelEn: 'Students', icon: Users, count: students.length },
    { id: 'ADMISSIONS', labelBn: 'ভর্তি আবেদন', labelEn: 'Admissions', icon: GraduationCap, badge: pendingAdmissions },
    { id: 'ATTENDANCE', labelBn: 'ডিজিটাল হাজিরা ও SMS', labelEn: 'Attendance & SMS', icon: CalendarCheck },
    { id: 'FEES', labelBn: 'ফি ও বিকাশ ভেরিফিকেশন', labelEn: 'Fees & bKash', icon: CreditCard, badge: pendingPayments },
    { id: 'EXAM_CONTROL', labelBn: 'পরীক্ষা ও বিষয় বণ্টন', labelEn: 'Exam & Subjects', icon: BookOpen },
    { id: 'RESULTS', labelBn: 'ফলাফল প্রকাশ', labelEn: 'Exam Results', icon: Award },
    { id: 'ADMIT_CARDS', labelBn: 'প্রবেশপত্র (Admit Card)', labelEn: 'Admit Cards', icon: FileCheck },
    { id: 'GALLERY_ADMIN', labelBn: 'ফটোগ্যালারি আপলোড', labelEn: 'Photo Gallery', icon: ImageIcon },
    { id: 'SMS', labelBn: 'এসএমএস গেটওয়ে', labelEn: 'SMS Gateway', icon: Smartphone },
    { id: 'SETTINGS', labelBn: 'স্কুল সেটিংস ও বাণী', labelEn: 'Settings', icon: Settings },
    { id: 'SUPABASE_SQL', labelBn: 'সুপাবেস SQL ডেটাবেস', labelEn: 'Supabase SQL', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="p-2 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-blue-200 hover:text-white transition-colors"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ADMIN CONTROL PANEL
                </span>
                <span className="text-blue-300 text-xs font-semibold">
                  GZMS Management System
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {t('প্রশাসনিক ড্যাশবোর্ড • জিনিয়াস জোন মডেল স্কুল', 'Administration Command Center • GZMS')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-blue-950 font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>{t('হাজিরা স্ক্যানার', 'QR Scanner')}</span>
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto">
          <div className="flex gap-1 border-t border-blue-800/80 pt-2 pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAdminSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminSubTab(tab.id as typeof activeAdminSubTab)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                    isActive
                      ? 'bg-white text-blue-950 shadow-md scale-100 font-black'
                      : 'text-blue-200 hover:text-white hover:bg-blue-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-blue-300'}`} />
                  <span>{t(tab.labelBn, tab.labelEn)}</span>

                  {typeof tab.count !== 'undefined' && (
                    <span className="bg-blue-100 text-blue-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {tab.count}
                    </span>
                  )}
                  {Boolean(tab.badge && tab.badge > 0) && (
                    <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {activeAdminSubTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  {t('মোট শিক্ষার্থী', 'Students')}
                </span>
                <p className="text-2xl font-black text-blue-950 font-mono">{students.length}</p>
                <span className="text-[10px] text-emerald-600 font-semibold">{t('সক্রিয় প্রোফাইল', 'Active')}</span>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-xs">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-1">
                  {t('আজকের উপস্থিতি', 'Present Today')}
                </span>
                <p className="text-2xl font-black text-emerald-950 font-mono">{todayPresentCount}</p>
                <span className="text-[10px] text-emerald-700 font-semibold">QR Recorded</span>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-xs">
                <span className="text-[11px] font-bold text-amber-800 uppercase block mb-1">
                  {t('ভর্তি অপেক্ষমান', 'Pending Adm')}
                </span>
                <p className="text-2xl font-black text-amber-950 font-mono">{pendingAdmissions}</p>
                <span className="text-[10px] text-amber-700 font-semibold">{t('পর্যালোচনাধীন', 'Reviewing')}</span>
              </div>

              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 shadow-xs">
                <span className="text-[11px] font-bold text-purple-800 uppercase block mb-1">
                  {t('বিকাশ যাচাই', 'Pending Fee')}
                </span>
                <p className="text-2xl font-black text-purple-950 font-mono">{pendingPayments}</p>
                <span className="text-[10px] text-purple-700 font-semibold">{t('TrxID চেক করুন', 'Check TrxID')}</span>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-xs">
                <span className="text-[11px] font-bold text-blue-800 uppercase block mb-1">
                  {t('শিক্ষকমণ্ডলী', 'Faculty')}
                </span>
                <p className="text-2xl font-black text-blue-950 font-mono">{teachers.length}</p>
                <span className="text-[10px] text-blue-700 font-semibold">{t('নিযুক্ত শিক্ষক', 'Teachers')}</span>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-xs">
                <span className="text-[11px] font-bold text-amber-800 uppercase block mb-1">
                  {t('আদায়কৃত মোট ফি', 'Total Fee')}
                </span>
                <p className="text-lg font-black text-slate-900 font-mono leading-tight mt-1">
                  BDT {totalVerifiedFees.toLocaleString()}
                </p>
                <span className="text-[10px] text-amber-800 font-semibold">Verified</span>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveAdminSubTab('ADMISSIONS')}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-5 h-5 text-amber-700" />
                </div>
                <h3 className="font-black text-base text-slate-900 mb-1">
                  {t('অনলাইন ভর্তি আবেদন অনুমোদন', 'Admission Application Approvals')}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t(
                    'নতুন আবেদনকারীদের রোল ও রেজিস্ট্রেশন বরাদ্দ দিয়ে অভিনন্দন পত্র (PDF) ইস্যু করুন।',
                    'Review, approve, and generate congratulation letters for new applicants.'
                  )}
                </p>
              </div>

              <div
                onClick={() => setActiveAdminSubTab('FEES')}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="font-black text-base text-slate-900 mb-1">
                  {t('বিকাশ পেমেন্ট যাচাই ও মানি রিসিট', 'bKash Transaction Verification')}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t(
                    'শিক্ষার্থীদের প্রেরিত TrxID যাচাই করে অনুমোদন দিন এবং "PAID" সিলযুক্ত ফি চালান রসিদ তৈরি করুন।',
                    'Verify student TrxIDs and generate official fee receipts with red PAID stamp.'
                  )}
                </p>
              </div>

              <div
                onClick={() => setActiveAdminSubTab('ADMIT_CARDS')}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                  <FileCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="font-black text-base text-slate-900 mb-1">
                  {t('পরীক্ষার প্রবেশপত্র (Admit Card) প্রস্তুত', 'Generate Examination Admit Cards')}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t(
                    '৫টি বাংলা পরীক্ষার নিয়মাবলীসহ একক A4 পেজে প্রবেশপত্র প্রস্তুত ও ডাউনলোড করুন।',
                    'Batch or individually export single-page A4 admit cards with rules and signatures.'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeAdminSubTab === 'STUDENTS' && <AdminStudents />}
        {activeAdminSubTab === 'ADMISSIONS' && <AdminAdmissions />}
        {activeAdminSubTab === 'ATTENDANCE' && <AdminAttendance />}
        {activeAdminSubTab === 'FEES' && <AdminFees />}
        {activeAdminSubTab === 'EXAM_CONTROL' && <AdminExamControl />}
        {activeAdminSubTab === 'RESULTS' && <AdminResults />}
        {activeAdminSubTab === 'ADMIT_CARDS' && <AdminAdmitCards />}
        {activeAdminSubTab === 'GALLERY_ADMIN' && <AdminGallery />}
        {activeAdminSubTab === 'SMS' && <AdminSMS />}
        {activeAdminSubTab === 'SETTINGS' && <AdminSettings />}
        {activeAdminSubTab === 'SUPABASE_SQL' && <AdminSupabaseSql />}
      </div>
    </div>
  );
};
