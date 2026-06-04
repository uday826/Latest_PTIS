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
  assetName: string;
  zone: string;
  wardNo: string;
  category: string;
  shopNo: string;
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
  assetName: string;
  shopNo: string;
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
