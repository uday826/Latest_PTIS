import { apiClient } from '@/services/api.service';
import type { ApiResponse } from '@/types/common.types';
import type {
  LeaseRentPaymentDetail,
  LeaseRentPaymentHistoryResponse,
  LeaseRentPaymentListResponse,
  LeaseRentPaymentQueryParams,
} from '@/types/asset/leaseRentPayment.types';

function buildLeaseRentPaymentQuery(params: LeaseRentPaymentQueryParams = {}): string {
  const query = new URLSearchParams();

  query.set('PageNumber', String(params.pageNumber ?? 1));
  query.set('PageSize', String(params.pageSize ?? 10));

  if (params.assetId != null) query.set('AssetId', String(params.assetId));
  if (params.zoneId != null) query.set('ZoneId', String(params.zoneId));
  if (params.wardId != null) query.set('WardId', String(params.wardId));
  if (params.assetCategoryId != null) query.set('AssetCategoryId', String(params.assetCategoryId));
  if (params.leaseType?.trim()) query.set('LeaseType', params.leaseType.trim());
  if (params.paymentStatus?.trim()) query.set('PaymentStatus', params.paymentStatus.trim());
  if (params.searchTerm?.trim()) query.set('SearchTerm', params.searchTerm.trim());

  return query.toString();
}

export const leaseRentPaymentService = {
  getLeaseRentPayments: async (
    params: LeaseRentPaymentQueryParams = {}
  ): Promise<ApiResponse<LeaseRentPaymentListResponse>> => {
    const queryString = buildLeaseRentPaymentQuery(params);
    return apiClient.get<LeaseRentPaymentListResponse>(
      queryString ? `/LeaseRentPayment?${queryString}` : '/LeaseRentPayment'
    );
  },

  getLeaseRentPaymentById: async (
    leaseId: number | string
  ): Promise<ApiResponse<LeaseRentPaymentDetail>> => {
    return apiClient.get<LeaseRentPaymentDetail>(
      `/LeaseRentPayment/${encodeURIComponent(String(leaseId))}`
    );
  },

  getLeaseRentPaymentHistory: async (
    leaseId: number | string
  ): Promise<ApiResponse<LeaseRentPaymentHistoryResponse>> => {
    return apiClient.get<LeaseRentPaymentHistoryResponse>(
      `/LeaseRentPayment/${encodeURIComponent(String(leaseId))}/history`
    );
  },
};
