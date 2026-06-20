'use server';
import type { ReactNode } from 'react';
import * as assetDashboardService from '@/lib/api/asset/asset-dashboard.service';
import { logger } from '@/lib/utils/logger';
import type { AssetDashboardTypeByCategory, AssetDashboardAssetByType } from '@/types/asset-type/asset-dashboard-api.types';
import type { DashboardCategoryItem, DashboardDataPayload } from '@/types/asset-type/asset-dashboard.types';
import {
  actionBuildStats, actionMapCat, actionMapLoc,
  ACTION_EMPTY_STATS, getActionErrorMessage
} from '@/lib/utils/asset-utils/asset-dashboard-helpers';
import { getCachedZones, getCachedWards } from '@/lib/api/asset/cached-master-data';

async function actionResolveIds(z?: string, w?: string) {
  if ((!z || z === 'all') && (!w || w === 'all')) return { zoneId: null, wardId: null };
  const [zr, wr] = await Promise.all([getCachedZones().catch(() => ({ data: [] as any[] })), getCachedWards().catch(() => ({ data: [] as any[] }))]);
  return { zoneId: z && z !== 'all' ? (Number((zr.data as any[])?.find(x => String(x.zoneNo) === z)?.id) || null) : null, wardId: w && w !== 'all' ? (Number((wr.data as any[])?.find(x => String(x.wardNo) === w)?.id) || null) : null };
}

export async function fetchInitialDashboardAction() {
  try {
    const [sum, cats, locs, zRes, wRes] = await Promise.all([
      assetDashboardService.getSummary().catch(()=>null),
      assetDashboardService.getCategoryCounts().catch(()=>[]),
      assetDashboardService.getLocations().catch(()=>[]),
      getCachedZones().catch(()=>({data:[]})),
      getCachedWards().catch(()=>({data:[]}))
    ]);
    const zData = (zRes.data as any[]) ?? [], wData = (wRes.data as any[]) ?? [];
    const zMap = new Map<any, string>(zData.map(z => [z.id, String(z.zoneNo || '')]));
    const allWards = wData.map(w => ({ wardNo: String(w.wardNo || ''), zoneNo: zMap.get(w.zoneId) || '' })).filter(w => w.wardNo);
    const categories = (cats as any[]).map(actionMapCat);
    const allLocs = (locs as any[]).map(d => actionMapLoc(d)), assets = allLocs.filter(a => a.latitude !== 0 || a.longitude !== 0);
    const initialTypes: any[] = [];
    return { stats: sum ? actionBuildStats(sum as any, categories) : ACTION_EMPTY_STATS, categories, filteredAssets: assets.length > 0 ? assets : allLocs, zoneDistribution: [], acquisitionsList: [], auctionsList: [], allZones: [...new Set(zData.map(z => String(z.zoneNo || '')).filter(Boolean))], allWards, initialTypes } as DashboardDataPayload;
  } catch (e) { logger.error('Action failed', { error: e as Error }); return { error: getActionErrorMessage(e) }; }
}

export async function fetchFilteredAction(zNo: string, wNo: string) {
  try {
    const { zoneId, wardId } = await actionResolveIds(zNo, wNo);
    const [sum, locs, zRes, wRes] = await Promise.all([
      assetDashboardService.getSummary(zoneId, wardId).catch(()=>null),
      assetDashboardService.getLocations(zoneId, wardId).catch(()=>[]),
      getCachedZones().catch(()=>({data:[]})),
      getCachedWards().catch(()=>({data:[]}))
    ]);
    const zData = (zRes.data as any[]) ?? [], wData = (wRes.data as any[]) ?? [];
    const zMap = new Map<any, string>(zData.map(z => [z.id, String(z.zoneNo || '')]));
    const allWards = wData.map(w => ({ wardNo: String(w.wardNo || ''), zoneNo: zMap.get(w.zoneId) || '' })).filter(w => w.wardNo);
    const categories: DashboardCategoryItem[] = ((sum?.assetCountCardDetails ?? []) as any[]).map((c: any) => {
      const cat = actionMapCat(c);
      if (!cat.value) {
        const vc = ((sum?.assetValueCardDetails ?? []) as any[]).find(v => String(v.title || '').replace(/\s*Value$/i, '').toLowerCase() === cat.name.toLowerCase());
        if (vc) { const cr = String(vc.value||'').match(/([\d.]+)\s*Cr/i), l = String(vc.value||'').match(/([\d.]+)\s*L/i); if (cr) cat.value = parseFloat(cr[1])*1e7; else if (l) cat.value = parseFloat(l[1])*1e5; }
      }
      return cat;
    });
    const allLocs = (locs as any[]).map(d => actionMapLoc(d, zNo, wNo)), assets = allLocs.filter(a => a.latitude !== 0 || a.longitude !== 0);
    const initialTypes: any[] = [];
    return { stats: sum ? actionBuildStats(sum as any, categories) : ACTION_EMPTY_STATS, categories, filteredAssets: assets.length > 0 ? assets : allLocs, allZones: [...new Set(zData.map(z => String(z.zoneNo || '')).filter(Boolean))], allWards, zoneDistribution: [], acquisitionsList: [], auctionsList: [], initialTypes };
  } catch (e) { logger.error('Action failed', { error: e as Error }); return { error: getActionErrorMessage(e) }; }
}

/**
 * RSC-compatible filter action — called directly from the client hook on zone/ward change.
 * Avoids router.push() page navigation; updates stats + locations in-place via server action.
 */
export async function fetchFilteredRSCAction(zNo: string, wNo: string) {
  return fetchFilteredAction(zNo, wNo);
}

function TypeListRSC({ t, e }: { t: AssetDashboardTypeByCategory[]; e?: string }) {
  if (e) return <div data-rsc-type="types-error" style={{ display: 'none' }} />;
  return <div data-rsc-type="types-list" style={{ display: 'none' }}>{t.map(tp => (<article key={tp.id} data-type-id={tp.id} data-category-id={tp.categoryId} data-count={tp.count} data-total-value={tp.totalValue} aria-label={tp.assetType} />))}</div>;
}

function AssetListRSC({ a, e }: { a: AssetDashboardAssetByType[]; e?: string }) {
  if (e) return <div data-rsc-type="assets-error" style={{ display: 'none' }} />;
  return <div data-rsc-type="assets-list" style={{ display: 'none' }}>{a.map((as, i) => (<article key={`${as.id}-${i}`} data-asset-id={as.id} data-ward={as.wardName} data-zone={as.zoneName} data-status={as.status} data-lat={as.latitude} data-lng={as.longitude} data-market-value={as.marketValue} data-code={as.code} aria-label={as.name} />))}</div>;
}

export interface TypesRSCResult { node: ReactNode; }
export interface AssetsRSCResult { node: ReactNode; }

export async function fetchTypesByCategoryRSCAction(cId: number | null, zNo?: string, wNo?: string): Promise<TypesRSCResult> {
  try {
    const { zoneId, wardId } = await actionResolveIds(zNo, wNo);
    const data = await assetDashboardService.getTypesByCategory(cId, zoneId, wardId);
    let t = (data as any[]).map(tp => ({ id: tp.id ?? tp.Id, assetType: tp.assetType ?? tp.AssetType, count: tp.count ?? tp.Count, totalValue: tp.totalValue ?? tp.TotalValue ?? 0, categoryId: tp.categoryId ?? tp.CategoryId }));
    if (cId) t = t.filter(tp => tp.categoryId === cId || tp.categoryId == null);
    return { node: <TypeListRSC t={t as any} /> };
  } catch (e) { logger.error('RSC failed', { error: e as Error }); return { node: <TypeListRSC t={[]} e={getActionErrorMessage(e)} /> }; }
}

export async function fetchAssetsByTypeRSCAction(tId: number, zNo?: string, wNo?: string): Promise<AssetsRSCResult> {
  try {
    const { zoneId, wardId } = await actionResolveIds(zNo, wNo);
    const data = await assetDashboardService.getAssetsByType(tId, zoneId, wardId);
    const a = (data as any[]).map(d => ({ id: d.id || 0, name: d.name || `Asset ${d.id}`, code: d.code || d.assetNo || '', status: d.status || 'Active', marketValue: d.marketValue || 0, latitude: d.latitude || 0, longitude: d.longitude || 0, wardName: d.wardName || '', zoneName: d.zoneName || '' }));
    return { node: <AssetListRSC a={a as any} /> };
  } catch (e) { logger.error('RSC failed', { error: e as Error }); return { node: <AssetListRSC a={[]} e={getActionErrorMessage(e)} /> }; }
}
