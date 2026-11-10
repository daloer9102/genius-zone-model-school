/**
 * Professional Single-Page A4 PDF Generators for Genius Zone Model School (GZMS)
 * Uses jsPDF to generate Admission Form, Result Card, Admit Card, Fee Challan, Congratulation Letter, and Notice.
 */

import { jsPDF } from 'jspdf';
import type {
  AdmissionApplication,
  StudentProfile,
  StudentResult,
  FeePayment,
  SchoolNotice,
  AdmitCardStructure,
} from '../types';
import { schoolStorage } from './storage';

/**
 * Helper to draw the standard GZMS Royal Blue & Gold Letterhead with dynamic school settings
 */
function drawSchoolLetterhead(doc: jsPDF, title: string, subtitle?: string): number {
  const settings = schoolStorage.getSettings();
  const schoolName = (settings.schoolNameEnglish || 'GENIUS ZONE MODEL SCHOOL').toUpperCase();
  const address = settings.addressEnglish || 'Balachowra, Badarganj, Rangpur, Bangladesh';
  const contact = `Phone: ${settings.phone} | Email: ${settings.email}`;
  const tagline = `${settings.taglineEnglish || 'Where Dreams Come True'} (${settings.taglineBangla || 'যেখানে স্বপ্ন সত্যি হয়'})`;

  // Top header color band
  doc.setFillColor(30, 64, 175); // Royal Blue #1e40af
  doc.rect(10, 10, 190, 4, 'F');

  doc.setFillColor(217, 119, 6); // Golden Accent #d97706
  doc.rect(10, 14, 190, 1.5, 'F');

  // School crest / logo badge
  doc.setFillColor(240, 247, 255);
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.8);
  doc.circle(26, 28, 10, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 64, 175);
  doc.text('GZMS', 21, 29);

  // Main Titles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(23, 37, 84); // Navy
  doc.text(schoolName, 42, 24);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`${address} | ${contact}`, 42, 30);
  doc.setFont('helvetica', 'italic');
  doc.text(`Tagline: ${tagline}`, 42, 35);

  // Title Box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(10, 40, 190, 10, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text(title.toUpperCase(), 105, 46.5, { align: 'center' });

  if (subtitle) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(subtitle, 105, 49.5, { align: 'center' });
  }

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(10, 53, 200, 53);

  return 58;
}

/**
 * 1. Online Admission Form PDF (A4)
 */
export function generateAdmissionFormPDF(app: AdmissionApplication): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = drawSchoolLetterhead(doc, 'Online Admission Application Form', `Academic Session: ${app.session}`);

  // Meta bar: App ID & Registration
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(10, y, 190, 8, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`Application ID: ${app.applicationId}`, 14, y + 5.5);
  doc.setTextColor(30, 64, 175);
  doc.text(`Registration No: ${app.regNumber}`, 85, y + 5.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Applied Date: ${app.appliedDate}`, 150, y + 5.5);
  y += 14;

  // Photo box on the right
  doc.setDrawColor(148, 163, 184);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(155, y, 45, 50, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('AFFIX STUDENT', 177.5, y + 23, { align: 'center' });
  doc.text('PASSPORT PHOTO', 177.5, y + 27, { align: 'center' });

  // Student Information Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text('1. APPLICANT INFORMATION', 10, y);
  y += 5;

  const leftFields = [
    ['Name (English):', app.studentNameEnglish.toUpperCase()],
    ['Name (Bangla):', app.studentNameBangla || 'N/A'],
    ['Applying For Class:', app.appliedClass],
    ['Gender & DOB:', `${app.gender} | ${app.dateOfBirth}`],
    ['Previous School:', app.previousSchool || 'N/A'],
    ['Previous GPA / Result:', app.previousResultGpa || 'N/A'],
  ];

  doc.setFontSize(9);
  leftFields.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(label, 10, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(val, 55, y);
    y += 6.5;
  });

  y = Math.max(y, 115);

  // Address Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text('2. ADDRESS & RESIDENCE', 10, y);
  y += 6;

  doc.setFontSize(9);
  const addrFields = [
    ['Village / Area:', app.village || 'Balachowra'],
    ['Post Office:', app.postOffice || 'Badarganj'],
    ['Upazila & District:', `${app.upazila || 'Badarganj'}, ${app.district || 'Rangpur'}`],
    ['Country:', app.country || 'Bangladesh'],
    ['Present Address:', app.presentAddress],
  ];

  addrFields.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(label, 10, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(val, 55, y);
    y += 6;
  });

  y += 4;
  // Guardian Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text('3. PARENT & GUARDIAN INFORMATION', 10, y);
  y += 6;

  const parentFields = [
    ["Father's Name:", app.fatherNameEnglish.toUpperCase()],
    ["Mother's Name:", app.motherNameEnglish.toUpperCase()],
    ['Guardian Phone:', app.guardianPhone],
    ['Alternative Phone:', app.altPhone || 'None'],
  ];

  parentFields.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(label, 10, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(val, 55, y);
    y += 6;
  });

  // Declaration box
  y += 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(10, y, 190, 22, 'FD');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Applicant Declaration: I hereby declare that all the information provided in this application form is true, correct,',
    14,
    y + 6
  );
  doc.text(
    'and complete to the best of my knowledge. I promise to abide by all the rules and regulations of Genius Zone Model School.',
    14,
    y + 11
  );
  doc.text(
    'আমি প্রত্যয়ন করছি যে, উপরিউক্ত সকল তথ্য সত্য এবং নির্ভুল। আমি বিদ্যালয়ের যাবতীয় নিয়মকানুন মেনে চলার অঙ্গীকার করছি।',
    14,
    y + 16
  );

  // Signatures
  y += 45;
  doc.setDrawColor(148, 163, 184);
  doc.line(15, y, 65, y);
  doc.line(80, y, 130, y);
  doc.line(145, y, 195, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Guardian's Signature", 24, y + 5);
  doc.text('Office Authorized Officer', 88, y + 5);
  doc.text('Head Teacher / Principal', 153, y + 5);

  // Footer Note
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Official Document Generated by GZMS Digital Portal • Date: ${new Date().toLocaleDateString()}`, 105, 288, {
    align: 'center',
  });

  doc.save(`GZMS_Admission_${app.regNumber}.pdf`);
}

/**
 * 2. Congratulation Letter PDF (A4)
 */
export function generateCongratulationLetterPDF(app: AdmissionApplication): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = drawSchoolLetterhead(doc, 'Official Admission Confirmation & Welcome Letter');

  // Ref & Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Ref No: GZMS/ADM/${app.session}/${app.regNumber}`, 12, y);
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 160, y);
  y += 10;

  // Addressed To
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`To,`, 12, y);
  y += 5;
  doc.text(`${app.studentNameEnglish.toUpperCase()}`, 12, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(`Father's Name: ${app.fatherNameEnglish}`, 12, y);
  y += 5;
  doc.text(`Village: ${app.village || 'Balachowra'}, Badarganj, Rangpur`, 12, y);
  y += 8;

  // Subject
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(`Subject: Congratulations on Admission to ${app.assignedClass || app.appliedClass}!`, 12, y);
  y += 8;

  // Body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const bodyText =
    `Dear ${app.studentNameEnglish},\n\n` +
    `On behalf of the Governing Body, Teachers, and Administration of Genius Zone Model School (GZMS), ` +
    `we are delighted to inform you that your admission application for the Academic Session ${app.session} has been approved.\n\n` +
    `We extend our warmest congratulations to you and your proud family. At Genius Zone Model School, we are deeply committed to nurturing intellectual excellence, ethical leadership, moral character, and creative capability in an inspiring, modern educational environment.`;

  const lines = doc.splitTextToSize(bodyText, 185);
  doc.text(lines, 12, y);
  y += lines.length * 5 + 6;

  // Student Profile Table
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(12, y, 186, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 64, 175);
  doc.text('OFFICIAL ENROLLMENT CREDENTIALS', 16, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`Permanent Registration No: ${app.regNumber}`, 16, y + 14);
  doc.text(`Class Assigned: ${app.assignedClass || app.appliedClass}`, 16, y + 21);
  doc.text(`Class Roll Number: ${app.assignedRoll || '0001'}`, 110, y + 14);
  doc.text(`Academic Session: ${app.session}`, 110, y + 21);

  if (app.scholarshipWaiverPct && app.scholarshipWaiverPct > 0) {
    doc.setTextColor(217, 119, 6);
    doc.setFont('helvetica', 'bold');
    doc.text(`Special Scholarship / Tuition Fee Waiver Approved: ${app.scholarshipWaiverPct}%`, 16, y + 28);
  }

  y += 42;

  const instructions =
    `Important Instructions for Student & Guardian:\n` +
    `1. Please preserve your Registration Number (${app.regNumber}) safely for all future academic transactions, fees, and results.\n` +
    `2. Your Student ID Card with personalized attendance QR Code will be issued within the first week of classes.\n` +
    `3. You can access your personalized online student portal using your Registration Number.\n\n` +
    `Welcome to the Genius Zone family! May your dreams come true here.`;

  const instLines = doc.splitTextToSize(instructions, 185);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(instLines, 12, y);

  y += instLines.length * 4.5 + 16;

  // Director & Principal Signatures
  doc.setDrawColor(148, 163, 184);
  doc.line(20, y + 15, 75, y + 15);
  doc.line(135, y + 15, 190, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Head Teacher', 35, y + 20);
  doc.text('Director & Founder', 148, y + 20);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Genius Zone Model School', 27, y + 24);
  doc.text('Genius Zone Model School', 142, y + 24);

  // Official Seal
  doc.setDrawColor(30, 64, 175);
  doc.setFillColor(240, 247, 255);
  doc.circle(105, y + 14, 12, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(30, 64, 175);
  doc.text('OFFICIAL SEAL', 105, y + 13, { align: 'center' });
  doc.text('GZMS • 2026', 105, y + 17, { align: 'center' });

  doc.save(`GZMS_Congratulation_${app.regNumber}.pdf`);
}

/**
 * 3. Academic Result Card / Progress Report PDF (A4)
 */
export function generateResultCardPDF(result: StudentResult): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = drawSchoolLetterhead(doc, 'Academic Progress Report & Marksheet', result.examName);

  // Student Info Header
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(10, y, 190, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Student Name: ${result.studentName.toUpperCase()}`, 15, y + 6);
  doc.text(`Registration No: ${result.studentReg}`, 15, y + 12);
  doc.text(`Class: ${result.className}`, 15, y + 18);

  doc.text(`Roll Number: ${result.rollNumber}`, 115, y + 6);
  doc.text(`Session: ${result.session}`, 115, y + 12);
  doc.text(`Position in Class: ${result.positionInClass ? `Rank ${result.positionInClass}` : 'Top 10%'}`, 115, y + 18);

  y += 28;

  // Marks Table Header
  doc.setFillColor(30, 64, 175);
  doc.rect(10, y, 190, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('SL', 14, y + 5.5);
  doc.text('SUBJECT NAME', 30, y + 5.5);
  doc.text('FULL MARKS', 90, y + 5.5);
  doc.text('OBTAINED MARKS', 122, y + 5.5);
  doc.text('LETTER GRADE', 160, y + 5.5);
  doc.text('GPA', 188, y + 5.5);
  y += 8;

  // Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);

  result.subjects.forEach((s, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(10, y, 190, 7.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(10, y + 7.5, 200, y + 7.5);

    doc.text(String(idx + 1), 15, y + 5);
    doc.text(s.subjectName, 30, y + 5);
    doc.text('100', 95, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.text(String(s.marks), 132, y + 5);
    doc.text(s.letterGrade, 168, y + 5);
    doc.text(s.gpa.toFixed(2), 188, y + 5);
    doc.setFont('helvetica', 'normal');

    y += 7.5;
  });

  // Summary Box
  y += 4;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(148, 163, 184);
  doc.rect(10, y, 190, 18, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 64, 175);
  doc.text(`Total Marks: ${result.totalMarks}`, 15, y + 6);
  doc.text(`Average Marks: ${result.averageMarks}%`, 75, y + 6);
  doc.text(`Overall GPA: ${result.overallGpa.toFixed(2)}`, 135, y + 6);

  doc.setTextColor(15, 23, 42);
  doc.text(`Final Grade: ${result.finalGrade}`, 15, y + 13);
  doc.text(`Result Status: ${result.finalGrade !== 'F' ? 'PASSED' : 'FAILED'}`, 75, y + 13);
  doc.text(`Remarks: ${result.remarks || 'Excellent progress'}`, 135, y + 13);

  // Bangladesh Grading Scale Legend
  y += 24;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('BANGLADESH EDUCATION BOARD GRADING SYSTEM:', 10, y);
  y += 4;

  const gradingScales = [
    '80-100: A+ (5.00)',
    '70-79: A (4.00)',
    '60-69: A- (3.50)',
    '50-59: B (3.00)',
    '40-49: C (2.00)',
    '33-39: D (1.00)',
    '00-32: F (0.00)',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(gradingScales.join('   |   '), 10, y);

  // Signatures
  y += 35;
  doc.setDrawColor(148, 163, 184);
  doc.line(15, y, 65, y);
  doc.line(80, y, 130, y);
  doc.line(145, y, 195, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Class Teacher', 28, y + 5);
  doc.text('Exam Controller', 92, y + 5);
  doc.text('Head Teacher', 158, y + 5);

  doc.save(`GZMS_Result_${result.studentReg}.pdf`);
}

/**
 * 4. Examination Admit Card PDF (Single A4 Page)
 */
export function generateAdmitCardPDF(
  student: StudentProfile,
  examName?: string,
  subjects?: string[],
  customStructure?: AdmitCardStructure
): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const structure = customStructure || schoolStorage.getAdmitCardStructure();
  const title = structure.examTitleEnglish || examName || 'Official Examination Admit Card';
  const subHeader = `Center: ${structure.centerNameEnglish} | Session: ${structure.sessionYear}`;

  let y = drawSchoolLetterhead(doc, title, subHeader);

  // Outer Decorative Border
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.6);
  doc.rect(8, 8, 194, 281);

  // Student Details & Photo/QR Section
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(12, y, 186, 44, 2, 2, 'FD');

  // Photo space (if enabled)
  if (structure.showStudentPhoto) {
    doc.setDrawColor(148, 163, 184);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(154, y + 4, 36, 36, 1, 1, 'FD');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('STUDENT PHOTO', 172, y + 21, { align: 'center' });
  }

  // QR Code space (if enabled) - explicitly encodes Name and Username
  if (structure.showQrCode) {
    const qrX = structure.showStudentPhoto ? 116 : 154;
    doc.setDrawColor(30, 64, 175);
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(qrX, y + 4, 34, 36, 1, 1, 'FD');

    // Draw stylized QR block
    doc.setFillColor(30, 64, 175);
    doc.rect(qrX + 3, y + 7, 7, 7, 'F');
    doc.rect(qrX + 24, y + 7, 7, 7, 'F');
    doc.rect(qrX + 3, y + 23, 7, 7, 'F');
    doc.rect(qrX + 13, y + 15, 8, 8, 'F');

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('DIGITAL ID QR', qrX + 17, y + 34, { align: 'center' });
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`User: ${student.regNumber}`, qrX + 17, y + 38, { align: 'center' });
  }

  // Student Info Fields
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Candidate Name: ${student.nameEnglish.toUpperCase()}`, 16, y + 9);
  doc.text(`Bangla Name: ${student.nameBangla || 'N/A'}`, 16, y + 16);
  doc.text(`Registration No / Username: ${student.regNumber}`, 16, y + 23);
  doc.text(`Class: ${student.className} (Section: ${student.section || 'A'})`, 16, y + 30);
  doc.text(`Roll Number: ${student.rollNumber}`, 16, y + 37);

  if (structure.showGuardianPhone && student.guardianPhone) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Guardian Contact: ${student.guardianPhone}`, 16, y + 42);
  }

  y += 48;

  // Subjects Appearing For
  doc.setFillColor(30, 64, 175);
  doc.rect(12, y, 186, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('EXAMINATION SUBJECTS SCHEDULE', 16, y + 5);
  y += 7;

  const defaultSubs = subjects && subjects.length > 0
    ? subjects
    : ['Bangla 1st', 'Bangla 2nd', 'English', 'Mathematics', 'General Science', 'Religion & Moral Education'];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  defaultSubs.slice(0, 7).forEach((sub, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
    doc.rect(12, y, 186, 6.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(12, y + 6.5, 198, y + 6.5);

    doc.text(`${i + 1}.`, 16, y + 4.5);
    doc.text(sub, 26, y + 4.5);
    if (structure.showRoomNumber) {
      doc.text('Date: Routine Schedule', 110, y + 4.5);
      doc.text('Room: Assigned Center', 155, y + 4.5);
    }
    y += 6.5;
  });

  // Examination Rules in Bangla & English from structure
  y += 5;
  doc.setFillColor(254, 243, 199); // Golden tint
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(12, y, 186, 52, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(146, 64, 14);
  doc.text('পরীক্ষার্থীদের জন্য বিশেষ নিয়মাবলী (MANDATORY EXAMINATION RULES):', 16, y + 7);

  const displayRules = structure.rulesBangla && structure.rulesBangla.length > 0
    ? structure.rulesBangla
    : [
        '১. পরীক্ষা শুরুর কমপক্ষে ১৫ মিনিট পূর্বে অবশ্যই পরীক্ষা কক্ষে আসন গ্রহণ করতে হবে।',
        '২. মূল প্রবেশপত্র (Admit Card) ব্যতীত কোনো শিক্ষার্থীকে পরীক্ষা কেন্দ্রে প্রবেশ করতে দেওয়া হবে না।',
        '৩. পরীক্ষা কক্ষে মোবাইল ফোন, ক্যালকুলেটর বা যেকোনো অসদুপায়ের কাগজ বহন করা সম্পূর্ণ নিষিদ্ধ।',
        '৪. উত্তরপত্রে রোল নম্বর ও রেজিস্ট্রেশন নম্বর সঠিকভাবে পূরণ করতে হবে; কোনো প্রকার ঘষামাজা করা যাবে না।',
        '৫. শিক্ষক ও কক্ষ পরিদর্শকের সকল যুক্তিসঙ্গত নির্দেশ অক্ষরে অক্ষরে পালন করতে হবে।',
      ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  let ruleY = y + 14;
  displayRules.slice(0, 5).forEach((r) => {
    doc.text(r, 16, ruleY);
    ruleY += 7.2;
  });

  // Disclaimer Note
  if (structure.disclaimerNoteBangla) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(180, 83, 9);
    doc.text(`* ${structure.disclaimerNoteBangla}`, 16, y + 49);
  }

  // Signatures
  y += 74;
  doc.setDrawColor(148, 163, 184);
  doc.line(20, y, 75, y);
  doc.line(135, y, 190, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(structure.controllerSignatureTitle || 'Exam Controller', 30, y + 5);
  doc.text(structure.principalSignatureTitle || 'Head Teacher', 148, y + 5);

  // Seal
  doc.setDrawColor(30, 64, 175);
  doc.circle(105, y - 2, 11, 'D');
  doc.setFontSize(7);
  doc.setTextColor(30, 64, 175);
  doc.text('GZMS SEAL', 105, y - 3, { align: 'center' });
  doc.text('VERIFIED', 105, y + 1, { align: 'center' });

  doc.save(`GZMS_AdmitCard_${student.regNumber}.pdf`);
}

/**
 * 5. Fee Confirmation Challan Receipt PDF (A4 with "PAID" stamp)
 */
export function generateFeeChallanPDF(payment: FeePayment, student?: StudentProfile): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = drawSchoolLetterhead(doc, 'Official Fee Payment Challan & Receipt', `Challan No: ${payment.challanNumber}`);

  // Status Badge
  const isApproved = payment.status === 'APPROVED';
  doc.setFillColor(isApproved ? 220 : 254, isApproved ? 252 : 243, isApproved ? 231 : 199);
  doc.setDrawColor(isApproved ? 22 : 217, isApproved ? 101 : 119, isApproved ? 52 : 6);
  doc.roundedRect(145, y, 55, 12, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(isApproved ? 22 : 180, isApproved ? 101 : 83, isApproved ? 52 : 9);
  doc.text(isApproved ? 'VERIFIED • PAID' : 'PENDING VERIFICATION', 172.5, y + 7.5, { align: 'center' });

  // Student Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('STUDENT INFORMATION', 12, y + 5);
  y += 12;

  const infoFields = [
    ['Student Name:', payment.studentName.toUpperCase()],
    ['Registration No:', payment.studentReg],
    ['Class & Roll:', `Class ${payment.className} | Roll: ${payment.rollNumber}`],
    ['Payment Date:', payment.paymentDate],
    ['Payment Method:', `${payment.paymentMethod} (Sender: ${payment.bkashSenderPhone || 'N/A'})`],
    ['Transaction ID (TrxID):', payment.transactionId],
  ];

  doc.setFontSize(9);
  infoFields.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(label, 12, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(val, 65, y);
    y += 6.5;
  });

  y += 6;

  // Payment Breakdown Table
  doc.setFillColor(30, 64, 175);
  doc.rect(12, y, 186, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('DESCRIPTION / FEE CATEGORY', 16, y + 5.5);
  doc.text('MONTH / PERIOD', 110, y + 5.5);
  doc.text('AMOUNT (BDT)', 165, y + 5.5);
  y += 8;

  doc.setFillColor(248, 250, 252);
  doc.rect(12, y, 186, 12, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(12, y + 12, 198, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(payment.category, 16, y + 7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(payment.monthCovered || 'Regular Session', 110, y + 7.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`BDT ${payment.amount.toLocaleString()}/-`, 165, y + 7.5);

  y += 20;

  // Total Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(110, y, 88, 16, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text('TOTAL PAID:', 116, y + 10.5);
  doc.text(`BDT ${payment.amount.toLocaleString()} TAKA`, 150, y + 10.5);

  // RED "PAID" STAMP
  if (isApproved) {
    doc.saveGraphicsState();
    doc.setDrawColor(220, 38, 38); // Red
    doc.setLineWidth(1.2);
    doc.roundedRect(30, y - 5, 50, 24, 3, 3, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(220, 38, 38);
    doc.text('PAID', 55, y + 7, { align: 'center' });
    doc.setFontSize(8);
    doc.text('ACCOUNTS • GZMS', 55, y + 14, { align: 'center' });
    doc.restoreGraphicsState();
  }

  // Signatures
  y += 60;
  doc.setDrawColor(148, 163, 184);
  doc.line(20, y, 75, y);
  doc.line(135, y, 190, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Student / Guardian Signature', 23, y + 5);
  doc.text('Accounts Officer / Head Teacher', 135, y + 5);

  doc.save(`GZMS_Challan_${payment.challanNumber}.pdf`);
}

/**
 * 6. Official School Notice PDF (A4 on letterhead)
 */
export function generateSchoolNoticePDF(notice: SchoolNotice): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = drawSchoolLetterhead(doc, 'Official School Notice', `Category: ${notice.category}`);

  // Date & Ref
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Notice Ref: GZMS/NOT/${new Date().getFullYear()}/${notice.id.slice(0, 6).toUpperCase()}`, 12, y);
  doc.text(`Published: ${notice.publishDate}`, 160, y);
  y += 10;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175);
  const titleLines = doc.splitTextToSize(notice.title, 185);
  doc.text(titleLines, 12, y);
  y += titleLines.length * 6 + 4;

  if (notice.titleBangla) {
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text(notice.titleBangla, 12, y);
    y += 8;
  }

  // Target audience badge
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(12, y, 90, 7, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`TARGET AUDIENCE: ${notice.targetAudience} ${notice.targetClass ? `(${notice.targetClass})` : ''}`, 15, y + 4.5);
  y += 14;

  // Content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const contentLines = doc.splitTextToSize(notice.content, 185);
  doc.text(contentLines, 12, y);
  y += contentLines.length * 5.5 + 20;

  // Signatures
  doc.setDrawColor(148, 163, 184);
  doc.line(135, y, 190, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(notice.authorDesignation || 'Head Teacher', 140, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Genius Zone Model School', 140, y + 9);

  doc.save(`GZMS_Notice_${notice.id.slice(0, 6)}.pdf`);
}
