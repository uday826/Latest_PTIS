import React from 'react';
import { 
  Building2, 
  Share2, 
  Copy, 
  Check,
  Camera,
  CheckCircle2, 
  Briefcase, 
  Star 
} from 'lucide-react';

interface PropertyDetailsCardProps {
  copiedUpic: boolean;
  onCopyUpic: (text: string) => void;
  onHoverImage: (imgUrl: string | null, position?: 'left' | 'right') => void;
  onSelectImage: (imgUrl: string, title: string) => void;
}

export default function PropertyDetailsCard({
  copiedUpic,
  onCopyUpic,
  onHoverImage,
  onSelectImage
}: PropertyDetailsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2.5 flex flex-wrap xl:flex-nowrap items-center gap-4 relative overflow-visible z-20 xl:col-span-9 xl:h-[148px] shrink-0 w-full">
      {/* Background visual accent */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#002fbe] rounded-l-xl pointer-events-none" />

      {/* Left building img */}
      <div 
        onMouseEnter={() => onHoverImage("/apartment_image.jpg", "right")} 
        onMouseLeave={() => onHoverImage(null)}
        onClick={() => onSelectImage("/apartment_image.jpg", "Apartment Image - Shree Sai Residency")}
        className="relative w-[150px] h-[115px] shrink-0 rounded-lg overflow-hidden border border-gray-250 group cursor-pointer hover:border-blue-300 bg-gray-50 transition-all self-center"
      >
        <img 
          src="/apartment_image.jpg" 
          alt="Shree Sai Residency" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
        />
        <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#002fbe] shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
          <Camera size={12} />
        </div>
      </div>

      {/* Details column */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 h-full">
        <div className="md:col-span-5 flex flex-col justify-start gap-1.5 py-0.5">
          <div>
            <div className="text-[9px] text-[#1749b5] uppercase tracking-wider font-extrabold">Apartment / Society</div>
            <div className="flex items-center gap-1 mt-0.25 relative">
              <h2 className="text-[13.5px] font-black text-[#002a8f] tracking-wide select-all leading-tight">SHREE SAI RESIDENCY CHS LTD</h2>
              <button className="p-0.5 hover:bg-gray-150 rounded text-gray-400 hover:text-blue-600 transition-colors cursor-pointer" type="button">
                <Share2 size={11.5} />
              </button>
            </div>
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[8px] font-extrabold uppercase mt-1 leading-none border border-green-200/50">
              <span className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
              Active Property
            </div>
          </div>

          {/* Address Stack */}
          <div className="text-[9.5px] space-y-0.5 font-bold text-gray-600 select-all leading-snug">
            <div className="flex gap-1.5">
              <span className="w-[100px] shrink-0 text-gray-400 font-extrabold uppercase text-[8px] tracking-wide">Address</span>
              <span className="text-gray-800">: 1A, Sai Baba Nagar, Thane (W) - 400601</span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-[100px] shrink-0 text-gray-400 font-extrabold uppercase text-[8px] tracking-wide">Property Type</span>
              <span className="text-gray-800">: Multi Wing Building</span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-[100px] shrink-0 text-gray-400 font-extrabold uppercase text-[8px] tracking-wide">Society Reg. No.</span>
              <span className="text-gray-800">: TMC/CHS/1234/2018</span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-[100px] shrink-0 text-gray-400 font-extrabold uppercase text-[8px] tracking-wide">Construction Type</span>
              <span className="text-gray-800">: RCC Framed Structure</span>
            </div>
          </div>
        </div>

        {/* Mid Column: UPIC / Registry details */}
        <div className="md:col-span-4 border-l border-gray-150 pl-3 text-[9.5px] flex flex-col justify-start gap-1.5 py-0.5">
          <div>
            <span className="text-gray-400 font-extrabold uppercase text-[8px] tracking-wide block">Property ID / UPIC</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-extrabold text-[#002fbe] text-[11px] select-all tracking-wide">UPIC-270465-APT-000567</span>
              <button 
                onClick={() => onCopyUpic('UPIC-270465-APT-000567')}
                className="p-0.75 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600 transition-all cursor-pointer"
                title="Copy UPIC"
                type="button"
              >
                {copiedUpic ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
              </button>
            </div>
          </div>

          {/* Sub grid specifications */}
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[9.5px] font-bold text-gray-600 select-all">
            <div>
              <span className="text-gray-450 font-extrabold uppercase text-[7.5px] tracking-wider block">Survey No.</span>
              <span className="text-gray-900 font-black">CSN005A</span>
            </div>
            <div>
              <span className="text-gray-455 font-extrabold uppercase text-[7.5px] tracking-wider block">Plot No.</span>
              <span className="text-gray-900 font-black">55</span>
            </div>
            <div>
              <span className="text-gray-450 font-extrabold uppercase text-[7.5px] tracking-wider block">Subzone No.</span>
              <span className="text-gray-900 font-black">A</span>
            </div>
            <div>
              <span className="text-gray-455 font-extrabold uppercase text-[7.5px] tracking-wider block">No. of Wings</span>
              <span className="text-gray-900 font-black">A - D (4 Wings)</span>
            </div>
            <div>
              <span className="text-gray-450 font-extrabold uppercase text-[7.5px] tracking-wider block">Ward</span>
              <span className="text-gray-900 font-black text-[9px]">W-12 (Manpada)</span>
            </div>
          </div>
        </div>

        {/* Right column: Area metrics summary */}
        <div className="md:col-span-3 border-l border-gray-150 pl-3 text-[9.5px] flex flex-col justify-start gap-1 py-0.5">
          <div className="min-w-[170px] shrink-0 space-y-1">
            {/* Total Carpet */}
            <div className="flex items-center gap-1.5 group relative">
              <div className="bg-blue-50 p-0.5 rounded-md shrink-0 border border-blue-100/55">
                <Building2 size={10.5} className="text-[#1749b5]" />
              </div>
              <div>
                <div className="text-[7.5px] text-[#1749b5] font-extrabold uppercase tracking-wider">Total Carpet Area</div>
                <div className="font-extrabold text-[10px] text-slate-800 mt-0.25">24,850.50 ft²</div>
              </div>
            </div>

            {/* Total Built up */}
            <div className="flex items-center gap-1.5 group relative">
              <div className="bg-blue-50 p-0.5 rounded-md shrink-0 border border-blue-100/55">
                <Building2 size={10.5} className="text-[#1749b5]" />
              </div>
              <div>
                <div className="text-[7.5px] text-[#1749b5] font-extrabold uppercase tracking-wider">Total Built-Up Area</div>
                <div className="font-extrabold text-[10px] text-slate-800 mt-0.25">33,450.75 ft²</div>
              </div>
            </div>

            {/* Units breakdown stack */}
            <div className="grid grid-cols-3 gap-0.5 pt-0.5 border-t border-gray-100">
              {/* Res units */}
              <div className="flex items-center gap-1.5 group relative">
                <div className="bg-blue-50 p-0.5 rounded-md shrink-0 border border-blue-100/55">
                  <CheckCircle2 size={10.5} className="text-[#1749b5]" />
                </div>
                <div>
                  <div className="text-[7.5px] text-[#1749b5] font-extrabold uppercase tracking-wider">Residential Units</div>
                  <div className="font-extrabold text-[10px] text-slate-800 mt-0.25">40</div>
                </div>
              </div>

              {/* Commercial Units */}
              <div className="flex items-center gap-1.5 group relative">
                <div className="bg-blue-50 p-0.5 rounded-md shrink-0 border border-blue-100/55">
                  <Briefcase size={10.5} className="text-[#1749b5]" />
                </div>
                <div>
                  <div className="text-[7.5px] text-[#1749b5] font-extrabold uppercase tracking-wider">Commercial Units</div>
                  <div className="font-extrabold text-[10px] text-slate-800 mt-0.25">6</div>
                </div>
              </div>

              {/* Other Units */}
              <div className="flex items-center gap-1.5 group relative">
                <div className="bg-blue-50 p-0.5 rounded-md shrink-0 border border-blue-100/55">
                  <Star size={10.5} className="text-[#1749b5]" />
                </div>
                <div>
                  <div className="text-[7.5px] text-[#1749b5] font-extrabold uppercase tracking-wider">Other Units</div>
                  <div className="font-extrabold text-[10px] text-slate-800 mt-0.25">2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
