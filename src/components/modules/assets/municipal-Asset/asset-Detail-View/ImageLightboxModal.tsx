"use client";

import { Button } from '@/components/common';
import type { ImageLightboxModalProps } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export function ImageLightboxModal({
  assetName,
  images,
  index,
  title,
  onClose,
  onNext,
  onPrev,
  onSelectIndex,
  onKeyDown
}: ImageLightboxModalProps): React.JSX.Element {
  const t = useTranslations('municipalAsset');

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center focus:outline-none"
      onClick={onClose}
      onKeyDown={onKeyDown}
      tabIndex={0}
      ref={(el) => {
        if (el) el.focus();
      }}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[100] h-10 w-10 min-w-0 flex items-center justify-center border-0"
        aria-label={t('lightbox.close')}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-full font-medium z-[100] shadow-lg">
        {t('lightbox.counter', { title, current: index + 1, total: images.length })}
      </div>

      {/* Previous Button */}
      {images.length > 1 && (
        <Button
          variant="ghost"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[100] h-12 w-12 min-w-0 flex items-center justify-center border-0"
          aria-label={t('lightbox.prev')}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      )}

      {/* Image */}
      <div
        className="max-w-5xl max-h-[90vh] p-4 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[index]}
          alt={`${assetName} - ${title} ${index + 1}`}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl bg-white/5"
        />

        {/* Image Caption */}
        <div className="text-center mt-3 text-white">
          <div className="text-sm font-medium">{assetName}</div>
          <div className="text-xs text-gray-300 mt-1">{t('lightbox.counter', { title, current: index + 1, total: images.length })}</div>
        </div>
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <Button
          variant="ghost"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[100] h-12 w-12 min-w-0 flex items-center justify-center border-0"
          aria-label={t('lightbox.next')}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      )}

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg max-w-[90vw] overflow-x-auto z-[100] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); onSelectIndex(idx); }}
              className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${idx === index ? 'border-blue-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              aria-label={t('lightbox.goToImage', { num: idx + 1 })}
            >
              <img
                src={img}
                alt={t('lightbox.thumbnail', { num: idx + 1 })}
                className="w-full h-full object-cover bg-white"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
