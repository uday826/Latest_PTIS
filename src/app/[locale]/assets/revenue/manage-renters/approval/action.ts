'use server';

import { revalidatePath } from 'next/cache';
import { apiClient } from '@/services/api.service';
import { assetMasterService } from '@/lib/api/asset/asset-master.service';
import { getAssetCategories } from '@/lib/api/asset/revenue-masters.service';
import { categoryTypeService } from '@/lib/api/asset/category-type.service';
import { getLeaseRentDetailsDocuments } from '@/lib/api/asset/asset-lease-rent-details-document.server.service';
import { SEARCH_KEY_REGEX } from '@/lib/utils/validation-rules';
import {
  getAssetLeaseRentDetailsList,
  getAssetLeaseRentDetailsById,
  approveLeaseRent,
  rejectLeaseRent,
  revertToVerification,
  getPreviousTenantHistory,
} from '@/lib/api/asset/asset-lease-rent-details.service';
import type {
  AssetLeaseRentDetailsListItem,
  AssetLeaseRentDetailsListParams,
} from '@/types/asset-types/lease-rent.types';
import type {
  ManageRentersApprovalPageData,
  ApprovalRecord,
} from '@/types/asset/revenue.types';



export async function getManageRentersApprovalPageDataAction(
  query: Record<string, string | string[] | undefined>
): Promise<ManageRentersApprovalPageData> {
  const params = baseLeaseRentQuery(query, 'verified');
  const selectedCategoryId = parseOptionalNumber(query.assetCategoryId);
  const [list, categories, types] = await Promise.all([
    getAssetLeaseRentDetailsList(params),
    getAssetCategories(),
    selectedCategoryId
      ? categoryTypeService.getTypesByCategory(selectedCategoryId)
      : categoryTypeService.getAllTypes(),
  ]);

  const typesData = types.success && types.data ? types.data : [];

  return {
    records: list.items.map(toApprovalRecord),
    pageNumber: list.pageNumber,
    pageSize: list.pageSize,
    totalCount: list.totalCount,
    totalPages: list.totalPages,
    searchTerm: query.searchTerm ? (Array.isArray(query.searchTerm) ? query.searchTerm[0] : query.searchTerm) : '',
    assetCategoryId: selectedCategoryId,
    assetTypeId: parseOptionalNumber(query.assetTypeId),
    fromDate: query.fromDate ? (Array.isArray(query.fromDate) ? query.fromDate[0] : query.fromDate) : '',
    toDate: query.toDate ? (Array.isArray(query.toDate) ? query.toDate[0] : query.toDate) : '',
    categoryOptions: categories.map((category) => ({
      label: category.categoryName,
      value: String(category.id),
    })),
    assetTypeOptions: typesData.map((t) => ({
      label: t.typeName || t.assetTypeName || `Type ${t.id}`,
      value: String(t.id),
    })),
  };
}

export async function getManageRentersVerificationDetailsAction(id: number | string) {
  const parsedId = Number(id);
  if (!Number.isFinite(parsedId) || parsedId <= 0) return null;

  return await getAssetLeaseRentDetailsById(parsedId);
}

export async function getManageRentersAssetDetailsAction(assetId: number | string) {
  const parsedId = Number(assetId);
  if (!Number.isFinite(parsedId) || parsedId <= 0) return null;

  const response = await assetMasterService.getAssetById(parsedId);
  return response.success ? response.data ?? null : null;
}

export async function approveAction(id: number, remarks?: string) {
  const res = await approveLeaseRent(id, remarks);
  if (res.success) {
    try {
      const currentYear = new Date().getFullYear();
      await apiClient.post(`/LeaseRentDemand/${id}`, { financeYear: currentYear });
    } catch (err) {
      console.error('Failed to generate LeaseRentDemand:', err);
    }
  }
  revalidatePath('/[locale]/assets/revenue/manage-renters', 'layout');
  revalidatePath('/assets/revenue/manage-renters');
  return res;
}

export async function rejectAction(id: number, reason: string) {
  const res = await rejectLeaseRent(id, reason);
  revalidatePath('/[locale]/assets/revenue/manage-renters', 'layout');
  revalidatePath('/assets/revenue/manage-renters');
  return res;
}

export async function revertToVerificationAction(id: number, remarks?: string) {
  const res = await revertToVerification(id, remarks);
  revalidatePath('/[locale]/assets/revenue/manage-renters', 'layout');
  revalidatePath('/assets/revenue/manage-renters');
  return res;
}

export async function getPreviousTenantHistoryAction(id: number) {
  return getPreviousTenantHistory(id);
}

export async function getLeaseRentDetailsDocumentsAction(leaseRentDetailsId: number) {
  return getLeaseRentDetailsDocuments(leaseRentDetailsId);
}

// ─── Local Mappers & Query Helpers ───────────────────────────────────────────

function firstQueryValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function parsePositiveNumber(value: string | string[] | undefined, fallback: number): number {
  const parsed = Number(firstQueryValue(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseOptionalNumber(value: string | string[] | undefined): number | null {
  const raw = firstQueryValue(value).trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function normalizeDateQuery(value: string | string[] | undefined): string | undefined {
  const raw = firstQueryValue(value).trim();
  if (!raw) return undefined;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

function sanitizeSearchTerm(value: string | string[] | undefined): string | undefined {
  const sanitized = firstQueryValue(value)
    .trim()
    .split('')
    .filter((char) => SEARCH_KEY_REGEX.test(char))
    .join('')
    .slice(0, 200);

  return sanitized || undefined;
}

function normalizeText(value?: string | null): string {
  return value?.trim() || '';
}

function pickAssetCategory(item: AssetLeaseRentDetailsListItem): string | undefined {
  const value = item.category ?? (item as { assetCategory?: string | null }).assetCategory ?? (item as { assetCategoryName?: string | null }).assetCategoryName;
  return value?.trim() || undefined;
}

function toApprovalRecord(item: AssetLeaseRentDetailsListItem): ApprovalRecord {
  const rawStatus = item.workflowStatus?.trim() ?? item.rentStatus?.trim() ?? 'pending';
  const displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

  return {
    id: String(item.id),
    grievanceNo: item.assetNo?.trim() || String(item.id),
    assetId: item.assetNo?.trim() || String(item.assetId),
    assetCategory: pickAssetCategory(item) || '-',
    tenantName: normalizeText(item.tenantName),
    leaseType: item.leaseType?.trim() || '-',
    rentAmount: item.rentAmount ?? item.rentMonthly ?? item.monthlyRent ?? 0,
    submittedDate: item.updatedDate ? item.updatedDate.slice(0, 10) : item.createdDate ? item.createdDate.slice(0, 10) : '-',
    status: displayStatus,
    remarks: normalizeText(item.remarks ?? item.reason ?? item.rejectionReason),
    assetName: item.assetName ?? undefined,
    leaseStartDate: item.leaseStartDate ? item.leaseStartDate.slice(0, 10) : undefined,
    leaseEndDate: item.leaseEndDate ? item.leaseEndDate.slice(0, 10) : undefined,
    paymentFrequency: item.paymentFrequency ?? undefined,
  };
}

function baseLeaseRentQuery(
  query: Record<string, string | string[] | undefined>,
  workflowStatus?: string
): AssetLeaseRentDetailsListParams {
  return {
    pageNumber: parsePositiveNumber(query.pageNumber, 1),
    pageSize: parsePositiveNumber(query.pageSize, 10),
    searchTerm: sanitizeSearchTerm(query.searchTerm),
    workflowStatus,
    assetCategoryId: parseOptionalNumber(query.assetCategoryId) ?? undefined,
    assetTypeId: parseOptionalNumber(query.assetTypeId) ?? undefined,
    zoneId: parseOptionalNumber(query.zoneId) ?? undefined,
    wardId: parseOptionalNumber(query.wardId) ?? undefined,
    assetId: parseOptionalNumber(query.assetId) ?? undefined,
    fromDate: normalizeDateQuery(query.fromDate),
    toDate: normalizeDateQuery(query.toDate),
  };
}

