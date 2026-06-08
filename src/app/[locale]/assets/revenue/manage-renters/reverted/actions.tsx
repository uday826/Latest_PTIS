'use server';

import {
  getManageRentersAssetDetailsAction as getManageRentersAssetDetailsActionBase,
  getManageRentersVerificationDetailsAction as getManageRentersVerificationDetailsActionBase,
  getManageRentersRevertedPageDataAction as getManageRentersRevertedPageDataActionBase,
  getApplicationTypesAction as getApplicationTypesActionBase,
} from '../actions';

export async function getManageRentersVerificationDetailsAction(id: number | string) {
  return getManageRentersVerificationDetailsActionBase(id);
}

export async function getManageRentersRevertedPageDataAction(
  query: Record<string, string | string[] | undefined>
) {
  return getManageRentersRevertedPageDataActionBase(query);
}



export async function getManageRentersAssetDetailsAction(assetId: number | string) {
  return getManageRentersAssetDetailsActionBase(assetId);
}

export async function getApplicationTypesAction() {
  return getApplicationTypesActionBase();
}
