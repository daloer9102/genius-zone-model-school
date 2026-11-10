/**
 * Examination Admit Card Management & Structure Customization Module for Genius Zone Model School (GZMS)
 * Generates official single-page A4 examination admit cards with customizable Bengali rules,
 * center details, signature titles, QR code (encoding Candidate Name & Username), and subject mapping.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { generateAdmitCardPDF } from '../../services/pdfGenerator';
import type { StudentProfile, AdmitCardStructure } from '../../types';
import {
  FileCheck,
  Download,
  Search,
  Filter,
  Sparkles,
  Calendar,
  BookOpen,
  Sliders,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Eye,
  QrCode,
  Shield,
  Layers,
} from 'lucide-react';

export const AdminAdmitCards: React.FC = () => {
  const { showToast, t } = useApp();
  const students = schoolStorage.getStudents();

  const [selectedClass, setSelectedClass] = useState('Class 5');
  const [examName, setExamName] = useState('First Terminal Examination 2026');
  const [searchQuery, setSearchQuery] = useState('');

  // Admit Card Structure Customization State
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [structure, setStructure] = useState<AdmitCardStructure>(schoolStorage.getAdmitCardStructure());

  // Dynamic class subjects from Exam Control storage
  const classSubjects = schoolStorage.getClassSubjects(selectedClass);
  const currentSubjects =
    classSubjects.length > 0
      ? classSubjects.map((s) => s.subjectNameEnglish)
      : ['Bangla 1st', 'Bangla 2nd', 'English', 'Mathematics', 'General Science', 'Religion & Moral Education'];

  const classStudents = students.filter(
    (s) =>
      s.className === selectedClass &&
      (s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.includes(searchQuery))
  );

  const handleDownload = (student: StudentProfile) => {
    generateAdmitCardPDF(student, examName, currentSubjects, structure);
    showToast(`Admit card generated for ${student.nameEnglish} (${student.regNumber})!`, 'success');
  };

  const handleDownloadAllForClass = () => {
    if (classStudents.length === 0) {
      showToast('No active students found in this class.', 'info');
      return;
    }
    classStudents.forEach((s) => {
      generateAdmitCardPDF(s, examName, currentSubjects, structure);
    });
    showToast(`Generated ${classStudents.length} Admit Cards for ${selectedClass}!`, 'success');
  };

  const handleSaveStructure = (e: React.FormEvent) => {
    e.preventDefault();
    schoolStorage.updateAdmitCardStructure(structure);
    showToast(t('প্রবেশপত্রের কাঠামো ও নিয়মাবলী সফলভাবে সংরক্ষিত হয়েছে!', 'Admit card structure and rules saved successfully!'), 'success');
    setIsStructureModalOpen(false);
  };

  const handleResetStructure = () => {
    if (confirm('Reset admit card structure and rules to default factory settings?')) {
      const defaults = schoolStorage.resetAdmitCardStructure();
      setStructure(defaults);
      showToast(t('ডিফল্ট কাঠামো ও ৫টি বাংলা নিয়ম পুনঃস্থাপিত হয়েছে', 'Admit card structure reset to defaults'), 'info');
    }
  };

  const handleAddRule = () => {
    setStructure({
      ...structure,
      rulesBangla: [...structure.rulesBangla, 'নতুন পরীক্ষার নিয়ম ও শৃঙ্খলাবিধি লিখুন।'],
    });
  };

  const handleRemoveRule = (index: number) => {
    const updated = structure.rulesBangla.filter((_, i) => i !== index);
    setStructure({ ...structure, rulesBangla: updated });
  };

  const handleUpdateRule = (index: number, val: string) => {
    const updated = [...structure.rulesBangla];
    updated[index] = val;
    setStructure({ ...structure, rulesBangla: updated });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                ADMIT CARD CONTROL
              </span>
              <span className="text-xs text-slate-500 font-medium">Single A4 Layout • Official Seal</span>
            </div>
            <h3 className="text-base font-black text-slate-900 mt-1">
              {t('পরীক্ষার প্রবেশপত্র (Admit Card) প্রস্তুত ও কাঠামো কাস্টমাইজ', 'Admit Card Generator & Structure Customizer')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t(
                '১টি শিক্ষার্থী = ১টি একক A4 প্রবেশপত্র • ৫টি বিশেষ নিয়মের সাথে নাম ও ইউজারনেমযুক্ত কিউআর কোড এবং প্রধান শিক্ষকের স্বাক্ষর',
                '1 Student = 1 Single A4 Page with 5 Bangla rules, QR code with Name & Username, and signatures.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsStructureModalOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-blue-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 border border-slate-300 transition-all active:scale-95"
            >
              <Sliders className="w-4 h-4 text-blue-700" />
              <span>{t('কাঠামো ও নিয়ম কাস্টমাইজ', 'Change Structure')}</span>
            </button>

            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 border border-amber-300 transition-all active:scale-95"
            >
              <Eye className="w-4 h-4 text-amber-700" />
              <span>{t('লাইভ প্রিভিউ', 'Live Preview')}</span>
            </button>

            <button
              onClick={handleDownloadAllForClass}
              className="bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{t(`পুরো শ্রেণীর সবার অ্যাডমিট ডাউনলোড (${classStudents.length})`, `Download All ${classStudents.length} Cards`)}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পরীক্ষার নাম (Exam Name)</label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণী নির্বাচন (Class)</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white"
            >
              {['Play Group', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষার্থী খুঁজুন (Search)</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম, রোল বা রেজিঃ..."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Student List for Selected Class */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
          <span className="font-bold text-slate-800">
            {selectedClass} {t('শিক্ষার্থীদের তালিকা', 'Students List')} ({classStudents.length} Pupils)
          </span>
          <div className="flex items-center gap-2 text-slate-600">
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            <span className="font-medium">
              {currentSubjects.length} {t('টি বিষয় বরাদ্দ:', 'Allocated Subjects:')} {currentSubjects.slice(0, 4).join(', ')}{currentSubjects.length > 4 ? '...' : ''}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">রোল</th>
                <th className="p-3">রেজিঃ নম্বর / ইউজারনেম</th>
                <th className="p-3">শিক্ষার্থী (Candidate)</th>
                <th className="p-3">পিতার নাম</th>
                <th className="p-3">শাখা</th>
                <th className="p-3 text-right">প্রবেশপত্র PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.length > 0 ? (
                classStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-slate-900">{std.rollNumber}</td>
                    <td className="p-3 font-mono font-bold text-blue-700">{std.regNumber}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={std.photoUrl}
                          alt={std.nameEnglish}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{std.nameEnglish}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{std.nameBangla}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">{std.fatherNameEnglish}</td>
                    <td className="p-3 text-slate-700 font-semibold">{std.section}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDownload(std)}
                        className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs ml-auto transition-all active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('অ্যাডমিট কার্ড (A4)', 'Download A4')}</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No students found in {selectedClass}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Structure & Rules Customization Modal */}
      {isStructureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-950 to-indigo-950 text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm">
                    {t('প্রবেশপত্রের কাঠামো ও নিয়মাবলী পরিবর্তন', 'Customize Admit Card Structure & Rules')}
                  </h4>
                  <p className="text-[11px] text-blue-200 mt-0.5">
                    {t('প্রবেশপত্রের শীর্ষ শিরোনাম, পরীক্ষার কেন্দ্র, ৫টি বাংলা নিয়ম ও স্বাক্ষর কাস্টমাইজ করুন', 'Configure exam titles, center, rules, toggles, and signatures.')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsStructureModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-blue-800/60"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveStructure} className="p-6 space-y-5 text-xs">
              {/* Titles & Session */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h5 className="font-black text-slate-900 text-xs">
                  {t('১. পরীক্ষার শিরোনাম ও শিক্ষাবর্ষ', '1. Exam Title & Session Year')}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Exam Title (English)</label>
                    <input
                      type="text"
                      required
                      value={structure.examTitleEnglish}
                      onChange={(e) => setStructure({ ...structure, examTitleEnglish: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পরীক্ষার নাম (বাংলা)</label>
                    <input
                      type="text"
                      value={structure.examTitleBangla}
                      onChange={(e) => setStructure({ ...structure, examTitleBangla: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Center Name (English)</label>
                    <input
                      type="text"
                      required
                      value={structure.centerNameEnglish}
                      onChange={(e) => setStructure({ ...structure, centerNameEnglish: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">শিক্ষাবর্ষ / Session Year</label>
                    <input
                      type="text"
                      required
                      value={structure.sessionYear}
                      onChange={(e) => setStructure({ ...structure, sessionYear: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-mono font-bold text-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h5 className="font-black text-slate-900 text-xs">
                  {t('২. উপাদান প্রদর্শন নির্বাচন (Feature Toggles)', '2. Visual Components & Display Options')}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={structure.showQrCode}
                      onChange={(e) => setStructure({ ...structure, showQrCode: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">ডিজিটাল কিউআর কোড (QR Code)</span>
                      <span className="text-[10px] text-slate-500">নাম ও ইউজারনেম এনকোড করা কিউআর কোড</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={structure.showStudentPhoto}
                      onChange={(e) => setStructure({ ...structure, showStudentPhoto: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">শিক্ষার্থীর ছবি (Student Photo)</span>
                      <span className="text-[10px] text-slate-500">অ্যাডমিট কার্ডে পাসপোর্ট সাইজ ছবি বক্স</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={structure.showGuardianPhone}
                      onChange={(e) => setStructure({ ...structure, showGuardianPhone: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">অভিভাবকের ফোন (Guardian Phone)</span>
                      <span className="text-[10px] text-slate-500">জরুরি যোগাযোগের নম্বর প্রদর্শন</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={structure.showRoomNumber}
                      onChange={(e) => setStructure({ ...structure, showRoomNumber: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">পরীক্ষার কক্ষ ও সময় (Room & Schedule)</span>
                      <span className="text-[10px] text-slate-500">বিষয় টেবিলের পাশে কক্ষ নির্দেশিকা</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 5 Bengali Rules */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-black text-amber-950 text-xs">
                      {t('৩. পরীক্ষার্থীদের জন্য বিশেষ নিয়মাবলী (Bangla Rules)', '3. Examination Rules in Bengali')}
                    </h5>
                    <p className="text-[11px] text-amber-800">
                      {t('প্রবেশপত্রে প্রিন্ট হওয়া বাংলা নিয়মাবলী সম্পাদনা করুন', 'Edit rules printed at the bottom of the admit card')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('নিয়ম যোগ করুন', 'Add Rule')}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {structure.rulesBangla.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-amber-200">
                      <span className="font-bold font-mono text-amber-900 w-5 pt-1 text-center shrink-0">
                        {idx + 1}.
                      </span>
                      <textarea
                        rows={2}
                        value={rule}
                        onChange={(e) => handleUpdateRule(idx, e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs border rounded-lg text-slate-900 leading-relaxed"
                      />
                      {structure.rulesBangla.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(idx)}
                          className="p-1 rounded-md text-red-600 hover:bg-red-50 shrink-0"
                          title="Remove Rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Titles */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h5 className="font-black text-slate-900 text-xs">
                  {t('৪. স্বাক্ষরকারী কর্তৃপক্ষের পদবি (Signatures)', '4. Authorized Signature Titles')}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Exam Controller Title</label>
                    <input
                      type="text"
                      value={structure.controllerSignatureTitle}
                      onChange={(e) => setStructure({ ...structure, controllerSignatureTitle: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Principal / Head Teacher Title</label>
                    <input
                      type="text"
                      value={structure.principalSignatureTitle}
                      onChange={(e) => setStructure({ ...structure, principalSignatureTitle: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-slate-900 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={handleResetStructure}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('ডিফল্ট কাঠামোতে ফিরুন', 'Restore Defaults')}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsStructureModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    {t('বাতিল', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold px-6 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>{t('কাঠামো সংরক্ষণ করুন', 'Save Structure')}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="bg-gradient-to-r from-blue-950 to-indigo-950 text-white p-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-400" />
                <h4 className="font-black text-sm">
                  {t('প্রবেশপত্র লাইভ প্রিভিউ (A4 Layout Live Preview)', 'Admit Card Live Preview')}
                </h4>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Paper Replica */}
              <div className="border-4 border-double border-blue-900 rounded-xl p-6 bg-slate-50/50 shadow-inner space-y-4 text-slate-900">
                {/* Header */}
                <div className="text-center border-b pb-3 border-blue-200">
                  <span className="text-[10px] font-black uppercase text-amber-700 tracking-widest block">
                    GENIUS ZONE MODEL SCHOOL
                  </span>
                  <h3 className="text-base font-black text-blue-950">{structure.examTitleEnglish}</h3>
                  <p className="text-xs font-bold text-slate-700">
                    Center: {structure.centerNameEnglish} • Session: {structure.sessionYear}
                  </p>
                </div>

                {/* Candidate & QR & Photo */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 bg-white p-4 rounded-xl border border-slate-200">
                  <div className="space-y-1 text-xs">
                    <p><strong className="text-slate-600">Candidate Name:</strong> <span className="font-black text-slate-900">TANVIR AHMED</span></p>
                    <p><strong className="text-slate-600">Bangla Name:</strong> তানভীর আহমেদ</p>
                    <p><strong className="text-slate-600">Registration / Username:</strong> <span className="font-mono font-bold text-blue-800">GZMS0001</span></p>
                    <p><strong className="text-slate-600">Class & Roll:</strong> {selectedClass} (Sec: A) • Roll: 0001</p>
                    {structure.showGuardianPhone && (
                      <p><strong className="text-slate-600">Guardian Phone:</strong> 01711002233</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {structure.showQrCode && (
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl text-center">
                        <QrCode className="w-16 h-16 text-blue-900 mx-auto" />
                        <span className="text-[8px] font-bold text-blue-800 block mt-0.5">Name & User QR</span>
                      </div>
                    )}
                    {structure.showStudentPhoto && (
                      <div className="w-16 h-20 bg-slate-200 rounded-xl border-2 border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-500 text-center p-1">
                        PHOTO
                      </div>
                    )}
                  </div>
                </div>

                {/* Subjects */}
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-blue-900 text-white font-bold text-xs p-2">
                    EXAMINATION SUBJECTS SCHEDULE ({selectedClass})
                  </div>
                  <div className="p-2 divide-y divide-slate-100 text-xs bg-white">
                    {currentSubjects.slice(0, 5).map((sub, i) => (
                      <div key={i} className="py-1 flex justify-between">
                        <span>{i + 1}. {sub}</span>
                        {structure.showRoomNumber && <span className="text-slate-500">Room 201 • Morning Shift</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rules Box */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-xs space-y-1.5">
                  <h6 className="font-black text-amber-950">পরীক্ষার্থীদের জন্য বিশেষ নিয়মাবলী:</h6>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-800 text-[11px]">
                    {structure.rulesBangla.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ol>
                </div>

                {/* Signatures */}
                <div className="pt-8 flex justify-between items-center text-xs font-bold text-slate-800 px-4">
                  <div className="text-center">
                    <div className="w-28 border-t border-slate-400 mb-1" />
                    <span>{structure.controllerSignatureTitle}</span>
                  </div>
                  <div className="text-center">
                    <div className="w-28 border-t border-slate-400 mb-1" />
                    <span>{structure.principalSignatureTitle}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsPreviewModalOpen(false);
                    if (classStudents[0]) handleDownload(classStudents[0]);
                  }}
                  className="bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>{t('নমুনা PDF ডাউনলোড করুন', 'Download Sample PDF')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
