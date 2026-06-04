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
    <div className="flex gap-3 min-h-0 h-70">
      <div className="w-40 flex flex-col justify-between gap-2 h-full">
        {[
          { label: 'ON SPOT PHOTOGRAPH', icon: '📷', src: onSpotSrc ?? getFirstImage(record, 'images') ?? getFirstImage(record, 'thumbnail') ?? null },
          { label: 'LIVE GIS LOCATION', icon: '📍', src: null },
          { label: 'DP PLAN', icon: '🗺️', src: dpPlanSrc ?? getFirstImage(record, 'floorPlans') ?? null },
        ].map((panel) => (
          <div key={panel.label} className="flex-1 rounded-md overflow-hidden flex flex-col border border-[#b0b6c2] shadow-sm bg-white relative">
            <div className="bg-[#175294] text-white text-[8px] font-bold py-0.75 flex items-center justify-center gap-1.5 absolute top-0 w-full z-10 rounded-b-xl px-2 leading-none shadow">
              <span className="text-[10px]">{panel.icon}</span> {panel.label}
            </div>
            <div className="flex-1 bg-gray-100 flex items-center justify-center mt-4.5 relative overflow-hidden">
              {panel.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={panel.src} alt={panel.label} className="absolute inset-0 w-full h-full object-contain p-1" />
              ) : (
                <div className="text-xs text-slate-500">-</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 border-2 border-[#b0b6c2] rounded-[10px] relative flex flex-col bg-white shadow-sm p-2 pt-5.5 h-full">
        <div className="absolute -top-2.5 left-[50%] translate-x-[-50%] bg-[#175294] text-white px-5 py-1 rounded-full text-[10px] font-bold flex gap-1.5 items-center shadow-sm whitespace-nowrap border border-white">DIGITAL PLAN</div>
        <div className="text-center font-black text-[12px] mb-1.5 text-[#0d4380] pb-1 border-b border-gray-300 shrink-0">{title || '-'}</div>
        <div className="flex-1 bg-gray-50 flex justify-center items-center rounded overflow-hidden min-h-0 relative">
          {digitalPlanSrc || getFirstImage(record, 'floorPlans') ? (
            <Image
              src={digitalPlanSrc ?? getFirstImage(record, 'floorPlans') ?? ''}
              alt="Digital Plan"
              fill
              className="object-cover p-1 grayscale-50"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          ) : (
            <div className="text-sm font-bold text-slate-400 flex flex-col items-center gap-2">
              <span>- No Digital Plan Available -</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-76 flex gap-2 h-full shrink-0">
        <div className="border border-[#b0b6c2] rounded-[10px] bg-gray-50/50 p-2 flex flex-col relative shadow-sm flex-1 min-w-0 h-full">
          <div className="text-[#175294] font-black text-[16px] text-center mb-1 drop-shadow-sm leading-none tracking-wide">अकोला</div>
          <div className="flex-1 border border-blue-200 bg-[#e0e7ff] rounded-md overflow-hidden flex items-center justify-center relative min-h-0">
            <Image
              src="/map-panel.png"
              alt="Map panel"
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, 240px"
              priority
            />
          </div>
        </div>

        <div className="border border-[#b0b6c2] rounded-[10px] bg-white p-2 flex flex-col relative shadow-sm w-22.5 shrink-0">
          <div className="absolute -top-2 left-[50%] translate-x-[-50%] bg-white text-gray-700 px-2 py-px rounded-full text-[7px] font-bold shadow-sm whitespace-nowrap border border-[#b0b6c2]">AREA TAGGING</div>
          <div className="flex flex-col gap-1.5 mt-2 h-full justify-between pb-0.5">
            <div className="border border-[#b0b6c2] rounded-sm flex-1 bg-white shadow-inner" />
            <div className="border border-[#b0b6c2] rounded-sm flex-1 bg-white shadow-inner" />
            <div className="border border-[#b0b6c2] rounded-sm flex-1 bg-white shadow-inner" />
          </div>
        </div>
      </div>
    </div>
  );
}
