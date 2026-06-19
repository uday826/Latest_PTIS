import { apiClient } from '@/services/api.service';
import type { ApiResponse } from '@/types/common.types';
import type {
  AssetMasterPaymentDetail,
  LeaseRentPaymentDetail,
  LeaseRentPaymentHistoryResponse,
  LeaseRentPaymentListResponse,
  LeaseRentPaymentQueryParams,
  ProcessLeaseRentPaymentRequest,
  LeaseRentBillRequest,
  LeaseRentDemandSummary,
  LeaseRentDemandItem,
  LeaseRentDemandListResponse,
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
      `/LeaseRentBill/${encodeURIComponent(String(leaseId))}`
    );
  },

  getAssetById: async (
    assetId: number | string
  ): Promise<ApiResponse<AssetMasterPaymentDetail>> => {
    return apiClient.get<AssetMasterPaymentDetail>(
      `/AssetMaster/${encodeURIComponent(String(assetId))}`
    );
  },

  processLeaseRentPayment: async (
    leaseId: number | string,
    payload: ProcessLeaseRentPaymentRequest
  ): Promise<ApiResponse<unknown>> => {
    return apiClient.post<unknown>(
      `/LeaseRentPayment/${encodeURIComponent(String(leaseId))}/process`,
      payload
    );
  },

  getLeaseRentDemandSummary: async (
    leaseId: number | string,
    financeYear?: number | string | null
  ): Promise<ApiResponse<LeaseRentDemandSummary>> => {
    const query = financeYear ? `?financeYear=${encodeURIComponent(String(financeYear))}` : '';
    return apiClient.get<LeaseRentDemandSummary>(
      `/LeaseRentDemand/${encodeURIComponent(String(leaseId))}/summary${query}`
    );
  },

  /**
   * GET /api/LeaseRentDemand/{leaseId}
   * Returns the list of demand rows for the given lease id. Each row contains
   * the period (month), rent, penalty, gst and the computed total. The shape
   * is used by the Make Payment period drawer to render a master table and
   * allow multi-period selection.
   */
  getLeaseRentDemands: async (
    leaseId: number | string,
    financeYear?: number | string
  ): Promise<ApiResponse<LeaseRentDemandListResponse>> => {
    const query = new URLSearchParams();
    if (financeYear != null && financeYear !== '') {
      query.set('financeYear', String(financeYear));
    }
    const queryString = query.toString();
    return apiClient.get<LeaseRentDemandListResponse>(
      `/LeaseRentDemand/${encodeURIComponent(String(leaseId))}${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * POST /api/LeaseRentDemand/{leaseId}
   * Persists a Lease Rent Demand record on the backend.
   * Used to create / update a demand row keyed by month.
   */
  saveLeaseRentDemand: async (
    leaseId: number | string,
    payload: Partial<LeaseRentDemandItem>
  ): Promise<ApiResponse<LeaseRentDemandItem>> => {
    return apiClient.post<LeaseRentDemandItem>(
      `/LeaseRentDemand/${encodeURIComponent(String(leaseId))}`,
      payload
    );
  },

  /**
   * POST /api/LeaseRentBill/{leaseId}
   * Creates a lease rent bill / processes a payment for the given lease.
   * Used by the "Pay Now" flow in the Make Payment screen.
   */
  createLeaseRentBill: async (
    leaseId: number | string,
    payload: LeaseRentBillRequest
  ): Promise<ApiResponse<unknown>> => {
    return apiClient.post<unknown>(
      `/LeaseRentBill/${encodeURIComponent(String(leaseId))}`,
      payload
    );
  },
};
