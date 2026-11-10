/**
 * Supabase Database Architecture & Deployment Instructions Module for GZMS
 * Displays full 36-table PostgreSQL migration script with 1-click copy & deployment guide.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPABASE_SQL_SCHEMA } from '../../services/databaseSql';
import {
  Database,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Server,
  Terminal,
} from 'lucide-react';

export const AdminSupabaseSql: React.FC = () => {
  const { showToast, t } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    showToast('Supabase SQL Schema copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SUPABASE_SQL_SCHEMA], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gzms_supabase_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded gzms_supabase_schema.sql!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-2xl border-2 border-amber-400 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                {t('সুনির্দিষ্ট সুপাবেস (Supabase) ডেটাবেস স্কিমা ও মাইগ্রেশন', 'Supabase PostgreSQL Database Architecture')}
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                {t('৩৬টি সম্পূর্ণ টেবিল, রিলেশনাল ফরেন কি, আরএলএস পলিসি ও সিকোয়েন্স জেনারেটর', 'Complete 36-table relational schema, RLS policies, indexes, and GZMS0001 sequence.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'কপিকৃত (Copied)' : 'সম্পূর্ণ SQL কপি করুন'}</span>
            </button>
            <button
              onClick={handleDownloadSql}
              className="bg-blue-800 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-blue-600"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>.SQL ফাইল</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deployment & Setup Steps Guide */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-700" />
          <span>{t('সুপাবেস (Supabase) ও ভার্সেল (Vercel) ডিপ্লয়মেন্ট নির্দেশিকা', 'Supabase + Vercel Deployment Instructions')}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">১</span>
            <h5 className="font-bold text-slate-900">১. সুপাবেস প্রজেক্ট তৈরি</h5>
            <p className="text-slate-600 leading-relaxed">
              <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-700 underline font-bold">
                supabase.com
              </a>-এ ফ্রি একাউন্ট খুলে "Genius Zone Model School" নামে নতুন প্রজেক্ট তৈরি করুন।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">২</span>
            <h5 className="font-bold text-slate-900">২. SQL এডিটরে পেস্ট করুন</h5>
            <p className="text-slate-600 leading-relaxed">
              সুপাবেস ড্যাশবোর্ডের বাম মেনু থেকে <strong>SQL Editor</strong>-এ গিয়ে "New Query" বাটনে ক্লিক করে নিচের সম্পূর্ণ SQL কোডটি পেস্ট করে <strong>RUN</strong> চাপুন।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">৩</span>
            <h5 className="font-bold text-slate-900">৩. Vercel এ সংযোগ করুন</h5>
            <p className="text-slate-600 leading-relaxed">
              প্রজেক্টের Settings থেকে <code>NEXT_PUBLIC_SUPABASE_URL</code> ও <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> কপি করে Vercel-এর Environment Variables-এ যুক্ত করুন।
            </p>
          </div>
        </div>
      </div>

      {/* SQL Code Viewer */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span className="font-mono font-bold text-amber-400 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>gzms_complete_database_schema.sql</span>
          </span>
          <button
            onClick={handleCopy}
            className="hover:text-white flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy</span>
          </button>
        </div>

        <pre className="p-5 text-xs text-emerald-400 font-mono overflow-x-auto max-h-[450px] leading-relaxed">
          {SUPABASE_SQL_SCHEMA}
        </pre>
      </div>
    </div>
  );
};
