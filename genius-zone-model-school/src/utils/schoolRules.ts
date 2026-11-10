/**
 * Core school rules, calculations, and validators for Genius Zone Model School (GZMS)
 * Balachowra, Badarganj, Rangpur, Bangladesh
 */

export interface GradeResult {
  letter: string;
  gpa: number;
}

/**
 * Bangladesh Standard Grading System
 */
export function calculateBangladeshGrade(marks: number): GradeResult {
  const m = Math.round(marks);
  if (m >= 80) return { letter: 'A+', gpa: 5.0 };
  if (m >= 70) return { letter: 'A', gpa: 4.0 };
  if (m >= 60) return { letter: 'A-', gpa: 3.5 };
  if (m >= 50) return { letter: 'B', gpa: 3.0 };
  if (m >= 40) return { letter: 'C', gpa: 2.0 };
  if (m >= 33) return { letter: 'D', gpa: 1.0 };
  return { letter: 'F', gpa: 0.0 };
}

/**
 * Calculate overall GPA and final letter grade
 * Any failing subject (F) yields an overall F (0.0) as per Bangladesh Education Board standard
 */
export function calculateOverallResult(subjects: { marks: number }[]): {
  totalMarks: number;
  averageMarks: number;
  overallGpa: number;
  finalGrade: string;
  isPassed: boolean;
} {
  if (subjects.length === 0) {
    return {
      totalMarks: 0,
      averageMarks: 0,
      overallGpa: 0,
      finalGrade: 'N/A',
      isPassed: false,
    };
  }

  let totalMarks = 0;
  let totalGpa = 0;
  let hasFailed = false;

  for (const s of subjects) {
    totalMarks += s.marks;
    const grade = calculateBangladeshGrade(s.marks);
    totalGpa += grade.gpa;
    if (grade.gpa === 0) {
      hasFailed = true;
    }
  }

  const averageMarks = Math.round((totalMarks / subjects.length) * 10) / 10;
  if (hasFailed) {
    return {
      totalMarks,
      averageMarks,
      overallGpa: 0.0,
      finalGrade: 'F',
      isPassed: false,
    };
  }

  const unroundedGpa = totalGpa / subjects.length;
  const overallGpa = Math.min(5.0, Math.round(unroundedGpa * 100) / 100);

  let finalGrade = 'F';
  if (overallGpa >= 5.0) finalGrade = 'A+';
  else if (overallGpa >= 4.0) finalGrade = 'A';
  else if (overallGpa >= 3.5) finalGrade = 'A-';
  else if (overallGpa >= 3.0) finalGrade = 'B';
  else if (overallGpa >= 2.0) finalGrade = 'C';
  else if (overallGpa >= 1.0) finalGrade = 'D';

  return {
    totalMarks,
    averageMarks,
    overallGpa,
    finalGrade,
    isPassed: true,
  };
}

/**
 * Generate sequential registration number: GZMS0001, GZMS0002...
 * Ensures 4-digit zero-padded sequence
 */
export function generateNextRegNumber(existingRegs: string[]): string {
  let highestNum = 0;
  const prefix = 'GZMS';

  for (const reg of existingRegs) {
    if (typeof reg === 'string' && reg.startsWith(prefix)) {
      const numPart = parseInt(reg.slice(prefix.length), 10);
      if (!isNaN(numPart) && numPart > highestNum) {
        highestNum = numPart;
      }
    }
  }

  const nextNum = highestNum + 1;
  const padded = nextNum.toString().padStart(4, '0');
  return `${prefix}${padded}`;
}

/**
 * Format roll number to 4 digits (e.g., 1 -> '0001')
 */
export function formatRollNumber(roll: number | string): string {
  const num = typeof roll === 'string' ? parseInt(roll, 10) : roll;
  if (isNaN(num) || num <= 0) return '0001';
  return num.toString().padStart(4, '0');
}

/**
 * Calculate Student of the Week/Month performance score (0-100)
 * Default weights: Attendance: 30%, Academic: 35%, Homework: 20%, Participation: 15%
 */
export function calculateStudentPerformanceScore(params: {
  attendancePct: number;
  academicPct: number;
  homeworkPct: number;
  participationPct: number;
  weights?: {
    attendance: number;
    academic: number;
    homework: number;
    participation: number;
  };
}): number {
  const w = params.weights || {
    attendance: 0.30,
    academic: 0.35,
    homework: 0.20,
    participation: 0.15,
  };

  const score =
    params.attendancePct * w.attendance +
    params.academicPct * w.academic +
    params.homeworkPct * w.homework +
    params.participationPct * w.participation;

  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}

/**
 * Compare time (HH:MM or HH:MM:SS) against cutoff time (e.g. "09:20")
 */
export function isPastCutoffTime(currentTimeStr: string, cutoffTimeStr: string): boolean {
  const [currH, currM] = currentTimeStr.split(':').map((v) => parseInt(v, 10));
  const [cutH, cutM] = cutoffTimeStr.split(':').map((v) => parseInt(v, 10));

  if (currH > cutH) return true;
  if (currH === cutH && currM >= cutM) return true;
  return false;
}

/**
 * Calculate fee balances (Total, Approved Paid, Due)
 */
export function calculateFeeBalances(
  totalFee: number,
  payments: { amount: number; status: 'APPROVED' | 'PENDING' | 'REJECTED' }[]
): { totalPaid: number; pendingAmount: number; dueAmount: number } {
  let totalPaid = 0;
  let pendingAmount = 0;

  for (const p of payments) {
    if (p.status === 'APPROVED') {
      totalPaid += p.amount;
    } else if (p.status === 'PENDING') {
      pendingAmount += p.amount;
    }
  }

  const dueAmount = Math.max(0, totalFee - totalPaid);
  return { totalPaid, pendingAmount, dueAmount };
}

/**
 * Template interpolation for SMS / Notifications
 * Replaces [Student Name], [Date], [Class], [Roll], [Due Amount], etc.
 */
export function interpolateTemplate(
  template: string,
  variables: Record<string, string | number>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`\\[${key}\\]`, 'g');
    result = result.replace(placeholder, String(value));
  }
  return result;
}
