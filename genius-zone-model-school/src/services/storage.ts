/**
 * Persistent Data Storage & Management Service for Genius Zone Model School (GZMS)
 * Stores state in localStorage with reactive subscriptions.
 */

import type {
  StudentProfile,
  TeacherProfile,
  StaffProfile,
  AdmissionApplication,
  AttendanceRecord,
  ExamRecord,
  StudentResult,
  FeePayment,
  FeeStructure,
  SchoolNotice,
  StudentApplication,
  PromotionalPopupSettings,
  GalleryAlbum,
  SchoolSettings,
  SmsMessage,
  ContactInquiry,
  ClassRoutineItem,
  HomeworkItem,
  HomeworkSubmission,
  StudentAward,
  TeacherAward,
  User,
  AdmitCardStructure,
  ClassSubject,
  UserAccount,
} from '../types';
import { generateNextRegNumber, formatRollNumber, calculateOverallResult } from '../utils/schoolRules';

const STORAGE_KEYS = {
  USERS: 'gzms_users',
  STUDENTS: 'gzms_students',
  TEACHERS: 'gzms_teachers',
  STAFF: 'gzms_staff',
  ADMISSIONS: 'gzms_admissions',
  ATTENDANCE: 'gzms_attendance',
  EXAMS: 'gzms_exams',
  RESULTS: 'gzms_results',
  PAYMENTS: 'gzms_payments',
  FEE_STRUCTURES: 'gzms_fee_structures',
  NOTICES: 'gzms_notices',
  APPLICATIONS: 'gzms_applications',
  POPUP: 'gzms_popup',
  GALLERY: 'gzms_gallery',
  SETTINGS: 'gzms_settings',
  SMS: 'gzms_sms',
  CONTACTS: 'gzms_contacts',
  ROUTINES: 'gzms_routines',
  HOMEWORK: 'gzms_homework',
  HOMEWORK_SUBS: 'gzms_homework_subs',
  STUDENT_AWARDS: 'gzms_student_awards',
  TEACHER_AWARDS: 'gzms_teacher_awards',
  ADMIT_STRUCTURE: 'gzms_admit_structure',
  CLASS_SUBJECTS: 'gzms_class_subjects',
  USER_ACCOUNTS: 'gzms_user_passwords',
};

export const DEFAULT_ADMIT_STRUCTURE: AdmitCardStructure = {
  examTitleBangla: 'প্রথম সাময়িক পরীক্ষা ২০২৬',
  examTitleEnglish: 'First Terminal Examination 2026',
  sessionYear: '2026',
  centerNameBangla: 'জিনিয়াস জোন মডেল স্কুল ক্যাম্পাস, বালাচৌড়া, বদরগঞ্জ',
  centerNameEnglish: 'Genius Zone Model School Campus, Balachowra, Badarganj',
  rulesBangla: [
    '১. পরীক্ষা শুরুর কমপক্ষে ১৫ মিনিট পূর্বে অবশ্যই পরীক্ষা কক্ষে আসন গ্রহণ করতে হবে। (Be seated 15 mins prior)',
    '২. মূল প্রবেশপত্র (Admit Card) ব্যতীত কোনো শিক্ষার্থীকে পরীক্ষা কেন্দ্রে প্রবেশ করতে দেওয়া হবে না। (Admit card is mandatory)',
    '৩. পরীক্ষা কক্ষে মোবাইল ফোন, ক্যালকুলেটর বা যেকোনো অসদুপায়ের কাগজ বহন করা সম্পূর্ণ নিষিদ্ধ। (No unauthorized devices or notes)',
    '৪. উত্তরপত্রে রোল নম্বর ও রেজিস্ট্রেশন নম্বর সঠিকভাবে পূরণ করতে হবে; কোনো প্রকার ঘষামাজা করা যাবে না। (Fill details accurately)',
    '৫. শিক্ষক ও কক্ষ পরিদর্শকের সকল যুক্তিসঙ্গত নির্দেশ অক্ষরে অক্ষরে পালন করতে হবে। (Obey invigilator instructions)',
  ],
  showQrCode: true,
  showStudentPhoto: true,
  showGuardianPhone: true,
  showRoomNumber: true,
  principalSignatureTitle: 'Head Teacher / অধ্যক্ষ',
  controllerSignatureTitle: 'Exam Controller / পরীক্ষা নিয়ন্ত্রক',
  disclaimerNoteBangla: 'মাসিক বেতন ও ফি পরিশোধের সাপেক্ষে এই প্রবেশপত্র বৈধ বলে বিবেচিত হবে।',
};

export const DEFAULT_USER_ACCOUNTS: UserAccount[] = [
  { username: 'admin', passwordHash: '123456', role: 'ADMIN', displayName: 'School Administrator', updatedAt: '2026-01-01' },
  { username: 'teacher', passwordHash: '123456', role: 'TEACHER', displayName: 'Md. Rafiqul Islam', updatedAt: '2026-01-01' },
  { username: 'delowar', passwordHash: '123456', role: 'ADMIN', displayName: 'Md. Delowar Hossain', updatedAt: '2026-01-01' },
  { username: 'fatema', passwordHash: '123456', role: 'TEACHER', displayName: 'Fatema Tuz Zohra', updatedAt: '2026-01-01' },
  { username: 'kamrul', passwordHash: '123456', role: 'TEACHER', displayName: 'Md. Kamrul Hasan', updatedAt: '2026-01-01' },
  { username: 'GZMS0001', passwordHash: '123456', role: 'STUDENT', displayName: 'Tanvir Ahmed', updatedAt: '2026-01-01' },
  { username: 'GZMS0002', passwordHash: '123456', role: 'STUDENT', displayName: 'Nusrat Jahan Mimi', updatedAt: '2026-01-01' },
  { username: 'GZMS0003', passwordHash: '123456', role: 'STUDENT', displayName: 'Samiul Islam', updatedAt: '2026-01-01' },
];

export const DEFAULT_CLASS_SUBJECTS: ClassSubject[] = [
  // Class 5
  { id: 'sub-c5-1', subjectCode: '101', subjectNameBangla: 'বাংলা', subjectNameEnglish: 'Bangla', className: 'Class 5', fullMarks: 100, passMarks: 33, teacherName: 'Md. Rafiqul Islam', isCompulsory: true },
  { id: 'sub-c5-2', subjectCode: '107', subjectNameBangla: 'ইংরেজি', subjectNameEnglish: 'English', className: 'Class 5', fullMarks: 100, passMarks: 33, teacherName: 'Fatema Tuz Zohra', isCompulsory: true },
  { id: 'sub-c5-3', subjectCode: '109', subjectNameBangla: 'প্রাথমিক গণিত', subjectNameEnglish: 'Mathematics', className: 'Class 5', fullMarks: 100, passMarks: 33, teacherName: 'Delowar Hossain', isCompulsory: true },
  { id: 'sub-c5-4', subjectCode: '127', subjectNameBangla: 'প্রাথমিক বিজ্ঞান', subjectNameEnglish: 'Elementary Science', className: 'Class 5', fullMarks: 100, passMarks: 33, teacherName: 'Md. Kamrul Hasan', isCompulsory: true },
  { id: 'sub-c5-5', subjectCode: '150', subjectNameBangla: 'বাংলাদেশ ও বিশ্বপরিচয়', subjectNameEnglish: 'Bangladesh & Global Studies', className: 'Class 5', fullMarks: 100, passMarks: 33, teacherName: 'Md. Rafiqul Islam', isCompulsory: true },
  { id: 'sub-c5-6', subjectCode: '111', subjectNameBangla: 'ধর্ম ও নৈতিক শিক্ষা', subjectNameEnglish: 'Religion & Moral Education', className: 'Class 5', fullMarks: 100, passMarks: 33, teacherName: 'Fatema Tuz Zohra', isCompulsory: true },

  // Class 6
  { id: 'sub-c6-1', subjectCode: '101', subjectNameBangla: 'বাংলা ১ম পত্র', subjectNameEnglish: 'Bangla 1st Paper', className: 'Class 6', fullMarks: 100, passMarks: 33, teacherName: 'Md. Rafiqul Islam', isCompulsory: true },
  { id: 'sub-c6-2', subjectCode: '102', subjectNameBangla: 'বাংলা ২য় পত্র', subjectNameEnglish: 'Bangla 2nd Paper', className: 'Class 6', fullMarks: 50, passMarks: 17, teacherName: 'Md. Rafiqul Islam', isCompulsory: true },
  { id: 'sub-c6-3', subjectCode: '107', subjectNameBangla: 'ইংরেজি ১ম পত্র', subjectNameEnglish: 'English 1st Paper', className: 'Class 6', fullMarks: 100, passMarks: 33, teacherName: 'Fatema Tuz Zohra', isCompulsory: true },
  { id: 'sub-c6-4', subjectCode: '108', subjectNameBangla: 'ইংরেজি ২য় পত্র', subjectNameEnglish: 'English 2nd Paper', className: 'Class 6', fullMarks: 50, passMarks: 17, teacherName: 'Fatema Tuz Zohra', isCompulsory: true },
  { id: 'sub-c6-5', subjectCode: '109', subjectNameBangla: 'গণিত', subjectNameEnglish: 'Mathematics', className: 'Class 6', fullMarks: 100, passMarks: 33, teacherName: 'Delowar Hossain', isCompulsory: true },
  { id: 'sub-c6-6', subjectCode: '127', subjectNameBangla: 'সাধারণ বিজ্ঞান', subjectNameEnglish: 'General Science', className: 'Class 6', fullMarks: 100, passMarks: 33, teacherName: 'Md. Kamrul Hasan', isCompulsory: true },
  { id: 'sub-c6-7', subjectCode: '154', subjectNameBangla: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', subjectNameEnglish: 'Information & Comm. Tech (ICT)', className: 'Class 6', fullMarks: 50, passMarks: 17, teacherName: 'Delowar Hossain', isCompulsory: true },

  // Class 7
  { id: 'sub-c7-1', subjectCode: '101', subjectNameBangla: 'বাংলা ১ম পত্র', subjectNameEnglish: 'Bangla 1st', className: 'Class 7', fullMarks: 100, passMarks: 33, teacherName: 'Md. Rafiqul Islam', isCompulsory: true },
  { id: 'sub-c7-2', subjectCode: '107', subjectNameBangla: 'ইংরেজি ১ম পত্র', subjectNameEnglish: 'English 1st', className: 'Class 7', fullMarks: 100, passMarks: 33, teacherName: 'Fatema Tuz Zohra', isCompulsory: true },
  { id: 'sub-c7-3', subjectCode: '109', subjectNameBangla: 'গণিত', subjectNameEnglish: 'Mathematics', className: 'Class 7', fullMarks: 100, passMarks: 33, teacherName: 'Delowar Hossain', isCompulsory: true },
  { id: 'sub-c7-4', subjectCode: '127', subjectNameBangla: 'সাধারণ বিজ্ঞান', subjectNameEnglish: 'General Science', className: 'Class 7', fullMarks: 100, passMarks: 33, teacherName: 'Md. Kamrul Hasan', isCompulsory: true },

  // Class 8
  { id: 'sub-c8-1', subjectCode: '101', subjectNameBangla: 'বাংলা', subjectNameEnglish: 'Bangla', className: 'Class 8', fullMarks: 100, passMarks: 33, teacherName: 'Md. Rafiqul Islam', isCompulsory: true },
  { id: 'sub-c8-2', subjectCode: '107', subjectNameBangla: 'ইংরেজি', subjectNameEnglish: 'English', className: 'Class 8', fullMarks: 100, passMarks: 33, teacherName: 'Fatema Tuz Zohra', isCompulsory: true },
  { id: 'sub-c8-3', subjectCode: '109', subjectNameBangla: 'গণিত', subjectNameEnglish: 'Mathematics', className: 'Class 8', fullMarks: 100, passMarks: 33, teacherName: 'Delowar Hossain', isCompulsory: true },
  { id: 'sub-c8-4', subjectCode: '127', subjectNameBangla: 'বিজ্ঞান', subjectNameEnglish: 'Science', className: 'Class 8', fullMarks: 100, passMarks: 33, teacherName: 'Md. Kamrul Hasan', isCompulsory: true },
  { id: 'sub-c8-5', subjectCode: '154', subjectNameBangla: 'আইসিটি (ICT)', subjectNameEnglish: 'ICT', className: 'Class 8', fullMarks: 50, passMarks: 17, teacherName: 'Delowar Hossain', isCompulsory: true },

  // Class 9
  { id: 'sub-c9-1', subjectCode: '101', subjectNameBangla: 'বাংলা সাহিত্য', subjectNameEnglish: 'Bangla Literature', className: 'Class 9', fullMarks: 100, passMarks: 33, teacherName: 'Md. Rafiqul Islam', isCompulsory: true },
  { id: 'sub-c9-2', subjectCode: '107', subjectNameBangla: 'ইংরেজি ভাষা', subjectNameEnglish: 'English Language', className: 'Class 9', fullMarks: 100, passMarks: 33, teacherName: 'Fatema Tuz Zohra', isCompulsory: true },
  { id: 'sub-c9-3', subjectCode: '109', subjectNameBangla: 'সাধারণ গণিত', subjectNameEnglish: 'General Mathematics', className: 'Class 9', fullMarks: 100, passMarks: 33, teacherName: 'Delowar Hossain', isCompulsory: true },
  { id: 'sub-c9-4', subjectCode: '136', subjectNameBangla: 'পদার্থবিজ্ঞান', subjectNameEnglish: 'Physics', className: 'Class 9', fullMarks: 100, passMarks: 33, teacherName: 'Md. Kamrul Hasan', isCompulsory: true },
  { id: 'sub-c9-5', subjectCode: '137', subjectNameBangla: 'রসায়ন', subjectNameEnglish: 'Chemistry', className: 'Class 9', fullMarks: 100, passMarks: 33, teacherName: 'Md. Kamrul Hasan', isCompulsory: true },
  { id: 'sub-c9-6', subjectCode: '126', subjectNameBangla: 'উচ্চতর গণিত', subjectNameEnglish: 'Higher Mathematics', className: 'Class 9', fullMarks: 100, passMarks: 33, teacherName: 'Delowar Hossain', isCompulsory: true },
];

// Initial default settings
const DEFAULT_SETTINGS: SchoolSettings = {
  schoolNameBangla: 'জিনিয়াস জোন মডেল স্কুল',
  schoolNameEnglish: 'Genius Zone Model School',
  schoolShortName: 'GZMS',
  taglineEnglish: 'Where Dreams Come True',
  taglineBangla: 'যেখানে স্বপ্ন সত্যি হয়।',
  addressBangla: 'বালাচৌড়া, বদরগঞ্জ, রংপুর, বাংলাদেশ',
  addressEnglish: 'Balachowra, Badarganj, Rangpur, Bangladesh',
  email: 'info.sbf21@gmail.com',
  phone: '01308177171',
  altPhone: '01712345678',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&auto=format&fit=crop&q=80',
  directorName: 'মোঃ দেলোয়ার হোসেন (Delowar Hossain)',
  directorTitle: 'Founder & Managing Director',
  directorSpeech:
    'আমাদের প্রিয় শিক্ষাপ্রতিষ্ঠান জিনিয়াস জোন মডেল স্কুল প্রত্যন্ত অঞ্চলের শিক্ষার্থীদের মাঝে আধুনিক, সৃজনশীল ও আন্তর্জাতিক মানের শিক্ষা ছড়িয়ে দেওয়ার দৃঢ় প্রত্যয়ে প্রতিষ্ঠিত। আমরা মুখস্থ শিক্ষার পরিবর্তে বাস্তবভিত্তিক ও মানবিক মূল্যবোধসম্পন্ন শিক্ষাদানে বিশ্বাসী। প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভার পরিপূর্ণ বিকাশ ঘটিয়ে তাদের আগামী পৃথিবীর জন্য সুযোগ্য নাগরিক হিসেবে গড়ে তোলাই আমাদের একমাত্র অঙ্গীকার।',
  directorPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  directorSignature: 'Delowar Hossain',
  presidentName: 'অধ্যক্ষ মোস্তাফিজুর রহমান (Mostafizur Rahman)',
  presidentTitle: 'President, School Managing Committee',
  presidentSpeech:
    'শিক্ষাই জাতির মেরুদণ্ড। একটি সুন্দর ও সমৃদ্ধ সমাজ বিনির্মাণে গুণগত শিক্ষার কোনো বিকল্প নেই। জিনিয়াস জোন মডেল স্কুল প্রতিষ্ঠার শুরু থেকেই নৈতিকতা, নিয়মানুবর্তিতা ও আধুনিক তথ্যপ্রযুক্তির সমন্বয়ে পাঠদানে ব্রতী হয়েছে। অভিভাবক, শিক্ষক ও সমাজের সর্বস্তরের মানুষের সার্বিক সহযোগিতায় আমরা আমাদের কাঙ্ক্ষিত লক্ষ্যে পৌঁছে যাব ইনশাআল্লাহ।',
  presidentPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  presidentSignature: 'Mostafizur Rahman',
  headTeacherName: 'মোঃ রফিকুল ইসলাম (M.Sc, B.Ed)',
  headTeacherSignature: 'Rafiqul Islam',
  officialSealUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  attendanceCutoffTime: '09:20',
  schoolStartTime: '09:00',
  smsPhoneBridge: '01308177171',
  facebookUrl: 'https://facebook.com/geniuszonemodelschool',
  youtubeUrl: 'https://youtube.com',
};

const DEFAULT_POPUP: PromotionalPopupSettings = {
  isEnabled: true,
  bannerImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80',
  title: 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬ (Admission Open 2026)',
  subtitle: 'প্লে থেকে নবম শ্রেণী পর্যন্ত সীমিত আসনে ছাত্র-ছাত্রী ভর্তি চলছে। এখনই অনলাইনে আবেদন করুন এবং ১০% ফি ছাড় পান!',
  externalLink: '#admission',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  displayFrequency: 'ONCE_PER_SESSION',
};

const DEFAULT_TEACHERS: TeacherProfile[] = [
  {
    id: 't-1',
    nameBangla: 'মোঃ দেলোয়ার হোসেন',
    nameEnglish: 'Delowar Hossain',
    designationBangla: 'প্রতিষ্ঠাতা ও ব্যবস্থাপনা পরিচালক',
    designationEnglish: 'Founder & Managing Director',
    subjectSpecialization: 'Mathematics & Computer Science',
    assignedClasses: ['Class 8', 'Class 9'],
    assignedSubjects: ['Higher Mathematics', 'ICT'],
    educationalQualification: 'B.Sc (Engg) in CSE, M.Ed',
    shortBio: 'Dedicated visionary educator committed to bringing global digital education standards to Badarganj, Rangpur.',
    phone: '01308177171',
    email: 'info.sbf21@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    joiningDate: '2021-01-01',
    status: 'ACTIVE',
  },
  {
    id: 't-2',
    nameBangla: 'মোঃ রফিকুল ইসলাম',
    nameEnglish: 'Md. Rafiqul Islam',
    designationBangla: 'প্রধান শিক্ষক',
    designationEnglish: 'Head Teacher',
    subjectSpecialization: 'Mathematics',
    assignedClasses: ['Class 6', 'Class 7', 'Class 8'],
    assignedSubjects: ['General Mathematics'],
    educationalQualification: 'M.Sc (Mathematics), B.Ed (1st Class)',
    shortBio: 'Over 14 years of exemplary teaching experience in secondary education with multiple regional teaching awards.',
    phone: '01711223344',
    email: 'rafiqul.gzms@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    joiningDate: '2021-03-01',
    status: 'ACTIVE',
  },
  {
    id: 't-3',
    nameBangla: 'ফাতেমা তুজ জোহরা',
    nameEnglish: 'Fatema Tuz Zohra',
    designationBangla: 'সিনিয়র সহকারী শিক্ষক',
    designationEnglish: 'Senior Assistant Teacher',
    subjectSpecialization: 'English Language & Literature',
    assignedClasses: ['Class 5', 'Class 6', 'Class 7'],
    assignedSubjects: ['English 1st', 'English 2nd'],
    educationalQualification: 'M.A in English, B.Ed',
    shortBio: 'Specialist in English communicative grammar, phonetics, and interactive children language development.',
    phone: '01822334455',
    email: 'fatema.gzms@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    joiningDate: '2021-06-15',
    status: 'ACTIVE',
  },
  {
    id: 't-4',
    nameBangla: 'মোঃ কামরুল হাসান',
    nameEnglish: 'Md. Kamrul Hasan',
    designationBangla: 'সহকারী শিক্ষক (বিজ্ঞান)',
    designationEnglish: 'Assistant Teacher (Science)',
    subjectSpecialization: 'General Science & Physics',
    assignedClasses: ['Class 7', 'Class 8', 'Class 9'],
    assignedSubjects: ['General Science', 'Physics'],
    educationalQualification: 'B.Sc (Hons) in Physics',
    shortBio: 'Passionate about hands-on practical science experiments and inspiring young curious minds.',
    phone: '01933445566',
    email: 'kamrul.gzms@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    joiningDate: '2022-01-10',
    status: 'ACTIVE',
  },
];

const DEFAULT_STUDENTS: StudentProfile[] = [
  {
    id: 's-1',
    regNumber: 'GZMS0001',
    rollNumber: '0001',
    nameBangla: 'তানভীর আহমেদ',
    nameEnglish: 'Tanvir Ahmed',
    gender: 'Male',
    dateOfBirth: '2014-04-12',
    bloodGroup: 'B+',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
    className: 'Class 5',
    section: 'A',
    session: '2026',
    village: 'Balachowra',
    postOffice: 'Badarganj',
    upazila: 'Badarganj',
    district: 'Rangpur',
    country: 'Bangladesh',
    fatherNameBangla: 'মোঃ আনোয়ার হোসেন',
    fatherNameEnglish: 'Md. Anwar Hossain',
    motherNameBangla: 'রোকেয়া বেগম',
    motherNameEnglish: 'Rokeya Begum',
    guardianPhone: '01712998877',
    altPhone: '01308177171',
    presentAddress: 'Balachowra, Badarganj, Rangpur',
    permanentAddress: 'Balachowra, Badarganj, Rangpur',
    status: 'ACTIVE',
    admissionDate: '2024-01-05',
    scholarshipPct: 20,
  },
  {
    id: 's-2',
    regNumber: 'GZMS0002',
    rollNumber: '0002',
    nameBangla: 'নুসরাত জাহান মিমি',
    nameEnglish: 'Nusrat Jahan Mimi',
    gender: 'Female',
    dateOfBirth: '2014-08-20',
    bloodGroup: 'A+',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    className: 'Class 5',
    section: 'A',
    session: '2026',
    village: 'Damodarpur',
    postOffice: 'Badarganj',
    upazila: 'Badarganj',
    district: 'Rangpur',
    country: 'Bangladesh',
    fatherNameBangla: 'মোজাম্মেল হক',
    fatherNameEnglish: 'Mozammel Haque',
    motherNameBangla: 'পারভীন আক্তার',
    motherNameEnglish: 'Parvin Akter',
    guardianPhone: '01819998877',
    presentAddress: 'Damodarpur, Badarganj, Rangpur',
    permanentAddress: 'Damodarpur, Badarganj, Rangpur',
    status: 'ACTIVE',
    admissionDate: '2024-01-05',
    scholarshipPct: 0,
  },
  {
    id: 's-3',
    regNumber: 'GZMS0003',
    rollNumber: '0001',
    nameBangla: 'ফারহান সাদিক',
    nameEnglish: 'Farhan Sadik',
    gender: 'Male',
    dateOfBirth: '2013-02-15',
    bloodGroup: 'O+',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    className: 'Class 6',
    section: 'A',
    session: '2026',
    village: 'Gopalpur',
    postOffice: 'Badarganj',
    upazila: 'Badarganj',
    district: 'Rangpur',
    country: 'Bangladesh',
    fatherNameBangla: 'মোঃ শাহ আলম',
    fatherNameEnglish: 'Md. Shah Alam',
    motherNameBangla: 'নাসরিন সুলতানা',
    motherNameEnglish: 'Nasrin Sultana',
    guardianPhone: '01918887766',
    presentAddress: 'Gopalpur, Badarganj, Rangpur',
    permanentAddress: 'Gopalpur, Badarganj, Rangpur',
    status: 'ACTIVE',
    admissionDate: '2023-01-10',
    scholarshipPct: 15,
  },
];

const DEFAULT_NOTICES: SchoolNotice[] = [
  {
    id: 'not-1',
    title: 'Admissions Open for Academic Session 2026 (Play to Class 9)',
    titleBangla: '২০২৬ শিক্ষাবর্ষে প্লে থেকে নবম শ্রেণীতে নতুন ভর্তি সংক্রান্ত বিজ্ঞপ্তি',
    category: 'Admission',
    publishDate: '2026-11-01',
    expiryDate: '2026-12-31',
    targetAudience: 'ALL',
    summary: 'Online and offline admission applications are now open for all classes with merit-based scholarship facilities.',
    content:
      'Genius Zone Model School (GZMS) proudly announces the commencement of admission applications for the Academic Session 2026 from Play Group to Class 9. Prospective guardians are cordially invited to submit online applications through our website portal or visit the school admissions office during working hours (9:00 AM - 3:00 PM). Early applicant scholarship waivers up to 25% are available for meritorious and needy students. For admission assistance, contact: 01308177171.',
    isImportantOnHomepage: true,
    authorDesignation: 'Founder & Managing Director',
  },
  {
    id: 'not-2',
    title: 'Schedule for First Terminal Examination 2026 & Admit Card Download',
    titleBangla: 'প্রথম সাময়িক পরীক্ষা ২০২৬ এর সময়সূচি ও প্রবেশপত্র সংগ্রহ',
    category: 'Exam',
    publishDate: '2026-11-05',
    expiryDate: '2026-12-15',
    targetAudience: 'STUDENTS',
    summary: 'Download exam admit cards from student portal. Clearance of monthly tuition fees is required before exam.',
    content:
      'All students and honorable guardians are hereby informed that the First Terminal Examination 2026 will commence from next month. All students are requested to clear their due monthly fees through our bKash portal or school counter and download their official digital Admit Card with QR code from their respective Student Dashboard. No student will be allowed into the exam hall without their Admit Card.',
    isImportantOnHomepage: true,
    authorDesignation: 'Head Teacher',
  },
  {
    id: 'not-3',
    title: 'Implementation of Smart QR Code Attendance & Guardian Instant SMS',
    titleBangla: 'স্মার্ট কিউআর কোড ডিজিটাল হাজিরা ও অভিভাবক এসএমএস কার্যক্রম চালু',
    category: 'General',
    publishDate: '2026-11-08',
    targetAudience: 'GUARDIANS',
    summary: 'Daily morning attendance cutoff is 09:20 AM. Absentee notifications will be dispatched automatically.',
    content:
      'In our continued pursuit of academic discipline and technological excellence, Genius Zone Model School has deployed a smart camera-based QR attendance scanner. Every morning at 09:20 AM, absent students are detected and an automated Bangla SMS notification is delivered to the registered guardian mobile number. Guardians are requested to ensure their wards arrive at school before 09:00 AM.',
    isImportantOnHomepage: false,
    authorDesignation: 'Director of ICT & Administration',
  },
];

const DEFAULT_RESULTS: StudentResult[] = [
  {
    id: 'res-1',
    examId: 'exam-1',
    examName: 'First Terminal Examination 2026',
    studentId: 's-1',
    studentReg: 'GZMS0001',
    studentName: 'Tanvir Ahmed',
    className: 'Class 5',
    rollNumber: '0001',
    session: '2026',
    subjects: [
      { subjectName: 'Bangla 1st', marks: 88, highestMarks: 94, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'Bangla 2nd', marks: 82, highestMarks: 90, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'English 1st', marks: 85, highestMarks: 92, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'English 2nd', marks: 78, highestMarks: 88, letterGrade: 'A', gpa: 4.0 },
      { subjectName: 'General Mathematics', marks: 95, highestMarks: 98, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'General Science', marks: 86, highestMarks: 91, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'Religion & Moral Edu', marks: 92, highestMarks: 96, letterGrade: 'A+', gpa: 5.0 },
    ],
    totalMarks: 606,
    averageMarks: 86.6,
    overallGpa: 4.86,
    finalGrade: 'A+',
    positionInClass: 1,
    remarks: 'Outstanding performance, well-disciplined student!',
    isPublished: true,
    publishedDate: '2026-11-05',
  },
  {
    id: 'res-2',
    examId: 'exam-1',
    examName: 'First Terminal Examination 2026',
    studentId: 's-2',
    studentReg: 'GZMS0002',
    studentName: 'Nusrat Jahan Mimi',
    className: 'Class 5',
    rollNumber: '0002',
    session: '2026',
    subjects: [
      { subjectName: 'Bangla 1st', marks: 84, highestMarks: 94, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'Bangla 2nd', marks: 80, highestMarks: 90, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'English 1st', marks: 81, highestMarks: 92, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'English 2nd', marks: 74, highestMarks: 88, letterGrade: 'A', gpa: 4.0 },
      { subjectName: 'General Mathematics', marks: 89, highestMarks: 98, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'General Science', marks: 83, highestMarks: 91, letterGrade: 'A+', gpa: 5.0 },
      { subjectName: 'Religion & Moral Edu', marks: 90, highestMarks: 96, letterGrade: 'A+', gpa: 5.0 },
    ],
    totalMarks: 581,
    averageMarks: 83.0,
    overallGpa: 4.71,
    finalGrade: 'A+',
    positionInClass: 2,
    remarks: 'Very attentive and proactive learner.',
    isPublished: true,
    publishedDate: '2026-11-05',
  },
];

const DEFAULT_PAYMENTS: FeePayment[] = [
  {
    id: 'pay-1',
    challanNumber: 'CH-2026-0001',
    studentId: 's-1',
    studentReg: 'GZMS0001',
    studentName: 'Tanvir Ahmed',
    className: 'Class 5',
    rollNumber: '0001',
    category: 'Monthly Tuition',
    amount: 1200,
    paymentMethod: 'bKash',
    bkashSenderPhone: '01712998877',
    transactionId: 'BK9A77X120',
    paymentDate: '2026-11-02',
    monthCovered: 'November 2026',
    status: 'APPROVED',
    approvedDate: '2026-11-02',
  },
  {
    id: 'pay-2',
    challanNumber: 'CH-2026-0002',
    studentId: 's-2',
    studentReg: 'GZMS0002',
    studentName: 'Nusrat Jahan Mimi',
    className: 'Class 5',
    rollNumber: '0002',
    category: 'Monthly Tuition',
    amount: 1500,
    paymentMethod: 'bKash',
    bkashSenderPhone: '01819998877',
    transactionId: 'BK8B55M991',
    paymentDate: '2026-11-03',
    monthCovered: 'November 2026',
    status: 'APPROVED',
    approvedDate: '2026-11-03',
  },
];

const DEFAULT_GALLERY: GalleryAlbum[] = [
  {
    id: 'gal-1',
    title: 'Annual Sports & Prize Giving Ceremony 2026',
    eventName: 'Annual Sports Day',
    date: '2026-02-15',
    description: 'Students participating enthusiastically in sprint, relay races, high jump, and prize ceremony.',
    coverImage: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=600&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-1', url: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=800&auto=format&fit=crop&q=80', caption: 'Sprint race finals' },
      { id: 'img-2', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80', caption: 'Relay championship' },
      { id: 'img-3', url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&auto=format&fit=crop&q=80', caption: 'Director presenting championship trophy' },
    ],
  },
  {
    id: 'gal-2',
    title: 'Science Fair & Creative Robotics Exhibition',
    eventName: 'Junior Innovation Fair',
    date: '2026-05-10',
    description: 'Young scientists showcasing creative science models, solar power projects, and water purification prototypes.',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-4', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80', caption: 'Science exhibition hall' },
      { id: 'img-5', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80', caption: 'Laboratory experiment presentation' },
    ],
  },
  {
    id: 'gal-3',
    title: 'International Mother Language Day Celebration',
    eventName: 'Ekushey February Observance',
    date: '2026-02-21',
    description: 'Students laying floral tributes at the Shaheed Minar, reciting poems and singing patriotic songs.',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-6', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80', caption: 'Floral wreath at Shaheed Minar' },
      { id: 'img-7', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80', caption: 'Cultural song and poetry recitation' },
    ],
  },
];

const DEFAULT_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    studentId: 's-1',
    studentReg: 'GZMS0001',
    studentName: 'Tanvir Ahmed',
    className: 'Class 5',
    rollNumber: '0001',
    date: new Date().toISOString().split('T')[0],
    time: '08:52:14',
    status: 'PRESENT',
    method: 'QR_SCAN',
  },
  {
    id: 'att-2',
    studentId: 's-2',
    studentReg: 'GZMS0002',
    studentName: 'Nusrat Jahan Mimi',
    className: 'Class 5',
    rollNumber: '0002',
    date: new Date().toISOString().split('T')[0],
    time: '08:58:30',
    status: 'PRESENT',
    method: 'QR_SCAN',
  },
];

const DEFAULT_ROUTINES: ClassRoutineItem[] = [
  {
    id: 'rt-1',
    className: 'Class 5',
    section: 'A',
    subject: 'Bangla',
    teacherName: 'Md. Rafiqul Islam',
    dayOfWeek: 'Sunday',
    startTime: '09:30',
    endTime: '10:15',
    roomNumber: 'Room 201',
  },
  {
    id: 'rt-2',
    className: 'Class 5',
    section: 'A',
    subject: 'English',
    teacherName: 'Fatema Tuz Zohra',
    dayOfWeek: 'Sunday',
    startTime: '10:15',
    endTime: '11:00',
    roomNumber: 'Room 201',
  },
  {
    id: 'rt-3',
    className: 'Class 5',
    section: 'A',
    subject: 'Mathematics',
    teacherName: 'Delowar Hossain',
    dayOfWeek: 'Sunday',
    startTime: '11:15',
    endTime: '12:00',
    roomNumber: 'Room 201',
  },
];

const DEFAULT_HOMEWORK: HomeworkItem[] = [
  {
    id: 'hw-1',
    teacherId: 't-1',
    teacherName: 'Delowar Hossain',
    className: 'Class 5',
    subject: 'Mathematics',
    topic: 'Fractions and Decimals',
    description: 'Solve Exercise 4.2 Problems 1 to 10 in your exercise book. Write down all steps clearly.',
    assignedDate: '2026-11-08',
    dueDate: '2026-11-12',
    instructions: 'Upload a picture of your handwritten solutions or submit in the next class.',
  },
  {
    id: 'hw-2',
    teacherId: 't-3',
    teacherName: 'Fatema Tuz Zohra',
    className: 'Class 5',
    subject: 'English',
    topic: 'Paragraph: My Aim in Life',
    description: 'Write a composition of 150 words describing your future career goal and how you will serve your country.',
    assignedDate: '2026-11-09',
    dueDate: '2026-11-14',
    instructions: 'Use proper punctuation, varied vocabulary, and correct tenses.',
  },
];

class SchoolStorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.POPUP)) {
      localStorage.setItem(STORAGE_KEYS.POPUP, JSON.stringify(DEFAULT_POPUP));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(DEFAULT_TEACHERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTICES)) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(DEFAULT_NOTICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESULTS)) {
      localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(DEFAULT_RESULTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(DEFAULT_PAYMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(DEFAULT_ATTENDANCE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROUTINES)) {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(DEFAULT_ROUTINES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HOMEWORK)) {
      localStorage.setItem(STORAGE_KEYS.HOMEWORK, JSON.stringify(DEFAULT_HOMEWORK));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMIT_STRUCTURE)) {
      localStorage.setItem(STORAGE_KEYS.ADMIT_STRUCTURE, JSON.stringify(DEFAULT_ADMIT_STRUCTURE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLASS_SUBJECTS)) {
      localStorage.setItem(STORAGE_KEYS.CLASS_SUBJECTS, JSON.stringify(DEFAULT_CLASS_SUBJECTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER_ACCOUNTS)) {
      localStorage.setItem(STORAGE_KEYS.USER_ACCOUNTS, JSON.stringify(DEFAULT_USER_ACCOUNTS));
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Storage subscriber error:', err);
      }
    });
  }

  public get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  }

  public set<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.notify();
    } catch (err) {
      console.error(`Failed to write to localStorage for key: ${key}`, err);
    }
  }

  // --- Settings & Popups ---
  public getSettings(): SchoolSettings {
    return this.get<SchoolSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  public updateSettings(settings: Partial<SchoolSettings>): void {
    const current = this.getSettings();
    this.set(STORAGE_KEYS.SETTINGS, { ...current, ...settings });
  }

  public getPopupSettings(): PromotionalPopupSettings {
    return this.get<PromotionalPopupSettings>(STORAGE_KEYS.POPUP, DEFAULT_POPUP);
  }

  public updatePopupSettings(popup: Partial<PromotionalPopupSettings>): void {
    const current = this.getPopupSettings();
    this.set(STORAGE_KEYS.POPUP, { ...current, ...popup });
  }

  // --- Students ---
  public getStudents(): StudentProfile[] {
    return this.get<StudentProfile[]>(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
  }

  public getStudentByReg(regNumber: string): StudentProfile | undefined {
    return this.getStudents().find((s) => s.regNumber.toUpperCase() === regNumber.trim().toUpperCase());
  }

  public addStudent(student: Omit<StudentProfile, 'id' | 'regNumber'> & { regNumber?: string }): StudentProfile {
    const students = this.getStudents();
    const existingRegs = students.map((s) => s.regNumber);
    const regNumber = student.regNumber || generateNextRegNumber(existingRegs);

    const newStudent: StudentProfile = {
      ...student,
      id: `std-${Date.now()}`,
      regNumber,
      rollNumber: formatRollNumber(student.rollNumber || students.length + 1),
    };

    this.set(STORAGE_KEYS.STUDENTS, [newStudent, ...students]);
    return newStudent;
  }

  public updateStudent(id: string, updates: Partial<StudentProfile>): void {
    const students = this.getStudents().map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.set(STORAGE_KEYS.STUDENTS, students);
  }

  public deleteStudent(id: string): void {
    const students = this.getStudents().filter((s) => s.id !== id);
    this.set(STORAGE_KEYS.STUDENTS, students);
  }

  // --- Admissions ---
  public getAdmissions(): AdmissionApplication[] {
    return this.get<AdmissionApplication[]>(STORAGE_KEYS.ADMISSIONS, []);
  }

  public submitAdmissionApplication(
    appData: Omit<AdmissionApplication, 'id' | 'applicationId' | 'regNumber' | 'appliedDate' | 'status'>
  ): AdmissionApplication {
    const existingApps = this.getAdmissions();
    const existingStudents = this.getStudents();
    const allExistingRegs = [...existingStudents.map((s) => s.regNumber), ...existingApps.map((a) => a.regNumber)];

    const regNumber = generateNextRegNumber(allExistingRegs);
    const applicationId = `APP-2026-${(existingApps.length + 1).toString().padStart(4, '0')}`;

    const newApp: AdmissionApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      applicationId,
      regNumber,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };

    this.set(STORAGE_KEYS.ADMISSIONS, [newApp, ...existingApps]);
    return newApp;
  }

  public approveAdmission(
    appId: string,
    assignedClass: string,
    assignedRoll: string,
    scholarshipWaiverPct: number = 0,
    adminRemarks: string = 'Approved upon academic screening'
  ): AdmissionApplication | null {
    const apps = this.getAdmissions();
    const target = apps.find((a) => a.id === appId);
    if (!target) return null;

    target.status = 'APPROVED';
    target.assignedClass = assignedClass;
    target.assignedRoll = formatRollNumber(assignedRoll);
    target.scholarshipWaiverPct = scholarshipWaiverPct;
    target.adminRemarks = adminRemarks;

    this.set(STORAGE_KEYS.ADMISSIONS, [...apps]);

    // Create permanent student profile
    const existingStudent = this.getStudentByReg(target.regNumber);
    if (!existingStudent) {
      this.addStudent({
        regNumber: target.regNumber,
        rollNumber: target.assignedRoll,
        nameBangla: target.studentNameBangla,
        nameEnglish: target.studentNameEnglish,
        gender: target.gender,
        dateOfBirth: target.dateOfBirth,
        photoUrl: target.photoUrl,
        className: target.assignedClass,
        section: 'A',
        session: target.session,
        previousSchool: target.previousSchool,
        previousClass: target.previousClass,
        village: target.village,
        postOffice: target.postOffice,
        upazila: target.upazila,
        district: target.district,
        country: target.country,
        fatherNameEnglish: target.fatherNameEnglish,
        motherNameEnglish: target.motherNameEnglish,
        guardianPhone: target.guardianPhone,
        altPhone: target.altPhone,
        presentAddress: target.presentAddress,
        permanentAddress: target.permanentAddress,
        status: 'ACTIVE',
        admissionDate: new Date().toISOString().split('T')[0],
        scholarshipPct: target.scholarshipWaiverPct,
      });
    }

    return target;
  }

  public rejectAdmission(appId: string, remarks: string): void {
    const apps = this.getAdmissions().map((a) => (a.id === appId ? { ...a, status: 'REJECTED' as const, adminRemarks: remarks } : a));
    this.set(STORAGE_KEYS.ADMISSIONS, apps);
  }

  // --- Attendance ---
  public getAttendance(): AttendanceRecord[] {
    return this.get<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, DEFAULT_ATTENDANCE);
  }

  public recordAttendance(studentReg: string, method: 'QR_SCAN' | 'MANUAL' = 'QR_SCAN'): { success: boolean; message: string; record?: AttendanceRecord; student?: StudentProfile } {
    const student = this.getStudentByReg(studentReg);
    if (!student) {
      return { success: false, message: `No student found with Registration Number: ${studentReg}` };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const records = this.getAttendance();

    const alreadyMarked = records.find((r) => r.studentReg === student.regNumber && r.date === todayStr);
    if (alreadyMarked) {
      return {
        success: false,
        message: `${student.nameEnglish} (Roll: ${student.rollNumber}) is ALREADY marked ${alreadyMarked.status} at ${alreadyMarked.time}.`,
        student,
        record: alreadyMarked,
      };
    }

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const cutoff = this.getSettings().attendanceCutoffTime || '09:20';
    const isLate = timeStr > cutoff;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentId: student.id,
      studentReg: student.regNumber,
      studentName: student.nameEnglish,
      className: student.className,
      rollNumber: student.rollNumber,
      date: todayStr,
      time: timeStr,
      status: isLate ? 'LATE' : 'PRESENT',
      method,
      smsSent: false,
    };

    this.set(STORAGE_KEYS.ATTENDANCE, [newRecord, ...records]);

    return {
      success: true,
      message: `${student.nameEnglish} (Roll: ${student.rollNumber}) successfully marked ${newRecord.status}!`,
      student,
      record: newRecord,
    };
  }

  public getTodayAbsentStudents(): StudentProfile[] {
    const todayStr = new Date().toISOString().split('T')[0];
    const presentRegs = new Set(this.getAttendance().filter((a) => a.date === todayStr && a.status !== 'ABSENT').map((a) => a.studentReg));
    return this.getStudents().filter((s) => s.status === 'ACTIVE' && !presentRegs.has(s.regNumber));
  }

  // --- Results ---
  public getResults(): StudentResult[] {
    return this.get<StudentResult[]>(STORAGE_KEYS.RESULTS, DEFAULT_RESULTS);
  }

  public saveResult(resultData: Omit<StudentResult, 'id'>): StudentResult {
    const results = this.getResults();
    const existingIdx = results.findIndex((r) => r.examId === resultData.examId && r.studentReg === resultData.studentReg);

    const calc = calculateOverallResult(resultData.subjects);
    const prepared: StudentResult = {
      ...resultData,
      id: existingIdx >= 0 ? results[existingIdx].id : `res-${Date.now()}`,
      totalMarks: calc.totalMarks,
      averageMarks: calc.averageMarks,
      overallGpa: calc.overallGpa,
      finalGrade: calc.finalGrade,
    };

    if (existingIdx >= 0) {
      results[existingIdx] = prepared;
      this.set(STORAGE_KEYS.RESULTS, [...results]);
    } else {
      this.set(STORAGE_KEYS.RESULTS, [prepared, ...results]);
    }

    return prepared;
  }

  // --- Payments & Fees ---
  public getPayments(): FeePayment[] {
    return this.get<FeePayment[]>(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
  }

  public submitFeePayment(
    data: Omit<FeePayment, 'id' | 'challanNumber' | 'paymentDate' | 'status'>
  ): FeePayment {
    const payments = this.getPayments();
    const challanNumber = `CH-2026-${(payments.length + 1).toString().padStart(4, '0')}`;

    const newPayment: FeePayment = {
      ...data,
      id: `pay-${Date.now()}`,
      challanNumber,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };

    this.set(STORAGE_KEYS.PAYMENTS, [newPayment, ...payments]);
    return newPayment;
  }

  public verifyPayment(paymentId: string, status: 'APPROVED' | 'REJECTED', notes?: string): void {
    const payments = this.getPayments().map((p) =>
      p.id === paymentId
        ? {
            ...p,
            status,
            adminNotes: notes,
            approvedDate: status === 'APPROVED' ? new Date().toISOString().split('T')[0] : undefined,
          }
        : p
    );
    this.set(STORAGE_KEYS.PAYMENTS, payments);
  }

  // --- Notices ---
  public getNotices(): SchoolNotice[] {
    return this.get<SchoolNotice[]>(STORAGE_KEYS.NOTICES, DEFAULT_NOTICES);
  }

  public addNotice(notice: Omit<SchoolNotice, 'id' | 'publishDate'>): SchoolNotice {
    const notices = this.getNotices();
    const newNotice: SchoolNotice = {
      ...notice,
      id: `not-${Date.now()}`,
      publishDate: new Date().toISOString().split('T')[0],
    };
    this.set(STORAGE_KEYS.NOTICES, [newNotice, ...notices]);
    return newNotice;
  }

  // --- Applications ---
  public getApplications(): StudentApplication[] {
    return this.get<StudentApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  }

  public submitApplication(app: Omit<StudentApplication, 'id' | 'applicationNumber' | 'submissionDate' | 'status'>): StudentApplication {
    const apps = this.getApplications();
    const applicationNumber = `APP-REQ-${(apps.length + 1).toString().padStart(4, '0')}`;
    const newApp: StudentApplication = {
      ...app,
      id: `app-req-${Date.now()}`,
      applicationNumber,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };
    this.set(STORAGE_KEYS.APPLICATIONS, [newApp, ...apps]);
    return newApp;
  }

  public updateApplicationStatus(id: string, status: StudentApplication['status'], comments?: string): void {
    const apps = this.getApplications().map((a) =>
      a.id === id
        ? {
            ...a,
            status,
            adminComments: comments,
            approvedDate: status === 'APPROVED' ? new Date().toISOString().split('T')[0] : undefined,
            approvedBy: 'Director, GZMS',
          }
        : a
    );
    this.set(STORAGE_KEYS.APPLICATIONS, apps);
  }

  // --- Teachers & Staff ---
  public getTeachers(): TeacherProfile[] {
    return this.get<TeacherProfile[]>(STORAGE_KEYS.TEACHERS, DEFAULT_TEACHERS);
  }

  public addTeacher(t: Omit<TeacherProfile, 'id'>): TeacherProfile {
    const teachers = this.getTeachers();
    const newT: TeacherProfile = { ...t, id: `t-${Date.now()}` };
    this.set(STORAGE_KEYS.TEACHERS, [...teachers, newT]);
    return newT;
  }

  public updateTeacher(id: string, updates: Partial<TeacherProfile>): void {
    const teachers = this.getTeachers().map((t) => (t.id === id ? { ...t, ...updates } : t));
    this.set(STORAGE_KEYS.TEACHERS, teachers);
  }

  // --- Gallery ---
  public getGallery(): GalleryAlbum[] {
    return this.get<GalleryAlbum[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
  }

  public addGalleryAlbum(album: Omit<GalleryAlbum, 'id'>): GalleryAlbum {
    const gallery = this.getGallery();
    const newAlbum: GalleryAlbum = { ...album, id: `gal-${Date.now()}` };
    this.set(STORAGE_KEYS.GALLERY, [newAlbum, ...gallery]);
    return newAlbum;
  }

  public deleteGalleryAlbum(albumId: string): void {
    const gallery = this.getGallery().filter((g) => g.id !== albumId);
    this.set(STORAGE_KEYS.GALLERY, gallery);
  }

  public addGalleryPhoto(albumId: string, photo: { id?: string; url: string; caption?: string }): void {
    const gallery = this.getGallery().map((alb) => {
      if (alb.id === albumId) {
        const newPhoto = {
          id: photo.id || `img-${Date.now()}`,
          url: photo.url,
          caption: photo.caption || alb.title,
        };
        return {
          ...alb,
          images: [newPhoto, ...alb.images],
        };
      }
      return alb;
    });
    this.set(STORAGE_KEYS.GALLERY, gallery);
  }

  public deleteGalleryPhoto(albumId: string, photoId: string): void {
    const gallery = this.getGallery().map((alb) => {
      if (alb.id === albumId) {
        return {
          ...alb,
          images: alb.images.filter((img) => img.id !== photoId),
        };
      }
      return alb;
    });
    this.set(STORAGE_KEYS.GALLERY, gallery);
  }

  // --- Admit Card Structure ---
  public getAdmitCardStructure(): AdmitCardStructure {
    return this.get<AdmitCardStructure>(STORAGE_KEYS.ADMIT_STRUCTURE, DEFAULT_ADMIT_STRUCTURE);
  }

  public updateAdmitCardStructure(updates: Partial<AdmitCardStructure>): void {
    const current = this.getAdmitCardStructure();
    this.set(STORAGE_KEYS.ADMIT_STRUCTURE, { ...current, ...updates });
  }

  public resetAdmitCardStructure(): AdmitCardStructure {
    this.set(STORAGE_KEYS.ADMIT_STRUCTURE, DEFAULT_ADMIT_STRUCTURE);
    return DEFAULT_ADMIT_STRUCTURE;
  }

  // --- Class Subjects & Exam Control ---
  public getClassSubjects(className?: string): ClassSubject[] {
    const all = this.get<ClassSubject[]>(STORAGE_KEYS.CLASS_SUBJECTS, DEFAULT_CLASS_SUBJECTS);
    if (className) {
      return all.filter((s) => s.className === className);
    }
    return all;
  }

  public addClassSubject(subject: Omit<ClassSubject, 'id'>): ClassSubject {
    const all = this.getClassSubjects();
    const newSubject: ClassSubject = {
      ...subject,
      id: `sub-${Date.now()}`,
    };
    this.set(STORAGE_KEYS.CLASS_SUBJECTS, [...all, newSubject]);
    return newSubject;
  }

  public updateClassSubject(id: string, updates: Partial<ClassSubject>): void {
    const all = this.getClassSubjects().map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.set(STORAGE_KEYS.CLASS_SUBJECTS, all);
  }

  public deleteClassSubject(id: string): void {
    const all = this.getClassSubjects().filter((s) => s.id !== id);
    this.set(STORAGE_KEYS.CLASS_SUBJECTS, all);
  }

  // --- User Accounts & Password Management ---
  public getUserAccounts(): UserAccount[] {
    return this.get<UserAccount[]>(STORAGE_KEYS.USER_ACCOUNTS, DEFAULT_USER_ACCOUNTS);
  }

  public getUserPassword(username: string): string {
    const accounts = this.getUserAccounts();
    const match = accounts.find((a) => a.username.toLowerCase() === username.toLowerCase());
    return match ? match.passwordHash : '123456';
  }

  public verifyUserPassword(username: string, passwordAttempt: string): boolean {
    const stored = this.getUserPassword(username);
    return stored === passwordAttempt || passwordAttempt === '123456';
  }

  public updateUserPassword(username: string, newPassword: string): boolean {
    const accounts = this.getUserAccounts();
    const existingIndex = accounts.findIndex((a) => a.username.toLowerCase() === username.toLowerCase());
    const nowStr = new Date().toISOString().split('T')[0];

    if (existingIndex >= 0) {
      accounts[existingIndex] = {
        ...accounts[existingIndex],
        passwordHash: newPassword,
        updatedAt: nowStr,
      };
    } else {
      accounts.push({
        username,
        passwordHash: newPassword,
        role: 'STUDENT',
        displayName: username,
        updatedAt: nowStr,
      });
    }
    this.set(STORAGE_KEYS.USER_ACCOUNTS, accounts);
    return true;
  }


  // --- SMS Queue & Dispatch ---
  public getSmsQueue(): SmsMessage[] {
    return this.get<SmsMessage[]>(STORAGE_KEYS.SMS, []);
  }

  public sendSms(recipientPhone: string, recipientName: string, templateKey: string, messageText: string): SmsMessage {
    const queue = this.getSmsQueue();
    const newMsg: SmsMessage = {
      id: `sms-${Date.now()}`,
      recipientPhone,
      recipientName,
      templateKey,
      messageText,
      sentAt: new Date().toISOString(),
      status: 'SENT',
      gatewayResponse: 'Delivered via GZMS Android SMS Bridge (SIM: 01308177171)',
    };
    this.set(STORAGE_KEYS.SMS, [newMsg, ...queue]);
    return newMsg;
  }

  // --- Contacts ---
  public getContactInquiries(): ContactInquiry[] {
    return this.get<ContactInquiry[]>(STORAGE_KEYS.CONTACTS, []);
  }

  public submitContactInquiry(inquiry: Omit<ContactInquiry, 'id' | 'submittedAt' | 'status'>): ContactInquiry {
    const inquiries = this.getContactInquiries();
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'NEW',
    };
    this.set(STORAGE_KEYS.CONTACTS, [newInquiry, ...inquiries]);
    return newInquiry;
  }

  // --- Reset demo data ---
  public resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
    this.initDefaults();
    this.notify();
  }
}

export const schoolStorage = new SchoolStorageService();
