/**
 * Dynamic Photo Gallery Section for Genius Zone Model School (GZMS)
 * Album display with responsive grid and full-screen lightbox image viewer.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { schoolStorage } from '../../services/storage';
import type { GalleryAlbum } from '../../types';
import { Image, Calendar, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const PublicGallery: React.FC = () => {
  const { t } = useApp();
  const albums = schoolStorage.getGallery();
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const openLightbox = (album: GalleryAlbum, photoIndex: number) => {
    setSelectedAlbum(album);
    setActivePhotoIndex(photoIndex);
  };

  const closeLightbox = () => {
    setSelectedAlbum(null);
    setActivePhotoIndex(null);
  };

  const nextPhoto = () => {
    if (selectedAlbum && activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % selectedAlbum.images.length);
    }
  };

  const prevPhoto = () => {
    if (selectedAlbum && activePhotoIndex !== null) {
      setActivePhotoIndex(
        (activePhotoIndex - 1 + selectedAlbum.images.length) % selectedAlbum.images.length
      );
    }
  };

  return (
    <section id="gallery" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            {t('স্মৃতি ও কার্যক্রম', 'Campus Life & Events')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-blue-950 mt-3 tracking-tight">
            {t('বিদ্যালয়ের ফটোগ্যালারি ও ইভেন্টসমূহ', 'Photo Gallery & Annual Extracurricular Events')}
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mt-3 rounded-full" />
          <p className="text-sm text-slate-600 mt-3">
            {t(
              'খেলাধুলা, বিজ্ঞান মেলা, সাংস্কৃতিক অনুষ্ঠান এবং সহশিক্ষা কার্যক্রমের চিত্রশালা।',
              'Capturing joyful milestones across sports, science exhibitions, national day observances, and cultural festivals.'
            )}
          </p>
        </div>

        {/* Albums List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => openLightbox(album, 0)}
                  className="relative h-56 cursor-pointer overflow-hidden group bg-slate-100"
                >
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent" />

                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Image className="w-3.5 h-3.5" />
                    <span>{album.images.length} {t('ছবি', 'Photos')}</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-0.5">
                      {album.eventName}
                    </span>
                    <h3 className="font-bold text-sm leading-tight line-clamp-1">
                      {album.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-blue-700" />
                    <span>{album.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {album.description}
                  </p>
                </div>
              </div>

              {/* Thumbnails preview */}
              <div className="p-4 pt-0">
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100">
                  {album.images.slice(0, 3).map((img, i) => (
                    <div
                      key={img.id}
                      onClick={() => openLightbox(album, i)}
                      className="h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-85 transition-opacity"
                    >
                      <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full-Screen Lightbox Modal */}
        {selectedAlbum && activePhotoIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200">
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev / Next controls */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 hover:bg-slate-800 text-white transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 hover:bg-slate-800 text-white transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Active Image */}
            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
              <img
                src={selectedAlbum.images[activePhotoIndex].url}
                alt={selectedAlbum.title}
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl border border-slate-800"
              />

              <div className="mt-4 text-center text-white">
                <p className="text-sm font-bold text-amber-300">
                  {selectedAlbum.title} ({activePhotoIndex + 1} / {selectedAlbum.images.length})
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  {selectedAlbum.images[activePhotoIndex].caption || selectedAlbum.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
