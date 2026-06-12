import { setRequestLocale } from 'next-intl/server';
import MasterDataView from '@/components/modules/assets/configuration/masterData/MasterDataView';
import { OwnershipTypeMasterView } from '@/components/modules/assets/configuration/masterData';
import { getAssetMasterDataProvider } from '@/lib/api/asset-api/asset-master-provider';
import { MASTER_IDS } from '@/types/asset-type/master-data.types';
import { createOwnershipTypeAction, updateOwnershipTypeAction, deleteOwnershipTypeAction } from './actions';

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

export default async function OwnershipTypePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { page, pageSize, search = '' } = await searchParams;
  const safePage = Math.max(MIN_PAGE, Number(page) || DEFAULT_PAGE);
  const safePageSize = normalizePageSize(Number(pageSize));
  const masterId = MASTER_IDS.OWNERSHIP_TYPE;

  const result = await getAssetMasterDataProvider(
    masterId,
    'all',
    safePage,
    safePageSize,
    search
  );

  if (!result.success) {
    throw new Error(result.error || 'Failed to load ownership type master data');
  }

  const initialMasters = result.data;

  return (
    <MasterDataView
      initialMaster={masterId}
      initialGroup="all"
      initialMasters={initialMasters}
      actions={{
        createAction: createOwnershipTypeAction,
        updateAction: updateOwnershipTypeAction,
        deleteAction: deleteOwnershipTypeAction,
      }}
      viewComponent={OwnershipTypeMasterView}
    />
  );
}
