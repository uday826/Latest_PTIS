import 'server-only';

import { apiClient } from '@/services/api.service';
import type { PagedResponse } from '@/types/common.types';

export interface AssetLeaseRentDetailsListItem {
  parentAssetId: number;
  assetId: number;
  assetNo?: string | null;
  assetName?: string | null;
  category?: string | null;
  assetCategory?: string | null;
  assetCategoryName?: string | null;
  zone?: string | null;
  wardNo?: string | null;
  floorDetailsId?: number | null;
  roomWiseSubmissionDetailsId?: number | null;
  floorId?: number | null;
  floorDescription?: string | null;
  shopNo?: string | null;
  shopName?: string | null;
  tenantName?: string | null;
  tenantMobile?: string | null;
  tenantEmail?: string | null;
  tenantType?: string | null;
  tenantAadhaarNo?: string | null;
  tenantPanCardNo?: string | null;
  tenantAddress?: string | null;
  gstNo?: string | null;
  previousTenantName?: string | null;
  previousTenantMobile?: string | null;
  totalAreaSqFt?: number | null;
  applicationTypeId?: number | null;
  applicationTypeName?: string | null;
  leaseType?: string | null;
  leaseRentType?: string | null;
  oldLeaseStartDate?: string | null;
  oldLeaseEndDate?: string | null;
  leaseStartDate?: string | null;
  leaseEndDate?: string | null;
  terminationDate?: string | null;
  duration?: number | null;
  previousMonthlyRent?: number | null;
  monthlyRent?: number | null;
  rentAmount?: number | null;
  securityDeposit?: number | null;
  depositType?: string | null;
  paymentFrequency?: string | null;
  agreementId?: string | null;
  incrementFrequency?: string | null;
  incrementType?: string | null;
  incrementValue?: number | null;
  incrementMethod?: string | null;
  durationFrom?: string | null;
  durationTo?: string | null;
  increment?: string | null;
  incrementStatus?: boolean | null;
  rentMonthly?: number | null;
  reason?: string | null;
  workflowStatus?: string | null;
  rejectionReason?: string | null;
  isRejection?: boolean;
  rejectionBy?: number | null;
  rejectionDate?: string | null;
  isVerified?: boolean;
  verifiedBy?: number | null;
  verifiedDate?: string | null;
  isApproved?: boolean;
  approvedBy?: number | null;
  approvedDate?: string | null;
  rentStatus?: string | null;
  paymentStatus?: string | null;
  leaseDurationDisplay?: string | null;
  rentAmountDisplay?: string | null;
  id: number;
  isActive?: boolean;
  createdDate?: string | null;
  updatedDate?: string | null;
}

export interface AssetLeaseRentDetailsListParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  workflowStatus?: string;
  paymentStatus?: string;
  assetCategoryId?: number;
  zoneId?: number;
  wardId?: number;
  assetId?: number;
}

function buildAssetLeaseRentDetailsQuery(params: AssetLeaseRentDetailsListParams = {}): string {
  const query = new URLSearchParams();

  query.set('PageNumber', String(params.pageNumber ?? 1));
  query.set('PageSize', String(params.pageSize ?? 10));

  if (params.searchTerm?.trim()) query.set('SearchTerm', params.searchTerm.trim());
  if (params.workflowStatus?.trim()) query.set('WorkflowStatus', params.workflowStatus.trim());
  if (params.paymentStatus?.trim()) query.set('PaymentStatus', params.paymentStatus.trim());
  if (params.assetCategoryId != null) query.set('AssetCategoryId', String(params.assetCategoryId));
  if (params.zoneId != null) query.set('ZoneId', String(params.zoneId));
  if (params.wardId != null) query.set('WardId', String(params.wardId));
  if (params.assetId != null) query.set('AssetId', String(params.assetId));

  return query.toString();
}

export async function getAssetLeaseRentDetailsList(
  params: AssetLeaseRentDetailsListParams = {}
): Promise<PagedResponse<AssetLeaseRentDetailsListItem>> {
  const query = buildAssetLeaseRentDetailsQuery(params);
  const response = await apiClient.get<PagedResponse<AssetLeaseRentDetailsListItem>>(
    query ? `/AssetLeaseRentDetails?${query}` : '/AssetLeaseRentDetails'
  );

  if (!response.success || !response.data) {
    return {
      items: [],
      totalCount: 0,
      pageNumber: params.pageNumber ?? 1,
      pageSize: params.pageSize ?? 10,
      totalPages: 0,
      hasPrevious: false,
      hasNext: false,
    };
  }

  return response.data;
}

export async function getAssetLeaseRentDetailsById(
  id: number
): Promise<AssetLeaseRentDetailsListItem | null> {
  const response = await apiClient.get<AssetLeaseRentDetailsListItem>(`/AssetLeaseRentDetails/${id}`);

  if (!response.success || !response.data) {
    return null;
  }

  return response.data;
}

export interface AssetLeaseRentDetailsUpdatePayload extends Partial<Omit<AssetLeaseRentDetailsListItem, 'id'>> {
  id: number;
}

export interface AssetLeaseRentDetailsMutationResponse {
  success: boolean;
  message: string;
  items: AssetLeaseRentDetailsListItem | null;
  errors: string[] | null;
  correlationId: string | null;
}

export async function updateAssetLeaseRentDetails(
  id: number,
  payload: AssetLeaseRentDetailsUpdatePayload
): Promise<AssetLeaseRentDetailsMutationResponse> {
  const response = await apiClient.put<AssetLeaseRentDetailsMutationResponse>(
    `/AssetLeaseRentDetails/${id}`,
    payload
  );

  if (!response.success || !response.data) {
    return {
      success: false,
      message: response.error || 'Failed to update asset lease rent details',
      items: null,
      errors: response.error ? [response.error] : null,
      correlationId: null,
    };
  }

  return response.data;
}

export async function sendToVerification(
  id: number,
  remarks?: string
): Promise<AssetLeaseRentDetailsMutationResponse> {
  const response = await apiClient.post<AssetLeaseRentDetailsMutationResponse>(
    `/AssetLeaseRentDetails/${id}/send-to-verification`,
    { remarks }
  );
  return response.success && response.data
    ? response.data
    : { success: false, message: response.error || 'Failed to send to verification', items: null, errors: null, correlationId: null };
}

export async function sendForVerification(
  id: number,
  payload: AssetLeaseRentDetailsUpdatePayload
): Promise<AssetLeaseRentDetailsMutationResponse> {
  const response = await apiClient.put<AssetLeaseRentDetailsMutationResponse>(
    `/AssetLeaseRentDetails/${id}/send-for-verification`,
    payload
  );

  if (!response.success || !response.data) {
    return {
      success: false,
      message: response.error || 'Failed to send for verification',
      items: null,
      errors: response.error ? [response.error] : null,
      correlationId: null,
    };
  }

  return response.data;
}

export async function verifyLeaseRent(
  id: number,
  remarks?: string
): Promise<AssetLeaseRentDetailsMutationResponse> {
  const response = await apiClient.post<AssetLeaseRentDetailsMutationResponse>(
    `/AssetLeaseRentDetails/${id}/verify`,
    { remarks }
  );
  return response.success && response.data
    ? response.data
    : { success: false, message: response.error || 'Failed to verify lease rent', items: null, errors: null, correlationId: null };
}

export async function approveLeaseRent(
  id: number,
  remarks?: string
): Promise<AssetLeaseRentDetailsMutationResponse> {
  const response = await apiClient.post<AssetLeaseRentDetailsMutationResponse>(
    `/AssetLeaseRentDetails/${id}/approve`,
    { remarks }
  );
  return response.success && response.data
    ? response.data
    : { success: false, message: response.error || 'Failed to approve lease rent', items: null, errors: null, correlationId: null };
}

export async function rejectLeaseRent(
  id: number,
  reason: string
): Promise<AssetLeaseRentDetailsMutationResponse> {
  const response = await apiClient.post<AssetLeaseRentDetailsMutationResponse>(
    `/AssetLeaseRentDetails/${id}/reject`,
    { reason }
  );
  return response.success && response.data
    ? response.data
    : { success: false, message: response.error || 'Failed to reject lease rent', items: null, errors: null, correlationId: null };
}

export async function revertToRegistration(
  id: number,
  remarks?: string
): Promise<AssetLeaseRentDetailsMutationResponse> {
  const response = await apiClient.post<AssetLeaseRentDetailsMutationResponse>(
    `/AssetLeaseRentDetails/${id}/revert-to-registration`,
    { remarks }
  );
  return response.success && response.data
    ? response.data
    : { success: false, message: response.error || 'Failed to revert to registration', items: null, errors: null, correlationId: null };
}

export async function revertToVerification(
  id: number,
  remarks?: string
): Promise<AssetLeaseRentDetailsMutationResponse> {
  const response = await apiClient.post<AssetLeaseRentDetailsMutationResponse>(
    `/AssetLeaseRentDetails/${id}/revert-to-verification`,
    { remarks }
  );
  return response.success && response.data
    ? response.data
    : { success: false, message: response.error || 'Failed to revert to verification', items: null, errors: null, correlationId: null };
}

export interface PreviousTenantHistoryItem {
  id: number;
  actionType: string;
  actionLabel: string;
  performedDate: string;
  fromStatus: string;
  toStatus: string;
  remarks: string | null;
  tenantName: string;
  tenantMobile: string;
  tenantEmail: string | null;
  tenantType: string;
  tenantAadhaarNo: string;
  tenantPanCardNo: string;
  tenantAddress: string;
  previousTenantName: string | null;
  previousTenantMobile: string | null;
  leaseType: string;
  shopNo: string;
  floor: string | null;
  shopName: string;
  oldLeaseStartDate: string | null;
  oldLeaseEndDate: string | null;
  leaseStartDate: string;
  leaseEndDate: string;
  terminationDate: string | null;
  previousMonthlyRent: number | null;
  monthlyRent: number;
  securityDeposit: number;
  paymentFrequency: string;
  workflowStatus: string;
  rentStatus: string;
}

export async function getPreviousTenantHistory(
  id: number
): Promise<PreviousTenantHistoryItem[]> {
  const response = await apiClient.get<{ items: PreviousTenantHistoryItem[] }>(
    `/AssetLeaseRentDetails/${id}/previous-tenant-history`
  );
  return response.success && response.data?.items ? response.data.items : [];
}

export interface CreateAssetLeaseRentDetailsPayload {
  isActive: boolean;
  createdBy: number;
  assetId: number;
  shopNo?: string | null;
  floorId?: number | null;
  shopName?: string | null;
  tenantName: string;
  tenantMobile?: string | null;
  tenantEmail?: string | null;
  tenantType?: string | null;
  tenantAadhaarNo?: string | null;
  tenantPanCardNo?: string | null;
  tenantAddress?: string | null;
  previousTenantName?: string | null;
  previousTenantMobile?: string | null;
  applicationTypeId: number;
  leaseType?: string | null;
  oldLeaseStartDate?: string | null;
  oldLeaseEndDate?: string | null;
  leaseStartDate?: string | null;
  leaseEndDate?: string | null;
  terminationDate?: string | null;
  previousMonthlyRent?: number | null;
  monthlyRent?: number | null;
  securityDeposit?: number | null;
  paymentFrequency?: string | null;
  reason?: string | null;
}

export async function createAssetLeaseRentDetails(
  payload: CreateAssetLeaseRentDetailsPayload
): Promise<AssetLeaseRentDetailsMutationResponse> {
  const response = await apiClient.post<AssetLeaseRentDetailsMutationResponse>(
    '/AssetLeaseRentDetails',
    payload
  );

  if (!response.success || !response.data) {
    return {
      success: false,
      message: response.error || 'Failed to create asset lease rent details',
      items: null,
      errors: response.error ? [response.error] : null,
      correlationId: null,
    };
  }

  return response.data;
}
