/**
 * Student & Guardian Portal for Genius Zone Model School (GZMS)
 * Digital student ID card with QR, academic results & marks, attendance, homework, bKash fee payment, and admit cards.
 */

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { generateAdmitCardPDF, generateFeeChallanPDF, generateResultCardPDF } from '../../services/pdfGenerator';
import type { StudentProfile, FeePayment } from '../../types';
import {
  User,
  QrCode,
  Award,
  Calendar,
  CreditCard,
  Download,
  BookOpen,
  FileCheck,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Smartphone,
  Phone,
  KeyRound,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, setActiveTab, setIsApplicationModalOpen, setIsChangePasswordModalOpen, showToast, t } = useApp();

  const students = schoolStorage.getStudents();
  // Find linked student or fallback to first student (Tanvir Ahmed GZMS0001)
  const student: StudentProfile =
    students.find((s) => s.id === currentUser?.linkedStudentId || s.regNumber === currentUser?.username) ||
    students[0];

  const results = schoolStorage.getResults().filter((r) => r.studentReg === student?.regNumber);
  const payments = schoolStorage.getPayments().filter((p) => p.studentReg === student?.regNumber);
  const homeworkList = schoolStorage.get<any[]>('gzms_homework', []);
  const classHomework = homeworkList.filter((h) => h.className === student?.className);

  const [activeTabSub, setActiveTabSub] = useState<'ID_CARD' | 'RESULTS' | 'FEES' | 'HOMEWORK' | 'ADMIT_CARD'>('ID_CARD');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    if (student) {
      const payload = JSON.stringify({
        name: student.nameEnglish,
        username: student.regNumber,
        regNumber: student.regNumber,
        rollNumber: student.rollNumber,
        className: student.className,
        schoolShortName: 'GZMS',
      });
      QRCode.toDataURL(payload, {
        width: 180,
        margin: 1,
        color: { dark: '#1e3a8a', light: '#ffffff' },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Failed to generate student card QR:', err));
    }
  }, [student]);

  // bKash submission form state
  const [payAmount, setPayAmount] = useState(1200);
  const [payCategory, setPayCategory] = useState<FeePayment['category']>('Monthly Tuition');
  const [senderPhone, setSenderPhone] = useState(student?.guardianPhone || '017XXXXXXXX');
  const [trxId, setTrxId] = useState('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim() || !senderPhone.trim()) {
      showToast('Please provide bKash Sender Phone and TrxID.', 'error');
      return;
    }

    setIsSubmittingPay(true);
    const newPay = schoolStorage.submitFeePayment({
      studentId: student.id,
      studentReg: student.regNumber,
      studentName: student.nameEnglish,
      className: student.className,
      rollNumber: student.rollNumber,
      category: payCategory,
      amount: payAmount,
      paymentMethod: 'bKash',
      bkashSenderPhone: senderPhone,
      transactionId: trxId.trim().toUpperCase(),
      monthCovered: 'November 2026',
    });

    setIsSubmittingPay(false);
    showToast(`Payment of BDT ${payAmount} logged with TrxID: ${newPay.transactionId}! Awaiting Admin approval.`, 'success');
    setTrxId('');
  };

  const handleDownloadAdmitCard = () => {
    const subjects = ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'General Mathematics', 'General Science', 'Religion'];
    generateAdmitCardPDF(student, 'First Terminal Examination 2026', subjects);
    showToast(`Downloaded Admit Card for ${student.nameEnglish}!`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      {/* Top Banner Header */}
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
              <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                STUDENT & GUARDIAN PORTAL
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {student.nameEnglish} ({student.nameBangla})
              </h1>
              <p className="text-xs text-blue-200">
                Class: {student.className} • Roll: {student.rollNumber} • Reg: <span className="font-mono font-bold text-amber-300">{student.regNumber}</span>
              </p>
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
              onClick={handleDownloadAdmitCard}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              <FileCheck className="w-4 h-4 text-blue-950" />
              <span>{t('প্রবেশপত্র (Admit Card)', 'Admit Card')}</span>
            </button>

            <button
              onClick={() => setIsApplicationModalOpen(true)}
              className="bg-blue-800 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs border border-blue-600"
            >
              <span>{t('ছুটি / আবেদন', 'Application')}</span>
            </button>
          </div>
        </div>

        {/* Subtabs Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-blue-800/80 pt-2 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTabSub('ID_CARD')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTabSub === 'ID_CARD' ? 'bg-white text-blue-950 shadow-md font-black' : 'text-blue-200 hover:text-white'
            }`}
          >
            {t('ডিজিটাল আইডি ও QR', 'Digital ID & QR')}
          </button>
          <button
            onClick={() => setActiveTabSub('RESULTS')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTabSub === 'RESULTS' ? 'bg-white text-blue-950 shadow-md font-black' : 'text-blue-200 hover:text-white'
            }`}
          >
            {t('একাডেমিক ফলাফল ও GPA', 'Results & GPA')}
          </button>
          <button
            onClick={() => setActiveTabSub('FEES')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTabSub === 'FEES' ? 'bg-white text-blue-950 shadow-md font-black' : 'text-blue-200 hover:text-white'
            }`}
          >
            {t('বেতন খতিয়ান ও বিকাশ ফি', 'Fees & bKash')}
          </button>
          <button
            onClick={() => setActiveTabSub('HOMEWORK')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTabSub === 'HOMEWORK' ? 'bg-white text-blue-950 shadow-md font-black' : 'text-blue-200 hover:text-white'
            }`}
          >
            {t('হোমওয়ার্ক ও মূল্যায়ন', 'Homework')}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {/* Digital ID Card & Attendance Tab */}
        {activeTabSub === 'ID_CARD' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Student ID Badge Card */}
            <div className="md:col-span-5 max-w-sm mx-auto w-full bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-blue-600 relative text-center">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                  GENIUS ZONE MODEL SCHOOL
                </span>
                <h3 className="text-xs font-bold text-blue-100">স্টুডেন্ট আইডি কার্ড • STUDENT ID</h3>
              </div>

              <div className="p-6 space-y-3">
                <img
                  src={student.photoUrl}
                  alt={student.nameEnglish}
                  className="w-24 h-24 rounded-2xl object-cover mx-auto border-4 border-amber-400 shadow-md"
                />

                <div>
                  <h4 className="text-base font-black text-slate-900">{student.nameEnglish}</h4>
                  <p className="text-xs font-bold text-slate-500">{student.nameBangla}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border text-xs space-y-1 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Class:</span>
                    <span className="font-bold text-slate-900">{student.className} (Sec: {student.section})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Roll:</span>
                    <span className="font-mono font-bold text-slate-900">{student.rollNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registration:</span>
                    <span className="font-mono font-bold text-blue-700">{student.regNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Session:</span>
                    <span className="font-bold text-slate-900">{student.session}</span>
                  </div>
                </div>

                {/* QR Code containing Name and Username */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 inline-block w-full max-w-[220px] mx-auto shadow-2xs">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt={`QR Code for ${student.nameEnglish}`}
                      className="w-28 h-28 mx-auto rounded-lg border border-slate-200 bg-white p-1"
                    />
                  ) : (
                    <div className="w-28 h-28 mx-auto flex items-center justify-center bg-white rounded-lg border border-slate-200">
                      <QrCode className="w-20 h-20 text-blue-950 animate-pulse" />
                    </div>
                  )}
                  <div className="mt-2 pt-2 border-t border-slate-200 text-left space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-800 truncate">
                      <span className="text-slate-500 font-medium">Name:</span> {student.nameEnglish}
                    </p>
                    <p className="text-[10px] font-mono font-bold text-blue-800">
                      <span className="text-slate-500 font-sans font-medium">Username:</span> {student.regNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-400 p-2 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                Where Dreams Come True • Balachowra, Badarganj
              </div>
            </div>

            {/* Attendance & Profile Overview */}
            <div className="md:col-span-7 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-black text-base text-slate-900 border-b pb-2">
                  {t('ব্যক্তিগত ও অভিভাবক তথ্য', 'Personal & Guardian Details')}
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Father's Name:</span>
                    <span className="font-bold text-slate-900">{student.fatherNameEnglish}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Mother's Name:</span>
                    <span className="font-bold text-slate-900">{student.motherNameEnglish}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Guardian Phone:</span>
                    <span className="font-mono font-bold text-slate-900">{student.guardianPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Scholarship Status:</span>
                    <span className="font-bold text-amber-600">{student.scholarshipPct || 0}% Waiver</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">Present Address:</span>
                    <span className="text-slate-900">{student.presentAddress}</span>
                  </div>
                </div>
              </div>

              {/* Attendance Metric */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-100">
                    {t('ডিজিটাল কিউআর হাজিরা পরিসংখ্যান', 'Smart Attendance Summary')}
                  </span>
                  <h4 className="text-3xl font-black font-mono mt-1">৯৭.৮% (97.8%)</h4>
                  <p className="text-xs text-emerald-100 mt-1">
                    {t('মোট কার্যদিবস: ৯২ দিন • উপস্থিত: ৯০ দিন', 'Total Working Days: 92 • Present: 90 Days')}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white">
                  <Calendar className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTabSub === 'RESULTS' && (
          <div className="space-y-4">
            {results.length > 0 ? (
              results.map((res) => (
                <div key={res.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b">
                    <div>
                      <h4 className="text-lg font-black text-slate-900">{res.examName}</h4>
                      <p className="text-xs text-slate-500">
                        {res.className} • Roll: {res.rollNumber} • Position: {res.positionInClass ? `Rank ${res.positionInClass}` : 'Top 10%'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-800 font-black px-3 py-1 rounded-full text-xs">
                        GPA {res.overallGpa.toFixed(2)} ({res.finalGrade})
                      </span>
                      <button
                        onClick={() => generateResultCardPDF(res)}
                        className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('মার্কশিট ডাউনলোড', 'Download PDF')}</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-700 font-bold">
                        <tr>
                          <th className="p-2.5">Subject</th>
                          <th className="p-2.5 text-center">Marks</th>
                          <th className="p-2.5 text-center">Grade</th>
                          <th className="p-2.5 text-center">GPA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {res.subjects.map((s, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-medium text-slate-900">{s.subjectName}</td>
                            <td className="p-2.5 text-center font-bold text-slate-900">{s.marks}</td>
                            <td className="p-2.5 text-center font-bold text-blue-700">{s.letterGrade}</td>
                            <td className="p-2.5 text-center font-mono">{s.gpa.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-2xl border text-center text-slate-400">
                No exam results published yet for this session.
              </div>
            )}
          </div>
        )}

        {/* Fees & bKash Payment Tab */}
        {activeTabSub === 'FEES' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* bKash Payment Submission Form */}
            <form onSubmit={handlePaySubmit} className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <div className="flex items-center gap-2 pb-3 border-b">
                <div className="p-2 rounded-xl bg-pink-100 text-pink-700 font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">বিকাশ ফি পেমেন্ট ও TrxID দাখিল</h4>
                  <p className="text-[11px] text-slate-500">Genius Zone bKash Portal</p>
                </div>
              </div>

              {/* bKash instructions badge */}
              <div className="bg-pink-50 p-3.5 rounded-xl border border-pink-200 space-y-1 text-pink-950">
                <p className="font-bold text-xs">বিকাশ পেমেন্ট নিয়মাবলী:</p>
                <p>১. আপনার বিকাশ অ্যাপ থেকে "Send Money" বা "Payment" করুন এই নম্বরে: <strong className="font-mono text-pink-900">01308177171</strong></p>
                <p>২. ট্রানজেকশন সফল হলে পাওয়া TrxID নিচে লিখুন।</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ফি ক্যাটাগরি *</label>
                <select
                  value={payCategory}
                  onChange={(e) => setPayCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg font-semibold"
                >
                  <option value="Monthly Tuition">Monthly Tuition Fee</option>
                  <option value="Admission Fee">Admission Fee</option>
                  <option value="Exam Fee">Examination Fee</option>
                  <option value="Session Fee">Session Fee</option>
                  <option value="Other">Other Charges</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">টাকার পরিমাণ (BDT) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 border rounded-lg font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">প্রেরক বিকাশ নম্বর *</label>
                <input
                  type="tel"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">বিকাশ ট্রানজেকশন আইডি (TrxID) *</label>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                  placeholder="BK9A77X120"
                  className="w-full px-3 py-2 border rounded-lg font-mono font-black uppercase text-blue-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingPay}
                className="w-full bg-pink-700 hover:bg-pink-800 text-white font-bold py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-xs"
              >
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>পেমেন্ট তথ্য দাখিল করুন</span>
              </button>
            </form>

            {/* Payment History & Downloadable Challan */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-black text-sm text-slate-900 border-b pb-2">
                ফি পরিশোধের ইতিহাস ও মানি রিসিট (Challan)
              </h4>

              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-900 text-xs">{p.challanNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            p.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status === 'APPROVED' ? 'PAID • পরিশোধিত' : 'Pending Verification'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 mt-1">{p.category} — BDT {p.amount.toLocaleString()}</p>
                      <p className="text-[11px] text-slate-500 font-mono">TrxID: {p.transactionId} • {p.paymentDate}</p>
                    </div>

                    <button
                      onClick={() => generateFeeChallanPDF(p, student)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-600" />
                      <span>রসিদ</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Homework Tab */}
        {activeTabSub === 'HOMEWORK' && (
          <div className="space-y-4">
            {classHomework.length > 0 ? (
              classHomework.map((hw) => (
                <div key={hw.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded">
                        {hw.subject}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{hw.topic}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                      Due: {hw.dueDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{hw.description}</p>
                  <p className="text-[11px] text-slate-400">Assigned by: {hw.teacherName}</p>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-2xl border text-center text-slate-400">
                No active homework assigned for your class today.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
