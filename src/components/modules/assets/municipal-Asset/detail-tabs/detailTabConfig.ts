import { getFilteredSteps } from '../add-New-Asset/assetFormSteps';
import type { AssetDetailRecord, AssetDetailTabConfig, AssetDetailTabKey } from './types';

const STEP_TO_DETAIL_TAB: Record<string, AssetDetailTabConfig> = {
  'basic-info': { key: 'overview', label: 'Overview' },
  'floor-details': { key: 'floor-details', label: 'Floor Details' },
  'legal-complience': { key: 'legal-planning', label: 'Legal, Safety & Compliance' },
  'furniture-fixture': { key: 'furniture-fixtures', label: 'Furniture & Fixtures' },
  valuation: { key: 'valuation', label: 'Valuation' },
  documents: { key: 'documents', label: 'Documents' },
  'standalone-sub-units': { key: 'sub-units', label: 'Sub-Units' },
};

function normalizeCategoryName(value?: string | null) {
  const text = (value || '').trim();
  const lower = text.toLowerCase();
  if (lower.includes('vehicle') || lower.includes('machinery') || lower.includes('movable')) return 'MOVABLE';
  if (lower.includes('land') || lower.includes('plot')) return 'LAND';
  if (lower.includes('building')) return 'BUILDING';
  if (lower.includes('infrastructure')) return 'INFRASTRUCTURE';
  return text;
}

function normalizeAssetTypeName(value?: string | null, parentAssetId?: number | string | null) {
  const text = (value || '').trim();
  const lower = text.toLowerCase();
  if (parentAssetId && (lower.includes('unit') || lower.includes('flat') || lower.includes('shop') || lower.includes('room'))) {
    return 'Flat/Apartment';
  }
  return text;
}

function hasTab(tabs: AssetDetailTabConfig[], key: AssetDetailTabKey) {
  return tabs.some((tab) => tab.key === key);
}

export function getAssetDetailTabs(
  asset: Pick<AssetDetailRecord, 'assetCategoryName' | 'assetTypeName' | 'parentAssetId'> | {
    assetCategoryName?: string | null;
    assetTypeName?: string | null;
    parentAssetId?: number | string | null;
    [key: string]: unknown;
  }
): AssetDetailTabConfig[] {
  const category = normalizeCategoryName(asset.assetCategoryName);
  const assetType = normalizeAssetTypeName(asset.assetTypeName, asset.parentAssetId);
  const steps = getFilteredSteps(category, assetType, asset.parentAssetId ? Number(asset.parentAssetId) : null);
  const tabs = steps
    .map((step) => STEP_TO_DETAIL_TAB[String(step.key)])
    .filter(Boolean);

  if (category === 'BUILDING' && !asset.parentAssetId && !hasTab(tabs, 'sub-units')) {
    const floorIndex = tabs.findIndex((tab) => tab.key === 'floor-details');
    tabs.splice(floorIndex >= 0 ? floorIndex + 1 : 1, 0, { key: 'sub-units', label: 'Sub-Units' });
  }

  return tabs.length > 0 ? tabs : [{ key: 'overview', label: 'Overview' }];
}
