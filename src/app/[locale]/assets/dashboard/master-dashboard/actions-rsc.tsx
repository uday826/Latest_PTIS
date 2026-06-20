'use server';

/**
 * actions-rsc.tsx
 *
 * Server Actions that return BOTH typed data AND a pre-rendered ReactNode in one call.
 * - `node`  → ReactNode  (causes Next.js to use RSC wire format in Network Payload/Preview)
 * - `types` / `assets` → typed arrays the client uses directly for logic
 *
 * This means ONE network request per user interaction, not two.
 * API calls are only made on demand (when the user clicks a category or subcategory),
 * NOT on page load.
 */

import type { ReactNode } from 'react';
import { assetDashboardService } from '@/lib/api/asset/asset-dashboard.service';
import { getCachedZones, getCachedWards } from '@/lib/api/asset/cached-master-data';
import { logger } from '@/lib/utils/logger';
import type { AssetDashboardTypeByCategory, AssetDashboardAssetByType } from '@/types/asset-type/asset-dashboard-api.types';
import { TypeListRSC, AssetListRSC } from '@/components/modules/assets/dashboard/master-dashboard/RSCPayloads';

// ─── Private helpers ─────────────────────────────────────────────────────────

async function resolveIds(zoneNo?: string, wardNo?: string): Promise<{ zoneId: number | null; wardId: number | null }> {
  if ((!zoneNo || zoneNo === 'all') && (!wardNo || wardNo === 'all')) return { zoneId: null, wardId: null };
  const [z, w] = await Promise.all([
    getCachedZones().catch(() => ({ data: [] as any[] })),
    getCachedWards().catch(() => ({ data: [] as any[] })),
  ]);
  const zd = (z.data as any[]) ?? [];
  const wd = (w.data as any[]) ?? [];
  return {
    zoneId: zoneNo && zoneNo !== 'all' ? (Number(zd.find((x: any) => String(x.zoneNo) === zoneNo)?.id) || null) : null,
    wardId: wardNo && wardNo !== 'all' ? (Number(wd.find((x: any) => String(x.wardNo) === wardNo)?.id) || null) : null,
  };
}

// ─── Return types ─────────────────────────────────────────────────────────────

export interface TypesRSCResult {
  node: ReactNode;
  types: AssetDashboardTypeByCategory[];
}

export interface AssetsRSCResult {
  node: ReactNode;
  assets: AssetDashboardAssetByType[];
}

// ─── fetchTypesByCategoryRSCAction ────────────────────────────────────────────

/**
 * On-demand RSC Server Action: called only when the user clicks a category tab.
 * Returns typed data (for logic) + a ReactNode (for RSC wire format in Network tab).
 * Only ONE API call per user interaction.
 */
export async function fetchTypesByCategoryRSCAction(
  categoryId: number | null,
  zoneNo?: string,
  wardNo?: string
): Promise<TypesRSCResult> {
  try {
    const { zoneId, wardId } = await resolveIds(zoneNo, wardNo);
    const typesData = await assetDashboardService.getTypesByCategory(categoryId, zoneId, wardId);

    let types = (typesData as any[]).map((tp) => ({
      id: tp.id ?? tp.Id,
      assetType: tp.assetType ?? tp.AssetType,
      count: tp.count ?? tp.Count,
      totalValue: tp.totalValue ?? tp.TotalValue ?? 0,
      categoryId: tp.categoryId ?? tp.CategoryId,
    }));

    if (categoryId) {
      types = types.filter((tp) => tp.categoryId === categoryId || tp.categoryId == null);
    }

    const typedResult = types as AssetDashboardTypeByCategory[];

    return {
      // RSC node → Network tab shows RSC wire format (0:, 1:, 2:...)
      node: <TypeListRSC types={typedResult} />,
      // Typed data → used directly by the client for logic (no second call needed)
      types: typedResult,
    };
  } catch (error) {
    logger.error('[RSC Action] fetchTypesByCategoryRSCAction failed', { error: error as Error });
    return {
      node: <TypeListRSC types={[]} error={error instanceof Error ? error.message : 'Failed to fetch types'} />,
      types: [],
    };
  }
}

// ─── fetchAssetsByTypeRSCAction ───────────────────────────────────────────────

/**
 * On-demand RSC Server Action: called only when the user clicks a subcategory type.
 * Returns typed data (for logic) + a ReactNode (for RSC wire format in Network tab).
 * Only ONE API call per user interaction.
 */
export async function fetchAssetsByTypeRSCAction(
  assetTypeId: number,
  zoneNo?: string,
  wardNo?: string
): Promise<AssetsRSCResult> {
  try {
    const assetsData = await assetDashboardService.getAssetsByType(assetTypeId, null, null);

    let assets = (assetsData as any[]).map((dto: any) => ({
      id: dto.id || 0,
      name: dto.name || `Asset ${dto.id}`,
      code: dto.code || dto.assetNo || '',
      status: dto.status || 'Active',
      marketValue: dto.marketValue || 0,
      latitude: dto.latitude || 0,
      longitude: dto.longitude || 0,
      wardName: dto.wardName || '',
      zoneName: dto.zoneName || '',
    }));

    if (zoneNo && zoneNo !== 'all') assets = assets.filter((a: any) => a.zoneName === zoneNo);
    if (wardNo && wardNo !== 'all') assets = assets.filter((a: any) => a.wardName === wardNo);

    const typedResult = assets as AssetDashboardAssetByType[];

    return {
      // RSC node → Network tab shows RSC wire format (0:, 1:, 2:...)
      node: <AssetListRSC assets={typedResult} />,
      // Typed data → used directly by the client for logic (no second call needed)
      assets: typedResult,
    };
  } catch (error) {
    logger.error('[RSC Action] fetchAssetsByTypeRSCAction failed', { error: error as Error });
    return {
      node: <AssetListRSC assets={[]} error={error instanceof Error ? error.message : 'Failed to fetch assets'} />,
      assets: [],
    };
  }
}
