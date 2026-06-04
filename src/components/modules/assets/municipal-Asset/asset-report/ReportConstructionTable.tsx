type ApiRecord = Record<string, unknown>;

type ReportConstructionTableProps = {
  isBuildingCategory: boolean;
  constructionRows: Array<ApiRecord>;
  formatText: (value: unknown) => string;
  toMarathiDigits: (value: unknown) => string;
  getField: (record: ApiRecord, keys: string[]) => unknown;
  firstAvailable: (...values: unknown[]) => unknown;
};

export function ReportConstructionTable({
  isBuildingCategory,
  constructionRows,
  formatText,
  toMarathiDigits,
  getField,
  firstAvailable,
}: ReportConstructionTableProps) {
  return (
    <div className="border border-[#b0b6c2] rounded-md overflow-hidden shadow-sm bg-white shrink-0">
      <table className="w-full text-center border-collapse text-[9px] font-bold text-[#0d4380] leading-[1.1]">
        <thead className="bg-gray-100/80 align-middle">
          <tr>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle" rowSpan={2}>मजला</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle" colSpan={3}>बांधकामाचे</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle" rowSpan={2}>बांधकाम क्षेत्रफळ<br />(चौ. मी.)</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle" rowSpan={2}>प्लॉट क्षेत्रफळ<br />(चौ. मी.)</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle" rowSpan={2}>जागेचे दर<br />(चौ. मी.)</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle" rowSpan={2}>जागेचे<br />मूल्य (अ)</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle" rowSpan={2}>बांधकामाचे दर<br />(चौ. मी.)</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle" rowSpan={2}>बांधकामाचे मूल्य<br />(चौ. मी.) (ब)</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle" rowSpan={2}>एकूण मूल्य<br />(अ + ब)</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle" colSpan={3}>बांधकाम वरील भारांक</th>
            <th className="border-b border-[#b0b6c2] text-white p-1 font-black align-middle bg-[#175294]" rowSpan={2}>भांडवली<br />मूल्य</th>
          </tr>
          <tr>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle">वर्ष</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle">प्रकार</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle">उपयोग</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle">उपयोगानुसार</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle">प्रकारावर</th>
            <th className="border-r border-b border-[#b0b6c2] p-1 font-bold align-middle">घसाऱ्यावर</th>
          </tr>
        </thead>
        <tbody>
          {isBuildingCategory && constructionRows.length > 0 ? constructionRows.map((row, idx) => (
            <tr key={idx} className="bg-white text-gray-700 align-middle h-4">
              <td className="border-r border-b border-[#e2e8f0] p-1 text-[#0d4380]">{formatText(getField(row, ['floorName', 'floor']))}</td>
              <td className="border-r border-b border-[#e2e8f0] p-1 text-[#0d4380]">{formatText(getField(row, ['constructionYear', 'year']))}</td>
              <td className="border-r border-b border-[#e2e8f0] p-1 text-[#0d4380]">{formatText(getField(row, ['constructionTypeName', 'constructionType', 'type']))}</td>
              <td className="border-r border-b border-[#e2e8f0] p-1 text-[#0d4380]">{formatText(getField(row, ['typeOfUseName', 'usage', 'use']))}</td>
              <td className="border-r border-b border-[#e2e8f0] p-1">{toMarathiDigits(firstAvailable(getField(row, ['builtUpAreaSqMeter', 'builtUpArea']), '-'))}</td>
              <td className="border-r border-b border-[#e2e8f0] p-1">{toMarathiDigits(firstAvailable(getField(row, ['carpetAreaSqMeter', 'plotArea', 'landArea', 'area']), '-'))}</td>
              <td className="border-r border-b border-[#e2e8f0] p-1">{toMarathiDigits(firstAvailable(getField(row, ['cvBaseRate', 'landRate']), '-'))}</td>
              <td className="border-r border-b border-[#e2e8f0] p-1">{toMarathiDigits(firstAvailable(getField(row, ['baseValue', 'landValue', 'value']), '-'))}</td>
              <td className="border-r border-b border-[#e2e8f0] p-1">{toMarathiDigits(firstAvailable(getField(row, ['marketValue', 'constructionRate', 'buildingRate']), '-'))}</td>
              <td className="border-r border-b border-[#e2e8f0] p-1">{toMarathiDigits(firstAvailable(getField(row, ['marketValue', 'constructionValue', 'buildingValue']), '-'))}</td>
              <td className="border-r border-b border-[#e2e8f0] p-1">{toMarathiDigits(firstAvailable(getField(row, ['marketValue', 'totalValue']), '-'))}</td>
              <td className="border-r border-b border-[#e2e8f0] p-1">{toMarathiDigits(firstAvailable(getField(row, ['cvUseFactor', 'useWeight']), '-'))}</td>
              <td className="border-r border-b border-[#e2e8f0] p-1">{toMarathiDigits(firstAvailable(getField(row, ['cvNatureFactor', 'typeWeight']), '-'))}</td>
              <td className="border-r border-b border-[#e2e8f0] p-1">{toMarathiDigits(firstAvailable(getField(row, ['cvAgeFactor', 'depreciationWeight']), '-'))}</td>
              <td className="border-b border-[#e2e8f0] p-1 bg-gray-50 text-[10px] font-black text-[#0d4380]">{toMarathiDigits(firstAvailable(getField(row, ['capitalValue']), '-'))}</td>
            </tr>
          )) : (
            <tr>
              {Array.from({ length: 15 }).map((_, index) => <td key={index} className="border-r border-b border-[#e2e8f0] p-1">-</td>)}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
