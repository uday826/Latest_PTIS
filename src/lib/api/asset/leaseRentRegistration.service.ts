
import { apiClient } from '@/services/api.service';
import type { PagedResponse } from '@/types/common.types';
import type {
  LeaseRentRegistrationStats,
  LeaseRentRegistrationListItem,
  LeaseRentRegistrationListParams,
  CreateLeaseRentRegistrationPayload,
  CreateLeaseRentRegistrationResponse,
  ActionResponse,
} from '@/types/asset-types/lease-rent.types';

type LeaseRentRegistrationStatsResponse = {
  success: boolean;
  message: string;
  items?: LeaseRentRegistrationStats | null;
  errors: string[] | null;
  correlationId: string | null;
};


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
    throw new Error(response.error || 'Failed to fetch lease rent registration list');
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

