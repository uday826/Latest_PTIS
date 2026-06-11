import 'server-only';

import { apiClient } from '@/services/api.service';
import { zoneService } from './zone.service';
import { wardService } from './ward.service';

export interface ZoneOption {
  id: number;
  zoneNo: string;
  description?: string | null;
}

export interface WardOption {
  id: number;
  wardNo: string;
  zoneId: number;
  description?: string | null;
}

export interface CategoryOption {
  id: number;
  categoryCode: string;
  categoryName: string;
}

export interface AssetMasterOption {
  id: number;
  assetNo?: string | null;
  assetName?: string | null;
  assetCategoryName?: string | null;
  zoneName?: string | null;
  wardName?: string | null;
  isActive?: boolean;
}

type PagedLike<T> = {
  items?: T[];
};

function asArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];

  const paged = data as PagedLike<T> | null | undefined;
  return Array.isArray(paged?.items) ? (paged!.items as T[]) : [];
}

export async function getZones(): Promise<ZoneOption[]> {
  const response = await zoneService.getZones();
  if (!response.success || !response.data) return [];

  return response.data
    .map((zone) => ({
      id: zone.id,
      zoneNo: zone.zoneNo?.trim() || String(zone.id),
      description: zone.description ?? null,
    }))
    .filter((zone) => zone && typeof zone.id === 'number');
}

export async function getWards(_zoneId?: number | null): Promise<WardOption[]> {
  const response = await wardService.getWards();
  if (!response.success || !response.data) return [];

  return response.data
    .map((ward) => ({
      id: ward.id,
      wardNo: ward.wardNo?.trim() || ward.WardNo?.trim() || ward.wardName?.trim() || String(ward.id),
      zoneId: typeof ward.zoneId === 'string' ? Number(ward.zoneId) : ward.zoneId ?? 0,
      description: ward.description ?? ward.wardName ?? ward.WardName ?? null,
    }))
    .filter((ward) => ward && typeof ward.id === 'number');
}

export async function getAssetCategories(): Promise<CategoryOption[]> {
  const response = await apiClient.get<unknown>('/AssetCategory?PageSize=-1');
  if (!response.success) return [];
  return asArray<CategoryOption>(response.data).filter(
    (category) => category && typeof category.id === 'number'
  );
}

export async function getAssetMasters(): Promise<AssetMasterOption[]> {
  const response = await apiClient.get<unknown>('/AssetMaster?PageSize=-1');
  if (!response.success) return [];
  return asArray<AssetMasterOption>(response.data)
    .filter((asset) => asset && typeof asset.id === 'number')
    .filter((asset) => asset.isActive !== false);
}
