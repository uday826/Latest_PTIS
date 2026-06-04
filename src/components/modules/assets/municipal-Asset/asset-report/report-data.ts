import {
  fetchAssetDocumentFile,
  fetchAssetFloorSummaryByAsset,
  fetchAssetMasterById,
  fetchAssetPhotosAndPlansByAsset,
} from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';
import type { AssetDocumentListItem } from '@/types/municipal-asset/detail-tabs.types';
import {
  type ApiRecord,
  formatBooleanMarathi,
  formatCurrencyINR,
  formatDateMarathi,
  getField,
  inferAssetCategory,
  pickText,
} from './report-utils';

export type EstateReportViewModel = {
  record: ApiRecord;
  title: string;
  assetId: string;
  authorityName: string;
  organizationName: string;
  departmentName: string;
  assetTypeName: string;
  ownershipType: string;
  occupancyStatus: string;
  operationalControl: string;
  assetCondition: string;
  address: string;
  description: string;
  citySurvey: string;
  hasLift: string;
  isRevenueGenerating: string;
  isActive: string;
  purchaseValue: string;
  purchaseDate: string;
  marketValue: string;
  marketValueDate: string;
  isBuildingCategory: boolean;
  constructionRows: Array<ApiRecord>;
  onSpotSrc: string | null;
  dpPlanSrc: string | null;
  digitalPlanSrc: string | null;
};

async function getBase64ImageSrc(docId: string | number | undefined): Promise<string | null> {
  if (!docId) return null;

  try {
    const fileData = await fetchAssetDocumentFile(docId);
    if (!fileData.error && fileData.base64) {
      const contentType = fileData.contentType || 'image/jpeg';
      return `data:${contentType};base64,${fileData.base64}`;
    }
  } catch (e) {
    console.error('Error fetching image file:', e);
  }

  return null;
}

export async function getEstateReportViewModel(id: string): Promise<EstateReportViewModel | null> {
  const asset = await fetchAssetMasterById(id).catch(() => null);
  if (!asset) return null;

  const photosAndPlans = await fetchAssetPhotosAndPlansByAsset(id).catch((e) => {
    const errorMessage = e instanceof Error ? e.message : 'Failed to load photos and plans.';
    console.error('Error fetching photos and plans:', e);
    return { documents: [], error: errorMessage };
  });

  const typedImageDocs = (photosAndPlans.documents || []) as AssetDocumentListItem[];
  const onSpotDoc = typedImageDocs.find((d) => d?.name?.toLowerCase().includes('asset image'));
  const dpPlanDoc = typedImageDocs.find((d) => d?.name?.toLowerCase().includes('asset photo plan'));

  const [onSpotSrc, dpPlanSrc] = await Promise.all([
    onSpotDoc ? getBase64ImageSrc(onSpotDoc.id) : null,
    dpPlanDoc ? getBase64ImageSrc(dpPlanDoc.id) : null,
  ]);

  const record = asset as unknown as ApiRecord;
  const isBuildingCategory = inferAssetCategory(record) === 'building';

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

  return {
    record,
    title: pickText(record, ['assetName', 'name', 'assetTypeName', 'assetType', 'categoryName', 'assetCategoryName']),
    assetId: pickText(record, ['assetNo', 'assetId', 'assetCode', 'id']),
    authorityName: pickText(record, ['authorityName']),
    organizationName: pickText(record, ['organizationName']),
    departmentName: pickText(record, ['departmentName', 'department']),
    assetTypeName: pickText(record, ['assetTypeName', 'assetType']),
    ownershipType: pickText(record, ['ownershipType']),
    occupancyStatus: pickText(record, ['occupancyStatus']),
    operationalControl: pickText(record, ['operationalControl', 'inChargeDesignation', 'inChargeName']),
    assetCondition: pickText(record, ['assetCondition', 'description', 'assetDescription']),
    address: pickText(record, ['fullAddress', 'address', 'location', 'loc']),
    description: pickText(record, ['assetDescription', 'description', 'remarks', 'propertyDescription', 'assetCondition']),
    citySurvey: pickText(record, ['csn', 'citySurveyNo', 'surveyNumber']),
    hasLift: formatBooleanMarathi(getField(record, ['hasLift'])),
    isRevenueGenerating: formatBooleanMarathi(getField(record, ['isRevenueGenerating'])),
    isActive: formatBooleanMarathi(getField(record, ['isActive'])),
    purchaseValue: formatCurrencyINR(getField(record, ['purchaseValue'])),
    purchaseDate: formatDateMarathi(getField(record, ['purchaseDate'])),
    marketValue: formatCurrencyINR(getField(record, ['marketValue'])),
    marketValueDate: formatDateMarathi(getField(record, ['marketValueDate'])),
    isBuildingCategory,
    constructionRows: rowValues.length ? (rowValues as Array<ApiRecord>) : [],
    onSpotSrc,
    dpPlanSrc,
    digitalPlanSrc: dpPlanSrc,
  };
}
