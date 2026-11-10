/**
 * Fee Management & bKash Transaction Verification Module for GZMS
 * Approves/rejects bKash payments, updates ledger, and issues official Fee Challan PDF.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { generateFeeChallanPDF } from '../../services/pdfGenerator';
import type { FeePayment } from '../../types';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminFees: React.FC = () => {
  const { showToast, t } = useApp();
  const payments = schoolStorage.getPayments();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentReg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.challanNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = payments
    .filter((p) => p.status === 'APPROVED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingTotal = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleApprove = (payment: FeePayment) => {
    schoolStorage.verifyPayment(payment.id, 'APPROVED', 'Transaction verified through bKash merchant ledger');
    showToast(`Payment of BDT ${payment.amount} for ${payment.studentName} APPROVED!`, 'success');
    generateFeeChallanPDF({ ...payment, status: 'APPROVED' });
  };

  const handleReject = (payment: FeePayment) => {
    const reason = prompt(`Enter rejection reason for transaction ${payment.transactionId}:`, 'Invalid TrxID or amount mismatch');
    if (reason) {
      schoolStorage.verifyPayment(payment.id, 'REJECTED', reason);
      showToast(`Payment transaction ${payment.transactionId} REJECTED.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-emerald-800 block mb-1">
            {t('অনুমোদিত ও সংগৃহীত ফি', 'Total Verified Fee Collection')}
          </span>
          <p className="text-2xl font-black text-emerald-950 font-mono">
            BDT {totalCollected.toLocaleString()} /-
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold">{t('যাচাইকৃত নিশ্চিত ফি', 'Approved payments')}</span>
        </div>

        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-amber-800 block mb-1">
            {t('যাচাই অপেক্ষমান ফি (বিকাশ)', 'Pending bKash Approvals')}
          </span>
          <p className="text-2xl font-black text-amber-950 font-mono">
            BDT {pendingTotal.toLocaleString()} /-
          </p>
          <span className="text-[11px] text-amber-800 font-semibold">{t('অপেক্ষমান ট্রানজেকশনসমূহ', 'Awaiting verification')}</span>
        </div>

        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-blue-800 block mb-1">
            {t('বিকাশ মার্চেন্ট নম্বর', 'Official bKash Number')}
          </span>
          <p className="text-2xl font-black text-blue-950 font-mono">01308177171</p>
          <span className="text-[11px] text-blue-700 font-semibold">{t('ব্যক্তিগত/মার্চেন্ট একাউন্ট', 'Personal / Merchant Wallet')}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 sm:max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('শিক্ষার্থী, রেজিঃ নং বা TrxID দিয়ে খুঁজুন...', 'Search by student, reg no, or TrxID...')}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white"
          >
            <option value="ALL">{t('সকল পেমেন্ট (All Status)', 'All Payments')}</option>
            <option value="PENDING">{t('অপেক্ষমান (PENDING)', 'Pending Only')}</option>
            <option value="APPROVED">{t('অনুমোদিত (APPROVED)', 'Approved Only')}</option>
            <option value="REJECTED">{t('বাতিল (REJECTED)', 'Rejected Only')}</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">চালান নম্বর</th>
                <th className="p-3">শিক্ষার্থী (Student)</th>
                <th className="p-3">রেজিঃ ও রোল</th>
                <th className="p-3">ফি ক্যাটাগরি</th>
                <th className="p-3">পরিমাণ (BDT)</th>
                <th className="p-3">বিকাশ TrxID ও প্রেরক</th>
                <th className="p-3">তারিখ</th>
                <th className="p-3">স্ট্যাটাস</th>
                <th className="p-3 text-right">পদক্ষেপ (Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-800">{p.challanNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{p.studentName}</td>
                    <td className="p-3 font-mono text-slate-600">
                      <span className="font-bold text-blue-700">{p.studentReg}</span> (Roll: {p.rollNumber})
                    </td>
                    <td className="p-3 font-medium text-slate-800">{p.category}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      BDT {p.amount.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 block w-fit">
                        {p.transactionId}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                        Sender: {p.bkashSenderPhone || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{p.paymentDate}</td>
                    <td className="p-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          p.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status === 'APPROVED' ? 'PAID • অনুমোদিত' : p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => generateFeeChallanPDF(p)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                          title="Download Challan Receipt PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {p.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(p)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded-lg text-[11px] flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>অনুমোদন</span>
                            </button>
                            <button
                              onClick={() => handleReject(p)}
                              className="p-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                              title="Reject"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No fee payments matched the criteria.
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
