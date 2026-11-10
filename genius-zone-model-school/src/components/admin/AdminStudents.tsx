/**
 * Admin Student Management Module for Genius Zone Model School (GZMS)
 * Supports Student list, Search, Add/Edit student, QR Card preview, and Promotion.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { formatRollNumber, generateNextRegNumber } from '../../utils/schoolRules';
import type { StudentProfile } from '../../types';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  QrCode,
  CheckCircle2,
  X,
  GraduationCap,
  Download,
  Filter,
} from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const { showToast, t } = useApp();
  const students = schoolStorage.getStudents();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingQrStudent, setViewingQrStudent] = useState<StudentProfile | null>(null);

  // Form states
  const [nameEnglish, setNameEnglish] = useState('');
  const [nameBangla, setNameBangla] = useState('');
  const [className, setClassName] = useState('Class 5');
  const [section, setSection] = useState('A');
  const [rollNumber, setRollNumber] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [fatherNameEnglish, setFatherNameEnglish] = useState('');
  const [motherNameEnglish, setMotherNameEnglish] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [village, setVillage] = useState('Balachowra');
  const [postOffice, setPostOffice] = useState('Badarganj');
  const [upazila, setUpazila] = useState('Badarganj');
  const [district, setDistrict] = useState('Rangpur');
  const [presentAddress, setPresentAddress] = useState('Balachowra, Badarganj, Rangpur');
  const [scholarshipPct, setScholarshipPct] = useState(0);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nameBangla && s.nameBangla.includes(searchQuery)) ||
      s.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.includes(searchQuery);

    const matchesClass = selectedClass === 'ALL' || s.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEnglish.trim() || !fatherNameEnglish.trim() || !guardianPhone.trim()) {
      showToast('Please fill all mandatory fields.', 'error');
      return;
    }

    const newStudent = schoolStorage.addStudent({
      nameEnglish: nameEnglish.trim().toUpperCase(),
      nameBangla: nameBangla.trim(),
      className,
      section,
      rollNumber: rollNumber || String(students.length + 1),
      gender,
      dateOfBirth: '2014-01-01',
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
      session: '2026',
      village,
      postOffice,
      upazila,
      district,
      country: 'Bangladesh',
      fatherNameEnglish: fatherNameEnglish.trim().toUpperCase(),
      motherNameEnglish: motherNameEnglish.trim().toUpperCase(),
      guardianPhone: guardianPhone.trim(),
      presentAddress,
      permanentAddress: presentAddress,
      status: 'ACTIVE',
      admissionDate: new Date().toISOString().split('T')[0],
      scholarshipPct,
    });

    showToast(`Student ${newStudent.nameEnglish} added with ${newStudent.regNumber}!`, 'success');
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete student: ${name}?`)) {
      schoolStorage.deleteStudent(id);
      showToast(`Student ${name} deleted.`, 'info');
    }
  };

  const resetForm = () => {
    setNameEnglish('');
    setNameBangla('');
    setRollNumber('');
    setFatherNameEnglish('');
    setMotherNameEnglish('');
    setGuardianPhone('');
    setScholarshipPct(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('নাম, রোল বা রেজিঃ খুঁজুন...', 'Search name, roll, reg...')}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white"
          >
            <option value="ALL">{t('সকল শ্রেণী (All Classes)', 'All Classes')}</option>
            {['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>{t('নতুন শিক্ষার্থী যোগ করুন', 'Add New Student')}</span>
        </button>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">শিক্ষার্থী (Student)</th>
                <th className="p-3">রেজিঃ নম্বর</th>
                <th className="p-3">শ্রেণী ও শাখা</th>
                <th className="p-3">রোল</th>
                <th className="p-3">অভিভাবক ও মোবাইল</th>
                <th className="p-3">বৃত্তি/ছাড়</th>
                <th className="p-3">স্ট্যাটাস</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={std.photoUrl}
                          alt={std.nameEnglish}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{std.nameEnglish}</p>
                          <p className="text-[11px] text-slate-500">{std.nameBangla || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-700">
                      {std.regNumber}
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      {std.className} ({std.section})
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {std.rollNumber}
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-800">{std.fatherNameEnglish}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{std.guardianPhone}</p>
                    </td>
                    <td className="p-3">
                      {std.scholarshipPct && std.scholarshipPct > 0 ? (
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                          {std.scholarshipPct}% Waiver
                        </span>
                      ) : (
                        <span className="text-slate-400">Regular</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {std.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingQrStudent(std)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors"
                          title="View QR Card"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(std.id, std.nameEnglish)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                          title="Delete"
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
                    No students matched the query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">নতুন শিক্ষার্থী নিবন্ধন (Add Student)</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Student Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={nameEnglish}
                    onChange={(e) => setNameEnglish(e.target.value.toUpperCase())}
                    placeholder="DELOWAR HOSSAIN"
                    className="w-full px-3 py-2 border rounded-lg uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">নাম (বাংলায়)</label>
                  <input
                    type="text"
                    value={nameBangla}
                    onChange={(e) => setNameBangla(e.target.value)}
                    placeholder="দেলোয়ার হোসেন"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Class</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-semibold"
                  >
                    {['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Class Roll</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="Auto or e.g. 0001"
                    className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Father's Name (BLOCK) *</label>
                  <input
                    type="text"
                    required
                    value={fatherNameEnglish}
                    onChange={(e) => setFatherNameEnglish(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border rounded-lg uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mother's Name (BLOCK) *</label>
                  <input
                    type="text"
                    required
                    value={motherNameEnglish}
                    onChange={(e) => setMotherNameEnglish(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border rounded-lg uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Guardian Phone *</label>
                  <input
                    type="tel"
                    required
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Scholarship / Waiver %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scholarshipPct}
                    onChange={(e) => setScholarshipPct(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Present Address</label>
                <input
                  type="text"
                  value={presentAddress}
                  onChange={(e) => setPresentAddress(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-900 text-white font-bold px-5 py-2 rounded-lg"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code ID Card View Modal */}
      {viewingQrStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-xs bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-600 p-6 text-center">
            <button
              onClick={() => setViewingQrStudent(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-blue-950 text-white py-1 px-3 rounded-md mb-3">
              <span className="text-[10px] font-black tracking-widest uppercase">GZMS STUDENT ID</span>
            </div>

            <img
              src={viewingQrStudent.photoUrl}
              alt={viewingQrStudent.nameEnglish}
              className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-amber-400 shadow-md mb-2"
            />

            <h4 className="font-black text-sm text-slate-900 leading-tight">
              {viewingQrStudent.nameEnglish}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {viewingQrStudent.className} • Roll: {viewingQrStudent.rollNumber}
            </p>

            <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block shadow-inner">
              {/* Virtual QR representation */}
              <div className="w-28 h-28 bg-white border border-slate-300 p-2 flex flex-col items-center justify-center">
                <QrCode className="w-20 h-20 text-blue-950" />
                <span className="text-[8px] font-mono font-bold text-slate-600 mt-1">
                  {viewingQrStudent.regNumber}
                </span>
              </div>
            </div>

            <p className="text-xs font-mono font-black text-blue-900 bg-blue-50 py-1 rounded">
              Reg: {viewingQrStudent.regNumber}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
