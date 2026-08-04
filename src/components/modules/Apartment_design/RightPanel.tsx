import React, { useState } from 'react';
import { Building2, Maximize2, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import MapBox from '../shared/MapBox';
import ChangeDetectionBox from '../shared/ChangeDetectionBox';

interface RightPanelProps {
  onHoverImage: (url: string | null, position?: 'left' | 'right') => void;
  onSelectImage: (url: string, title: string) => void;
  role?: 'surveyor' | 'qc' | 'final';
}

const wingPhotos = [
  { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop', label: 'A Wing - Front View' },
  { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop', label: 'B Wing - Front View' },
  { src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400&auto=format&fit=crop', label: 'C Wing - Front View' },
  { src: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?q=80&w=400&auto=format&fit=crop', label: 'D Wing - Front View' },
];

export default function RightPanel({ onHoverImage, onSelectImage, role = 'surveyor' }: RightPanelProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeOcModal, setActiveOcModal] = useState<'building' | 'wing' | 'flat' | null>(null);
  const [ocSubmitted, setOcSubmitted] = useState<boolean>(false);
  const [ocDetails, setOcDetails] = useState({
    certNumber: 'OC-TMC-2026-904',
    issueDate: '2026-08-03',
    selectedWingName: 'B Wing',
    selectedFlatNum: '103',
    waterAttached: true,
    fireCompliant: true
  });

  const prevPhoto = () => setActivePhotoIdx((i) => (i === 0 ? wingPhotos.length - 1 : i - 1));
  const nextPhoto = () => setActivePhotoIdx((i) => (i === wingPhotos.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-3 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1.5 select-none">
      
      {/* Occupancy Certificate (OC) Manager */}
      <div className="bg-white border border-[#3b82f6]/25 rounded-xl p-3 flex flex-col shadow-sm shrink-0 gap-2 relative">
        <div className="flex items-center justify-between pb-1 border-b border-gray-150 select-none">
          <span className="text-[10px] font-black text-[#1e2b58] uppercase tracking-wider flex items-center gap-1">
            <Building2 size={11} className="text-blue-600" />
            <span>Apply OC (Occupancy Cert)</span>
          </span>
          <span className="text-[8px] bg-blue-50 px-1 py-0.25 rounded font-black text-blue-600 border border-blue-200">OC Audit</span>
        </div>

        <div className="flex flex-col gap-2 mt-1 select-none">
          <button 
            onClick={() => { setActiveOcModal('building'); setOcSubmitted(false); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[8.5px] py-1.5 px-2 rounded-lg cursor-pointer transition uppercase text-center tracking-wider shadow-3xs"
          >
            Apply OC Building-wise
          </button>
          
          <button 
            onClick={() => { setActiveOcModal('wing'); setOcSubmitted(false); }}
            className="bg-[#edf2ff] hover:bg-[#dbeafe] text-blue-700 border border-blue-200 font-extrabold text-[8.5px] py-1.5 px-2 rounded-lg cursor-pointer transition uppercase text-center tracking-wider"
          >
            Apply OC Wing-wise
          </button>
          
          <button 
            onClick={() => { setActiveOcModal('flat'); setOcSubmitted(false); }}
            className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-255 font-extrabold text-[8.5px] py-1.5 px-2 rounded-lg cursor-pointer transition uppercase text-center tracking-wider"
          >
            Apply OC Flat-wise
          </button>
        </div>
      </div>
      
      {/* Visual Intelligence - Wing Photos */}
      <div className="bg-white border border-gray-200 rounded-xl p-2.5 flex flex-col shadow-sm shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Building2 size={13} className="text-[#002fbe]" />
            <span className="text-[10px] font-black text-[#1e2b58] uppercase tracking-wider">Visual Intelligence</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Wing Photos <span className="text-gray-400 font-medium">({wingPhotos.length} Wings)</span></span>
          <button className="text-[8.5px] font-bold text-[#3b82f6] hover:underline cursor-pointer">View All</button>
        </div>

        {/* Photo Carousel */}
        <div className="relative group rounded-lg overflow-hidden border border-gray-100 bg-gray-50 h-[140px]">
          <img
            src={wingPhotos[activePhotoIdx].src}
            alt={wingPhotos[activePhotoIdx].label}
            className="w-full h-full object-cover transition-all duration-300 cursor-pointer"
            onClick={() => onSelectImage(wingPhotos[activePhotoIdx].src, wingPhotos[activePhotoIdx].label)}
            onMouseEnter={() => onHoverImage(wingPhotos[activePhotoIdx].src, 'left')}
            onMouseLeave={() => onHoverImage(null)}
          />
          {/* Left Arrow */}
          <button
            onClick={prevPhoto}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous photo"
          >
            <ChevronLeft size={14} className="text-gray-700" />
          </button>
          {/* Right Arrow */}
          <button
            onClick={nextPhoto}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next photo"
          >
            <ChevronRight size={14} className="text-gray-700" />
          </button>
          {/* Caption overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-4">
            <span className="text-[8.5px] font-bold text-white drop-shadow">{wingPhotos[activePhotoIdx].label}</span>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-1.5">
          {wingPhotos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhotoIdx(idx)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                idx === activePhotoIdx ? 'bg-[#002fbe] scale-110' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`View wing photo ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Media Section: Building Plan */}
      <div 
        onMouseEnter={() => onHoverImage("/blueprint_plan.png", "left")} 
        onMouseLeave={() => onHoverImage(null)} 
        onClick={() => onSelectImage("/blueprint_plan.png", "Building Plan (Typical Floor)")}
        className="bg-white border border-gray-200 hover:border-blue-500 rounded-xl p-2.5 flex flex-col shadow-xs hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
        role="button"
        aria-label="Open Building Plan preview"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            onSelectImage("/blueprint_plan.png", "Building Plan (Typical Floor)");
          }
        }}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9.5px] font-black text-[#1e2b58] uppercase tracking-wider">Building Plan <span className="text-[8px] text-gray-400 lowercase font-medium">(Typical Floor)</span></span>
          <Maximize2 size={10} className="text-gray-400 group-hover:text-[#002fbe] transition-colors" />
        </div>
        <div className="overflow-hidden rounded-lg w-full h-[125px] bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
          <img src="/blueprint_plan.png" className="w-full h-full object-contain rounded" alt="Building Plan" />
        </div>
      </div>

      {/* Media Section: GIS / Satellite View */}
      <div className="flex flex-col">
        <MapBox 
          title="GIS / Satellite View" 
          imgUrl="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop" 
          onZoom={() => onSelectImage("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop", "GIS / Satellite View")}
          onHover={(url) => onHoverImage(url, "left")}
        />
      </div>

      {/* Media Section: Street View */}
      <div className="flex flex-col">
        <MapBox 
          title="Street View" 
          imgUrl="/street_view.jpg" 
          onZoom={() => onSelectImage("/street_view.jpg", "Street View")}
          onHover={(url) => onHoverImage(url, "left")}
        />
      </div>

      {/* Media Section: Change Detection */}
      <div className="flex flex-col">
        <ChangeDetectionBox 
          title="Change Detection" 
          beforeImg="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=400&auto=format&fit=crop" 
          afterImg="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop" 
          beforeImgZoom="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
          afterImgZoom="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
          onHover={(url) => onHoverImage(url, "left")}
          onZoom={() => onSelectImage("change-detection", "Change Detection Slider")} 
        />
      </div>

      {/* Dynamic OC Application Modals */}
      {activeOcModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-sm w-full p-4 flex flex-col gap-3 relative animate-scaleIn">
            <button 
              onClick={() => setActiveOcModal(null)}
              className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-650 flex items-center justify-center cursor-pointer"
            >
              <X size={14} />
            </button>

            <div className="flex items-center gap-1.5 pb-2 border-b border-gray-150">
              <Building2 className="text-blue-600" size={16} />
              <h4 className="font-black text-[12px] text-[#1e2b58] uppercase tracking-wide">
                Apply OC — {activeOcModal === 'building' ? 'Building-wise' : activeOcModal === 'wing' ? 'Wing-wise' : 'Flat-wise'}
              </h4>
            </div>

            {ocSubmitted ? (
              <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-200">
                  <Check size={20} className="stroke-[3]" />
                </div>
                <span className="font-black text-xs text-[#006a4e] uppercase mt-2">OC Applied Successfully!</span>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed max-w-[240px]">
                  Occupancy Certificate registration has been locked under docket **{ocDetails.certNumber}**.
                </p>
                <button 
                  onClick={() => setActiveOcModal(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[9px] px-4 py-1.5 rounded-lg mt-4 uppercase cursor-pointer"
                >
                  Close Manager
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 text-[10.5px]">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 font-bold uppercase text-[8.5px]">OC Certificate Number *</span>
                  <input 
                    type="text" 
                    value={ocDetails.certNumber}
                    onChange={(e) => setOcDetails({...ocDetails, certNumber: e.target.value})}
                    className="bg-white border border-gray-250 rounded-lg px-2.5 py-1 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 font-bold uppercase text-[8.5px]">Date of Certificate Issuance *</span>
                  <input 
                    type="date" 
                    value={ocDetails.issueDate}
                    onChange={(e) => setOcDetails({...ocDetails, issueDate: e.target.value})}
                    className="bg-white border border-gray-250 rounded-lg px-2.5 py-1 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500"
                  />
                </div>

                {activeOcModal === 'wing' && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 font-bold uppercase text-[8.5px]">Select Target Wing *</span>
                    <select 
                      value={ocDetails.selectedWingName}
                      onChange={(e) => setOcDetails({...ocDetails, selectedWingName: e.target.value})}
                      className="bg-white border border-gray-250 rounded-lg px-2.5 py-1 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500"
                    >
                      <option>A Wing</option>
                      <option>B Wing</option>
                      <option>C Wing</option>
                      <option>D Wing</option>
                    </select>
                  </div>
                )}

                {activeOcModal === 'flat' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-500 font-bold uppercase text-[8.5px]">Select Wing *</span>
                      <select 
                        value={ocDetails.selectedWingName}
                        onChange={(e) => setOcDetails({...ocDetails, selectedWingName: e.target.value})}
                        className="bg-white border border-gray-250 rounded-lg px-2 py-1 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500"
                      >
                        <option>A Wing</option>
                        <option>B Wing</option>
                        <option>C Wing</option>
                        <option>D Wing</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-500 font-bold uppercase text-[8.5px]">Flat Number *</span>
                      <input 
                        type="text" 
                        value={ocDetails.selectedFlatNum}
                        onChange={(e) => setOcDetails({...ocDetails, selectedFlatNum: e.target.value})}
                        className="bg-white border border-gray-250 rounded-lg px-2 py-1 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5 mt-1 border-t border-gray-100 pt-2 text-[9px] font-bold text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={ocDetails.fireCompliant}
                      onChange={(e) => setOcDetails({...ocDetails, fireCompliant: e.target.checked})}
                      className="rounded text-blue-600"
                    />
                    <span>Fire safety compliance audit signed-off</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={ocDetails.waterAttached}
                      onChange={(e) => setOcDetails({...ocDetails, waterAttached: e.target.checked})}
                      className="rounded text-blue-600"
                    />
                    <span>Municipal water connection blueprint attached</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button 
                    onClick={() => setActiveOcModal(null)}
                    className="bg-gray-150 hover:bg-gray-200 text-gray-700 font-extrabold py-1.5 rounded-lg text-[9px] uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setOcSubmitted(true);
                      alert(`Successfully applied Occupancy Certificate ${ocDetails.certNumber} for the ${activeOcModal === 'building' ? 'entire building' : activeOcModal === 'wing' ? ocDetails.selectedWingName : ocDetails.selectedWingName + ' Flat ' + ocDetails.selectedFlatNum}!`);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-1.5 rounded-lg text-[9px] uppercase cursor-pointer"
                  >
                    Submit & Lock
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
