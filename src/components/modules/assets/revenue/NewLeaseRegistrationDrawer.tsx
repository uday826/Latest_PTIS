'use client';
/* eslint-disable i18next/no-literal-string */
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useTransition, useMemo, useState } from 'react';
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
import { fetchAssetDocumentFile } from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';
import { uploadAssetDocumentAction } from '@/app/[locale]/assets/actions';
import { deleteUploadedDocAction } from '@/app/[locale]/assets/municipal-Asset/add-New-Asset/actions';
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
import { updateAssetLeaseRentDetailsAction, createLeaseRentRegistrationAction, getPreviousTenantHistoryAction } from '@/app/[locale]/assets/revenue/manage-renters/registration-actions';
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

function toDateDisplay(value: unknown): string {
  if (typeof value !== 'string' || !value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN');
}

function pickFirst(...values: unknown[]): string {
  for (const value of values) {
    if (!isBlank(value)) return toDisplay(value);
  }
  return '-';
}

function getFileTitle(documentItem: AssetDocumentListItem): string {
  return documentItem.name || documentItem.fileName || 'Document';
}

function getInitialApplicationTypeId(
  applicationTypes: ApplicationTypeItem[],
  record?: LeaseRentRecord | null
): number {
  if (!applicationTypes || applicationTypes.length === 0) return 1;
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
  return {
    applicationType: applicationTypeLabel,
    tenantName: pickFirst(record?.tenantName, asset.inChargeName, asset.assetName) === '-' ? '' : pickFirst(record?.tenantName, asset.inChargeName, asset.assetName),
    mobileNumber: pickFirst(asset.inChargeMobile, '') === '-' ? '' : pickFirst(asset.inChargeMobile, ''),
    emailAddress: pickFirst(asset.inChargeEmail, '') === '-' ? '' : pickFirst(asset.inChargeEmail, ''),
    tenantType: 'Individual',
    aadhaarNumber: '',
    panNumber: '',
    pinCode: pickFirst(asset.pinCode, '') === '-' ? '' : pickFirst(asset.pinCode, ''),
    residentialAddress: pickFirst(asset.address, '') === '-' ? '' : pickFirst(asset.address, ''),
    shopNo: pickFirst(record?.shopNo, '') === '-' ? '' : pickFirst(record?.shopNo, ''),
    shopName: pickFirst(asset.assetName, '') === '-' ? '' : pickFirst(asset.assetName, ''),
    leaseType: 'Rent',
    leaseStartDate: '',
    leaseEndDate: '',
    monthlyRent: pickFirst(record?.rentAmount, '') === '-' ? '' : pickFirst(record?.rentAmount, '').replace(/,/g, ''),
    securityDeposit: '0',
    paymentFrequency: 'Monthly',
    existingTenantName: pickFirst(record?.tenantName, asset.assetName, asset.assetCategoryName) === '-' ? '' : pickFirst(record?.tenantName, asset.assetName, asset.assetCategoryName),
    oldLeaseStartDate: toDateInputValue(record?.submittedDate ?? asset.createdDate ?? ''),
    oldLeaseEndDate: toDateInputValue(asset.updatedDate ?? ''),
    renewalStartDate: '',
    renewalEndDate: '',
    previousRent: pickFirst(record?.rentAmount, '') === '-' ? '' : pickFirst(record?.rentAmount, '').replace(/,/g, ''),
    revisedRent: '',
    reasonForRenewal: '',
    newTenantDetails: '',
    newTenantMobile: '',
    relationship: 'Spouse',
    nocFromExistingTenant: 'Yes',
    reasonForTransfer: '',
    vacatingDate: toDateInputValue(asset.updatedDate ?? ''),
    reasonForTermination: 'Non-payment',
    pendingDues: '',
    securityDepositRefund: '0',
    finalInspectionReport: 'Yes',
    remarksDescription: '',
  };
}

function buildTemplate(
  applicationTypeId: number,
  applicationTypes: ApplicationTypeItem[]
): TemplateDef {
  const currentType = applicationTypes.find((t) => t.id === applicationTypeId);
  const typeCode = currentType?.applicationTypeCode || 'APP-NEW';
  const typeOptions = applicationTypes.map((o) => o.applicationTypeName);

  const renewal: TemplateDef = {
    title: 'RENEWAL APPLICATION',
    submitLabel: 'Send to Verification',
    submitIcon: UploadCloud,
    fields: [
      { key: 'applicationType', label: 'Application Type', icon: FileText, type: 'select', colSpan: 2, options: typeOptions },
      { key: 'existingTenantName', label: 'Existing Tenant Name', icon: User, type: 'text', placeholder: 'Existing tenant name', required: true },
      { key: 'mobileNumber', label: 'Mobile Number', icon: Phone, type: 'text', placeholder: 'Mobile Number' },
      { key: 'oldLeaseStartDate', label: 'Old Lease Start Date', icon: Calendar, type: 'date' },
      { key: 'oldLeaseEndDate', label: 'Old Lease End Date', icon: Calendar, type: 'date' },
      { key: 'renewalStartDate', label: 'Renewal Start Date', icon: Calendar, type: 'date', required: true },
      { key: 'renewalEndDate', label: 'Renewal End Date', icon: Calendar, type: 'date' },
      { key: 'previousRent', label: 'Previous Monthly Rent (₹)', icon: IndianRupee, type: 'number', placeholder: 'Previous rent amount' },
      { key: 'revisedRent', label: 'Revised Monthly Rent (₹)', icon: IndianRupee, type: 'number', placeholder: 'New rent amount', required: true },
      { key: 'paymentFrequency', label: 'Payment Frequency', icon: Calendar, type: 'select', options: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'] },
      { key: 'securityDeposit', label: 'Security Deposit (₹)', icon: IndianRupee, type: 'number', placeholder: '0' },
      { key: 'leaseType', label: 'Lease/Rent Type', icon: FileText, type: 'select', options: ['Rent', 'Lease'] },
      { key: 'reasonForRenewal', label: 'Reason for Renewal', icon: FileText, type: 'textarea', placeholder: 'Enter reason for renewal', colSpan: 2 },
    ],
  };

  const transfer: TemplateDef = {
    title: 'TRANSFER APPLICATION',
    submitLabel: 'Send to Verification',
    submitIcon: UploadCloud,
    fields: [
      { key: 'applicationType', label: 'Application Type', icon: FileText, type: 'select', colSpan: 2, options: typeOptions },
      { key: 'existingTenantName', label: 'Existing Tenant Name', icon: User, type: 'text', placeholder: 'Current tenant name', required: true },
      { key: 'mobileNumber', label: 'Existing Tenant Mobile', icon: Phone, type: 'text', placeholder: 'Mobile Number' },
      { key: 'newTenantDetails', label: 'New Tenant Name', icon: User, type: 'text', placeholder: 'New tenant name', required: true },
      { key: 'newTenantMobile', label: 'New Tenant Mobile', icon: Phone, type: 'text', placeholder: 'Mobile Number' },
      { key: 'relationship', label: 'Relationship', icon: BadgeCheck, type: 'select', options: ['Spouse', 'Son', 'Daughter', 'Other'] },
      { key: 'nocFromExistingTenant', label: 'NOC From Existing Tenant', icon: BadgeCheck, type: 'select', options: ['Yes', 'No'] },
      { key: 'reasonForTransfer', label: 'Reason for Transfer', icon: FileText, type: 'textarea', placeholder: 'Enter reason for transfer', colSpan: 2, required: true },
    ],
    secondaryButtons: [
      { label: 'LEGAL HEIR CERTIFICATE', icon: UploadCloud, variant: 'success' },
    ],
  };

  const termination: TemplateDef = {
    title: 'TERMINATION APPLICATION',
    submitLabel: 'Send to Verification',
    submitIcon: UploadCloud,
    fields: [
      { key: 'applicationType', label: 'Application Type', icon: FileText, type: 'select', colSpan: 2, options: typeOptions },
      { key: 'tenantName', label: 'Tenant Name', icon: User, type: 'text', placeholder: 'Tenant name', required: true },
      { key: 'mobileNumber', label: 'Mobile Number', icon: Phone, type: 'text', placeholder: 'Mobile Number' },
      { key: 'vacatingDate', label: 'Vacating / Termination Date', icon: Calendar, type: 'date', required: true },
      { key: 'reasonForTermination', label: 'Reason for Termination', icon: FileText, type: 'select', options: ['Non-payment', 'Vacated', 'Policy', 'Other'] },
      { key: 'pendingDues', label: 'Pending Dues (₹)', icon: IndianRupee, type: 'number', placeholder: 'Amount' },
      { key: 'securityDepositRefund', label: 'Security Deposit Refund (₹)', icon: IndianRupee, type: 'number', placeholder: '0' },
      { key: 'finalInspectionReport', label: 'Final Inspection Report', icon: FileText, type: 'select', options: ['Yes', 'No'] },
      { key: 'remarksDescription', label: 'Additional Remarks', icon: FileText, type: 'textarea', placeholder: 'Any additional notes...', colSpan: 2 },
    ],
  };

  const modification: TemplateDef = {
    title: 'MODIFICATION APPLICATION',
    submitLabel: 'Send to Verification',
    submitIcon: UploadCloud,
    fields: [
      { key: 'applicationType', label: 'Application Type', icon: FileText, type: 'select', colSpan: 2, options: typeOptions },
      { key: 'tenantName', label: 'Tenant Name', icon: User, type: 'text', placeholder: 'Tenant Name', required: true },
      { key: 'mobileNumber', label: 'Mobile Number', icon: Phone, type: 'text', placeholder: 'Mobile Number' },
      { key: 'leaseType', label: 'Lease/Rent Type', icon: FileText, type: 'select', options: ['Rent', 'Lease'] },
      { key: 'previousRent', label: 'Previous Monthly Rent (₹)', icon: IndianRupee, type: 'number', placeholder: 'Previous amount' },
      { key: 'revisedRent', label: 'Revised Monthly Rent (₹)', icon: IndianRupee, type: 'number', placeholder: 'Revised amount', required: true },
      { key: 'paymentFrequency', label: 'Payment Frequency', icon: Calendar, type: 'select', options: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'] },
      { key: 'leaseStartDate', label: 'Modified Lease Start Date', icon: Calendar, type: 'date' },
      { key: 'leaseEndDate', label: 'Modified Lease End Date', icon: Calendar, type: 'date' },
      { key: 'remarksDescription', label: 'Remarks / Description', icon: FileText, type: 'textarea', placeholder: 'Describe the modifications being made...', colSpan: 2 },
    ],
  };

  const newApp: TemplateDef = {
    title: 'NEW TENANT REGISTRATION',
    submitLabel: 'Send to Verification',
    submitIcon: UploadCloud,
    fields: [
      { key: 'applicationType', label: 'Application Type', icon: FileText, type: 'select', colSpan: 2, options: typeOptions },
      { key: 'shopNo', label: 'Unit No.', icon: Building2, type: 'text', placeholder: 'e.g. UT-001' },
      { key: 'shopName', label: 'Unit Name', icon: Building2, type: 'text', placeholder: 'Unit name' },
      { key: 'tenantName', label: 'Tenant Name', icon: User, type: 'text', placeholder: 'Full name', required: true },
      { key: 'mobileNumber', label: 'Mobile Number', icon: Phone, type: 'text', placeholder: '10-digit mobile', required: true },
      { key: 'emailAddress', label: 'Email Address', icon: Mail, type: 'text', placeholder: 'email@example.com' },
      { key: 'tenantType', label: 'Tenant Type', icon: BadgeCheck, type: 'select', options: ['Individual', 'Business', 'Government', 'Trust'] },
      { key: 'aadhaarNumber', label: 'Aadhaar Number', icon: FileText, type: 'text', placeholder: '12-digit Aadhaar' },
      { key: 'panNumber', label: 'PAN Number', icon: FileText, type: 'text', placeholder: 'PAN card number' },
      { key: 'leaseType', label: 'Lease / Rent Type', icon: FileText, type: 'select', options: ['Rent', 'Lease'], required: true },
      { key: 'leaseStartDate', label: 'Lease Start Date', icon: Calendar, type: 'date', required: true },
      { key: 'leaseEndDate', label: 'Lease End Date', icon: Calendar, type: 'date' },
      { key: 'monthlyRent', label: 'Monthly Rent (₹)', icon: IndianRupee, type: 'number', placeholder: '0.00', required: true },
      { key: 'securityDeposit', label: 'Security Deposit (₹)', icon: IndianRupee, type: 'number', placeholder: '0.00' },
      { key: 'paymentFrequency', label: 'Payment Frequency', icon: Calendar, type: 'select', options: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'] },
      { key: 'pinCode', label: 'Pin Code', icon: MapPinned, type: 'text', placeholder: '6-digit pin code' },
      { key: 'residentialAddress', label: 'Residential Address', icon: MapPin, type: 'textarea', placeholder: 'Full address', colSpan: 2 },
      { key: 'remarksDescription', label: 'Remarks / Reason', icon: FileText, type: 'textarea', placeholder: 'Purpose of lease / any notes...', colSpan: 2 },
    ],
    secondaryButtons: [
      { label: 'Upload Aadhaar', icon: UploadCloud, variant: 'primary' },
      { label: 'Upload PAN', icon: UploadCloud, variant: 'success' },
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
}: {
  field: FieldDef;
  value: string;
  setValue: (value: string) => void;
}) {
  const Icon = field.icon;
  const isReadOnlyField = field.key === 'shopNo' || field.key === 'shopName';
  const wrapperClassName = `space-y-1 ${field.colSpan === 2 ? 'col-span-2' : ''}`;
  const sharedInputClass = `w-full h-8 px-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 ${isReadOnlyField ? 'bg-slate-50 cursor-not-allowed text-slate-500' : 'bg-white'
    }`;

  return (
    <div className={wrapperClassName}>
      <Label required={field.required} className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
        <Icon className="w-3 h-3 text-slate-400" /> {field.label}
      </Label>
      {field.type === 'select' ? (
        <select className={sharedInputClass} value={value} onChange={(e) => setValue(e.target.value)}>
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
          onChange={(e) => setValue(e.target.value)}
          min={field.type === 'number' ? 0 : undefined}
          step={field.type === 'number' ? 'any' : undefined}
        />
      )}
    </div>
  );
}

interface OverviewTableRow extends Record<string, unknown> {
  zoneWardNo: string;
  propertyNo: string;
  unitName: string;
  shopNumber: string;
  shopEstablishmentDate: string;
  gatNumber: string;
  shopActRegistrationDate: string;
  shopActNumber: string;
}

interface ConstructionTableRow extends Record<string, unknown> {
  floor: string;
  shopNo: string;
  shopArea: string;
  renterName: string;
  uses: string;
  monthlyRent: string;
  perSqMtRent: string;
  bharaniKaalavadi: string;
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
  const [activeTab, setActiveTab] = useState<'new' | 'previous'>('new');
  const [localDocuments, setLocalDocuments] = useState<AssetDocumentListItem[]>(() => documents);
  useEffect(() => {
    setLocalDocuments(documents);
  }, [documents]);
  const [selectedTypeId, setSelectedTypeId] = useState<number>(() =>
    getInitialApplicationTypeId(applicationTypes, record)
  );
  const [isPending, startTransition] = useTransition();
  const { success: toastSuccess, error: toastError } = useToast();
  const [historyItems, setHistoryItems] = useState<PreviousTenantHistoryItem[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<AssetDocumentListItem | null>(null);
  const [loadedFile, setLoadedFile] = useState<LoadedDocumentFile | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({});

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

  const template = useMemo(() => buildTemplate(selectedTypeId, applicationTypes), [selectedTypeId, applicationTypes]);
  const initialFormState = useMemo(
    () => buildInitialFormState(selectedType?.applicationTypeName || '', asset, record),
    [selectedType, asset, record]
  );
  const [formState, setFormState] = useState<FormState>(() => initialFormState);

  const readDocumentFile = useCallback(async (documentItem: AssetDocumentListItem) => {
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

  const readDocumentThumbnailSrc = useCallback(async (documentItem: AssetDocumentListItem) => {
    const result = await fetchAssetDocumentFile(documentItem.id);
    if (result.error || !result.base64) {
      throw new Error(result.error || 'Unable to load this file.');
    }

    const contentType = result.contentType || documentItem.contentType || 'application/octet-stream';
    return `data:${contentType};base64,${result.base64}`;
  }, []);

  const triggerFileUpload = (type: 'aadhar' | 'pan') => {
    const existingDoc = localDocuments.find(
      (doc) => (doc.name || '').toLowerCase() === type.toLowerCase()
    );

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const assetIdVal = asset.id ?? record?.assetMasterId;
      if (!assetIdVal) {
        toastError('Asset ID is missing.');
        return;
      }

      const fd = new FormData();
      fd.append('File', file);
      fd.append('AssetId', String(assetIdVal));
      fd.append('ModuleId', '0'); // resolved dynamically on the server
      fd.append('DocumentType', type);
      fd.append('DocumentTitle', type);

      startTransition(async () => {
        try {
          if (existingDoc) {
            const delRes = await deleteUploadedDocAction(Number(existingDoc.id));
            if (!delRes.success) {
              toastError(delRes.error || `Failed to remove existing ${type === 'aadhar' ? 'Aadhaar' : 'PAN'} document.`);
              return;
            }
          }

          const res = await uploadAssetDocumentAction(fd);
          if (res.success && res.data) {
            toastSuccess(`${type === 'aadhar' ? 'Aadhaar' : 'PAN'} document replaced successfully.`);
            const newDoc: AssetDocumentListItem = {
              id: res.data.assetDocumentId,
              assetId: res.data.assetId,
              name: type, // Matches documentTitle/documentType value 'aadhar' or 'pan'
              fileName: res.data.fileName || file.name,
              contentType: file.type,
              uploadedDate: new Date().toISOString(),
              fileSize: res.data.fileSizeBytes,
              status: 'Uploaded',
            };
            setLocalDocuments((prev) => {
              const filtered = prev.filter((d) => String(d.id) !== String(existingDoc?.id));
              return [...filtered, newDoc];
            });
          } else {
            toastError(res.error || 'Failed to upload document.');
          }
        } catch (err: any) {
          toastError(err?.message || 'Error uploading document.');
        }
      });
    };
    input.click();
  };

  const handleUpdateRegistration = () => {
    const assetId = record?.assetMasterId ?? asset.id;
    const recordId = Number(record?.id);

    if (!assetId) {
      toastError('Asset ID is missing.');
      return;
    }

    const hasField = (key: string) => template.fields.some((f) => f.key === key);

    // Validate Mobile Number (10 digits)
    const mobileReg = /^[0-9]{10}$/;
    if (hasField('mobileNumber') && formState.mobileNumber && !mobileReg.test(formState.mobileNumber)) {
      toastError('Mobile number must be a valid 10-digit number.');
      return;
    }
    if (hasField('newTenantMobile') && formState.newTenantMobile && !mobileReg.test(formState.newTenantMobile)) {
      toastError('New tenant mobile number must be a valid 10-digit number.');
      return;
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

    // Validate Aadhaar Number (12 digits)
    const aadhaarReg = /^[0-9]{12}$/;
    if (hasField('aadhaarNumber') && formState.aadhaarNumber && !aadhaarReg.test(formState.aadhaarNumber)) {
      toastError('Aadhaar number must be a valid 12-digit number.');
      return;
    }

    // Validate dates: leaseStartDate <= leaseEndDate
    if (hasField('leaseStartDate') && hasField('leaseEndDate') && formState.leaseStartDate && formState.leaseEndDate) {
      const start = new Date(formState.leaseStartDate);
      const end = new Date(formState.leaseEndDate);
      if (start > end) {
        toastError('Lease start date cannot be later than the lease end date.');
        return;
      }
    }

    // Validate renewal dates: renewalStartDate <= renewalEndDate
    if (hasField('renewalStartDate') && hasField('renewalEndDate') && formState.renewalStartDate && formState.renewalEndDate) {
      const start = new Date(formState.renewalStartDate);
      const end = new Date(formState.renewalEndDate);
      if (start > end) {
        toastError('Renewal start date cannot be later than the renewal end date.');
        return;
      }
    }

    // Validate old lease dates: oldLeaseStartDate <= oldLeaseEndDate
    if (hasField('oldLeaseStartDate') && hasField('oldLeaseEndDate') && formState.oldLeaseStartDate && formState.oldLeaseEndDate) {
      const start = new Date(formState.oldLeaseStartDate);
      const end = new Date(formState.oldLeaseEndDate);
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

    const typeCode = selectedType?.applicationTypeCode || 'APP-NEW';
    const payload = buildSubmitData(formState, assetId, selectedTypeId, typeCode);

    startTransition(async () => {
      try {
        let result;
        if (recordId && Number.isFinite(recordId)) {
          const updatePayload: AssetLeaseRentDetailsUpdatePayload = {
            id: recordId,
            parentAssetId: asset.id ?? record?.assetMasterId ?? undefined,
            assetNo: asset.assetNo ?? record?.assetNo ?? null,
            assetName: asset.assetName ?? record?.shopName ?? null,
            category: record?.assetCategory ?? record?.category ?? asset.assetCategoryName ?? null,
            zone: asset.zoneName ?? record?.zone ?? null,
            wardNo: asset.wardName ?? record?.ward ?? null,
            ...payload,
          };
          result = await updateAssetLeaseRentDetailsAction(recordId, updatePayload);
        } else {
          result = await createLeaseRentRegistrationAction(payload);
        }

        if (result.success) {
          toastSuccess(result.message || 'Registration submitted successfully!');
          setTimeout(() => onClose(), 1500);
        } else {
          toastError(result.message || 'Submission failed.');
        }
      } catch {
        toastError('An unexpected error occurred. Please try again.');
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

  const drawerTitle = (
    <div className="flex items-center gap-2">
      <FileText className="w-5 h-5 text-blue-600" />
      <h2 className="font-bold text-sm tracking-wide text-slate-800">
        Asset Details — New Registration
      </h2>
    </div>
  );

  const drawerFooter = (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-3">
        <Button onClick={onClose} variant="secondary" size="sm" icon={X} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="success"
          size="sm"
          icon={isPending ? Loader2 : UploadCloud}
          onClick={handleUpdateRegistration}
          disabled={isPending}
          className={isPending ? 'opacity-70 cursor-not-allowed' : ''}
        >
          {isPending ? 'Submitting...' : record ? 'New Registration' : 'Submit Registration'}
        </Button>
      </div>
    </div>
  );

  const assetNumber = pickFirst(asset.assetNo, asset.id);
  const buildingAssetName = pickFirst(record?.shopName, asset.assetName, asset.assetTypeName);
  const assetCategory = pickFirst(record?.assetCategory, record?.category, asset.assetCategoryName, asset.assetName);
  const shopName = pickFirst(record?.shopName, asset.assetName, asset.assetTypeName);
  const zoneWard = `${toDisplay(asset.zoneName)} - ${toDisplay(asset.wardName)}`;
  const overviewColumns: Column<OverviewTableRow>[] = [
    { key: 'zoneWardNo', label: 'Zone - Ward No', align: 'center', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'propertyNo', label: 'Asset No', align: 'center', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'unitName', label: 'Unit Name', align: 'center', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'shopNumber', label: 'Unit Number', align: 'center', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'shopEstablishmentDate', label: 'Shop Establishment Date', align: 'center', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'gatNumber', label: 'Asset Category', align: 'center', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'shopActRegistrationDate', label: 'Unit Act Registration Date', align: 'center', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
    { key: 'shopActNumber', label: 'Unit Act Number', align: 'center', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
  ];
  const overviewData: OverviewTableRow[] = [
    {
      zoneWardNo: zoneWard,
      propertyNo: pickFirst(asset.assetNo, record?.assetId),
      unitName: buildingAssetName,
      shopNumber: pickFirst(record?.shopNo, asset.assetTypeName),
      shopEstablishmentDate: toDateDisplay(asset.createdDate),
      gatNumber: assetCategory,
      shopActRegistrationDate: toDateDisplay(asset.updatedDate),
      shopActNumber: pickFirst(asset.assetTypeId),
    },
  ];
  const constructionColumns: Column<ConstructionTableRow>[] = [
    { key: 'floor', label: 'Floor', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'shopNo', label: 'Unit No.', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'shopArea', label: 'Unit Area (sq.mt)', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'renterName', label: 'Renter Name', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'uses', label: 'Uses', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'monthlyRent', label: 'Monthly Rent (₹)', align: 'center', cellClassName: 'whitespace-nowrap text-red-600 font-semibold' },
    { key: 'perSqMtRent', label: 'Per Sq.Mt. Rent', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'bharaniKaalavadi', label: 'Payment Period', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'status', label: 'Status', align: 'center', cellClassName: 'whitespace-nowrap' },
  ];
  const constructionData: ConstructionTableRow[] = [
    {
      floor: pickFirst(record?.floorDescription, record?.floor),
      shopNo: pickFirst(record?.shopNo, record?.assetNo, asset.assetTypeName),
      shopArea: record?.totalAreaSqFt != null ? String(record.totalAreaSqFt) : (pickFirst(asset?.builtUpAreaSqMeter, asset?.carpetAreaSqMeter, asset?.landAreaSqMeter) !== '-' ? String(pickFirst(asset?.builtUpAreaSqMeter, asset?.carpetAreaSqMeter, asset?.landAreaSqMeter)) : '-'),
      renterName: pickFirst(record?.tenantName, asset.inChargeName, asset.assetName),
      uses: pickFirst(record?.leaseRentType, record?.leaseType, asset.typeOfUseName, asset.subTypeOfUseName),
      monthlyRent:
        record?.rentAmountDisplay ||
        (record?.rentAmount != null ? `₹ ${toCurrencyDisplay(record.rentAmount)}` : '-'),
      perSqMtRent:
        record?.totalAreaSqFt && record?.rentAmount
          ? `₹ ${(Number(record.rentAmount) / Number(record.totalAreaSqFt)).toLocaleString('en-IN', {
            maximumFractionDigits: 2,
          })}`
          : '-',
      bharaniKaalavadi: pickFirst(record?.leaseDurationDisplay, record?.submittedDate, asset.createdDate),
      status: pickFirst(record?.workflowStatus, record?.rentStatus, asset.status, 'Draft'),
    },
  ];
  const summaryRows = [
    { label: 'सद्यस्थितीतील मासिक भाडे उत्पन्न', value: toCurrencyDisplay(formState.previousRent || formState.monthlyRent) },
    { label: 'मुदत संपल्यानंतरही वाढीव भाडे', value: toCurrencyDisplay(formState.revisedRent) },
    { label: 'एकूण मासिक भाडे उत्पन्न', value: toCurrencyDisplay(formState.revisedRent || formState.monthlyRent || formState.previousRent) },
    { label: 'वार्षिक भाडे उत्पन्न (अपेक्षित)', value: toCurrencyDisplay(asset.marketValue ?? asset.currentAssetValue ?? formState.revisedRent ?? formState.monthlyRent) },
  ];
  const documentCards = useMemo(() => {
    return localDocuments.slice(0, 5).map((doc) => ({
      ...doc,
      label: getFileTitle(doc),
      isImage: isImage(doc.contentType || '', doc.fileName || doc.name || ''),
    }));
  }, [localDocuments]);

  const mediaCards = useMemo(() => {
    return assetPhotosAndPlans.slice(0, 3).map((doc) => ({
      ...doc,
      label: getFileTitle(doc),
      isImage: isImage(doc.contentType || '', doc.fileName || doc.name || ''),
    }));
  }, [assetPhotosAndPlans]);

  const leftMediaPanels = [
    {
      title: 'Building Photo',
      doc: mediaCards[0] ?? null,
      fallbackIcon: Building2,
      fallbackText: pickFirst(asset.assetName, 'Building Photo'),
    },
    {
      title: 'OP Plan',
      doc: mediaCards[1] ?? null,
      fallbackIcon: Grid,
      fallbackText: pickFirst(asset.zoneName, 'OP Plan'),
    },
    {
      title: 'DP Plan',
      doc: mediaCards[2] ?? null,
      fallbackIcon: MapPinned,
      fallbackText: pickFirst(asset.wardName, 'DP Plan'),
    },
  ] as const;

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
              ASSET INFORMATION
            </span>
            <div className="grid grid-cols-[120px_1fr] gap-x-2 gap-y-2 mt-1">
              <span className="text-[10px] text-slate-500 font-bold">Asset Name</span>
              <span className="text-xs font-bold text-red-600">{buildingAssetName || '-'}</span>
              <span className="text-[10px] text-slate-500 font-bold border-t border-slate-100 pt-2">Address</span>
              <span className="text-xs font-bold text-slate-700 border-t border-slate-100 pt-2">{pickFirst(asset.address)}</span>
            </div>
          </div>

          <DetailChip label="ASSET NUMBER" value={assetNumber} />
          <div className="bg-white border border-slate-200 rounded-lg p-3 relative mt-3 shadow-sm flex flex-col items-center justify-center gap-3">
            <span className="absolute -top-3 bg-[#0a869e] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
              STATUS
            </span>
            <span className="text-sm font-black text-amber-600 mt-2">
              {pickFirst(record?.workflowStatus, record?.rentStatus, asset.status, 'Draft')}
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
            <span className="text-[10px] text-slate-500 font-bold">Asset Category</span>
            <span className="text-sm font-bold text-red-600 mb-3">{assetCategory}</span>
            <span className="text-[10px] text-slate-500 font-bold">Unit Name</span>
            <span className="text-sm font-bold text-red-600">{shopName || '-'}</span>
          </div>
        </div>

        <div className="mb-4 overflow-hidden rounded-lg">
          <div className="bg-teal-600 text-white text-[10px] font-bold py-1.5 text-center">
            Construction Details
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

        <div className="grid grid-cols-1 items-stretch lg:grid-cols-[240px_1fr_300px] gap-4 mb-4">
          <div className="flex h-full flex-col gap-3 self-stretch">
            {leftMediaPanels.map((panel) => {
              const doc = panel.doc;
              const thumbUrl = doc ? thumbnailUrls[String(doc.id)] : null;

              return (
                <button
                  key={panel.title}
                  type="button"
                  onClick={() => {
                    if (doc) openDocument(doc);
                  }}
                  className="group relative min-h-[150px] flex-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/0 to-slate-900/15" />
                  <span className="absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#0a869e] px-3 py-0.5 text-[10px] font-bold leading-none text-white shadow-sm">
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
                        <span className="text-[9px] text-slate-400">No preview available</span>
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

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="flex bg-slate-500 text-white">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === tab ? 'bg-slate-600 shadow-inner' : 'hover:bg-slate-500/80 opacity-70'
                    }`}
                >
                  {tab === 'new' ? 'New Tenant Registration' : 'Previous Tenant Information'}
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
                      setValue={(value) => {
                        if (field.key === 'applicationType') {
                          const found = applicationTypes.find((t) => t.applicationTypeName === value);
                          if (found) {
                            setSelectedTypeId(found.id);
                          }
                          return;
                        }
                        setFormState((prev) => ({
                          ...prev,
                          [field.key]: value,
                        }) as FormState);
                      }}
                    />
                  ))}

                  {template.secondaryButtons?.length ? (
                    <div className="col-span-2 flex flex-wrap gap-2">
                      {template.secondaryButtons.map((button) => (
                        <Button
                          key={button.label}
                          variant={button.variant}
                          size="sm"
                          icon={button.icon}
                          className="flex-1 min-w-[160px]"
                          disabled={isPending}
                          onClick={() => {
                            if (button.label.toLowerCase().includes('aadhaar')) {
                              triggerFileUpload('aadhar');
                            } else if (button.label.toLowerCase().includes('pan')) {
                              triggerFileUpload('pan');
                            }
                          }}
                        >
                          {button.label}
                        </Button>
                      ))}
                    </div>
                  ) : null}
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
                        {record?.tenantName || 'No previous tenants found'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white border border-teal-600 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-teal-600 text-white text-[10px] font-bold py-1.5 text-center">
                भाडे उत्पन्न सारांश तक्ता
              </div>
              <table className="w-full text-[9px] font-semibold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 text-center">
                    <th className="px-2 py-1.5 border-r border-slate-200">तपशील</th>
                    <th className="px-2 py-1.5">रक्कम (₹)</th>
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

          </div>
        </div>

        <div className="text-center relative pt-4 pb-2">
          <span className="bg-teal-600 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-sm">
            Uploaded Documents
          </span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 -z-10"></div>
        </div>

        {documentCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            {documentCards.map((doc) => (
              <button
                key={String(doc.id)}
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
                <div className="mt-1 text-center text-[9px] font-bold text-emerald-600">View Document</div>
                {doc.uploadedDate ? (
                  <div className="mt-1 text-center text-[8px] text-slate-400">{toDateDisplay(doc.uploadedDate)}</div>
                ) : null}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No uploaded documents returned from the API.
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
