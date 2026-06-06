'use client';
/* eslint-disable i18next/no-literal-string */

import { useTransition, useMemo, useState, useEffect } from 'react';
import {
  Building2,
  Calendar,
  FileText,
  Grid,
  Info,
  IndianRupee,
  MapPin,
  Phone,
  UploadCloud,
  User,
  X,
  Mail,
  MapPinned,
  BadgeCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button, Drawer, Label, MasterTable, type Column } from '@/components/common';
import type { LeaseRentRecord } from './lease-rent.types';
import type { AssetDocumentListItem } from '@/types/municipal-asset/detail-tabs.types';
import type { ApplicationTypeItem } from '@/app/[locale]/assets/revenue/manage-renters/actions';
import { createLeaseRentRegistrationAction } from '@/app/[locale]/assets/revenue/manage-renters/actions';

export interface AssetMasterDetails extends Record<string, unknown> {
  id?: number;
  assetNo?: string;
  assetName?: string;
  assetCategoryName?: string;
  assetTypeName?: string;
  zoneName?: string;
  wardName?: string;
  address?: string;
  status?: string;
  createdDate?: string;
  updatedDate?: string | null;
  updatedBy?: number | null;
}

type FormState = {
  // Common
  applicationType: string;
  tenantName: string;
  mobileNumber: string;
  emailAddress: string;
  tenantType: string;
  aadhaarNumber: string;
  panNumber: string;
  pinCode: string;
  residentialAddress: string;
  // Lease details
  shopNo: string;
  shopName: string;
  leaseType: string;
  leaseStartDate: string;
  leaseEndDate: string;
  monthlyRent: string;
  securityDeposit: string;
  paymentFrequency: string;
  // Renewal
  existingTenantName: string;
  oldLeaseStartDate: string;
  oldLeaseEndDate: string;
  renewalStartDate: string;
  renewalEndDate: string;
  previousRent: string;
  revisedRent: string;
  reasonForRenewal: string;
  // Transfer
  newTenantDetails: string;
  newTenantMobile: string;
  relationship: string;
  nocFromExistingTenant: string;
  reasonForTransfer: string;
  // Termination
  vacatingDate: string;
  reasonForTermination: string;
  pendingDues: string;
  securityDepositRefund: string;
  finalInspectionReport: string;
  // General
  remarksDescription: string;
};

interface ModalProps {
  asset: AssetMasterDetails;
  record?: LeaseRentRecord | null;
  documents?: AssetDocumentListItem[];
  applicationTypes?: ApplicationTypeItem[];
  onClose: () => void;
}

type FieldDef = {
  key: keyof FormState;
  label: string;
  icon: typeof User;
  type: 'text' | 'date' | 'select' | 'textarea' | 'number';
  placeholder?: string;
  options?: string[];
  colSpan?: 1 | 2;
  required?: boolean;
};

type TemplateDef = {
  title: string;
  submitLabel: string;
  submitIcon: typeof UploadCloud;
  fields: FieldDef[];
  secondaryButtons?: Array<{ label: string; icon: typeof UploadCloud; variant: 'primary' | 'secondary' | 'success' | 'delete' | 'danger' }>;
};

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
      { key: 'shopNo', label: 'Shop No.', icon: Building2, type: 'text', placeholder: 'e.g. SH-001' },
      { key: 'shopName', label: 'Shop Name', icon: Building2, type: 'text', placeholder: 'Shop / Unit name' },
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

function PlaceholderCard({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: typeof Building2 }) {
  return (
    <div className="relative h-32 rounded border border-slate-200 overflow-hidden bg-slate-100 shadow-sm flex items-center justify-center">
      <span className="absolute top-1 left-1/2 -translate-x-1/2 bg-[#0a869e]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
        <Icon className="w-3 h-3" /> {title}
      </span>
      <div className="flex flex-col items-center justify-center text-center px-3">
        <Icon className="h-7 w-7 text-slate-400" />
        <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{subtitle}</div>
      </div>
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
  const wrapperClassName = `space-y-1 ${field.colSpan === 2 ? 'col-span-2' : ''}`;
  const sharedInputClass = 'w-full h-8 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100';

  return (
    <div className={wrapperClassName}>
      <Label required={field.required} className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
        <Icon className="w-3 h-3 text-slate-400" /> {field.label}
        {field.required && <span className="text-red-500">*</span>}
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
  partitionNo: string;
  shopNumber: string;
  shopEstablishmentDate: string;
  surveyNumber: string;
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

export function NewLeaseRegistrationModal({ asset, record, documents = [], applicationTypes = [], onClose }: ModalProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'previous'>('new');
  const [selectedTypeId, setSelectedTypeId] = useState<number>(() =>
    getInitialApplicationTypeId(applicationTypes, record)
  );
  const [isPending, startTransition] = useTransition();
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const tabs: Array<'new' | 'previous'> = ['new', 'previous'];

  const selectedType = useMemo(() => {
    return applicationTypes.find((t) => t.id === selectedTypeId) || applicationTypes[0];
  }, [selectedTypeId, applicationTypes]);

  const template = useMemo(() => buildTemplate(selectedTypeId, applicationTypes), [selectedTypeId, applicationTypes]);
  const initialFormState = useMemo(
    () => buildInitialFormState(selectedType?.applicationTypeName || '', asset, record),
    [selectedType, asset, record]
  );
  const [formState, setFormState] = useState<FormState>(initialFormState);

  useEffect(() => {
    setFormState(initialFormState);
  }, [initialFormState]);

  // Auto-clear submit result after 5 seconds
  useEffect(() => {
    if (!submitResult) return;
    const t = setTimeout(() => setSubmitResult(null), 5000);
    return () => clearTimeout(t);
  }, [submitResult]);

  const handleSendToVerification = () => {
    const assetId = asset.id;
    if (!assetId) {
      setSubmitResult({ success: false, message: 'Asset ID is missing. Cannot submit.' });
      return;
    }
    const typeCode = selectedType?.applicationTypeCode || 'APP-NEW';
    const payload = buildSubmitData(formState, assetId, selectedTypeId, typeCode);

    startTransition(async () => {
      try {
        const result = await createLeaseRentRegistrationAction(payload);
        setSubmitResult({
          success: result.success,
          message: result.success
            ? `Registration submitted successfully! ID: ${result.items?.id ?? ''}`
            : result.message || 'Submission failed. Please try again.',
        });
        if (result.success) {
          // Close drawer after a short delay on success
          setTimeout(() => onClose(), 1500);
        }
      } catch {
        setSubmitResult({ success: false, message: 'An unexpected error occurred. Please try again.' });
      }
    });
  };

  const drawerTitle = (
    <div className="flex items-center gap-2">
      <FileText className="w-5 h-5 text-blue-600" />
      <h2 className="font-bold text-sm tracking-wide text-slate-800">Asset Details — New Registration</h2>
    </div>
  );

  const drawerFooter = (
    <div className="flex flex-col gap-2 w-full">
      {/* Result feedback banner */}
      {submitResult && (
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold w-full ${
            submitResult.success
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {submitResult.success ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {submitResult.message}
        </div>
      )}

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
          <Info className="w-4 h-4" />
          <span className="text-xs font-semibold">Live database data</span>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={onClose} variant="secondary" size="sm" icon={X} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="success"
            size="sm"
            icon={isPending ? Loader2 : UploadCloud}
            onClick={handleSendToVerification}
            disabled={isPending}
            className={isPending ? 'opacity-70 cursor-not-allowed' : ''}
          >
            {isPending ? 'Submitting...' : 'Send to Verification'}
          </Button>
        </div>
      </div>
    </div>
  );

  const assetNumber = pickFirst(asset.assetNo, asset.id);
  const assetCategory = pickFirst(asset.assetCategoryName, asset.assetName);
  const shopName = pickFirst(asset.assetName, asset.assetTypeName);
  const zoneWard = `${toDisplay(asset.zoneName)} - ${toDisplay(asset.wardName)}`;
  const overviewColumns: Column<OverviewTableRow>[] = [
    { key: 'zoneWardNo', label: 'Zone - Ward No', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'propertyNo', label: 'Property No', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'partitionNo', label: 'Partition No', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'shopNumber', label: 'Shop Number', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'shopEstablishmentDate', label: 'Shop Establishment Date', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'surveyNumber', label: 'Survey Number', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'gatNumber', label: 'Gat Number', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'shopActRegistrationDate', label: 'Shop Act Registration Date', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'shopActNumber', label: 'Shop Act Number', align: 'center', cellClassName: 'whitespace-nowrap' },
  ];
  const overviewData: OverviewTableRow[] = [
    {
      zoneWardNo: zoneWard,
      propertyNo: pickFirst(asset.assetNo, record?.assetId),
      partitionNo: pickFirst(asset.parentAssetName),
      shopNumber: pickFirst(record?.shopNo, asset.assetTypeName),
      shopEstablishmentDate: toDateDisplay(asset.createdDate),
      surveyNumber: pickFirst(asset.csn),
      gatNumber: pickFirst(asset.floorDetailsId),
      shopActRegistrationDate: toDateDisplay(asset.updatedDate),
      shopActNumber: pickFirst(asset.assetTypeId),
    },
  ];
  const constructionColumns: Column<ConstructionTableRow>[] = [
    { key: 'floor', label: 'Floor', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'shopNo', label: 'Shop No.', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'shopArea', label: 'Shop Area (sq.mt)', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'renterName', label: 'Renter Name', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'uses', label: 'Uses', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'monthlyRent', label: 'Monthly Rent (₹)', align: 'center', cellClassName: 'whitespace-nowrap text-red-600 font-semibold' },
    { key: 'perSqMtRent', label: 'Per Sq.Mt. Rent', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'bharaniKaalavadi', label: 'भरणी कालावधी', align: 'center', cellClassName: 'whitespace-nowrap' },
    { key: 'status', label: 'Status', align: 'center', cellClassName: 'whitespace-nowrap' },
  ];
  const constructionData: ConstructionTableRow[] = [
    {
      floor: pickFirst(asset.floorDetailsId, 'Ground Floor'),
      shopNo: pickFirst(record?.shopNo),
      shopArea: pickFirst(asset.builtUpAreaSqMeter, asset.carpetAreaSqMeter, asset.landAreaSqMeter),
      renterName: pickFirst(record?.tenantName, asset.inChargeName, asset.assetName),
      uses: pickFirst(asset.typeOfUseName, asset.subTypeOfUseName, asset.assetCondition),
      monthlyRent: formState.monthlyRent || formState.revisedRent ? `₹ ${toCurrencyDisplay(formState.monthlyRent || formState.revisedRent)}` : '-',
      perSqMtRent: toCurrencyDisplay(pickFirst(asset.marketValue, asset.currentAssetValue)),
      bharaniKaalavadi: pickFirst(asset.createdDate),
      status: pickFirst(asset.status),
    },
  ];
  const summaryRows = [
    { label: 'सद्यस्थितीतील मासिक भाडे उत्पन्न', value: toCurrencyDisplay(formState.previousRent || formState.monthlyRent) },
    { label: 'मुदत संपल्यानंतरही वाढीव भाडे', value: toCurrencyDisplay(formState.revisedRent) },
    { label: 'एकूण मासिक भाडे उत्पन्न', value: toCurrencyDisplay(formState.revisedRent || formState.monthlyRent || formState.previousRent) },
    { label: 'वार्षिक भाडे उत्पन्न (अपेक्षित)', value: toCurrencyDisplay(asset.marketValue ?? asset.currentAssetValue ?? formState.revisedRent ?? formState.monthlyRent) },
  ];
  const documentCards = useMemo(() => {
    const visible = documents.slice(0, 5);
    const fallbackLabels = ['Complex Photo', 'Asset Image', 'Aadhaar/PAN', 'Completion Certificate', 'Occupancy Certificate'];
    return fallbackLabels.map((label, index) => {
      const doc = visible[index];
      return {
        label: doc?.name || doc?.fileName || label,
        uploaded: Boolean(doc),
        uploadedDate: doc?.uploadedDate || null,
      };
    });
  }, [documents]);

  return (
    <Drawer open={true} onClose={onClose} title={drawerTitle} width="xl" footer={drawerFooter}>
      <div className="p-5 bg-slate-50 min-h-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-4 mb-4">
          <div className="bg-white border border-slate-200 rounded-lg p-3 relative mt-3 shadow-sm">
            <span className="absolute -top-3 left-4 bg-[#0a869e] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
              ASSET INFORMATION
            </span>
            <div className="grid grid-cols-[120px_1fr] gap-x-2 gap-y-2 mt-1">
              <span className="text-[10px] text-slate-500 font-bold">Complex Name</span>
              <span className="text-xs font-bold text-red-600">{assetCategory || '-'}</span>
              <span className="text-[10px] text-slate-500 font-bold border-t border-slate-100 pt-2">Address</span>
              <span className="text-xs font-bold text-slate-700 border-t border-slate-100 pt-2">{pickFirst(asset.address)}</span>
            </div>
          </div>

          <DetailChip label="ASSET NUMBER" value={assetNumber} />
          <DetailChip label="STATUS" value={asset.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-6">
          <MasterTable
            columns={overviewColumns}
            data={overviewData}
            containerClassName="border border-slate-200 rounded-lg shadow-sm"
            tableClassName="text-[10px]"
            theadClassName="bg-slate-50"
            pageSize={1}
            totalCount={1}
            totalPages={1}
            pageNumber={1}
            paginationConfig={{ enabled: false }}
            maxBodyHeightClassName="max-h-none"
          />

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 font-bold">Asset Category</span>
            <span className="text-sm font-bold text-red-600 mb-3">{pickFirst(asset.assetCategoryName, asset.assetName)}</span>
            <span className="text-[10px] text-slate-500 font-bold">Shop Name</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_300px] gap-4 mb-4">
          <div className="space-y-2">
            <PlaceholderCard title="Building Photo" subtitle={pickFirst(asset.assetName)} icon={Building2} />
            <PlaceholderCard title="OP Plan" subtitle={pickFirst(asset.zoneName)} icon={Grid} />
            <PlaceholderCard title="DP Plan" subtitle={pickFirst(asset.wardName)} icon={MapPinned} />
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="flex bg-slate-500 text-white">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    activeTab === tab ? 'bg-slate-600 shadow-inner' : 'hover:bg-slate-500/80 opacity-70'
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
                        >
                          {button.label}
                        </Button>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="col-span-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Existing Tenant</div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">{pickFirst(record?.tenantName, asset.inChargeName, asset.assetName)}</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Asset Number</div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">{assetNumber}</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Zone / Ward</div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">{zoneWard}</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Address</div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">{pickFirst(asset.address)}</div>
                  </div>
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

            <div className="bg-white border border-teal-600 rounded-lg shadow-sm relative h-32 flex items-center justify-center overflow-hidden p-1">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[9px] font-bold px-4 py-0.5 rounded-b shadow-sm flex items-center gap-1 z-10">
                <Grid className="w-3 h-3" /> Property Floor Plan
              </span>
              <div className="text-center px-3">
                <Grid className="mx-auto h-10 w-10 text-slate-300" />
                <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {asset.floorDetailsId ? `Floor Details #${asset.floorDetailsId}` : 'No floor plan available'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center relative pt-4 pb-2">
          <span className="bg-teal-600 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-sm">
            Uploaded Documents
          </span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 -z-10"></div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {documentCards.map((doc, index) => (
            <div key={index} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-2 flex h-24 items-center justify-center rounded-md bg-slate-50 border border-slate-100">
                <FileText className="h-8 w-8 text-slate-300" />
              </div>
              <div className="text-center text-[10px] font-bold text-slate-700">{doc.label}</div>
              <div className={`mt-1 text-center text-[9px] font-bold ${doc.uploaded ? 'text-emerald-600' : 'text-slate-400'}`}>
                {doc.uploaded ? 'View Document' : 'Not uploaded'}
              </div>
              {doc.uploadedDate ? (
                <div className="mt-1 text-center text-[8px] text-slate-400">{toDateDisplay(doc.uploadedDate)}</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}
