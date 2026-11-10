/**
 * Core Type Definitions for Genius Zone Model School (GZMS)
 */

export type UserRole = 'ADMIN' | 'TEACHER' | 'STAFF' | 'STUDENT' | 'GUARDIAN' | 'GUEST';

export type Language = 'bn' | 'en';

export interface User {
  id: string;
  username: string;
  nameBangla: string;
  nameEnglish: string;
  role: UserRole;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  linkedStudentId?: string; // For guardian/student
  linkedTeacherId?: string; // For teacher/staff
}

export interface StudentProfile {
  id: string;
  regNumber: string; // e.g. GZMS0001
  rollNumber: string; // e.g. 0001
  nameBangla: string;
  nameEnglish: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  bloodGroup?: string;
  photoUrl: string;
  className: string;
  section: string;
  session: string; // e.g. 2026
  previousSchool?: string;
  previousClass?: string;
  // Address
  village: string;
  postOffice: string;
  upazila: string;
  district: string;
  country: string;
  // Guardian details
  fatherNameBangla?: string;
  fatherNameEnglish: string;
  fatherOccupation?: string;
  motherNameBangla?: string;
  motherNameEnglish: string;
  guardianPhone: string;
  altPhone?: string;
  presentAddress: string;
  permanentAddress: string;
  // Status
  status: 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED';
  admissionDate: string;
  scholarshipPct?: number; // e.g. 25 for 25% waiver
}

export interface AdmissionApplication {
  id: string;
  applicationId: string; // e.g. APP-2026-001
  regNumber: string; // Assigned sequential GZMS0001
  appliedClass: string;
  session: string;
  appliedDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CORRECTION_REQUIRED';
  assignedRoll?: string;
  assignedClass?: string;
  scholarshipWaiverPct?: number;
  adminRemarks?: string;
  // Student Data
  studentNameBangla: string;
  studentNameEnglish: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  photoUrl: string;
  previousSchool?: string;
  previousClass?: string;
  previousResultGpa?: string;
  village: string;
  postOffice: string;
  upazila: string;
  district: string;
  country: string;
  // Guardian Data
  fatherNameEnglish: string;
  motherNameEnglish: string;
  guardianPhone: string;
  altPhone?: string;
  presentAddress: string;
  permanentAddress: string;
}

export interface TeacherProfile {
  id: string;
  nameBangla: string;
  nameEnglish: string;
  designationBangla: string;
  designationEnglish: string;
  subjectSpecialization: string;
  assignedClasses: string[];
  assignedSubjects: string[];
  educationalQualification: string;
  shortBio: string;
  phone: string;
  email: string;
  photoUrl: string;
  isCommitteeMember?: boolean;
  committeeDesignation?: string;
  joiningDate: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
}

export interface StaffProfile {
  id: string;
  nameBangla: string;
  nameEnglish: string;
  designation: string;
  roleDescription: string;
  phone: string;
  photoUrl: string;
  joiningDate: string;
}

export interface ClassRoutineItem {
  id: string;
  className: string;
  section: string;
  subject: string;
  teacherName: string;
  dayOfWeek: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  startTime: string; // e.g. "09:30"
  endTime: string; // e.g. "10:15"
  roomNumber: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentReg: string;
  studentName: string;
  className: string;
  rollNumber: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  method: 'QR_SCAN' | 'MANUAL';
  smsSent?: boolean;
}

export interface ExamRecord {
  id: string;
  examName: string; // e.g. "First Terminal Exam 2026"
  examNameBangla: string;
  session: string;
  startDate: string;
  endDate: string;
  admitCardDistributionDate: string;
  assignedClasses: string[];
  rulesBangla: string[];
  isPublished: boolean;
}

export interface SubjectMarks {
  subjectName: string;
  marks: number;
  highestMarks?: number;
  letterGrade: string;
  gpa: number;
}

export interface StudentResult {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentReg: string;
  studentName: string;
  className: string;
  rollNumber: string;
  session: string;
  subjects: SubjectMarks[];
  totalMarks: number;
  averageMarks: number;
  overallGpa: number;
  finalGrade: string;
  positionInClass?: number;
  remarks: string;
  isPublished: boolean;
  publishedDate?: string;
}

export interface HomeworkItem {
  id: string;
  teacherId: string;
  teacherName: string;
  className: string;
  subject: string;
  topic: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  attachmentName?: string;
  instructions?: string;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  regNumber: string;
  submissionDate: string;
  submittedContent: string;
  attachmentName?: string;
  evaluation?: 'Best' | 'Good' | 'Not Satisfied';
  teacherFeedback?: string;
  evaluatedAt?: string;
}

export interface FeeStructure {
  id: string;
  className: string;
  session: string;
  admissionFee: number;
  monthlyTuitionFee: number;
  examFee: number;
  sessionFee: number;
  otherCharges: number;
}

export interface FeePayment {
  id: string;
  challanNumber: string;
  studentId: string;
  studentReg: string;
  studentName: string;
  className: string;
  rollNumber: string;
  category: 'Monthly Tuition' | 'Admission Fee' | 'Exam Fee' | 'Session Fee' | 'Other';
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Cash';
  bkashSenderPhone?: string;
  transactionId: string;
  paymentDate: string;
  monthCovered?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  approvedDate?: string;
}

export interface SchoolNotice {
  id: string;
  title: string;
  titleBangla?: string;
  category: 'General' | 'Admission' | 'Exam' | 'Holiday' | 'Urgent';
  publishDate: string;
  expiryDate?: string;
  targetAudience: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'STAFF' | 'GUARDIANS' | 'CLASS_SPECIFIC';
  targetClass?: string;
  summary: string;
  content: string;
  isImportantOnHomepage?: boolean;
  authorDesignation: string;
  pdfAttachmentUrl?: string;
}

export interface StudentApplication {
  id: string;
  applicationNumber: string;
  applicantType: 'STUDENT' | 'TEACHER';
  applicantId: string;
  applicantName: string;
  regOrUsername: string;
  className?: string;
  rollNumber?: string;
  guardianPhone?: string;
  category: 'Leave of Absence' | 'Transfer Certificate' | 'Fee Waiver' | 'Scholarship' | 'Other';
  subject: string;
  reason: string;
  fromDate?: string;
  toDate?: string;
  submissionDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ADDITIONAL_INFO_REQUIRED';
  adminComments?: string;
  approvedDate?: string;
  approvedBy?: string;
}

export interface PromotionalPopupSettings {
  isEnabled: boolean;
  bannerImageUrl: string;
  title: string;
  subtitle: string;
  externalLink: string;
  startDate: string;
  endDate: string;
  displayFrequency: 'ONCE_PER_SESSION' | 'ALWAYS' | 'ONCE_PER_DAY';
}

export interface GalleryAlbum {
  id: string;
  title: string;
  eventName: string;
  date: string;
  description: string;
  coverImage: string;
  images: { id: string; url: string; caption?: string }[];
}

export interface SchoolSettings {
  schoolNameBangla: string;
  schoolNameEnglish: string;
  schoolShortName: string;
  taglineEnglish: string;
  taglineBangla: string;
  addressBangla: string;
  addressEnglish: string;
  email: string;
  phone: string;
  altPhone: string;
  logoUrl: string;
  directorName: string;
  directorTitle: string;
  directorSpeech: string;
  directorPhoto: string;
  directorSignature: string;
  presidentName: string;
  presidentTitle: string;
  presidentSpeech: string;
  presidentPhoto: string;
  presidentSignature: string;
  headTeacherName: string;
  headTeacherSignature: string;
  officialSealUrl: string;
  attendanceCutoffTime: string; // e.g. "09:20"
  schoolStartTime: string; // e.g. "09:00"
  smsPhoneBridge: string; // "01308177171"
  facebookUrl?: string;
  youtubeUrl?: string;
}

export interface SmsMessage {
  id: string;
  recipientPhone: string;
  recipientName: string;
  templateKey: string;
  messageText: string;
  sentAt: string;
  status: 'SENT' | 'PENDING' | 'FAILED';
  gatewayResponse?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'NEW' | 'RESOLVED';
}

export interface StudentAward {
  id: string;
  awardType: 'STUDENT_OF_WEEK' | 'STUDENT_OF_MONTH';
  period: string; // e.g. "November 2026"
  studentId: string;
  studentName: string;
  studentReg: string;
  rollNumber: string;
  className: string;
  photoUrl: string;
  score: number;
  reason: string;
  isPublished: boolean;
}

export interface TeacherAward {
  id: string;
  period: string; // e.g. "November 2026"
  teacherId: string;
  teacherName: string;
  designation: string;
  subject: string;
  photoUrl: string;
  achievements: string;
  isPublished: boolean;
}

export interface AdmitCardStructure {
  examTitleBangla: string;
  examTitleEnglish: string;
  sessionYear: string;
  centerNameBangla: string;
  centerNameEnglish: string;
  rulesBangla: string[];
  showQrCode: boolean;
  showStudentPhoto: boolean;
  showGuardianPhone: boolean;
  showRoomNumber: boolean;
  principalSignatureTitle: string;
  controllerSignatureTitle: string;
  disclaimerNoteBangla?: string;
}

export interface ClassSubject {
  id: string;
  subjectCode: string;
  subjectNameBangla: string;
  subjectNameEnglish: string;
  className: string;
  fullMarks: number;
  passMarks: number;
  teacherId?: string;
  teacherName?: string;
  isCompulsory: boolean;
}

export interface UserAccount {
  username: string; // "admin", "teacher", "GZMS0001", etc.
  passwordHash: string; // Plain/simple hash for local persistent storage
  role: UserRole;
  displayName: string;
  updatedAt: string;
}

export interface StudentQrPayload {
  name: string;
  username: string;
  regNumber: string;
  rollNumber: string;
  className: string;
  schoolShortName: string;
  verified: boolean;
}

