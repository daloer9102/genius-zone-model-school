import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBangladeshGrade,
  calculateOverallResult,
  generateNextRegNumber,
  formatRollNumber,
  calculateStudentPerformanceScore,
  isPastCutoffTime,
  calculateFeeBalances,
  interpolateTemplate,
} from './schoolRules';

test('calculateBangladeshGrade assigns standard Bangladesh board grades and GPA', () => {
  assert.deepEqual(calculateBangladeshGrade(85), { letter: 'A+', gpa: 5.0 });
  assert.deepEqual(calculateBangladeshGrade(80), { letter: 'A+', gpa: 5.0 });
  assert.deepEqual(calculateBangladeshGrade(75), { letter: 'A', gpa: 4.0 });
  assert.deepEqual(calculateBangladeshGrade(65), { letter: 'A-', gpa: 3.5 });
  assert.deepEqual(calculateBangladeshGrade(55), { letter: 'B', gpa: 3.0 });
  assert.deepEqual(calculateBangladeshGrade(45), { letter: 'C', gpa: 2.0 });
  assert.deepEqual(calculateBangladeshGrade(35), { letter: 'D', gpa: 1.0 });
  assert.deepEqual(calculateBangladeshGrade(32), { letter: 'F', gpa: 0.0 });
});

test('calculateOverallResult fails overall if any subject is F', () => {
  const resultWithFail = calculateOverallResult([
    { marks: 85 }, // A+
    { marks: 90 }, // A+
    { marks: 25 }, // F
  ]);
  assert.equal(resultWithFail.finalGrade, 'F');
  assert.equal(resultWithFail.overallGpa, 0.0);
  assert.equal(resultWithFail.isPassed, false);
});

test('calculateOverallResult computes average GPA and letter grade when passed', () => {
  const passedResult = calculateOverallResult([
    { marks: 85 }, // 5.0
    { marks: 75 }, // 4.0
    { marks: 65 }, // 3.5
  ]);
  // average GPA: (5.0 + 4.0 + 3.5)/3 = 4.17 -> Grade A
  assert.equal(passedResult.isPassed, true);
  assert.equal(passedResult.totalMarks, 225);
  assert.equal(passedResult.overallGpa, 4.17);
  assert.equal(passedResult.finalGrade, 'A');
});

test('generateNextRegNumber creates sequential GZMS0001, GZMS0002... without duplicates', () => {
  assert.equal(generateNextRegNumber([]), 'GZMS0001');
  assert.equal(generateNextRegNumber(['GZMS0001']), 'GZMS0002');
  assert.equal(generateNextRegNumber(['GZMS0001', 'GZMS0002', 'GZMS0009']), 'GZMS0010');
  assert.equal(generateNextRegNumber(['GZMS0099']), 'GZMS0100');
});

test('formatRollNumber creates clean 4-digit roll representations', () => {
  assert.equal(formatRollNumber(1), '0001');
  assert.equal(formatRollNumber(12), '0012');
  assert.equal(formatRollNumber('150'), '0150');
  assert.equal(formatRollNumber(0), '0001');
});

test('calculateStudentPerformanceScore applies configurable weightings accurately', () => {
  const score = calculateStudentPerformanceScore({
    attendancePct: 95,
    academicPct: 88,
    homeworkPct: 90,
    participationPct: 85,
  });
  // 95*0.3 + 88*0.35 + 90*0.2 + 85*0.15 = 28.5 + 30.8 + 18 + 12.75 = 90.05 -> 90.1
  assert.equal(score, 90.1);
});

test('isPastCutoffTime handles school attendance 9:20 cutoff', () => {
  assert.equal(isPastCutoffTime('09:15', '09:20'), false);
  assert.equal(isPastCutoffTime('09:20', '09:20'), true);
  assert.equal(isPastCutoffTime('09:25', '09:20'), true);
  assert.equal(isPastCutoffTime('10:00', '09:20'), true);
  assert.equal(isPastCutoffTime('08:55', '09:20'), false);
});

test('calculateFeeBalances computes approved paid amounts and remaining dues', () => {
  const balance = calculateFeeBalances(5000, [
    { amount: 2000, status: 'APPROVED' },
    { amount: 1000, status: 'PENDING' },
    { amount: 500, status: 'REJECTED' },
  ]);
  assert.equal(balance.totalPaid, 2000);
  assert.equal(balance.pendingAmount, 1000);
  assert.equal(balance.dueAmount, 3000);
});

test('interpolateTemplate populates variables into Bangla & English notifications', () => {
  const tpl = 'সম্মানিত অভিভাবক, আপনার সন্তান [Student Name] আজ [Date] তারিখে ক্লাসে উপস্থিত ছিল না।';
  const text = interpolateTemplate(tpl, {
    'Student Name': 'তানভীর আহমেদ',
    Date: '10/11/2026',
  });
  assert.equal(
    text,
    'সম্মানিত অভিভাবক, আপনার সন্তান তানভীর আহমেদ আজ 10/11/2026 তারিখে ক্লাসে উপস্থিত ছিল না।'
  );
});
