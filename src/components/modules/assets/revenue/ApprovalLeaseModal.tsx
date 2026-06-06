'use client';
/* eslint-disable i18next/no-literal-string */

import { useTransition, useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  FileCheck2,
  FileText,
  Grid,
  Image as ImageIcon,
  MapPin,
  ShieldAlert,
  ShieldX,
  User,
  Users,
  X,
  FolderOpen,
} from 'lucide-react';
import { Button, Drawer, MasterTable, type Column } from '@/components/common';
import type { LeaseRentRegistrationListItem } from '@/lib/api/asset/leaseRentRegistration.service';
import {
  approveLeaseRentRegistrationAction,
  getManageRentersAssetDetailsAction,
  revertToVerificationAction,
} from '@/app/[locale]/assets/revenue/manage-renters/actions';

interface ModalProps {
  record: LeaseRentRegistrationListItem;
  onClose: () => void;
}

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

function InfoCard({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 relative mt-3 shadow-sm flex flex-col items-center justify-center">
      <span className="absolute -top-3 bg-[#0a869e] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
        {label}
      </span>
      <span className="text-sm font-black text-slate-800 mt-2">{toDisplay(value)}</span>
    </div>
  );
}

function MediaUnavailable({ label, icon: Icon }: { label: string; icon: typeof ImageIcon }) {
  return (
    <div className="relative h-28 rounded border border-dashed border-slate-300 overflow-hidden bg-slate-50 shadow-sm flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center px-3 gap-1">
        <Icon className="h-6 w-6 text-slate-300" />
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
        <div className="text-[9px] text-slate-300">Not available</div>
      </div>
    </div>
  );
}

export function ApprovalLeaseModal({ record, onClose }: ModalProps) {
  const [isPending, startTransition] = useTransition();
  const [asset, setAsset] = useState<any>(null);

  const registration = record;

  useEffect(() => {
    if (registration.assetId) {
      getManageRentersAssetDetailsAction(registration.assetId).then((astData) => {
        if (astData) setAsset(astData);
      });
    }
  }, [registration.assetId]);

  const handleApprove = () => {
    startTransition(async () => {
      try {
        const idNum = Number(record.id);
        const res = await approveLeaseRentRegistrationAction(idNum);
        if (res.success) {
          toast.success(res.message || 'Approved successfully');
          onClose();
        } else {
          toast.error(res.message || 'Failed to approve');
        }
      } catch (err) {
        toast.error('An error occurred during approval');
      }
    });
  };

  const handleRevertToVerification = () => {
    const confirm = window.confirm('Are you sure you want to revert this request to verification?');
    if (!confirm) return;

    startTransition(async () => {
      try {
        const idNum = Number(record.id);
        const res = await revertToVerificationAction(idNum);
        if (res.success) {
          toast.success(res.message || 'Reverted to verification successfully');
          onClose();
        } else {
          toast.error(res.message || 'Failed to revert');
        }
      } catch (err) {
        toast.error('An error occurred during revert');
      }
    });
  };

  const currentTenantFields = registration
    ? [
        { l: 'Sr. No:', v: toDisplay(registration.id), l2: 'Duration:', v2: pickFirst(registration.paymentFrequency, registration.leaseType) },
        { l: 'Application Type:', v: pickFirst(registration.applicationType, registration.leaseType), l2: 'Lease Period:', v2: `${toDateDisplay(registration.leaseStartDate)} - ${toDateDisplay(registration.leaseEndDate)}` },
        { l: 'Tenant Name:', v: pickFirst(registration.tenantName, registration.previousTenantName, registration.shopName), vClass: 'font-bold text-slate-900', l2: 'Rent (₹):', v2: `₹ ${toCurrencyDisplay(pickFirst(registration.monthlyRent, registration.previousMonthlyRent, registration.yearlyRent))}`, v2Class: 'font-bold text-red-600' },
        { l: 'Mobile:', v: pickFirst(registration.tenantMobile, registration.previousTenantMobile), l2: 'Deposit (₹):', v2: `₹ ${toCurrencyDisplay(registration.securityDeposit)}` },
        { l: 'Tenant Type:', v: pickFirst(registration.tenantType, registration.rentStatus), l2: 'Payment Frequency:', v2: pickFirst(registration.paymentFrequency) },
        { l: 'Email:', v: pickFirst(registration.tenantEmail), l2: 'Aadhaar No:', v2: pickFirst(registration.tenantAadhaarNo) },
        { l: 'PAN Card No:', v: pickFirst(registration.tenantPanCardNo), l2: 'Status (Active):', v2: toDisplay(registration.isActive) },
      ]
    : [];

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

  const assetNumber = pickFirst(asset?.assetNo, registration?.assetNo, record.assetId, asset?.id);
  const assetCategory = pickFirst(asset?.assetCategoryName, registration?.category);
  const shopNameVal = pickFirst(registration?.shopName, asset?.assetName, asset?.assetTypeName);
  const zoneWard = `${pickFirst(asset?.zoneName, registration?.zone)} - ${pickFirst(asset?.wardName, registration?.wardNo)}`;

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
      propertyNo: pickFirst(asset?.assetNo, registration?.assetNo, record.assetId),
      partitionNo: pickFirst(asset?.parentAssetName, registration?.floor),
      shopNumber: pickFirst(registration?.shopNo, asset?.assetTypeName),
      shopEstablishmentDate: toDateDisplay(asset?.createdDate || registration?.createdDate),
      surveyNumber: pickFirst(asset?.csn),
      gatNumber: pickFirst(asset?.floorDetailsId),
      shopActRegistrationDate: toDateDisplay(asset?.updatedDate || registration?.updatedDate),
      shopActNumber: pickFirst(asset?.assetTypeId),
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
      floor: pickFirst(asset?.floorDetailsId, registration?.floor, 'Ground Floor'),
      shopNo: pickFirst(registration?.shopNo),
      shopArea: pickFirst(asset?.builtUpAreaSqMeter, asset?.carpetAreaSqMeter, asset?.landAreaSqMeter),
      renterName: pickFirst(registration?.tenantName, asset?.inChargeName, asset?.assetName),
      uses: pickFirst(asset?.typeOfUseName, asset?.subTypeOfUseName, asset?.assetCondition),
      monthlyRent: registration?.monthlyRent ? `₹ ${toCurrencyDisplay(registration.monthlyRent)}` : '-',
      perSqMtRent: pickFirst(asset?.marketValue, asset?.currentAssetValue),
      bharaniKaalavadi: pickFirst(asset?.createdDate || registration?.createdDate),
      status: pickFirst(asset?.status, registration?.isActive ? 'Active' : 'Inactive'),
    },
  ];

  const monthlyRent = registration ? pickFirst(registration.monthlyRent, registration.previousMonthlyRent) : '-';
  const yearlyRent = registration ? pickFirst(registration.yearlyRent) : '-';

  const rentSummaryRows = [
    { l: 'सद्यस्थितीतील मासिक भाडे उत्पन्न', v: registration?.monthlyRent != null ? `₹ ${toCurrencyDisplay(registration.monthlyRent)}` : '-' },
    { l: 'मागील मासिक भाडे', v: registration?.previousMonthlyRent != null ? `₹ ${toCurrencyDisplay(registration.previousMonthlyRent)}` : '-' },
    { l: 'एकूण मासिक भाडे उत्पन्न', v: monthlyRent !== '-' ? `₹ ${toCurrencyDisplay(monthlyRent)}` : '-' },
    { l: 'वार्षिक भाडे उत्पन्न (अपेक्षित)', v: yearlyRent !== '-' ? `₹ ${toCurrencyDisplay(yearlyRent)}` : '-' },
  ];

  const drawerTitle = (
    <div className="flex items-center gap-2">
      <FileText className="w-5 h-5 text-blue-600" />
      <h2 className="font-bold text-sm tracking-wide text-slate-800">
        Approval — {registration ? pickFirst(registration.applicationType, registration.leaseType, 'Lease Application') : 'Lease Application'}
      </h2>
    </div>
  );

  const drawerFooter = (
    <>
      <Button onClick={onClose} variant="secondary" size="sm" icon={X} disabled={isPending}>
        Cancel
      </Button>
      <Button variant="danger" size="sm" icon={ShieldX} onClick={handleRevertToVerification} disabled={isPending}>
        Revert Request
      </Button>
      <Button variant="success" size="sm" icon={FileCheck2} onClick={handleApprove} disabled={isPending}>
        Approve
      </Button>
    </>
  );

  return (
    <Drawer open={true} onClose={onClose} title={drawerTitle} width="xl" footer={drawerFooter}>
      <div className="p-5 bg-slate-50 min-h-full">
        {/* Asset header */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-4 mb-4">
          <div className="bg-white border border-slate-200 rounded-lg p-3 relative mt-3 shadow-sm">
            <span className="absolute -top-3 left-4 bg-[#0a869e] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
              ASSET INFORMATION
            </span>
            <div className="grid grid-cols-[120px_1fr] gap-x-2 gap-y-2 mt-1">
              <span className="text-[10px] text-slate-500 font-bold">Complex Name</span>
              <span className="text-xs font-bold text-red-600">{assetCategory || '-'}</span>
              <span className="text-[10px] text-slate-500 font-bold border-t border-slate-100 pt-2">Address</span>
              <span className="text-xs font-bold text-slate-800 border-t border-slate-100 pt-2">{pickFirst(registration?.tenantAddress, asset?.address)}</span>
            </div>
          </div>
          <InfoCard label="ASSET NO" value={assetNumber} />
          <InfoCard label="REGISTRATION ID" value={record.id} />
        </div>

        {/* Overview table */}
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
            <span className="text-sm font-bold text-red-600 mb-3">{pickFirst(asset?.assetCategoryName, registration?.category)}</span>
            <span className="text-[10px] text-slate-500 font-bold">Shop Name</span>
            <span className="text-sm font-bold text-red-600">{shopNameVal || '-'}</span>
            <span className="text-[10px] text-slate-500 font-bold mt-3">Workflow Status</span>
            <span className="text-sm font-bold text-amber-600">{registration ? pickFirst(registration.workflowStatus) : '-'}</span>
          </div>
        </div>

        {/* Construction details */}
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

        {/* Tenant information */}
        {registration && (
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm relative pt-4 mb-6 mt-4">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a869e] text-white text-[9px] font-bold px-4 py-0.5 rounded shadow-sm">
              All Tenant Information
            </span>
            <div className="flex divide-x divide-slate-200 min-h-[150px]">
              {/* Previous tenant */}
              <div className="flex-1 flex flex-col">
                <div className="bg-slate-50 border-b border-slate-200 text-[#e65c00] text-[10px] font-bold py-1.5 flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Previous Tenants ({registration.previousTenantName ? 1 : 0})
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 p-6">
                  <Users className="w-10 h-10 opacity-30" />
                  <span className="text-xs font-semibold">
                    {registration.previousTenantName ?? 'No previous tenants'}
                  </span>
                  {registration.previousTenantMobile && (
                    <span className="text-[10px] text-slate-400">{registration.previousTenantMobile}</span>
                  )}
                </div>
              </div>

              {/* Current tenant */}
              <div className="flex-1 flex flex-col">
                <div className="bg-slate-50 border-b border-slate-200 text-[#008f11] text-[10px] font-bold py-1.5 flex items-center justify-center gap-1">
                  <User className="w-3.5 h-3.5" /> Current Tenant
                </div>
                <div className="p-0">
                  <table className="w-full text-[9px] font-semibold text-slate-700">
                    <tbody className="divide-y divide-slate-100">
                      {currentTenantFields.map((field, index) => (
                        <tr key={index}>
                          <td className="px-3 py-1.5 bg-slate-50/50 w-1/4">{field.l}</td>
                          <td className={`px-3 py-1.5 border-r border-slate-100 ${field.vClass || ''}`}>{field.v}</td>
                          <td className="px-3 py-1.5 bg-slate-50/50 w-1/4">{field.l2}</td>
                          <td className={`px-3 py-1.5 ${field.v2Class || ''}`}>{field.v2}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="px-3 py-1.5 bg-slate-50/50">Lease/Rent Start:</td>
                        <td className="px-3 py-1.5 border-r border-slate-100">{toDateDisplay(registration.leaseStartDate)}</td>
                        <td className="px-3 py-1.5 bg-slate-50/50">Address:</td>
                        <td className="px-3 py-1.5">{pickFirst(registration.tenantAddress)}</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-1.5 bg-slate-50/50">Lease/Rent End:</td>
                        <td className="px-3 py-1.5 border-r border-slate-100">{toDateDisplay(registration.leaseEndDate)}</td>
                        <td className="px-3 py-1.5 bg-slate-50/50">Reason:</td>
                        <td className="px-3 py-1.5">{pickFirst(registration.reason, registration.rejectionReason)}</td>
                      </tr>
                      {Boolean(registration.oldLeaseStartDate || registration.oldLeaseEndDate || registration.terminationDate) && (
                        <>
                          <tr>
                            <td className="px-3 py-1.5 bg-slate-50/50">Old Lease Start:</td>
                            <td className="px-3 py-1.5 border-r border-slate-100">{toDateDisplay(registration.oldLeaseStartDate)}</td>
                            <td className="px-3 py-1.5 bg-slate-50/50">Termination Date:</td>
                            <td className="px-3 py-1.5">{toDateDisplay(registration.terminationDate)}</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-1.5 bg-slate-50/50">Old Lease End:</td>
                            <td className="px-3 py-1.5 border-r border-slate-100">{toDateDisplay(registration.oldLeaseEndDate)}</td>
                            <td className="px-3 py-1.5 bg-slate-50/50"></td>
                            <td className="px-3 py-1.5"></td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_250px] gap-4 mb-4">
          {/* Left: media placeholders */}
          <div className="space-y-3">
            <MediaUnavailable label="Building Image" icon={ImageIcon} />
            <MediaUnavailable label="GIS Location" icon={MapPin} />
            <MediaUnavailable label="DP Plan" icon={Grid} />
          </div>

          {/* Center: uploaded documents */}
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-lg relative p-6 flex flex-col items-center justify-center bg-white shadow-sm min-h-[180px] gap-3">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a869e] text-white text-[9px] font-bold px-3 py-0.5 rounded shadow-sm flex items-center gap-1">
                <FileText className="w-3 h-3" /> Uploaded Documents
              </span>
              <FolderOpen className="w-10 h-10 text-slate-300" />
              <p className="text-xs font-semibold text-slate-400">No documents linked to this record</p>
              <p className="text-[10px] text-slate-300">Documents will appear here once uploaded via the portal</p>
            </div>

            {registration?.rejectionReason && (
              <div className="border border-red-200 rounded-lg bg-red-50 p-3 shadow-sm">
                <div className="text-[10px] font-bold text-red-600 mb-1">Rejection Reason</div>
                <p className="text-xs text-red-700">{registration.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Right: rent summary */}
          <div className="space-y-4">
            <div className="bg-white border border-[#0a869e] rounded-lg shadow-sm overflow-hidden">
              <div className="bg-[#0a869e] text-white text-[10px] font-bold py-1.5 text-center">
                भाडे उत्पन्न सारांश तक्ता
              </div>
              <table className="w-full text-[9px] font-semibold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 text-center bg-slate-50/50">
                    <th className="px-2 py-2 border-r border-slate-200">तपशील</th>
                    <th className="px-2 py-2">रक्कम (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-center">
                  {rentSummaryRows.map((row, index) => (
                    <tr key={index} className={index === 2 ? 'bg-slate-50/50' : ''}>
                      <td className="px-2 py-2.5 border-r border-slate-200 text-left">{row.l}</td>
                      <td className="px-2 py-2.5 font-bold text-slate-800">{row.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button variant="primary" size="sm" className="w-full" icon={ShieldAlert}>
              View Workflow
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
