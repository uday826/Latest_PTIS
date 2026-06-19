import { setRequestLocale } from 'next-intl/server';
import MasterDataView from '@/components/modules/assets/configuration/masterData/MasterDataView';
import { GstMasterView } from '@/components/modules/assets/configuration/masterData/gst-master/GstMasterView';
import { getAssetMasterDataProvider } from '@/lib/api/asset-api/asset-master-provider';
import { MASTER_IDS } from '@/types/asset-type/master-data.types';
import {
  createGstAction,
  updateGstAction,
  deleteGstAction,
} from './actions';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ group?: string; page?: string; pageSize?: string; search?: string }>;
}

export default async function GstMasterPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { group = 'all', page = 1, pageSize = 10, search = '' } = await searchParams;
  const masterId = MASTER_IDS.TAX;

  const result = await getAssetMasterDataProvider(
    masterId,
    group,
    Number(page),
    Number(pageSize),
    search
  );
  if (!result.success) {
    throw new Error(result.error || 'Failed to load GST master data');
  }

  return (
    <MasterDataView
      initialMaster={masterId}
      initialGroup={group}
      initialMasters={result.data}
      actions={{
        createAction: createGstAction,
        updateAction: updateGstAction,
        deleteAction: deleteGstAction,
      }}
      viewComponent={GstMasterView}
    />
  );
}
