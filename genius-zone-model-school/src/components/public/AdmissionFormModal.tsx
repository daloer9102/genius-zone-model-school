/**
 * Dynamic Online Admission Form for Genius Zone Model School (GZMS)
 * Validates, registers sequential GZMS0001 reg number, and generates downloadable A4 PDF.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { generateAdmissionFormPDF } from '../../services/pdfGenerator';
import type { AdmissionApplication } from '../../types';
import {
  GraduationCap,
  X,
  Download,
  CheckCircle2,
  FileText,
  User,
  Home,
  Phone,
  Calendar,
  School,
  Sparkles,
} from 'lucide-react';

export const AdmissionFormModal: React.FC = () => {
  const { isAdmissionModalOpen, setIsAdmissionModalOpen, showToast, t } = useApp();

  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);

  // Form State
  const [studentNameBangla, setStudentNameBangla] = useState('');
  const [studentNameEnglish, setStudentNameEnglish] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [appliedClass, setAppliedClass] = useState('Class 1');
  const [session, setSession] = useState('2026');
  const [previousSchool, setPreviousSchool] = useState('');
  const [previousClass, setPreviousClass] = useState('');
  const [previousResultGpa, setPreviousResultGpa] = useState('');

  // Address
  const [village, setVillage] = useState('Balachowra');
  const [postOffice, setPostOffice] = useState('Badarganj');
  const [upazila, setUpazila] = useState('Badarganj');
  const [district, setDistrict] = useState('Rangpur');
  const [country, setCountry] = useState('Bangladesh');
  const [presentAddress, setPresentAddress] = useState('Balachowra, Badarganj, Rangpur');
  const [permanentAddress, setPermanentAddress] = useState('Balachowra, Badarganj, Rangpur');

  // Guardian
  const [fatherNameEnglish, setFatherNameEnglish] = useState('');
  const [motherNameEnglish, setMotherNameEnglish] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');

  if (!isAdmissionModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentNameEnglish.trim() || !fatherNameEnglish.trim() || !guardianPhone.trim()) {
      showToast(t('অনুগ্রহ করে প্রয়োজনীয় তথ্যসমূহ পূরণ করুন।', 'Please fill in all mandatory fields.'), 'error');
      return;
    }

    const newApp = schoolStorage.submitAdmissionApplication({
      appliedClass,
      session,
      studentNameBangla: studentNameBangla.trim(),
      studentNameEnglish: studentNameEnglish.trim().toUpperCase(),
      gender,
      dateOfBirth: dateOfBirth || '2015-01-01',
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
      previousSchool: previousSchool.trim(),
      previousClass: previousClass.trim(),
      previousResultGpa: previousResultGpa.trim(),
      village: village.trim(),
      postOffice: postOffice.trim(),
      upazila: upazila.trim(),
      district: district.trim(),
      country: country.trim(),
      fatherNameEnglish: fatherNameEnglish.trim().toUpperCase(),
      motherNameEnglish: motherNameEnglish.trim().toUpperCase(),
      guardianPhone: guardianPhone.trim(),
      altPhone: altPhone.trim(),
      presentAddress: presentAddress.trim(),
      permanentAddress: permanentAddress.trim(),
    });

    setSubmittedApp(newApp);
    showToast(t('ভর্তি আবেদন সফলভাবে জমা হয়েছে!', 'Admission application successfully submitted!'), 'success');
  };

  const handleDownloadPDF = () => {
    if (submittedApp) {
      generateAdmissionFormPDF(submittedApp);
    }
  };

  const resetAndClose = () => {
    setSubmittedApp(null);
    setIsAdmissionModalOpen(false);
  };

  const classList = [
    'Play Group',
    'Nursery',
    'Class 1',
    'Class 2',
    'Class 3',
    'Class 4',
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-600 my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-blue-950 font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                {t('অনলাইন ভর্তি আবেদন ফরম ২০২৬', 'Online Admission Application Form 2026')}
              </h3>
              <p className="text-[11px] text-amber-300">
                {t('জিনিয়াস জোন মডেল স্কুল • বদরগঞ্জ, রংপুর', 'Genius Zone Model School • Badarganj, Rangpur')}
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

        {/* Content: Form or Submission Confirmation */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {submittedApp ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">
                  {t('আবেদন সফলভাবে গৃহীত হয়েছে!', 'Application Submitted Successfully!')}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {t(
                    'আপনার আবেদনটি ডেটাবেসে সংরক্ষিত হয়েছে এবং প্রাতিষ্ঠানিক রেজিস্ট্রেশন নম্বর বরাদ্দ করা হয়েছে।',
                    'Your application has been logged with an official registration number.'
                  )}
                </p>
              </div>

              {/* Registration Number Card */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-blue-50 border-2 border-blue-200 text-left space-y-2">
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="text-xs font-semibold text-slate-600">{t('আবেদন ট্র্যাকিং আইডি:', 'Application ID:')}</span>
                  <span className="font-mono font-bold text-slate-900">{submittedApp.applicationId}</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="text-xs font-semibold text-slate-600">{t('বরাদ্দকৃত রেজিস্ট্রেশন নং:', 'Registration Number:')}</span>
                  <span className="font-mono text-base font-black text-blue-700">{submittedApp.regNumber}</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="text-xs font-semibold text-slate-600">{t('আবেদনকৃত শ্রেণী:', 'Applied Class:')}</span>
                  <span className="font-bold text-slate-900">{submittedApp.appliedClass}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-600">{t('শিক্ষার্থীর নাম:', 'Student Name:')}</span>
                  <span className="font-bold text-slate-900">{submittedApp.studentNameEnglish}</span>
                </div>
              </div>

              {/* Download PDF Button */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>{t('ভর্তি ফরম ডাউনলোড করুন (A4 PDF)', 'Download Application (A4 PDF)')}</span>
                </button>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-xl text-xs"
                >
                  {t('বন্ধ করুন', 'Close')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Student Information */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5 pb-1 border-b border-blue-100">
                  <User className="w-4 h-4 text-amber-500" />
                  <span>১. শিক্ষার্থীর তথ্য (Student Details)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('শিক্ষার্থীর নাম (ইংরেজিতে BLOCK LETTERS) *', 'Student Name (English BLOCK LETTERS) *')}
                    </label>
                    <input
                      type="text"
                      required
                      value={studentNameEnglish}
                      onChange={(e) => setStudentNameEnglish(e.target.value.toUpperCase())}
                      placeholder="TANVIR AHMED"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-bold uppercase text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('শিক্ষার্থীর নাম (বাংলায়)', 'Student Name (Bangla)')}
                    </label>
                    <input
                      type="text"
                      value={studentNameBangla}
                      onChange={(e) => setStudentNameBangla(e.target.value)}
                      placeholder="তানভীর আহমেদ"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('আবেদনকৃত শ্রেণী *', 'Applying For Class *')}
                    </label>
                    <select
                      value={appliedClass}
                      onChange={(e) => setAppliedClass(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-semibold text-slate-900"
                    >
                      {classList.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('লিঙ্গ *', 'Gender *')}
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    >
                      <option value="Male">{t('ছাত্র (Male)', 'Male')}</option>
                      <option value="Female">{t('ছাত্রী (Female)', 'Female')}</option>
                      <option value="Other">{t('অন্যান্য (Other)', 'Other')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('জন্ম তারিখ (Date of Birth) *', 'Date of Birth *')}
                    </label>
                    <input
                      type="date"
                      required
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('শিক্ষাবর্ষ (Session)', 'Session')}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={session}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-100 font-bold text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Previous Academic Record */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5 pb-1 border-b border-blue-100">
                  <School className="w-4 h-4 text-amber-500" />
                  <span>২. পূর্ববর্তী শিক্ষাপ্রতিষ্ঠানের তথ্য (Previous Academic Info)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('পূর্ববর্তী বিদ্যালয়ের নাম', 'Previous School Name')}
                    </label>
                    <input
                      type="text"
                      value={previousSchool}
                      onChange={(e) => setPreviousSchool(e.target.value)}
                      placeholder="বদরগঞ্জ সরকারি প্রাথমিক বিদ্যালয়"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('বিগত পরীক্ষার ফলাফল/GPA', 'Previous GPA / Grade')}
                    </label>
                    <input
                      type="text"
                      value={previousResultGpa}
                      onChange={(e) => setPreviousResultGpa(e.target.value)}
                      placeholder="5.00 / A+"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Guardian Details */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5 pb-1 border-b border-blue-100">
                  <Phone className="w-4 h-4 text-amber-500" />
                  <span>৩. পিতা-মাতা ও অভিভাবকের তথ্য (Guardian Details)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t("পিতার নাম (BLOCK LETTERS) *", "Father's Name (BLOCK LETTERS) *")}
                    </label>
                    <input
                      type="text"
                      required
                      value={fatherNameEnglish}
                      onChange={(e) => setFatherNameEnglish(e.target.value.toUpperCase())}
                      placeholder="MD. ANWAR HOSSAIN"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-bold uppercase text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t("মাতার নাম (BLOCK LETTERS) *", "Mother's Name (BLOCK LETTERS) *")}
                    </label>
                    <input
                      type="text"
                      required
                      value={motherNameEnglish}
                      onChange={(e) => setMotherNameEnglish(e.target.value.toUpperCase())}
                      placeholder="ROKEYA BEGUM"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-bold uppercase text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('অভিভাবকের মোবাইল নম্বর *', 'Guardian Phone Number *')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('বিকল্প মোবাইল নম্বর', 'Alternative Phone')}
                    </label>
                    <input
                      type="tel"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                      placeholder="013XXXXXXXX"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Address */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5 pb-1 border-b border-blue-100">
                  <Home className="w-4 h-4 text-amber-500" />
                  <span>৪. ঠিকানা সংক্রান্ত তথ্য (Address Details)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('গ্রাম / পাড়া', 'Village')}
                    </label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('ডাকঘর', 'Post Office')}
                    </label>
                    <input
                      type="text"
                      value={postOffice}
                      onChange={(e) => setPostOffice(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('উপজেলা / থানা', 'Upazila / Thana')}
                    </label>
                    <input
                      type="text"
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('জেলা', 'District')}
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('বর্তমান ঠিকানা (পূর্ণাঙ্গ)', 'Present Address')}
                  </label>
                  <input
                    type="text"
                    value={presentAddress}
                    onChange={(e) => setPresentAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span>{t('আবেদন জমা দিন এবং PDF ডাউনলোড করুন', 'Submit & Generate PDF')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
