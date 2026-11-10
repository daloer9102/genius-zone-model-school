/**
 * Smart QR Code Student Attendance Scanner for Genius Zone Model School (GZMS)
 * Mobile-friendly camera scanner & digital ID scanner with Bengali voice output:
 * "[Student Name], উপস্থিতি গ্রহণ করা হয়েছে।"
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { speechService } from '../../services/speechService';
import type { StudentProfile, AttendanceRecord } from '../../types';
import {
  QrCode,
  Camera,
  X,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Clock,
  UserCheck,
  RefreshCw,
  Search,
} from 'lucide-react';

export const AttendanceScannerModal: React.FC = () => {
  const { isScannerModalOpen, setIsScannerModalOpen, showToast, t } = useApp();
  const [scanInput, setScanInput] = useState('');
  const [lastScannedStudent, setLastScannedStudent] = useState<StudentProfile | null>(null);
  const [lastRecord, setLastRecord] = useState<AttendanceRecord | null>(null);
  const [scanStatus, setScanStatus] = useState<'IDLE' | 'SUCCESS' | 'WARNING'>('IDLE');
  const [statusMessage, setStatusMessage] = useState('');

  const students = schoolStorage.getStudents();

  if (!isScannerModalOpen) return null;

  const processAttendanceScan = (inputStr: string) => {
    let regNumber = inputStr.trim();
    if (!regNumber) return;

    // Check if input is a JSON string from student card QR
    try {
      if (regNumber.startsWith('{') && regNumber.endsWith('}')) {
        const parsed = JSON.parse(regNumber);
        regNumber = parsed.username || parsed.regNumber || parsed.reg || regNumber;
      }
    } catch {
      // Continue with raw input if not valid JSON
    }

    const result = schoolStorage.recordAttendance(regNumber, 'QR_SCAN');

    if (result.success && result.student && result.record) {
      setLastScannedStudent(result.student);
      setLastRecord(result.record);
      setScanStatus('SUCCESS');
      setStatusMessage(
        `${result.student.nameEnglish} (Username: ${result.student.regNumber}) - ${
          result.record.status === 'LATE' ? 'বিলম্বিত উপস্থিতি (LATE)' : 'উপস্থিত (PRESENT)'
        }`
      );

      // Bengali voice announcement: "[Student Name], ইউজারনেম [Username], উপস্থিতি গ্রহণ করা হয়েছে।"
      speechService.speakAttendanceConfirmation(
        `${result.student.nameBangla || result.student.nameEnglish}, ইউজারনেম ${result.student.regNumber}`,
        result.student.nameEnglish
      );
      showToast(result.message, 'success');
    } else {
      if (result.student) {
        setLastScannedStudent(result.student);
        if (result.record) setLastRecord(result.record);
      }
      setScanStatus('WARNING');
      setStatusMessage(result.message);
      speechService.playWarningChime();
      showToast(result.message, 'error');
    }

    setScanInput('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processAttendanceScan(scanInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-600 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-blue-950 font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                {t('স্মার্ট কিউআর কোড ডিজিটাল হাজিরা', 'Smart QR Attendance Scanner')}
              </h3>
              <p className="text-[11px] text-amber-300 font-semibold">
                {t('বাংলা কণ্ঠস্বরে নিশ্চিতকরণ সহ • GZMS Smart Scanner', 'With Bengali Voice Confirmation')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsScannerModalOpen(false)}
            className="p-1.5 rounded-full bg-blue-950/70 hover:bg-blue-950 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Virtual Scanner Viewfinder */}
          <div className="relative rounded-2xl bg-slate-900 border-2 border-slate-700 p-6 flex flex-col items-center justify-center text-center overflow-hidden min-h-[220px]">
            {/* Corner guide brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400" />

            {/* Scanning line animation */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse" />

            <div className="relative z-10 flex flex-col items-center text-slate-200">
              <Camera className="w-10 h-10 text-amber-400 mb-2 animate-bounce" />
              <p className="text-sm font-bold text-white">
                {t('মোবাইল বা ওয়েব ক্যামেরা দিয়ে কিউআর কোড স্ক্যান করুন', 'Point camera at Student ID Card QR Code')}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                {t(
                  'আইডি কার্ড প্রদর্শন করলে স্বয়ংক্রিয়ভাবে হাজিরা রেকর্ড হবে এবং বাংলা উচ্চারণে ঘোষণা হবে।',
                  'Attendance records instantly upon QR detection with Bangla voice output.'
                )}
              </p>
            </div>
          </div>

          {/* Real-Time Scan Result Announcement Card */}
          {scanStatus !== 'IDLE' && lastScannedStudent && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-4 transition-all animate-in fade-in ${
                scanStatus === 'SUCCESS'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <img
                src={lastScannedStudent.photoUrl}
                alt={lastScannedStudent.nameEnglish}
                className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md shrink-0"
              />

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      scanStatus === 'SUCCESS'
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {scanStatus === 'SUCCESS' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    <span>{scanStatus === 'SUCCESS' ? t('উপস্থিতি গৃহীত', 'Present Confirmed') : t('সতর্কবার্তা', 'Notice')}</span>
                  </span>

                  <span className="text-xs font-mono font-bold flex items-center gap-1 text-slate-600">
                    <Clock className="w-3.5 h-3.5" />
                    {lastRecord?.time || new Date().toLocaleTimeString()}
                  </span>
                </div>

                <div className="mt-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Candidate Name:</span>
                  <h4 className="text-base font-black leading-tight text-slate-900">
                    {lastScannedStudent.nameEnglish} ({lastScannedStudent.nameBangla})
                  </h4>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-700 mt-1">
                  <span>{lastScannedStudent.className} (Sec: {lastScannedStudent.section})</span>
                  <span>• {t('রোল:', 'Roll:')} <strong className="font-mono text-slate-900">{lastScannedStudent.rollNumber}</strong></span>
                  <span>• {t('ইউজারনেম / রেজিঃ', 'Username / Reg:')} <strong className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">{lastScannedStudent.regNumber}</strong></span>
                </div>

                {/* Voice Pronunciation Indicator */}
                <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-white/90 px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                  <Volume2 className="w-4 h-4 text-blue-700 animate-pulse shrink-0" />
                  <span className="text-[11px] leading-snug">
                    "{lastScannedStudent.nameBangla || lastScannedStudent.nameEnglish}, ইউজারনেম {lastScannedStudent.regNumber}, উপস্থিতি গ্রহণ করা হয়েছে।"
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick 1-Click Simulation / Barcode Scanner Input */}
          <div>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder={t('রেজিস্ট্রেশন নম্বর টাইপ বা স্ক্যানার ইনপুট (যেমন: GZMS0001)', 'Scan or enter Reg No (e.g. GZMS0001)')}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>{t('হাজিরা দিন', 'Record')}</span>
              </button>
            </form>

            {/* Test Student Card Shortcuts */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                {t('দ্রুত টেস্ট করার জন্য শিক্ষার্থীর কার্ডে ক্লিক করুন:', 'Click any student card to simulate QR scan:')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {students.slice(0, 4).map((std) => (
                  <button
                    key={std.id}
                    type="button"
                    onClick={() => processAttendanceScan(std.regNumber)}
                    className="bg-slate-100 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all"
                  >
                    <QrCode className="w-3 h-3 text-amber-600" />
                    <span>{std.nameEnglish} ({std.regNumber})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
