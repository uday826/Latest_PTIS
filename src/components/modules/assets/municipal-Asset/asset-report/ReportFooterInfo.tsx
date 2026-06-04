type ApiRecord = Record<string, unknown>;

type ReportFooterInfoProps = {
  record: ApiRecord;
  assetTypeName: string;
  occupancyStatus: string;
  isActive: string;
  purchaseDate: string;
  marketValueDate: string;
  pickText: (record: ApiRecord, keys: string[]) => string;
};

export function ReportFooterInfo({
  record,
  assetTypeName,
  occupancyStatus,
  isActive,
  purchaseDate,
  marketValueDate,
  pickText,
}: ReportFooterInfoProps) {
  return (
    <div className="mt-3 border border-[#b0b6c2] rounded-lg px-3 bg-gray-50/30 flex items-center text-[9px] font-bold text-[#0d4380] shadow-sm relative h-9 shrink-0">
      <div className="text-white px-5 py-1 rounded-full text-[10px] font-black tracking-widest shadow-sm border border-white bg-[#175294] shrink-0">
        मालमत्ता माहिती
      </div>
      <div className="flex justify-end flex-1 gap-5 pl-4">
        <div className="flex items-center gap-1.5"><span>☑</span><span className="text-gray-700">मालमत्ता वर्ग: {pickText(record, ['assetCategoryName', 'categoryName'])}</span></div>
        <div className="flex items-center gap-1.5"><span>☑</span><span className="text-gray-700">मालमत्ता प्रकार: {assetTypeName}</span></div>
        <div className="flex items-center gap-1.5"><span>☑</span><span className="text-gray-700">वापर स्थिती: {occupancyStatus}</span></div>
        <div className="flex items-center gap-1.5"><span>☑</span><span className="text-gray-700">मालमत्ता सक्रिय आहे का?: {isActive}</span></div>
        <div className="flex items-center gap-1.5"><span>☑</span><span className="text-gray-700">खरेदी दिनांक: {purchaseDate}</span></div>
        <div className="flex items-center gap-1.5"><span>☑</span><span className="text-gray-700">बाजार मूल्य दिनांक: {marketValueDate}</span></div>
      </div>
    </div>
  );
}
