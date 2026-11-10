/**
 * Result Management Module for Genius Zone Model School (GZMS)
 * Marks entry, grading computation, and publishing results.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { generateResultCardPDF } from '../../services/pdfGenerator';
import { calculateOverallResult } from '../../utils/schoolRules';
import type { StudentResult } from '../../types';
import {
  Award,
  Plus,
  CheckCircle2,
  Download,
  Search,
  BookOpen,
  Filter,
  X,
  FileText,
} from 'lucide-react';

export const AdminResults: React.FC = () => {
  const { showToast, t } = useApp();
  const results = schoolStorage.getResults();
  const students = schoolStorage.getStudents();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('Class 5');
  const [isAddMarksModalOpen, setIsAddMarksModalOpen] = useState(false);

  // Mark entry form state
  const [studentReg, setStudentReg] = useState('GZMS0001');
  const [examName, setExamName] = useState('First Terminal Examination 2026');
  const [banglaMarks, setBanglaMarks] = useState(85);
  const [englishMarks, setEnglishMarks] = useState(80);
  const [mathMarks, setMathMarks] = useState(90);
  const [scienceMarks, setScienceMarks] = useState(85);
  const [religionMarks, setReligionMarks] = useState(90);
  const [remarks, setRemarks] = useState('Very good performance');

  const filteredResults = results.filter((r) => {
    return (
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentReg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rollNumber.includes(searchQuery)
    );
  });

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    const student = schoolStorage.getStudentByReg(studentReg);
    if (!student) {
      showToast('Student not found with this Registration Number!', 'error');
      return;
    }

    const subjectMarks = [
      { subjectName: 'Bangla', marks: banglaMarks, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'English', marks: englishMarks, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'Mathematics', marks: mathMarks, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'General Science', marks: scienceMarks, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'Religion & Moral Edu', marks: religionMarks, letterGrade: 'A+', gpa: 5.0 },
    ];

    const saved = schoolStorage.saveResult({
      examId: 'exam-1',
      examName,
      studentId: student.id,
      studentReg: student.regNumber,
      studentName: student.nameEnglish,
      className: student.className,
      rollNumber: student.rollNumber,
      session: student.session,
      subjects: subjectMarks,
      totalMarks: 0,
      averageMarks: 0,
      overallGpa: 0,
      finalGrade: '',
      remarks,
      isPublished: true,
      publishedDate: new Date().toISOString().split('T')[0],
    });

    showToast(`Result published for ${student.nameEnglish} (GPA: ${saved.overallGpa.toFixed(2)})!`, 'success');
    setIsAddMarksModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 sm:max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('শিক্ষার্থী বা রেজিস্ট্রেশন নম্বর দিয়ে খুঁজুন...', 'Search student or reg no...')}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
          />
        </div>

        <button
          onClick={() => setIsAddMarksModalOpen(true)}
          className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>{t('নম্বর এন্ট্রি ও প্রকাশ', 'Enter Marks & Publish')}</span>
        </button>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">শিক্ষার্থী (Student)</th>
                <th className="p-3">রেজিঃ ও রোল</th>
                <th className="p-3">শ্রেণী</th>
                <th className="p-3">পরীক্ষা</th>
                <th className="p-3">মোট নম্বর</th>
                <th className="p-3">GPA ও গ্রেড</th>
                <th className="p-3">অবস্থান (Rank)</th>
                <th className="p-3">স্ট্যাটাস</th>
                <th className="p-3 text-right">মার্কশিট PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length > 0 ? (
                filteredResults.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{res.studentName}</td>
                    <td className="p-3 font-mono">
                      <span className="font-bold text-blue-700">{res.studentReg}</span> (Roll: {res.rollNumber})
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{res.className}</td>
                    <td className="p-3 text-slate-600">{res.examName}</td>
                    <td className="p-3 font-mono font-bold text-blue-900">{res.totalMarks}</td>
                    <td className="p-3">
                      <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        GPA {res.overallGpa.toFixed(2)} ({res.finalGrade})
                      </span>
                    </td>
                    <td className="p-3 font-bold text-amber-700">
                      {res.positionInClass ? `Rank ${res.positionInClass}` : 'Top 10%'}
                    </td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        PUBLISHED
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => generateResultCardPDF(res)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs ml-auto transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-600" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Marks Entry Modal */}
      {isAddMarksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h4 className="font-black text-sm text-slate-900">পরীক্ষার নম্বর এন্ট্রি ও ফলাফল প্রকাশ</h4>
              <button onClick={() => setIsAddMarksModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMarks} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Student</label>
                <select
                  value={studentReg}
                  onChange={(e) => setStudentReg(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-bold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.regNumber}>
                      {s.nameEnglish} ({s.regNumber} - Roll: {s.rollNumber} - {s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Examination Name</label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bangla Marks (100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={banglaMarks}
                    onChange={(e) => setBanglaMarks(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-2 py-1.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">English Marks (100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={englishMarks}
                    onChange={(e) => setEnglishMarks(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-2 py-1.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Math Marks (100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={mathMarks}
                    onChange={(e) => setMathMarks(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-2 py-1.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Science Marks (100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scienceMarks}
                    onChange={(e) => setScienceMarks(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-2 py-1.5 border rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Religion Marks (100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={religionMarks}
                    onChange={(e) => setReligionMarks(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-2 py-1.5 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Remarks</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMarksModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-900 text-white font-bold px-5 py-2 rounded-lg"
                >
                  Publish Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
