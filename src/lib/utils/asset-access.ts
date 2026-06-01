import { ScreenItem } from '@/types/asset.types';

export const PROJECT_SCREEN_CATALOG: ScreenItem[] = [
  { screenCode: "asset_dash", screenPath: "/asset/dashboard/master-dashboard" },
  { screenCode: "map_viewer", screenPath: "/map-viewer" },
  { screenCode: "assets", screenPath: "/asset/municipal-Asset" },
  { screenCode: "maintenance", screenPath: "/maintenance/dashboard" },
  { screenCode: "change_detection", screenPath: "/change-detection" },
  { screenCode: "inventory", screenPath: "/inventory-dashboard" },
  { screenCode: "auction", screenPath: "/auction-management" },
  { screenCode: "revenue", screenPath: "/asset/revenue/payment" },
  { screenCode: "manage_renters", screenPath: "/asset/revenue/manage-renters" },
  { screenCode: "configuration", screenPath: "/asset/ScreenField/configuration" }
];

export const SCREEN_MASTER_CHANGE_EVENT = 'screen_master_change';
export const ACCESS_PROFILE_CHANGE_EVENT = 'access_profile_change';

export function loadScreenMaster(catalog: ScreenItem[]): ScreenItem[] {
  return catalog || [];
}

export function loadAccessProfiles(profiles?: any[]) {
  return profiles || [];
}

export function getAllowedScreenPaths({ screens }: { userId?: string, userRole?: string, screens: ScreenItem[], profiles?: any[] }): Set<string> {
  // Mock default allowed paths based on the catalog
  return new Set(screens.map((s) => s.screenPath));
}
