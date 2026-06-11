import Image from 'next/image';

type ApiRecord = Record<string, unknown>;

type ReportMediaSectionProps = {
  title: string;
  record: ApiRecord;
  onSpotSrc: string | null;
  dpPlanSrc: string | null;
  digitalPlanSrc: string | null;
  getFirstImage: (record: ApiRecord, key: string) => string | null;
};

export function ReportMediaSection({
  title,
  record,
  onSpotSrc,
  dpPlanSrc,
  digitalPlanSrc,
  getFirstImage,
}: ReportMediaSectionProps) {
  return (
    <div className="flex gap-3 min-h-0 h-70 shrink-0">
      <div className="w-40 flex flex-col justify-between gap-2 h-full shrink-0">
        <div className="flex-1 rounded-md overflow-hidden flex flex-col border border-[#b0b6c2] shadow-sm bg-white relative min-w-0">
          <div className="bg-[#175294] text-white text-[8px] font-bold py-0.75 flex items-center justify-center gap-1.5 absolute top-0 w-full z-10 rounded-b-xl px-2 leading-none shadow">
            <span className="text-[10px]">📷</span> ON SPOT PHOTOGRAPH
          </div>
          <div className="flex-1 bg-gray-100 flex items-center justify-center mt-4.5 relative overflow-hidden">
            {onSpotSrc ?? getFirstImage(record, 'images') ?? getFirstImage(record, 'thumbnail') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={onSpotSrc ?? getFirstImage(record, 'images') ?? getFirstImage(record, 'thumbnail') ?? ''} alt="ON SPOT PHOTOGRAPH" className="absolute inset-0 w-full h-full object-contain p-1" />
            ) : (
              <div className="text-xs text-slate-500">-</div>
            )}
          </div>
        </div>

        <div className="flex-1 rounded-md overflow-hidden flex flex-col border border-[#b0b6c2] shadow-sm bg-white relative min-w-0">
          <div className="bg-[#175294] text-white text-[8px] font-bold py-0.75 flex items-center justify-center gap-1.5 absolute top-0 w-full z-10 rounded-b-xl px-2 leading-none shadow">
            <span className="text-[10px]">🗺️</span> DP PLAN
          </div>
          <div className="flex-1 bg-gray-100 flex items-center justify-center mt-4.5 relative overflow-hidden">
            {dpPlanSrc ?? getFirstImage(record, 'floorPlans') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dpPlanSrc ?? getFirstImage(record, 'floorPlans') ?? ''} alt="DP PLAN" className="absolute inset-0 w-full h-full object-contain p-1" />
            ) : (
              <div className="text-xs text-slate-500">-</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-[2] border-2 border-[#b0b6c2] rounded-[10px] relative flex flex-col bg-white shadow-sm p-2 pt-5.5 min-w-0">
        <div className="absolute -top-2.5 left-[50%] translate-x-[-50%] bg-[#175294] text-white px-5 py-1 rounded-full text-[10px] font-bold flex gap-1.5 items-center shadow-sm whitespace-nowrap border border-white">DIGITAL PLAN</div>
        <div className="text-center font-black text-[12px] mb-1.5 text-[#0d4380] pb-1 border-b border-gray-300 shrink-0">{title || '-'}</div>
        <div className="flex-1 bg-gray-50 flex justify-center items-center rounded overflow-hidden min-h-0 relative">
          {digitalPlanSrc || getFirstImage(record, 'floorPlans') ? (
            <Image
              src={digitalPlanSrc ?? getFirstImage(record, 'floorPlans') ?? ''}
              alt="Digital Plan"
              fill
              className="object-contain p-1 grayscale-50"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          ) : (
            <div className="text-sm font-bold text-slate-400 flex flex-col items-center gap-2">
              <span>- No Digital Plan Available -</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 border-2 border-[#b0b6c2] rounded-[10px] relative flex flex-col bg-white shadow-sm p-2 pt-5.5 min-w-0">
        <div className="absolute -top-2.5 left-[50%] translate-x-[-50%] bg-[#175294] text-white px-5 py-1 rounded-full text-[10px] font-bold flex gap-1.5 items-center shadow-sm whitespace-nowrap border border-white">📍 GIS LIVE LOCATION</div>
        <div className="text-center font-black text-[12px] mb-1.5 text-[#0d4380] pb-1 border-b border-gray-300 shrink-0">{title || '-'}</div>
        <div className="flex-1 bg-gray-50 flex justify-center items-center rounded overflow-hidden min-h-0 relative">
          <div className="text-sm font-bold text-slate-400 flex flex-col items-center gap-2">
            <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>- No GIS Location Available -</span>
          </div>
        </div>
      </div>
    </div>
  );
}
