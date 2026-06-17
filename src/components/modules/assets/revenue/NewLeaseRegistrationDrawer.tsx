'use client';
/* eslint-disable i18next/no-literal-string */
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useTransition, useMemo, useState } from 'react';
import {
  Building2,
  Calendar,
  FileText,
  Grid,
  IndianRupee,
  MapPin,
  Phone,
  UploadCloud,
  User,
  Users,
  X,
  Mail,
  MapPinned,
  BadgeCheck,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { Button, Drawer, Label, MasterTable, type Column, useToast } from '@/components/common';
import { useTranslations } from 'next-intl';
import { EMAIL_REGEX } from '@/lib/utils/validation-rules';
import { kycValidators } from '@/lib/utils/kyc-validation.constants';
import { fetchAssetDocumentFile } from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';
import { uploadAssetLeaseRentDetailsDocumentAction, replaceLeaseRentDetailsDocumentAction } from '@/app/[locale]/assets/actions';
import type { AssetDocumentListItem } from '@/types/municipal-asset/detail-tabs.types';
import {
  DocumentPreviewDrawer,
  isImage,


  type LoadedDocumentFile,
  parseFileNameFromDisposition,
} from '@/components/modules/assets/municipal-Asset/detail-tabs/documentHelpers';
import type { PreviousTenantHistoryItem } from '@/lib/api/asset/asset-lease-rent-details.service';
import type {
  ApplicationTypeItem,
  AssetMasterDetails,
  FieldDef,
  FormState,
  LeaseRentRecord,
  NewLeaseRegistrationModalProps,
  TemplateDef,
} from '../../../../types/asset/revenue.types';
import {
  updateAssetLeaseRentDetailsAction,
  createLeaseRentRegistrationAction,
  getPreviousTenantHistoryAction,
  sendForVerificationAction,
} from '@/app/[locale]/assets/revenue/manage-renters/registration-actions';
import type { AssetLeaseRentDetailsUpdatePayload } from '@/lib/api/asset/asset-lease-rent-details.service';

function isBlank(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

function toDisplay(value: unknown): string {
  if (isBlank(value)) return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

function toCurrencyDisplay(value: unknown): string {
  if (isBlank(value)) return '-';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString('en-IN');
}

function toDateInputValue(value: unknown): string {
  if (typeof value !== 'string' || !value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function firstNonEmpty(...values: Array<unknown>): string {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
}

function toDateDisplay(value: unknown): string {
  if (typeof value !== 'string' || !value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN');
}

function getFileTitle(documentItem: AssetDocumentListItem): string {
  return documentItem.name || documentItem.fileName || 'Document';
}

type LeaseDocumentType = 'aadhar' | 'pan';

type LeaseDocumentCard = AssetDocumentListItem & {
  localFile?: File;
};

type StagedLeaseDocument = {
  file: File;
  replacingDocId?: number | string;
};

function getInitialApplicationTypeId(
  applicationTypes: ApplicationTypeItem[],
  record?: LeaseRentRecord | null
): number {
  if (!applicationTypes || applicationTypes.length === 0) return 1;
  const recordTypeId = Number((record as Record<string, unknown> | null)?.applicationTypeId);
  if (Number.isFinite(recordTypeId) && recordTypeId > 0) {
    const found = applicationTypes.find((t) => t.id === recordTypeId);
    if (found) return found.id;
  }
  const recordTypeName = String((record as Record<string, unknown> | null)?.applicationTypeName ?? '').trim().toLowerCase();
  if (recordTypeName) {
    const foundByName = applicationTypes.find((t) => t.applicationTypeName.trim().toLowerCase() === recordTypeName);
    if (foundByName) return foundByName.id;
  }
  const leaseType = record?.leaseType?.toLowerCase() ?? '';
  if (leaseType.includes('renew')) {
    const found = applicationTypes.find((t) => t.applicationTypeCode === 'APP-RENEWAL');
    if (found) return found.id;
  }
  if (leaseType.includes('transfer')) {
    const found = applicationTypes.find((t) => t.applicationTypeCode === 'APP-TRANSFER');
    if (found) return found.id;
  }
  if (leaseType.includes('terminat')) {
    const found = applicationTypes.find((t) => t.applicationTypeCode === 'APP-TERMINATION');
    if (found) return found.id;
  }
  if (leaseType.includes('modif')) {
    const found = applicationTypes.find((t) => t.applicationTypeCode === 'APP-MODIFICATION');
    if (found) return found.id;
  }
  const fallback = applicationTypes.find((t) => t.applicationTypeCode === 'APP-NEW') || applicationTypes[0];
  return fallback.id;
}

function buildInitialFormState(
  applicationTypeLabel: string,
  asset: AssetMasterDetails,
  record?: LeaseRentRecord | null
): FormState {
  const recordApplicationType = firstNonEmpty(
    record?.applicationTypeName,
    record?.leaseType,
    applicationTypeLabel
  );
  const rentValue = record?.monthlyRent != null ? String(record.monthlyRent).replace(/,/g, '') : '';
  return {
    applicationType: recordApplicationType,
    tenantName: firstNonEmpty(record?.tenantName),
    mobileNumber: firstNonEmpty(record?.tenantMobile, asset.inChargeMobile),
    emailAddress: firstNonEmpty(record?.tenantEmail, asset.inChargeEmail),
    tenantType: firstNonEmpty((record as Record<string, unknown> | null)?.tenantType, 'Individual'),
    aadhaarNumber: firstNonEmpty(record?.tenantAadhaarNo),
    panNumber: firstNonEmpty(record?.tenantPanCardNo),
    pinCode: firstNonEmpty(record?.pinCode, asset.pinCode),
    residentialAddress: firstNonEmpty(record?.tenantAddress, asset.address),
    shopNo: firstNonEmpty(record?.shopNo, asset.assetNo),
    shopName: firstNonEmpty(record?.shopName, asset.assetName),
    leaseType: firstNonEmpty(record?.leaseType, 'Rent'),
    leaseStartDate: toDateInputValue(record?.leaseStartDate ?? record?.submittedDate ?? asset.createdDate ?? ''),
    leaseEndDate: toDateInputValue(record?.leaseEndDate ?? asset.updatedDate ?? ''),
    monthlyRent: rentValue,
    securityDeposit: record?.securityDeposit != null ? String(record.securityDeposit).replace(/,/g, '') : '',
    paymentFrequency: firstNonEmpty(record?.paymentFrequency, 'Monthly'),
    existingTenantName: firstNonEmpty(record?.previousTenantName, record?.tenantName),
    oldLeaseStartDate: toDateInputValue(record?.oldLeaseStartDate ?? record?.submittedDate ?? asset.createdDate ?? ''),
    oldLeaseEndDate: toDateInputValue(record?.oldLeaseEndDate ?? asset.updatedDate ?? ''),
    renewalStartDate: toDateInputValue(record?.leaseStartDate ?? ''),
    renewalEndDate: toDateInputValue(record?.leaseEndDate ?? ''),
    previousRent: firstNonEmpty(record?.previousMonthlyRent, rentValue),
    revisedRent: firstNonEmpty(record?.monthlyRent ?? record?.rentMonthly),
    reasonForRenewal: firstNonEmpty(record?.reason),
    newTenantDetails: firstNonEmpty(record?.tenantName),
    newTenantMobile: firstNonEmpty(record?.tenantMobile),
    relationship: firstNonEmpty(record?.tenantType, 'Spouse'),
    nocFromExistingTenant: 'Yes',
    reasonForTransfer: firstNonEmpty(record?.reason),
    vacatingDate: toDateInputValue(record?.terminationDate ?? asset.updatedDate ?? ''),
    reasonForTermination: firstNonEmpty(record?.reason, 'Non-payment'),
    pendingDues: firstNonEmpty((record as Record<string, unknown> | null)?.pendingDues),
    securityDepositRefund: '0',
    finalInspectionReport: 'Yes',
    remarksDescription: '',
  };
}

function buildTemplate(
  applicationTypeId: number,
  applicationTypes: ApplicationTypeItem[],
  t: any
): TemplateDef {
  const currentType = applicationTypes.find((t) => t.id === applicationTypeId);
  const typeCode = currentType?.applicationTypeCode || 'APP-NEW';
  const typeOptions = applicationTypes.map((o) => o.applicationTypeName);

  const renewal: TemplateDef = {
    title: t('drawers.form.renewalTitle'),
    submitLabel: t('drawers.sendToVerification'),
    submitIcon: UploadCloud,
    fields: [
      { key: 'applicationType', label: t('drawers.form.applicationType'), icon: FileText, type: 'select', colSpan: 2, options: typeOptions },
      { key: 'existingTenantName', label: t('drawers.form.existingTenantName'), icon: User, type: 'text', placeholder: t('drawers.form.existingTenantNamePlaceholder'), required: true },
      { key: 'mobileNumber', label: t('drawers.form.mobileNumber'), icon: Phone, type: 'text', placeholder: t('drawers.form.mobileNumberPlaceholder') },
      { key: 'oldLeaseStartDate', label: t('drawers.form.oldLeaseStartDate'), icon: Calendar, type: 'date' },
      { key: 'oldLeaseEndDate', label: t('drawers.form.oldLeaseEndDate'), icon: Calendar, type: 'date' },
      { key: 'renewalStartDate', label: t('drawers.form.renewalStartDate'), icon: Calendar, type: 'date', required: true },
      { key: 'renewalEndDate', label: t('drawers.form.renewalEndDate'), icon: Calendar, type: 'date' },
      { key: 'previousRent', label: t('drawers.form.previousRent'), icon: IndianRupee, type: 'number', placeholder: t('drawers.form.previousRentPlaceholder') },
      { key: 'revisedRent', label: t('drawers.form.revisedRent'), icon: IndianRupee, type: 'number', placeholder: t('drawers.form.revisedRentPlaceholder'), required: true },
      { key: 'paymentFrequency', label: t('drawers.form.paymentFrequency'), icon: Calendar, type: 'select', options: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'] },
      { key: 'securityDeposit', label: t('drawers.form.securityDeposit'), icon: IndianRupee, type: 'number', placeholder: '0' },
      { key: 'leaseType', label: t('drawers.form.leaseType'), icon: FileText, type: 'select', options: ['Rent', 'Lease'] },
      { key: 'reasonForRenewal', label: t('drawers.form.reasonForRenewal'), icon: FileText, type: 'textarea', placeholder: t('drawers.form.reasonForRenewalPlaceholder'), colSpan: 2 },
    ],
  };

  const transfer: TemplateDef = {
    title: t('drawers.form.transferTitle'),
    submitLabel: t('drawers.sendToVerification'),
    submitIcon: UploadCloud,
    fields: [
      { key: 'applicationType', label: t('drawers.form.applicationType'), icon: FileText, type: 'select', colSpan: 2, options: typeOptions },
      { key: 'existingTenantName', label: t('drawers.form.existingTenantName'), icon: User, type: 'text', placeholder: t('drawers.form.existingTenantNamePlaceholder'), required: true },
      { key: 'mobileNumber', label: t('drawers.form.existingTenantMobile'), icon: Phone, type: 'text', placeholder: t('drawers.form.mobileNumberPlaceholder') },
      { key: 'newTenantDetails', label: t('drawers.form.newTenantName'), icon: User, type: 'text', placeholder: t('drawers.form.newTenantNamePlaceholder'), required: true },
      { key: 'newTenantMobile', label: t('drawers.form.newTenantMobile'), icon: Phone, type: 'text', placeholder: t('drawers.form.mobileNumberPlaceholder') },
      { key: 'relationship', label: t('drawers.form.relationship'), icon: BadgeCheck, type: 'select', options: ['Spouse', 'Son', 'Daughter', 'Other'] },
      { key: 'nocFromExistingTenant', label: t('drawers.form.nocFromExistingTenant'), icon: BadgeCheck, type: 'select', options: ['Yes', 'No'] },
      { key: 'reasonForTransfer', label: t('drawers.form.reasonForTransfer'), icon: FileText, type: 'textarea', placeholder: t('drawers.form.reasonForTransferPlaceholder'), colSpan: 2, required: true },
    ],
    secondaryButtons: [
      { label: t('drawers.form.legalHeirCertificate'), icon: UploadCloud, variant: 'success' },
    ],
  };

  const termination: TemplateDef = {
    title: t('drawers.form.terminationTitle'),
    submitLabel: t('drawers.sendToVerification'),
    submitIcon: UploadCloud,
    fields: [
      { key: 'applicationType', label: t('drawers.form.applicationType'), icon: FileText, type: 'select', colSpan: 2, options: typeOptions },
      { key: 'tenantName', label: t('drawers.form.tenantName'), icon: User, type: 'text', placeholder: t('drawers.form.tenantNamePlaceholder'), required: true },
      { key: 'mobileNumber', label: t('drawers.form.mobileNumber'), icon: Phone, type: 'text', placeholder: t('drawers.form.mobileNumberPlaceholder') },
      { key: 'vacatingDate', label: t('drawers.form.vacatingDate'), icon: Calendar, type: 'date', required: true },
      { key: 'reasonForTermination', label: t('drawers.form.reasonForTermination'), icon: FileText, type: 'select', options: ['Non-payment', 'Vacated', 'Policy', 'Other'] },
      { key: 'pendingDues', label: t('drawers.form.pendingDues'), icon: IndianRupee, type: 'number', placeholder: 'Amount' },
      { key: 'securityDepositRefund', label: t('drawers.form.securityDepositRefund'), icon: IndianRupee, type: 'number', placeholder: '0' },
      { key: 'finalInspectionReport', label: t('drawers.form.finalInspectionReport'), icon: FileText, type: 'select', options: ['Yes', 'No'] },
      { key: 'remarksDescription', label: t('drawers.form.remarksDescription'), icon: FileText, type: 'textarea', placeholder: t('drawers.form.remarksDescriptionPlaceholder'), colSpan: 2 },
    ],
  };

  const modification: TemplateDef = {
    title: t('drawers.form.modificationTitle'),
    submitLabel: t('drawers.sendToVerification'),
    submitIcon: UploadCloud,
    fields: [
      { key: 'applicationType', label: t('drawers.form.applicationType'), icon: FileText, type: 'select', colSpan: 2, options: typeOptions },
      { key: 'tenantName', label: t('drawers.form.tenantName'), icon: User, type: 'text', placeholder: t('drawers.form.tenantNamePlaceholder'), required: true },
      { key: 'mobileNumber', label: t('drawers.form.mobileNumber'), icon: Phone, type: 'text', placeholder: t('drawers.form.mobileNumberPlaceholder') },
      { key: 'leaseType', label: t('drawers.form.leaseType'), icon: FileText, type: 'select', options: ['Rent', 'Lease'] },
      { key: 'previousRent', label: t('drawers.form.previousRent'), icon: IndianRupee, type: 'number', placeholder: t('drawers.form.previousRentPlaceholder') },
      { key: 'revisedRent', label: t('drawers.form.revisedRent'), icon: IndianRupee, type: 'number', placeholder: t('drawers.form.revisedRentPlaceholder'), required: true },
      { key: 'paymentFrequency', label: t('drawers.form.paymentFrequency'), icon: Calendar, type: 'select', options: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'] },
      { key: 'leaseStartDate', label: t('drawers.form.leaseStartDate'), icon: Calendar, type: 'date' },
      { key: 'leaseEndDate', label: t('drawers.form.leaseEndDate'), icon: Calendar, type: 'date' },
      { key: 'remarksDescription', label: t('drawers.form.remarksDescription'), icon: FileText, type: 'textarea', placeholder: t('drawers.form.remarksDescriptionPlaceholder'), colSpan: 2 },
    ],
  };

  const newApp: TemplateDef = {
    title: t('drawers.form.newAppTitle'),
    submitLabel: t('drawers.sendToVerification'),
    submitIcon: UploadCloud,
    fields: [
      { key: 'applicationType', label: t('drawers.form.applicationType'), icon: FileText, type: 'select', colSpan: 2, options: typeOptions },
      { key: 'shopNo', label: t('drawers.form.shopNo'), icon: Building2, type: 'text', placeholder: 'e.g. UT-001' },
      { key: 'shopName', label: t('drawers.form.shopName'), icon: Building2, type: 'text', placeholder: t('drawers.form.shopNamePlaceholder') },
      { key: 'tenantName', label: t('drawers.form.tenantName'), icon: User, type: 'text', placeholder: t('drawers.form.tenantNamePlaceholder'), required: true },
      { key: 'mobileNumber', label: t('drawers.form.mobileNumber'), icon: Phone, type: 'text', placeholder: t('drawers.form.mobileNumberPlaceholder'), required: true },
      { key: 'emailAddress', label: t('drawers.form.emailAddress'), icon: Mail, type: 'text', placeholder: 'email@example.com', required: true },
      { key: 'tenantType', label: t('drawers.form.tenantType'), icon: BadgeCheck, type: 'select', options: ['Individual', 'Business', 'Government', 'Trust'] },
      { key: 'aadhaarNumber', label: t('drawers.form.aadhaarNumber'), icon: FileText, type: 'text', placeholder: t('drawers.form.aadhaarNumberPlaceholder') },
      { key: 'panNumber', label: t('drawers.form.panNumber'), icon: FileText, type: 'text', placeholder: t('drawers.form.panNumberPlaceholder') },
      { key: 'leaseType', label: t('drawers.form.leaseType'), icon: FileText, type: 'select', options: ['Rent', 'Lease'], required: true },
      { key: 'monthlyRent', label: t('drawers.form.monthlyRent'), icon: IndianRupee, type: 'number', placeholder: '0.00', required: true },
      { key: 'leaseStartDate', label: t('drawers.form.leaseStartDate'), icon: Calendar, type: 'date', required: true },
      { key: 'leaseEndDate', label: t('drawers.form.leaseEndDate'), icon: Calendar, type: 'date' },
      { key: 'securityDeposit', label: t('drawers.form.securityDeposit'), icon: IndianRupee, type: 'number', placeholder: '0.00' },
      { key: 'paymentFrequency', label: t('drawers.form.paymentFrequency'), icon: Calendar, type: 'select', options: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'] },
      { key: 'pinCode', label: t('drawers.form.pinCode'), icon: MapPinned, type: 'text', placeholder: t('drawers.form.pinCodePlaceholder') },
      { key: 'residentialAddress', label: t('drawers.form.residentialAddress'), icon: MapPin, type: 'textarea', placeholder: t('drawers.form.residentialAddressPlaceholder'), colSpan: 2 },
      { key: 'remarksDescription', label: t('drawers.form.remarksDescription'), icon: FileText, type: 'textarea', placeholder: t('drawers.form.remarksDescriptionPlaceholder'), colSpan: 2, required: true },
    ],
    secondaryButtons: [
      { label: t('drawers.form.uploadAadhaar'), icon: UploadCloud, variant: 'primary' },
      { label: t('drawers.form.uploadPan'), icon: UploadCloud, variant: 'success' },
    ],
  };

  switch (typeCode) {
    case 'APP-RENEWAL':
      return renewal;
    case 'APP-TRANSFER':
      return transfer;
    case 'APP-TERMINATION':
      return termination;
    case 'APP-MODIFICATION':
      return modification;
    default:
      return newApp;
  }
}

function buildSubmitData(
  formState: FormState,
  assetId: number,
  selectedTypeId: number,
  typeCode: string
) {
  const toNum = (v: string) => {
    const n = parseFloat(v.replace(/,/g, ''));
    return Number.isFinite(n) ? n : undefined;
  };

  switch (typeCode) {
    case 'APP-RENEWAL':
      return {
        assetId,
        applicationTypeId: selectedTypeId,
        tenantType: 'Individual',
        previousTenantName: formState.existingTenantName || undefined,
        previousTenantMobile: formState.mobileNumber || undefined,
        tenantName: formState.existingTenantName || 'N/A',
        tenantMobile: formState.mobileNumber || undefined,
        leaseType: formState.leaseType || 'Rent',
        oldLeaseStartDate: formState.oldLeaseStartDate || undefined,
        oldLeaseEndDate: formState.oldLeaseEndDate || undefined,
        leaseStartDate: formState.renewalStartDate || undefined,
        leaseEndDate: formState.renewalEndDate || undefined,
        previousMonthlyRent: toNum(formState.previousRent),
        monthlyRent: toNum(formState.revisedRent),
        securityDeposit: toNum(formState.securityDeposit),
        paymentFrequency: formState.paymentFrequency || 'Monthly',
        reason: formState.reasonForRenewal || undefined,
      };

    case 'APP-TRANSFER':
      return {
        assetId,
        applicationTypeId: selectedTypeId,
        previousTenantName: formState.existingTenantName || undefined,
        previousTenantMobile: formState.mobileNumber || undefined,
        tenantName: formState.newTenantDetails || 'N/A',
        tenantMobile: formState.newTenantMobile || undefined,
        tenantType: formState.relationship || undefined,
        reason: formState.reasonForTransfer || undefined,
      };

    case 'APP-TERMINATION':
      return {
        assetId,
        applicationTypeId: selectedTypeId,
        tenantType: 'Individual',
        tenantName: formState.tenantName || 'N/A',
        tenantMobile: formState.mobileNumber || undefined,
        terminationDate: formState.vacatingDate || undefined,
        securityDeposit: toNum(formState.securityDepositRefund),
        reason: [formState.reasonForTermination, formState.remarksDescription].filter(Boolean).join(' - ') || undefined,
      };

    case 'APP-MODIFICATION':
      return {
        assetId,
        applicationTypeId: selectedTypeId,
        tenantType: 'Individual',
        tenantName: formState.tenantName || 'N/A',
        tenantMobile: formState.mobileNumber || undefined,
        leaseType: formState.leaseType || 'Rent',
        previousMonthlyRent: toNum(formState.previousRent),
        monthlyRent: toNum(formState.revisedRent),
        paymentFrequency: formState.paymentFrequency || 'Monthly',
        leaseStartDate: formState.leaseStartDate || undefined,
        leaseEndDate: formState.leaseEndDate || undefined,
        reason: formState.remarksDescription || undefined,
      };

    default: // APP-NEW
      return {
        assetId,
        applicationTypeId: selectedTypeId,
        shopNo: formState.shopNo || undefined,
        shopName: formState.shopName || undefined,
        tenantName: formState.tenantName || 'N/A',
        tenantMobile: formState.mobileNumber || undefined,
        tenantEmail: formState.emailAddress || undefined,
        tenantType: formState.tenantType || 'Individual',
        tenantAadhaarNo: formState.aadhaarNumber || undefined,
        tenantPanCardNo: formState.panNumber || undefined,
        tenantAddress: formState.residentialAddress || undefined,
        leaseType: formState.leaseType || 'Rent',
        leaseStartDate: formState.leaseStartDate || undefined,
        leaseEndDate: formState.leaseEndDate || undefined,
        monthlyRent: toNum(formState.monthlyRent),
        securityDeposit: toNum(formState.securityDeposit),
        paymentFrequency: formState.paymentFrequency || 'Monthly',
        reason: formState.remarksDescription || undefined,
      };
  }
}

function extractLeaseRentDetailsId(result: unknown): number {
  if (!result || typeof result !== 'object') return 0;

  const body = result as Record<string, unknown>;
  const candidates = [
    body.items,
    body.Items,
    body.data,
    body.Data,
    body.result,
    body.Result,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'object') {
      const item = candidate as Record<string, unknown>;
      const rawId = item.id ?? item.Id ?? item.assetLeaseRentDetailsId ?? item.AssetLeaseRentDetailsId;
      const parsedId = Number(rawId);
      if (Number.isFinite(parsedId) && parsedId > 0) return parsedId;
    }
  }

  const directId = Number(body.id ?? body.Id);
  return Number.isFinite(directId) && directId > 0 ? directId : 0;
}

function toPositiveNumber(value: unknown): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function DetailChip({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 relative mt-3 shadow-sm flex flex-col items-center justify-center">
      <span className="absolute -top-3 bg-[#0a869e] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
        {label}
      </span>
      <span className="text-sm font-black text-slate-800 mt-2">{toDisplay(value)}</span>
    </div>
  );
}

function RenderField({
  field,
  value,
  setValue,
  disabled = false,
}: {
  field: FieldDef;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
}) {
  const Icon = field.icon;
  const isReadOnlyField = field.key === 'shopNo' || field.key === 'shopName';
  const wrapperClassName = `space-y-1 ${field.colSpan === 2 ? 'col-span-2' : ''}`;
  const sharedInputClass = `w-full h-8 px-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 ${isReadOnlyField ? 'bg-slate-50 cursor-not-allowed text-slate-500' : 'bg-white'
    }`;
  const maxLengthByKey: Partial<Record<keyof FormState, number>> = {
    tenantName: 500,
    mobileNumber: 10,
    emailAddress: 200,
    tenantType: 50,
    aadhaarNumber: 12,
    panNumber: 10,
    pinCode: 6,
    residentialAddress: 500,
    shopNo: 50,
    shopName: 200,
    leaseType: 20,
    paymentFrequency: 20,
    existingTenantName: 500,
    previousRent: 20,
    revisedRent: 20,
    newTenantDetails: 500,
    newTenantMobile: 10,
    relationship: 50,
    nocFromExistingTenant: 3,
    reasonForTransfer: 1000,
    reasonForRenewal: 1000,
    reasonForTermination: 1000,
    pendingDues: 20,
    securityDepositRefund: 20,
    remarksDescription: 1000,
    leaseStartDate: 10,
    leaseEndDate: 10,
    oldLeaseStartDate: 10,
    oldLeaseEndDate: 10,
    renewalStartDate: 10,
    renewalEndDate: 10,
    vacatingDate: 10,
    applicationType: 100,
    monthlyRent: 20,
    securityDeposit: 20,
  };
  const maxLength = maxLengthByKey[field.key];

  const handleChange = (nextValue: string) => {
    if (field.type === 'number') {
      const cleaned = nextValue.replace(/[^0-9.]/g, '');
      const parts = cleaned.split('.');
      const normalized = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
      setValue(normalized);
      return;
    }

    if (field.key === 'tenantName' || field.key === 'existingTenantName' || field.key === 'newTenantDetails') {
      setValue(nextValue.replace(/[^a-zA-Z\s]/g, ''));
      return;
    }

    if (field.key === 'emailAddress') {
      setValue(nextValue.replace(/[^a-zA-Z0-9@._%+-]/g, ''));
      return;
    }

    if (field.key === 'residentialAddress' || field.key === 'shopNo' || field.key === 'shopName' || field.key === 'remarksDescription' || field.key === 'reasonForRenewal' || field.key === 'reasonForTransfer' || field.key === 'reasonForTermination') {
      setValue(nextValue.replace(/[<>]/g, ''));
      return;
    }

    if (field.key === 'mobileNumber' || field.key === 'newTenantMobile' || field.key === 'pinCode') {
      const digitsOnly = nextValue.replace(/\D/g, '');
      const limited = digitsOnly.slice(0, maxLength ?? digitsOnly.length);
      setValue(limited);
      return;
    }

    if (field.key === 'aadhaarNumber') {
      const cleaned = nextValue.replace(/[^0-9]/g, '').slice(0, maxLength ?? nextValue.length);
      setValue(cleaned);
      return;
    }

    if (field.key === 'panNumber') {
      const cleaned = nextValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, maxLength ?? nextValue.length);
      setValue(cleaned);
      return;
    }

    setValue(nextValue);
  };

  return (
    <div className={wrapperClassName}>
      <Label required={field.required} className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
        <Icon className="w-3 h-3 text-slate-400" /> {field.label}
      </Label>
      {field.type === 'select' ? (
        <select
          className={sharedInputClass}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          aria-disabled={disabled}
        >
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          className="w-full min-h-[60px] px-2 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <input
          type={field.type === 'number' ? 'number' : field.type}
          className={sharedInputClass}
          placeholder={field.placeholder}
          value={value}
          readOnly={isReadOnlyField}
          aria-readonly={isReadOnlyField}
          onChange={(e) => handleChange(e.target.value)}
          maxLength={field.type !== 'number' ? maxLength : undefined}
          min={field.type === 'number' ? 0 : undefined}
          step={field.type === 'number' ? 'any' : undefined}
        />
      )}
    </div>
  );
}

interface OverviewTableRow extends Record<string, unknown> {
  zoneNo: string;
  wardNo: string;
  unitName: string;
  shopNumber: string;
  shopActNumber: string;
}

interface ConstructionTableRow extends Record<string, unknown> {
  shopNo: string;
  shopArea: string;
  renterName: string;
  monthlyRent: string;
  bharaniKaalavadi: number | string;
  status: string;
}

export function NewLeaseRegistrationModal({
  asset,
  record,
  documents = [],
  assetPhotosAndPlans = [],
  applicationTypes = [],
  onClose,
}: NewLeaseRegistrationModalProps) {
  const t = useTranslations('revenueManagement');
  const [activeTab, setActiveTab] = useState<'new' | 'previous'>('new');
  const [localDocuments, setLocalDocuments] = useState<LeaseDocumentCard[]>(() => documents);
  const [stagedDocuments, setStagedDocuments] = useState<Record<LeaseDocumentType, StagedLeaseDocument | null>>({
    aadhar: null,
    pan: null,
  });
  const [selectedTypeId, setSelectedTypeId] = useState<number>(() =>
    getInitialApplicationTypeId(applicationTypes, record)
  );
  const [isPending, startTransition] = useTransition();
  const { success: toastSuccess, error: toastError } = useToast();
  const [historyItems, setHistoryItems] = useState<PreviousTenantHistoryItem[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<LeaseDocumentCard | null>(null);
  const [loadedFile, setLoadedFile] = useState<LoadedDocumentFile | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({});
  const aadharInputRef = useRef<HTMLInputElement | null>(null);
  const panInputRef = useRef<HTMLInputElement | null>(null);

  const revokeLoadedFile = useCallback(() => {
    setLoadedFile((current) => {
      if (current?.objectUrl) URL.revokeObjectURL(current.objectUrl);
      return null;
    });
  }, []);

  useEffect(() => revokeLoadedFile, [revokeLoadedFile]);

  useEffect(() => {
    const recordId = Number(record?.id);
    if (!recordId) return;
    const loadHistory = async () => {
      try {
        const items = await getPreviousTenantHistoryAction(recordId);
        setHistoryItems(items);
      } catch {
        console.error('Failed to load previous tenant history.');
      }
    };
    loadHistory();
  }, [record?.id]);

  const tabs: Array<'new' | 'previous'> = ['new', 'previous'];

  const selectedType = useMemo(() => {
    return applicationTypes.find((t) => t.id === selectedTypeId) || applicationTypes[0];
  }, [selectedTypeId, applicationTypes]);
  const isRevertedRecord = (record?.workflowStatus ?? '').toLowerCase() === 'reverted';

  const template = useMemo(() => buildTemplate(selectedTypeId, applicationTypes, t), [selectedTypeId, applicationTypes, t]);
  const initialFormState = useMemo(
    () => buildInitialFormState(selectedType?.applicationTypeName || '', asset, record),
    [selectedType, asset, record]
  );
  const [formState, setFormState] = useState<FormState>(() => initialFormState);

  useEffect(() => {
    setFormState(initialFormState);
  }, [initialFormState]);

  const handleFormFieldChange = useCallback(
    (fieldKey: keyof FormState, nextValue: string) => {
      const nextState = { ...formState, [fieldKey]: nextValue } as FormState;

      const isAfter = (startValue: string, endValue: string) => {
        if (!startValue || !endValue) return false;
        const start = new Date(startValue);
        const end = new Date(endValue);
        return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start > end;
      };

      if (fieldKey === 'leaseStartDate' && nextState.leaseEndDate && isAfter(nextState.leaseStartDate, nextState.leaseEndDate)) {
        toastError('Lease start date cannot be later than the lease end date.');
        return;
      }
      if (fieldKey === 'leaseEndDate' && nextState.leaseStartDate && isAfter(nextState.leaseStartDate, nextState.leaseEndDate)) {
        toastError('Lease end date cannot be earlier than the lease start date.');
        return;
      }
      if (fieldKey === 'oldLeaseStartDate' && nextState.oldLeaseEndDate && isAfter(nextState.oldLeaseStartDate, nextState.oldLeaseEndDate)) {
        toastError('Old lease start date cannot be later than the old lease end date.');
        return;
      }
      if (fieldKey === 'oldLeaseEndDate' && nextState.oldLeaseStartDate && isAfter(nextState.oldLeaseStartDate, nextState.oldLeaseEndDate)) {
        toastError('Old lease end date cannot be earlier than the old lease start date.');
        return;
      }
      if (fieldKey === 'renewalStartDate' && nextState.renewalEndDate && isAfter(nextState.renewalStartDate, nextState.renewalEndDate)) {
        toastError('Renewal start date cannot be later than the renewal end date.');
        return;
      }
      if (fieldKey === 'renewalEndDate' && nextState.renewalStartDate && isAfter(nextState.renewalStartDate, nextState.renewalEndDate)) {
        toastError('Renewal end date cannot be earlier than the renewal start date.');
        return;
      }
      if (fieldKey === 'renewalStartDate' && nextState.oldLeaseEndDate && nextState.renewalStartDate) {
        const renewalStart = new Date(nextState.renewalStartDate);
        const oldEnd = new Date(nextState.oldLeaseEndDate);
        if (!Number.isNaN(renewalStart.getTime()) && !Number.isNaN(oldEnd.getTime()) && renewalStart < oldEnd) {
          toastError('Renewal start date cannot be earlier than the old lease end date.');
          return;
        }
      }

      setFormState(nextState);
    },
    [formState, toastError]
  );

  function isValidPositiveAmount(value: string): boolean {
    if (!value) return false;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0;
  }

  function isValidNonNegativeAmount(value: string): boolean {
    if (!value) return false;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0;
  }
  const readDocumentFile = useCallback(async (documentItem: LeaseDocumentCard) => {
    if (documentItem.localFile) {
      return {
        objectUrl: URL.createObjectURL(documentItem.localFile),
        contentType: documentItem.localFile.type || 'application/octet-stream',
        fileName: documentItem.localFile.name || documentItem.fileName || documentItem.name,
      } satisfies LoadedDocumentFile;
    }

    const result = await fetchAssetDocumentFile(documentItem.id);
    if (result.error || !result.base64) {
      throw new Error(result.error || 'Unable to load this file.');
    }

    const binaryStr = atob(result.base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const blob = new Blob([bytes], {
      type: result.contentType || documentItem.contentType || 'application/octet-stream',
    });
    const fileName =
      parseFileNameFromDisposition(result.contentDisposition) ||
      documentItem.fileName ||
      documentItem.name;

    return {
      objectUrl: URL.createObjectURL(blob),
      contentType: result.contentType || documentItem.contentType || 'application/octet-stream',
      fileName,
    } satisfies LoadedDocumentFile;
  }, []);

  const readDocumentThumbnailSrc = useCallback(async (documentItem: LeaseDocumentCard) => {
    if (documentItem.localFile) {
      return URL.createObjectURL(documentItem.localFile);
    }

    const result = await fetchAssetDocumentFile(documentItem.id);
    if (result.error || !result.base64) {
      throw new Error(result.error || 'Unable to load this file.');
    }

    const contentType = result.contentType || documentItem.contentType || 'application/octet-stream';
    return `data:${contentType};base64,${result.base64}`;
  }, []);

  const uploadStagedDocuments = useCallback(
    async (leaseRentDetailsId: number) => {
      const stagedEntries: Array<[LeaseDocumentType, StagedLeaseDocument | null]> = [
        ['aadhar', stagedDocuments.aadhar],
        ['pan', stagedDocuments.pan],
      ];

      let uploadFailed = false;

      for (const [type, staged] of stagedEntries) {
        if (!staged) continue;

        const existingDoc = localDocuments.find(
          (doc) => (doc.name || '').toLowerCase() === type.toLowerCase() && !String(doc.id).startsWith(`local-${type}`)
        );

        let res;
        if (existingDoc?.documentId) {
          const fd = new FormData();
          fd.append('File', staged.file);
          fd.append('UpdatedByUserId', '1');
          res = await replaceLeaseRentDetailsDocumentAction(existingDoc.documentId, fd);
        } else {
          const fd = new FormData();
          fd.append('File', staged.file);
          fd.append('AssetLeaseRentDetailsId', String(leaseRentDetailsId));
          fd.append('ModuleId', '0');
          const floorSource = record as LeaseRentRecord & {
            floorDetailsId?: number | string | null;
            floorDetailId?: number | string | null;
            floorId?: number | string | null;
          };
          const floorDetailId = floorSource?.floorDetailsId ?? floorSource?.floorDetailId ?? floorSource?.floorId;
          if (floorDetailId != null) {
            fd.append('FloorDetailId', String(floorDetailId));
          }
          fd.append('DocumentType', type);
          fd.append('DocumentTitle', type);
          fd.append('UploadedByUserId', '1');

          res = await uploadAssetLeaseRentDetailsDocumentAction(fd);
        }

        if (res.success && res.data) {
          const uploadedDoc: LeaseDocumentCard = {
            id: res.data.assetDocumentId || existingDoc?.id || res.data.id,
            documentId: res.data.documentId || existingDoc?.documentId || res.data.coreDocumentId,
            assetId:
              toPositiveNumber(res.data.assetId) ??
              asset.id ??
              record?.assetMasterId ??
              leaseRentDetailsId,
            name: type,
            fileName: res.data.fileName || staged.file.name,
            contentType: staged.file.type,
            uploadedDate: new Date().toISOString(),
            fileSize: res.data.fileSizeBytes || staged.file.size,
            status: 'Uploaded',
          };

          setLocalDocuments((prev) => {
            const filtered = prev.filter((doc) => (doc.name || '').toLowerCase() !== type.toLowerCase());
            return [...filtered, uploadedDoc];
          });
        } else {
          uploadFailed = true;
          toastError(res.error || `Failed to upload/replace ${type === 'aadhar' ? 'Aadhaar' : 'PAN'} document.`);
        }
      }

      if (!uploadFailed) {
        setStagedDocuments({ aadhar: null, pan: null });
      }

      return !uploadFailed;
    },
    [asset.id, localDocuments, record, stagedDocuments.aadhar, stagedDocuments.pan, toastError]
  );

  const handleUpdateRegistration = () => {
    const assetId = Number(record?.assetMasterId ?? asset.id ?? asset.assetId ?? 0);
    const recordId = Number(record?.id);

    console.log('Lease registration submit trace', {
      recordId,
      recordAssetMasterId: record?.assetMasterId,
      assetIdProp: asset.id,
      assetAssetIdProp: asset.assetId,
      resolvedAssetId: assetId,
      selectedTypeCode: selectedType?.applicationTypeCode,
      selectedTypeId,
    });

    if (!assetId || Number.isNaN(assetId)) {
      toastError('Asset ID is missing or invalid.');
      return;
    }

    const hasField = (key: string) => template.fields.some((f) => f.key === key);
    const getFieldValue = (key: keyof FormState) => (formState[key] ?? '').toString().trim();

    const requiredField = template.fields.find((field) => {
      if (!field.required) return false;
      const value = getFieldValue(field.key);
      return value.length === 0;
    });

    if (requiredField) {
      toastError(`${requiredField.label} is required.`);
      return;
    }

    // Validate Mobile Number (Indian format: 10 digits starting with 6-9)
    const mobileNumberDigits = formState.mobileNumber.replace(/\D/g, '');
    const newTenantMobileDigits = formState.newTenantMobile.replace(/\D/g, '');
    if (hasField('mobileNumber') && formState.mobileNumber) {
      if (kycValidators.hasRepeatedSequence(mobileNumberDigits, 5)) {
        toastError('Mobile number cannot contain repeated digits.');
        return;
      }
      if (!kycValidators.isValidMobile(formState.mobileNumber)) {
        toastError('Mobile number must be a valid Indian 10-digit number starting with 6, 7, 8, or 9.');
        return;
      }
    }
    if (hasField('newTenantMobile') && formState.newTenantMobile) {
      if (kycValidators.hasRepeatedSequence(newTenantMobileDigits, 5)) {
        toastError('New tenant mobile number cannot contain repeated digits.');
        return;
      }
      if (!kycValidators.isValidMobile(formState.newTenantMobile)) {
        toastError('New tenant mobile number must be a valid Indian 10-digit number starting with 6, 7, 8, or 9.');
        return;
      }
    }

    // Validate Pin Code (6 digits)
    const pinReg = /^[0-9]{6}$/;
    if (hasField('pinCode') && formState.pinCode && !pinReg.test(formState.pinCode)) {
      toastError('Pin code must be a valid 6-digit number.');
      return;
    }

    // Validate PAN Number (5 letters, 4 digits, 1 letter)
    const panReg = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
    if (hasField('panNumber') && formState.panNumber && !panReg.test(formState.panNumber)) {
      toastError('PAN card number must be in the format: ABCDE1234F.');
      return;
    }

    // Validate Aadhaar Number (Indian format: 12 digits with valid start and no repeated sequences)
    const aadhaarDigits = formState.aadhaarNumber.replace(/\D/g, '');
    if (hasField('aadhaarNumber') && formState.aadhaarNumber) {
      if (kycValidators.hasRepeatedSequence(aadhaarDigits, 5)) {
        toastError('Aadhaar number cannot contain repeated digits.');
        return;
      }
      if (!kycValidators.isValidAadhar(formState.aadhaarNumber)) {
        toastError('Aadhaar number must be a valid 12-digit Aadhaar number.');
        return;
      }
    }
    if (hasField('emailAddress') && formState.emailAddress && !EMAIL_REGEX.test(formState.emailAddress)) {
      toastError('Email address must be a valid email format.');
      return;
    }

    if (hasField('tenantName') && /[^a-zA-Z\s'.-]/.test(formState.tenantName)) {
      toastError('Tenant name can only contain letters and spaces.');
      return;
    }
    if (hasField('existingTenantName') && /[^a-zA-Z\s]/.test(formState.existingTenantName)) {
      toastError('Existing tenant name can only contain letters and spaces.');
      return;
    }
    if (hasField('newTenantDetails') && /[^a-zA-Z\s]/.test(formState.newTenantDetails)) {
      toastError('New tenant name can only contain letters and spaces.');
      return;
    }

    if (hasField('mobileNumber') && /[^0-9]/.test(formState.mobileNumber)) {
      toastError('Mobile number must contain only digits.');
      return;
    }
    if (hasField('newTenantMobile') && /[^0-9]/.test(formState.newTenantMobile)) {
      toastError('New tenant mobile number must contain only digits.');
      return;
    }
    if (hasField('pinCode') && /[^0-9]/.test(formState.pinCode)) {
      toastError('Pin code must contain only digits.');
      return;
    }
    if (hasField('aadhaarNumber') && /[^0-9]/.test(formState.aadhaarNumber)) {
      toastError('Aadhaar number must contain only digits.');
      return;
    }
    if (hasField('panNumber') && /[^a-zA-Z0-9]/.test(formState.panNumber)) {
      toastError('PAN number must contain only letters and digits.');
      return;
    }
    if (hasField('remarksDescription') && /[<>]/.test(formState.remarksDescription)) {
      toastError('Remarks cannot contain special characters like < or >.');
      return;
    }
    if (hasField('reasonForRenewal') && /[<>]/.test(formState.reasonForRenewal)) {
      toastError('Reason for renewal cannot contain special characters like < or >.');
      return;
    }
    if (hasField('reasonForTransfer') && /[<>]/.test(formState.reasonForTransfer)) {
      toastError('Reason for transfer cannot contain special characters like < or >.');
      return;
    }
    if (hasField('reasonForTermination') && /[<>]/.test(formState.reasonForTermination)) {
      toastError('Reason for termination cannot contain special characters like < or >.');
      return;
    }

    // Validate dates: leaseStartDate <= leaseEndDate
    if (hasField('leaseStartDate') && hasField('leaseEndDate') && formState.leaseStartDate && formState.leaseEndDate) {
      const start = new Date(formState.leaseStartDate);
      const end = new Date(formState.leaseEndDate);
      if (start.getTime() === end.getTime()) {
        toastError('Lease start date and lease end date cannot be the same.');
        return;
      }
      if (start > end) {
        toastError('Lease start date cannot be later than the lease end date.');
        return;
      }
    }

    // Validate renewal dates: renewalStartDate <= renewalEndDate
    if (hasField('renewalStartDate') && hasField('renewalEndDate') && formState.renewalStartDate && formState.renewalEndDate) {
      const start = new Date(formState.renewalStartDate);
      const end = new Date(formState.renewalEndDate);
      if (start.getTime() === end.getTime()) {
        toastError('Renewal start date and renewal end date cannot be the same.');
        return;
      }
      if (start > end) {
        toastError('Renewal start date cannot be later than the renewal end date.');
        return;
      }
    }

    // Validate old lease dates: oldLeaseStartDate <= oldLeaseEndDate
    if (hasField('oldLeaseStartDate') && hasField('oldLeaseEndDate') && formState.oldLeaseStartDate && formState.oldLeaseEndDate) {
      const start = new Date(formState.oldLeaseStartDate);
      const end = new Date(formState.oldLeaseEndDate);
      if (start.getTime() === end.getTime()) {
        toastError('Old lease start date and old lease end date cannot be the same.');
        return;
      }
      if (start > end) {
        toastError('Old lease start date cannot be later than the old lease end date.');
        return;
      }
    }

    // Validate renewal start date vs old lease end date
    if (hasField('renewalStartDate') && hasField('oldLeaseEndDate') && formState.renewalStartDate && formState.oldLeaseEndDate) {
      const renewalStart = new Date(formState.renewalStartDate);
      const oldEnd = new Date(formState.oldLeaseEndDate);
      if (renewalStart < oldEnd) {
        toastError('Renewal start date cannot be earlier than the old lease end date.');
        return;
      }
    }

    if (hasField('monthlyRent') && formState.monthlyRent && !isValidPositiveAmount(formState.monthlyRent)) {
      toastError('Monthly rent must be greater than zero.');
      return;
    }
    if (hasField('securityDeposit') && formState.securityDeposit && !isValidPositiveAmount(formState.securityDeposit)) {
      toastError('Security deposit must be greater than zero.');
      return;
    }
    if (hasField('previousRent') && formState.previousRent && !isValidNonNegativeAmount(formState.previousRent)) {
      toastError('Previous rent must be a non-negative number.');
      return;
    }
    if (hasField('revisedRent') && formState.revisedRent && !isValidNonNegativeAmount(formState.revisedRent)) {
      toastError('Revised rent must be a non-negative number.');
      return;
    }
    if (hasField('pendingDues') && formState.pendingDues && !isValidNonNegativeAmount(formState.pendingDues)) {
      toastError('Pending dues must be a non-negative number.');
      return;
    }
    if (hasField('securityDepositRefund') && formState.securityDepositRefund && !isValidNonNegativeAmount(formState.securityDepositRefund)) {
      toastError('Security deposit refund must be a non-negative number.');
      return;
    }

    const typeCode = selectedType?.applicationTypeCode || 'APP-NEW';
    const payload = buildSubmitData(formState, assetId, selectedTypeId, typeCode);

    startTransition(async () => {
      try {
        let result;
        let leaseRentDetailsId = Number.isFinite(recordId) && recordId > 0 ? recordId : 0;
        if (isRevertedRecord) {
          if (!Number.isFinite(recordId) || recordId <= 0) {
            toastError('Reverted record ID is missing or invalid.');
            return;
          }

          const parentAssetId =
            toPositiveNumber(asset.id) ??
            toPositiveNumber(record?.assetMasterId) ??
            toPositiveNumber(asset.assetId);
          const sendPayload: AssetLeaseRentDetailsUpdatePayload = {
            id: recordId,
            isActive: true,
            parentAssetId,
            assetNo: asset.assetNo ?? record?.assetNo ?? null,
            assetName: asset.assetName ?? record?.shopName ?? null,
            category: record?.assetCategory ?? record?.category ?? asset.assetCategoryName ?? null,
            zone: asset.zoneName ?? record?.zone ?? null,
            wardNo: asset.wardName ?? record?.ward ?? null,
            ...payload,
          };

          result = await sendForVerificationAction(recordId, sendPayload);
          if (result.success) {
            if (leaseRentDetailsId > 0) {
              const uploadsOk = await uploadStagedDocuments(leaseRentDetailsId);
              if (!uploadsOk) {
                toastError('Sent to verification, but one or more documents failed to upload.');
              }
            }
            toastSuccess('Sent to verification successfully!');
            setTimeout(() => onClose(), 1500);
          } else {
            toastError(result.message || 'Failed to send to verification.');
          }
          return;
        }

        const isNew = typeCode === 'APP-NEW';
        const canUpdate = Number.isFinite(recordId) && recordId > 0 && !isNew;

        if (canUpdate) {
          const targetRecordId = recordId;
          const parentAssetId =
            toPositiveNumber(asset.id) ??
            toPositiveNumber(record?.assetMasterId) ??
            toPositiveNumber(asset.assetId);
          const updatePayload: AssetLeaseRentDetailsUpdatePayload = {
            id: targetRecordId,
            isActive: true,
            parentAssetId,
            assetNo: asset.assetNo ?? record?.assetNo ?? null,
            assetName: asset.assetName ?? record?.shopName ?? null,
            category: record?.assetCategory ?? record?.category ?? asset.assetCategoryName ?? null,
            zone: asset.zoneName ?? record?.zone ?? null,
            wardNo: asset.wardName ?? record?.ward ?? null,
            ...payload,
          };
          result = await updateAssetLeaseRentDetailsAction(targetRecordId, updatePayload);
        } else {
          result = await createLeaseRentRegistrationAction(payload);
          leaseRentDetailsId = extractLeaseRentDetailsId(result);
        }

        if (result.success) {
          if (leaseRentDetailsId > 0) {
            const uploadsOk = await uploadStagedDocuments(leaseRentDetailsId);
            if (!uploadsOk) {
              toastError('Registration saved, but one or more documents failed to upload.');
            }
          }
          toastSuccess('Registration submitted successfully!');
          setTimeout(() => onClose(), 1500);
        } else {
          toastError(result.message || 'Submission failed.');
        }
      } catch (error) {
        console.error('Lease registration submit failed:', error);
        toastError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
      }
    });
  };

  const loadDocumentFile = useCallback(
    async (documentItem: AssetDocumentListItem) => {
      revokeLoadedFile();
      setIsLoadingFile(true);
      setFileError(null);

      try {
        const file = await readDocumentFile(documentItem);
        setLoadedFile(file);
      } catch (error) {
        setFileError(error instanceof Error ? error.message : 'Unable to load this file.');
      } finally {
        setIsLoadingFile(false);
      }
    },
    [readDocumentFile, revokeLoadedFile]
  );

  const openDocument = useCallback(
    (documentItem: AssetDocumentListItem) => {
      setSelectedDocument(documentItem);
      void loadDocumentFile(documentItem);
    },
    [loadDocumentFile]
  );

  const closePreview = useCallback(() => {
    setSelectedDocument(null);
    setFileError(null);
    setIsLoadingFile(false);
    revokeLoadedFile();
  }, [revokeLoadedFile]);

  const downloadDocument = useCallback(() => {
    if (!selectedDocument) return;

    if (!loadedFile) {
      void loadDocumentFile(selectedDocument);
      return;
    }

    const link = document.createElement('a');
    link.href = loadedFile.objectUrl;
    link.download = loadedFile.fileName || selectedDocument.fileName || selectedDocument.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [loadDocumentFile, loadedFile, selectedDocument]);

  const handleDocumentSelect = useCallback(
    (type: LeaseDocumentType, file: File | null) => {
      if (!file) return;

      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
      const isAllowed = allowedExtensions.includes(fileExtension || '') || file.type === 'application/pdf' || file.type.startsWith('image/');

      if (!isAllowed) {
        toastError(t('drawers.invalidFileType') || 'Invalid file type. Only PDF and image files (PNG, JPG, JPEG) are allowed.');
        if (type === 'aadhar' && aadharInputRef.current) {
          aadharInputRef.current.value = '';
        } else if (type === 'pan' && panInputRef.current) {
          panInputRef.current.value = '';
        }
        return;
      }

      setStagedDocuments((prev) => ({
        ...prev,
        [type]: {
          file,
          replacingDocId: localDocuments.find((doc) => (doc.name || '').toLowerCase() === type.toLowerCase())?.id,
        },
      }));
    },
    [localDocuments, toastError, t]
  );

  const triggerDocumentPicker = useCallback((type: LeaseDocumentType) => {
    if (type === 'aadhar') {
      aadharInputRef.current?.click();
      return;
    }
    panInputRef.current?.click();
  }, []);

  const stagedLabel = (type: LeaseDocumentType) =>
    stagedDocuments[type]?.file?.name ||
    t('drawers.noFileSelected');

  const renderUploadCard = (type: LeaseDocumentType, label: string) => (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
          <div className="mt-1 text-[10px] text-slate-400">{stagedLabel(type)}</div>
        </div>
        <Button type="button" variant="secondary" size="sm" icon={UploadCloud} onClick={() => triggerDocumentPicker(type)}>
          {t('drawers.chooseFile')}
        </Button>
      </div>
      <input
        ref={type === 'aadhar' ? aadharInputRef : panInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => handleDocumentSelect(type, e.target.files?.[0] ?? null)}
      />
    </div>
  );

  const drawerTitle = (
    <div className="flex items-center gap-2">
      <FileText className="w-5 h-5 text-blue-600" />
      <h2 className="font-bold text-sm tracking-wide text-slate-800">{t('tabs.registration')}</h2>
    </div>
  );

  const drawerFooter = (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-3">
        <Button onClick={onClose} variant="secondary" size="sm" icon={X} disabled={isPending}>
          {t('drawers.cancel')}
        </Button>
        <Button
          variant="success"
          size="sm"
          icon={isPending ? Loader2 : UploadCloud}
          onClick={handleUpdateRegistration}
          disabled={isPending}
          className={isPending ? 'opacity-70 cursor-not-allowed' : ''}
        >
          {isPending ? t('drawers.processing') : isRevertedRecord ? t('drawers.sendToVerification') : record ? t('drawers.form.submitNew') : t('drawers.form.submitRegistration')}
        </Button>
      </div>
    </div>
  );

  const assetNumber = asset.assetNo ?? '-';
  const buildingAssetName = asset.assetName ?? '-';
  const assetCategory = asset.assetCategoryName ?? '-';
  const shopName = record?.shopName ?? '-';
  const overviewColumns: Column<OverviewTableRow>[] = [
    { key: 'zoneNo', label: t('drawers.cols.zoneNo'), align: 'center', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'wardNo', label: t('drawers.cols.wardNo'), align: 'center', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'unitName', label: t('drawers.cols.unitName'), align: 'center', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'shopNumber', label: t('drawers.cols.unitNumber'), align: 'center', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'shopActNumber', label: t('drawers.cols.unitActNumber'), align: 'center', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
  ];
  const overviewData: OverviewTableRow[] = [
    {
      zoneNo: toDisplay(asset.zoneName),
      wardNo: toDisplay(asset.wardName),
      unitName: record?.shopName ?? '-',
      shopNumber: record?.shopNo ?? '-',
      shopActNumber: asset.assetTypeId != null ? String(asset.assetTypeId) : '-',
    },
  ];
  const constructionColumns: Column<ConstructionTableRow>[] = [
    { key: 'shopArea', label: t('drawers.cols.unitArea'), align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'renterName', label: t('tables.cols.tenantName'), align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'monthlyRent', label: t('tables.cols.rentAmount'), align: 'center', cellClassName: 'whitespace-nowrap text-red-600 font-semibold' },
    { key: 'bharaniKaalavadi', label: t('tables.cols.duration'), align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'status', label: t('tables.cols.status'), align: 'center', cellClassName: 'whitespace-nowrap' },
  ];
  const constructionData: ConstructionTableRow[] = [
    {
      shopNo: record?.shopNo ?? '-',
      shopArea: record?.totalAreaSqFt != null ? Number(record.totalAreaSqFt).toFixed(2) : '-',
      renterName: record?.tenantName ?? '-',
      monthlyRent: record?.monthlyRent != null ? `₹ ${toCurrencyDisplay(record.monthlyRent)}` : '-',
      bharaniKaalavadi: record?.leaseDurationDisplay ?? '-',
      status: record?.workflowStatus ?? '-',
    },
  ];
  const monthlyRentNum = Number(String(formState.revisedRent || formState.monthlyRent || formState.previousRent || '0').replace(/,/g, ''));
  const expectedAnnualRentVal = monthlyRentNum ? monthlyRentNum * 12 : undefined;

  const summaryRows = [
    { label: t('rentSummary.currentRent'), value: toCurrencyDisplay(formState.previousRent || formState.monthlyRent) },
    { label: t('rentSummary.revisedRent'), value: toCurrencyDisplay(formState.revisedRent) },
    { label: t('rentSummary.totalMonthlyRent'), value: toCurrencyDisplay(formState.revisedRent || formState.monthlyRent || formState.previousRent) },
    { label: t('rentSummary.expectedAnnualRent'), value: toCurrencyDisplay(expectedAnnualRentVal) },
  ];
  const documentCards = useMemo(() => {
    const seen = new Set<string>();

    return localDocuments
      .filter((doc) => {
        const name = (doc.name || '').toLowerCase();
        return name === 'aadhar' || name === 'pan';
      })
      .filter((doc) => {
        const key = `${(doc.name || '').toLowerCase()}|${(doc.fileName || '').toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((doc) => ({
        ...doc,
        label: getFileTitle(doc),
        isImage: isImage(doc.contentType || '', doc.fileName || doc.name || ''),
      }));
  }, [localDocuments]);

  const mediaCards = useMemo(() => {
    return assetPhotosAndPlans.map((doc) => ({
      ...doc,
      label: getFileTitle(doc),
      isImage: isImage(doc.contentType || '', doc.fileName || doc.name || ''),
    }));
  }, [assetPhotosAndPlans]);

  const getMediaSearchText = (doc: AssetDocumentListItem) =>
    `${doc.name || ''} ${doc.fileName || ''} ${(doc as any).documentTitle || ''} ${(doc as any).bindingPurpose || ''}`.toLowerCase();

  const leftMediaPanels = [
    {
      title: t('drawers.assetPhoto'),
      doc:
        mediaCards.find((doc) => {
          const name = getMediaSearchText(doc);
          return (
            (name.includes('asset image') ||
              name.includes('asset photo') ||
              name.includes('on spot') ||
              name.includes('photo')) &&
            !name.includes('plan')
          );
        }) ?? null,
      fallbackIcon: Building2,
      fallbackText: t('drawers.assetPhoto'),
    },
    {
      title: t('drawers.opPlan'),
      doc: mediaCards.find((doc) => {
        const name = getMediaSearchText(doc);
        return name.includes('op plan') || (name.includes('plan') && !name.includes('dp plan') && !name.includes('asset photo plan'));
      }) ?? null,
      fallbackIcon: Grid,
      fallbackText: t('drawers.opPlan'),
    },
    {
      title: t('drawers.dpPlan'),
      doc: mediaCards.find((doc) => {
        const name = getMediaSearchText(doc);
        return name.includes('dp plan') || name.includes('asset photo plan') || name.includes('digital plan');
      }) ?? null,
      fallbackIcon: MapPinned,
      fallbackText: t('drawers.dpPlan'),
    },
  ] as const;

  const activePanels = leftMediaPanels.filter((panel) => {
    if (panel.title === t('drawers.opPlan') && panel.doc === null) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const imageDocuments = [...documentCards, ...mediaCards].filter((doc) => doc.isImage);
    if (imageDocuments.length === 0) {
      void Promise.resolve().then(() => setThumbnailUrls({}));
      return;
    }

    let cancelled = false;

    const loadThumbnails = async () => {
      const entries = await Promise.all(
        imageDocuments.map(async (doc) => {
          try {
            const src = await readDocumentThumbnailSrc(doc);
            return [String(doc.id), src] as const;
          } catch {
            return null;
          }
        })
      );

      if (cancelled) {
        return;
      }

      const nextThumbs: Record<string, string> = {};
      entries.forEach((entry) => {
        if (!entry) return;
        nextThumbs[entry[0]] = entry[1];
      });
      setThumbnailUrls(nextThumbs);
    };

    void loadThumbnails();

    return () => {
      cancelled = true;
    };
  }, [documentCards, mediaCards, readDocumentThumbnailSrc]);

  return (
    <Drawer open={true} onClose={onClose} title={drawerTitle} width="xl" footer={drawerFooter}>
      <div className="p-5 bg-slate-50 min-h-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-4 mb-4">
          <div className="bg-white border border-slate-200 rounded-lg p-3 relative mt-3 shadow-sm">
            <span className="absolute -top-3 left-4 bg-[#0a869e] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
              {t('drawers.assetInformation')}
            </span>
            <div className="grid grid-cols-[120px_1fr] gap-x-2 gap-y-2 mt-1">
              <span className="text-[10px] text-slate-500 font-bold">{t('drawers.assetName')}</span>
              <span className="text-xs font-bold text-red-600">{buildingAssetName || '-'}</span>
              <span className="text-[10px] text-slate-500 font-bold border-t border-slate-100 pt-2">{t('drawers.address')}</span>
              <span className="text-xs font-bold text-slate-700 border-t border-slate-100 pt-2">{asset.address ?? '-'}</span>
            </div>
          </div>

          <DetailChip label={t('drawers.assetNo')} value={assetNumber} />
          <div className="bg-white border border-slate-200 rounded-lg p-3 relative mt-3 shadow-sm flex flex-col items-center justify-center gap-3">
            <span className="absolute -top-3 bg-[#0a869e] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
              {t('drawers.workflowStatus')}
            </span>
            <span className="text-sm font-black text-amber-600 mt-2">
              {record?.workflowStatus ?? '-'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-6">
          <div className="overflow-x-auto">
            <MasterTable
              columns={overviewColumns}
              data={overviewData}
              containerClassName="border border-slate-200 rounded-lg shadow-sm"
              tableClassName="min-w-max text-[10px] table-auto"
              theadClassName="bg-slate-50"
              pageSize={1}
              totalCount={1}
              totalPages={1}
              pageNumber={1}
              paginationConfig={{ enabled: false }}
              maxBodyHeightClassName="max-h-none"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 font-bold">{t('drawers.assetCategory')}</span>
            <span className="text-sm font-bold text-red-600 mb-3">{assetCategory}</span>
            <span className="text-[10px] text-slate-500 font-bold">{t('drawers.unitName')}</span>
            <span className="text-sm font-bold text-red-600">{shopName || '-'}</span>
          </div>
        </div>

        <div className="mb-4 overflow-hidden rounded-lg">
          <div className="bg-teal-600 text-white text-[10px] font-bold py-1.5 text-center">
            {t('drawers.unitDetails')}
          </div>
          <MasterTable
            columns={constructionColumns}
            data={constructionData}
            containerClassName="border border-slate-200 rounded-b-lg shadow-sm border-t-0"
            tableClassName="text-[10px]"
            theadClassName="bg-slate-50"
            pageSize={1}
            totalCount={1}
            totalPages={1}
            pageNumber={1}
            paginationConfig={{ enabled: false }}
            maxBodyHeightClassName="max-h-none"
          />
        </div>

          <div className={`grid grid-cols-1 items-stretch gap-4 mb-4 ${activePanels.length > 0 ? 'lg:grid-cols-[240px_1fr_300px]' : 'lg:grid-cols-[1fr_300px]'}`}>
            {activePanels.length > 0 && (
              <div className="flex h-full flex-col justify-center gap-6 self-stretch">
                {activePanels.map((panel) => {
                  const doc = panel.doc;
                  const thumbUrl = doc ? thumbnailUrls[String(doc.id)] : null;

                  return (
                    <button
                      key={panel.title}
                      type="button"
                      onClick={() => {
                        if (doc) openDocument(doc);
                      }}
                      className="group relative w-full aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/0 to-slate-900/15" />
                      <span className="absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#0a869e] px-3 py-0.5 text-[10px] font-bold leading-none text-white shadow-sm text-center whitespace-nowrap">
                        {panel.title}
                      </span>

                      {doc && thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={panel.title}
                          className="absolute inset-0 h-full w-full object-contain bg-slate-50 p-2"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                          <div className="flex flex-col items-center gap-1 text-center">
                            <panel.fallbackIcon className="h-8 w-8 text-slate-300" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                              {panel.fallbackText}
                            </span>
                            <span className="text-[9px] text-slate-400">{t('drawers.noPreview')}</span>
                          </div>
                        </div>
                      )}

                      {doc ? (
                        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-900/65 to-transparent px-2 pb-2 pt-6">
                          <div className="text-[9px] font-semibold text-white/90">{doc.label}</div>
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="flex bg-slate-500 text-white">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === tab ? 'bg-slate-600 shadow-inner' : 'hover:bg-slate-500/80 opacity-70'
                    }`}
                >
                  {tab === 'new' ? t('drawers.allTenantInfo') : t('drawers.previousTenants', { count: historyItems.length })}
                </button>
              ))}
            </div>

            <div className="p-4 grid grid-cols-2 gap-3 flex-1 overflow-y-auto max-h-[480px]">
              {activeTab === 'new' ? (
                <>
                  {template.fields.map((field) => (
                    <RenderField
                      key={field.key as string}
                      field={field}
                      value={field.key === 'applicationType' ? (selectedType?.applicationTypeName || '') : formState[field.key]}
                      disabled={field.key === 'applicationType' && isRevertedRecord}
                      setValue={(value) => {
                        if (field.key === 'applicationType') {
                          if (isRevertedRecord) return;
                          const found = applicationTypes.find((t) => t.applicationTypeName === value);
                          if (found) {
                            setSelectedTypeId(found.id);
                          }
                          return;
                        }
                        handleFormFieldChange(field.key, value);
                      }}
                    />
                  ))}

                  {null}
                </>
              ) : (
                <div className="col-span-2 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                  {historyItems.length > 0 ? (
                    historyItems.map((item, index) => (
                      <div key={item.id || index} className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-800">{item.tenantName}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {item.performedDate ? new Date(item.performedDate).toLocaleDateString('en-IN') : '-'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-semibold">
                          Mobile: {item.tenantMobile || '-'} | Type: {item.leaseType || '-'}
                        </div>
                        {item.leaseStartDate && (
                          <div className="text-[11px] text-slate-500 font-medium">
                            Duration: {new Date(item.leaseStartDate).toLocaleDateString('en-IN')} - {item.leaseEndDate ? new Date(item.leaseEndDate).toLocaleDateString('en-IN') : 'Present'}
                          </div>
                        )}
                        <div className="text-[11px] text-slate-600 font-semibold">
                          Rent: ₹ {item.monthlyRent ? item.monthlyRent.toLocaleString('en-IN') : '-'}
                        </div>
                        {item.remarks && (
                          <div className="text-[10px] text-slate-500 italic mt-1 border-t border-slate-100 pt-1">
                            Remarks: &quot;{item.remarks}&quot;
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2 py-8 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                      <Users className="w-10 h-10 opacity-30" />
                      <span className="text-xs font-semibold">
                        {t('drawers.noPreviousTenants')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {activeTab === 'new' ? (
              <div className="border-t border-slate-200 bg-slate-50 p-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {renderUploadCard('aadhar', t('drawers.form.uploadAadhaar'))}
                  {renderUploadCard('pan', t('drawers.form.uploadPan'))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="bg-white border border-teal-600 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-teal-600 text-white text-[10px] font-bold py-1.5 text-center">
                {t('rentSummary.title')}
              </div>
              <table className="w-full text-[9px] font-semibold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 text-center">
                    <th className="px-2 py-1.5 border-r border-slate-200">{t('rentSummary.colDetail')}</th>
                    <th className="px-2 py-1.5">{t('rentSummary.colAmount')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-center">
                  {summaryRows.map((row, i) => (
                    <tr key={i}>
                      <td className="px-2 py-1.5 border-r border-slate-200 text-left">{row.label}</td>
                      <td className="px-2 py-1.5">{toDisplay(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isRevertedRecord ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  {t('drawers.remarksForRevert')}
                </div>
                <div className="mt-1 text-[11px] font-semibold text-slate-700">
                  {record?.reason ?? record?.rejectionReason ?? '-'}
                </div>
              </div>
            ) : null}

          </div>
        </div>

        <div className="text-center relative pt-4 pb-2">
          <span className="bg-teal-600 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-sm">
            {t('drawers.uploadedDocs')}
          </span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 -z-10"></div>
        </div>

        {documentCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            {documentCards.map((doc, idx) => (
              <button
                key={`${doc.id}-${idx}`}
                type="button"
                onClick={() => openDocument(doc)}
                className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm text-left transition hover:border-blue-200 hover:bg-blue-50/30"
              >
                <div className="mb-2 flex h-24 items-center justify-center rounded-md bg-slate-50 border border-slate-100 overflow-hidden">
                  {doc.isImage && thumbnailUrls[String(doc.id)] ? (
                    <img
                      src={thumbnailUrls[String(doc.id)]}
                      alt={doc.label}
                      className="h-full w-full object-cover"
                    />
                  ) : doc.isImage ? (
                    <ImageIcon className="h-8 w-8 text-slate-300" />
                  ) : (
                    <FileText className="h-8 w-8 text-slate-300" />
                  )}
                </div>
                <div className="text-center text-[10px] font-bold text-slate-700">{doc.label}</div>
                <div className="mt-1 text-center text-[9px] font-bold text-emerald-600">{t('drawers.viewDoc')}</div>
                {doc.uploadedDate ? (
                  <div className="mt-1 text-center text-[8px] text-slate-400">{toDateDisplay(doc.uploadedDate)}</div>
                ) : null}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            {t('drawers.noDocsApi')}
          </div>
        )}
      </div>

      <DocumentPreviewDrawer
        selectedDocument={selectedDocument}
        loadedFile={loadedFile}
        isLoadingFile={isLoadingFile}
        fileError={fileError}
        onClose={closePreview}
        onDownload={downloadDocument}
      />
    </Drawer>
  );
}
