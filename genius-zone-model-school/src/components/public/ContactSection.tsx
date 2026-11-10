/**
 * Contact Form & School Location Section for Genius Zone Model School (GZMS)
 * Saves visitor inquiries into persistent database and displays in Admin.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Clock,
  CheckCircle2,
  Building,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { showToast, t } = useApp();
  const settings = schoolStorage.getSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast(t('অনুগ্রহ করে নাম, মোবাইল এবং বার্তা প্রদান করুন।', 'Please fill required contact fields.'), 'error');
      return;
    }

    schoolStorage.submitContactInquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim() || 'General Inquiry',
      message: message.trim(),
    });

    setSubmitted(true);
    showToast(t('আপনার বার্তা সফলভাবে প্রেরণ করা হয়েছে!', 'Your message has been received!'), 'success');
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            {t('যোগাযোগ ও অবস্থান', 'Contact & Location')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-blue-950 mt-3 tracking-tight">
            {t('আমাদের সাথে যোগাযোগ করুন', 'Get in Touch with Genius Zone')}
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                {t('বিদ্যালয়ের অফিসিয়াল যোগাযোগের ঠিকানা', 'Official School Information')}
              </h3>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-800 shrink-0">
                  <MapPin className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t('ঠিকানা', 'Campus Address')}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {t(settings.addressBangla, settings.addressEnglish)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 shrink-0">
                  <Phone className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t('মোবাইল ও হেল্পলাইন', 'Direct Phone')}</h4>
                  <a href={`tel:${settings.phone}`} className="text-xs font-black text-blue-800 hover:underline block mt-0.5">
                    {settings.phone}
                  </a>
                  <span className="text-[11px] text-slate-500">{t('সকাল ৮:০০ - বিকাল ৪:০০', '8:00 AM - 4:00 PM')}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t('ইমেইল', 'Official Email')}</h4>
                  <a href={`mailto:${settings.email}`} className="text-xs text-blue-800 hover:underline block mt-0.5 font-medium">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-800 shrink-0">
                  <Clock className="w-5 h-5 text-indigo-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t('কার্যদিবস ও সময়সূচি', 'Working Hours')}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {t('শনিবার – বৃহস্পতিবার: সকাল ৯:০০ টা – বিকাল ৩:৩০ টা', 'Saturday – Thursday: 9:00 AM – 3:30 PM')}
                  </p>
                  <p className="text-[11px] text-red-500 font-semibold">{t('শুক্রবার সাপ্তাহিক ছুটি', 'Friday: Weekly Holiday')}</p>
                </div>
              </div>
            </div>

            {/* Badarganj Campus Visual Card */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 relative h-48">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80"
                alt="Badarganj Rangpur Map Location"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md uppercase">
                  GZMS CAMPUS
                </span>
                <p className="text-xs font-bold mt-1 text-white">
                  Balachowra, Badarganj Upazila, Rangpur District
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
            <h3 className="text-lg font-black text-slate-900 mb-2">
              {t('আমাদের কোনো বার্তা বা প্রশ্ন পাঠান', 'Send Us a Message or Admission Inquiry')}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {t(
                'যেকোনো তথ্য, পরামর্শ বা ভর্তি সংক্রান্ত জিজ্ঞাসার জন্য নিচের ফরমটি পূরণ করুন। আমাদের প্রতিনিধি দ্রুত যোগাযোগ করবেন।',
                'Fill out this form for general inquiries or admission queries. Our administrative desk will respond promptly.'
              )}
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-emerald-950">
                  {t('আপনার বার্তা সফলভাবে গৃহীত হয়েছে!', 'Message Submitted Successfully!')}
                </h4>
                <p className="text-xs text-emerald-800">
                  {t('আমাদের পরিচালনা পরিষদ দ্রুত আপনার সাথে যোগাযোগ করবে। ধন্যবাদ।', 'Our administration desk will review your submission and contact you shortly.')}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  {t('আরেকটি বার্তা পাঠান', 'Send Another Message')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('আপনার নাম *', 'Full Name *')}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="মোঃ কামাল হোসেন"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('মোবাইল নম্বর *', 'Phone Number *')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('ইমেইল ঠিকানা', 'Email Address')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('বিষয় (Subject)', 'Subject')}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="ভর্তি তথ্য জানতে চাই"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('আপনার বার্তা বা মন্তব্য *', 'Message or Inquiry *')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>{t('বার্তা প্রেরণ করুন', 'Send Message')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
