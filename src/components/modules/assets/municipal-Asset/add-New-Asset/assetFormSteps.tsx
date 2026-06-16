import { AssetFormStepConfig, CategoryFlags } from "@/types/asset-types/basic-info/asset-wizard.types";
import {
  Armchair,
  BadgeDollarSign,
  ClipboardList,
  Layers,
  ShieldCheck,
} from "lucide-react";
export type { CategoryFlags };

export const ALL_ASSET_FORM_STEPS: AssetFormStepConfig[] = [
  {
    id: 1,
    key: "basic-info",
    label: "Basic Info",
    icon: ClipboardList,
    path: "/assets/municipal-Asset/add-New-Asset/basic-Info",
  },
  {
    id: 2,
    key: "floor-details",
    label: "Floor Details",
    icon: Layers,
    path: "/assets/municipal-Asset/add-New-Asset/floor-details",
  },
  {
    id: 3,
    key: "legal-complience",
    label: "Legal, Safety & Compliance",
    icon: ShieldCheck,
    path: "/assets/municipal-Asset/add-New-Asset/legal-Complience",
  },
  {
    id: 4,
    key: "furniture-fixture",
    label: "Furniture & Fixtures Inventory",
    icon: Armchair,
    path: "/assets/municipal-Asset/add-New-Asset/furniture-fixture",
  },
  {
    id: 5,
    key: "valuation",
    label: "Valuation",
    icon: BadgeDollarSign,
    path: "/assets/municipal-Asset/add-New-Asset/valuation",
  },
];
///Dynamic coming 
import { getAssetConfig } from "@/lib/constants/asset/constants";

export function getFilteredSteps(category: string, assetType: string = "", parentBuildingId: number | null = null, flags?: CategoryFlags): AssetFormStepConfig[] {
  const isSubUnit = [
    "Flats (Residential)",
    "Shops (Commercial)",
    "Rooms (Mixed)",
    "Flat/Apartment",
    "Shop/Retail Unit",
    "Office Unit",
    "Room/Chamber",
    "Building Unit/Flat",
    "Residential Unit",
    "Commercial Unit"
  ].includes(assetType);

  // Standalone Sub-Unit Flow (Parent is selected)
  if (isSubUnit && parentBuildingId) {
    return [
      {
        id: 1,
        key: "standalone-sub-units" as any, // We will cast this
        label: "Sub-Units Generation",
        icon: Layers,
        path: "/assets/municipal-Asset/add-New-Asset/sub-units",
      },
    ];
  }

  let filtered = [...ALL_ASSET_FORM_STEPS];

  if (flags !== undefined) {
    // ── DB flags present: use them directly, NO string matching ──
    if (!flags.hasFloorDetails)    filtered = filtered.filter(s => s.key !== 'floor-details');
    if (!flags.hasInventory)       filtered = filtered.filter(s => s.key !== 'furniture-fixture');
    if (!flags.hasLegalCompliance) filtered = filtered.filter(s => s.key !== 'legal-complience');
    if (flags.isMovable)           filtered = filtered.filter(s => s.key !== 'furniture-fixture');
  } else {
    // ── Legacy fallback: no flags in URL (old links / edit flows) ──
    const config = getAssetConfig(category, assetType);
    const catKey = config?.categoryKey || category.toUpperCase();
    const isMovable = catKey === 'MOVABLE';

    if (isMovable) {
      filtered = filtered.filter(s => s.key !== 'legal-complience' && s.key !== 'floor-details' && s.key !== 'furniture-fixture');
    } else if (catKey === 'LAND') {
      const typeLower = (assetType || '').toLowerCase();
      const furnitureOk = ['garden', 'park', 'playground', 'reserved'].some(k => typeLower.includes(k));
      filtered = filtered.filter(s => {
        if (s.key === 'floor-details') return false;
        if (s.key === 'furniture-fixture' && !furnitureOk) return false;
        return true;
      });
    } else if (catKey === 'INFRASTRUCTURE') {
      filtered = filtered.filter(s => s.key !== 'furniture-fixture' && s.key !== 'floor-details');
    }
  }

  // Re-assign IDs to maintain sequential order for the stepper
  return filtered.map((step, index) => ({ ...step, id: index + 1 }));
}

export function normalizePath(pathname: string) {
  try {
    pathname = decodeURIComponent(pathname);
  } catch (e) {
    // ignore decode errors
  }
  return pathname.replace(/^\/(en|hi|mr)/, "");
}

export function getCurrentAssetStep(
  pathname: string,
  category?: string,
  assetType?: string,
  parentBuildingId?: number | null,
  flags?: CategoryFlags
): AssetFormStepConfig | undefined {
  const cleanPath = normalizePath(pathname);
  const steps = category ? getFilteredSteps(category, assetType, parentBuildingId, flags) : ALL_ASSET_FORM_STEPS;
  return steps.find((step) => cleanPath.startsWith(step.path));
}

export function getPreviousAssetStep(
  pathname: string,
  category?: string,
  assetType?: string,
  parentBuildingId?: number | null,
  flags?: CategoryFlags
): AssetFormStepConfig | undefined {
  const current = getCurrentAssetStep(pathname, category, assetType, parentBuildingId, flags);
  if (!current) return undefined;

  const steps = category ? getFilteredSteps(category, assetType, parentBuildingId, flags) : ALL_ASSET_FORM_STEPS;
  return steps.find((step) => step.id === current.id - 1);
}

export function getNextAssetStep(
  pathname: string,
  category?: string,
  assetType?: string,
  parentBuildingId?: number | null,
  flags?: CategoryFlags
): AssetFormStepConfig | undefined {
  const current = getCurrentAssetStep(pathname, category, assetType, parentBuildingId, flags);
  if (!current) return undefined;

  const steps = category ? getFilteredSteps(category, assetType, parentBuildingId, flags) : ALL_ASSET_FORM_STEPS;
  return steps.find((step) => step.id === current.id + 1);
}

