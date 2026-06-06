import 'server-only';

import { apiClient } from '@/services/api.service';
import type { PagedResponse } from '@/types/common.types';

export interface LeaseRentRegistrationStats {
  totalApproved: number;
  totalVerified: number;
  verificationPending: number;
  approvalPending: number;
  totalRejected: number;
}

export interface LeaseRentRegistrationListItem {
  assetId: number;
  assetName?: string | null;
  assetNo?: string | null;
  category?: string | null;
  zone?: string | null;
  wardNo?: string | null;
  shopNo?: string | null;
  floor?: string | null;
  shopName?: string | null;
  tenantName?: string | null;
  tenantMobile?: string | null;
  tenantEmail?: string | null;
  tenantType?: string | null;
  tenantAadhaarNo?: string | null;
  tenantPanCardNo?: string | null;
  tenantAddress?: string | null;
  previousTenantName?: string | null;
  previousTenantMobile?: string | null;
  applicationType?: string | null;
  leaseType?: string | null;
  oldLeaseStartDate?: string | null;
  oldLeaseEndDate?: string | null;
  leaseStartDate?: string | null;
  leaseEndDate?: string | null;
  terminationDate?: string | null;
  previousMonthlyRent?: number | null;
  monthlyRent?: number | null;
  yearlyRent?: number | null;
  securityDeposit?: number | null;
  paymentFrequency?: string | null;
  reason?: string | null;
  workflowStatus?: string | null;
  rejectionReason?: string | null;
  rentStatus?: string | null;
  id: number;
  isActive?: boolean;
  createdDate?: string | null;
  updatedDate?: string | null;
}

type LeaseRentRegistrationStatsResponse = {
  success: boolean;
  message: string;
  items?: LeaseRentRegistrationStats | null;
  errors: string[] | null;
  correlationId: string | null;
};

export interface LeaseRentRegistrationListParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  workflowStatus?: string;
  assetCategoryId?: number;
  zoneId?: number;
  wardId?: number;
  assetId?: number;
}

function buildLeaseRentRegistrationQuery(params: LeaseRentRegistrationListParams = {}): string {
  const query = new URLSearchParams();

  query.set('PageNumber', String(params.pageNumber ?? 1));
  query.set('PageSize', String(params.pageSize ?? 10));

  if (params.searchTerm?.trim()) query.set('SearchTerm', params.searchTerm.trim());
  if (params.workflowStatus?.trim()) query.set('WorkflowStatus', params.workflowStatus.trim());
  if (params.assetCategoryId != null) query.set('AssetCategoryId', String(params.assetCategoryId));
  if (params.zoneId != null) query.set('ZoneId', String(params.zoneId));
  if (params.wardId != null) query.set('WardId', String(params.wardId));
  if (params.assetId != null) query.set('AssetId', String(params.assetId));

  return query.toString();
}

export async function getLeaseRentRegistrationStats(): Promise<LeaseRentRegistrationStats> {
  const response = await apiClient.get<LeaseRentRegistrationStatsResponse>(
    '/LeaseRentRegistration/stats'
  );

  if (!response.success || !response.data?.items) {
    return {
      totalApproved: 0,
      totalVerified: 0,
      verificationPending: 0,
      approvalPending: 0,
      totalRejected: 0,
    };
  }

  return response.data.items;
}

export async function getLeaseRentRegistrationList(
  params: LeaseRentRegistrationListParams = {}
): Promise<PagedResponse<LeaseRentRegistrationListItem>> {
  const query = buildLeaseRentRegistrationQuery(params);
  const response = await apiClient.get<PagedResponse<LeaseRentRegistrationListItem>>(
    query ? `/LeaseRentRegistration?${query}` : '/LeaseRentRegistration'
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

export async function getLeaseRentRegistrationById(
  id: number
): Promise<LeaseRentRegistrationListItem | null> {
  const response = await apiClient.get<LeaseRentRegistrationListItem>(`/LeaseRentRegistration/${id}`);

  if (!response.success || !response.data) {
    return null;
  }

  return response.data;
}

export interface CreateLeaseRentRegistrationPayload {
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

export interface CreateLeaseRentRegistrationResponse {
  success: boolean;
  message: string;
  items: LeaseRentRegistrationListItem | null;
  errors: string[] | null;
  correlationId: string | null;
}

export async function createLeaseRentRegistration(
  payload: CreateLeaseRentRegistrationPayload
): Promise<CreateLeaseRentRegistrationResponse> {
  const response = await apiClient.post<CreateLeaseRentRegistrationResponse>(
    '/LeaseRentRegistration',
    payload
  );

  if (!response.success || !response.data) {
    return {
      success: false,
      message: response.error || 'Failed to create registration',
      items: null,
      errors: response.error ? [response.error] : null,
      correlationId: null,
    };
  }

  return response.data;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  items: LeaseRentRegistrationListItem | null;
  errors: string[] | null;
  correlationId: string | null;
}

export async function verifyLeaseRentRegistration(id: number): Promise<ActionResponse> {
  const response = await apiClient.post<ActionResponse>(`/LeaseRentRegistration/${id}/verify`, {});
  if (!response.success || !response.data) {
    return {
      success: false,
      message: response.error || 'Failed to verify registration',
      items: null,
      errors: response.error ? [response.error] : null,
      correlationId: null,
    };
  }
  return response.data;
}

export async function approveLeaseRentRegistration(id: number): Promise<ActionResponse> {
  const response = await apiClient.post<ActionResponse>(`/LeaseRentRegistration/${id}/approve`, {});
  if (!response.success || !response.data) {
    return {
      success: false,
      message: response.error || 'Failed to approve registration',
      items: null,
      errors: response.error ? [response.error] : null,
      correlationId: null,
    };
  }
  return response.data;
}

export async function rejectLeaseRentRegistration(id: number, rejectionReason?: string): Promise<ActionResponse> {
  const response = await apiClient.post<ActionResponse>(`/LeaseRentRegistration/${id}/reject`, {
    rejectionReason: rejectionReason || 'Reverted by authority'
  });
  if (!response.success || !response.data) {
    return {
      success: false,
      message: response.error || 'Failed to reject registration',
      items: null,
      errors: response.error ? [response.error] : null,
      correlationId: null,
    };
  }
  return response.data;
}

export async function revertToRegistration(id: number): Promise<ActionResponse> {
  const response = await apiClient.post<ActionResponse>(`/LeaseRentRegistration/${id}/revert-to-registration`, {});
  if (!response.success || !response.data) {
    return {
      success: false,
      message: response.error || 'Failed to revert to registration',
      items: null,
      errors: response.error ? [response.error] : null,
      correlationId: null,
    };
  }
  return response.data;
}

export async function revertToVerification(id: number): Promise<ActionResponse> {
  const response = await apiClient.post<ActionResponse>(`/LeaseRentRegistration/${id}/revert-to-verification`, {});
  if (!response.success || !response.data) {
    return {
      success: false,
      message: response.error || 'Failed to revert to verification',
      items: null,
      errors: response.error ? [response.error] : null,
      correlationId: null,
    };
  }
  return response.data;
}
