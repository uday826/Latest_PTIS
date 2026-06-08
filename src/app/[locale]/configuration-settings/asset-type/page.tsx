import { setRequestLocale } from 'next-intl/server';
import MasterDataView from '@/components/modules/assets/configuration/masterData/MasterDataView';
import { getAssetMasterDataProvider } from '@/lib/api/asset-api/asset-master-provider';
import { AssetTypeMasterView } from '@/components/modules/assets/configuration/masterData/asset-type-master/AssetTypeMasterView';
import { safeParseInt } from '@/lib/utils/asset-utils/number';
import {
  createAssetMasterAction,
  updateAssetMasterAction,
  deleteAssetMasterAction,
} from './actions';

export const dynamic = 'force-dynamic';

interface MasterDataPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ group?: string; page?: string; pageSize?: string; search?: string; sortBy?: string; sortOrder?: string }>;
}

export default async function AssetTypePage({ params, searchParams }: MasterDataPageProps) {
  const { locale } = await params;
  const { group, page, pageSize, search, sortBy, sortOrder } = await searchParams;
  setRequestLocale(locale);

  const masterId = "asset-type-master";

  // Fetch filtered data on the server based on current selection, pagination, search and sorting
  const result = await getAssetMasterDataProvider(
    masterId,
    group,
    safeParseInt(page, 1),
    safeParseInt(pageSize, 10),
    search,
    sortBy || "typeName",
    (sortOrder as 'asc' | 'desc') || "asc"
  );

  const initialMasters = (result.success && Array.isArray(result.data)) ? result.data : [];

  return (
    <MasterDataView
      key={`master-view-${masterId}-${initialMasters.reduce((acc: number, m) => acc + (m.records?.length || 0), 0)}-${initialMasters.length}`}
      initialMaster={masterId}
      initialGroup={group || 'all'}
      initialMasters={initialMasters}
      actions={{
        createAction: createAssetMasterAction,
        updateAction: updateAssetMasterAction,
        deleteAction: deleteAssetMasterAction,
      }}
      viewComponent={AssetTypeMasterView}
    />
  );
}
