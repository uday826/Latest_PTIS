import React from "react";
import { Armchair, Car, Cpu, LampDesk, Option } from "lucide-react";

export type InventoryType =
  | "furniture"
  | "it-equipment"
  | "electronic-fixtures"
  | "vehicle";

export type InventoryInvoice = {
  invoiceMode: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceFileName: string;
};

export type IndividualAssetUnit = {
  assetId: number;
  assetNo: string;
  assetName: string;
  unitNumber: number;
  unitPurchaseValue: number;
  unitCapitalValue: number;
  ageInYears: number;
  depreciationRate: number;
  conditionFactor: number;
  cvFormula: string;
  condition: string;
  serialNumber?: string;
  assetTag?: string;
  dynamicAttributes?: Record<string, string>;
};

export type InventoryRow = {
  id: number;
  type: InventoryType;
  photoUrl?: string;
  photoName?: string;
  itemName: string;
  modelName: string;
  specifications: string;
  purchaseDate: string;
  condition: string;
  quantity: number;
  unitValue: number;
  total: number;
  owningDepartment?: string;
  invoice?: InventoryInvoice | null;
  unitDynamicAttributes?: Record<string, string>[];

  unitCV?: number;
  totalCV?: number;
  depreciationRate?: number;
  conditionFactor?: number;
  ageInYears?: number;
  cvFormula?: string;

  batchId?: number;
  isRegistered?: boolean;
  registeredUnits?: IndividualAssetUnit[];
};

export type InventoryCategoryGroup = {
  inventoryType: InventoryType;
  label: string;
  totalBatches: number;
  totalUnits: number;
  totalPurchaseValue: number;
  totalCapitalValue: number;
  totalDepreciation: number;
  depreciationPercent: number;
  batches: InventoryRow[];
};

export type InventoryTableRow = InventoryRow & { srNo: number };

export type InventoryForm = {
  type: InventoryType | "";
  itemName: string;
  modelName: string;
  specifications: string;
  purchaseDate: string;
  condition: string;
  quantity: string;
  unitValue: string;
  photoName: string;
  photoUrl: string;
  owningDepartment: string;
  unitDynamicAttributes?: Record<string, string>[];
};

export type InvoiceForm = {
  invoiceMode: string;
  existingInvoiceKey: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceFileName: string;
};

export type TypeMeta = {
  label: string;
  icon: any;
  cardRing: string;
  badgeClassName: string;
  names: any[];
  modelMap: Record<string, any[]>;
};
