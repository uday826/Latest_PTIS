'use client';
import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import type { MasterDataRecord, MasterDataType, MasterDataActions } from '@/types/asset-type/master-data.types';
import { MASTER_IDS } from '@/types/asset-type/master-data.types';
import { applyOptimisticMasterUpdate, type OptimisticUpdate } from '@/lib/utils/asset-utils/masterDataUtils';

/**
 * Custom hook to manage master data records with optimistic UI updates.
 * Handles creation, updates, and deletion of records, and automatically syncs dependencies.
 */
export function useMasterData(initialMasters: MasterDataType[], externalActions?: MasterDataActions) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations('asset.configuration.masterData.messages');

  const [optimisticMasters] = useOptimistic(
    initialMasters,
    (state: MasterDataType[], update: OptimisticUpdate) => applyOptimisticMasterUpdate(state, update)
  );

  const getLocalizedError = (errorMsg: string, fallback: string): string => {
    if (!errorMsg) return fallback;
    const msg = errorMsg.toLowerCase();
    if (msg.includes("assetcategory") && msg.includes("referenced")) {
      return t('cannotDeleteCategoryReferenced');
    }
    if (msg.includes("assettype") && msg.includes("referenced")) {
      return t('cannotDeleteTypeReferenced');
    }
    return errorMsg;
  };

  const handleSave = async (payload: MasterDataRecord, masterId: string, editData: MasterDataRecord | null, onSuccess?: () => void) => {
    // Use backendId if available, otherwise use a numeric temporary ID for new records 
    // to ensure compatibility with numeric filtering parameters in APIs.
    const recordId = editData?.backendId || payload.backendId || (editData ? (Number.isFinite(Number(editData.id)) ? editData.id : Date.now()) : Date.now());

    startTransition(async () => {
      try {
        if (!externalActions) throw new Error('API actions are not configured.');

        // Use dedicated groupActions for asset categories if provided (e.g. on the asset-type page)
        const isGroupSave = masterId === MASTER_IDS.CATEGORY && !!externalActions.groupActions;
        const actions = isGroupSave ? externalActions.groupActions! : externalActions;

        const result = editData
          ? await actions.updateAction(String(recordId), payload)
          : await actions.createAction(payload);

        if (result.success) {
          toast.success(t('saveSuccess'));
          onSuccess?.();
        } else {
          throw new Error(result.error || t('saveFailed'));
        }
      } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : t('unexpectedError');
        toast.error(getLocalizedError(errorMsg, t('unexpectedError')));
      } finally {
        router.refresh();
      }
    });
  };

  const handleDelete = async (row: MasterDataRecord, masterId: string) => {
    const recordId = row.backendId || row.id;

    startTransition(async () => {
      try {
        if (!externalActions) throw new Error('API actions are not configured.');

        // Use dedicated groupActions for asset categories if provided (e.g. on the asset-type page)
        const isGroupDelete = masterId === MASTER_IDS.CATEGORY && !!externalActions.groupActions;
        const deleteAction = isGroupDelete
          ? externalActions.groupActions!.deleteAction
          : externalActions.deleteAction;

        const result = await deleteAction(String(recordId));
        if (result.success) {
          toast.success(t('deleteSuccess'));
        } else {
          toast.error(getLocalizedError(result.error || "", t('deleteFailed')));
        }
      } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : t('deleteFailed');
        toast.error(getLocalizedError(errorMsg, t('deleteFailed')));
      } finally {
        router.refresh();
      }
    });
  };

  return { optimisticMasters, isPending, handleSave, handleDelete };
}
