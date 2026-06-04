import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getEstateReportViewModel } from '@/components/modules/assets/municipal-Asset/asset-report/report-data';
import {
  fetchAssetDocumentFile,
  fetchAssetFloorSummaryByAsset,
  fetchAssetMasterById,
  fetchAssetPhotosAndPlansByAsset,
} from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';

vi.mock('@/app/[locale]/assets/municipal-Asset/asset-detail/actions', () => ({
  fetchAssetMasterById: vi.fn(),
  fetchAssetPhotosAndPlansByAsset: vi.fn(),
  fetchAssetDocumentFile: vi.fn(),
  fetchAssetFloorSummaryByAsset: vi.fn(),
}));

describe('getEstateReportViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds report view-model with mapped fields, media images, and floor rows in one flow', async () => {
    vi.mocked(fetchAssetMasterById).mockResolvedValue({
      id: 'AST-101',
      assetNo: 'AST-101',
      assetName: 'Central Hospital Building',
      assetCategoryId: 1,
      authorityName: 'Akola Municipal Corporation',
      organizationName: 'Health Department',
      departmentName: 'Medical Wing',
      assetTypeName: 'Hospital',
      ownershipType: 'Owned',
      occupancyStatus: 'In Use',
      operationalControl: 'Health Officer',
      assetCondition: 'Good',
      fullAddress: 'Civil Lines, Akola',
      assetDescription: 'Main hospital block',
      citySurveyNo: 'CS-900',
      hasLift: true,
      isRevenueGenerating: false,
      isActive: true,
      purchaseValue: 1200000,
      marketValue: 2500000,
      floors: [{ floorName: 'Ground' }],
    } as never);

    vi.mocked(fetchAssetPhotosAndPlansByAsset).mockResolvedValue({
      documents: [
        { id: 11, name: 'Asset Image Front' },
        { id: 12, name: 'Asset Photo Plan Main' },
      ],
    } as never);

    vi.mocked(fetchAssetDocumentFile).mockImplementation(async (docId) => {
      if (docId === 11) {
        return {
          error: null,
          base64: 'front-image-base64',
          contentType: 'image/png',
        } as never;
      }

      if (docId === 12) {
        return {
          error: null,
          base64: 'dp-plan-base64',
          contentType: 'image/jpeg',
        } as never;
      }

      return { error: 'not-found', base64: null } as never;
    });

    vi.mocked(fetchAssetFloorSummaryByAsset).mockResolvedValue({
      floorSummary: {
        floorDetails: [{ floorName: 'Ground', builtUpAreaSqMeter: 150 }],
      },
    } as never);

    const result = await getEstateReportViewModel('AST-101');

    expect(result).not.toBeNull();
    expect(result).toMatchObject({
      assetId: 'AST-101',
      title: 'Central Hospital Building',
      authorityName: 'Akola Municipal Corporation',
      organizationName: 'Health Department',
      departmentName: 'Medical Wing',
      assetTypeName: 'Hospital',
      ownershipType: 'Owned',
      occupancyStatus: 'In Use',
      operationalControl: 'Health Officer',
      assetCondition: 'Good',
      address: 'Civil Lines, Akola',
      description: 'Main hospital block',
      citySurvey: 'CS-900',
      hasLift: 'होय',
      isRevenueGenerating: 'नाही',
      isActive: 'होय',
      purchaseValue: '१२,००,०००',
      marketValue: '२५,००,०००',
      isBuildingCategory: true,
      onSpotSrc: 'data:image/png;base64,front-image-base64',
      dpPlanSrc: 'data:image/jpeg;base64,dp-plan-base64',
      digitalPlanSrc: 'data:image/jpeg;base64,dp-plan-base64',
    });

    expect(result?.constructionRows).toEqual([{ floorName: 'Ground', builtUpAreaSqMeter: 150 }]);
    expect(fetchAssetMasterById).toHaveBeenCalledWith('AST-101');
    expect(fetchAssetPhotosAndPlansByAsset).toHaveBeenCalledWith('AST-101');
    expect(fetchAssetFloorSummaryByAsset).toHaveBeenCalledWith('AST-101');
    expect(fetchAssetDocumentFile).toHaveBeenCalledTimes(2);
  });
});
