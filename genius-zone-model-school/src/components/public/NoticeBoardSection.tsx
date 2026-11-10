/**
 * Notice Board Section for Genius Zone Model School (GZMS)
 * Displays latest notices with full details modal and instant official A4 PDF download.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { generateSchoolNoticePDF } from '../../services/pdfGenerator';
import type { SchoolNotice } from '../../types';
import {
  Bell,
  Calendar,
  Download,
  FileText,
  Eye,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const NoticeBoardSection: React.FC = () => {
  const { t } = useApp();
  const notices = schoolStorage.getNotices();
  const [selectedNotice, setSelectedNotice] = useState<SchoolNotice | null>(null);

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Admission':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Exam':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Urgent':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <section id="notices" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
              {t('বিজ্ঞপ্তি ও নোটিশ বোর্ড', 'Official Notice Board')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-blue-950 mt-2 tracking-tight">
              {t('সর্বশেষ বিদ্যালয় নোটিশ ও ঘোষণা', 'Latest School Circulars & Announcements')}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">
              {t('মোট প্রকাশিত নোটিশ:', 'Total Notices:')} {notices.length}
            </span>
          </div>
        </div>

        {/* Notices Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notices.slice(0, 3).map((notice, idx) => {
            const isFeatured = idx === 0 || notice.isImportantOnHomepage;
            return (
              <div
                key={notice.id}
                className={`bg-white rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                  isFeatured
                    ? 'border-2 border-blue-600 shadow-md ring-2 ring-blue-100'
                    : 'border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                        notice.category
                      )}`}
                    >
                      {notice.category}
                    </span>

                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-700" />
                      <span>{notice.publishDate}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 mb-2 line-clamp-2 leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {notice.summary || notice.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedNotice(notice)}
                    className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t('বিস্তারিত পড়ুন', 'Read More')}</span>
                  </button>

                  <button
                    onClick={() => generateSchoolNoticePDF(notice)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                    title="Download Official Notice PDF / নোটিশ পিডিএফ ডাউনলোড"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice Details Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-blue-950 px-2 py-0.5 rounded">
                    {selectedNotice.category} Notice
                  </span>
                  <h3 className="font-black text-base mt-1 text-white">
                    {t('বিদ্যালয়ের প্রাতিষ্ঠানিক নোটিশ', 'Official School Notice')}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="p-1.5 rounded-full bg-blue-950/70 hover:bg-blue-950 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-700" />
                    <span>{t('প্রকাশের তারিখ:', 'Published:')} {selectedNotice.publishDate}</span>
                  </span>
                  <span className="font-semibold text-blue-900">
                    {t('প্রাপক:', 'Audience:')} {selectedNotice.targetAudience}
                  </span>
                </div>

                <h4 className="text-lg font-black text-slate-900 leading-snug">
                  {selectedNotice.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedNotice.content}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{selectedNotice.authorDesignation}</p>
                    <p className="text-[10px] text-slate-500">Genius Zone Model School</p>
                  </div>

                  <button
                    onClick={() => generateSchoolNoticePDF(selectedNotice)}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>{t('অফিসিয়াল PDF ডাউনলোড', 'Download A4 Notice PDF')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
