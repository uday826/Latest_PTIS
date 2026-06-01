import { AssetCategory } from "../asset/valuation.types";

/**
 * Types representing asset register valuation properties
 */
export interface FloorValuationDetail {
  id: number;
  floorName: string;
  builtUpAreaSqFt: number;
  capitalValue: number;
  marketValue: number;
}

export interface InventoryValuationDetail {
  category: string;
  totalQuantity: number;
  totalPurchaseValue: number;
  totalCapitalValue: number;
}

export interface FullAssetValuationDetails {
  assetId: number;
  assetNo: string;
  assetName: string;
  category: AssetCategory;
  landArea?: number;
  landRate?: number;
  developmentCost?: number;
  marketAppreciation?: number;
  marketValue?: number;
  capitalValue?: number;
  floors: FloorValuationDetail[];
  inventories: InventoryValuationDetail[];
}
