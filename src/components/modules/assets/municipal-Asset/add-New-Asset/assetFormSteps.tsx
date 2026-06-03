import {
  ClipboardList,
  Layers,
  ShieldCheck,
  Armchair,
  BadgeDollarSign,
} from "lucide-react";
import { AssetFormStepConfig } from "@/types/asset-types/basic-info/asset-wizard.types";

export const ALL_ASSET_FORM_STEPS: AssetFormStepConfig[] = [
  {
    id: 1,
    key: "basic-info",
    label: "Basic Info",
    icon: ClipboardList,
    path: "/asset/municipal-Asset/add-New-Asset/basic-Info",
  },
  {
    id: 2,
    key: "floor-details",
    label: "Floor Details",
    icon: Layers,
    path: "/asset/municipal-Asset/add-New-Asset/floor-details",
  },
  {
    id: 3,
    key: "legal-complience",
    label: "Legal, Safety & Compliance",
    icon: ShieldCheck,
    path: "/asset/municipal-Asset/add-New-Asset/legal-Complience",
  },
  {
    id: 4,
    key: "furniture-fixture",
    label: "Furniture & Fixtures Inventory",
    icon: Armchair,
    path: "/asset/municipal-Asset/add-New-Asset/furniture&Fixture",
  },
  {
    id: 5,
    key: "valuation",
    label: "Valuation",
    icon: BadgeDollarSign,
    path: "/asset/municipal-Asset/add-New-Asset/valuation",
  },
];
///Dynamic coming 
import { getAssetConfig } from "@/lib/constants/asset/constants";

export function getFilteredSteps(category: string, assetType: string = "", parentBuildingId: number | null = null): AssetFormStepConfig[] {
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
        path: "/asset/municipal-Asset/add-New-Asset/sub-units",
      },
    ];
  }

  let filtered = [...ALL_ASSET_FORM_STEPS];
  const config = getAssetConfig(category, assetType);
  const catKey = config?.categoryKey || category.toUpperCase();

  // 1. Static Category-based rules (Fuzzy match)
  if (catKey === "MOVABLE") {
    filtered = filtered.filter(step => step.key !== "legal-complience" && step.key !== "furniture-fixture" && step.key !== "floor-details");
  } else if (catKey === "LAND") {
    // Generously allow furniture-fixtures if assetType contains these keywords
    const typeLower = (assetType || "").toLowerCase();
    const isFurnitureAllowed = ["garden", "park", "playground", "reserved"].some(keyword => typeLower.includes(keyword));

    filtered = filtered.filter(step => {
      if (step.key === "floor-details") return false;
      if (step.key === "furniture-fixture" && !isFurnitureAllowed) return false;
      return true;
    });
  } else if (catKey === "INFRASTRUCTURE") {
    filtered = filtered.filter(step => step.key !== "furniture-fixture" && step.key !== "floor-details");
  }

  // 2. Dynamic Configuration-based rules (reserved for future use)

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
  parentBuildingId?: number | null
): AssetFormStepConfig | undefined {
  const cleanPath = normalizePath(pathname);
  const steps = category ? getFilteredSteps(category, assetType, parentBuildingId) : ALL_ASSET_FORM_STEPS;
  return steps.find((step) => cleanPath.startsWith(step.path));
}

export function getPreviousAssetStep(
  pathname: string,
  category?: string,
  assetType?: string,
  parentBuildingId?: number | null
): AssetFormStepConfig | undefined {
  const current = getCurrentAssetStep(pathname, category, assetType, parentBuildingId);
  if (!current) return undefined;

  const steps = category ? getFilteredSteps(category, assetType, parentBuildingId) : ALL_ASSET_FORM_STEPS;
  return steps.find((step) => step.id === current.id - 1);
}

export function getNextAssetStep(
  pathname: string,
  category?: string,
  assetType?: string,
  parentBuildingId?: number | null
): AssetFormStepConfig | undefined {
  const current = getCurrentAssetStep(pathname, category, assetType, parentBuildingId);
  if (!current) return undefined;

  const steps = category ? getFilteredSteps(category, assetType, parentBuildingId) : ALL_ASSET_FORM_STEPS;
  return steps.find((step) => step.id === current.id + 1);
}

