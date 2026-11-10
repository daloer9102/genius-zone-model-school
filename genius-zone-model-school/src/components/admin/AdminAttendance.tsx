/**
 * Admin Attendance Management & Guardian Absentee SMS Module for GZMS
 * Tracks daily presence, QR scans, 9:20 AM cutoff, and automated Bangla SMS broadcast.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { interpolateTemplate } from '../../utils/schoolRules';
import type { AttendanceRecord } from '../../types';
import {
  UserCheck,
  UserX,
  QrCode,
  Send,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Phone,
} from 'lucide-react';

export const AdminAttendance: React.FC = () => {
  const { showToast, setIsScannerModalOpen, t } = useApp();
  const settings = schoolStorage.getSettings();
  const attendanceRecords = schoolStorage.getAttendance();
  const absentStudents = schoolStorage.getTodayAbsentStudents();
  const students = schoolStorage.getStudents();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceRecords.filter((a) => a.date === todayStr);

  const [cutoffTime, setCutoffTime] = useState(settings.attendanceCutoffTime || '09:20');
  const [isBroadcastingSms, setIsBroadcastingSms] = useState(false);
  const [smsTemplate, setSmsTemplate] = useState(
    'সম্মানিত অভিভাবক, আপনার সন্তান [Student Name] আজ [Date] তারিখে বিদ্যালয়ে উপস্থিত হয়নি। অনুগ্রহ করে বিদ্যালয়ের সাথে যোগাযোগ করুন। — Genius Zone Model School (01308177171)'
  );

  const handleUpdateCutoff = (e: React.FormEvent) => {
    e.preventDefault();
    schoolStorage.updateSettings({ attendanceCutoffTime: cutoffTime });
    showToast(`Attendance closing cutoff updated to ${cutoffTime}!`, 'success');
  };

  const handleBroadcastAbsentSms = () => {
    if (absentStudents.length === 0) {
      showToast('All registered students are present today! No absentee SMS needed.', 'info');
      return;
    }

    setIsBroadcastingSms(true);
    let count = 0;

    absentStudents.forEach((std) => {
      const msg = interpolateTemplate(smsTemplate, {
        'Student Name': std.nameBangla || std.nameEnglish,
        Date: new Date().toLocaleDateString('bn-BD'),
        Roll: std.rollNumber,
        Class: std.className,
      });

      schoolStorage.sendSms(
        std.guardianPhone,
        std.fatherNameEnglish,
        'ABSENT_ALERT',
        msg
      );
      count++;
    });

    setTimeout(() => {
      setIsBroadcastingSms(false);
      showToast(`বাংলা অনুপস্থিতি এসএমএস সফলভাবে ${count} জন অভিভাবককে পাঠানো হয়েছে! (Bridge: ${settings.smsPhoneBridge})`, 'success');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">{t('আজকের তারিখ', "Today's Date")}</span>
            <Calendar className="w-4 h-4 text-blue-700" />
          </div>
          <p className="text-lg font-black text-slate-900">{todayStr}</p>
          <span className="text-[11px] text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
        </div>

        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold uppercase">{t('উপস্থিত শিক্ষার্থী', 'Present Today')}</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-950 font-mono">{todayRecords.length}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">
            {Math.round((todayRecords.length / Math.max(1, students.length)) * 100)}% {t('হাজিরা হার', 'Turnout')}
          </span>
        </div>

        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-bold uppercase">{t('অনুপস্থিত শিক্ষার্থী', 'Absent Today')}</span>
            <UserX className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-950 font-mono">{absentStudents.length}</p>
          <span className="text-[11px] text-amber-800 font-semibold">{t('এসএমএস নোটিফিকেশনযোগ্য', 'Eligible for SMS alert')}</span>
        </div>

        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 shadow-xs">
          <div className="flex items-center justify-between text-blue-800 mb-2">
            <span className="text-xs font-bold uppercase">{t('হাজিরা বন্ধের সময়', 'Cutoff Time')}</span>
            <Clock className="w-4 h-4 text-blue-700" />
          </div>
          <p className="text-2xl font-black text-blue-950 font-mono">{cutoffTime} AM</p>
          <span className="text-[11px] text-blue-700 font-semibold">{t('ডিফল্ট: ৯:২০ ঘটিকা', 'Default: 09:20 AM')}</span>
        </div>
      </div>

      {/* Control Actions & SMS Broadcast Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">
              {t('স্বয়ংক্রিয় অনুপস্থিতি শনাক্তকরণ ও বাংলা এসএমএস বার্তা', 'Automated Absentee Detection & Bangla SMS')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('সকাল ৯:২০ মিনিটে অনুপস্থিত শিক্ষার্থীদের চিহ্নিত করে অভিভাবকের মোবাইলে স্বয়ংক্রিয় এসএমএস প্রেরণ।', 'Scans attendance cutoff and alerts guardians via GSM/Android SIM bridge (01308177171).')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerModalOpen(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>{t('কিউআর স্ক্যানার খুলুন', 'Launch QR Scanner')}</span>
            </button>

            <button
              onClick={handleBroadcastAbsentSms}
              disabled={isBroadcastingSms || absentStudents.length === 0}
              className={`font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all ${
                absentStudents.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 border border-amber-400 active:scale-95'
              }`}
            >
              <Smartphone className="w-4 h-4 text-blue-950" />
              <span>
                {isBroadcastingSms ? t('এসএমএস পাঠানো হচ্ছে...', 'Broadcasting...') : t(`অনুপস্থিতদের এসএমএস পাঠান (${absentStudents.length})`, `Send SMS to ${absentStudents.length} Absentees`)}
              </span>
            </button>
          </div>
        </div>

        {/* SMS Preview & Cutoff Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('অভিভাবক এসএমএস টেমপ্লেট (Bangla Unicode SMS Template)', 'Bangla SMS Template')}
            </label>
            <textarea
              rows={2}
              value={smsTemplate}
              onChange={(e) => setSmsTemplate(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 text-slate-900 bg-white leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Placeholders: <span className="font-mono font-bold text-blue-800">[Student Name], [Date], [Class], [Roll]</span>
            </p>
          </div>

          <form onSubmit={handleUpdateCutoff} className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('হাজিরা বন্ধের সময় পরিবর্তন', 'Configure Cutoff Time')}
              </label>
              <input
                type="time"
                value={cutoffTime}
                onChange={(e) => setCutoffTime(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono font-bold text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-1.5 rounded-lg text-xs"
            >
              {t('সময় আপডেট করুন', 'Update Cutoff')}
            </button>
          </form>
        </div>
      </div>

      {/* Today's Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            {t('আজকের উপস্থিতির লগ রেকর্ড (Real-Time Attendance Log)', "Today's Attendance Records")}
          </h4>
          <span className="text-xs font-semibold text-slate-500">
            {todayRecords.length} records logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">শিক্ষার্থী (Student)</th>
                <th className="p-3">রেজিঃ নম্বর</th>
                <th className="p-3">শ্রেণী ও রোল</th>
                <th className="p-3">উপস্থিতির সময়</th>
                <th className="p-3">পদ্ধতি</th>
                <th className="p-3">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayRecords.length > 0 ? (
                todayRecords.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{att.studentName}</td>
                    <td className="p-3 font-mono font-bold text-blue-700">{att.studentReg}</td>
                    <td className="p-3 text-slate-700">{att.className} (Roll: {att.rollNumber})</td>
                    <td className="p-3 font-mono text-slate-900">{att.time}</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 w-fit">
                        <QrCode className="w-3 h-3 text-amber-600" />
                        <span>{att.method}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          att.status === 'PRESENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No attendance recorded yet today. Click "Launch QR Scanner" to scan student ID cards.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
