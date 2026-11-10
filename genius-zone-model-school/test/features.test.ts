import { test, describe, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage for Node test environment
const mockStorage: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, val: string) => { mockStorage[key] = val; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
  key: (i: number) => Object.keys(mockStorage)[i] || null,
  length: 0,
};

import { schoolStorage } from '../src/services/storage.ts';

describe('GZMS Core Requirements Verification', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('1. Every student, teacher, and admin can change their own password', () => {
    // Admin password
    assert.strictEqual(schoolStorage.verifyUserPassword('admin', '123456'), true);
    assert.strictEqual(schoolStorage.verifyUserPassword('admin', 'wrongpass'), false);
    
    // Change Admin password
    schoolStorage.updateUserPassword('admin', 'Admin@2026Secure!');
    assert.strictEqual(schoolStorage.verifyUserPassword('admin', 'Admin@2026Secure!'), true);
    assert.strictEqual(schoolStorage.verifyUserPassword('admin', 'oldWrongPass'), false);

    // Teacher password
    assert.strictEqual(schoolStorage.verifyUserPassword('teacher', '123456'), true);
    schoolStorage.updateUserPassword('teacher', 'TeacherNew2026#');
    assert.strictEqual(schoolStorage.verifyUserPassword('teacher', 'TeacherNew2026#'), true);

    // Student password
    assert.strictEqual(schoolStorage.verifyUserPassword('GZMS0001', '123456'), true);
    schoolStorage.updateUserPassword('GZMS0001', 'StudentTanvir99$');
    assert.strictEqual(schoolStorage.verifyUserPassword('GZMS0001', 'StudentTanvir99$'), true);
  });

  test('2. Admin can change school logo and taglines', () => {
    const originalSettings = schoolStorage.getSettings();
    assert.ok(originalSettings.schoolNameEnglish);

    // Update logo and taglines
    const newLogo = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
    const newTaglineBn = 'উন্নত চরিত্র ও আধুনিক শিক্ষার অনন্য সমন্বয়';
    const newTaglineEn = 'Excellence in Ethics and Modern Education';

    schoolStorage.updateSettings({
      logoUrl: newLogo,
      taglineBangla: newTaglineBn,
      taglineEnglish: newTaglineEn,
    });

    const updated = schoolStorage.getSettings();
    assert.strictEqual(updated.logoUrl, newLogo);
    assert.strictEqual(updated.taglineBangla, newTaglineBn);
    assert.strictEqual(updated.taglineEnglish, newTaglineEn);
  });

  test('3. Admin can upload photo on photo gallery, create albums, and delete photos', () => {
    const initialAlbums = schoolStorage.getGallery();
    assert.ok(initialAlbums.length > 0);
    const targetAlbum = initialAlbums[0];
    const initialPhotoCount = targetAlbum.images.length;

    // Add new photo
    const addedPhoto = schoolStorage.addGalleryPhoto(targetAlbum.id, {
      url: 'https://example.com/sports-event-2026.jpg',
      caption: 'পুরস্কার বিতরণী ২০২৬',
    });
    assert.ok(addedPhoto);
    assert.strictEqual(addedPhoto?.caption, 'পুরস্কার বিতরণী ২০২৬');

    const updatedAlbums = schoolStorage.getGallery();
    const updatedTarget = updatedAlbums.find(a => a.id === targetAlbum.id);
    assert.strictEqual(updatedTarget?.images.length, initialPhotoCount + 1);

    // Delete photo
    if (addedPhoto) {
      schoolStorage.deleteGalleryPhoto(targetAlbum.id, addedPhoto.id);
      const afterDeleteAlbums = schoolStorage.getGallery();
      const afterTarget = afterDeleteAlbums.find(a => a.id === targetAlbum.id);
      assert.strictEqual(afterTarget?.images.length, initialPhotoCount);
    }
  });

  test('4. Admin can change structure of admit card and custom Bengali rules', () => {
    const defaultStructure = schoolStorage.getAdmitCardStructure();
    assert.ok(defaultStructure.rulesBangla.length >= 5);
    assert.strictEqual(defaultStructure.showQrCode, true);

    // Update structure
    schoolStorage.updateAdmitCardStructure({
      examTitleEnglish: 'Annual Final Examination 2026',
      centerNameEnglish: 'Genius Zone Main Campus Hall A',
      rulesBangla: [
        '১. পরীক্ষা শুরুর ১৫ মিনিট পূর্বে নির্ধারিত আসনে বসতে হবে।',
        '২. প্রবেশপত্র ছাড়া পরীক্ষা কক্ষে প্রবেশ সম্পূর্ণ নিষিদ্ধ।',
        '৩. কোনো ধরনের মোবাইল ফোন বা ইলেকট্রনিক ডিভাইস আনা যাবে না।',
        '৪. উত্তরপত্রে রোল ও রেজিস্ট্রেশন সঠিকভাবে পূরণ করতে হবে।',
        '৫. শৃঙ্খলাভঙ্গের কারণে যেকোনো পরীক্ষার্থীর খাতা বাতিল হতে পারে।',
      ],
      showRoomNumber: true,
      showGuardianPhone: true,
    });

    const updatedStructure = schoolStorage.getAdmitCardStructure();
    assert.strictEqual(updatedStructure.examTitleEnglish, 'Annual Final Examination 2026');
    assert.strictEqual(updatedStructure.centerNameEnglish, 'Genius Zone Main Campus Hall A');
    assert.strictEqual(updatedStructure.rulesBangla.length, 5);
    assert.strictEqual(updatedStructure.showRoomNumber, true);
  });

  test('5. Exam control subject assign class update with subject', () => {
    const initialSubs = schoolStorage.getClassSubjects('Class 5');
    assert.ok(initialSubs.length > 0);

    // Add subject
    const newSubject = schoolStorage.addClassSubject({
      className: 'Class 5',
      subjectNameBangla: 'তথ্য ও যোগাযোগ প্রযুক্তি',
      subjectNameEnglish: 'Information & Communication Technology',
      subjectCode: '109',
      fullMarks: 50,
      passMarks: 17,
      teacherName: 'Md. Rafiqul Islam',
      isCompulsory: true,
    });
    assert.ok(newSubject.id);

    const class5Subs = schoolStorage.getClassSubjects('Class 5');
    const found = class5Subs.find(s => s.subjectCode === '109');
    assert.ok(found);
    assert.strictEqual(found?.fullMarks, 50);

    // Update subject
    schoolStorage.updateClassSubject(newSubject.id, { fullMarks: 100, passMarks: 33 });
    const updatedSub = schoolStorage.getClassSubjects('Class 5').find(s => s.id === newSubject.id);
    assert.strictEqual(updatedSub?.fullMarks, 100);

    // Delete subject
    schoolStorage.deleteClassSubject(newSubject.id);
    assert.strictEqual(schoolStorage.getClassSubjects('Class 5').find(s => s.id === newSubject.id), undefined);
  });
});
