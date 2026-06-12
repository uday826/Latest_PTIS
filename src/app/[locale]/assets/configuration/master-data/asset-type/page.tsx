import { setRequestLocale } from 'next-intl/server';
import MasterDataView from '@/components/modules/assets/configuration/masterData/MasterDataView';
import { getAssetMasterDataProvider } from '@/lib/api/asset-api/asset-master-provider';
import { AssetTypeMasterView } from '@/components/modules/assets/configuration/masterData/asset-type-master/AssetTypeMasterView';
import { MASTER_IDS } from '@/types/asset-type/master-data.types';
import {
  createAssetTypeAction,
  updateAssetTypeAction,
  deleteAssetTypeAction,
} from './actions';
import {
  createAssetCategoryAction,
  updateAssetCategoryAction,
  deleteAssetCategoryAction,
} from '../asset-category/actions';

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
  searchParams: Promise<{ group?: string; page?: string; pageSize?: string; search?: string; sortBy?: string; sortOrder?: string }>;
}

export default async function AssetTypePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { group, page, pageSize, search = '', sortBy, sortOrder } = await searchParams;
  const safePage = Math.max(MIN_PAGE, Number(page) || DEFAULT_PAGE);
  const safePageSize = normalizePageSize(Number(pageSize));
  const masterId = MASTER_IDS.TYPE;

  const result = await getAssetMasterDataProvider(
    masterId,
    group || 'all',
    safePage,
    safePageSize,
    search,
    sortBy || "typeName",
    (sortOrder as 'asc' | 'desc') || "asc"
  );

  if (!result.success) {
    throw new Error(result.error || 'Failed to load asset type master data');
  }

  const initialMasters = result.data;

  return (
    <MasterDataView
      initialMaster={masterId}
      initialGroup={group || 'all'}
      initialMasters={initialMasters}
      actions={{
        createAction: createAssetTypeAction,
        updateAction: updateAssetTypeAction,
        deleteAction: deleteAssetTypeAction,
        groupActions: {
          createAction: createAssetCategoryAction,
          updateAction: updateAssetCategoryAction,
          deleteAction: deleteAssetCategoryAction,
        },
      }}
      viewComponent={AssetTypeMasterView}
    />
  );
}

