import 'server-only';

import { zoneService } from './zone.service';
import { wardService } from './ward.service';
import type { RevenueFilterOption } from '@/types/asset-type/revenue-dashboard.types';

/**
 * Loads the zone + ward dropdown options for the revenue dashboard filters.
 * Failures degrade to empty lists so the dashboard still renders without filters.
 */
export async function getRevenueFilterOptions(
  zoneId?: number | null
): Promise<{ zones: RevenueFilterOption[]; wards: RevenueFilterOption[] }> {
  const [zonesRes, wardsRes] = await Promise.all([
    zoneService.getZones().catch(() => null),
    wardService.getWards(zoneId ?? null).catch(() => null),
  ]);

  const zones: RevenueFilterOption[] =
    zonesRes?.success && zonesRes.data
      ? zonesRes.data
          .filter((zone) => typeof zone.id === 'number')
          .map((zone) => {
            const code = (zone.zoneNo || zone.ZoneNo || '').toString().trim();
            const name = (zone.description || zone.zoneName || zone.ZoneName || '').toString().trim();
            const label = [code, name].filter(Boolean).join(' - ') || String(zone.id);
            return { id: zone.id, label };
          })
      : [];

  const wards: RevenueFilterOption[] =
    wardsRes?.success && wardsRes.data
      ? wardsRes.data
          .filter((ward) => typeof ward.id === 'number')
          .map((ward) => {
            const label =
              (ward.description ||
                ward.Description ||
                ward.wardName ||
                ward.WardName ||
                ward.wardNo ||
                ward.WardNo ||
                '')
                .toString()
                .trim() || String(ward.id);
            return { id: ward.id, label };
          })
      : [];

  return { zones, wards };
}
