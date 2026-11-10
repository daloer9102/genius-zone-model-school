/**
 * SMS Gateway & Automatic Message Management Module for Genius Zone Model School (GZMS)
 * Manages Bangla Unicode SMS templates, message queues, and Android phone SIM bridge (01308177171).
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { interpolateTemplate } from '../../utils/schoolRules';
import {
  Smartphone,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  Settings,
  Sparkles,
  Phone,
} from 'lucide-react';

export const AdminSMS: React.FC = () => {
  const { showToast, t } = useApp();
  const settings = schoolStorage.getSettings();
  const smsQueue = schoolStorage.getSmsQueue();

  const [activeTemplateKey, setActiveTemplateKey] = useState('ABSENT');
  const [recipientPhone, setRecipientPhone] = useState('01712998877');
  const [recipientName, setRecipientName] = useState('তানভীর আহমেদ');
  const [customMessage, setCustomMessage] = useState(
    'সম্মানিত অভিভাবক, আপনার সন্তান [Student Name] আজ [Date] তারিখে ক্লাসে অনুপস্থিত ছিল। — জিনিয়াস জোন মডেল স্কুল'
  );

  const defaultTemplates = [
    {
      key: 'ABSENT',
      nameBn: 'অনুপস্থিতি নোটিফিকেশন (Absence)',
      text: 'সম্মানিত অভিভাবক, আপনার সন্তান [Student Name] আজ [Date] তারিখে বিদ্যালয়ে উপস্থিত হয়নি। অনুগ্রহ করে যোগাযোগ করুন। — জিনিয়াস জোন মডেল স্কুল (01308177171)',
    },
    {
      key: 'FEE_DUE',
      nameBn: 'মাসিক বেতন বকেয়া (Fee Due)',
      text: 'সম্মানিত অভিভাবক, আপনার সন্তান [Student Name] (রোল: [Roll])-এর [Month] মাসের বেতন [Due Amount] টাকা বকেয়া রয়েছে। বিকাশ বা কাউন্টারে পরিশোধ করুন। — GZMS',
    },
    {
      key: 'EXAM_NOTICE',
      nameBn: 'পরীক্ষার প্রবেশপত্র বিজ্ঞপ্তি (Admit Card)',
      text: 'সম্মানিত অভিভাবক, [Student Name]-এর প্রথম সাময়িক পরীক্ষা আগামী সপ্তাহ থেকে শুরু হবে। ওয়েবসাইট থেকে প্রবেশপত্র সংগ্রহ করুন। — জিনিয়াস জোন মডেল স্কুল',
    },
    {
      key: 'RESULT',
      nameBn: 'ফলাফল প্রকাশ (Result Published)',
      text: 'অভিনন্দন! আপনার সন্তান [Student Name] পরীক্ষায় GPA [GPA] পেয়ে উত্তীর্ণ হয়েছে। বিস্তারিত মার্কশিট অনলাইন পোর্টালে দেখুন। — জিনিয়াস জোন মডেল স্কুল',
    },
    {
      key: 'PAYMENT_CONFIRM',
      nameBn: 'পেমেন্ট নিশ্চিতকরণ (Payment Confirmation)',
      text: 'আপনার বিকাশ পেমেন্ট (TrxID: [TrxID]) সফলভাবে গৃহীত হয়েছে। চালান নং: [Challan No]। ধন্যবাদ। — জিনিয়াস জোন মডেল স্কুল',
    },
  ];

  const handleSelectTemplate = (tpl: typeof defaultTemplates[0]) => {
    setActiveTemplateKey(tpl.key);
    setCustomMessage(tpl.text);
  };

  const handleSendSingleSms = (e: React.FormEvent) => {
    e.preventDefault();

    const resolved = interpolateTemplate(customMessage, {
      'Student Name': recipientName,
      Date: new Date().toLocaleDateString('bn-BD'),
      Roll: '0001',
      Class: 'Class 5',
      'Due Amount': '1,200',
      Month: 'November',
      GPA: '5.00',
      TrxID: 'BK9A77X120',
      'Challan No': 'CH-2026-0001',
    });

    schoolStorage.sendSms(recipientPhone, recipientName, activeTemplateKey, resolved);
    showToast(`SMS sent to ${recipientPhone} via SIM Bridge (01308177171)!`, 'success');
  };

  // Unicode character count
  const charCount = customMessage.length;
  const smsSegments = Math.ceil(charCount / 70); // Unicode SMS 70 chars per segment

  return (
    <div className="space-y-6">
      {/* Android SIM Bridge Status Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-2xl border-2 border-amber-400 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-blue-950 flex items-center justify-center font-bold shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base text-white">
                {t('অ্যান্ড্রয়েড সিম এসএমএস ব্রিজ সংযুক্ত', 'Android Phone SMS Bridge Active')}
              </h3>
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                Online
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              {t('প্রেরক সিম নম্বর:', 'Dedicated Gateway SIM:')} <span className="font-mono font-bold text-amber-300">01308177171</span> • Balachowra, Badarganj
            </p>
          </div>
        </div>

        <div className="text-right text-xs bg-blue-950/80 px-4 py-2.5 rounded-xl border border-blue-800">
          <span className="text-blue-300 block">{t('আজকে প্রেরিত মোট এসএমএস:', 'SMS Dispatched Today:')}</span>
          <span className="font-mono text-lg font-black text-amber-400">{smsQueue.length} Messages</span>
        </div>
      </div>

      {/* Templates & Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
            {t('এসএমএস টেমপ্লেট নির্বাচন করুন (Templates)', 'Select Message Template')}
          </h4>

          <div className="space-y-2">
            {defaultTemplates.map((tpl) => (
              <button
                key={tpl.key}
                onClick={() => handleSelectTemplate(tpl)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  activeTemplateKey === tpl.key
                    ? 'border-blue-600 bg-blue-50 text-blue-950 shadow-xs font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50'
                }`}
              >
                <span className="block font-bold text-blue-900 mb-0.5">{tpl.nameBn}</span>
                <span className="text-[11px] text-slate-500 line-clamp-1">{tpl.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Composer Form */}
        <form onSubmit={handleSendSingleSms} className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            {t('এসএমএস কম্পোজ ও সরাসরি প্রেরণ', 'Compose & Send SMS')}
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">প্রাপক মোবাইল নম্বর *</label>
              <input
                type="tel"
                required
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষার্থীর নাম</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">এসএমএস বার্তা (Bangla Unicode Text)</label>
              <span className="text-[11px] font-mono text-slate-500">
                {charCount} chars • {smsSegments} SMS {smsSegments > 1 ? '(Multi-part)' : ''}
              </span>
            </div>
            <textarea
              rows={4}
              required
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900 leading-relaxed font-sans"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-blue-700" />
              <span>Bridge: 01308177171</span>
            </span>

            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>{t('এসএমএস পাঠান', 'Dispatch SMS')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SMS Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-800">
            {t('এসএমএস প্রেরণের ইতিহাস ও ডেলিভারি লগ (Recent Dispatch Logs)', 'Recent SMS Logs')}
          </span>
          <span className="text-slate-500">{smsQueue.length} logs recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">প্রাপক ফোন</th>
                <th className="p-3">প্রাপক নাম</th>
                <th className="p-3">বার্তা (Message)</th>
                <th className="p-3">প্রেরণের সময়</th>
                <th className="p-3">গেটওয়ে রেসপন্স</th>
                <th className="p-3">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {smsQueue.length > 0 ? (
                smsQueue.slice(0, 10).map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-slate-900">{msg.recipientPhone}</td>
                    <td className="p-3 font-semibold text-slate-800">{msg.recipientName}</td>
                    <td className="p-3 text-slate-700 max-w-xs truncate">{msg.messageText}</td>
                    <td className="p-3 font-mono text-slate-500">
                      {new Date(msg.sentAt).toLocaleTimeString()}
                    </td>
                    <td className="p-3 text-[11px] text-slate-500">{msg.gatewayResponse}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        SENT • ডেলিভার্ড
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No SMS messages dispatched yet. Send your first message above!
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
