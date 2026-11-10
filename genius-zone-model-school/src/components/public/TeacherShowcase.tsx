/**
 * Teacher Profiles Showcase for Genius Zone Model School (GZMS)
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import { GraduationCap, Mail, Phone, BookOpen } from 'lucide-react';

export const TeacherShowcase: React.FC = () => {
  const { t } = useApp();
  const teachers = schoolStorage.getTeachers();

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            {t('আমাদের শিক্ষক পরিষদ', 'Our Faculty')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-blue-950 mt-3 tracking-tight">
            {t('অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকবৃন্দ', 'Dedicated Teachers & Academic Mentors')}
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mt-3 rounded-full" />
          <p className="text-sm text-slate-600 mt-3">
            {t(
              'উচ্চশিক্ষিত ও প্রশিক্ষণপ্রাপ্ত শিক্ষকমণ্ডলীর নিবিড় পরিচালনায় প্রতিটি শিক্ষার্থীর একাডেমিক ও মানসিক উৎকর্ষ নিশ্চিত করা হয়।',
              'Experienced, empathetic educators guiding students towards intellectual mastery and moral depth.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-300 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.nameEnglish}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                      {teacher.subjectSpecialization}
                    </span>
                    <h3 className="font-bold text-sm leading-tight text-white">
                      {teacher.nameEnglish}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-xs font-bold text-blue-800">
                    {t(teacher.designationBangla, teacher.designationEnglish)}
                  </p>

                  <p className="text-[11px] text-slate-500 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                    {teacher.educationalQualification}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed pt-1 border-t border-slate-100">
                    {teacher.shortBio}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-amber-600" />
                  {teacher.phone}
                </span>
                <span className="font-semibold text-blue-900">
                  {teacher.assignedClasses.join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
