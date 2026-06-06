'use server';

import {
  getLeaseRentRegistrationList,
  getLeaseRentRegistrationStats,
  getLeaseRentRegistrationById,
  createLeaseRentRegistration,
  verifyLeaseRentRegistration,
  approveLeaseRentRegistration,
  rejectLeaseRentRegistration,
  revertToRegistration,
  revertToVerification,
  type CreateLeaseRentRegistrationPayload,
  type CreateLeaseRentRegistrationResponse,
  type LeaseRentRegistrationListItem,
  type LeaseRentRegistrationListParams,
  type ActionResponse,
} from '@/lib/api/asset/leaseRentRegistration.service';
import { assetMasterService } from '@/lib/api/asset/asset-master.service';
import { getAssetCategories, getAssetMasters, getWards, getZones } from '@/lib/api/asset/revenue-masters.service';
import type { LeaseRentRecord } from '@/components/modules/assets/revenue/lease-rent.types';
import type { FilterOption } from '@/components/modules/assets/revenue/LeaseRentFilters';
import type { ApprovalRecord } from '@/components/modules/assets/revenue/LeaseRentApprovalTable';
import type { VerificationRecord } from '@/components/modules/assets/revenue/LeaseRentVerificationTable';

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

function normalizeText(value?: string | null): string {
  return value?.trim() || '-';
}

function toLeaseRentRecord(item: LeaseRentRegistrationListItem): LeaseRentRecord {
  return {
    id: String(item.id),
    assetId: item.assetNo?.trim() || String(item.assetId),
    assetMasterId: item.assetId,
    assetName: item.assetName ?? undefined,
    assetNo: item.assetNo ?? undefined,
    shopNo: item.shopNo?.trim() || '',
    floor: item.floor?.trim() || '-',
    shopName: item.shopName?.trim() || item.assetName?.trim() || '-',
    tenantName: normalizeText(item.tenantName),
    leaseType: item.leaseType?.trim() || '-',
    rentStatus:
      item.rentStatus === 'InUse'
        ? 'In use'
        : item.rentStatus === 'Vacant'
          ? 'Vacant'
          : 'Pending',
    rentAmount: item.yearlyRent ?? item.monthlyRent ?? 0,
    category: item.category ?? undefined,
    zone: item.zone ?? undefined,
    ward: item.wardNo ?? undefined,
    submittedDate: item.createdDate ?? undefined,
  };
}

function toVerificationRecord(item: LeaseRentRegistrationListItem): VerificationRecord {
  // Capitalize the workflowStatus for display (e.g., 'pending' -> 'Pending')
  const rawStatus = item.workflowStatus?.trim() ?? 'pending';
  const displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

  return {
    id: String(item.id),
    assetId: item.assetNo?.trim() || String(item.assetId),
    assetCategory: item.category?.trim() || '-',
    assetSubCategory: [item.shopName, item.floor]
      .filter(Boolean)
      .map((value) => String(value).trim())
      .join(' | '),
    tenantName: normalizeText(item.tenantName),
    applicationType: normalizeText(item.applicationType),
    submittedDate: item.createdDate ? item.createdDate.slice(0, 10) : '-',
    status: displayStatus,
  };
}

function toApprovalRecord(item: LeaseRentRegistrationListItem): ApprovalRecord {
  return {
    id: String(item.id),
    grievanceNo: item.assetNo?.trim() || String(item.id),
    assetId: item.assetNo?.trim() || String(item.assetId),
    assetCategory: item.category?.trim() || '-',
    tenantName: normalizeText(item.tenantName),
    leaseType: item.leaseType?.trim() || '-',
    rentAmount: item.yearlyRent ?? item.monthlyRent ?? 0,
    submittedDate: item.createdDate ? item.createdDate.slice(0, 10) : '-',
    status: 'Pending',
  };
}

function baseLeaseRentQuery(query: Record<string, string | string[] | undefined>, workflowStatus?: string) {
  const params: LeaseRentRegistrationListParams = {
    pageNumber: parsePositiveNumber(query.pageNumber, 1),
    pageSize: parsePositiveNumber(query.pageSize, 10),
    searchTerm: firstQueryValue(query.searchTerm).trim() || undefined,
    assetCategoryId: parseOptionalNumber(query.assetCategoryId) ?? undefined,
    zoneId: parseOptionalNumber(query.zoneId) ?? undefined,
    wardId: parseOptionalNumber(query.wardId) ?? undefined,
    assetId: parseOptionalNumber(query.assetId) ?? undefined,
    workflowStatus,
  };

  return params;
}

export interface ManageRentersPageData {
  records: LeaseRentRecord[];
  stats: Awaited<ReturnType<typeof getLeaseRentRegistrationStats>>;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  searchTerm: string;
  assetCategoryId: number | null;
  zoneId: number | null;
  wardId: number | null;
  assetId: number | null;
  categoryOptions: FilterOption[];
  zoneOptions: FilterOption[];
  wardOptions: FilterOption[];
  assetOptions: FilterOption[];
}

interface ManageRentersWorkflowBaseData {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  searchTerm: string;
  assetCategoryId: number | null;
  categoryOptions: FilterOption[];
}

export interface ManageRentersVerificationPageData extends ManageRentersWorkflowBaseData {
  records: VerificationRecord[];
}

export interface ManageRentersApprovalPageData extends ManageRentersWorkflowBaseData {
  records: ApprovalRecord[];
}

export interface ManageRentersTabCounts {
  registrationCount: number;
  verificationCount: number;
  approvalCount: number;
}

async function getWorkflowRecordCount(workflowStatus?: string): Promise<number> {
  const result = await getLeaseRentRegistrationList({
    pageNumber: 1,
    pageSize: 1,
    workflowStatus,
  });

  return result.totalCount;
}

export async function getManageRentersTabCountsAction(): Promise<ManageRentersTabCounts> {
  const [registrationCount, verificationCount, approvalCount] = await Promise.all([
    getWorkflowRecordCount(),
    getWorkflowRecordCount('pending'),
    getWorkflowRecordCount('verified'),
  ]);

  return {
    registrationCount,
    verificationCount,
    approvalCount,
  };
}

export async function getManageRentersPageDataAction(
  query: Record<string, string | string[] | undefined>
): Promise<ManageRentersPageData> {
  const params = baseLeaseRentQuery(query);
  const selectedZoneId = parseOptionalNumber(query.zoneId);
  const [list, stats, categories, zones, wards, assets] = await Promise.all([
    getLeaseRentRegistrationList(params),
    getLeaseRentRegistrationStats(),
    getAssetCategories(),
    getZones(),
    getWards(selectedZoneId),
    getAssetMasters(),
  ]);

  return {
    records: list.items.map(toLeaseRentRecord),
    stats,
    pageNumber: list.pageNumber,
    pageSize: list.pageSize,
    totalCount: list.totalCount,
    totalPages: list.totalPages,
    searchTerm: firstQueryValue(query.searchTerm).trim(),
    assetCategoryId: parseOptionalNumber(query.assetCategoryId),
    zoneId: selectedZoneId,
    wardId: parseOptionalNumber(query.wardId),
    assetId: parseOptionalNumber(query.assetId),
    categoryOptions: categories.map((category) => ({
      label: category.categoryName,
      value: String(category.id),
    })),
    zoneOptions: zones.map((zone) => ({
      label: zone.zoneNo,
      value: String(zone.id),
    })),
    wardOptions: wards.map((ward) => ({
      label: ward.wardNo,
      value: String(ward.id),
    })),
    assetOptions: assets.map((asset) => ({
      label: asset.assetName?.trim() || asset.assetNo?.trim() || String(asset.id),
      value: String(asset.id),
    })),
  };
}

export async function getManageRentersVerificationPageDataAction(
  query: Record<string, string | string[] | undefined>
): Promise<ManageRentersVerificationPageData> {
  const params = baseLeaseRentQuery(query, 'pending');
  const [list, categories] = await Promise.all([
    getLeaseRentRegistrationList(params),
    getAssetCategories(),
  ]);

  return {
    records: list.items.map(toVerificationRecord),
    pageNumber: list.pageNumber,
    pageSize: list.pageSize,
    totalCount: list.totalCount,
    totalPages: list.totalPages,
    searchTerm: firstQueryValue(query.searchTerm).trim(),
    assetCategoryId: parseOptionalNumber(query.assetCategoryId),
    categoryOptions: categories.map((category) => ({
      label: category.categoryName,
      value: String(category.id),
    })),
  };
}

export async function getManageRentersApprovalPageDataAction(
  query: Record<string, string | string[] | undefined>
): Promise<ManageRentersApprovalPageData> {
  const params = baseLeaseRentQuery(query, 'verified');
  const [list, categories] = await Promise.all([
    getLeaseRentRegistrationList(params),
    getAssetCategories(),
  ]);

  return {
    records: list.items.map(toApprovalRecord),
    pageNumber: list.pageNumber,
    pageSize: list.pageSize,
    totalCount: list.totalCount,
    totalPages: list.totalPages,
    searchTerm: firstQueryValue(query.searchTerm).trim(),
    assetCategoryId: parseOptionalNumber(query.assetCategoryId),
    categoryOptions: categories.map((category) => ({
      label: category.categoryName,
      value: String(category.id),
    })),
  };
}

export async function getManageRentersAssetDetailsAction(assetId: number | string) {
  const parsedId = Number(assetId);
  if (!Number.isFinite(parsedId) || parsedId <= 0) return null;

  const response = await assetMasterService.getAssetById(parsedId);
  return response.success ? response.data ?? null : null;
}

import { apiClient } from '@/services/api.service';

export interface ApplicationTypeItem {
  id: number;
  applicationTypeCode: string;
  applicationTypeName: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  updatedBy: number | null;
  updatedDate: string | null;
}

export async function getManageRentersVerificationDetailsAction(id: number | string) {
  const parsedId = Number(id);
  if (!Number.isFinite(parsedId) || parsedId <= 0) return null;

  return await getLeaseRentRegistrationById(parsedId);
}

export async function getApplicationTypesAction(): Promise<ApplicationTypeItem[]> {
  const response = await apiClient.get<{ items: ApplicationTypeItem[] }>('asset-management/ApplicationType');
  if (!response.success || !response.data?.items) {
    return [];
  }
  return response.data.items;
}

export interface LeaseRentFormSubmitData {
  assetId: number;
  applicationTypeId: number;
  shopNo?: string;
  floorId?: number;
  shopName?: string;
  tenantName: string;
  tenantMobile?: string;
  tenantEmail?: string;
  tenantType?: string;
  tenantAadhaarNo?: string;
  tenantPanCardNo?: string;
  tenantAddress?: string;
  previousTenantName?: string;
  previousTenantMobile?: string;
  leaseType?: string;
  oldLeaseStartDate?: string;
  oldLeaseEndDate?: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
  terminationDate?: string;
  previousMonthlyRent?: number;
  monthlyRent?: number;
  securityDeposit?: number;
  paymentFrequency?: string;
  reason?: string;
}

export async function createLeaseRentRegistrationAction(
  data: LeaseRentFormSubmitData
): Promise<CreateLeaseRentRegistrationResponse> {
  function toNum(val: unknown): number | null {
    if (val === undefined || val === null || val === '') return null;
    const n = Number(val);
    return Number.isFinite(n) ? n : null;
  }
  function toDateStr(val: string | undefined | null): string | null {
    if (!val?.trim()) return null;
    const trimmed = val.trim();
    // HTML date inputs produce "YYYY-MM-DD" — append time directly without timezone
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return `${trimmed}T00:00:00`;
    }
    const d = new Date(trimmed);
    if (Number.isNaN(d.getTime())) return null;
    // Strip the milliseconds and Z suffix — .NET System.DateTime rejects UTC 'Z' format
    // Convert: "2026-06-15T00:00:00.000Z" → "2026-06-15T00:00:00"
    return d.toISOString().replace(/\.\d{3}Z$/, '');
  }

  const payload: CreateLeaseRentRegistrationPayload = {
    isActive: true,
    createdBy: 1,
    assetId: data.assetId,
    applicationTypeId: data.applicationTypeId,
    shopNo: data.shopNo?.trim() || null,
    floorId: toNum(data.floorId),
    shopName: data.shopName?.trim() || null,
    tenantName: data.tenantName.trim(),
    tenantMobile: data.tenantMobile?.trim() || null,
    tenantEmail: data.tenantEmail?.trim() || null,
    tenantType: data.tenantType?.trim() || null,
    tenantAadhaarNo: data.tenantAadhaarNo?.trim() || null,
    tenantPanCardNo: data.tenantPanCardNo?.trim() || null,
    tenantAddress: data.tenantAddress?.trim() || null,
    previousTenantName: data.previousTenantName?.trim() || null,
    previousTenantMobile: data.previousTenantMobile?.trim() || null,
    leaseType: data.leaseType?.trim() || null,
    oldLeaseStartDate: toDateStr(data.oldLeaseStartDate),
    oldLeaseEndDate: toDateStr(data.oldLeaseEndDate),
    leaseStartDate: toDateStr(data.leaseStartDate),
    leaseEndDate: toDateStr(data.leaseEndDate),
    terminationDate: toDateStr(data.terminationDate),
    previousMonthlyRent: toNum(data.previousMonthlyRent),
    monthlyRent: toNum(data.monthlyRent),
    securityDeposit: toNum(data.securityDeposit) ?? 0,
    paymentFrequency: data.paymentFrequency?.trim() || null,
    reason: data.reason?.trim() || null,
  };

  return createLeaseRentRegistration(payload);
}

import { revalidatePath } from 'next/cache';

export async function verifyLeaseRentRegistrationAction(id: number): Promise<ActionResponse> {
  const result = await verifyLeaseRentRegistration(id);
  revalidatePath('/[locale]/assets/revenue/manage-renters', 'layout');
  return result;
}

export async function approveLeaseRentRegistrationAction(id: number): Promise<ActionResponse> {
  const result = await approveLeaseRentRegistration(id);
  revalidatePath('/[locale]/assets/revenue/manage-renters', 'layout');
  return result;
}

export async function rejectLeaseRentRegistrationAction(id: number, rejectionReason?: string): Promise<ActionResponse> {
  const result = await rejectLeaseRentRegistration(id, rejectionReason);
  revalidatePath('/[locale]/assets/revenue/manage-renters', 'layout');
  return result;
}

export async function revertToRegistrationAction(id: number): Promise<ActionResponse> {
  const result = await revertToRegistration(id);
  revalidatePath('/[locale]/assets/revenue/manage-renters', 'layout');
  return result;
}

export async function revertToVerificationAction(id: number): Promise<ActionResponse> {
  const result = await revertToVerification(id);
  revalidatePath('/[locale]/assets/revenue/manage-renters', 'layout');
  return result;
}
