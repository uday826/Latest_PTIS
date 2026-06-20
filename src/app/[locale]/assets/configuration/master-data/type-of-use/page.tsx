import MasterDataView from '@/components/modules/assets/configuration/masterData/MasterDataView';
import { getAssetMasterDataProvider } from '@/lib/api/asset-api/asset-master-provider';
import { MASTER_IDS } from '@/types/asset-type/master-data.types';
import { createTypeOfUseAction, updateTypeOfUseAction, deleteTypeOfUseAction } from './actions';
import { TypeOfUseView } from '@/components/modules/assets/configuration/masterData/type-of-use/TypeOfUseView';

export default async function TypeOfUsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const pageSize = Number(resolvedParams.pageSize) || 10;
  const search = resolvedParams.search || '';
  const group = resolvedParams.group || 'all';
  const sortBy = resolvedParams.sortBy || 'typeOfUseCode';
  const sortOrder = (resolvedParams.sortOrder as 'asc' | 'desc') || 'asc';

  const res = await getAssetMasterDataProvider(
    MASTER_IDS.TYPE_OF_USE,
    group,
    page,
    pageSize,
    search,
    sortBy,
    sortOrder
  );

  return (
    <MasterDataView
      initialMaster={MASTER_IDS.TYPE_OF_USE}
      initialGroup={group}
      initialMasters={res.data || []}
      viewComponent={TypeOfUseView}
      actions={{
        createAction: createTypeOfUseAction,
        updateAction: updateTypeOfUseAction,
        deleteAction: deleteTypeOfUseAction,
      }}
    />
  );
}
