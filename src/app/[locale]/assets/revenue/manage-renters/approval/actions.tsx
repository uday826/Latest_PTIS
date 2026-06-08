'use server';

import {
  getManageRentersApprovalPageDataAction as getManageRentersApprovalPageDataActionBase,
  getManageRentersAssetDetailsAction as getManageRentersAssetDetailsActionBase,
  getManageRentersVerificationDetailsAction as getManageRentersVerificationDetailsActionBase,
} from '../actions';

export async function getManageRentersApprovalPageDataAction(
  query: Record<string, string | string[] | undefined>
) {
  return getManageRentersApprovalPageDataActionBase(query);
}

export async function getManageRentersVerificationDetailsAction(id: number | string) {
  return getManageRentersVerificationDetailsActionBase(id);
}

export async function getManageRentersAssetDetailsAction(assetId: number | string) {
  return getManageRentersAssetDetailsActionBase(assetId);
}
