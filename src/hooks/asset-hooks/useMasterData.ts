'use client';
import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import type { MasterDataRecord, MasterDataType, MasterDataActions } from '@/types/asset-type/master-data.types';
import { applyOptimisticMasterUpdate, type OptimisticUpdate } from '@/lib/utils/asset-utils/masterDataUtils';

/**
 * Custom hook to manage master data records with optimistic UI updates.
 * Handles creation, updates, and deletion of records, and automatically syncs dependencies.
 */
export function useMasterData(initialMasters: MasterDataType[], externalActions?: MasterDataActions) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations('asset.configuration.masterData.messages');

  const [optimisticMasters, addOptimisticMaster] = useOptimistic(
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
      addOptimisticMaster({ action: editData ? 'update' : 'create', masterId, record: payload, recordId });

      try {
        if (!externalActions) throw new Error('API actions are not configured.');
        const result = editData
          ? await externalActions.updateAction(String(recordId), payload, masterId)
          : await externalActions.createAction(payload, masterId);

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
      addOptimisticMaster({ action: 'delete', masterId, recordId });

      try {
        if (!externalActions) throw new Error(t('unexpectedError'));
        const result = await externalActions.deleteAction(String(recordId), masterId);
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
