import React from 'react';
import ChangeDetectionBox from '../shared/ChangeDetectionBox';

interface ApartmentImageOverlaysProps {
  hoveredImg: string | null;
  hoverPosition: 'left' | 'right';
  selectedImg: string | null;
  setSelectedImg: (url: string | null) => void;
  selectedImgTitle: string | null;
}

export default function ApartmentImageOverlays({
  hoveredImg,
  hoverPosition,
  selectedImg,
  setSelectedImg,
  selectedImgTitle
}: ApartmentImageOverlaysProps) {
  return (
    <>
      {/* Floating Hover Zoom Portal */}
      {hoveredImg && (
        <div className={`fixed z-50 w-96 bg-white border border-gray-300 rounded-xl shadow-2xl p-2.5 pointer-events-none animate-fadeIn flex flex-col gap-2 ${hoverPosition === 'left' ? 'right-[305px] top-[180px]' : 'left-[305px] top-[180px]'}`}>
          <div className="text-[10px] font-bold text-gray-555 uppercase tracking-wider flex justify-between">
            <span>Complete Zoom View</span>
            <span className="text-[#1e2b58] font-semibold text-[8px] bg-blue-50 px-1 py-0.25 rounded">Live Preview</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50 h-72 w-full flex items-center justify-center">
            <img src={hoveredImg} className="w-full h-full object-contain" alt="Complete Zoom" />
          </div>
        </div>
      )}

      {/* Enlarged Lightbox Modal */}
      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-[999] cursor-zoom-out animate-fadeIn font-sans"
        >
          <div className="relative max-w-4xl max-h-[88vh] p-3.5 bg-white rounded-xl shadow-2xl cursor-default" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-150">
              <span className="font-extrabold text-[#002fbe] text-[10.5px] uppercase tracking-wider">
                {selectedImgTitle || 'Enlarged Preview'}
              </span>
              <button 
                onClick={() => setSelectedImg(null)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 font-extrabold text-[13px] cursor-pointer"
              >
                ×
              </button>
            </div>
            
            {selectedImg === 'change-detection' ? (
              <div className="w-[600px] h-[360px] relative overflow-hidden rounded-lg border border-gray-200">
                <ChangeDetectionBox 
                  title="Change Detection (Enlarged)" 
                  beforeImg="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop" 
                  afterImg="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" 
                  beforeImgZoom="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
                  afterImgZoom="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
                  onHover={() => {}}
                  onZoom={() => {}}
                  isEnlarged
                />
              </div>
            ) : (
              <img src={selectedImg} alt="Large Preview" className="max-w-full max-h-[75vh] rounded-lg object-contain animate-scaleIn" />
            )}
            <div className="text-center text-xs text-gray-400 mt-2.5 font-medium select-none">Click outside or press Escape to close</div>
          </div>
        </div>
      )}
    </>
  );
}
