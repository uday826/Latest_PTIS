import { setRequestLocale } from 'next-intl/server';
import MasterDataView from '@/components/modules/assets/configuration/masterData/MasterDataView';
import { OwningDepartmentMasterView } from '@/components/modules/assets/configuration/masterData';
import { getAssetMasterDataProvider } from '@/lib/api/asset-api/asset-master-provider';
import { MASTER_IDS } from '@/types/asset-type/master-data.types';
import { getOwningDepartments } from '@/lib/api/asset-api/owning-department.service';
import { createOwningDepartmentAction, updateOwningDepartmentAction, deleteOwningDepartmentAction } from './actions';
import type { Option } from '@/components/common';
import { logger } from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

const MIN_PAGE = 1;
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100] as const;

function normalizePageSize(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_PAGE_SIZE;

  const normalized = Math.floor(value);
  if (PAGE_SIZE_OPTIONS.includes(normalized as (typeof PAGE_SIZE_OPTIONS)[number])) {
    return normalized;
  }
  return DEFAULT_PAGE_SIZE;
}

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string }>;
}

export default async function OwningDepartmentPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { page, pageSize, search = '' } = await searchParams;
  const safePage = Math.max(MIN_PAGE, Number(page) || DEFAULT_PAGE);
  const safePageSize = normalizePageSize(Number(pageSize));
  const masterId = MASTER_IDS.OWNING_DEPARTMENT;

  const result = await getAssetMasterDataProvider(
    masterId,
    'all',
    safePage,
    safePageSize,
    search
  );
  
  let departmentsResult: { id: number; isActive: boolean; owningDepartmentName?: string }[] = [];
  try {
    const res = await getOwningDepartments({ PageSize: 1000 });
    departmentsResult = res?.items || [];
  } catch (error) {
    logger.error("Failed to load departments for dropdown", { error: error instanceof Error ? error : new Error(String(error)) });
  }

  if (!result.success) {
    throw new Error(result.error || 'Failed to load owning department master data');
  }

  const initialMasters = result.data;
  const departmentOptions: Option[] = [
    { label: 'Select department (optional)', value: '' },
    ...departmentsResult
      .filter((department) => department.id > 0 && department.isActive)
      .map((department) => ({
        label: department.owningDepartmentName || `Department #${department.id}`,
        value: String(department.id),
      })),
  ];

  return (
    <MasterDataView
      initialMaster={masterId}
      initialGroup="all"
      initialMasters={initialMasters}
      actions={{
        createAction: createOwningDepartmentAction,
        updateAction: updateOwningDepartmentAction,
        deleteAction: deleteOwningDepartmentAction,
      }}
      viewProps={{ departmentOptions }}
      viewComponent={OwningDepartmentMasterView}
    />
  );
}
