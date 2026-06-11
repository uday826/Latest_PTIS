import type { PagedResponse } from '@/types/common.types';

export interface LeaseRentPaymentQueryParams {
  assetId?: number | null;
  zoneId?: number | null;
  wardId?: number | null;
  assetCategoryId?: number | null;
  leaseType?: string;
  paymentStatus?: string;
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}

export interface LeaseRentPaymentListItem {
  leaseRentRegistrationId: number;
  grievanceNo: string;
  assetId: number;
  assetNo: string;
  assetName: string;
  zone: string;
  wardNo: string;
  category: string;
  shopNo: string;
  shopName: string;
  tenantName: string;
  tenantMobile: string;
  leaseType: string;
  rentDue: number;
  status: string;
}

export type LeaseRentPaymentListResponse = PagedResponse<LeaseRentPaymentListItem>;

export interface LeaseRentPaymentDetail {
  leaseRentRegistrationId: number;
  grievanceNo: string;
  assetId: number;
  assetNo?: string | null;
  assetName: string;
  zone?: string | null;
  wardNo?: string | null;
  category?: string | null;
  shopNo: string;
  shopName?: string | null;
  tenantName: string;
  tenantMobile: string;
  tenantEmail: string;
  leaseType: string;
  monthlyRent: number;
  pendingDue: number;
  currentDemand: number;
  penalty: number;
  gst: number;
  totalPayable: number;
}

export interface LeaseRentPaymentHistoryItem {
  id: number;
  receiptNo: string;
  paymentDate: string;
  paidAmount: number;
  paymentMode: string;
  paymentType: string;
  paymentStatus: string;
}

export interface LeaseRentPaymentHistoryResponse {
  success: boolean;
  message: string;
  items: LeaseRentPaymentHistoryItem[];
  errors: string[] | null;
  correlationId: string | null;
}

export interface ProcessLeaseRentPaymentRequest {
  mobile: string;
  email: string;
  paymentMode: string;
  paymentType: string;
  amount: number;
  penaltyAmount: number;
  gstAmount: number;
  transactionId: string;
}

export interface AssetMasterPaymentDetail {
  id: number;
  isActive: boolean;
  createdDate: string | null;
  updatedDate: string | null;
  assetNo: string;
  assetName: string;
  assetCategoryId: number;
  assetTypeId: number;
  parentAssetId: number | null;
  address: string | null;
  wardId: number | null;
  zoneId: number | null;
  subZoneId: number | null;
  moujaId: number | null;
  builtUpAreaSqMeter: number | null;
  carpetAreaSqMeter: number | null;
  landAreaSqMeter: number | null;
  status: string | null;
  occupancyStatus: string | null;
  isRevenueGenerating: boolean | null;
  floorDetailsId: number | null;
  assetCategoryName: string | null;
  assetTypeName: string | null;
  parentAssetName: string | null;
  zoneName: string | null;
  wardName: string | null;
  moujaName: string | null;
  typeOfUseName: string | null;
  subTypeOfUseName: string | null;
}
