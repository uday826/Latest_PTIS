'use server';

import {
  getManageRentersAssetDetailsAction as getManageRentersAssetDetailsActionBase,
  getManageRentersVerificationDetailsAction as getManageRentersVerificationDetailsActionBase,
  getManageRentersVerificationPageDataAction as getManageRentersVerificationPageDataActionBase,
} from '../actions';

export async function getManageRentersVerificationPageDataAction(
  query: Record<string, string | string[] | undefined>
) {
  return getManageRentersVerificationPageDataActionBase(query);
}

export async function getManageRentersVerificationDetailsAction(id: number | string) {
  return getManageRentersVerificationDetailsActionBase(id);
}

export async function getManageRentersAssetDetailsAction(assetId: number | string) {
  return getManageRentersAssetDetailsActionBase(assetId);
}
