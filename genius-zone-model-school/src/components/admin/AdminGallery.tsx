/**
 * Admin Photo Gallery Management Module for Genius Zone Model School (GZMS)
 * Enables administrators to upload photos (file upload or URL), manage albums, and curate public gallery.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import type { GalleryAlbum } from '../../types';
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileImage,
} from 'lucide-react';

export const AdminGallery: React.FC = () => {
  const { showToast, t } = useApp();
  const albums = schoolStorage.getGallery();

  const [activeMode, setActiveMode] = useState<'ADD_PHOTO' | 'CREATE_ALBUM'>('ADD_PHOTO');

  // Form state for adding photo
  const [selectedAlbumId, setSelectedAlbumId] = useState(albums[0]?.id || '');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  // Form state for creating new album
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumEvent, setNewAlbumEvent] = useState('');
  const [newAlbumDate, setNewAlbumDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumCover, setNewAlbumCover] = useState('');

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'PHOTO' | 'COVER') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast(t('অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন', 'Please select an image file'), 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (target === 'PHOTO') {
        setPhotoUrl(result);
        setPreviewDataUrl(result);
      } else {
        setNewAlbumCover(result);
      }
      showToast(t('ছবি সফলভাবে লোড হয়েছে!', 'Image loaded successfully!'), 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = previewDataUrl || photoUrl.trim();
    if (!finalUrl) {
      showToast(t('ছবির ফাইল অথবা লিঙ্ক প্রদান করুন', 'Please provide an image file or URL'), 'error');
      return;
    }

    if (!selectedAlbumId) {
      showToast(t('একটি অ্যালবাম নির্বাচন করুন', 'Please select an album'), 'error');
      return;
    }

    schoolStorage.addGalleryPhoto(selectedAlbumId, {
      url: finalUrl,
      caption: photoCaption.trim() || undefined,
    });

    showToast(t('ফটোগ্যালারিতে নতুন ছবি সফলভাবে যুক্ত হয়েছে!', 'Photo added to gallery successfully!'), 'success');
    setPhotoUrl('');
    setPreviewDataUrl(null);
    setPhotoCaption('');
  };

  const handleCreateAlbumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle.trim() || !newAlbumEvent.trim()) {
      showToast(t('অ্যালবাম ও ইভেন্টের নাম আবশ্যক', 'Album and Event title are required'), 'error');
      return;
    }

    const cover = newAlbumCover.trim() || 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=600&auto=format&fit=crop&q=80';

    const newAlbum = schoolStorage.addGalleryAlbum({
      title: newAlbumTitle.trim(),
      eventName: newAlbumEvent.trim(),
      date: newAlbumDate,
      description: newAlbumDesc.trim() || 'Genius Zone Model School campus activities',
      coverImage: cover,
      images: [{ id: `img-${Date.now()}`, url: cover, caption: newAlbumTitle.trim() }],
    });

    showToast(t(`"${newAlbum.title}" অ্যালবাম সফলভাবে তৈরি হয়েছে!`, `Album "${newAlbum.title}" created successfully!`), 'success');
    setSelectedAlbumId(newAlbum.id);
    setActiveMode('ADD_PHOTO');
    setNewAlbumTitle('');
    setNewAlbumEvent('');
    setNewAlbumDesc('');
    setNewAlbumCover('');
  };

  const handleDeleteAlbum = (albumId: string, albumTitle: string) => {
    if (confirm(`Are you sure you want to delete album "${albumTitle}"?`)) {
      schoolStorage.deleteGalleryAlbum(albumId);
      showToast(t('অ্যালবাম মুছে ফেলা হয়েছে', 'Album deleted successfully'), 'info');
    }
  };

  const handleDeletePhoto = (albumId: string, photoId: string) => {
    if (confirm('Delete this photo from album?')) {
      schoolStorage.deleteGalleryPhoto(albumId, photoId);
      showToast(t('ছবি মুছে ফেলা হয়েছে', 'Photo removed'), 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
              GALLERY MANAGER
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {albums.length} {t('টি অ্যালবাম সক্রিয়', 'Active Albums')}
            </span>
          </div>
          <h3 className="text-base font-black text-slate-900 mt-1">
            {t('ফটোগ্যালারি আপলোড ও অ্যালবাম ব্যবস্থাপনা', 'Photo Gallery Upload & Album Management')}
          </h3>
          <p className="text-xs text-slate-500">
            {t('পাবলিক ওয়েবসাইটের ফটোগ্যালারির জন্য নতুন ছবি আপলোড ও অ্যালবাম তৈরি করুন', 'Upload event photos (from device or URL) to appear on public gallery.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMode('ADD_PHOTO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeMode === 'ADD_PHOTO'
                ? 'bg-blue-900 text-amber-300 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t('ছবি আপলোড করুন', 'Upload Photo')}</span>
          </button>
          <button
            onClick={() => setActiveMode('CREATE_ALBUM')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeMode === 'CREATE_ALBUM'
                ? 'bg-blue-900 text-amber-300 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('নতুন অ্যালবাম', 'New Album')}</span>
          </button>
        </div>
      </div>

      {/* Form Section */}
      {activeMode === 'ADD_PHOTO' ? (
        <form onSubmit={handleAddPhotoSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h4 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-700" />
            <span>{t('বিদ্যমান অ্যালবামে নতুন ছবি যুক্ত করুন', 'Upload & Add Photo to Existing Album')}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Select Album */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('অ্যালবাম নির্বাচন করুন *', 'Select Target Album *')}
              </label>
              <select
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-xl font-semibold bg-white text-slate-900"
              >
                {albums.map((alb) => (
                  <option key={alb.id} value={alb.id}>
                    {alb.title} ({alb.eventName}) - {alb.images.length} {t('ছবি', 'photos')}
                  </option>
                ))}
              </select>
            </div>

            {/* Photo Caption */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('ছবির ক্যাপশন / বিবরণ', 'Photo Caption / Title')}
              </label>
              <input
                type="text"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="যেমন: পুরস্কার বিতরণী পর্ব, বার্ষিক ক্রীড়া ২০২৬"
                className="w-full px-3 py-2 border rounded-xl text-slate-900"
              />
            </div>
          </div>

          {/* Photo File Picker or URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            {/* Local File Upload */}
            <div className="p-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/40 text-center">
              <label className="cursor-pointer block">
                <FileImage className="w-8 h-8 text-blue-700 mx-auto mb-1.5" />
                <span className="font-bold text-blue-900 block">
                  {t('ডিভাইস থেকে ছবি আপলোড করুন', 'Choose Image from Device')}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  JPG, PNG, WebP (Auto-encoded to base64)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'PHOTO')}
                  className="hidden"
                />
              </label>
            </div>

            {/* Or Image URL */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">
                {t('অথবা ছবির অনলাইন লিঙ্ক (Image URL)', 'Or Enter Direct Image URL')}
              </label>
              <input
                type="url"
                value={photoUrl.startsWith('data:') ? '' : photoUrl}
                onChange={(e) => {
                  setPhotoUrl(e.target.value);
                  setPreviewDataUrl(e.target.value);
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 border rounded-xl text-slate-900 font-mono text-[11px]"
              />
              <p className="text-[10px] text-slate-500">
                {t('সরাসরি ইন্টারনেট লিঙ্ক অথবা উপরের আপলোড বোতাম ব্যবহার করুন।', 'Paste web image URL or use device upload above.')}
              </p>
            </div>
          </div>

          {/* Image Preview */}
          {(previewDataUrl || photoUrl) && (
            <div className="p-3 bg-slate-50 rounded-xl border flex items-center gap-4">
              <img
                src={previewDataUrl || photoUrl}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border shadow-xs"
              />
              <div className="text-xs">
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('ছবির প্রিভিউ প্রস্তুত', 'Image Preview Ready')}
                </span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {photoCaption || t('ক্যাপশন ছাড়া', 'No caption')}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>{t('গ্যালারিতে প্রকাশ করুন', 'Publish Photo to Gallery')}</span>
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleCreateAlbumSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h4 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-700" />
            <span>{t('নতুন অ্যালবাম তৈরি করুন', 'Create New Gallery Album')}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('অ্যালবাম শিরোনাম (Album Title) *', 'Album Title *')}
              </label>
              <input
                type="text"
                required
                value={newAlbumTitle}
                onChange={(e) => setNewAlbumTitle(e.target.value)}
                placeholder="যেমন: বার্ষিক ক্রীড়া ও সাংস্কৃতিক সপ্তাহ ২০২৬"
                className="w-full px-3 py-2 border rounded-xl text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('ইভেন্টের নাম (Event Category) *', 'Event Category *')}
              </label>
              <input
                type="text"
                required
                value={newAlbumEvent}
                onChange={(e) => setNewAlbumEvent(e.target.value)}
                placeholder="যেমন: Annual Sports Day / Science Exhibition"
                className="w-full px-3 py-2 border rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('অনুষ্ঠানের তারিখ (Date)', 'Event Date')}
              </label>
              <input
                type="date"
                value={newAlbumDate}
                onChange={(e) => setNewAlbumDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('কভার ছবির লিঙ্ক বা আপলোড', 'Cover Image URL or Upload')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAlbumCover.startsWith('data:') ? 'Local file selected' : newAlbumCover}
                  onChange={(e) => setNewAlbumCover(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 border rounded-xl text-slate-900 text-xs"
                />
                <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl cursor-pointer font-bold text-xs shrink-0 flex items-center">
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'COVER')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('বর্ণনা (Description)', 'Description')}
            </label>
            <textarea
              rows={2}
              value={newAlbumDesc}
              onChange={(e) => setNewAlbumDesc(e.target.value)}
              placeholder="ইভেন্টের বিস্তারিত কার্যক্রম..."
              className="w-full px-3 py-2 border rounded-xl text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveMode('ADD_PHOTO')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              {t('বাতিল', 'Cancel')}
            </button>
            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>{t('অ্যালবাম সংরক্ষণ করুন', 'Create Album')}</span>
            </button>
          </div>
        </form>
      )}

      {/* Existing Albums & Photos List */}
      <div className="space-y-6">
        <h4 className="text-sm font-black text-slate-900 flex items-center justify-between">
          <span>{t('বিদ্যমান অ্যালবাম ও ছবি তালিকা', 'Existing Albums & Photo Catalog')}</span>
          <span className="text-xs text-slate-500 font-mono">{albums.reduce((s, a) => s + a.images.length, 0)} Total Photos</span>
        </h4>

        {albums.map((album) => (
          <div key={album.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Album Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-3">
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-300 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {album.eventName}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{album.date}</span>
                  </div>
                  <h5 className="font-black text-sm text-slate-900 mt-0.5">{album.title}</h5>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-full text-[11px]">
                  {album.images.length} {t('ছবি', 'Photos')}
                </span>
                <button
                  onClick={() => handleDeleteAlbum(album.id, album.title)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  title="Delete entire album"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Photos Grid */}
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {album.images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square"
                  >
                    <img
                      src={img.url}
                      alt={img.caption || 'Photo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <button
                        onClick={() => handleDeletePhoto(album.id, img.id)}
                        className="self-end p-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <p className="text-[9px] text-white line-clamp-2 leading-tight">
                        {img.caption || 'No caption'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
