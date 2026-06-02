import type { Metadata } from 'next';
import Image from 'next/image';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { fetchAssetFloorSummaryByAsset, fetchAssetMasterById } from '@/app/[locale]/asset/municipal-Asset/asset-detail/actions';
import { PrintReportButton } from './PrintReportButton';
import './estate-report.css';

type PageProps = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
};

type ApiRecord = Record<string, unknown>;

function formatText(value: unknown): string {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}

function toMarathiDigits(value: unknown): string {
  const digits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(value ?? '-').replace(/\d/g, (d) => digits[Number(d)]);
}

function formatNumberINR(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num);
}

function formatCurrencyINR(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(value);
  if (Number.isNaN(num)) return formatText(value);
  return toMarathiDigits(new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num));
}

function getField(record: ApiRecord, keys: string[]): unknown {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null && record[key] !== '') return record[key];
  }
  return undefined;
}

function pickText(record: ApiRecord, keys: string[]): string {
  return formatText(getField(record, keys));
}

function pickNumber(record: ApiRecord, keys: string[]): string {
  const value = getField(record, keys);
  return value === undefined ? '-' : toMarathiDigits(formatNumberINR(value));
}

function getFirstImage(record: ApiRecord, key: string): string | null {
  const value = record[key];
  if (!Array.isArray(value) || value.length === 0) return null;
  const first = value[0] as ApiRecord;
  return typeof first.url === 'string' ? first.url : typeof first.image === 'string' ? first.image : null;
}

function normalizeText(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

function inferAssetCategory(record: ApiRecord): 'building' | 'land' | 'movable' | 'other' {
  const categoryId = Number(getField(record, ['assetCategoryId', 'categoryId']) ?? NaN);
  if (categoryId === 1) return 'building';
  if (categoryId === 2) return 'land';
  if (categoryId === 3) return 'movable';

  const hint = [
    record.assetCategoryName,
    record.categoryName,
    record.assetTypeName,
    record.assetType,
    record.assetName,
    record.name,
  ].map(normalizeText).join(' ');

  if (/(building|office|hospital|school|facility|property)/.test(hint)) return 'building';
  if (/(land|plot|open|vacant|encroach)/.test(hint)) return 'land';
  if (/(vehicle|bus|truck|car|furniture|equipment|machinery|it)/.test(hint)) return 'movable';

  return 'other';
}

function normalizeMovableCategory(value: unknown): 'Vehicles' | 'Furniture' | 'Equipment' | null {
  const text = normalizeText(value);
  if (!text) return null;
  if (/(vehicle|bus|car|truck|tractor)/.test(text)) return 'Vehicles';
  if (/(furniture|chair|table|sofa|cabinet)/.test(text)) return 'Furniture';
  if (/(equipment|electronic|fixture|machine|machinery|it)/.test(text)) return 'Equipment';
  return null;
}

function asRecordArray(value: unknown): ApiRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is ApiRecord => typeof item === 'object' && item !== null);
}

function toFiniteNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatBooleanMarathi(value: unknown): string {
  if (value === true) return 'होय';
  if (value === false) return 'नाही';
  return '-';
}

function formatDateMarathi(value: unknown): string {
  if (!value) return '-';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '-';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${toMarathiDigits(day)}-${toMarathiDigits(month)}-${toMarathiDigits(year)}`;
}

function firstAvailable(...values: unknown[]): unknown {
  for (const value of values) {
    if (value !== null && value !== undefined && value !== '') return value;
  }
  return undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Estate Report | ${id}` };
}

export default async function MunicipalAssetReportPage({ params }: PageProps) {
  const { id, locale } = await params;
  const asset = await fetchAssetMasterById(id).catch(() => null);

  if (!asset) notFound();

  const record = asset as unknown as ApiRecord;
  const inferredCategory = inferAssetCategory(record);
  const isBuildingCategory = inferredCategory === 'building';
  const isMovableCategory = inferredCategory === 'movable';

  const floorSummaryResult = isBuildingCategory
    ? await fetchAssetFloorSummaryByAsset(id).catch(() => ({ floorSummary: null, error: 'Failed to load floor details.' }))
    : { floorSummary: null, error: null };

  const rowValues = floorSummaryResult.floorSummary?.floorDetails?.length
    ? floorSummaryResult.floorSummary.floorDetails
    : Array.isArray(record.floors)
      ? record.floors
      : Array.isArray(record.floorDetails)
        ? record.floorDetails
        : [];

  const movableItems = [
    ...asRecordArray(record.vehicles),
    ...asRecordArray(record.vehicleAssets),
    ...asRecordArray(record.vehicleItems),
    ...asRecordArray(record.furniture),
    ...asRecordArray(record.furnitureItems),
    ...asRecordArray(record.equipment),
    ...asRecordArray(record.equipmentItems),
    ...asRecordArray(record.itEquipmentItems),
    ...asRecordArray(record.electronicFixturesItems),
    ...(isMovableCategory ? [record] : []),
  ] as Array<ApiRecord>;

  const assetId = pickText(record, ['assetNo', 'assetId', 'assetCode', 'id']);
  const title = pickText(record, ['assetName', 'name', 'assetTypeName', 'assetType', 'categoryName', 'assetCategoryName']);
  const authorityName = pickText(record, ['authorityName']);
  const organizationName = pickText(record, ['organizationName']);
  const departmentName = pickText(record, ['departmentName', 'department']);
  const assetTypeName = pickText(record, ['assetTypeName', 'assetType']);
  const ownershipType = pickText(record, ['ownershipType']);
  const occupancyStatus = pickText(record, ['occupancyStatus']);
  const operationalControl = pickText(record, ['operationalControl', 'inChargeDesignation', 'inChargeName']);
  const assetCondition = pickText(record, ['assetCondition', 'description', 'assetDescription']);
  const address = pickText(record, ['fullAddress', 'address', 'location', 'loc']);
  const description = pickText(record, ['assetDescription', 'description', 'remarks', 'propertyDescription', 'assetCondition']);
  const citySurvey = pickText(record, ['csn', 'citySurveyNo', 'surveyNumber']);
  const cityLabel = pickText(record, ['cityName', 'city', 'authorityName']);
  const hasLift = formatBooleanMarathi(getField(record, ['hasLift']));
  const isRevenueGenerating = formatBooleanMarathi(getField(record, ['isRevenueGenerating']));
  const isActive = formatBooleanMarathi(getField(record, ['isActive']));
  const purchaseValue = formatCurrencyINR(getField(record, ['purchaseValue']));
  const purchaseDate = formatDateMarathi(getField(record, ['purchaseDate']));
  const marketValue = formatCurrencyINR(getField(record, ['marketValue']));
  const marketValueDate = formatDateMarathi(getField(record, ['marketValueDate']));
  const fallbackMovableCategory = normalizeMovableCategory(getField(record, ['assetTypeName', 'assetCategoryName', 'categoryName']));

  const constructionRows = rowValues.length
    ? (rowValues as Array<ApiRecord>)
    : [];

  const movableTotals = movableItems.reduce<{ quantity: number; value: number }>((acc, item) => {
    const qty = toFiniteNumber(getField(item, ['quantity', 'qty', 'count']));
    const value = toFiniteNumber(getField(item, ['value', 'marketValue', 'purchaseValue', 'currentBookValue']));
    return {
      quantity: acc.quantity + qty,
      value: acc.value + value,
    };
  }, { quantity: 0, value: 0 });

  return (
    <div className="estate-report-page font-sans text-slate-900">
      <div className="estate-report-shell max-w-319.5 mx-auto no-print">
        <div className="flex justify-end mb-6 pt-4 px-2">
          <PrintReportButton locale={locale} id={id} />
        </div>
      </div>
      <div className="estate-report-shell">
        <div className="w-full overflow-x-auto print:p-0 flex justify-center custom-scrollbar">
          <div
            id="printable-report"
            className="estate-report-card bg-white border border-gray-300 shadow-xl print:shadow-none print:border-none relative overflow-hidden box-border"
            style={{ width: '297mm', height: '210mm', minWidth: '297mm', minHeight: '210mm', padding: '6mm 7mm' }}
          >
            <div className="relative z-10 font-sans text-gray-900 h-full flex flex-col">
              <div className="flex justify-between items-start border-b border-[#b0b6c2] pb-2 mb-3 rounded-b-2xl shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12.5 h-12.5 shrink-0">
                    <Image
                      src="/akola Logo.png"
                      alt="Akola Municipal Corporation Logo"
                      width={50}
                      height={50}
                      className="h-full w-full object-contain"
                      priority
                    />
                  </div>
                  <div className="border border-black rounded-lg px-3 py-2">
                    <h1 className="text-[20px] font-black leading-tight tracking-wide text-[#0d4380]">अकोला महानगरपालिका, अकोला</h1>
                    <h2 className="text-[10px] font-bold text-gray-800 tracking-wide mt-1">महाराष्ट्र महानगरपालिका अधिनियम १९४९ चे प्रकरण ११ व ८ कराधन नियम अन्वये मालमत्ता विवरण तक्ता</h2>
                    <div className="inline-block text-white font-bold px-4 py-0.75 rounded-full mt-2 text-[10px] shadow-sm bg-[#175294]">महानगरपालिका मालमत्ता - आरोग्य संस्था माहिती</div>
                  </div>
                </div>

                <div className="flex flex-col items-center shrink-0 w-25 relative z-20 pt-1">
                  <div className="border border-[#b0b6c2] p-1 rounded-md w-full bg-white shadow-sm flex items-center justify-center min-h-6">
                    <Image
                      src="/qr.png"
                      alt="QR code"
                      width={60}
                      height={60}
                      className="h-15 w-15 object-cover"
                      priority
                    />
                  </div>
                  <div className="relative border border-[#b0b6c2] rounded-md w-31 mt-1.5 pt-1.25 pb-1 flex justify-center bg-white shadow-sm z-10">
                    <div className="absolute -top-2.25 bg-[#175294] text-white text-[9px] px-3 py-0.5 rounded-sm font-bold tracking-widest leading-none shadow-sm">मालमत्ता क्रमांक</div>
                    <div className="font-black text-[9px] tracking-widest text-gray-900 leading-none mt-0.5">{assetId}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-3 shrink-0">
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="border border-[#b0b6c2] rounded-[10px] overflow-hidden shadow-sm text-[10px] leading-tight text-[#0d4380]">
                    <div className="grid grid-cols-[84px_92px_64px_96px_70px_1fr_1fr]">
                      <div className="border-r border-b border-[#b0b6c2] px-0.75 py-0.75 flex items-center justify-center font-bold bg-white">प्राधिकरणाचे नाव</div>
                      <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">संस्थेचे नाव</div>
                      <div className="border-r border-b border-[#b0b6c2] px-0.75 py-1.5 flex items-center justify-center font-bold bg-white">विभागाचे नाव</div>
                      <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">सिटी सर्वे क्रमांक</div>
                      <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">मालकी प्रकार</div>
                      <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">खरेदी मूल्य</div>
                      <div className="border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">बाजार मूल्य</div>

                      <div className="border-r border-[#b0b6c2] px-0.75 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{authorityName}</div>
                      <div className="border-r border-[#b0b6c2] px-1.5 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{organizationName}</div>
                      <div className="border-r border-[#b0b6c2] px-1 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{departmentName}</div>
                      <div className="border-r border-[#b0b6c2] px-1.5 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{citySurvey}</div>
                      <div className="border-r border-[#b0b6c2] px-1.5 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{ownershipType}</div>
                      <div className="border-r border-[#b0b6c2] px-1.5 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{purchaseValue}</div>
                      <div className="px-1.5 py-1.5 flex items-center justify-center font-black text-gray-700 text-[8px] leading-tight">{marketValue}</div>
                    </div>
                  </div>

                  <div className="border border-[#b0b6c2] rounded-[10px] overflow-hidden shadow-sm text-[11px] leading-tight text-[#0d4380]">
                    <div className="grid grid-cols-[1.2fr_1fr_0.8fr_1fr]">
                      <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center font-bold bg-white">मालमत्तेचे नाव</div>
                      <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center text-[#cc0c0c] font-black">{formatText(title)}</div>
                      <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">लिफ्ट उपलब्ध आहे का?</div>
                      <div className="border-b border-[#b0b6c2] px-2 py-1.5 flex items-center justify-center font-bold bg-white">मालमत्तेची अवस्था</div>

                      <div className="border-r border-[#b0b6c2] px-2 py-1.5 flex items-center  font-black">पत्ता :</div>
                      <div className="border-r border-b border-[#b0b6c2] px-2 py-1.5 flex items-center text-[#cc0c0c] font-black">{address}</div>
                      <div className="border-r border-[#b0b6c2] px-2 py-1.5 grid grid-cols-2">
                        <div className="border-r border-[#b0b6c2] px-2 text-center">
                          <div className="font-bold">लिफ्ट उपलब्ध</div>
                          <div className="mt-0.5 text-[12px] text-gray-700">{hasLift}</div>
                        </div>
                        <div className="px-2 text-center">
                          <div className="font-bold">महसूल निर्माण</div>
                          <div className="mt-0.5 text-[12px] text-gray-700">{isRevenueGenerating}</div>
                        </div>
                      </div>
                      <div className="border-[#b0b6c2] px-2 py-1.5 flex items-center text-[#cc0c0c] font-black">{assetCondition === '-' ? description : assetCondition}</div>
                    </div>
                  </div>
                </div>

                <div className="w-82.5 relative border border-[#b0b6c2] rounded-[10px] p-3 pt-6 shadow-sm bg-gray-50/30">
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-white px-8 py-0.5 rounded-full text-[11px] font-black tracking-widest shadow-sm border-[1.5px] border-white bg-[#175294]">KYC</div>
                  <div className="flex flex-col gap-2 h-full justify-center text-[11px] font-bold text-[#0d4380]">
                    <div className="flex gap-2 text-gray-700 items-center">
                      <span className="w-32.5 text-[#0d4380]">प्राधिकरणाचे नाव :</span>
                      <span className="text-[12px] text-[#cc0c0c]">{authorityName}</span>
                    </div>
                    <div className="flex gap-2 border-t border-dashed border-gray-300 pt-2 text-gray-700 items-center">
                      <span className="w-32.5 text-[#0d4380]">संस्थेचे नाव :</span>
                      <span className="text-[12px] text-[#cc0c0c]">{organizationName}</span>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-gray-300 pt-2 bg-gray-100/50 -mx-3 -mb-3 p-2 px-6 rounded-b-[10px] text-gray-700">
                      <span>विभागाचे नाव :- {departmentName}</span>
                      <span>कार्यकारी नियंत्रण विभाग :- {operationalControl}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1 min-h-0">
                <div className="flex flex-col gap-3 min-w-0">
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

                  <div className="flex gap-3 min-h-0 h-[280px]">
                    <div className="w-40 flex flex-col justify-between gap-2 h-full">
                      {[
                        { label: 'ON SPOT PHOTOGRAPH', icon: '📷', src: getFirstImage(record, 'images') ?? getFirstImage(record, 'thumbnail') ?? '/devplan.png' },
                        { label: 'LIVE GIS LOCATION', icon: '📍', src: getFirstImage(record, 'images') ?? '/municipal_building_front.png' },
                        { label: 'DP PLAN', icon: '🗺️', src: getFirstImage(record, 'floorPlans') ?? '/satellite_map_bg.png' },
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
                        {getFirstImage(record, 'floorPlans') ? (
                          <Image
                            src={getFirstImage(record, 'floorPlans') ?? ''}
                            alt="Digital Plan"
                            fill
                            className="object-cover p-1 grayscale-50"
                            sizes="(max-width: 768px) 100vw, 600px"
                          />
                        ) : (
                          <Image
                            src="/digital-plan.png"
                            alt="Digital Plan"
                            fill
                            className="object-cover scale-[1.08]"
                            sizes="(max-width: 768px) 100vw, 600px"
                            priority
                          />
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
                </div>

                <div className="hidden w-82.5 flex-col gap-3 shrink-0 h-full">
                  {false && (
                  <div className="border border-[#b0b6c2] rounded-[10px] bg-white shadow-sm flex flex-col relative flex-1 min-h-0 pt-3">
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-white px-8 py-1 rounded-full text-[11px] font-black tracking-widest z-10 shadow-sm whitespace-nowrap border-[1.5px] border-white bg-[#175294]">MOVABLE ASSETS</div>
                    <div className="flex flex-col h-full overflow-hidden rounded-b-[9px]">
                      <table className="w-full text-[9px] font-bold text-[#0d4380] border-collapse h-full">
                        <thead className="bg-gray-100/90 border-b border-[#b0b6c2] h-5.5">
                          <tr>
                            <th className="px-3 py-1 text-left align-middle w-auto">वाहने / फर्निचर / उपकरणे</th>
                            <th className="px-2 py-1 text-center align-middle border-l border-[#b0b6c2] w-11.25">QTY</th>
                            <th className="px-3 py-1 text-right align-middle border-l border-[#b0b6c2] w-23.75">VALUE ₹</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 bg-white">
                          {['Vehicles', 'Furniture', 'Equipment'].map((category) => {
                            const categoryItems = movableItems.filter((item) => {
                              const itemCategory = normalizeMovableCategory(getField(item, ['category', 'assetCategoryName', 'categoryName', 'itemType', 'type', 'assetTypeName']))
                                ?? fallbackMovableCategory;
                              return itemCategory === category;
                            });
                            return (
                              <Fragment key={category}>
                                <tr className="border-b border-[#e2e8f0] bg-gray-50/50">
                                  <td colSpan={3} className="px-3 py-0.75 align-middle text-left font-extrabold text-[#0d4380] text-[10px]">
                                    {category === 'Vehicles' ? 'वाहने' : category === 'Furniture' ? 'फर्निचर' : 'उपकरणे'}
                                  </td>
                                </tr>
                                {categoryItems.length > 0 ? categoryItems.map((item, idx) => {
                                  const itemName = formatText(getField(item, ['name', 'assetName', 'itemName', 'vehicleName']));
                                  const itemQty = getField(item, ['quantity', 'qty', 'count']) ?? '-';
                                  const itemValue = getField(item, ['value', 'marketValue', 'purchaseValue', 'currentBookValue']) ?? '-';

                                  return (
                                    <tr key={`${category}-${idx}`} className="border-b border-[#e2e8f0] hover:bg-gray-50">
                                      <td className="px-3 py-0.5 align-middle">
                                        <div className="flex items-center gap-1.5">
                                          <div className="w-4.5 h-3.5 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xs overflow-hidden shrink-0">
                                            <span className="text-[8px]">•</span>
                                          </div>
                                          <span className="truncate max-w-32.5" title={itemName}>{itemName}</span>
                                        </div>
                                      </td>
                                      <td className="px-2 py-0.5 align-middle text-center border-l border-[#e2e8f0] font-black">{toMarathiDigits(itemQty)}</td>
                                      <td className="px-3 py-0.5 align-middle text-right border-l border-[#e2e8f0] font-black">{formatCurrencyINR(itemValue)}</td>
                                    </tr>
                                  );
                                }) : (
                                  <tr>
                                    <td className="px-3 py-0.5 align-middle">-</td>
                                    <td className="px-2 py-0.5 align-middle text-center border-l border-[#e2e8f0]">-</td>
                                    <td className="px-3 py-0.5 align-middle text-right border-l border-[#e2e8f0]">-</td>
                                  </tr>
                                )}
                              </Fragment>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-[#175294] text-white">
                          <tr className="h-7.5">
                            <td className="px-3 py-1 align-middle text-center text-[13px] font-black tracking-widest border-r border-[#1f63ae]">एकूण</td>
                            <td className="px-2 py-1 align-middle text-center text-[12px] font-black border-r border-[#1f63ae]">{movableTotals.quantity > 0 ? toMarathiDigits(movableTotals.quantity) : '-'}</td>
                            <td className="px-3 py-1 align-middle text-left font-black tracking-wide text-[12px]">{movableTotals.value > 0 ? formatCurrencyINR(movableTotals.value) : '-'}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                  )}

                  <div className="flex gap-2 h-31.25 shrink-0">
                    <div className="border border-[#b0b6c2] rounded-[10px] bg-gray-50/50 p-2 flex flex-col relative shadow-sm flex-1 min-w-0">
                      <div className="text-[#175294] font-black text-[16px] text-center mb-1 drop-shadow-sm leading-none tracking-wide">अकोला</div>
                      <div className="flex-1 border border-blue-200 bg-[#e0e7ff] rounded-md overflow-hidden flex items-center justify-center relative min-h-0">
                        <Image
                          src="/map-panel.png"
                          alt="Map panel"
                          fill
                          className="object-cover"
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
              </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



