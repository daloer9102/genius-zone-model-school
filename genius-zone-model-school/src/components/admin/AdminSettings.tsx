/**
 * School Settings & Content Management Module for Genius Zone Model School (GZMS)
 * Allows director and administrator to modify school information, speeches, and settings.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import {
  Settings,
  Save,
  RotateCcw,
  Building,
  Phone,
  Mail,
  MapPin,
  Quote,
  Shield,
  CheckCircle2,
  KeyRound,
  Lock,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { showToast, setIsChangePasswordModalOpen, t } = useApp();
  const currentSettings = schoolStorage.getSettings();

  const [form, setForm] = useState(currentSettings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    schoolStorage.updateSettings(form);
    showToast(t('বিদ্যালয়ের তথ্য ও সেটিংস সফলভাবে সংরক্ষিত হয়েছে!', 'School settings successfully saved!'), 'success');
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all test data to initial defaults?')) {
      schoolStorage.resetToDefaults();
      setForm(schoolStorage.getSettings());
      showToast('All school database records have been reset to factory defaults.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic School Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {t('বিদ্যালয়ের মৌলিক তথ্যাবলী ও ব্র্যান্ডিং', 'School Identity & Branding')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('হেডার, ফুটার, হোমপেজ ব্যানার ও অফিশিয়াল নথিপত্রের লোগো এবং তথ্য', 'Live logo, taglines, headers, and official documents.')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                GZMS
              </span>
            </div>
          </div>

          {/* School Logo Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  {t('স্কুল অফিসিয়াল লোগো পরিবর্তন (Change School Logo)', 'School Official Logo')}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {t('ডিভাইস থেকে আপলোড করুন অথবা অনলাইন লিঙ্ক দিন। ওয়েবসাইট ও প্রবেশপত্রে তাৎক্ষণিক পরিবর্তিত হবে।', 'Upload from device or enter image URL. Changes reflect instantly on website and PDFs.')}
                </p>
              </div>
              {form.logoUrl && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, logoUrl: '/logo.svg' })}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-800 underline"
                >
                  {t('ডিফল্ট লোগোতে ফিরুন', 'Reset to Default')}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Logo Preview */}
              <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <img
                  src={form.logoUrl || '/logo.svg'}
                  alt="School Logo"
                  className="w-20 h-20 object-contain rounded-lg border border-slate-100"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = '/logo.svg';
                  }}
                />
                <span className="text-[10px] font-bold text-slate-500 mt-1">
                  {t('লাইভ প্রিভিউ', 'Live Preview')}
                </span>
              </div>

              {/* Upload Controls */}
              <div className="sm:col-span-9 space-y-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('ডিভাইস থেকে নতুন লোগো আপলোড (Upload Image File)', 'Upload Logo File')}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const result = ev.target?.result as string;
                        setForm({ ...form, logoUrl: result });
                        showToast(t('লোগো সফলভাবে লোড হয়েছে! সংরক্ষণ করতে "তথ্য সংরক্ষণ করুন" চাপুন।', 'Logo file loaded! Click Save to apply.'), 'info');
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-900 file:text-amber-300 hover:file:bg-blue-800 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    PNG, SVG, JPG, WebP সমর্থিত (স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে)
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('অথবা লোগোর সরাসরি লিঙ্ক (Logo Image URL)', 'Or Enter Logo Image URL')}
                  </label>
                  <input
                    type="url"
                    value={form.logoUrl?.startsWith('data:') ? '' : form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                    placeholder="https://example.com/school-logo.png"
                    className="w-full px-3 py-1.5 border rounded-xl font-mono text-[11px] text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">স্কুলের নাম (বাংলা)</label>
              <input
                type="text"
                required
                value={form.schoolNameBangla}
                onChange={(e) => setForm({ ...form, schoolNameBangla: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">School Name (English)</label>
              <input
                type="text"
                required
                value={form.schoolNameEnglish}
                onChange={(e) => setForm({ ...form, schoolNameEnglish: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900"
              />
            </div>

            {/* Taglines */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('বাংলা স্লোগান (Tagline Bangla)', 'Tagline (Bangla)')}
              </label>
              <input
                type="text"
                value={form.taglineBangla}
                onChange={(e) => setForm({ ...form, taglineBangla: e.target.value })}
                placeholder="যেখানে স্বপ্ন সত্যি হয়"
                className="w-full px-3 py-2 border rounded-xl font-bold text-blue-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('ইংরেজি স্লোগান (Tagline English)', 'Tagline (English)')}
              </label>
              <input
                type="text"
                value={form.taglineEnglish}
                onChange={(e) => setForm({ ...form, taglineEnglish: e.target.value })}
                placeholder="Where Dreams Come True"
                className="w-full px-3 py-2 border rounded-xl font-bold text-blue-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ফোন নম্বর (Phone / Helpline)</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-bold text-blue-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">অফিসিয়াল ইমেইল (Email)</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">ঠিকানা (Campus Address)</label>
              <input
                type="text"
                required
                value={form.addressEnglish}
                onChange={(e) => setForm({ ...form, addressEnglish: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Speeches & Signatures Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900">
              {t('প্রতিষ্ঠাতা পরিচালক ও সভাপতির বাণী', 'Director & President Speeches')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('হোমপেজ ও নথিপত্রে প্রদর্শিত হবে', 'Displayed on public website homepage.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">পরিচালকের নাম ও পদবি</label>
              <input
                type="text"
                value={form.directorName}
                onChange={(e) => setForm({ ...form, directorName: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">পরিচালকের স্বাক্ষর টেক্সট</label>
              <input
                type="text"
                value={form.directorSignature}
                onChange={(e) => setForm({ ...form, directorSignature: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-serif italic font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">পরিচালকের বাণী (Director Speech)</label>
              <textarea
                rows={3}
                value={form.directorSpeech}
                onChange={(e) => setForm({ ...form, directorSpeech: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">সভাপতির নাম ও পদবি</label>
              <input
                type="text"
                value={form.presidentName}
                onChange={(e) => setForm({ ...form, presidentName: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">সভাপতির স্বাক্ষর টেক্সট</label>
              <input
                type="text"
                value={form.presidentSignature}
                onChange={(e) => setForm({ ...form, presidentSignature: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-serif italic font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">সভাপতির বাণী (President Speech)</label>
              <textarea
                rows={3}
                value={form.presidentSpeech}
                onChange={(e) => setForm({ ...form, presidentSpeech: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Admin Password & Account Security Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-700" />
                <span>{t('অ্যাডমিন পাসওয়ার্ড ও নিরাপত্তা', 'Admin Account Security & Password')}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {t('অ্যাডমিন অ্যাকাউন্ট সুরক্ষিত রাখতে নিয়মিত পাসওয়ার্ড পরিবর্তন করুন।', 'Change your administrator password securely.')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>{t('পাসওয়ার্ড পরিবর্তন করুন', 'Change Password')}</span>
            </button>
          </div>
          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 text-xs text-amber-950 flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              {t(
                'সকল শিক্ষক ও শিক্ষার্থী তাদের নিজস্ব ড্যাশবোর্ড থেকেও নিজস্ব পাসওয়ার্ড পরিবর্তন করতে পারেন।',
                'Every student, teacher, and admin has self-service password change rights.'
              )}
            </span>
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={handleResetData}
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 p-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('ফ্যাক্টরি রিসেট (পুনরায় ডিফল্ট ডেটা লোড করুন)', 'Reset to Default Seed Data')}</span>
          </button>

          <button
            type="submit"
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{t('তথ্য সংরক্ষণ করুন', 'Save Settings')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
