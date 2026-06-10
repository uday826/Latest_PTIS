import type { AssetLeaseRentDetailsListItem } from '@/lib/api/asset/asset-lease-rent-details.service';
import type { LeaseRentPaymentDetail } from '@/types/asset/leaseRentPayment.types';

function normalizeText(value: string | null | undefined, fallback = ''): string {
  return value?.trim() || fallback;
}

function normalizeAmount(...values: Array<number | null | undefined>): number {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }
  return 0;
}

export function mapAssetLeaseRentDetailsToPaymentDetail(
  record: AssetLeaseRentDetailsListItem
): LeaseRentPaymentDetail {
  const baseAmount = normalizeAmount(
    record.rentAmount,
    record.monthlyRent,
    record.rentMonthly,
    record.previousMonthlyRent
  );

  return {
    leaseRentRegistrationId: record.id,
    grievanceNo: '',
    assetId: record.assetId,
    assetNo: normalizeText(record.assetNo) || String(record.assetId),
    assetName: normalizeText(record.assetName, '-'),
    zone: normalizeText(record.zone, '-'),
    wardNo: normalizeText(record.wardNo, '-'),
    category:
      normalizeText(record.category) ||
      normalizeText(record.assetCategory) ||
      normalizeText(record.assetCategoryName, '-'),
    shopNo: normalizeText(record.shopNo, '-'),
    shopName: normalizeText(record.shopName, '-'),
    tenantName: normalizeText(record.tenantName, '-'),
    tenantMobile: normalizeText(record.tenantMobile, '-'),
    tenantEmail: normalizeText(record.tenantEmail, '-'),
    leaseType: normalizeText(record.leaseType) || normalizeText(record.leaseRentType, '-'),
    monthlyRent: normalizeAmount(record.monthlyRent, record.rentMonthly, record.rentAmount),
    pendingDue: baseAmount,
    currentDemand: baseAmount,
    penalty: 0,
    gst: 0,
    totalPayable: baseAmount,
  };
}
