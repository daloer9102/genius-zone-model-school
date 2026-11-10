/**
 * School Managing Committee Section for Genius Zone Model School (GZMS)
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Award, Shield } from 'lucide-react';

export const CommitteeSection: React.FC = () => {
  const { t } = useApp();

  const members = [
    {
      name: 'অধ্যক্ষ মোস্তাফিজুর রহমান',
      nameEn: 'Principal Mostafizur Rahman',
      designationBn: 'সভাপতি, পরিচালনা পরিষদ',
      designationEn: 'President, Managing Committee',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bioBn: 'বিশিষ্ট শিক্ষাবিদ ও সমাজসেবক। শিক্ষা বিস্তারে দীর্ঘ ২০ বছরের অনন্য অভিজ্ঞতা সম্পন্ন।',
      bioEn: 'Distinguished educationist and community leader with 20+ years of institutional stewardship.',
    },
    {
      name: 'মোঃ দেলোয়ার হোসেন',
      nameEn: 'Md. Delowar Hossain',
      designationBn: 'প্রতিষ্ঠাতা ও ব্যবস্থাপনা পরিচালক',
      designationEn: 'Founder & Managing Director',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      bioBn: 'তথ্যপ্রযুক্তিবিদ ও স্বপ্নদর্শী উদ্যোক্তা। প্রত্যন্ত অঞ্চলে আধুনিক আন্তর্জাতিক শিক্ষা প্রসারে নিবেদিত।',
      bioEn: 'Pioneering technology educator dedicated to bridging modern digital education in rural Bangladesh.',
    },
    {
      name: 'মোঃ রফিকুল ইসলাম',
      nameEn: 'Md. Rafiqul Islam',
      designationBn: 'সদস্য সচিব (প্রধান শিক্ষক)',
      designationEn: 'Member Secretary (Head Teacher)',
      photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
      bioBn: 'প্রথম শ্রেণীর এম.এসসি ও বি.এড ডিগ্রিধারী প্রবীণ শিক্ষাগুরু। সার্বিক একাডেমিক শৃঙ্খলার রূপকার।',
      bioEn: 'Senior education administrator and M.Sc holder overseeing curriculum quality and discipline.',
    },
    {
      name: 'সুলতানা রাজিয়া',
      nameEn: 'Sultana Razia',
      designationBn: 'অভিভাবক প্রতিনিধি সদস্য',
      designationEn: 'Guardian Representative Member',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      bioBn: 'সচেতন সমাজকর্মী এবং স্কুল ও অভিভাবকদের মেলবন্ধন রচনার সক্রিয় কণ্ঠস্বর।',
      bioEn: 'Active community representative fostering effective school-parent partnership.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            {t('সুশাসন ও অভিভাবকত্ব', 'School Governance')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-blue-950 mt-3 tracking-tight">
            {t('বিদ্যালয় পরিচালনা পরিষদ', 'School Managing Committee')}
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all text-center flex flex-col items-center"
            >
              <img
                src={m.photo}
                alt={m.nameEn}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-sm mb-4"
              />

              <h3 className="text-base font-black text-slate-900 leading-tight">
                {t(m.name, m.nameEn)}
              </h3>

              <p className="text-xs font-bold text-blue-700 mt-1 mb-2">
                {t(m.designationBn, m.designationEn)}
              </p>

              <p className="text-xs text-slate-500 leading-relaxed">
                {t(m.bioBn, m.bioEn)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
