'use server';

import { revalidatePath } from 'next/cache';
import { apiClient } from '@/services/api.service';
import { assetMasterService } from '@/lib/api/asset/asset-master.service';
import { getAssetCategories, getAssetMasters, getWards, getZones } from '@/lib/api/asset/revenue-masters.service';
import {
  createLeaseRentRegistration,
  type CreateLeaseRentRegistrationPayload,
  type CreateLeaseRentRegistrationResponse,
} from '@/lib/api/asset/leaseRentRegistration.service';
import {
  getAssetLeaseRentDetailsList,
  getAssetLeaseRentDetailsById,
  updateAssetLeaseRentDetails,
  sendForVerification,
  sendToVerification,
  verifyLeaseRent,
  approveLeaseRent,
  rejectLeaseRent,
  revertToRegistration,
  revertToVerification,
  getPreviousTenantHistory,
  createAssetLeaseRentDetails,
  type AssetLeaseRentDetailsListItem,
  type AssetLeaseRentDetailsListParams,
  type AssetLeaseRentDetailsUpdatePayload,
  type CreateAssetLeaseRentDetailsPayload,
} from '@/lib/api/asset/asset-lease-rent-details.service';
import type {
  ApprovalRecord,
  ApplicationTypeItem,
  LeaseRentFormSubmitData,
  LeaseRentRecord,
  ManageRentersApprovalPageData,
  ManageRentersPageData,
  ManageRentersTabCounts,
  ManageRentersVerificationPageData,
  VerificationRecord,
} from '@/types/asset/revenue.types';

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
  return value?.trim() || '';
}

function pickAssetCategory(item: AssetLeaseRentDetailsListItem): string | undefined {
  const value = item.category ?? (item as { assetCategory?: string | null }).assetCategory ?? (item as { assetCategoryName?: string | null }).assetCategoryName;
  return value?.trim() || undefined;
}

function normalizeRentStatus(value?: string | null): LeaseRentRecord['rentStatus'] {
  const raw = (value ?? '').trim().toLowerCase();
  if (raw === 'inuse' || raw === 'in use' || raw === 'approved') return 'In use';
  if (raw === 'vacant') return 'Vacant';
  return 'Pending';
}

function toLeaseRentRecord(item: AssetLeaseRentDetailsListItem): LeaseRentRecord {
  return {
    id: String(item.id),
    assetId: item.assetNo?.trim() || String(item.assetId),
    assetMasterId: item.assetId,
    assetName: item.assetName ?? undefined,
    assetNo: item.assetNo ?? undefined,
    totalAreaSqFt: item.totalAreaSqFt ?? null,
    assetCategory: pickAssetCategory(item),
    shopNo: item.shopNo?.trim() || item.assetNo?.trim() || '',
    floor: item.floorDescription?.trim() || item.floorId?.toString() || '-',
    floorDescription: item.floorDescription?.trim() || undefined,
    shopName: item.shopName?.trim() || item.assetName?.trim() || item.assetNo?.trim() || '-',
    tenantName: normalizeText(item.tenantName),
    tenantMobile: item.tenantMobile?.trim() || undefined,
    tenantEmail: item.tenantEmail?.trim() || undefined,
    tenantType: item.tenantType?.trim() || undefined,
    tenantAadhaarNo: item.tenantAadhaarNo?.trim() || undefined,
    tenantPanCardNo: item.tenantPanCardNo?.trim() || undefined,
    tenantAddress: item.tenantAddress?.trim() || undefined,
    pinCode: (item as { pinCode?: string | null }).pinCode?.trim() || undefined,
    leaseType: item.leaseType?.trim() || '-',
    leaseRentType: item.leaseRentType?.trim() || undefined,
    applicationTypeName: item.applicationTypeName?.trim() || undefined,
    applicationTypeId: item.applicationTypeId ?? null,
    rentStatus: normalizeRentStatus(item.rentStatus ?? item.workflowStatus),
    rentAmount: item.rentAmount ?? item.rentMonthly ?? item.monthlyRent ?? 0,
    monthlyRent: item.monthlyRent ?? item.rentAmount ?? item.rentMonthly ?? null,
    securityDeposit: item.securityDeposit ?? null,
    paymentFrequency: item.paymentFrequency?.trim() || undefined,
    previousTenantName: item.previousTenantName?.trim() || undefined,
    previousTenantMobile: item.previousTenantMobile?.trim() || undefined,
    previousMonthlyRent: item.previousMonthlyRent ?? null,
    oldLeaseStartDate: item.oldLeaseStartDate ?? null,
    oldLeaseEndDate: item.oldLeaseEndDate ?? null,
    leaseStartDate: item.leaseStartDate ?? null,
    leaseEndDate: item.leaseEndDate ?? null,
    terminationDate: item.terminationDate ?? null,
    reason: item.reason?.trim() || undefined,
    rentAmountDisplay: item.rentAmountDisplay?.trim() || undefined,
    leaseDurationDisplay: item.leaseDurationDisplay?.trim() || undefined,
    workflowStatus: item.workflowStatus?.trim() || undefined,
    category: pickAssetCategory(item),
    zone: item.zone ?? undefined,
    ward: item.wardNo ?? undefined,
    submittedDate: item.updatedDate ?? item.createdDate ?? undefined,
  };
}

function toVerificationRecord(item: AssetLeaseRentDetailsListItem): VerificationRecord {
  const rawStatus = item.workflowStatus?.trim() ?? item.rentStatus?.trim() ?? 'pending';
  const displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

  return {
    id: String(item.id),
    assetId: item.assetNo?.trim() || String(item.assetId),
    assetCategory: pickAssetCategory(item) || '-',
    assetSubCategory: [item.shopName, item.floorDescription]
      .filter(Boolean)
      .map((value) => String(value).trim())
      .join(' | '),
    tenantName: normalizeText(item.tenantName),
    applicationType: normalizeText(item.applicationTypeName ?? item.leaseRentType ?? item.leaseType),
    submittedDate: item.updatedDate ? item.updatedDate.slice(0, 10) : item.createdDate ? item.createdDate.slice(0, 10) : '-',
    status: displayStatus,
  };
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
  };
}

function baseLeaseRentQuery(
  query: Record<string, string | string[] | undefined>,
  workflowStatus?: string
): AssetLeaseRentDetailsListParams {
  return {
    pageNumber: parsePositiveNumber(query.pageNumber, 1),
    pageSize: parsePositiveNumber(query.pageSize, 10),
    searchTerm: firstQueryValue(query.searchTerm).trim() || undefined,
    workflowStatus,
    assetCategoryId: parseOptionalNumber(query.assetCategoryId) ?? undefined,
    zoneId: parseOptionalNumber(query.zoneId) ?? undefined,
    wardId: parseOptionalNumber(query.wardId) ?? undefined,
    assetId: parseOptionalNumber(query.assetId) ?? undefined,
  };
}

export async function getManageRentersTabCountsAction(): Promise<ManageRentersTabCounts> {
  const [list, registeredList, revertedList] = await Promise.all([
    getAssetLeaseRentDetailsList({ pageNumber: 1, pageSize: 1 }),
    getAssetLeaseRentDetailsList({ pageNumber: 1, pageSize: 1, workflowStatus: 'registered' }),
    getAssetLeaseRentDetailsList({ pageNumber: 1, pageSize: 1, workflowStatus: 'reverted' }),
  ]);

  const stats = (list as unknown as { stats?: any }).stats;

  return {
    registrationCount: registeredList.totalCount,
    verificationCount: stats?.verificationPending ?? 0,
    approvalCount: stats?.approvalPending ?? 0,
    revertedCount: revertedList.totalCount,
  };
}

export async function getManageRentersPageDataAction(
  query: Record<string, string | string[] | undefined>
): Promise<ManageRentersPageData> {
  const params = baseLeaseRentQuery(query);
  const selectedZoneId = parseOptionalNumber(query.zoneId);
  const [list, categories, zones, wards, assets] = await Promise.all([
    getAssetLeaseRentDetailsList(params),
    getAssetCategories(),
    getZones(),
    getWards(selectedZoneId),
    getAssetMasters(),
  ]);

  const stats = (list as unknown as { stats?: any }).stats || {
    totalApproved: 0,
    totalVerified: 0,
    verificationPending: 0,
    approvalPending: 0,
    totalRejected: 0,
  };

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
    getAssetLeaseRentDetailsList(params),
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
    getAssetLeaseRentDetailsList(params),
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

export async function getManageRentersRevertedPageDataAction(
  query: Record<string, string | string[] | undefined>
): Promise<ManageRentersPageData> {
  const params = baseLeaseRentQuery(query, 'reverted');
  const selectedZoneId = parseOptionalNumber(query.zoneId);
  const [list, categories, zones, wards, assets] = await Promise.all([
    getAssetLeaseRentDetailsList(params),
    getAssetCategories(),
    getZones(),
    getWards(selectedZoneId),
    getAssetMasters(),
  ]);

  const stats = (list as unknown as { stats?: any }).stats || {
    totalApproved: 0,
    totalVerified: 0,
    verificationPending: 0,
    approvalPending: 0,
    totalRejected: 0,
  };

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

export async function getManageRentersAssetDetailsAction(assetId: number | string) {
  const parsedId = Number(assetId);
  if (!Number.isFinite(parsedId) || parsedId <= 0) return null;

  const response = await assetMasterService.getAssetById(parsedId);
  return response.success ? response.data ?? null : null;
}

export async function getManageRentersVerificationDetailsAction(id: number | string) {
  const parsedId = Number(id);
  if (!Number.isFinite(parsedId) || parsedId <= 0) return null;

  return await getAssetLeaseRentDetailsById(parsedId);
}

export async function getApplicationTypesAction(): Promise<ApplicationTypeItem[]> {
  const response = await apiClient.get<{ items: ApplicationTypeItem[] }>('asset-management/ApplicationType');
  if (!response.success || !response.data?.items) {
    return [];
  }
  return response.data.items;
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
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return `${trimmed}T00:00:00`;
    }
    const d = new Date(trimmed);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().replace(/\.\d{3}Z$/, '');
  }

  const payload: CreateAssetLeaseRentDetailsPayload = {
    isActive: true,
    createdBy: 1,
    assetId: Number(data.assetId),
    applicationTypeId: Number(data.applicationTypeId),
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

  const res = await createAssetLeaseRentDetails(payload);
  revalidatePath('/[locale]/assets/revenue/manage-renters', 'layout');
  revalidatePath('/assets/revenue/manage-renters');
  return res as unknown as CreateLeaseRentRegistrationResponse;
}

export async function updateAssetLeaseRentDetailsAction(
  id: number,
  payload: AssetLeaseRentDetailsUpdatePayload
) {
  const res = await updateAssetLeaseRentDetails(id, payload);
  revalidatePath('/[locale]/assets/revenue/manage-renters', 'layout');
  revalidatePath('/assets/revenue/manage-renters');
  return res;
}

export async function sendToVerificationAction(id: number, remarks?: string) {
  const res = await sendToVerification(id, remarks);
  revalidatePath('/[locale]/assets/revenue/manage-renters', 'layout');
  revalidatePath('/assets/revenue/manage-renters');
  return res;
}

export async function sendForVerificationAction(
  id: number,
  payload: AssetLeaseRentDetailsUpdatePayload
) {
  const res = await sendForVerification(id, payload);
  revalidatePath('/[locale]/assets/revenue/manage-renters', 'layout');
  revalidatePath('/assets/revenue/manage-renters');
  return res;
}

export async function verifyAction(id: number, remarks?: string) {
  const res = await verifyLeaseRent(id, remarks);
  revalidatePath('/[locale]/assets/revenue/manage-renters', 'layout');
  revalidatePath('/assets/revenue/manage-renters');
  return res;
}

export async function approveAction(id: number, remarks?: string) {
  const res = await approveLeaseRent(id, remarks);
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

export async function revertToRegistrationAction(id: number, remarks?: string) {
  const res = await revertToRegistration(id, remarks);
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
