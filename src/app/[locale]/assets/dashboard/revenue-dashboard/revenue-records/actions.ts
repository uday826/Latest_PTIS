'use server';

import { revenueDashboardService } from '@/lib/api/asset/revenue-dashboard.service';
import { getRevenueFilterOptions } from '@/lib/api/asset/revenue-dashboard-filters';
import { logger } from '@/lib/utils/logger';
import type {
  RevenueListQuery,
  RevenueRecordsData,
} from '@/types/asset-type/revenue-dashboard.types';
import { ApiResponse } from '@/types/common.types';

export interface RevenueRecordsFilters {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  categoryId?: number | null;
  zoneId?: number | null;
  wardId?: number | null;
  leaseType?: string;
  paymentStatus?: string;
}

/**
 * Server action backing the per-category revenue records screen.
 * The overview supplies the category sidebar counts + summary cards; the list
 * endpoint supplies the paged, filtered rows for the selected category.
 */
export async function getRevenueRecordsAction(
  filters: RevenueRecordsFilters
): Promise<ApiResponse<RevenueRecordsData>> {
  try {
    const categoryId = filters.categoryId ?? undefined;
    const zoneId = filters.zoneId ?? undefined;
    const wardId = filters.wardId ?? undefined;

    const listQuery: RevenueListQuery = {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      searchTerm: filters.searchTerm,
      assetCategoryId: categoryId,
      zoneId,
      wardId,
      leaseType: filters.leaseType,
      paymentStatus: filters.paymentStatus,
    };

    const [overviewRes, listRes, options] = await Promise.all([
      revenueDashboardService.getOverview({ zoneId, wardId }),
      revenueDashboardService.getRevenueList(listQuery),
      getRevenueFilterOptions(zoneId ?? null),
    ]);

    if (!overviewRes.success || !overviewRes.data) {
      return {
        success: false,
        statusCode: overviewRes.statusCode ?? 500,
        message: overviewRes.message || 'Failed to load revenue records',
      };
    }
    if (!listRes.success || !listRes.data) {
      return {
        success: false,
        statusCode: listRes.statusCode ?? 500,
        message: listRes.message || 'Failed to load revenue records',
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Success',
      data: {
        categories: overviewRes.data.categoryDistribution,
        summary: overviewRes.data.summary,
        list: listRes.data,
        zones: options.zones,
        wards: options.wards,
        selectedCategoryId: filters.categoryId ?? null,
      },
    };
  } catch (err) {
    logger.error('[Server Action] getRevenueRecordsAction failed', { error: err as Error });
    return { success: false, statusCode: 500, message: String(err) };
  }
}
