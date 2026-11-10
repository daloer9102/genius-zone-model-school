/**
 * Universal Change Password Modal for Genius Zone Model School (GZMS)
 * Allows every student, teacher, and admin to change their own password.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import {
  KeyRound,
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Shield,
} from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, showToast, t } = useApp();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentPassword) {
      setErrorMessage(t('বর্তমান পাসওয়ার্ড দিন', 'Please enter your current password'));
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage(t('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে', 'New password must be at least 4 characters long'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t('নতুন পাসওয়ার্ড ও নিশ্চিতকরণ মেলেনি', 'New password and confirmation do not match'));
      return;
    }

    setIsLoading(true);

    // Verify current password against stored password
    const isCurrentValid = schoolStorage.verifyUserPassword(currentUser.username, currentPassword);
    if (!isCurrentValid) {
      setIsLoading(false);
      setErrorMessage(t('বর্তমান পাসওয়ার্ডটি সঠিক নয় (ডিফল্ট: 123456)', 'Current password is incorrect (Default is 123456)'));
      return;
    }

    // Update password in storage
    const success = schoolStorage.updateUserPassword(currentUser.username, newPassword);

    setIsLoading(false);
    if (success) {
      showToast(
        t('আপনার পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!', 'Password updated successfully!'),
        'success'
      );
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } else {
      setErrorMessage(t('পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে', 'Failed to update password.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold shadow-md">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base leading-tight">
                {t('পাসওয়ার্ড পরিবর্তন করুন', 'Change Password')}
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                {currentUser.nameEnglish || currentUser.username} ({currentUser.role})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-blue-800/60"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User identifier pill */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-700" />
              <span className="text-slate-600 font-semibold">{t('ইউজারনেম / আইডি:', 'Username / ID:')}</span>
            </div>
            <span className="font-mono font-bold text-blue-900 bg-blue-100/70 px-2.5 py-0.5 rounded-lg">
              {currentUser.username}
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('বর্তমান পাসওয়ার্ড (Current Password) *', 'Current Password *')}
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="ডিফল্ট: 123456"
                className="w-full pl-3 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('নতুন পাসওয়ার্ড (New Password) *', 'New Password *')}
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="কমপক্ষে ৪টি অক্ষর বা সংখ্যা"
                className="w-full pl-3 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password) *', 'Confirm New Password *')}
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="নতুন পাসওয়ার্ডটি পুনরায় লিখুন"
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              {t('বাতিল', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-400 text-amber-300 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{isLoading ? t('সংরক্ষণ হচ্ছে...', 'Saving...') : t('পাসওয়ার্ড সংরক্ষণ করুন', 'Save Password')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
