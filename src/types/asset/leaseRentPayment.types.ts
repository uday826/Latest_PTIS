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
  paymentFrequency?: string | null;
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
  financeYear?: number;
}

export interface LeaseRentPaymentHistoryItem {
  id: number;
  receiptNo: string;
  paymentDate: string;
  paidAmount: number;
  paymentMode: string;
  paymentType?: string;
  paymentStatus: string;
  financeYear?: number;
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

/**
 * A single allocation line within a LeaseRentBill request.
 * Maps to the backend BillPaymentAllocationDto.
 */
export interface BillPaymentAllocationDto {
  monthWiseDemandId: number;
  payAmount: number;
}

/**
 * Request payload for POST /api/LeaseRentBill/{leaseId}.
 * Matches the backend CreateBillPaymentDto structure.
 */
export interface LeaseRentBillRequest {
  paymentType: string;
  paymentMode: string;
  paymentDate: string;
  payerMobile?: string;
  payerEmail?: string;
  bankName?: string;
  branchName?: string;
  chequeOrTransactionNo?: string;
  chequeDate?: string | null;
  onlineTransactionId?: string;
  paymentGatewayName?: string;
  discountAmount?: number;
  adjustmentAmount?: number;
  remark?: string;
  customAmount?: number;
  allocations: BillPaymentAllocationDto[];
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

export interface LeaseRentDemandSummary {
  leaseRegistrationId: number;
  financeYear: number;
  totalRent: number;
  totalPenalty: number;
  totalGst: number;
  totalDemand: number;
  totalPaid: number;
  totalPending: number;
  demandCount: number;
  paidCount: number;
  partialCount: number;
  pendingCount: number;
}

/**
 * Represents a single Lease Rent Demand entry returned from the
 * GET /api/LeaseRentDemand/{leaseId} endpoint.
 *
 * The API exposes a master-table row containing the monthly rent,
 * penalty, GST and the computed total for each pending/current
 * period. The `month` field is the canonical key used both as the
 * period label and as the row identifier.
 */
export interface LeaseRentDemandItem extends Record<string, unknown> {
  id?: number | string;
  month: string;
  financeYear?: number | string | null;
  rent: number;
  penalty: number;
  gst: number;
  total: number;
  demandStatus?: string | null;
  paidAmount?: number | null;
  balanceAmount?: number | null;
  dueDate?: string | null;
  // Reserved for UI columns (e.g. checkbox) added by the consumer.
  select?: boolean;
}

export type LeaseRentDemandListResponse = LeaseRentDemandItem[];
