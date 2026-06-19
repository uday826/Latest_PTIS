import { setRequestLocale } from 'next-intl/server';
import MasterDataView from '@/components/modules/assets/configuration/masterData/MasterDataView';
import { PenaltyRuleMasterView } from '@/components/modules/assets/configuration/masterData/penalty-rule-master/PenaltyRuleMasterView';
import { getAssetMasterDataProvider } from '@/lib/api/asset-api/asset-master-provider';
import { MASTER_IDS } from '@/types/asset-type/master-data.types';
import {
  createPenaltyAction,
  updatePenaltyAction,
  deletePenaltyAction,
} from './actions';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ group?: string; page?: string; pageSize?: string; search?: string }>;
}

export default async function PenaltyRuleMasterPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { group = 'all', page = 1, pageSize = 10, search = '' } = await searchParams;
  const masterId = MASTER_IDS.PENALTY;

  const result = await getAssetMasterDataProvider(
    masterId,
    group,
    Number(page),
    Number(pageSize),
    search
  );
  if (!result.success) {
    throw new Error(result.error || 'Failed to load penalty rule master data');
  }

  return (
    <MasterDataView
      initialMaster={masterId}
      initialGroup={group}
      initialMasters={result.data}
      actions={{
        createAction: createPenaltyAction,
        updateAction: updatePenaltyAction,
        deleteAction: deletePenaltyAction,
      }}
      viewComponent={PenaltyRuleMasterView}
    />
  );
}
