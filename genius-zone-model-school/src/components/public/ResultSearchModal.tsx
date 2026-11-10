/**
 * Result Search Modal for Genius Zone Model School (GZMS)
 * Supports Admission Result lookup and Academic Result Marks & PDF generation.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { generateResultCardPDF } from '../../services/pdfGenerator';
import type { StudentResult, AdmissionApplication } from '../../types';
import {
  Search,
  X,
  FileCheck,
  Download,
  Award,
  AlertCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const ResultSearchModal: React.FC = () => {
  const { isResultModalOpen, setIsResultModalOpen, t } = useApp();

  const [activeTab, setActiveTab] = useState<'ACADEMIC' | 'ADMISSION'>('ACADEMIC');

  // Academic Search filters
  const [academicRoll, setAcademicRoll] = useState('0001');
  const [academicClass, setAcademicClass] = useState('Class 5');
  const [academicSession, setAcademicSession] = useState('2026');
  const [foundAcademicResult, setFoundAcademicResult] = useState<StudentResult | null>(null);

  // Admission Search filter
  const [admissionQuery, setAdmissionQuery] = useState('GZMS0001');
  const [foundAdmissionApp, setFoundAdmissionApp] = useState<AdmissionApplication | null>(null);

  const [searchAttempted, setSearchAttempted] = useState(false);

  if (!isResultModalOpen) return null;

  const handleAcademicSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
    const results = schoolStorage.getResults();

    const formattedRoll = academicRoll.padStart(4, '0');
    const matched = results.find(
      (r) =>
        (r.rollNumber === formattedRoll || r.rollNumber === academicRoll || r.studentReg.toUpperCase() === academicRoll.toUpperCase()) &&
        r.className === academicClass &&
        r.session === academicSession
    );

    setFoundAcademicResult(matched || null);
  };

  const handleAdmissionSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
    const q = admissionQuery.trim().toUpperCase();
    const admissions = schoolStorage.getAdmissions();
    const students = schoolStorage.getStudents();

    // Check admissions list
    const matched = admissions.find(
      (a) => a.regNumber.toUpperCase() === q || a.applicationId.toUpperCase() === q || a.assignedRoll === q
    );

    if (matched) {
      setFoundAdmissionApp(matched);
      return;
    }

    // Check confirmed student
    const student = students.find((s) => s.regNumber.toUpperCase() === q || s.rollNumber === q);
    if (student) {
      setFoundAdmissionApp({
        id: student.id,
        applicationId: `APP-${student.session}-${student.rollNumber}`,
        regNumber: student.regNumber,
        appliedClass: student.className,
        session: student.session,
        appliedDate: student.admissionDate,
        status: 'APPROVED',
        assignedRoll: student.rollNumber,
        assignedClass: student.className,
        scholarshipWaiverPct: student.scholarshipPct,
        studentNameBangla: student.nameBangla,
        studentNameEnglish: student.nameEnglish,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        photoUrl: student.photoUrl,
        village: student.village,
        postOffice: student.postOffice,
        upazila: student.upazila,
        district: student.district,
        country: student.country,
        fatherNameEnglish: student.fatherNameEnglish,
        motherNameEnglish: student.motherNameEnglish,
        guardianPhone: student.guardianPhone,
        presentAddress: student.presentAddress,
        permanentAddress: student.permanentAddress,
      });
      return;
    }

    setFoundAdmissionApp(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-600 my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-blue-950 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                {t('পরীক্ষার ফলাফল ও মেধা তালিকা', 'Examination Results & Progress Cards')}
              </h3>
              <p className="text-[11px] text-amber-300">
                {t('জিনিয়াস জোন মডেল স্কুল • অনলাইন রেজাল্ট পোর্টাল', 'GZMS Online Result & Marksheet Portal')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsResultModalOpen(false)}
            className="p-1.5 rounded-full bg-blue-950/70 hover:bg-blue-950 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => {
              setActiveTab('ACADEMIC');
              setSearchAttempted(false);
            }}
            className={`pb-2.5 text-xs font-bold border-b-2 px-3 transition-colors ${
              activeTab === 'ACADEMIC'
                ? 'border-blue-700 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t('একাডেমিক ফলাফল ও মার্কশিট', 'Academic Result & Marksheet')}
          </button>
          <button
            onClick={() => {
              setActiveTab('ADMISSION');
              setSearchAttempted(false);
            }}
            className={`pb-2.5 text-xs font-bold border-b-2 px-3 transition-colors ${
              activeTab === 'ADMISSION'
                ? 'border-blue-700 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t('ভর্তি পরীক্ষার ফলাফল / ট্র্যাকিং', 'Admission Result / Tracking')}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'ACADEMIC' ? (
            <div className="space-y-6">
              {/* Filter Form */}
              <form onSubmit={handleAcademicSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('রোল / রেজিঃ নং *', 'Roll or Reg No *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={academicRoll}
                    onChange={(e) => setAcademicRoll(e.target.value)}
                    placeholder="0001 or GZMS0001"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('শ্রেণী *', 'Class *')}
                  </label>
                  <select
                    value={academicClass}
                    onChange={(e) => setAcademicClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-semibold text-slate-900"
                  >
                    {['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('শিক্ষাবর্ষ', 'Session')}
                  </label>
                  <select
                    value={academicSession}
                    onChange={(e) => setAcademicSession(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Search className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('ফলাফল দেখুন', 'Search')}</span>
                  </button>
                </div>
              </form>

              {/* Result Display */}
              {foundAcademicResult ? (
                <div className="p-5 rounded-2xl bg-white border-2 border-blue-200 shadow-sm space-y-4 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <h4 className="text-lg font-black text-slate-900">
                        {foundAcademicResult.studentName}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {t('রেজিঃ নং:', 'Reg:')} <span className="font-mono font-bold text-blue-700">{foundAcademicResult.studentReg}</span> • {t('রোল:', 'Roll:')} <span className="font-mono font-bold">{foundAcademicResult.rollNumber}</span> • {foundAcademicResult.className}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-300">
                        GPA {foundAcademicResult.overallGpa.toFixed(2)} ({foundAcademicResult.finalGrade})
                      </span>
                      <button
                        type="button"
                        onClick={() => generateResultCardPDF(foundAcademicResult)}
                        className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('মার্কশিট PDF', 'Download PDF')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Subject Marks Table */}
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-blue-950 text-white">
                        <tr>
                          <th className="p-2.5">বিষয় (Subject)</th>
                          <th className="p-2.5 text-center">পূর্ণমান</th>
                          <th className="p-2.5 text-center">প্রাপ্ত নম্বর</th>
                          <th className="p-2.5 text-center">গ্রেড</th>
                          <th className="p-2.5 text-center">GPA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {foundAcademicResult.subjects.map((sub, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-2.5 font-medium text-slate-900">{sub.subjectName}</td>
                            <td className="p-2.5 text-center text-slate-500">100</td>
                            <td className="p-2.5 text-center font-bold text-slate-900">{sub.marks}</td>
                            <td className="p-2.5 text-center font-bold text-blue-700">{sub.letterGrade}</td>
                            <td className="p-2.5 text-center font-mono">{sub.gpa.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-100 font-bold border-t border-slate-200 text-slate-900">
                        <tr>
                          <td className="p-2.5">{t('মোট নম্বর ও ফলাফল', 'Total Marks & Grade')}</td>
                          <td className="p-2.5 text-center">{foundAcademicResult.subjects.length * 100}</td>
                          <td className="p-2.5 text-center text-blue-900 font-black">{foundAcademicResult.totalMarks}</td>
                          <td className="p-2.5 text-center text-emerald-700">{foundAcademicResult.finalGrade}</td>
                          <td className="p-2.5 text-center font-mono text-emerald-700">{foundAcademicResult.overallGpa.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <p className="text-xs text-slate-600 italic">
                    {t('শিক্ষকের মন্তব্য:', 'Remarks:')} {foundAcademicResult.remarks}
                  </p>
                </div>
              ) : searchAttempted ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <AlertCircle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                  <p className="text-sm font-bold text-slate-800">{t('কোনো ফলাফল পাওয়া যায়নি', 'No Result Found')}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t('অনুগ্রহ করে সঠিক রোল নম্বর ও শ্রেণী নির্বাচন করুন।', 'Please check the Roll number and Class.')}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Admission Search Form */}
              <form onSubmit={handleAdmissionSearch} className="flex gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <input
                  type="text"
                  required
                  value={admissionQuery}
                  onChange={(e) => setAdmissionQuery(e.target.value)}
                  placeholder="রেজিস্ট্রেশন নং বা আবেদন আইডি (যেমন: GZMS0001)"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono font-bold text-slate-900"
                />
                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('যাচাই করুন', 'Track')}</span>
                </button>
              </form>

              {/* Admission Result Card */}
              {foundAdmissionApp ? (
                <div className="p-5 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm space-y-3 animate-in fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-300 mb-1">
                        {foundAdmissionApp.status === 'APPROVED' ? t('ভর্তি অনুমোদিত (APPROVED)', 'ADMISSION APPROVED') : foundAdmissionApp.status}
                      </span>
                      <h4 className="text-base font-black text-slate-900">
                        {foundAdmissionApp.studentNameEnglish}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {t('পিতার নাম:', "Father's Name:")} {foundAdmissionApp.fatherNameEnglish}
                      </p>
                    </div>

                    <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                      {foundAdmissionApp.regNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
                    <div>
                      <span className="text-slate-500 block">{t('শ্রেণী:', 'Class:')}</span>
                      <span className="font-bold text-slate-900">{foundAdmissionApp.assignedClass || foundAdmissionApp.appliedClass}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{t('রোল নম্বর:', 'Assigned Roll:')}</span>
                      <span className="font-bold text-blue-900">{foundAdmissionApp.assignedRoll || '0001'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{t('বৃত্তি / ছাড়:', 'Scholarship:')}</span>
                      <span className="font-bold text-amber-600">{foundAdmissionApp.scholarshipWaiverPct || 0}% Waiver</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => generateResultCardPDF({
                        id: 'dummy',
                        examId: 'adm',
                        examName: 'Admission Test 2026',
                        studentId: foundAdmissionApp.id,
                        studentReg: foundAdmissionApp.regNumber,
                        studentName: foundAdmissionApp.studentNameEnglish,
                        className: foundAdmissionApp.assignedClass || foundAdmissionApp.appliedClass,
                        rollNumber: foundAdmissionApp.assignedRoll || '0001',
                        session: foundAdmissionApp.session,
                        subjects: [
                          { subjectName: 'Bangla', marks: 85, letterGrade: 'A+', gpa: 5.0 },
                          { subjectName: 'English', marks: 82, letterGrade: 'A+', gpa: 5.0 },
                          { subjectName: 'Mathematics', marks: 90, letterGrade: 'A+', gpa: 5.0 },
                        ],
                        totalMarks: 257,
                        averageMarks: 85.6,
                        overallGpa: 5.0,
                        finalGrade: 'A+',
                        remarks: 'Selected for Admission 2026',
                        isPublished: true,
                      })}
                      className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('ভর্তি ফলাফল কার্ড ডাউনলোড (PDF)', 'Download Admission Card')}</span>
                    </button>
                  </div>
                </div>
              ) : searchAttempted ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <AlertCircle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                  <p className="text-sm font-bold text-slate-800">{t('কোনো আবেদন পাওয়া যায়নি', 'No Application Found')}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t('অনুগ্রহ করে সঠিক রেজিস্ট্রেশন নম্বর টাইপ করুন (যেমন: GZMS0001)', 'Check your registration number (e.g. GZMS0001).')}</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
