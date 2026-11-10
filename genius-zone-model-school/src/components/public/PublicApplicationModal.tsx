/**
 * Unified Application Portal Modal for Students & Teachers
 * For Leave of Absence, Transfer Certificate, Fee Waiver, and Scholarships.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import type { StudentApplication } from '../../types';
import {
  FileText,
  X,
  Send,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const PublicApplicationModal: React.FC = () => {
  const { isApplicationModalOpen, setIsApplicationModalOpen, currentUser, showToast, t } = useApp();

  const [submittedApp, setSubmittedApp] = useState<StudentApplication | null>(null);

  const [applicantType, setApplicantType] = useState<'STUDENT' | 'TEACHER'>(
    currentUser?.role === 'TEACHER' ? 'TEACHER' : 'STUDENT'
  );
  const [applicantName, setApplicantName] = useState(currentUser?.nameEnglish || '');
  const [regOrUsername, setRegOrUsername] = useState(currentUser?.username || '');
  const [className, setClassName] = useState('Class 5');
  const [rollNumber, setRollNumber] = useState('0001');
  const [guardianPhone, setGuardianPhone] = useState(currentUser?.phone || '');
  const [category, setCategory] = useState<StudentApplication['category']>('Leave of Absence');
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  if (!isApplicationModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicantName.trim() || !regOrUsername.trim() || !reason.trim()) {
      showToast(t('অনুগ্রহ করে প্রয়োজনীয় তথ্যসমূহ প্রদান করুন।', 'Please fill in all required fields.'), 'error');
      return;
    }

    const app = schoolStorage.submitApplication({
      applicantType,
      applicantId: currentUser?.id || `user-${Date.now()}`,
      applicantName: applicantName.trim(),
      regOrUsername: regOrUsername.trim(),
      className,
      rollNumber,
      guardianPhone,
      category,
      subject: subject || `${category} Application`,
      reason: reason.trim(),
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });

    setSubmittedApp(app);
    showToast(t('আবেদনটি সফলভাবে জমা হয়েছে!', 'Application submitted successfully!'), 'success');
  };

  const resetAndClose = () => {
    setSubmittedApp(null);
    setIsApplicationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-600 my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-blue-950 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                {t('আবেদন পোর্টাল (ছুটি / ছাড়পত্র / বৃত্তি)', 'Unified Application Portal')}
              </h3>
              <p className="text-[11px] text-amber-300">
                {t('অনলাইন প্রাতিষ্ঠানিক দরখাস্ত দাখিল • GZMS Portal', 'Online Academic & Administrative Requests')}
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-full bg-blue-950/70 hover:bg-blue-950 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {submittedApp ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">
                  {t('আবেদনপত্র জমা সম্পন্ন হয়েছে!', 'Application Submitted!')}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {t('আপনার আবেদনটি স্কুল কর্তৃপক্ষের পর্যালোচনার জন্য জমা রাখা হয়েছে।', 'Your application is awaiting administrative review.')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('ট্র্যাকিং নম্বর:', 'Tracking No:')}</span>
                  <span className="font-mono font-bold text-blue-700">{submittedApp.applicationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('আবেদনের ধরন:', 'Category:')}</span>
                  <span className="font-bold text-slate-900">{submittedApp.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('আবেদনকারীর নাম:', 'Applicant:')}</span>
                  <span className="font-bold text-slate-900">{submittedApp.applicantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('স্ট্যাটাস:', 'Status:')}</span>
                  <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                    {submittedApp.status}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-xl text-xs"
              >
                {t('ঠিক আছে', 'OK, Close')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('আবেদনের ধরন (Category) *', 'Application Category *')}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StudentApplication['category'])}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-semibold text-slate-900"
                >
                  <option value="Leave of Absence">{t('ছুটির আবেদন (Leave of Absence)', 'Leave of Absence')}</option>
                  <option value="Transfer Certificate">{t('ছাড়পত্র / টিসি (Transfer Certificate)', 'Transfer Certificate')}</option>
                  <option value="Fee Waiver">{t('বেতন মওকুফের আবেদন (Fee Waiver)', 'Fee Waiver')}</option>
                  <option value="Scholarship">{t('বৃত্তি আবেদন (Scholarship)', 'Scholarship')}</option>
                  <option value="Other">{t('অন্যান্য প্রশাসনিক আবেদন (Other)', 'Other Application')}</option>
                </select>
              </div>

              {/* Applicant details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('আবেদনকারীর নাম *', 'Applicant Name *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Tanvir Ahmed"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('রেজিস্ট্রেশন নং / ইউজারনেম *', 'Reg No or Username *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={regOrUsername}
                    onChange={(e) => setRegOrUsername(e.target.value)}
                    placeholder="GZMS0001"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('শ্রেণী ও রোল', 'Class & Roll')}
                  </label>
                  <input
                    type="text"
                    value={`${className} (Roll: ${rollNumber})`}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('মোবাইল নম্বর', 'Phone Number')}
                  </label>
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              {/* Date range for leave */}
              {category === 'Leave of Absence' && (
                <div className="grid grid-cols-2 gap-3 bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <div>
                    <label className="block text-[11px] font-bold text-blue-900 mb-1">
                      {t('ছুটি শুরুর তারিখ', 'From Date')}
                    </label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-900 mb-1">
                      {t('ছুটি শেষের তারিখ', 'To Date')}
                    </label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('আবেদনের বিষয় (Subject)', 'Application Subject')}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="জরুরি পারিবারিক কারণে ৩ দিনের ছুটির আবেদন"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('বিস্তারিত কারণ ও বিবরণ *', 'Detailed Reason / Statement *')}
                </label>
                <textarea
                  rows={4}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="জনাব, বিনীত নিবেদন এই যে..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('দরখাস্ত জমা দিন', 'Submit Application')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
