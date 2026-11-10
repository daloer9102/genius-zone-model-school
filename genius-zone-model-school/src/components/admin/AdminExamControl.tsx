/**
 * Exam Control & Class-Subject Assignment Module for Genius Zone Model School (GZMS)
 * Allows administrators to assign subjects to classes, set pass/full marks, assign subject teachers, and manage curriculum.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import type { ClassSubject } from '../../types';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Users,
  Award,
  Layers,
  Sparkles,
  Save,
  RotateCcw,
} from 'lucide-react';

export const AdminExamControl: React.FC = () => {
  const { showToast, t } = useApp();
  const teachers = schoolStorage.getTeachers();

  const classes = [
    'Play Group',
    'Nursery',
    'KG',
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

  const [selectedClass, setSelectedClass] = useState('Class 5');
  const subjects = schoolStorage.getClassSubjects(selectedClass);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<ClassSubject | null>(null);

  // Form State
  const [formSubjectNameBn, setFormSubjectNameBn] = useState('');
  const [formSubjectNameEn, setFormSubjectNameEn] = useState('');
  const [formSubjectCode, setFormSubjectCode] = useState('');
  const [formFullMarks, setFormFullMarks] = useState(100);
  const [formPassMarks, setFormPassMarks] = useState(33);
  const [formTeacherName, setFormTeacherName] = useState(teachers[0]?.nameEnglish || 'Md. Rafiqul Islam');
  const [formIsCompulsory, setFormIsCompulsory] = useState(true);

  const openAddModal = () => {
    setEditingSubject(null);
    setFormSubjectNameBn('');
    setFormSubjectNameEn('');
    setFormSubjectCode((100 + subjects.length + 1).toString());
    setFormFullMarks(100);
    setFormPassMarks(33);
    setFormTeacherName(teachers[0]?.nameEnglish || 'Md. Rafiqul Islam');
    setFormIsCompulsory(true);
    setIsAddModalOpen(true);
  };

  const openEditModal = (sub: ClassSubject) => {
    setEditingSubject(sub);
    setFormSubjectNameBn(sub.subjectNameBangla);
    setFormSubjectNameEn(sub.subjectNameEnglish);
    setFormSubjectCode(sub.subjectCode);
    setFormFullMarks(sub.fullMarks);
    setFormPassMarks(sub.passMarks);
    setFormTeacherName(sub.teacherName || '');
    setFormIsCompulsory(sub.isCompulsory);
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubjectNameEn.trim()) {
      showToast(t('বিষয়ের নাম প্রদান করুন', 'Please enter subject name'), 'error');
      return;
    }

    if (editingSubject) {
      schoolStorage.updateClassSubject(editingSubject.id, {
        subjectNameBangla: formSubjectNameBn.trim() || formSubjectNameEn.trim(),
        subjectNameEnglish: formSubjectNameEn.trim(),
        subjectCode: formSubjectCode.trim() || '101',
        fullMarks: Number(formFullMarks) || 100,
        passMarks: Number(formPassMarks) || 33,
        teacherName: formTeacherName,
        isCompulsory: formIsCompulsory,
      });
      showToast(t('বিষয় আপডেট সম্পন্ন হয়েছে!', 'Subject updated successfully!'), 'success');
    } else {
      schoolStorage.addClassSubject({
        className: selectedClass,
        subjectNameBangla: formSubjectNameBn.trim() || formSubjectNameEn.trim(),
        subjectNameEnglish: formSubjectNameEn.trim(),
        subjectCode: formSubjectCode.trim() || '101',
        fullMarks: Number(formFullMarks) || 100,
        passMarks: Number(formPassMarks) || 33,
        teacherName: formTeacherName,
        isCompulsory: formIsCompulsory,
      });
      showToast(t('নতুন বিষয় সফলভাবে যুক্ত হয়েছে!', 'New subject added successfully!'), 'success');
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteSubject = (id: string, name: string) => {
    if (confirm(`Remove subject "${name}" from ${selectedClass}?`)) {
      schoolStorage.deleteClassSubject(id);
      showToast(t('বিষয় মুছে ফেলা হয়েছে', 'Subject removed'), 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
              EXAM CONTROL & CURRICULUM
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Class-wise Subject Allocation
            </span>
          </div>
          <h3 className="text-base font-black text-slate-900 mt-1">
            {t('পরীক্ষা নিয়ন্ত্রণ ও শ্রেণীভিত্তিক বিষয় বণ্টন', 'Exam Control & Subject Assignment')}
          </h3>
          <p className="text-xs text-slate-500">
            {t('প্রতিটি শ্রেণীর পাঠ্যবিষয়, পূর্ণমান, পাস নম্বর ও বিষয় শিক্ষক নির্ধারণ করুন। ফলাফল ও প্রবেশপত্রে এগুলো স্বয়ংক্রিয়ভাবে প্রযোজ্য হবে।', 'Assign class subjects, full marks, pass marks, and teachers. Dynamic results and admit cards adapt automatically.')}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>{t(`${selectedClass}-এ নতুন বিষয় যোগ`, `Add Subject to ${selectedClass}`)}</span>
        </button>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          {t('শ্রেণী নির্বাচন করুন (Select Class)', 'Select Class')}
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {classes.map((cls) => {
            const isSelected = cls === selectedClass;
            const count = schoolStorage.getClassSubjects(cls).length;
            return (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{cls}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-amber-400 text-blue-950 font-black' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subjects Table for Selected Class */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span className="font-black text-slate-900">
              {selectedClass} • {t('নির্ধারিত বিষয়সমূহ', 'Allocated Subjects')} ({subjects.length} {t('টি বিষয়', 'Subjects')})
            </span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">
            Total Marks: {subjects.reduce((sum, s) => sum + s.fullMarks, 0)} BDT
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">কোড</th>
                <th className="p-3">বিষয়ের নাম (বাংলা)</th>
                <th className="p-3">Subject Name (English)</th>
                <th className="p-3 text-center">পূর্ণমান (Full)</th>
                <th className="p-3 text-center">পাস নম্বর (Pass)</th>
                <th className="p-3">নিযুক্ত শিক্ষক (Assigned Teacher)</th>
                <th className="p-3 text-center">ধরণ</th>
                <th className="p-3 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.length > 0 ? (
                subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-blue-800">{sub.subjectCode}</td>
                    <td className="p-3 font-bold text-slate-900">{sub.subjectNameBangla}</td>
                    <td className="p-3 font-semibold text-slate-700">{sub.subjectNameEnglish}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-900">
                      <span className="bg-slate-100 px-2 py-0.5 rounded">{sub.fullMarks}</span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-700">
                      <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{sub.passMarks}</span>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>{sub.teacherName || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sub.isCompulsory
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.isCompulsory ? 'আবশ্যিক' : 'ঐচ্ছিক'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(sub)}
                          className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Edit Subject"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(sub.id, sub.subjectNameEnglish)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No subjects allocated for {selectedClass} yet. Click "Add Subject" above to assign.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-950 to-indigo-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm">
                    {editingSubject
                      ? t('বিষয় সম্পাদনা করুন', 'Edit Subject')
                      : t(`${selectedClass}-এ নতুন বিষয় নির্ধারণ`, `Assign New Subject to ${selectedClass}`)}
                  </h4>
                  <p className="text-[11px] text-blue-200 mt-0.5">
                    {selectedClass} • Exam Control
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-blue-800/60"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('বিষয় কোড (Subject Code) *', 'Subject Code *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubjectCode}
                    onChange={(e) => setFormSubjectCode(e.target.value)}
                    placeholder="যেমন: 101"
                    className="w-full px-3 py-2 border rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('বিষয়ের ধরণ', 'Subject Type')}
                  </label>
                  <select
                    value={formIsCompulsory ? 'compulsory' : 'optional'}
                    onChange={(e) => setFormIsCompulsory(e.target.value === 'compulsory')}
                    className="w-full px-3 py-2 border rounded-xl font-semibold bg-white text-slate-900"
                  >
                    <option value="compulsory">{t('আবশ্যিক (Compulsory)', 'Compulsory')}</option>
                    <option value="optional">{t('ঐচ্ছিক (Optional)', 'Optional')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t('বিষয়ের নাম (English) *', 'Subject Name (English) *')}
                </label>
                <input
                  type="text"
                  required
                  value={formSubjectNameEn}
                  onChange={(e) => setFormSubjectNameEn(e.target.value)}
                  placeholder="e.g. Mathematics / General Science"
                  className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t('বিষয়ের নাম (বাংলা)', 'Subject Name (Bangla)')}
                </label>
                <input
                  type="text"
                  value={formSubjectNameBn}
                  onChange={(e) => setFormSubjectNameBn(e.target.value)}
                  placeholder="যেমন: গণিত / সাধারণ বিজ্ঞান"
                  className="w-full px-3 py-2 border rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('পূর্ণমান (Full Marks) *', 'Full Marks *')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    required
                    value={formFullMarks}
                    onChange={(e) => setFormFullMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('পাস নম্বর (Pass Marks) *', 'Pass Marks *')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formPassMarks}
                    onChange={(e) => setFormPassMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t('নিযুক্ত বিষয় শিক্ষক (Subject Teacher)', 'Assign Subject Teacher')}
                </label>
                <select
                  value={formTeacherName}
                  onChange={(e) => setFormTeacherName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-semibold bg-white text-slate-900"
                >
                  {teachers.map((tch) => (
                    <option key={tch.id} value={tch.nameEnglish}>
                      {tch.nameEnglish} ({tch.designationEnglish} - {tch.subjectSpecialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold px-5 py-2 rounded-xl flex items-center gap-2 shadow-xs transition-transform active:scale-95"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>{editingSubject ? t('হালনাগাদ করুন', 'Update Subject') : t('সংরক্ষণ করুন', 'Save Subject')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
