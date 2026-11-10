/**
 * Global Application Context for Genius Zone Model School (GZMS)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole, Language } from '../types';
import { schoolStorage } from '../services/storage';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  activeRole: UserRole;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loginAs: (role: UserRole, customUser?: Partial<User>) => void;
  logout: () => void;

  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdmissionModalOpen: boolean;
  setIsAdmissionModalOpen: (open: boolean) => void;
  isResultModalOpen: boolean;
  setIsResultModalOpen: (open: boolean) => void;
  isApplicationModalOpen: boolean;
  setIsApplicationModalOpen: (open: boolean) => void;
  isScannerModalOpen: boolean;
  setIsScannerModalOpen: (open: boolean) => void;
  isChangePasswordModalOpen: boolean;
  setIsChangePasswordModalOpen: (open: boolean) => void;

  // Promotional Popup
  isPopupVisible: boolean;
  dismissPopup: () => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Translation helper
  t: (banglaText: string, englishText: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('GUEST');
  const [language, setLanguage] = useState<Language>('bn'); // Default to Bangla as requested
  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // Popup logic
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Check popup settings on load
    const popupSettings = schoolStorage.getPopupSettings();
    const hasSeen = sessionStorage.getItem('gzms_popup_seen');
    if (popupSettings.isEnabled && !hasSeen) {
      const timer = setTimeout(() => {
        setIsPopupVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissPopup = () => {
    setIsPopupVisible(false);
    sessionStorage.setItem('gzms_popup_seen', 'true');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const loginAs = (role: UserRole, customUser?: Partial<User>) => {
    let mockUser: User;
    if (role === 'ADMIN') {
      mockUser = {
        id: 'usr-admin',
        username: 'admin',
        nameBangla: 'মোঃ দেলোয়ার হোসেন (পরিচালক)',
        nameEnglish: 'Delowar Hossain (Director)',
        role: 'ADMIN',
        email: 'info.sbf21@gmail.com',
        phone: '01308177171',
      };
      setActiveTab('admin');
      showToast('লগইন সফল! অ্যাডমিন ড্যাশবোর্ডে স্বাগতম।', 'success');
    } else if (role === 'TEACHER') {
      mockUser = {
        id: 'usr-teacher-1',
        username: 'teacher.rafiq',
        nameBangla: 'মোঃ রফিকুল ইসলাম (প্রধান শিক্ষক)',
        nameEnglish: 'Md. Rafiqul Islam (Head Teacher)',
        role: 'TEACHER',
        email: 'rafiqul.gzms@gmail.com',
        phone: '01711223344',
        linkedTeacherId: 't-2',
      };
      setActiveTab('teacher');
      showToast('লগইন সফল! শিক্ষক পোর্টালে স্বাগতম।', 'success');
    } else if (role === 'STUDENT') {
      mockUser = {
        id: 'usr-std-1',
        username: 'GZMS0001',
        nameBangla: 'তানভীর আহমেদ',
        nameEnglish: 'Tanvir Ahmed',
        role: 'STUDENT',
        linkedStudentId: 's-1',
        phone: '01712998877',
      };
      setActiveTab('student');
      showToast('লগইন সফল! শিক্ষার্থী পোর্টালে স্বাগতম।', 'success');
    } else if (role === 'GUARDIAN') {
      mockUser = {
        id: 'usr-gdn-1',
        username: 'gdn.01712998877',
        nameBangla: 'মোঃ আনোয়ার হোসেন (অভিভাবক)',
        nameEnglish: 'Md. Anwar Hossain (Guardian)',
        role: 'GUARDIAN',
        linkedStudentId: 's-1',
        phone: '01712998877',
      };
      setActiveTab('student');
      showToast('লগইন সফল! অভিভাবক পোর্টালে স্বাগতম।', 'success');
    } else {
      mockUser = {
        id: 'usr-staff-1',
        username: 'staff.accountant',
        nameBangla: 'হিসাব রক্ষক',
        nameEnglish: 'Accounts Officer',
        role: 'STAFF',
      };
      setActiveTab('admin');
      showToast('লগইন সফল! স্টাফ পোর্টালে স্বাগতম।', 'success');
    }

    if (customUser) {
      mockUser = { ...mockUser, ...customUser };
    }

    setCurrentUser(mockUser);
    setActiveRole(mockUser.role);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveRole('GUEST');
    setActiveTab('home');
    showToast('লগআউট সফল হয়েছে।', 'info');
  };

  const t = (banglaText: string, englishText: string): string => {
    return language === 'bn' ? banglaText : englishText;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        loginAs,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdmissionModalOpen,
        setIsAdmissionModalOpen,
        isResultModalOpen,
        setIsResultModalOpen,
        isApplicationModalOpen,
        setIsApplicationModalOpen,
        isScannerModalOpen,
        setIsScannerModalOpen,
        isChangePasswordModalOpen,
        setIsChangePasswordModalOpen,
        isPopupVisible,
        dismissPopup,
        toasts,
        showToast,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
