/**
 * Genius Zone Model School (GZMS) – Complete Dynamic School Website & Management System
 * Balachowra, Badarganj, Rangpur, Bangladesh • Where Dreams Come True
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PromotionalPopup } from './components/common/PromotionalPopup';
import { AuthModal } from './components/common/AuthModal';
import { AttendanceScannerModal } from './components/scanner/AttendanceScannerModal';
import { AdmissionFormModal } from './components/public/AdmissionFormModal';
import { ResultSearchModal } from './components/public/ResultSearchModal';
import { PublicApplicationModal } from './components/public/PublicApplicationModal';
import { ChangePasswordModal } from './components/common/ChangePasswordModal';
import { GeminiChatbot } from './components/chat/GeminiChatbot';

import { HeroSection } from './components/public/HeroSection';
import { StatisticsSection } from './components/public/StatisticsSection';
import { AboutSection } from './components/public/AboutSection';
import { SpeechesSection } from './components/public/SpeechesSection';
import { NoticeBoardSection } from './components/public/NoticeBoardSection';
import { AdmissionNoticeSection } from './components/public/AdmissionNoticeSection';
import { CommitteeSection } from './components/public/CommitteeSection';
import { TeacherShowcase } from './components/public/TeacherShowcase';
import { AwardsSection } from './components/public/AwardsSection';
import { PublicGallery } from './components/public/PublicGallery';
import { ContactSection } from './components/public/ContactSection';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, toasts, isChangePasswordModalOpen, setIsChangePasswordModalOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'teacher' && <TeacherDashboard />}
        {activeTab === 'student' && <StudentDashboard />}

        {activeTab !== 'admin' && activeTab !== 'teacher' && activeTab !== 'student' && (
          <>
            <HeroSection />
            <StatisticsSection />
            <AboutSection />
            <SpeechesSection />
            <NoticeBoardSection />
            <AdmissionNoticeSection />
            <CommitteeSection />
            <TeacherShowcase />
            <AwardsSection />
            <PublicGallery />
            <ContactSection />
          </>
        )}
      </main>

      <Footer />

      {/* Global Interactive Modals & Widgets */}
      <PromotionalPopup />
      <AuthModal />
      <AttendanceScannerModal />
      <AdmissionFormModal />
      <ResultSearchModal />
      <PublicApplicationModal />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
      <GeminiChatbot />

      {/* Toast Notifications */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-left-4 duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-950 text-white border-emerald-500'
                : toast.type === 'error'
                ? 'bg-red-950 text-white border-red-500'
                : 'bg-blue-950 text-white border-blue-500'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span className="flex-1">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
