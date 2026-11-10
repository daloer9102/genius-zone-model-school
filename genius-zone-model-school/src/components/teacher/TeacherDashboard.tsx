/**
 * Teacher & Staff Dashboard for Genius Zone Model School (GZMS)
 * Class routine, student attendance, homework assignment & evaluation, and marks entry.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import {
  GraduationCap,
  CalendarCheck,
  BookOpen,
  QrCode,
  Plus,
  CheckCircle2,
  Clock,
  ArrowLeft,
  FileText,
  Star,
  UserCheck,
  KeyRound,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { currentUser, setActiveTab, setIsScannerModalOpen, setIsApplicationModalOpen, setIsChangePasswordModalOpen, showToast, t } = useApp();
  const students = schoolStorage.getStudents();
  const homeworkList = schoolStorage.get('gzms_homework', []);

  const [activeTabSub, setActiveTabSub] = useState<'ROUTINE' | 'HOMEWORK' | 'ATTENDANCE' | 'MARKS'>('ROUTINE');

  // Homework creation state
  const [selectedClass, setSelectedClass] = useState('Class 5');
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-15');

  const routines = [
    { time: '09:30 AM - 10:15 AM', class: 'Class 5', subject: 'Mathematics', room: 'Room 201' },
    { time: '10:15 AM - 11:00 AM', class: 'Class 6', subject: 'Higher Math / ICT', room: 'Room 202' },
    { time: '11:15 AM - 12:00 PM', class: 'Class 8', subject: 'Mathematics', room: 'Room 204' },
    { time: '01:30 PM - 02:15 PM', class: 'Class 7', subject: 'Science & Lab', room: 'Science Lab' },
  ];

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !description.trim()) {
      showToast('Please fill all homework fields.', 'error');
      return;
    }

    const currentHw = schoolStorage.get<any[]>('gzms_homework', []);
    const newHw = {
      id: `hw-${Date.now()}`,
      teacherId: currentUser?.linkedTeacherId || 't-1',
      teacherName: currentUser?.nameEnglish || 'Teacher',
      className: selectedClass,
      subject,
      topic,
      description,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
    };

    schoolStorage['set']('gzms_homework', [newHw, ...currentHw]);
    showToast(`Homework for ${selectedClass} (${subject}) assigned successfully!`, 'success');
    setTopic('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="p-2 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-blue-200 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="bg-blue-800 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                TEACHER PORTAL
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {currentUser?.nameEnglish || 'Teacher Portal'} ({currentUser?.nameBangla})
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="bg-blue-800/80 hover:bg-blue-800 text-amber-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-blue-600 transition-all active:scale-95"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('পাসওয়ার্ড পরিবর্তন', 'Change Password')}</span>
            </button>
            <button
              onClick={() => setIsScannerModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              <QrCode className="w-4 h-4" />
              <span>{t('হাজিরা স্ক্যানার', 'QR Scanner')}</span>
            </button>
            <button
              onClick={() => setIsApplicationModalOpen(true)}
              className="bg-blue-800 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-blue-600"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{t('ছুটির দরখাস্ত', 'Leave Request')}</span>
            </button>
          </div>
        </div>

        {/* Subtabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-blue-800/80 pt-2 pb-1">
          <button
            onClick={() => setActiveTabSub('ROUTINE')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTabSub === 'ROUTINE' ? 'bg-white text-blue-950 shadow-md font-black' : 'text-blue-200 hover:text-white'
            }`}
          >
            {t('আজকের ক্লাস রুটিন', "Today's Schedule")}
          </button>
          <button
            onClick={() => setActiveTabSub('HOMEWORK')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTabSub === 'HOMEWORK' ? 'bg-white text-blue-950 shadow-md font-black' : 'text-blue-200 hover:text-white'
            }`}
          >
            {t('হোমওয়ার্ক প্রদান ও মূল্যায়ন', 'Homework Management')}
          </button>
          <button
            onClick={() => setActiveTabSub('ATTENDANCE')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTabSub === 'ATTENDANCE' ? 'bg-white text-blue-950 shadow-md font-black' : 'text-blue-200 hover:text-white'
            }`}
          >
            {t('শিক্ষার্থীদের তালিকা ও রোল কল', 'Class Students')}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {activeTabSub === 'ROUTINE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {routines.map((r, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                  Period {i + 1}
                </span>
                <h3 className="text-base font-black text-slate-900">{r.subject}</h3>
                <p className="text-xs font-bold text-slate-700">{r.class} • {r.room}</p>
                <div className="pt-2 border-t text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTabSub === 'HOMEWORK' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleCreateHomework} className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <h4 className="font-black text-sm text-slate-900 border-b pb-2">নতুন হোমওয়ার্ক প্রদান করুন</h4>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-semibold"
                >
                  {['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject</label>
                {schoolStorage.getClassSubjects(selectedClass).length > 0 ? (
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-semibold bg-white text-slate-900"
                  >
                    {schoolStorage.getClassSubjects(selectedClass).map((sub) => (
                      <option key={sub.id} value={sub.subjectNameEnglish}>
                        {sub.subjectNameEnglish} ({sub.subjectNameBangla})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-slate-900"
                  />
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Topic / অধ্যায়</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="ভগ্নাংশ ও দশমিকের গুণ-ভাগ"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / নির্দেশনাবলী</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="অনুশীলনী ৪.২ এর ১ থেকে ১০ নম্বর সমাধান করো..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">জমাদানের শেষ তারিখ (Due Date)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white font-bold py-2 rounded-xl text-xs mt-2"
              >
                হোমওয়ার্ক এসাইন করুন
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                সম্প্রতি প্রদত্ত হোমওয়ার্ক ও মূল্যায়ন
              </h4>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                      Class 5 • Mathematics
                    </span>
                    <h5 className="font-bold text-sm text-slate-900 mt-1">Fractions and Decimals Exercise 4.2</h5>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">Due: 2026-11-12</span>
                </div>
                <p className="text-xs text-slate-600">
                  Solve Exercise 4.2 Problems 1 to 10 in your exercise book. Write down all steps clearly.
                </p>
                <div className="pt-2 border-t flex justify-between items-center text-xs">
                  <span className="text-slate-500">Submissions: 3 pupils</span>
                  <div className="flex items-center gap-1 text-emerald-700 font-bold">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Evaluation: Best (2), Good (1)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTabSub === 'ATTENDANCE' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b flex justify-between items-center text-xs font-bold text-slate-800">
              <span>শিক্ষার্থীদের প্রোফাইল ও হাজিরা রেকর্ড</span>
              <span>Total: {students.length} Pupils</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3">শিক্ষার্থী</th>
                    <th className="p-3">রেজিঃ নম্বর</th>
                    <th className="p-3">শ্রেণী ও রোল</th>
                    <th className="p-3">অভিভাবক ফোন</th>
                    <th className="p-3">হাজিরা শতাংশ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{s.nameEnglish} ({s.nameBangla})</td>
                      <td className="p-3 font-mono font-bold text-blue-700">{s.regNumber}</td>
                      <td className="p-3 text-slate-700">{s.className} (Roll: {s.rollNumber})</td>
                      <td className="p-3 font-mono text-slate-600">{s.guardianPhone}</td>
                      <td className="p-3 font-bold text-emerald-700">96.5% Present</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
