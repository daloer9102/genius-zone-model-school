/**
 * Admin Admission Management Module for Genius Zone Model School (GZMS)
 * Review submissions, approve/reject, assign class & roll, and generate congratulation letter PDF.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { generateAdmissionFormPDF, generateCongratulationLetterPDF } from '../../services/pdfGenerator';
import type { AdmissionApplication } from '../../types';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  X,
  Award,
  Sparkles,
} from 'lucide-react';

export const AdminAdmissions: React.FC = () => {
  const { showToast, t } = useApp();
  const admissions = schoolStorage.getAdmissions();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);

  // Approval Modal fields
  const [approvalModalApp, setApprovalModalApp] = useState<AdmissionApplication | null>(null);
  const [assignedClass, setAssignedClass] = useState('Class 5');
  const [assignedRoll, setAssignedRoll] = useState('0001');
  const [scholarshipWaiverPct, setScholarshipWaiverPct] = useState(10);
  const [adminRemarks, setAdminRemarks] = useState('Approved with 10% early-bird merit waiver');

  const filteredAdmissions = admissions.filter((a) => {
    return (
      a.studentNameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.appliedClass.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenApproveModal = (app: AdmissionApplication) => {
    setApprovalModalApp(app);
    setAssignedClass(app.appliedClass);
    setAssignedRoll('0001');
    setScholarshipWaiverPct(10);
    setAdminRemarks('Approved upon screening');
  };

  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalModalApp) return;

    const approved = schoolStorage.approveAdmission(
      approvalModalApp.id,
      assignedClass,
      assignedRoll,
      scholarshipWaiverPct,
      adminRemarks
    );

    if (approved) {
      showToast(`Admission approved for ${approved.studentNameEnglish}! Permanent student profile created.`, 'success');
      generateCongratulationLetterPDF(approved);
    }

    setApprovalModalApp(null);
  };

  const handleReject = (appId: string, name: string) => {
    const reason = prompt(`Enter rejection reason for ${name}:`, 'Documents incomplete or criteria not met');
    if (reason) {
      schoolStorage.rejectAdmission(appId, reason);
      showToast(`Application for ${name} marked as REJECTED.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 sm:max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('আবেদন আইডি, রেজিঃ নং বা নাম দিয়ে খুঁজুন...', 'Search app ID, reg no, or name...')}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
          />
        </div>

        <div className="text-xs font-semibold text-slate-600">
          {t('মোট আবেদন:', 'Total Applications:')} <span className="font-bold text-blue-900">{admissions.length}</span>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">আবেদন আইডি</th>
                <th className="p-3">রেজিঃ নম্বর</th>
                <th className="p-3">শিক্ষার্থী (Applicant)</th>
                <th className="p-3">শ্রেণী</th>
                <th className="p-3">তারিখ</th>
                <th className="p-3">অভিভাবক ফোন</th>
                <th className="p-3">স্ট্যাটাস</th>
                <th className="p-3 text-right">পদক্ষেপ (Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdmissions.length > 0 ? (
                filteredAdmissions.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-800">
                      {app.applicationId}
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-700">
                      {app.regNumber}
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{app.studentNameEnglish}</p>
                      <p className="text-[11px] text-slate-500">{app.studentNameBangla || '-'}</p>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      {app.appliedClass}
                    </td>
                    <td className="p-3 text-slate-500">
                      {app.appliedDate}
                    </td>
                    <td className="p-3 font-mono text-slate-700">
                      {app.guardianPhone}
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded text-[10px] ${
                          app.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => generateAdmissionFormPDF(app)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                          title="Download Form PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {app.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleOpenApproveModal(app)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 shadow-xs"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>অনুমোদন</span>
                          </button>
                        )}

                        {app.status === 'APPROVED' && (
                          <button
                            onClick={() => generateCongratulationLetterPDF(app)}
                            className="bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 shadow-xs"
                            title="Download Official Congratulation Letter"
                          >
                            <Award className="w-3 h-3" />
                            <span>চিঠি</span>
                          </button>
                        )}

                        {app.status === 'PENDING' && (
                          <button
                            onClick={() => handleReject(app.id, app.studentNameEnglish)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                            title="Reject"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No admission applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve Modal */}
      {approvalModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-emerald-500 animate-in zoom-in-95 p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="font-black text-sm text-slate-900">ভর্তি আবেদন চূড়ান্ত অনুমোদন</h4>
                <p className="text-[11px] text-slate-500">{approvalModalApp.studentNameEnglish} ({approvalModalApp.regNumber})</p>
              </div>
              <button onClick={() => setApprovalModalApp(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmApproval} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Class *</label>
                <select
                  value={assignedClass}
                  onChange={(e) => setAssignedClass(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-semibold"
                >
                  {['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Final Class Roll Number *</label>
                <input
                  type="text"
                  required
                  value={assignedRoll}
                  onChange={(e) => setAssignedRoll(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Scholarship / Fee Waiver %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scholarshipWaiverPct}
                  onChange={(e) => setScholarshipWaiverPct(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Administrative Remarks</label>
                <input
                  type="text"
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApprovalModalApp(null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Issue Letter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
